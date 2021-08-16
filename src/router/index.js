
import { createRouter, createWebHashHistory } from 'vue-router'
import { localGet } from '@/utils'

// 1. 定义路由组件.
// 路由懒加载
const Card = () => import(/* webpackChunkName: "card" */ '../views/Card.vue')
const Door = () => import(/* webpackChunkName: "door" */ '../views/Door.vue')
const CardHistory = () => import(/* webpackChunkName: "history" */ '../views/CardHistory.vue')
const ClockIn = () => import(/* webpackChunkName: "clockin" */ '../views/ClockIn.vue')
const Port = () => import(/* webpackChunkName: "port" */ '../views/Port.vue')
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue')

// 2. 定义一些路由
const routes = [
  { path: '/', redirect: '/card' },
  { path: '/door', name: 'door', component: Door },
  { path: '/card', name: 'card', component: Card },
  { path: '/history', name: 'history', component: CardHistory },
  { path: '/clockin', name: 'clockin', component: ClockIn },
  { path: '/port', name: 'port', component: Port },
  { path: '/login', name: 'login', component: Login }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  // hash模式：createWebHashHistory，history模式：createWebHistory
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  if (to.name !== 'login' && !localGet('token')) next({ name: 'login' })
  else next()
})

export default router