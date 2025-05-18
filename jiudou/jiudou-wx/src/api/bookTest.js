import request from '@/utils/request'

/**
 * @desc 获取练习题目
 * @param
 */
export function getQuestionList(data) {
  return request({
    url: '/ebook/dTbookSubjectBank/queryJustBankList',
    method: 'post',
    data
  })
}

/**
 * @desc 提交练习
 * @param
 */
export function submitQuestion(data) {
  return request({
    url: '/ebook/dTbookSubjectBank/submitAnswer',
    method: 'post',
    data
  })
}

/**
 * @desc 查看解析
 * @param
 */
export function querySubmitBankResult(data) {
  return request({
    url: '/ebook/dTbookSubjectBank/querySubmitBankResult',
    method: 'post',
    data
  })
}

/**
 * @desc 数据预览
 * @param
 */
export function queryData(data) {
  return request({
    url: '/ebook/dTbookSubjectBank/querySubmitResultStatistics',
    method: 'post',
    data
  })
}
