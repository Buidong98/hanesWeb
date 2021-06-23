var helper = {};

helper.getDateTimeNow = function(){
    let date = new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    let time = new Date().toLocaleTimeString("vi-VN");
    return date + " " + time;
}

module.exports = helper;