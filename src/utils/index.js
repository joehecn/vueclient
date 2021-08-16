
import { ElMessage } from 'element-plus'

export function localGet (key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}

export function handleAxiosError(error) {
  if (error.response) {
    console.log(error.response.data)
    const { code, message } = error.response.data
    ElMessage.error(`Error: ${code} - ${message}`)
  }
}
