var Database = require("../../database/db_warehouse.js")
const db = new Database();
module.exports.getIndex = function (req, res) {
    let user = req.user;
    res.render('Warehouse/dashboard', { user: user });
}
