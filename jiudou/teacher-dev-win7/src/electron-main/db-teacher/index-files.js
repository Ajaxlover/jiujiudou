const localstorage = require("electron-localstorage");
const { app: app2 } = require("electron");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fs_extra = require("fs-extra");
const app = express();
const os = require("os");
const path = require("path");
const multer = require("multer");
var request = require("request");
const isDev = require("electron-is-dev");
let host = isDev
  ? "https://tfapi.guangyiedu.com"
  : "https://api.guangyiedu.com";

// let host = "https://tfapi.guangyiedu.com";//预发
// let host = "https://api.guangyiedu.com";//生产

const { saveOrUpdateLocalFile } = require("./index-serve.js");
app.use(cors());

// 设置存储上传文件的目录和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const searchParams = getQueryParams(req.url);
    const floder_name = searchParams["floder_name"] || "uploads-answer";
    const exam_id = searchParams["exam_id"];
    const exam_name = searchParams["exam_name"];
    const s_number = searchParams["s_uid"];
    const questionNum = searchParams["questionNum"];
    // const uploadPath = `${floder_name}/${exam_id}/${s_number}/${questionNum}/`; // 动态设置存储路径
    let uploadPath = "";
    if (floder_name === "uploads-answer") {
      uploadPath = `${floder_name}/${exam_id}/${s_number}/${questionNum}/`;
    } else {
      uploadPath = `${floder_name}/${exam_name}/${s_number}/${questionNum}/`;
    }
    const realPath = app2.getAppPath() + (isDev ? "\\" : "/") + uploadPath;
    try {
      if (floder_name !== "monitor") {
        fs_extra.emptyDirSync(realPath);
      }
    } catch (error) { }

    fs.mkdir(realPath, { recursive: true }, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, realPath);
    });
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "files")));

app.post("/uploadAvatar", upload.single("image"), (req, res) => {
  // `req.file` contains the uploaded image file
  // You can do further processing or saving of the image here
  const fileRealPath = path.join(__dirname, "avatar/", req.file.filename); // 获取文件真实路径

  res.json({
    code: 200,
    msg: "文件上传成功",
    data: { sourceUrl: fileRealPath },
  });

  // 以下代码暂时注释
  // const file = req.file;

  // const searchParams = getQueryParams(req.url);

  // const floder_name = searchParams["floder_name"] || "avatar";
  // const exam_name = searchParams["exam_name"];
  // const s_number = searchParams["s_uid"];
  // const questionNum = searchParams["questionNum"];
  // const uploadPath = `/${floder_name}/${exam_name}/${s_number}/${questionNum}/${req.file.filename}`; // 动态设置存储路径

  // // 可以根据需要将文件内容转换成字符串、Buffer或直接传给接口
  // const fileData = fs.readFileSync(file.path);

  // // 构建请求的参数
  // const requestOptions = {
  //   url: host + "/v3/common/feign/upload/uploadConven",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "multipart/form-data", // 设置合适的Content-Type
  //   },
  //   formData: {
  //     file: {
  //       value: fileData, // 文件内容
  //       options: {
  //         filename: file.originalname, // 文件名
  //       },
  //     },
  //     dev: "prod",
  //     cosPath: uploadPath,
  //     realPath: fileRealPath,
  //     fileName: file.originalname,
  //     // 可以添加其他参数
  //   },
  // };

  // // 发送POST请求给其他接口
  // request(requestOptions, (error, response, body) => {
  //   if (error) {
  //     console.error("Error:", error);
  //     return res.status(500).json({ error: "Server error" });
  //   }
  //   // 做一些处理后，将结果返回给前端
  //   res.json({ code: 200, msg: "文件上传成功", data: JSON.parse(body) });
  // });
});
app.post("/uploadScreen", upload.single("image"), (req, res) => {
  res.json({ code: 200, msg: "文件保存成功" });
});
app.post("/uploadFile", upload.single("file"), (req, res) => {
  const uploadFileOnline = localstorage.getItem("uploadFileOnline");
  if (uploadFileOnline === "0") {
    // res.json({ code: 200, msg: "文件上传成功", data: {} });
    offlineFile(req, res);
    return;
  }
  const fileRealPath = path.join(
    __dirname,
    "uploads-answer/",
    req.file.filename
  ); // 获取文件真实路径

  const file = req.file;

  const searchParams = getQueryParams(req.url);
  const floder_name = searchParams["floder_name"] || "uploads-answer";
  const exam_name = searchParams["exam_id"];
  const s_number = searchParams["s_uid"];
  const questionNum = searchParams["questionNum"];
  const uploadPath = `/${floder_name}/${exam_name}/${s_number}/${questionNum}/${req.file.filename.replace(
    /\+/g,
    "%2B"
  )}`; // 动态设置存储路径
  const fileData = fs.readFileSync(file.path);
  // const fileData = fs.createReadStream(file.path);

  // 构建请求的参数
  const requestOptions = {
    url: host + "/v3/common/feign/upload/uploadConven",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data", // 设置合适的Content-Type
    },
    formData: {
      file: {
        value: fileData, // 文件内容
        options: {
          filename: encodeURIComponent(file.originalname), // 文件名
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      },
      dev: "prod",
      cosPath: uploadPath,
      realPath: fileRealPath,
      fileName: encodeURIComponent(file.originalname),
      // 可以添加其他参数
    },
  };

  // 发送POST请求给其他接口
  request(requestOptions, (error, response, body) => {
    if (error || !body) {
      console.error("Error:", error);
      return res.json({
        code: 500,
        msg: "文件上传失败，您的文件名含有非法字符",
      });
    }
    // 做一些处理后，将结果返回给前端
    res.json({ code: 200, msg: "文件上传成功", data: JSON.parse(body) });
  });
});

