import request from "@/render/service/axios";

import type { UserType } from "./types";
import { request_url } from "@/render/utils/config";
const isDev = location.hostname.indexOf("localhost") > -1;
// const host = isDev
//   ? "https://tfapi.guangyiedu.com"
//   : "https://api.guangyiedu.com";

const host = request_url;
// 登录
export const loginApi = (data: any): Promise<any> => {
  return request.post({
    url: host + "/liubingnan/v1/login",
    data,
    headersType: "application/x-www-form-urlencoded",
  });
};
// 获取教师信息
export const getTeacherInfo = (data: any): Promise<any> => {
  return request.post({
    url: host + "/liubingnan/v1/user/info",
    data,
  });
};

//用户信息
export const getUserInfor = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: "/api/student/getExamInfo",
        data,
        headersType: "application/x-www-form-urlencoded",
      })
    );
  });
};

//用户信息
export const startExam = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: "/api/student/getPaperInfo",
        data,
        headersType: "application/x-www-form-urlencoded",
      })
    );
  });
};
//考试列表
export const examList = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/examList",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};

//学生管理列表
export const stuList = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/stuList",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//添加学生
export const addStu = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/addStudent",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//学生编辑
export const updateStudent = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/updateStudent",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//学生删除
export const delStudent = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/delStudent",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//批量上传
// export const addStuFile = (data: any): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     resolve(
//       request.post({
//         url: "/api/teacher/addStuFile",
//         data,
//         // headersType: "application/x-www-form-urlencoded"
//       })
//     );
//   });
// };
//查询配置列表
export const getSysSet = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/getSysSet",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//新增配置列表
export const addSysSet = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/addSysSet",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//更新配置
export const updateSysSet = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/updateSysSet",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//学生信息同步
export const syncStuInfo = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/syncStuInfo",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//考试信息同步
export const syncStuResult = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/syncStuResult",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//查询学生列表
export const queryStuInfoList = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/queryStuInfoList",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//同步考试列表
export const getExamList = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/getExamList",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//同步九斗学生信息
export const queryJiudouStuInfoList = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/queryStuInfoList",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
//退出登录
export const logout = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/student/logout",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
export const syncLocalFile = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/rpc/syncLocalFile",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
export const batchGetExamResult = (data: any): Promise<any> => {
  const ipAdr = isDev ? "" : sessionStorage.getItem("ipLocal");
  return new Promise((resolve, reject) => {
    resolve(
      request.post({
        url: ipAdr + "/api/teacher/batchGetExamResult",
        data,
        // headersType: "application/x-www-form-urlencoded"
      })
    );
  });
};
