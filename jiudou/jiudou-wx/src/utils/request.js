import axios from 'axios'
import store from '@/store'
import router from '../router'
import { Dialog, Toast } from 'vant'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  transformRequest: [
    function transformRequest(data, headers) {
      if (!data) {
        data = {
          client: 5
        }
      }
      if (data instanceof FormData || data instanceof ArrayBuffer || data instanceof Buffer || data instanceof File || data instanceof Blob) {
        // 接口参数 token
        data.append('client', 5)
        if (!data.has('token')) {
          data.append('token', store.state.user.token)
          data.append('uid', store.state.user.userId ? store.state.user.userId : '')
        }
        return data
      } else if (data instanceof URLSearchParams) {
        // 接口参数 token
        data.append('client', 5)
        if (!data.has('token')) {
          data.append('token', store.state.user.token)
          data.append('uid', store.state.user.userId ? store.state.user.userId : '')
        }
        // headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
        return data.toString()
      } else if (data instanceof Object) {
        // 接口参数 token
        data.client = 5
        data.token = store.state.user.token
        data.uid = store.state.user.userId ? store.state.user.userId : ''
        // data.token = '46987661626'
        // data.uid = '661626'
        // headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
        const _data = Object.keys(data)
        return _data.map(name => `${name}=${encodeURIComponent(data[name])}`).join('&')
      }
      return data
    }
  ]
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
// 请求拦截
service.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    // config.headers['Accept'] = 'application/json'
    // if (store.getters.token) {
    //   config.headers['Authorization'] = 'Bearer ' + store.getters.token
    // }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res && res.code === 200) {
      return res
    } else if (
      res &&
      (res.code === 246 ||
        res.code === 247 ||
        res.code === 248 ||
        res.code === 251 ||
        res.code === 249 ||
        res.code === 241 ||
        res.code === 250 ||
        res.code === 208)
    ) {
      return res
    } else {
      // token失效
      if (res.code === -6 || res.code === 200202 || res.code === 200103) {
        store.dispatch('user/logout').then(() => {
          // router.push({
          //   path: '/'
          // })
          var badTokenCount = Number(localStorage.getItem('badTokenCount'))
          if (badTokenCount >= 5) {
            setTimeout(() => {
              badTokenCount = 0
              localStorage.setItem('badTokenCount', badTokenCount)
              // 弹窗提示错误信息
              Dialog.confirm({
                title: '错误提示',
                message: '网络异常，请稍后重试',
                confirmButtonText: '重试',
                cancelButtonText: '退出'
              }).then(() => {
                location.reload()
              }).catch(() => {
                router.back()
              })
            }, 200)
          } else {
            setTimeout(() => {
              badTokenCount++
              localStorage.setItem('badTokenCount', badTokenCount)
              setTimeout(() => {
                location.reload()
              }, 200)
            }, 200)
          }
        })
      } else {
        // 弹窗提示错误信息
        Toast({
          message: res.msg,
          position: 'middle'
        })
      }
      return Promise.reject(res)
    }
  },
  error => {
    // 弹窗提示错误信息
    Toast({
      message: error.msg || '网络错误',
      position: 'middle'
    })
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
