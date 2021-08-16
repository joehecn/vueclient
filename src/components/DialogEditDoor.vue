<template>
  <el-dialog
    :title="type == 'add' ? '添加門禁' : '修改門禁'"
    v-model="visible"
    width="400px"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="door-form">
      <el-form-item label="IP" prop="ip">
        <el-input type="text" v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="接收端口" prop="receivePort">
        <el-input type="text" v-model="ruleForm.receivePort"></el-input>
      </el-form-item>
      <el-form-item label="發送端口" prop="sendPort">
        <el-input type="text" v-model="ruleForm.sendPort"></el-input>
      </el-form-item>
      <el-form-item label="門禁編碼" prop="doorNo">
        <el-input type="text" v-model="ruleForm.doorNo"></el-input>
      </el-form-item>
      <el-form-item label="樓號" prop="building">
        <el-input type="text" v-model="ruleForm.building"></el-input>
      </el-form-item>
      <el-form-item label="單元號" prop="unit">
        <el-input type="text" v-model="ruleForm.unit"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">確 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import isEqual from 'lodash.isequal'
import axios from '@/utils/axios'
import { handleAxiosError } from '@/utils'

export default {
  name: 'DialogEditDoor',
  props: {
    type: String
  },
  // 定义抛出的事件名称
  emits: ['success'],
  setup(props, context) {
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      oldForm: null,
      ruleForm: {
        ip: '',
        receivePort: '',
        sendPort: '',
        doorNo: '',
        building: '',
        unit: ''
      },
      rules: {
        ip: [
          { required: 'true', message: 'IP 不能為空', trigger: ['change'] }
        ],
        receivePort: [
          { required: 'true', message: '接收端口不能為空', trigger: ['change'] }
        ],
        sendPort: [
          { required: 'true', message: '發送端口不能為空', trigger: ['change'] }
        ],
        doorNo: [
          { required: 'true', message: '門禁編碼不能為空', trigger: ['change'] }
        ],
        building: [
          { required: 'true', message: '樓號不能為空', trigger: ['change'] }
        ],
        unit: [
          { required: 'true', message: '單元號不能為空', trigger: ['change'] }
        ]
      }
    })

    // 开启弹窗
    const open = ruleForm => {
      state.oldForm = ruleForm
      const newForm = Object.assign({}, ruleForm)
      state.ruleForm = newForm
      state.visible = true
    }

    const submitForm = () => {
      formRef.value.validate().then(isValid => {
        if (isValid) {
          if (props.type == 'add') {
            axios.put('/door/add', state.ruleForm).then(() => {
              context.emit('success')
              state.visible = false
            }).catch(error => {
              if (axios.isAxiosError(error)) {
                handleAxiosError(error)
              } else {
                console.error(error)
              }
            })
          } else {
            if (isEqual(state.oldForm, state.ruleForm)) {
              state.visible = false
              return
            }
            console.log('提交服务器')
            axios.post('/door/update', state.ruleForm).then(() => {
              context.emit('success')
              state.visible = false
            }).catch(error => {
              if (axios.isAxiosError(error)) {
                handleAxiosError(error)
              } else {
                console.error(error)
              }
            })
          }
        }
      })
    }
    return {
      formRef,
      ...toRefs(state),
      open,
      submitForm
    }
  }
}
</script>