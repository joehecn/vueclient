import { createApp } from 'vue'
import VueNativeSock from 'vue-native-websocket-vue3'
import App from './App.vue'
import router from './router/index'

// import { createStore } from 'vuex'

import {
  // 组件
  ElAside,
  ElButton,
  ElCard,
  ElCheckbox,
  ElContainer,
  ElDialog,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMenu,
  ElMenuItem,
  ElOption,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
  // 插件
  ElLoading
} from 'element-plus'

let myWorker = null

const init = ({}) => {
  // 创建并挂载根实例
  const app = createApp(App)

  app.use(VueNativeSock, 'ws://localhost:4003', {
    reconnection: true,
    reconnectionAttempts: 5, 
    reconnectionDelay: 3000
  })

  // 确保 _use_ 路由实例使
  // 整个应用支持路由。
  app.use(router)
  // // 将 store 实例作为插件安装
  // app.use(store)

  app.component(ElAside.name, ElAside)
  app.component(ElButton.name, ElButton)
  app.component(ElCard.name, ElCard)
  app.component(ElCheckbox.name, ElCheckbox)
  app.component(ElContainer.name, ElContainer)
  app.component(ElDialog.name, ElDialog)
  app.component(ElForm.name, ElForm)
  app.component(ElFormItem.name, ElFormItem)
  app.component(ElIcon.name, ElIcon)
  app.component(ElInput.name, ElInput)
  app.component(ElMenu.name, ElMenu)
  app.component(ElMenuItem.name, ElMenuItem)
  app.component(ElOption.name, ElOption)
  app.component(ElPagination.name, ElPagination)
  app.component(ElPopconfirm.name, ElPopconfirm)
  app.component(ElPopover.name, ElPopover)
  app.component(ElSelect.name, ElSelect)
  app.component(ElTable.name, ElTable)
  app.component(ElTableColumn.name, ElTableColumn)
  app.component(ElTag.name, ElTag)

  app.use(ElLoading)
  
  app.mount('#app')
}

const handleMessage = e => {
  const { key, value } = e.data

  if (key === 'init') {
    init(value)

    return
    // 现在，应用已经启动了！
  }
}

const main = () => {
  // webWorks
  if (window.Worker) {
    myWorker = new Worker('./worker/worker.js')
    myWorker.onmessage = handleMessage
    return
  }

  // 不支持 webWorker
  document.body.innerHTML = '請切換您的瀏覽器到最新的現代瀏覽器'
}

// 入口主函数
main()