import Cookies from "js-cookie";

export const TOKEN_KEY = "token";

export const STU_TOKEN_KEY = "stu_token";

export const STU__USERINFO = "stu_info";

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 });
};

export const setStuToken = token => {
  Cookies.set(STU_TOKEN_KEY, token, { expires: 1 });
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};

export const getStuToken = () => {
  const token = Cookies.get(STU_TOKEN_KEY);
  if (token) return token;
  else return false;
};

export const setStuInfo = info => {
  Cookies.set(STU__USERINFO, info, { expires: 1 });
};

export const removeStuInfo = () => {
  Cookies.remove(STU__USERINFO);
};
export const removeStuToken = () => {
  Cookies.remove(STU_TOKEN_KEY);
};
