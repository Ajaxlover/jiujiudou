import axios from "axios";
import router from "@/router";
import store from "@/store";
import { Stream } from "stream";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url);
        const { data, status } = res;
        if (data.code === -6) {
          store.dispatch("logout").then(res => {
            router.push({
              name: "login"
            });
          });
        }
        return { data, status };
      },
      error => {
        this.destroy(url);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create({
      transformRequest: [
        function transformRequest(data, headers) {
          if (!data) {
            data = {
              client: 4
            };
          }
          if (
            data instanceof FormData ||
            data instanceof ArrayBuffer ||
            data instanceof Buffer ||
            data instanceof Stream ||
            data instanceof File ||
            data instanceof Blob
          ) {
            // 接口参数 token
            data.append("client", 4);
            if (!data.has("token")) {
              data.append("token", store.state.user.token);
              data.append("uid", store.state.user.userId);
            }
            return data;
          } else if (data instanceof URLSearchParams) {
            // 接口参数 token
            data.append("client", 4);
            if (!data.has("token")) {
              data.append("token", store.state.user.token);
              data.append("uid", store.state.user.userId);
            }
            headers["Content-Type"] =
              "application/x-www-form-urlencoded;charset=utf-8";
            return data.toString();
          } else if (data instanceof Object) {
            // 接口参数 token
            data.client = 4;
            data.token = store.state.user.token;
            data.uid = store.state.user.userId;
            headers["Content-Type"] =
              "application/x-www-form-urlencoded;charset=utf-8";
            let _data = Object.keys(data);
            return _data
              .map(name => `${name}=${encodeURIComponent(data[name])}`)
              .join("&");
          }
          return data;
        }
      ]
    });
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
