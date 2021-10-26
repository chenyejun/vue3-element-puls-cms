import axios, { AxiosPromise } from 'axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { h, VNode } from 'vue'
// import store from '@/store'
import { ElMessage } from 'element-plus'
import * as utils from '@/utils'
interface AxiosRequestConfigCutom extends AxiosRequestConfig {
  isJson?: boolean,
  headers?: any,
  data?: any
}

const errorHandle = (status: string | number, message: string) => {
  switch (status) {
    case 401:
      // store.dispatch('logout')
      break
    case 403:
      break
    case 404:
      break
    default:
      ElMessage.error(message)
  }
}

function errorMessage(response: AxiosResponse) {
  const resData = response.data
  let message: string | VNode = ''
  const errorsJson = resData.errors
  console.log(errorsJson)
  if (errorsJson && errorsJson.length > 0) {
    message = h('div', null, errorsJson.map((x: any) => {
      return h('p', { style: 'color: #f56c6c', fontSize: '14px' }, `${x.join('')}`)
    }))
  } else {
    message = h('p', { style: 'color: #f56c6c', fontSize: '14px' }, `${resData.msg || '未知错误，请联系管理员!!'}`)
  }
  ElMessage({
    message: message
  })
}

const instance = axios.create({ baseURL: '/api' })
instance
  .interceptors
  .request
  .use((config: AxiosRequestConfigCutom) => {
    config.headers['Authorization'] = `Bearer`
    if (config.method === 'post' && config.data && !config.isJson) {
      config.data = utils.objectToFormdata(config.data)
      config.headers.common['Content-Type'] = 'multipart/form-data'
    }
    return config
  }, (error: any) => {
    return Promise.reject(error)
  })

instance
  .interceptors
  .response
  .use((response: AxiosResponse) => {
    const data = response.data
    if (data.status !== 1) {
      errorMessage(response)
    }
    return data
  }, (error: any) => {
    const { response } = error
    response
      ? errorHandle(response.status, response.data.msg)
      : ElMessage.warning({
        message: '网络连接失败，请稍后重试',
        type: 'warning'
      })
    return Promise.reject(error)
  })

export const createAPI = (url: string, method: string, params: any = {}, config: any = {}): AxiosPromise => {
  if (method === 'get') {
    config.params = params
  } else {
    config.data = params
  }
  return instance({
    url,
    method,
    ...config
  })
}

export default instance
