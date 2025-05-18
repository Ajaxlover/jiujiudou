
import Mock from 'mockjs';
//格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/api/courseList', 'post', require('./json/courseList'))
Mock.mock('/v1/login', 'post', require('./json/login'))
Mock.mock('/v1/user/info', 'post', require('./json/info'))
Mock.mock('/v1/role/menu', 'post', require('./json/menu'))

/*******************************************/
/******************   云课  ****************/
/*******************************************/
//新建云课基本信息
Mock.mock('v1/cCourse/addCCourse/baseInfo', 'post', require('./json/baseInfo'))
//编辑云课基本信息
Mock.mock('v1/cCourse/updateCC/cCIntro', 'post', require('./json/cCIntro'))
//新建云课或班目录
Mock.mock('v1/cCourse/addCCourse/addCat', 'post', require('./json/addCat'))
//跟新或删除目录章节
Mock.mock('v1/ccCat/updateGeneralCat', 'post', require('./json/updateGeneralCat'))
//加载课程内容列表
Mock.mock('v1/ccCat/selectLeafsOfCC', 'post', require('./json/selectLeafsOfCC'))
//加载章节内容列表
Mock.mock('v1/ccCat/selectLeafsOfCat', 'post', require('./json/selectLeafsOfCat'))
//查询云课列表
Mock.mock('v1/cCourse/selectCCList', 'post', require('./json/selectCCList'))
Mock.mock('v1/myCCourse/cCDetail/cCCat', 'post', require('./json/cCCat'))
Mock.mock('v1/cCourse/updateCC/cCCat', 'post', require('./json/updateCCat'))
Mock.mock('v1/resource/selectResFromPCRlPage', 'post', require('./json/selectResFromPCRlPage'))
Mock.mock('v1/resourceLibrary/selectPCSblList', 'post', require('./json/selectPCSblList'))
Mock.mock('v1/subjectBankLibrary/selectPOrCSblList', 'post', require('./json/selectPOrCSblList'))
Mock.mock('v1/subjectBank/selectSbFromPOrCSblPage', 'post', require('./json/selectSbFromPOrCSblPage'))

Mock.mock('v1/cCManageAndAudit/cCManage', 'post', require('./json/cCManage'))
//查询云课推荐分类列表
Mock.mock('v1/ccOfReco/selCCListOfReco', 'post', require('./json/selCCListOfReco'))
//从推荐分类移除云课
Mock.mock('v1/ccOfReco/batchDelCCsOfReco', 'post', require('./json/batchDelCCsOfReco'))
//查询不属于某推荐分类的云课列表
Mock.mock('v1/cCourse/selCCListNotInThisReco', 'post', require('./json/selCCListNotInThisReco'))
//从推荐分类添加云课
Mock.mock('v1/ccOfReco/batchInsCCToAReco', 'post', require('./json/batchInsCCToAReco'))
// 云课分析数据总览
Mock.mock('v1/cCDataAnalyse/dataOverview', 'post', require('./json/dataOverview'))
//我的云课统计数据-课程统计-学习统计
Mock.mock('v1/cCourse/myCCStatistics/courseStatistics', 'post', require('./json/courseStatistics'))
//我的云课统计数据-课程统计-学员名单
Mock.mock('v1/cCourse/myCCStatistics/stuList', 'post', require('./json/stuList'))
//查询云课详情（包含生成副本）
Mock.mock('v1/cCourse/ccDetailOfUpdateCC', 'post', require('./json/ccDetailOfUpdateCC'))
//详情
Mock.mock('v1/cCourse/selectDetailOfCCWithoutSb', 'post', require('./json/selectDetailOfCCWithoutSb'))
// 我的收益结算总览
Mock.mock('v1/ccStatement/sel2StaAccount', 'post', require('./json/sel2StaAccount'))
// 查询结算单列表(管理员或个人)
Mock.mock('v1/ccStatement/selStates', 'post', require('./json/selStates'))
// 收益总览
Mock.mock('v1/myEarnAndsettle/remainMoney', 'post', require('./json/remainMoney'))
// 收益月统计
Mock.mock('v1/statisCtl/allCCIncMonStatis', 'post', require('./json/earnMonthStatistics'))
// 收益明细
Mock.mock('v1/myEarnAndsettle/earnDetail', 'post', require('./json/earnDetail'))
// 我的订单
Mock.mock('v1/order/myListWithCount', 'post', require('./json/orderMange'))
// 结算管理
Mock.mock('v1/gYAdmin/accountManage/filterAcco', 'post', require('./json/filterAcco'))
// 上传结算凭证
Mock.mock('v1/ccStateProof/uploadStateProofs', 'post', require('./json/uploadStateProofs'))
// 订单管理
Mock.mock('v1/order/listWithCount', 'post', require('./json/orderFilter'))
// 云课讨论举报
Mock.mock('v1/feedback/discussListByPage', 'post', require('./json/selectBeRDiscussList'))
// 云课举报详情
Mock.mock('v1/reportOfcCDiscuss/rDetail', 'post', require('./json/rDetail'))
Mock.mock('v3/user/feedBack/listWithCount', 'post', require('./json/listWithCount'))
// 系统通知
Mock.mock('v1/user/systemMessage', 'post', require('./json/findMyMessage'))

