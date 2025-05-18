import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: false, // 是否需要微信验签
        jsApiList: [
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'hideMenuItems',
          'updateAppMessageShareData', // 分享朋友
          'updateTimelineShareData' // 分享朋友圈
        ],
        showMenuList: []
      },
      keepAlive: false,
      title: '我的教材'
    }
  },
  {
    path: '/certification',
    name: 'certification',
    component: () => import('@/views/contest/certification.vue'),
    meta: {
      auth: false, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: false, // 是否需要微信验签
        jsApiList: [
          'updateAppMessageShareData', // 分享朋友
          'updateTimelineShareData' // 分享朋友圈
        ],
        showMenuList: []
      },
      keepAlive: false,
      title: '证书'
    }
  },
  {
    path: '/reward',
    name: 'Reward',
    component: () => import('@/views/contest'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: false, // 是否需要微信验签
        jsApiList: [
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'hideMenuItems',
          'updateAppMessageShareData', // 分享朋友
          'updateTimelineShareData' // 分享朋友圈
        ],
        showMenuList: []
      },
      keepAlive: false,
      title: '竞赛领取奖金'
    }
  },
  {
    path: '/dtTest',
    name: 'dtTest',
    component: () => import('@/views/bookTest'),
    meta: {
      auth: false, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseImage'],
        showMenuList: []
      },
      keepAlive: false,
      title: ''
    }
  },
  {
    path: '/dtAnswer',
    name: 'dtAnswer',
    component: () => import('@/views/bookTest/dtAnswer'),
    meta: {
      auth: false, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseImage'],
        showMenuList: []
      },
      keepAlive: false,
      title: ''
    }
  },
  {
    path: '/dtData',
    name: 'dtData',
    component: () => import('@/views/bookTest/dtData'),
    meta: {
      auth: false, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseImage'],
        showMenuList: []
      },
      keepAlive: false,
      title: ''
    }
  },
  {
    path: '/activateBook',
    name: 'ActivateBook',
    component: () => import('@/views/home/activateBook'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: '激活教材'
    }
  },
  {
    path: '/activatedBook',
    name: 'ActivatedBook',
    component: () => import('@/views/home/activatedBook'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: '已激活教材'
    }
  },
  {
    // path: '/bookStore',
    path: '/',
    name: 'BookStore',
    component: () => import('@/views/bookStore'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'scanQRCode']
      },
      keepAlive: false,
      title: '书城'
    }
  },
  {
    path: '/bookInfo',
    name: 'BookInfo',
    component: () => import('@/views/bookStore/bookInfo'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: '图书详情'
    }
  },
  {
    path: '/activateDigitalBook',
    name: 'ActivateDigitalBook',
    component: () => import('@/views/bookStore/activateDigitalBook'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'scanQRCode']
      },
      keepAlive: false,
      title: '验证码获取'
    }
  },
  {
    path: '/buyDigitalBook',
    name: 'BuyDigitalBook',
    component: () => import('@/views/bookStore/buyDigitalBook'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseWXPay']
      },
      keepAlive: false,
      title: '支付确认'
    }
  },
  {
    path: '/ar',
    name: 'AR',
    component: () => import('@/views/ar'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: 'AR示例'
    }
  },
  {
    path: '/arDetails',
    name: 'ArDetails',
    component: () => import('@/views/ar/arDetails.vue'),
    meta: {
      auth: false, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: false, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: 'AR视频详情'
    }
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/my'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseImage']
      },
      keepAlive: false,
      title: '我的'
    }
  },
  {
    path: '/bindPhone',
    name: 'BindPhone',
    component: () => import('@/views/my/bindPhone.vue'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: '登录'
    }
  },
  {
    path: '/teaAuthenticationPre',
    name: 'TeaAuthenticationPre',
    component: () => import('@/views/my/teaAuthenticationPre.vue'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems']
      },
      keepAlive: false,
      title: '教师身份认证'
    }
  },
  {
    path: '/teaAuthentication',
    name: 'TeaAuthentication',
    component: () => import('@/views/my/teaAuthentication.vue'),
    meta: {
      auth: true, // 需要登录
      thirdAuth: 'base', // '': 无需鉴权 base: 静默授权 userinfo: 用户点击授权
      wx: {
        sign: true, // 是否需要微信验签
        jsApiList: ['hideAllNonBaseMenuItem', 'showMenuItems', 'chooseImage']
      },
      keepAlive: false,
      title: '教师身份认证'
    }
  }

  // 404
  // {
  //   path: '*',
  //   component: () => import('@/views/404'),
  //   meta: {
  //     title: '错误'
  //   }
  // }
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior() {
      return { y: 0 }
    },
    base: process.env.BASE_URL,
    routes: routes
  })

console.log(process.env)
const router = createRouter()

// router.beforeEach((to, from, next) => {
//   // chrome
//   document.body.scrollTop = 0
//   // firefox
//   document.documentElement.scrollTop = 0
//   // safari
//   window.pageYOffset = 0
//   window.scrollTo(0, 0) // 将页面滚动位置重置为顶部
//   next()
// })
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
