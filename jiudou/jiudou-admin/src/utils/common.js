let types = [
  // { type: "0", name: "其他" },
  { type: "1", name: "判断题" },
  { type: "2", name: "单选题" },
  { type: "3", name: "多选题" },
  { type: "4", name: "填空题" },
  { type: "5", name: "问答题" },
  { type: "11", name: "组合题" }
];

let subTypes = [
  // { type: "0", name: "其他" },
  { type: "1", name: "判断题" },
  { type: "2", name: "单选题" },
  { type: "3", name: "多选题" },
  { type: "4", name: "填空题" },
  { type: "5", name: "问答题" }
];
/*
let types = [
  { type: "2", name: "单选题" },
  { type: "1", name: "判断题" },
  { type: "3", name: "多选题" },
  { type: "4", name: "填空题" },
  { type: "5", name: "解答题" },
  { type: "6", name: "证明题" },
  { type: "7", name: "计算题" },
  { type: "8", name: "分析题" },
  { type: "9", name: "论述题" },
  { type: "10", name: "完形填空" },
  { type: "11", name: "阅读理解" },
  { type: "0", name: "其他" },
  { type: "12", name: "组合题" }
];
*/

let allTypes = [
  { type: "", name: "全部" },
  { type: "1", name: "判断题" },
  { type: "2", name: "单选题" },
  { type: "3", name: "多选题" },
  { type: "4", name: "填空题" },
  { type: "5", name: "问答题" },
  // { type: "7", name: "计算题" },
  { type: "11", name: "组合题" }
];

let allAnswerTypes = [
  { type: "2", name: "单选题" },
  { type: "1", name: "判断题" },
  { type: "3", name: "多选题" }
];

let resTypes = [
  { type: "", name: "全部" },
  { type: "1", name: "音频" },
  { type: "2", name: "视频" },
  { type: "3", name: "AR" },
  { type: "4", name: "Excel" },
  { type: "5", name: "H5" },
  { type: "6", name: "PPT" },
  { type: "7", name: "Word" },
  { type: "9", name: "PDF" },
  { type: "10", name: "图片" },
  { type: "11", name: "文件夹" },
  { type: "12", name: "语音评测" },
  { type: "14", name: "压缩包" },
  { type: "15", name: "富文本" },
  { type: "0", name: "其他" }
];

let resType = [
  { type: "1", name: "音频" },
  { type: "2", name: "视频" },
  { type: "3", name: "AR" },
  { type: "4", name: "Excel" },
  { type: "5", name: "H5" },
  { type: "6", name: "PPT" },
  { type: "7", name: "Word" },
  { type: "9", name: "PDF" },
  { type: "10", name: "图片" },
  { type: "11", name: "文件夹" },
  { type: "12", name: "语音评测" },
  { type: "15", name: "富文本" },
  { type: "0", name: "其他" }
];

let payTypes = [
  { type: "", name: "全部" },
  { type: "1", name: "支付宝" },
  { type: "2", name: "微信支付" },
  // { type: '3', name: '银联卡' },
  { type: "4", name: "余额支付" },
  { type: "5", name: "苹果支付" }
];

function payTypeFormat(payType) {
  if (payType === undefined) {
    return "";
  }
  let type = "";
  for (let i = 0; i < payTypes.length; i++) {
    let element = payTypes[i];
    if (element.type === String(payType)) {
      type = element.name;
      break;
    }
  }
  return type;
}

let cloudCourseType = [
  { type: 1, name: "个人提升" },
  { type: 2, name: "实战课" },
  { type: 3, name: "校园金课" }
];

let brushType = [
  { type: 1, name: "期末考" },
  { type: 2, name: "四六级" },
  { type: 3, name: "考研类" }
];

let cloudCourseStatus = [
  { type: "0", name: "未发布" },
  { type: "1", name: "审核中" },
  { type: "2", name: "已通过" },
  { type: "3", name: "未通过" }
];

let diffs = [
  { type: "0", name: "容易" },
  { type: "1", name: "较易" },
  { type: "2", name: "中等" },
  { type: "3", name: "较难" },
  { type: "4", name: "很难" }
];

let allDiffs = [
  { type: "", name: "全部" },
  { type: "0", name: "容易" },
  { type: "1", name: "较易" },
  { type: "2", name: "中等" },
  { type: "3", name: "较难" },
  { type: "4", name: "很难" }
];

// 难度系数
let allRateLevel = [
  { type: "", name: "全部" },
  { type: "EASY", name: "0~0.25(容易)" },
  { type: "MEDIUM", name: "0.25~0.5(适中)" },
  { type: "MORE_DIFFICULT", name: "0.5~0.75(较难)" },
  { type: "HARD", name: "0.75~1(难)" }
];

function typeFormat(tSubject) {
  if (tSubject === undefined) {
    return "";
  }
  if (tSubject == 0) {
    return "其他";
  }
  let type = "";
  for (let i = 0; i < allTypes.length; i++) {
    let element = allTypes[i];
    if (element.type === String(tSubject)) {
      type = element.name;
      break;
    }
  }
  return type;
}

function resTypeFormat(tSubject) {
  if (tSubject === undefined) {
    return "";
  }
  let type = "";
  for (let i = 0; i < resTypes.length; i++) {
    let element = resTypes[i];
    if (element.type === String(tSubject)) {
      type = element.name;
      break;
    }
  }
  return type;
}

function diffFormat(diff) {
  if (diff === undefined) {
    return "";
  }
  let d = "";
  for (let i = 0; i < allDiffs.length; i++) {
    let element = allDiffs[i];
    if (element.type === String(diff)) {
      d = element.name;
      break;
    }
  }
  return d;
}

function mathBrushType(courseType) {
  let type = "";
  for (let i = 0; i < brushType.length; i++) {
    let element = brushType[i];
    if (element.type == courseType) {
      type = element.name;
      break;
    }
  }
  return type;
}

function mathCourseType(courseType) {
  if (courseType === undefined) {
    return 3;
  }
  let type = 3;
  for (let i = 0; i < cloudCourseType.length; i++) {
    let element = cloudCourseType[i];
    if (element.type === courseType) {
      type = element.name;
      break;
    }
  }
  return type;
}

function mathCourseStatus(courseStatus) {
  if (courseStatus === undefined) {
    return "";
  }
  let type = "";
  for (let i = 0; i < cloudCourseStatus.length; i++) {
    let element = cloudCourseStatus[i];
    if (element.type === String(courseStatus)) {
      type = element.name;
      break;
    }
  }
  return type;
}
//取文件后缀
function getFileType(file) {
  let index1 = file.lastIndexOf(".");
  let index2 = file.length;
  return file.substring(index1, index2);
}

export default {
  types,
  subTypes,
  allTypes,
  allAnswerTypes,
  diffs,
  allDiffs,
  allRateLevel,
  typeFormat,
  payTypeFormat,
  diffFormat,
  resTypes,
  resType,
  payTypes,
  resTypeFormat,
  cloudCourseType,
  mathBrushType,
  mathCourseType,
  cloudCourseStatus,
  mathCourseStatus,
  getFileType
};
