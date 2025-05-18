"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SSO_URL: '"https://sso.guangyiedu.com/cas/login"',
  BASE_URL: '"https://api.guangyiedu.com/liubingnan"',
  BASE_URL_V2: '"http://192.168.0.127:8088"',
  CODE_IMPORT_WEBSOCKET: '"ws://192.168.0.127:10012/uploadBackUp"', // 上传教材二维码的socket地址
  THIS_URI: '"http://localhost:8080"'
});
