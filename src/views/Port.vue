<template>
  <el-card class="account-container">
    <template #header>
      <div class="card-header">
        <span>UDP Client</span>
      </div>
    </template>
  
    <div class="text item">
      <span class="client-item-title">client address:</span>
      <span>{{ client.address }}</span>
    </div>

    <div class="text item">
      <span class="client-item-title">Client status:</span>
      <span>{{ client.status ? 'Online': 'Offline' }}</span>
    </div>
  </el-card>
  
  <el-card class="account-container">
    <template #header>
      <div class="card-header">
        <span>Serial Port</span>
      </div>
    </template>

    <div class="text item">
      <span class="client-item-title">Port Number:</span>
      <span>{{ portForm.port }}</span>
    </div>

    <div class="text item">
      <span class="client-item-title">Port Status:</span>
      <span>{{ portForm.status }}</span>
    </div>
  </el-card>

  <el-card class="account-container">
    <template #header>
      <div class="card-header">
        <span>DLL Version</span>
      </div>
    </template>

    <!-- <el-form :model="portForm" :rules="rules" ref="portRef" label-width="80px" label-position="right" class="demo-ruleForm">
      <el-form-item label="端口號:" prop="port">
        <el-input style="width: 200px" v-model="portForm.port"></el-input>
      </el-form-item>
      <el-form-item label="狀態:" prop="status">
        <el-input style="width: 200px" v-model="portForm.status"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitOpenPort">打開端口</el-button>
        <el-button type="danger" @click="submitClosePort">關閉端口</el-button>
      </el-form-item>
    </el-form> -->

    <el-form :model="versionForm" :rules="rules" label-width="80px" label-position="right" class="demo-ruleForm">
      <el-form-item label="版本號:" prop="version">
        <el-input style="width: 200px" v-model="versionForm.version"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitVersion">獲取版本號</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { reactive, ref, toRefs, onMounted, getCurrentInstance, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import { handleAxiosError } from '@/utils'

export default {
  name: 'Account',
  setup() {
    // const portRef = ref(null)
    const state = reactive({
      client: {
        address: '',
        status: false
      },
      portForm: {
        port: '',
        status: ''
      },
      versionForm: {
        version: ''
      },
      // rules: {
      //   port: [
      //     { required: 'true', message: '端口號不能為空', trigger: ['change'] }
      //   ]
      // },
    })

    // 生命周期 - 挂载成功
    onMounted(() => {
      // ws
      const { proxy } = getCurrentInstance()
      proxy.$socket.onmessage = res => {
        const data = JSON.parse(res.data)

        switch (data.m) {
          case 'openclient':
          case 'closeclient':
            state.client.status = data.udpRemoteOnline
            if (data.udpRemoteOnline) {
              state.client.address = `${data.udpRemoteIP}:${data.udpRemotePort}`
            } else {
              state.client.address = ''
            }
            break

          case 'openport':
          case 'closeport':
            state.portForm.port = data.portnum
            state.portForm.status = data.status
            break;
          
          default:
            break;
        }
      }
      
      axios.get(`/vue_api?m=clientinfo`).then(res => {
        const {
          udpRemoteIP,
          udpRemotePort,
          udpRemoteOnline,
          serialPort,
          serialStatus
        } = res

        state.client.status = udpRemoteOnline
        if (udpRemoteOnline) {
          state.client.address = `${udpRemoteIP}:${udpRemotePort}`
        } else {
          state.client.address = ''
        }
        state.portForm.port = serialPort
        state.portForm.status = serialStatus
      }).catch(error => {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error)
        } else {
          console.error(error)
          if (error.response) {
            console.error(error.response.data)
            const { code, message } = error.response.data
            ElMessage.error(`Error: ${code} - ${message}`)
          }
        }
      })
    })

    onUnmounted(() => {
      const { proxy } = getCurrentInstance()
      delete proxy.$socket.onmessage
    })
    // const submitOpenPort = () => {
    //   portRef.value.validate((vaild) => {
    //     if (vaild) {
    //       const port = state.portForm.port
    //       axios.get(`/vue_api?method=OpenPort&portnum=${port}`).then(res => {
    //         console.log(res)
    //         state.portForm.status = 'Open'
    //         localSet('portForm', state.portForm)
    //         ElMessage.success('成功打開端口')
    //       }).catch(error => {
    //         console.error(error)
    //         if (error.response) {
    //           console.error(error.response.data)
    //           const { code, message } = error.response.data
    //           ElMessage.error(`Error: ${code} - ${message}`)
    //         }
    //       })
    //     }
    //   })
    // }

    // const submitClosePort = () => {
    //   portRef.value.validate((vaild) => {
    //     if (vaild) {
    //       const port = state.portForm.port
    //       axios.get(`/vue_api?method=ClosePort&portnum=${port}`).then(res => {
    //         console.log(res)
    //         state.portForm.status = 'Close'
    //         localSet('portForm', state.portForm)
    //         ElMessage.success('成功關閉端口')
    //       }).catch(error => {
    //         console.error(error)
    //         if (error.response) {
    //           console.error(error.response.data)
    //           const { code, message } = error.response.data
    //           ElMessage.error(`Error: ${code} - ${message}`)
    //         }
    //       })
    //     }
    //   })
    // }
  
    const submitVersion = () => {
      axios.get('/vue_api?m=version').then(res => {
        const data = JSON.parse(res)
        console.log(data)
        if (data.message) {
          ElMessage.error(data.message)
          state.versionForm.version = ''
          return
        }
        state.versionForm.version = data.version

        ElMessage.success('成功獲取版本號')
      }).catch(error => {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error)
        } else {
          console.error(error)
          if (error.response) {
            console.error(error.response.data)
            const { code, message } = error.response.data
            ElMessage.error(`Error: ${code} - ${message}`)
          }
        }
      })
    }
    return {
      ...toRefs(state),
      // portRef,
      // submitOpenPort,
      // submitClosePort,
      submitVersion
    }
  }
}
</script>

<style>
  .account-container {
    margin-bottom: 20px;
  }
  .client-item-title {
    display: inline-block;
    text-align: right;
    margin-right: 16px;
    width: 120px;
    height: 30px;
  }
</style>