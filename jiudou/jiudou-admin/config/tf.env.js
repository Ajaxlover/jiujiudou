"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"alpha"',
  SSO_URL: '"https://sso.guangyiedu.com/cas/login"',
  BASE_URL: '"https://tfapi.guangyiedu.com/liubingnan"',
  BASE_URL_V2: '"https://tfapi.guangyiedu.com/v2"',
  BASE_URL_V3: '"https://tfapi.guangyiedu.com/v3"',
  JG_App_Key: '"c1a09d1111adc53ddd7011bd"',
  CODE_IMPORT_WEBSOCKET: '"wss://tfapi.guangyiedu.com/liubingnan/uploadBackUp"',
  THIS_URI: '"https://tfwww.jiudou123.com/admin"',
  WEBSOCKETAPI_URL: "wss://api.guangyiedu.com/login"
});
