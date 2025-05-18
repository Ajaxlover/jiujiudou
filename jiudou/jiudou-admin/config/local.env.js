"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"local"',
  SSO_URL: '"https://sso.guangyiedu.com/cas/login"',
  BASE_URL: '"https://api.guangyiedu.com/liubingnan"',
  BASE_URL_V2: "",
  CODE_IMPORT_WEBSOCKET: '"ws://192.168.0.127:10012/uploadBackUp"',
  THIS_URI: '"http://localhost:8081"',
  WEBSOCKET_URL: "wss://api.guangyiedu.com/login"
});
