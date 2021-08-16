<template>
<el-container v-if="state.showMenu" class="container">
  <el-aside class="aside">
    <div class="head">
      <div>
        <!-- <img src="https://s.weituibao.com/1582958061265/mlogo.png" alt="logo"> -->
        <span>門禁卡管理系統</span>
      </div>
    </div>
    <div class="line" />
    <el-menu
      background-color="#222832"
      text-color="#fff"
      :router="true"
      :default-active="state.currentPath"
      @select="onMenuSelect"
    >
      <el-menu-item index="/port"><i class="el-icon-menu" />端口管理</el-menu-item>
      <el-menu-item index="/door"><i class="el-icon-menu" />系統配置</el-menu-item>
      <el-menu-item index="/card"><i class="el-icon-user-solid" />住戶管理</el-menu-item>
      <el-menu-item index="/history"><i class="el-icon-s-order" />換卡歷史</el-menu-item>
      <el-menu-item index="/clockin"><i class="el-icon-odometer" />刷卡記錄</el-menu-item>
    </el-menu>
  </el-aside>
  <el-container class="content">
    <Header :title="title" />
    <div class="main">
      <router-view />
    </div>
    <Footer />
  </el-container>
</el-container>
<el-container v-else class="container">
  <router-view />
</el-container>
</template>

<script>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const noMenu = ['/login']
    const map = {
      '/port': '端口管理',
      '/door': '系統配置',
      '/card': '住戶管理',
      '/history': '換卡歷史',
      '/clockin': '刷卡記錄',
      '/login': '登錄頁面'
    }

    const route = useRoute()

    const state = reactive({
      showMenu: true,
      currentPath: ''
    })

    // 当参数更改时获取用户信息
    watch(
      () => route.path,
      newPath => {
        state.showMenu = !noMenu.includes(newPath)
        state.currentPath = newPath
      }
    )

    const onMenuSelect = index => {
      state.currentPath = index
    }

    const title = computed(() => {
      return map[state.currentPath]
    })

    return {
      state,
      title,
      onMenuSelect
    }
  }
}
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    background-color: #ffffff;
  }
  .container {
    height: 100vh;
  }
  .aside {
    width: 200px!important;
    background-color: #222832;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .aside::-webkit-scrollbar {
    display: none;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
  .head > div {
    display: flex;
    align-items: center;
  }

  .head img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .head span {
    font-size: 20px;
    color: #ffffff;
  }
  .line {
    border-top: 1px solid hsla(0,0%,100%,.05);
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  .content {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
  }
  .main {
    height: calc(100vh - 100px);
    overflow: auto;
    padding: 10px;
  }
</style>
<style>
  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .el-menu {
    border-right: none!important;
  }
  .el-submenu {
    border-top: 1px solid hsla(0, 0%, 100%, .05);
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .el-submenu:first-child {
    border-top: none;
  }
  .el-submenu [class^="el-icon-"] {
    vertical-align: -1px!important;
  }
  a {
    color: #409eff;
    text-decoration: none;
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
  .el-popper__arrow {
    display: none;
  }
</style>
