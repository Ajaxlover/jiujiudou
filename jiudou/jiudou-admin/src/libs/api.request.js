import HttpRequest from "@/libs/axios";

const axios = new HttpRequest(process.env.BASE_URL);
export default axios;
