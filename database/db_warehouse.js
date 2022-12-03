const mysql = require("mysql2");
const util = require("util");
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "sewing_needle_realtime"
});
const query = util.promisify(con.query).bind(con);
class database {
  async QueryAsync(queryString) {
    try {
      var result = await query(queryString);
      return result;
    }
    catch (error) {
      return null;
    }
  }
}
module.exports = database;