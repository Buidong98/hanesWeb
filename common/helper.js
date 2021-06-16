var helper = {};

helper.getDateTimeNow = function(){
    let date = new Date().toLocaleDateString("vi-VN");
    let time = new Date().toLocaleTimeString("vi-VN")
    return date + " " + time;
}

module.exports = helper;