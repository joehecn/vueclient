<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <!-- <img class="logo" src="https://s.weituibao.com/1582958061265/mlogo.png" /> -->
        <div class="name">
          <div class="title">八達通</div>
          <div class="tips">門禁卡管理系統</div>
        </div>
      </div>
      <el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm" class="login-form">
        <el-form-item label="賬號" prop="username">
          <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off" @keyup.enter="submitForm"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off" @keyup.enter="submitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div> -->
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登錄</el-button>
          <!-- <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import { reactive, ref, toRefs } from 'vue'
import { localSet, handleAxiosError } from '@/utils'
import router from '@/router/index'

export default {
  name: 'Login',
  setup() {
    const loginForm = ref(null)
    const state = reactive({
      ruleForm: {
        username: '',
        password: ''
      },
      checked: true,
      rules: {
        username: [
          { required: 'true', message: '賬戶不能為空', trigger: 'blur' }
        ],
        password: [
          { required: 'true', message: '密碼不能為空', trigger: 'blur' }
        ]
      }
    })
    const submitForm = () => {
      loginForm.value.validate(valid => {
        if (valid) {
          axios.post('/login', {
            userName: state.ruleForm.username,
            password: state.ruleForm.password
          }).then(data => {
            // console.log(data)
            localSet('token', data.token)
            axios.defaults.headers['Authorization'] = data.token
            // window.location.href = '/card'
            router.push({ path: '/' })
          }).catch(error => {
            if (axios.isAxiosError(error)) {
              handleAxiosError(error)
            } else {
              console.error(error)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    const resetForm = () => {
      loginForm.value.resetFields();
    }
    return {
      ...toRefs(state),
      loginForm,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
    /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */
  }
  .login-container {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
  }
  .head img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .head .title {
    font-size: 28px;
    color: #1BAEAE;
    font-weight: bold;
    text-align: center;
  }
  .head .tips {
    font-size: 12px;
    color: #999;
  }
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
</style>
<style>
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  /* .login-form .el-form-item {
    margin-bottom: 12px;
  } */
</style>