/**** 班级 ****/
// 班级列表
Mock.mock('v1/calzz/mineClazz', 'post', require('./json/mineClazz'))
// 锁定班级
Mock.mock('calzz/v2/clazz/lockClazz', 'post', require('./json/lockClazz'))
// 结课
Mock.mock('calzz/v2/clazz/doneClazz', 'post', require('./json/doneClazz'))
// 删除班级
Mock.mock('calzz/v2/clazz/deleteClazz', 'post', require('./json/deleteClazz'))
// 修改班级信息
Mock.mock('v1/clazz/updInfo', 'post', require('./json/updInfo'))
// 班级详情
Mock.mock('v1/clazz/selInfo', 'post', require('./json/selInfo'))
// 学生列表
Mock.mock('v1/clazz/selStus', 'post', require('./json/selStus'))
// 导入学生
Mock.mock('v1/clazz/importStuXlsx', 'post', require('./json/importStuXlsx'))
// 移除学生
Mock.mock('v1/clazz/delStus', 'post', require('./json/delStus'))
// 签到汇总
Mock.mock('v1/clazz/selSignsSummary', 'post', require('./json/selSignsSummary'))
// 签到列表
Mock.mock('v1/clazz/selSigns', 'post', require('./json/selSigns'))
// 单次签到汇总
Mock.mock('v1/clazz/selSignDetailSummary', 'post', require('./json/selSignDetailSummary'))
// 签到详情
Mock.mock('v1/clazz/selSignDetail', 'post', require('./json/selSignDetail'))
// 应答汇总
Mock.mock('v1/clazz/selAnswersSummary', 'post', require('./json/selAnswersSummary'))
// 应答列表
Mock.mock('v1/clazz/selAnswers', 'post', require('./json/selAnswers'))
// 单次应答汇总
Mock.mock('v1/clazz/selAnswerDetailSummary', 'post', require('./json/selAnswerDetailSummary'))
// 应答详情
Mock.mock('v1/clazz/selAnswerDetail', 'post', require('./json/selAnswerDetail'))
// 作业汇总
Mock.mock('v1/clazz/selExercisesSummary', 'post', require('./json/selExercisesSummary'))
// 作业列表
Mock.mock('v1/clazz/selExercises', 'post', require('./json/selExercises'))
// 单次作业汇总
Mock.mock('v1/clazz/selExerciseDetailSummary', 'post', require('./json/selExerciseDetailSummary'))
// 作业详情
Mock.mock('v1/clazz/selExerciseDetail', 'post', require('./json/selExerciseDetail'))

// 学生进度列表
Mock.mock('v1/bCourse/stuProgressList', 'post', require('./json/stuProgressList'))
// 整体进度
Mock.mock('v1/bCourse/progress', 'post', require('./json/bCourseProgress'))

/*******************************************/
/******************   机构 ****************/
/*******************************************/
export default Mock
