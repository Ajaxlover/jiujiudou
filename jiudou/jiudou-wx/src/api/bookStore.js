import request from '@/utils/request'

/**
 * @desc 获取全部学科列表
 * @param
 */
export function subject_subject_listAll(data) {
    return request({
        url: '/subject/subject/listAll',
        method: 'post',
        data
    })
}

/**
 * @desc 获取书城图书
 * @param
 */
export function book_bookApp_getRecoBooks(data) {
    return request({
        url: '/book/bookApp/getRecoBooks',
        method: 'post',
        data
    })
}

/**
 * @desc 【学生】- 数字教材详情
 * @param
 */
export function ebook_digitalBook_index_detail(data) {
    return request({
        url: '/ebook/digitalBook/index/detail',
        method: 'post',
        data
    })
}

/**
 * @desc 【学生】- 教材详情
 * @param
 */
export function book_lucene_bookDetail(data) {
    return request({
        url: '/book/lucene/bookDetail',
        method: 'post',
        data
    })
}

/**
 * @desc 【学生】- 查询教材是否有教师专用资源
 * @param
 */
export function book_bookApp_hasTeaRes(data) {
    return request({
        url: '/book/bookApp/hasTeaRes',
        method: 'post',
        data
    })
}

/**
 * @desc 资源发送邮件
 * @param
 */
export function resource_tbMatchPic_getResEmail(data) {
    return request({
        url: '/resource/tbMatchPic/getResEmail',
        method: 'post',
        data
    })
}

/**
 * @desc 验证教材
 * @param
 */
export function book_bookVerify_bookVerifyV2(data) {
    return request({
        url: '/book/bookVerify/bookVerifyV2',
        method: 'post',
        data
    })
}

/**
 * @desc 恢复数字教材
 * @param
 */
export function ebook_dTbookUser_bookPay(data) {
    return request({
        url: '/ebook/dTbookUser/bookPay',
        method: 'post',
        data
    })
}

/**
 * @desc 恢复教材
 * @param
 */
export function book_textbook_resumeBook(data) {
    return request({
        url: '/book/v1/textbook/resumeBook',
        method: 'post',
        data
    })
}

