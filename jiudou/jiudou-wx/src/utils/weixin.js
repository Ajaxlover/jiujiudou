// import wx from 'weixin-js-sdk'
import wx from 'jweixin-1.6.0'
import store from '@/store'
import { wxSign } from '@/api/wx'

const agent = navigator.userAgent
// eslint-disable-next-line no-unused-vars
const isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios手机
const wxSignParams = {
  appId: '',
  signUrl: '',
  timestamp: '',
  nonceStr: '',
  signature: '',
  errorCount: 3 // 错误尝试次数
}

/**
 * @desc 获取参数 初始sdk配置
 * @param {*} params
 */
function init(params, url) {
  wxSignParams.signUrl = window.entryUrl
  if (url) {
    wxSignParams.signUrl = decodeURIComponent(wx.signurl())
  }
  if (!isiOS) {
    wxSignParams.signUrl = window.location.href
  }

  console.log('real', wxSignParams.signUrl)
  console.log('wx.signurl', decodeURIComponent(wx.signurl()))

  // wxSignParams.signUrl = isiOS ? store.getters.originUrl : window.location.href
  if (store.getters.thirdType === 'wx') {
    // 获取验签参数
    return wxSign({
      url: wxSignParams.signUrl
    })
      .then(res => {
        const { appId, timestamp, nonceStr, signature } = res.data
        wxSignParams.appId = appId
        wxSignParams.timestamp = timestamp
        wxSignParams.nonceStr = nonceStr
        wxSignParams.signature = signature
        wxConfig(params)
      })
      .catch(error => {
        console.log('wxSign fail', error)
      })
  }
}

/**
 * @desc sdk配置
 * @param {*} params
 */
function wxConfig(params) {
  const configObj = {
    debug: false,
    appId: wxSignParams.appId,
    timestamp: wxSignParams.timestamp,
    nonceStr: wxSignParams.nonceStr,
    signature: wxSignParams.signature,
    jsApiList: params.apiList
  }

  // 获取code参数
  var code = getUrlParam('code')

  // 如果URL中存在code参数，则将其移除并重新加载当前页面
  if (code) {
    var newUrl = window.location.href.replace(/\?code=.*$/, '')
    // window.history.replaceState({}, '', newUrl)
    // window.location.reload()
    window.location.replace(newUrl)
  }
  wx.config(configObj)
  wx.ready(() => {
    setTimeout(() => {
      wx.hideAllNonBaseMenuItem()
      // 显示功能菜单
      wx.showMenuItems({
        menuList: params.showMenuList
      })
    }, 400)
  })
  wx.error(res => {
    console.log('wx.config fail', res)

    if (wxSignParams.errorCount >= 0) {
      wxSignParams.errorCount = wxSignParams.errorCount - 1
      wxSignParams.signUrl = window.entryUrl
      if (!isiOS) {
        wxSignParams.signUrl = window.location.href
      } else {
        console.log('wx.signurlAndorid', wx.signurl())
        wxSignParams.signUrl = decodeURIComponent(wx.signurl())
      }
      init(params)
    }
  })
}

/**
 * @desc 微信支付
 * @param {*} params
 */
function pay(params) {
  return new Promise(resolve => {
    wx.chooseWXPay({
      timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: params.nonce_str, // 支付签名随机串，不长于 32 位
      package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: params.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: params.pay_sign, // 支付签名

      success: function (res) {
        resolve({ success: res })
      },
      cancel: function (res) {
        resolve('cancel', res)
      },
      fail: function (res) {
        resolve('fail', res)
      }
    })
  })
}

/**
 * @desc 微信分享
 */
function share(params) {
  wx.ready(() => {
    wx.updateAppMessageShareData({
      title: params.title, // 分享标题
      desc: params.desc, // 分享描述
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
      success: function (res) {
        // 设置成功
      }
    })
    wx.updateTimelineShareData({
      title: params.title, // 分享标题
      link: params.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params.imgUrl, // 分享图标
      success: function (res) {
        // 设置成功
      }
    })
  })
}

/**
 * @desc 获取地理位置
 * @param {*} params
 */
function getLocation() {
  return new Promise(resolve => {
    wx.ready(() => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          resolve({ success: res })
          // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度
        },
        fail: function (res) {
          resolve('fail', res)
        }
      })
    })
  })
}

function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * @desc 微信内置地图查看位置接口
 * @param {*} params
 */
function openLocation(params) {
  return new Promise(resolve => {
    wx.ready(() => {
      wx.openLocation({
        latitude: Number(params.latitude), // 纬度，浮点数，范围为90 ~ -90
        longitude: Number(params.longitude), // 经度，浮点数，范围为180 ~ -180。
        name: params.name, // 位置名
        address: params.address, // 地址详情说明
        scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: params.infoUrl, // 在查看位置界面底部显示的超链接,可点击跳转
        success: function (res) {
          resolve({ success: res })
        },
        fail: function (res) {
          console.log('openLocation fail', res)
          resolve('fail', res)
        }
      })
    })
  })
}

export default {
  init,
  pay,
  share,
  getLocation,
  openLocation,
  getUrlParam
}
