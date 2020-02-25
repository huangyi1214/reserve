
/**
 * 获取指定时间的日期
 */
exports.getday = function (day) {
    var day1 = new Date();
    day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000 * day);
    return day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
}
exports.gettimeArray = function (day) {
    return ['09:00'];
}