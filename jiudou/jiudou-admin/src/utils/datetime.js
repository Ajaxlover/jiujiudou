import moment from "moment";
/**
 * 时间日期相关操作
 */

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime) {
  if (datetime === undefined) {
    return "";
  }
  let iDate = parseInt(datetime);
  return moment(iDate).format("YYYY-MM-DD HH:mm");
}

export function formatSS(datetime) {
  if (datetime === undefined) {
    return "";
  }
  let iDate = parseInt(datetime);
  return moment(iDate).format("YYYY-MM-DD HH:mm:ss");
}

export function dateStr(format) {
  let date = new Date();
  return moment(date).format(format);
}

export function formatYMD(datetime) {
  // 返回年月日
  if (datetime === undefined) {
    return "";
  }
  let iDate = parseInt(datetime);
  return moment(iDate).format("YYYY-MM-DD");
}