function offlineFile(req, res) {
  const searchParams = getQueryParams(req.url);
  const exam_id = searchParams["exam_id"];
  const s_uid = searchParams["s_uid"];
  const bank_id = searchParams["bank_id"];
  const file_type = searchParams["file_type"];
  const local_path = `/${exam_id}/${s_uid}/${bank_id}/${req.file.filename.replace(
    /\+/g,
    "%2B"
  )}`;

  // ---
  const floder_name = searchParams["floder_name"] || "uploads-answer";
  const exam_name = searchParams["exam_name"];
  const questionNum = searchParams["questionNum"];
  const uploadPath = `/${exam_id}/${s_uid}/${questionNum}/${req.file.filename.replace(
    /\+/g,
    "%2B"
  )}`; // 动态设置存储路径
  console.log(uploadPath);
  //-----end-----
  const file = req.file;
  // const absolutePath = path.join(__dirname, "uploads-answer/", uploadPath);
  // const searchParams = getQueryParams(req.url);
  // const realPath = app2.getAppPath() + (isDev ? "\\" : "\/") + file.path;
  const realPath = file.path;
  console.log("realPath", realPath);
  // 可以根据需要将文件内容转换成字符串、Buffer或直接传给接口
  const fileData = fs.readFileSync(file.path);
  //todo-mingming 将文件保存到本地

  //保存文件记录
  const options = {
    exam_id: exam_id,
    uid: s_uid,
    file_type: file_type,
    bank_id: bank_id,
    local_path: local_path,
    oss_path: "",
    create_time: new Date(),
    update_time: new Date(),
    //原来
    full_path: realPath,
    filename: file.originalname,
    cosPath: local_path,
  };
  saveOrUpdateLocalFile(options)
    .then(() => {
      let context = {
        code: 200,
        data: {
          sourceUrl: local_path,
        },
        msg: "文件上传成功",
      };
      res.json(context);
    })
    .catch((error) => {
      console.error("文件上传失败：", error);
      let context = {
        code: 100,
        data: "",
        msg: "文件上传成功失败",
      };
      res.json(context);
    });
}
app.post("/backup/uploadFile", upload.single("file"), (req, res) => {
  // const fileRealPath = path.join(
  //   __dirname,
  //   "uploads-answer/",
  //   req.file.filename
  // ); // 获取文件真实路径
  // console.log(fileRealPath);
  // todo saveOrUpdateLocalFile(exam_id,uid,file_type,bank_id,local_path)
  // todo return;
  const searchParams = getQueryParams(req.url);
  const exam_id = searchParams["exam_id"];
  const s_uid = searchParams["s_uid"];
  const bank_id = searchParams["bank_id"];
  const file_type = searchParams["file_type"];
  const local_path = `/${exam_id}/${s_uid}/${bank_id}/${req.file.filename}`;

  // ---
  const floder_name = searchParams["floder_name"] || "uploads-answer";
  const exam_name = searchParams["exam_name"];
  const questionNum = searchParams["questionNum"];
  const uploadPath = `/${exam_id}/${s_uid}/${questionNum}/${req.file.filename}`; // 动态设置存储路径
  console.log(uploadPath);
  //-----end-----
  const file = req.file;
  // const absolutePath = path.join(__dirname, "uploads-answer/", uploadPath);
  // const searchParams = getQueryParams(req.url);
  console.log("file.path)", app2.getAppPath() + "/" + file.path);
  const realPath = app2.getAppPath() + "/" + file.path;
  // 可以根据需要将文件内容转换成字符串、Buffer或直接传给接口
  const fileData = fs.readFileSync(file.path);
  //todo-mingming 将文件保存到本地

  //保存文件记录
  const options = {
    exam_id: exam_id,
    uid: s_uid,
    file_type: file_type,
    bank_id: bank_id,
    local_path: local_path,
    oss_path: "",
    create_time: new Date(),
    update_time: new Date(),
    //原来
    full_path: realPath,
    filename: file.originalname,
    cosPath: local_path,
  };
  saveOrUpdateLocalFile(options)
    .then(() => {
      let context = {
        code: 200,
        data: {
          sourceUrl: local_path,
        },
        msg: "文件上传成功",
      };
      res.json(context);
    })
    .catch((error) => {
      console.error("文件上传失败：", error);
      let context = {
        code: 100,
        data: "",
        msg: "文件上传成功失败",
      };
      res.json(context);
    });

  // 构建请求的参数
  /*const requestOptions = {
    url: host + '/v3/common/feign/upload/uploadConven',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data' // 设置合适的Content-Type
    },
    formData: {
      file: {
        value: fileData, // 文件内容
        options: {
          filename: file.originalname // 文件名
        }
      },
      dev: 'prod',
      cosPath: uploadPath,
      realPath: fileRealPath,
      fileName: file.originalname,
      // 可以添加其他参数
    }
  };

  // 发送POST请求给其他接口
  request(requestOptions, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
    // 做一些处理后，将结果返回给前端
    res.json({ code: 200, msg: "文件上传成功", data: JSON.parse(body) });
  });*/
  //res.json({ code: 200, msg: "文件上传成功", data: JSON.parse(body) });
});
// app.post("/upload", upload.single("file"), (req, res) => {
//   const fileRealPath = path.join(__dirname, "uploads-answer/", req.file.filename); // 获取文件真实路径
//   res.json({ code: 200, msg: "File uploaded successfully!", filePath: fileRealPath });
//   // res.send("File uploaded successfully!");
// });

