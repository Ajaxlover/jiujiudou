import router from '../router'
import store from '../store'
import systemUtils from '@/utils/system'
import authUtils from '@/utils/auth'
import { code2AccessToken } from '@/api/user'
/**
 * @desc 第三方回调处理
 *
 */
function doFilter() {
  router.beforeEach((to, from, next) => {
    const thirdType = store.getters.thirdType // 第三方类型 wx ali
    const third_redirect_code = systemUtils.getUrlParams().code || systemUtils.getUrlParams().auth_code // 第三方授权时页面带的code码
    const old_third_redirect_code = store.state.user.wxCode // 第三方授权时页面带的code码 (上一次)
    const third_redirect_state = systemUtils.getUrlParams().state // 第三方授权时页面带的state码
    const hasToken = authUtils.getToken() // token

    if (!to.meta.auth) {
      return next()
    }
    // 第三方环境code处理
    if (!hasToken && thirdType && to.meta.thirdAuth && third_redirect_code && third_redirect_code !== old_third_redirect_code) {
      // code获取token
      code2AccessToken({
        code: third_redirect_code,
        state: third_redirect_state
      })
        .then(res => {
          // 保存微信返回的code 判断code已用且仍在url中,但是清除了token
          store.dispatch('user/setWxCode', third_redirect_code)
          store.dispatch('user/setToken', res.data.token)
          store.dispatch('user/setUserInfo', res.data)
          store.dispatch('user/setUserId', res.data.uid)
          store.dispatch('user/setOpenId', res.data.openid)
          if (res.code == 208 || Number(res.code) == 209) {
            return next({ path: '/bindPhone', replace: true })
          } else {
            return next()
          }
          // return next({ path: '/sign_in', replace: true })  // 防止用户在手机注册页点击返回到home页
        })
        .catch(() => {
          console.error('获取微信网页Access_token失败,登录失败!!!')
        })
    } else {
      if (hasToken == 'undefined' && to.meta.thirdAuth) {
        if (to.name == 'BindPhone') {
          return next()
        } else {
          return next({ path: '/bindPhone', replace: true })
        }
      } else {
        return next()
      }
    }
  })
}

export default {
  doFilter
}
