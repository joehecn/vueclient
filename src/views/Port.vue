<template>
  <el-card class="account-container">
    <el-form :model="portForm" :rules="rules" ref="portRef" label-width="80px" label-position="right" class="demo-ruleForm">
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
    </el-form>
  </el-card>

  <el-card class="account-container">
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
import { reactive, ref, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import { localGet, localSet, handleAxiosError } from '@/utils'

export default {
  name: 'Account',
  setup() {
    const portRef = ref(null)
    const state = reactive({
      portForm: {
        port: '',
        status: ''
      },
      versionForm: {
        version: ''
      },
      rules: {
        port: [
          { required: 'true', message: '端口號不能為空', trigger: ['change'] }
        ]
      },
    })

    // 生命周期 - 挂载成功
    onMounted(() => {
      const portForm = localGet('portForm') || { port: 3, status: 'Close' }
      state.portForm = portForm
    })

    const submitOpenPort = () => {
      portRef.value.validate((vaild) => {
        if (vaild) {
          const port = state.portForm.port
          axios.get(`/vue_api?method=OpenPort&portnum=${port}`).then(res => {
            console.log(res)
            state.portForm.status = 'Open'
            localSet('portForm', state.portForm)
            ElMessage.success('成功打開端口')
          }).catch(error => {
            console.log(error)
            if (error.response) {
              console.log(error.response.data)
              const { code, message } = error.response.data
              ElMessage.error(`Error: ${code} - ${message}`)
            }
          })
        }
      })
    }

    const submitClosePort = () => {
      portRef.value.validate((vaild) => {
        if (vaild) {
          const port = state.portForm.port
          axios.get(`/vue_api?method=ClosePort&portnum=${port}`).then(res => {
            console.log(res)
            state.portForm.status = 'Close'
            localSet('portForm', state.portForm)
            ElMessage.success('成功關閉端口')
          }).catch(error => {
            console.log(error)
            if (error.response) {
              console.log(error.response.data)
              const { code, message } = error.response.data
              ElMessage.error(`Error: ${code} - ${message}`)
            }
          })
        }
      })
    }
  
    const submitVersion = () => {
      const port = state.portForm.port || 3
      axios.get(`/vue_api?method=VerChk&portnum=${port}`).then(res => {
        console.log(res)
        state.versionForm.version = res.sVer

        ElMessage.success('成功獲取版本號')
      }).catch(error => {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error)
        } else {
          console.error(error)
          if (error.response) {
            console.log(error.response.data)
            const { code, message } = error.response.data
            ElMessage.error(`Error: ${code} - ${message}`)
          }
        }
      })
    }
    return {
      ...toRefs(state),
      portRef,
      submitOpenPort,
      submitClosePort,
      submitVersion
    }
  }
}
</script>

<style>
  .account-container {
    margin-bottom: 20px;
  }
</style>