const port = 20237;
// 获取局域网的IP地址
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    const iface = interfaces[ifaceName];
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "127.0.0.1"; // 如果找不到局域网的IP地址，则默认为本地回环地址
}

const ipAddress = getLocalIpAddress();
let server = app.listen(port, ipAddress, () => {
  console.log(`Server running at http://${ipAddress}:${port}/`);
});

function openServerFile(params) {
  server = app.listen(port, ipAddress, () => {
    console.log(`Server running at http://${ipAddress}:${port}/`);
  });
}

// 在需要关闭服务的时候调用以下函数
function stopServer() {
  if (server) {
    server.close(() => {
      console.log("Server has been closed");
      process.exit(0);
    });
  }
}

// 假设URL是 http://example.com/?name=John&age=30
function getQueryParams(url) {
  const params = {};
  const searchParams = url.split("?")[1];
  if (searchParams) {
    const paramPairs = searchParams.split("&");
    for (const pair of paramPairs) {
      const [key, value] = pair.split("=");
      params[key] = decodeURIComponent(value);
    }
  }
  return params;
}

// 在应用程序退出时关闭服务器
process.on("exit", () => {
  stopServer();
});

// 处理中断信号（例如 Ctrl+C）
process.on("SIGINT", () => {
  stopServer();
});

// 处理未捕获的异常
process.on("uncaughtException", (error) => {
  console.error("未捕获的异常:", error);
  // server.close(() => {
  //   process.exit(1);
  // });
});

module.exports = { openServerFile };
