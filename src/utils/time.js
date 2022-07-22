/**
 * 格式化日期时间
 * @param {datetime} dateTime
 * @returns {string}
 */
export function formatDateTime(dateTime) {
  var y = dateTime.getFullYear()
  var MM = dateTime.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  var d = dateTime.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = dateTime.getHours()
  h = h < 10 ? ('0' + h) : h
  var m = dateTime.getMinutes()
  m = m < 10 ? ('0' + m) : m
  var s = dateTime.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}

/**
 * 格式化日期
 * @param {date} date
 * @returns {string}
 */
export function formatDate(date) {
  var y = date.getFullYear()
  var MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + MM + '-' + d
}

/**
 * 格式化开始日期
 * @param {date} date
 * @returns {string}
 */
export function formatStartDate(date) {
  var y = date.getFullYear()
  var MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + MM + '-' + d + ' 00:00:00'
}

/**
 * 格式化结束日期
 * @param {date} date
 * @returns {string}
 */
export function formatEndDate(date) {
  var y = date.getFullYear()
  var MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + MM + '-' + d + ' 23:59:59'
}
