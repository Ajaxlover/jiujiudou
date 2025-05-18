import request from '@/utils/request'

/**
 * @desc 更多推荐
 * @param
 */
export function ebook_ebookApp_recommend(data) {
  return request({
    url: '/ebook/ebookApp/recommend',
    method: 'post',
    data
  })
}

/**
 * @desc 我的教材
 * @param
 */
export function book_textbook_updateBookShelf(data) {
  return request({
    url: '/book/v1/textbook/updateBookShelf',
    method: 'post',
    data
  })
}

/**
 * @desc 我的数字教材
 * @param
 */
export function ebook_dTbookUser_queryBookPage(data) {
  return request({
    url: '/ebook/dTbookUser/queryBookPage',
    method: 'post',
    data
  })
}

/**
 * @desc 教材目录
 * @param
 */
export function book_catalog_catalogList(data) {
  return request({
    url: '/book/catalog/catalogList',
    method: 'post',
    data
  })
}

/**
 * @desc 知识点下资源获取
 * @param
 */
export function resource_resource_resourcesV2(data) {
  return request({
    url: '/resource/resource/resourcesV2',
    method: 'post',
    data
  })
}

/**
 * @desc 教材-查询教材习题数量
 * @param
 */
export function tiku_catSb_queryBankCount(data) {
  return request({
    url: '/tiku/v4/catSb/queryBankCount',
    method: 'post',
    data
  })
}

/**
 * @desc 测评系统
 * @param
 */
export function book_textbook_findCodeVerify(data) {
  return request({
    url: '/book/v1/textbook/findCodeVerify',
    method: 'post',
    data
  })
}

/**
 * @desc 是否有配套资源
 * @param
 */
export function resource_tbMatchPic_tbResStatistic(data) {
  return request({
    url: '/resource/tbMatchPic/tbResStatistic',
    method: 'post',
    data
  })
}

/**
 * @desc 获取全部学校
 * @param
 */
export function getAllSchool(data) {
  return request({
    url: '/ebook/school/list',
    method: 'post',
    data
  })
}

/**
 * @desc 上传教师资格证
 * @param
 */
export function uploadTeacherCard(data) {
  return request({
    url: '/user/teacherVerify/uploadTeacherInfo',
    method: 'post',
    data
  })
}

/**
 * 
 * @returns 获取用户信息
 */
export function getUserInfo(data) {
  return request({
    url: '/oauth/v4/user/infoByUid',
    method: 'post',
    data
  }) 
}

/**
 * 更新用户信息
 * @param {*} data 
 * @returns 
 */
export function changeUserInfo(data) {
  return request({
    url: '/oauth/v4/user/changeInfo',
    method: 'post',
    data
  }) 
}

/**
 * 查询教师认证状态
 * @param {*} data 
 * @returns 
 */
export function queryTeacherVerifyStatus(data) {
  return request({
    url: '/user/teacherVerify/queryTeacherVerifyStatus',
    method: 'post',
    data
  }) 
}

/**
 * 获取绑定手机号验证码之前
 * @returns 
 */
export function getBindPhoneSmsCodePre(data) {
  return request({
    url: '/sms/preSmsMsg',
    method: 'post',
    data
  }) 
}

/**
 * 获取绑定手机号验证码
 * @returns 
 */
export function getBindPhoneSmsCode(data) {
  return request({
    url: '/sms/thirdRegister',
    method: 'post',
    data
  }) 
}

/**
 * 绑定手机号
 */
export function thirdBindPhone(data) {
  return request({
    url: '/wx/register',
    method: 'post',
    data
  })
}

/**
 * 解绑
 * @param {*} data 
 * @returns 
 */
export function unRegister(data) {
  return request({
    url: '/wx/unRegister',
    method: 'post',
    data
  }) 
}


