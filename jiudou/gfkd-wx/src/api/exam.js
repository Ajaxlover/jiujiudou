import request from '@/utils/request'

/**
 * @desc 上传图片
 * @param
 */
export function uploadImage(data) {
  return request({
    url: '/upload/uploadImage',
    method: 'post',
    data
  })
}

/**
 * @desc 获取考试详情(开始参赛)
 * @param
 */
export function getContestInfo(data) {
  return request({
    url: '/exam/exam/student/getExamInfo',
    method: 'post',
    data
  })
}

/**
 * @desc 报名
 * @param
 */
export function registerJoin(data) {
  return request({
    url: '/exam/masterHeadStu/register',
    method: 'post',
    data
  })
}

/**
 * @desc 立即参赛获取考试id
 * @param
 */
export function contestBegin(data) {
  return request({
    url: '/exam/masterHeadCompete/getCompeteExam',
    method: 'post',
    data
  })
}

/**
 * @desc 获取考试id(赛前模拟)
 * @param
 */
export function contestMockBegin(data) {
  return request({
    url: '/exam/masterHeadCompete/getCompeteMock',
    method: 'post',
    data
  })
}

/**
 * @desc 开始考试校验
 * @param
 */
export function checkStartExam(data) {
  return request({
    url: '/exam/exam/student/checkStartExam',
    method: 'post',
    data
  })
}

/**
 * @desc 获取考试题目
 * @param
 */
export function getExamSubject(data) {
  return request({
    url: '/exam/exam/student/startExam',
    method: 'post',
    data
  })
}

/**
 * @desc 提交试卷
 * @param
 */
export function submitExam(data) {
  return request({
    url: '/exam/exam/student/submitExam',
    method: 'post',
    data
  })
}

/**
 * @desc 查询考试成绩
 * @param
 */
export function getExamScore(data) {
  return request({
    url: '/exam/exam/student/getResultScore',
    method: 'post',
    data
  })
}

/**
 * @desc 查询考试答卷
 * @param
 */
export function getPaper(data) {
  return request({
    url: '/exam/exam/student/getResultDetail',
    method: 'post',
    data
  })
}
