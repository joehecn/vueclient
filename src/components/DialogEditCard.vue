<template>
  <el-dialog
    :title="type == 'add' ? '添加門禁' : '修改門禁'"
    v-model="visible"
    width="500px"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="door-form">
      <el-form-item label="卡號" prop="cardNo">
        <el-input style="width: 280px;" type="text" v-model="ruleForm.cardNo" disabled></el-input>
        <el-button style="margin-left: 8px;" @click.prevent="readCard">讀卡</el-button>
      </el-form-item>
      <el-form-item label="門禁">
        <el-select v-model="ruleForm.doorIds" multiple placeholder="请选择門禁">
          <el-option
            v-for="item in doorOptions"
            :key="item._id"
            :label="item.building + ' ' + item.unit"
            :value="item._id">
            <span style="display: inline-block; width: 60px;">{{ item.building }}</span>
            <span style="color: #8492a6;">{{ item.unit }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用戶名" prop="username">
        <el-input type="text" v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input type="text" v-model="ruleForm.realname"></el-input>
      </el-form-item>
      <el-form-item label="住戶信息" prop="userInfo">
        <el-input type="text" v-model="ruleForm.userInfo"></el-input>
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
import { ElMessage } from 'element-plus'
import isEqual from 'lodash.isequal'
import axios from '@/utils/axios'
import { localGet, handleAxiosError } from '@/utils'

export default {
  name: 'DialogEditCard',
  props: {
    type: String,
    doorOptions: Array
  },
  // 定义抛出的事件名称
  emits: ['success'],
  setup(props, context) {
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      oldForm: null,
      ruleForm: {
        cardNo: '',
        doorIds: [],
        username: '',
        realname: '',
        userInfo: ''
      },
      rules: {
        cardNo: [
          { required: 'true', message: '卡號不能為空', trigger: ['change'] }
        ],
        username: [
          { required: 'true', message: '用戶名不能為空', trigger: ['change'] }
        ],
        realname: [
          { required: 'true', message: '姓名不能為空', trigger: ['change'] }
        ],
        userInfo: [
          { required: 'true', message: '住戶信息不能為空', trigger: ['change'] }
        ]
      }
    })

    // 开启弹窗
    const open = ruleForm => {
      const oldForm = Object.assign({}, ruleForm)
      oldForm.doorIds = oldForm.doorIds.map(({ _id }) => _id)
      state.oldForm = oldForm

      const newForm = Object.assign({}, oldForm)
      state.ruleForm = newForm
      state.visible = true
    }

    const readCard = () => {
      const portForm = localGet('portForm') || { port: 3 }
      axios.get(`/vue_api?method=ReadIDm&portnum=${portForm.port}`).then(res => {
        console.log(res)
        const cardNo = res.sIDm.split(' ').join('')
        console.log({ cardNo })
        state.ruleForm.cardNo = cardNo
        ElMessage.success('成功讀取卡號')
      }).catch(error => {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error)
        } else {
          console.error(error)
        }
      })
    }

    const submitForm = () => {
      formRef.value.validate().then(isValid => {
        if (isValid) {
          if (props.type == 'add') {
            axios.put('/card/add', state.ruleForm).then(() => {
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
            axios.post('/card/update', state.ruleForm).then(() => {
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
      readCard,
      submitForm
    }
  }
}
</script>