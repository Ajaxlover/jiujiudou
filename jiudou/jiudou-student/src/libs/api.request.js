import HttpRequest from "@/libs/axios";

const axios = new HttpRequest(process.env.VUE_APP_BASE_URL);
export default axios;
