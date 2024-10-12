// crowdfunding_db.js
const { createConnection } = require('mysql2');
// 连接数据库
const DB = createConnection({
  host: 'localhost',
  user: 'root',  /* cshi16_crowdfund mlu17_*/
  password: '123456',/* cshi16_crowdfund mlu17_*/
  database: 'crowdfunding_db',/* cshi16_crowdfunding_db mlu17_*/
}).promise();

module.exports = DB

