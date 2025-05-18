const { app } = require("electron");
const os = require("os");
const path = require("path");
const http = require("http");
var querystring = require("querystring");
var request = require("request");
var fs = require("fs");
const isDev = require("electron-is-dev");
console.log(isDev);
const host = isDev
  ? "https://tfapi.guangyiedu.com"
  : "https://api.guangyiedu.com";
// let host = "https://tfapi.guangyiedu.com";//预发
// let host = "https://api.guangyiedu.com";//生产

//生产
const userDataPath = app.getPath("userData");
const userDbPath = path.join(userDataPath, "mydb.db");

//开发
// const userDbPath = path.resolve(__dirname, "mydb.db");

const knex = require("knex")({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: userDbPath,
  },
});

// const get_examInfo = async (p, snum) => {
//   return knex("bus_exam")
//     .select("*")
//     .where("password", "=", p)
//     .then((rows) => {
//       const exam = rows;
//       // console.log('exam', exam);
//       if (exam == null || exam == "") {
//         ////console.log("查询结果为空======");
//         return new Promise((resolve, reject) => {
//           resolve("");
//         });
//       }
//       let class_id = exam[0].id;
//       return knex("sj_class_member")
//         .select("*")
//         .where("class_id", "=", class_id)
//         .where("s_number", "=", snum)
//         .then((rows) => {
//           // console.log(rows, 'rows');
//           const stu = rows || [];
//           if (stu == null || stu == "" || stu.length == 0) {
//             //todo 如果学号不存在，则新增学生信息 dataType:0,login_status：0
//             //学号不存在新增start
//             console.log('学生信息不存在，进入新增流程---')
//             const options = {
//               examId: class_id,
//               s_number: snum,
//               dataType: 0
//             }
//             saveOrUpdateImportStu(options).then((data) => {
//               console.log('学生信息保存或更新成功，返回的id为：', data);
//               // 在这里可以使用返回的id进行其他操作
//               // let addSku = {
//               //   id: data.data.id,
//               //   class_id: class_id,
//               //   s_number: snum,
//               //   data_type: 0,
//               //   login_status: 0
//               // }
//               // console.log('入参', addSku);
//               // stu.push(addSku)
//               // const allInfo = { exam: exam, stu: stu };
//               // return new Promise((resolve, reject) => {
//               //   resolve(allInfo);
//               // });
//               return get_examInfo(p, snum);
//             })
//               .catch((error) => {
//                 console.error('保存或更新学生信息时出错：', error);
//                 return new Promise((resolve, reject) => {
//                   resolve("");
//                 });
//               });
//             //学号不存在，新增end ，正常客户需要去掉
//           } else {
//             if (stu[0].login_status == 1) {
//               return new Promise((resolve, reject) => {
//                 resolve("用户已经在其他端登录");
//               });
//             }
//             login(stu[0].id);
//             const allInfo = { exam: exam, stu: stu };
//             console.log('allInfo');
//             return new Promise((resolve, reject) => {
//               resolve(allInfo);
//             });
//           }
//         });
//     });
// };
const get_examInfo = async (p, snum) => {
  try {
    const exam = await knex("bus_exam")
      .select("*")
      .where("password", "=", p);

    if (!exam || exam.length === 0) {
      console.log("查询结果为空======");
      return null;
    }

    const class_id = exam[0].id;
    const stu = await knex("sj_class_member")
      .select("*")
      .where("class_id", "=", class_id)
      .where("s_number", "=", snum);

    if (!stu || stu.length === 0) {
      console.log('学生信息不存在，进入新增流程---');
      const options = {
        examId: class_id,
        s_number: snum,
        dataType: 0
      };

      const data = await saveOrUpdateImportStu(options);

      if (data && data.data) {
        console.log('学生信息保存或更新成功，返回的id为：', data.data);

        return await get_examInfo(p, snum);
      }
    } else {
      if (stu[0].login_status === 1) {
        return "用户已经在其他端登录";
      }

      login(stu[0].id);
      const allInfo = { exam: exam, stu: stu };
      console.log('allInfo:', allInfo);
      return allInfo;
    }
  } catch (error) {
    console.error('Error in get_examInfo:', error);
    return null;
  }
};
//分页查询学生列表 dataType:0 本地学生 1:远程学生
const getMembersBySNumber = async (options) => {
  // 获取查询参数
  const { sNumber, examId, dataType, synStatus, pageIndex, pageSize } = options;
  // 计算查询起始索引
  const offset = (pageIndex - 1) * pageSize;

  // 构建查询条件
  const query = knex("sj_class_member")
    .orderBy("id")
    .offset(offset)
    .limit(pageSize);
  if (sNumber) {
    query.where("s_number", "like", `${sNumber}%`); // 如果 sNumber 不为空，则添加该条件
  }
  if (examId) {
    query.where("class_id", "=", `${examId}`);
  }
  if (dataType >= 0) {
    query.where("data_type", "=", `${dataType}`);
  }
  if (synStatus >= 0) {
    query.where("syn_status", "=", `${synStatus}`);
  }
  const results = await query; // 执行查询
  const totalCount = await getMembersBySNumberCount(options);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    data: results,
    meta: {
      totalCount,
      totalPages,
    },
  };
};
//查询学生总数
const getMembersBySNumberCount = async (options) => {
  // 获取查询参数
  const { sNumber, examId, dataType, synStatus } = options;

  // 构建查询条件
  const query = knex("sj_class_member").orderBy("id");
  if (sNumber) {
    query.where("s_number", "like", `${sNumber}%`); // 如果 sNumber 不为空，则添加该条件
  }
  if (examId) {
    query.where("class_id", "=", `${examId}`);
  }
  if (dataType >= 0) {
    query.where("data_type", "=", `${dataType}`);
  }
  if (synStatus >= 0) {
    query.where("syn_status", "=", `${synStatus}`);
  }
  const totalCountSum = await query.count();
  const totalCount = totalCountSum.reduce(
    (sum, obj) => sum + obj["count(*)"],
    0
  );
  return totalCount;
};
//分页查询考试信息
const getExamList = async (options) => {
  // 获取查询参数
  const {
    createTimeStart,
    createTimeEnd,
    examName,
    uid,
    password,
    pageSize,
    pageIndex,
  } = options;

  // 计算查询起始索引
  const offset = (pageIndex - 1) * pageSize;

  // 计算总记录数
  const query = knex("bus_exam")
    .orderBy("create_time", "desc")
    .offset(offset)
    .limit(pageSize);

  if (createTimeStart) {
    query.where("start_time", ">=", `${createTimeStart}`);
  }
  if (createTimeEnd) {
    query.where("start_time", "<=", `${createTimeEnd}`);
  }
  if (examName) {
    query.where("exam_name", "like", `${examName}%`);
  }
  if (password) {
    query.where("password", "=", `${password}`);
  }
  if (uid) {
    query.where("uid", "=", `${uid}`);
  }
  const results = await query; // 执行查询
  const totalCount = await getExamListCount(options);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    data: results,
    meta: {
      totalCount,
      totalPages,
    },
  };
};
//查询总数
const getExamListCount = async (options) => {
  // 获取查询参数
  const { createTimeStart, createTimeEnd, examName, password, uid } = options;

  // 计算总记录数
  const query = knex("bus_exam").orderBy("id");

  if (createTimeStart) {
    query.where("start_time", ">=", `${createTimeStart}`);
  }
  if (createTimeEnd) {
    query.where("start_time", "<=", `${createTimeEnd}`);
  }
  if (examName) {
    query.where("exam_name", "like", `${examName}%`);
  }
  if (password) {
    query.where("password", "=", `${password}`);
  }
  if (uid) {
    query.where("uid", "=", `${uid}`);
  }
  const totalCountSum = await query.count();
  const totalCount = totalCountSum.reduce(
    (sum, obj) => sum + obj["count(*)"],
    0
  );
  return totalCount;
};
// 学生信息添加、更新
const addStudent = async (options) => {
  saveOrUpdateImportStu(options);
};
//删除学生
const delStudent = async (options) => {
  const { id } = options;
  const result = await knex("sj_class_member").delete().where("id", id);
  ////console.log(`Deleted ${result.deletedCount} rows with ID ${id}`);
  return { message: "Deleted successfully" };
};
//更新学生
const updateStudent = async (options) => {
  const {
    id,
    name,
    s_number,
    s_mobile,
    s_real_name,
    college,
    major,
    advisor,
    synStatus,
    loginStatus,
  } = options;
  let fieldsToUpdate = {
    ...{},
    s_name: name && name,
    s_number: s_number && s_number,
    s_mobile: s_mobile && s_mobile,
    s_real_name: s_real_name && s_real_name,
    college: college && college,
    major: major && major,
    advisor: advisor && advisor,
    syn_status: synStatus && synStatus,
    login_status: loginStatus && loginStatus,
  };
  //console.log("========");
  //console.log("====id:" + id);
  //console.log(fieldsToUpdate);
  const result = await knex("sj_class_member")
    .update(fieldsToUpdate)
    .where("id", id);
  ////console.log(`Updated ${result.rowCount} rows with ID ${id}`);
  return { message: "Updated successfully" };
};
//新增或更新学生信息 远程拉取
const saveOrUpdateStu = async (options) => {
  const { sNumber, sUid, sRealName, dataType, examId } = options;
  let updateData = {
    s_uid: sUid && sUid,
    s_name: sRealName && sRealName,
    s_real_name: sRealName && sRealName,
    s_number: sNumber && sNumber,
    data_type: dataType && dataType,
    class_id: examId,
  };
  knex("sj_class_member")
    .select("s_uid", "s_name", "s_number", "data_type", "s_real_name")
    .where({ s_uid: sUid, class_id: examId })
    .then((record) => {
      // 如果记录存在，则更新
      if (record.length > 0) {
        knex("sj_class_member")
          .update(updateData)
          .where({ s_uid: sUid, class_id: examId })
          .onConflict(["s_uid"])
          .merge(["s_name", "s_number", "data_type", "s_real_name"])
          .then((updatedRecord) => {
            // 处理更新后的记录
            // ////console.error("111111");
          });
      } else {
        // 如果记录不存在，则新增
        knex("sj_class_member")
          .insert(updateData)
          .then((insertedRecord) => {
            // 处理新增后的记录
            ////console.error("222222");
            ////console.error("insertedRecord");
          });
      }
    });
};
//新增或更新学生信息 用户批量导入,内部用户，学号保证唯一
const saveOrUpdateImportStu = async (options) => {
  const {
    name,
    s_number,
    s_mobile,
    s_real_name,
    college,
    major,
    advisor,
    dataType,
    examId,
  } = options;

  let updateData = {
    s_name: name && name,
    s_number: s_number && s_number,
    s_mobile: s_mobile && s_mobile,
    s_real_name: s_real_name && s_real_name,
    college: college && college,
    major: major && major,
    advisor: advisor && advisor,
    data_type: dataType && dataType,
    class_id: examId && examId,
  };
  // knex("sj_class_member")
  //   .select(
  //     "s_name",
  //     "s_number",
  //     "s_mobile",
  //     "s_real_name",
  //     "college",
  //     "major",
  //     "advisor",
  //     "data_type",
  //     "class_id"
  //   )
  //   .where({ s_number: s_number, class_id: examId })
  //   .then((record) => {
  //     console.log('record', record);
  //     // 如果记录存在，则更新
  //     if (record.length > 0) {
  //       knex("sj_class_member")
  //         .update(updateData)
  //         .where({ s_number: s_number, class_id: examId })
  //         .onConflict(["s_number"])
  //         .merge([
  //           "s_name",
  //           "s_number",
  //           "s_mobile",
  //           "s_real_name",
  //           "college",
  //           "major",
  //           "advisor",
  //           "data_type",
  //         ])
  //         .then((updatedRecord) => {
  //           // 处理更新后的记录
  //           ////console.error("111111");
  //         });
  //     } else {
  //       // 如果记录不存在，则新增
  //       knex("sj_class_member")
  //         .insert(updateData).returning('id') // 返回插入记录的主键ID
  //         .then((insertedRecord) => {
  //           // 处理新增后的记录
  //           ////console.error("222222");
  //           ////console.error("insertedRecord");
  //           console.log("Inserted Record ID:", insertedRecord[0]);
  //           return new Promise((resolve, reject) => {
  //             resolve({
  //               data: insertedRecord[0],
  //             });
  //           });
  //         });
  //     }
  //   });
  try {
    const record = await knex("sj_class_member")
      .select(
        "s_name",
        "s_number",
        "s_mobile",
        "s_real_name",
        "college",
        "major",
        "advisor",
        "data_type",
        "class_id"
      )
      .where({ s_number: s_number, class_id: examId });

    // If record exists, update
    if (record.length > 0) {
      await knex("sj_class_member")
        .update(updateData)
        .where({ s_number: s_number, class_id: examId })
        .onConflict(["s_number"])
        .merge([
          "s_name",
          "s_number",
          "s_mobile",
          "s_real_name",
          "college",
          "major",
          "advisor",
          "data_type",
        ]);
      console.log('学生信息保存或更新成功');
    } else {
      // If record doesn't exist, insert
      const insertedRecord = await knex("sj_class_member")
        .insert(updateData)
        .returning('id');
      if (insertedRecord && insertedRecord.length > 0) {
        console.log("Inserted Record ID:", insertedRecord[0]);
        const newRecordId = insertedRecord[0];

        return new Promise((resolve, reject) => {
          resolve({
            data: newRecordId,
          });
        });
      } else {
        console.error("Failed to retrieve the inserted record ID.");
      }
    }
  } catch (error) {
    console.error('保存或更新学生信息时出错：', error);
  }
};
//查询学生作答记录
const batchGetExamResult = async (options) => {
  const {
    exam_id, u_ids
  } = options;
  console.log("===========" + u_ids)
  const query = knex('bus_exam_result')
    .select('uid', knex.raw('COUNT(*) as answer_count'))
    .whereIn('uid', u_ids)
    .where('exam_id', exam_id)
    .groupBy('uid');

  return query.then((results) => {
    // 返回查询结果和元数据
    console.log("result===========" + results)
    return {
      data: results,
    };
  });
};
//查询配置
const getSysSet = async () => {
  // 构建查询条件
  const query = knex("interface_details").orderBy("id");
  // 根据查询参数执行查询
  return query.then((results) => {
    // 返回查询结果和元数据
    return {
      data: results,
    };
  });
};
// 添加系统配置
const addSysSet = async (options) => {
  const { interface_name, ip_whitelist, ip_blacklist, local_ip, remark } =
    options;
  let fieldsToInsert = {
    interface_name: interface_name && interface_name,
    ip_whitelist: ip_whitelist && ip_whitelist,
    ip_blacklist: ip_blacklist && ip_blacklist,
    local_ip: local_ip && local_ip,
    remark: remark && remark,
  };
  knex("interface_details")
    .insert(fieldsToInsert)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      ////console.error(error);
      return error;
    });
};
//删除系统配置
const delSysSet = async (options) => {
  const { id } = options;
  const result = await knex("interface_details").delete().where("id", id);
  ////console.log(`Deleted ${result.deletedCount} rows with ID ${id}`);
  return { message: "Deleted successfully" };
};
// 更新系统配置
const updateSysSet = async (options) => {
  const { id, interface_name, ip_whitelist, ip_blacklist, local_ip, remark } =
    options;
  let fieldsToUpdate = {
    ...{},
    interface_name: interface_name && interface_name,
    ip_whitelist: ip_whitelist && ip_whitelist,
    ip_blacklist: ip_blacklist && ip_blacklist,
    local_ip: local_ip && local_ip,
    remark: remark && remark,
  };
  const result = await knex("interface_details")
    .update(fieldsToUpdate)
    .where("id", id);
  ////console.log(`Updated ${result.rowCount} rows with ID ${id}`);
  return { message: "Updated successfully" };
};
//新增或更新考试信息
const saveOrUpdateExam = async (options) => {
  const {
    id,
    uid,
    createTime,
    updateTime,
    examName,
    coverUrl,
    examNotes,
    content,
    score,
    pass_score,
    startTime,
    endTime,
    answerTime,
    answerTimes,
    lateTime,
    isCheat,
    cheatParameters,
    subjectRandom,
    optionRandom,
    extractRandom,
    extraOptions,
    status,
    isOrder,
    isScore,
    isView,
    isUsed,
    classId,
    chooseNum,
    isDel,
    password,
    payStatus,
  } = options;
  let updateData = {
    id: id,
    paper_id: id,
    uid: uid,
    create_time: createTime,
    update_time: updateTime,
    exam_name: examName,
    cover_url: coverUrl,
    exam_notes: examNotes,
    content: content,
    score: score,
    pass_score: pass_score,
    start_time: startTime,
    end_time: endTime,
    answer_time: answerTime,
    answer_times: answerTimes,
    late_time: lateTime,
    is_cheat: isCheat,
    cheat_parameters: cheatParameters,
    subject_random: subjectRandom,
    option_random: optionRandom,
    extract_random: extractRandom,
    extra_options: extraOptions,
    status: status,
    is_order: isOrder,
    is_score: isScore,
    is_view: isView,
    is_used: isUsed,
    class_id: classId,
    choose_num: chooseNum,
    is_del: isDel,
    password: password,
    pay_status: payStatus,
  };
  knex("bus_exam")
    .select("uid", "exam_name", "exam_notes")
    .where({ id: id })
    .then((record) => {
      // 如果记录存在，则更新
      if (record.length > 0) {
        knex("bus_exam")
          .update(updateData)
          .where({ id: id })
          .onConflict(["id"])
          .merge(["uid", "exam_name", "exam_notes"])
          .then((updatedRecord) => {
            // 处理更新后的记录
            // ////console.error("111111");
          });
      } else {
        // 如果记录不存在，则新增
        knex("bus_exam")
          .insert(updateData)
          .then((insertedRecord) => {
            // 处理新增后的记录
            ////console.error("222222");
          });
      }
    });
};
//分页查询学生作答记录
const getBusExamResult = async (options) => {
  // 获取查询参数
  const { uid, examId, synStatus, pageIndex, pageSize } = options;
  // 计算查询起始索引
  const offset = (pageIndex - 1) * pageSize;
  // 构建查询条件
  const query = knex("bus_exam_result")
    .orderBy("id", "desc")
    .offset(offset)
    .limit(pageSize);
  if (examId) {
    query.where("exam_id", "=", `${examId}`);
  }
  if (uid) {
    query.where("uid", "=", `${uid}`);
  }
  if (synStatus) {
    query.where("syn_status", "=", `${synStatus}`);
  }
  // 根据查询参数执行查询
  return query.then((results) => {
    // 筛选返回的字段
    const selectedResults = results.map((result) => {
      const selectedObject = {};
      selectedObject.uid = result.uid;
      selectedObject.dataType = result.data_type;
      selectedObject.examId = result.exam_id;
      selectedObject.examResultUniqueId = result.unique_id;
      selectedObject.systemScore = result.system_score;
      selectedObject.questionCorrect = result.question_correct;
      //新增字段
      selectedObject.forceSubmitFlag = result.force_submit_flag;
      selectedObject.forceSubmitFlag = 0;
      selectedObject.status = result.status;
      selectedObject.isRead = result.is_read;
      selectedObject.startTime = result.start_time;
      selectedObject.endTime = result.end_time;
      selectedObject.content = result.content;
      selectedObject.screenshotTimes = result.screenshot_times;
      selectedObject.screencapTimes = result.screencap_times;
      selectedObject.id = result.id;
      //新增字段
      selectedObject.facePhoto = result.face_photo;
      selectedObject.photo = result.photo;
      selectedObject.examIp = result.exam_ip;
      return selectedObject;
    });
    // 计算总记录数和总页数
    const totalCount = results.length;
    ////console.log(`totalCount: ${totalCount}`);
    ////console.log(`pageSize: ${pageSize}`);
    const totalPages = Math.ceil(totalCount / pageSize);

    // 返回查询结果和元数据
    return {
      data: selectedResults,
      meta: {
        totalCount,
        totalPages,
      },
    };
  });
};

//查询学生已作答次数
const getBusExamResultCount = async (options) => {
  // 获取查询参数
  const { examId, uid } = options;

  // 计算总记录数
  const query = knex("bus_exam_result").orderBy("id");
  if (examId) {
    query.where("exam_id", "=", `${examId}`);
  }
  if (uid) {
    query.where("uid", "=", `${uid}`);
  }
  const totalCountSum = await query.count();
  const totalCount = totalCountSum.reduce(
    (sum, obj) => sum + obj["count(*)"],
    0
  );
  return {
    data: totalCount,
  };
};
//更新考试数据同步状态
const updateBusExamResultSynStatus = async (options) => {
  //console.log("options", options);
  const { id, synStatus } = options;
  let fieldsToUpdate = {
    syn_status: synStatus && synStatus,
  };
  const result = await knex("bus_exam_result")
    .update(fieldsToUpdate)
    .where("id", id);
  //console.log(`Updated ${result.rowCount} rows with ID ${id}`);
  return { message: "Updated successfully" };
};
//文件上传
const uploadFile = async (parm) => {
  const { dev, cosPath, realPath, fileName } = parm;
  var options = {
    method: "POST",
    url: host + "/v3/common/feign/upload/uploadConven",
    headers: {},
    formData: {
      dev: dev,
      cosPath: cosPath,
      file: {
        value: fs.createReadStream(realPath),
        options: {
          filename: fileName,
          contentType: null,
        },
      },
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    ////console.log(response.body);
    return response.body;
  });
};
//登录
const login = async (id) => {
  //更新为登录成功
  const options = {
    id: id,
    loginStatus: 1,
  };
  //更新状态为已登录
  updateStudent(options);
};
//登出
const logout = async (id) => {
  //更新为为登录
  const options = {
    id: id,
    loginStatus: 0,
  };
  //更新状态为未登录
  updateStudent(options);
};

//同步保存试卷信息
const saveOrUpdatePaper = async (options) => {
  const { examId, content, create_time, update_time } = options;
  let updateData = {
    exam_id: examId,
    content: content,
    create_time: create_time && create_time,
    update_time: update_time && update_time,
  };
  knex("local_paper_info")
    .select("exam_id", "content", "create_time", "update_time")
    .where({ exam_id: examId })
    .then((record) => {
      // 如果记录存在，则更新
      if (record.length > 0) {
        knex("local_paper_info")
          .update(updateData)
          .where({ exam_id: examId })
          .onConflict(["exam_id"])
          .merge(["content", "update_time"])
          .then((updatedRecord) => {
            // 处理更新后的记录
            //console.error("试卷更新成功");
          });
      } else {
        // 如果记录不存在，则新增
        knex("local_paper_info")
          .insert(updateData)
          .then((insertedRecord) => {
            // 处理新增后的记录
            //console.error("试卷新增成功");
          });
      }
    });
};
//根据考试id获取试卷
const getPaperByExamId = async (examId) => {
  return knex("local_paper_info")
    .where({ exam_id: examId })
    .select("content")
    .first()
    .then((record) => {
      if (record) {
        //console.log(`找到一份试卷`);
        return record;
      } else {
        //console.log("没有找到匹配的试卷");
      }
    });
};

//查询学生考试排名
const getRanking = async (examId, stuId) => {
  const results = await knex("bus_exam_result")
    .where({ exam_id: examId })
    .orderBy("system_score", "DESC");

  const rankings = {};
  let rank = 1;
  results.forEach((row) => {
    rankings[row.uid] = rank;
    rank++;
  });
  return {
    data: rankings[stuId],
  };
};
//保存主观题文件
const saveOrUpdateLocalFile = async (options) => {
  const {
    exam_id,
    uid,
    file_type,
    bank_id,
    local_path,
    oss_path,
    full_path,
    create_time,
    update_time,
  } = options;
  let updateData = {
    exam_id: exam_id,
    uid: uid,
    file_type: file_type,
    bank_id: bank_id,
    local_path: local_path && local_path,
    full_path: full_path && full_path,
    oss_path: oss_path && oss_path,
    create_time: create_time && create_time,
    update_time: update_time && update_time,
  };
  knex("local_file_info")
    .select(
      "exam_id",
      "uid",
      "file_type",
      "bank_id",
      "local_path",
      "full_path",
      "oss_path",
      "create_time",
      "update_time"
    )
    .where({
      exam_id: exam_id,
      uid: uid,
      file_type: file_type,
      bank_id: bank_id,
    })
    .then((record) => {
      // 如果记录存在，则更新
      if (record.length > 0) {
        knex("local_file_info")
          .update(updateData)
          .where({
            exam_id: exam_id,
            uid: uid,
            file_type: file_type,
            bank_id: bank_id,
          })
          .onConflict(["exam_id", "uid", "bank_id", "file_type"])
          .merge(["local_path", "oss_path", "update_time"])
          .then((updatedRecord) => {
            // 处理更新后的记录
            return true;
            //console.error("本地文件更新成功");
          });
      } else {
        // 如果记录不存在，则新增
        knex("local_file_info")
          .insert(updateData)
          .then((insertedRecord) => {
            // 处理新增后的记录
            return true;
            //console.error("本地文件新增成功");
          });
      }
    });
};
//查询本地文件
const getLocalFile = async (options, isPromise) => {
  const { exam_id, uid, file_type, bank_id } = options;
  let query = knex("local_file_info")
    .select(
      "id",
      "uid",
      "exam_id",
      "bank_id",
      "file_type",
      "local_path",
      "oss_path",
      "full_path"
    )
    .where({ exam_id: exam_id });

  if (uid) {
    query = query.where({ uid: uid });
  }

  if (file_type) {
    query = query.where({ file_type: file_type });
  }

  if (bank_id) {
    query = query.where({ bank_id: bank_id });
  }

  const record = await query;

  if (isPromise) {
    return record;
  }
  if (record) {
    //console.log(record);
    //console.log(`找到一个本地文件`);
    return { data: record };
  } else {
    //console.log("没有找到匹配的本地文件");
    return { data: "" };
  }
};

// 开启局域网接口
// let server = http.createServer();
let SERVER_PORT = 35872;

function openServer() {
  // 防止重复开启
  // closeServer();

  // 获取本机的局域网IP和自定义端口
  let SERVER_IP = getServerIp();
  let server = http.createServer();
  ////console.log(`服务器开启成功，服务器地址: http://${SERVER_IP}:${SERVER_PORT}`);

  server.on("request", (req, res) => {
    // 防止跨域
    res.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
      "access-control-allow-origin": "*",
    });
    let postData = "";
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      postData += chunk.toString();
    });
    let reqParams = "";
    req.on("end", () => {
      reqParams = querystring.parse(postData);
      //1、登录接口，获取考试信息
      if (req.method === "POST" && req.url === "/api/student/getExamInfo") {
        const ipAddress = reqParams.address;
        getSysSet().then((result) => {
          if (result.data) {
            const val = result.data;
            if (val[0]) {
              let ipList = []; //'192.168.0.1-192.168.0.100', '192.168.0.200-192.168.0.300'
              let ip_whitelist = val[0]['ip_whitelist'];
              if (ip_whitelist) {
                ip_whitelist.split(/,|，/).map((item) => {
                  const _ip = item.split("-");
                  ipList.push([_ip[0] || "", _ip[1] || ""]);
                });
              }
              let isLegalIp = isIPInRange(ipAddress, ipList);
              if (ipList.length == 0) {
                isLegalIp = false;
              }
              if (isLegalIp) {
                let context = {
                  code: 500,
                  data: null,
                  msg: "您访问的IP号段不在白名单范围内",
                };
                res.end(JSON.stringify(context));
              } else {
                get_examInfo(reqParams.password, reqParams.snumber).then(
                  (_content) => {
                    console.log('_content', _content);
                    let context = {
                      code: 200,
                      data: _content,
                    };
                    res.end(JSON.stringify(context));
                  }
                );
              }
            } else {
              let context = {
                code: 500,
                data: null,
                msg: "您访问的IP号段不在白名单范围内",
              };
              res.end(JSON.stringify(context));
            }
          }
        });
        // if (!isLegal) {
        //   let context = {
        //     code: 500,
        //     data: null,
        //     msg: "您访问的IP号段不在白名单范围内",
        //   };
        //   res.end(JSON.stringify(context));
        // } else {
        //   get_examInfo(reqParams.password, reqParams.snumber).then((result) => {
        //     let context = {
        //       code: 200,
        //       data: result,
        //     };
        //     res.end(JSON.stringify(context));
        //   });
        // }
      }
      //2、获取试卷信息接口 入参：examId  （组卷逻辑）通过考试信息的content 进行试题重组
      if (req.method === "POST" && req.url === "/api/student/getPaperInfo") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        getPaperByExamId(reqParams.examId)
          .then((result) => {
            let context = {
              code: 200,
              data: result.content,
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            //console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //3、开始考试接口 入参：uid，examId 出参：考生开始考试时间
      if (req.method === "POST" && req.url === "/api/student/startExam") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        //远程请求，开始考试
        ////console.log(reqParams);
        url =
          host +
          "/v3/exam/exam/student/startExam?uid=" +
          reqParams.uid +
          "&examId=" +
          reqParams.examId;
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.end(body);
          }
        });
      }
      //4、提交试卷 自动判题逻辑（缺）
      if (req.method === "POST" && req.url === "/api/student/submitExam") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        try {
          reqParams = JSON.parse(postData);
        } catch (error) {
          ////console.error("Failed to parse JSON request parameters:", error);
          res.status(400).send("Invalid JSON request parameters");
          return;
        }
        //本地保存
        const dataToInsert = {
          uid: reqParams.uid,
          exam_id: reqParams.examId,
          class_id: reqParams.classId,
          unique_id: reqParams.examResultUniqueId,
          system_score: reqParams.systemScore,
          question_correct: reqParams.questionCorrect,
          is_read: reqParams.isRead,
          start_time: reqParams.startTime,
          end_time: reqParams.endTime,
          screenshot_times: reqParams.screenshotTimes,
          screencap_times: reqParams.screencapTimes,
          content: reqParams.content,
          status: reqParams.status,
          force_submit_flag: reqParams.forceSubmitFlag,
          data_type: reqParams.dataType,
          create_time: new Date(),
          face_photo: reqParams.face_photo,
          photo: reqParams.photo,
          exam_ip: reqParams.exam_ip,
        };
        knex
          .insert(dataToInsert)
          .into("bus_exam_result")
          .then(() => {
            ////console.log("数据已插入");
            let context = {
              code: 200,
              data: true,
              msg: "交卷成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((err) => {
            ////console.error(err);
            let context = {
              code: 100,
              data: false,
              msg: "交卷失败",
            };
            res.end(JSON.stringify(context));
          })
          .catch((err) => {
            ////console.error(err);
            let context = {
              code: 500,
              data: false,
              msg: "数据库连接失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //5、查看试卷（结果详情） 暂时不需要，默认全部自动判题
      if (req.method === "POST" && req.url === "/api/student/getResultDetail") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        //远程请求，查询试卷结果
        url =
          host +
          "/v3/exam/exam/student/getResultDetail?examResultId=" +
          reqParams.examResultId;
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.end(body);
          }
        });
      }
      //6、查询学生信息列表
      if (req.method === "POST" && req.url === "/api/teacher/stuList") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          sNumber: reqParams.sNumber,
          examId: reqParams.examId,
          dataType: reqParams.dataType,
          synStatus: reqParams.synStatus,
          pageSize: reqParams.pageSize,
          pageIndex: reqParams.pageIndex,
        };

        getMembersBySNumber(options)
          .then(({ data, meta }) => {
            //////console.log('查询结果：', data);
            ////console.log("总记录数：", meta.totalCount);
            ////console.log("总页数：", meta.totalPages);
            let context = {
              code: 200,
              data: {
                data: data,
                totalCount: meta.totalCount,
                totalPages: meta.totalPages,
              },
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //7、查询本地考试列表
      if (req.method === "POST" && req.url === "/api/teacher/examList") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          createTimeStart: reqParams.createTimeStart,
          createTimeEnd: reqParams.createTimeEnd,
          examName: reqParams.examName,
          uid: reqParams.uid,
          password: reqParams.password,
          pageSize: reqParams.pageSize,
          pageIndex: reqParams.pageIndex,
        };

        getExamList(options)
          .then(({ data, meta }) => {
            ////console.log('查询结果：', data);
            ////console.log("总记录数：", meta.totalCount);
            ////console.log("总页数：", meta.totalPages);
            let context = {
              code: 200,
              data: {
                data: data,
                totalCount: meta.totalCount,
                totalPages: meta.totalPages,
              },
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //8、学生添加
      if (req.method === "POST" && req.url === "/api/teacher/addStudent") {
        reqParams = JSON.parse(postData);
        const options = {
          s_name: reqParams.name,
          s_real_name: reqParams.s_real_name,
          s_number: reqParams.s_number,
          s_mobile: reqParams.s_mobile,
          examId: reqParams.examId,
          college: reqParams.college,
          major: reqParams.major,
          advisor: reqParams.advisor,
          dataType: reqParams.dataType,
        };

        addStudent(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "操作成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //9、学生删除
      if (req.method === "POST" && req.url === "/api/teacher/delStudent") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          id: reqParams.id,
        };

        delStudent(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "操作成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //10、学生更新
      if (req.method === "POST" && req.url === "/api/teacher/updateStudent") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          id: reqParams.id,
          s_name: reqParams.name,
          s_real_name: reqParams.s_real_name,
          s_number: reqParams.s_number,
          s_mobile: reqParams.s_mobile,
          college: reqParams.college,
          major: reqParams.major,
          advisor: reqParams.advisor,
        };
        ////console.log(options);
        updateStudent(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "更新成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //11、查询配置列表
      if (req.method === "POST" && req.url === "/api/teacher/getSysSet") {
        reqParams = JSON.parse(postData);
        getSysSet()
          .then(({ data }) => {
            let context = {
              code: 200,
              data: {
                data: data,
              },
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //12、配置添加
      if (req.method === "POST" && req.url === "/api/teacher/addSysSet") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          interface_name: reqParams.interface_name,
          ip_whitelist: reqParams.ip_whitelist,
          ip_blacklist: reqParams.ip_blacklist,
          local_ip: reqParams.local_ip,
          remark: reqParams.remark,
        };

        addSysSet(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "操作成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //13、配置删除
      if (req.method === "POST" && req.url === "/api/teacher/delSysSet") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          id: reqParams.id,
        };

        delSysSet(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "操作成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //14、配置更新
      if (req.method === "POST" && req.url === "/api/teacher/updateSysSet") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          id: reqParams.id,
          interface_name: reqParams.interface_name,
          ip_whitelist: reqParams.ip_whitelist,
          ip_blacklist: reqParams.ip_blacklist,
          local_ip: reqParams.local_ip,
          remark: reqParams.remark,
        };
        ////console.log(options);
        updateSysSet(options)
          .then((data) => {
            ////console.log("查询结果：", data);
            let context = {
              code: 200,
              data: true,
              msg: "更新成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("操作失败", error);
            let context = {
              code: 100,
              data: false,
              msg: "操作失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //14-1、批量查询学生作答记录
      if (req.method === "POST" && req.url === "/api/teacher/batchGetExamResult") {
        reqParams = JSON.parse(postData);
        ////console.log(reqParams);
        const options = {
          exam_id: reqParams.exam_id,
          u_ids: reqParams.u_ids
        };
        batchGetExamResult(options)
          .then(({ data }) => {
            let context = {
              code: 200,
              data: {
                data: data,
              },
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //15 rpc调用-学生数据同步 /v3/exam/outsideData/syncStuInfo
      if (req.method === "POST" && req.url === "/api/rpc/syncStuInfo") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        reqParams = JSON.parse(postData);
        const memberList = reqParams.memberListJson.map((item) => ({
          number: item.s_number,
          name: item.s_real_name,
          sUid: item.class_id + "" + item.id,
          dataType: item.data_type,
        }));
        const param = {
          examId: reqParams.examId,
          memberList: memberList,
        };
        rpcUrl = host + "/v3/exam/outsideData/syncStuInfo";
        const options = {
          url: rpcUrl,
          method: "POST",
          json: param,
        };
        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            ////console.log(body);
            if (body.code == 200) {
              //数据同步到远程后，更新本地数据为已同步
              reqParams.memberListJson.forEach((item) => {
                ////console.log(item.id);
                const stu = {
                  id: item.id,
                  synStatus: 1,
                };
                //更新数据为已同步
                updateStudent(stu);
              });
            }
            let context = {
              code: 200,
              data: true,
              msg: "同步完成",
            };
            res.end(JSON.stringify(context));
            //解析json将数据保存到本地
          }
        });
      }
      //16 rpc调用-考试数据同步 /v3/exam/outsideData/syncStuResult
      if (req.method === "POST" && req.url === "/api/rpc/syncStuResult") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        //远程请求，查询试卷结果
        //todo 此处查询，该场考试未同步的作答记录 调用 getBusExamResult：入参examId,synStatus=0
        reqParams = JSON.parse(postData);
        // 此处将该场考试的所有的文件进行上传
        getLocalFile({ exam_id: reqParams.examId }).then(({ data }) => {
          if (data && data.length > 0) {
            const promises = data.map((item) => {
              if (item.oss_path) {
                return Promise.resolve();
              } else {
                const { full_path, local_path } = item;
                const p1 = local_path.split("/");
                const filename = p1[p1.length - 1];
                const fileData = fs.readFileSync(full_path);
                const requestOptions = {
                  url: host + "/v3/common/feign/upload/uploadConven",
                  method: "POST",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  formData: {
                    file: {
                      value: fileData,
                      options: {
                        filename: filename,
                      },
                    },
                    dev: "prod",
                    cosPath: local_path,
                    realPath: full_path,
                    fileName: filename,
                  },
                };
                return new Promise((resolve, reject) => {
                  request(requestOptions, (error, response, body) => {
                    if (error) {
                      console.error("Error:", error);
                      reject(error);
                    } else {
                      const sourceUrl = JSON.parse(body).sourceUrl;
                      const options = {
                        exam_id: item.exam_id,
                        uid: item.uid,
                        file_type: item.file_type,
                        bank_id: item.bank_id,
                        local_path: item.local_path,
                        oss_path: sourceUrl,
                        update_time: new Date(),
                      };
                      saveOrUpdateLocalFile(options).then(() => {
                        resolve();
                      });
                    }
                  });
                });
              }
            });
            Promise.all(promises).then(() => {
              console.log("文件同步完成");
              // examId: reqParams.examId,
              getLocalFile({ exam_id: reqParams.examId }).then(({ data }) => {
                if (data.length > 0) {
                  data.forEach((item, index) => {
                    //console.log('item', item);
                    if (item.oss_path) {
                      //已经存在oss_path的数据，不需要处理
                      console.log("888");
                      if (index === data.length - 1) {
                        getResultFile();
                      }
                    } else {
                      //第一步操作保证文件全部上传，oss_path全部有值
                      console.log("999");
                    }
                  });
                }
              });
            });
          } else {
            console.log("查询本地文件结果为空,直接进行记录同步");
            getResultFile();
          }
        });

        //同步考试记录
        function getResultFile() {
          getBusExamResult({
            examId: reqParams.examId,
            synStatus: "0",
            pageIndex: 1,
            pageSize: 1000,
          }).then((result) => {
            if (result.data.length > 0) {
              console.log("111");
              const param = {
                examId: reqParams.examId,
                contentList: result.data,
              };
              //todo 逻辑：轮询 result.data，补充文件路径
              result.data.forEach((item) => {
                const s_uid = item.uid;
                const exam_id = item.examId;
                if (item.content) {
                  const jsonObj = JSON.parse(item.content);
                  const promises = [];
                  const newList = jsonObj.filter(
                    (_item) => _item.tSubject === 4 || _item.tSubject === 5
                  );
                  for (let i = 0; i < newList.length; i++) {
                    console.log("222");
                    if (newList[i].hasOwnProperty("stuAnswer")) {
                      console.log("333");
                      // 根据题型，进行文件的 oss 路径的查询
                      const options = {
                        exam_id: exam_id,
                        uid: s_uid,
                        file_type: "0",
                        bank_id: newList[i].bankId,
                        index: i,
                      };
                      promises.push(getLocalFile(options, true));
                    }
                  }
                  Promise.all(promises).then((results) => {
                    console.log("444");
                    results.forEach((result, i) => {
                      console.log("555");
                      const data = result;
                      if (data[0]) {
                        if (data[0].oss_path) {
                          // 将 oss_path 赋值给 stuAnswer
                          const _index = jsonObj.findIndex(
                            (m) => m.bankId === data[0]["bank_id"]
                          );
                          if (_index > -1) {
                            jsonObj[_index].stuAnswer = data[0].oss_path;
                          }
                          // jsonObj[i].stuAnswer = data[0].oss_path;
                          console.log(data[0].oss_path);
                        } else {
                          console.log("本地文件不为空，但是oss_path为空");
                        }
                      } else {
                        console.log("查询本地文件结果为空");
                      }
                    });
                    item.content = JSON.stringify(jsonObj);

                    rpcUrl = host + "/v3/exam/outsideData/syncStuResult";
                    request(
                      {
                        url: rpcUrl,
                        method: "POST",
                        json: true,
                        headers: {
                          "content-type": "application/json",
                        },
                        body: param,
                      },
                      function (error, response, body) {
                        console.log("666");
                        console.log("body", body);
                        if (!error && response.statusCode == 200) {
                          // 请求成功后，更新本地数据为已同步
                          if (body.code == 200) {
                            result.data.forEach((item) => {
                              const examResult = {
                                id: item.id,
                                synStatus: 1,
                              };
                              updateBusExamResultSynStatus(examResult);
                            });
                          }
                          let context = {
                            code: 200,
                            data: {
                              data: body,
                            },
                            msg: "考试记录同步成功",
                          };
                          res.end(JSON.stringify(context));
                        } else {
                          console.log(error);
                          let context = {
                            code: 100,
                            data: false,
                            msg: "操作失败",
                          };
                          res.end(JSON.stringify(context));
                        }
                      }
                    );
                  });
                }
              });
              //todo 1、轮询 result.data，找到待补充的题号【exam_id,uid,bank_id,file_type】  getLocalFile,获取到local_path
              //todo 2、通过local_path找到本地文件，获取到local_file_info后将文件上传到九斗获取到oss_path，并把数据库更新
              //todo 3、新数组填充文件路径
            } else {
              let context = {
                code: 200,
                data: "",
                msg: "暂无考试同步记录",
              };
              res.end(JSON.stringify(context));
            }
          });
        }
      }
      //17 rpc调用-查询学生列表 /v3/exam/exam/result/queryStuInfoList
      if (req.method === "POST" && req.url === "/api/rpc/queryStuInfoList") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        //远程请求，查询试卷结果
        reqParams = JSON.parse(postData);
        url =
          host +
          "/v3/exam/outsideData/queryStuInfoList?examId=" +
          reqParams.examId;
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const bodyData = JSON.parse(body);
            //解析json将数据保存到本地
            bodyData.data?.forEach((record) => {
              if (record.dataType == 1) {
                const options = {
                  sNumber: record.sNumber,
                  sUid: record.sUid,
                  sRealName: record.sRealName,
                  dataType: 1,
                  examId: reqParams.examId,
                };
                ////console.log(options);
                //保存
                saveOrUpdateStu(options);
              } else {
                ////console.log("不需要更新");
              }
            });
            res.end(body);
          }
        });
      }
      //18 rpc调用-查询考试列表 v3/exam/exam/getExamList
      if (req.method === "POST" && req.url === "/api/rpc/getExamList") {
        // if (!isLegalIp) {
        //   legalIpCallback(res)
        // }
        //远程请求，查询试卷结果
        reqParams = JSON.parse(postData);
        const param = {
          tUid: reqParams.uid,
        };
        rpcUrl = host + "/v3/exam/outsideData/queryExamInfoList";
        request.post(
          { url: rpcUrl, form: param },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const bodyData = JSON.parse(body);
              const list = bodyData.data.filter((item) => item.status !== 0);
              //解析json将数据保存到本地
              list.forEach((record) => {
                const options = {
                  id: record.id,
                  uid: record.uid,
                  createTime: record.createTime,
                  updateTime: record.updateTime,
                  examName: record.examName,
                  coverUrl: record.coverUrl,
                  examNotes: record.examNotes,
                  type: record.type,
                  content: record.content,
                  score: record.score,
                  pass_score: record.passScore,
                  startTime: record.startTime,
                  endTime: record.endTime,
                  answerTime: record.answerTime,
                  answerTimes: record.answerTimes,
                  lateTime: record.lateTime,
                  isCheat: record.isCheat,
                  cheatParameters: record.cheatParameters,
                  subjectRandom: record.subjectRandom,
                  optionRandom: record.optionRandom,
                  extractRandom: record.extractRandom,
                  extraOptions: record.extraOptions,
                  status: record.status,
                  isOrder: record.isOrder,
                  isScore: record.isScore,
                  isView: record.isView,
                  isUsed: record.isUsed,
                  classId: record.classId,
                  chooseNum: record.chooseNum,
                  isDel: record.isDel,
                  password: record.password,
                  payStatus: record.payStatus,
                };
                saveOrUpdateExam(options);
                //todo 保存试卷信息
                //调用rpc接口
                url =
                  host +
                  "/v3/exam/exam/student/getPaperInfo?examId=" +
                  record.id;
                request(url, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                    const paper = JSON.parse(body);
                    const content = paper.data;
                    const createTime = new Date();
                    const updateTime = new Date();
                    const paperWithContent = {
                      examId: record.id,
                      content: JSON.stringify(content),
                      create_time: createTime,
                      update_time: updateTime,
                    };
                    saveOrUpdatePaper(paperWithContent);
                  }
                });
              });
              let context;
              if (list.length === 0) {
                context = {
                  code: 200,
                  data: "暂无数据需要同步",
                  msg: "操作",
                };
              } else {
                context = {
                  code: 200,
                  data: "处理成功",
                  msg: "操作",
                };
              }
              res.end(JSON.stringify(context));
            }
          }
        );
      }

      //19 rpc调用-文件上传测试  v3/common/feign/upload/uploadConven
      if (req.method === "POST" && req.url === "/api/rpc/uploadFile") {
        reqParams = JSON.parse(postData);
        const param = {
          dev: reqParams.dev,
          cosPath: reqParams.cosPath,
          realPath: reqParams.realPath,
          fileName: reqParams.fileName,
        };
        const data = uploadFile(param);
        let context = {
          code: 200,
          data: data,
          msg: "上传成功",
        };
        res.end(JSON.stringify(context));
      }
      //20 学生端登出
      if (req.method === "POST" && req.url === "/api/student/logout") {
        reqParams = JSON.parse(postData);
        const data = logout(reqParams.stuId);
        let context = {
          code: 200,
          data: data,
          msg: "退出成功",
        };
        res.end(JSON.stringify(context));
      }
      //21 获取学生作答次数 getBusExamResultCount
      if (
        req.method === "POST" &&
        req.url === "/api/student/getBusExamResultCount"
      ) {
        reqParams = JSON.parse(postData);
        const param = {
          examId: reqParams.examId,
          uid: reqParams.uid,
        };
        getBusExamResultCount(param)
          .then(({ data }) => {
            let context = {
              code: 200,
              data: data,
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //22 获取学生作答记录
      if (
        req.method === "POST" &&
        req.url === "/api/student/getBusExamResult"
      ) {
        reqParams = JSON.parse(postData);
        const param = {
          examId: reqParams.examId,
          uid: reqParams.uid,
          synStatus: reqParams.synStatus,
          pageIndex: reqParams.pageIndex,
          pageSize: reqParams.pageSize,
        };
        getBusExamResult(param)
          .then(({ data }) => {
            let context = {
              code: 200,
              data: data,
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            ////console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      // 23 获取学生排名
      if (req.method === "POST" && req.url === "/api/student/getRanking") {
        reqParams = JSON.parse(postData);
        getRanking(reqParams.examId, reqParams.uid)
          .then(({ data }) => {
            let context = {
              code: 200,
              data: data,
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            //console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      // 24 保存本地文件
      if (req.method === "POST" && req.url === "/api/student/saveLocalFile") {
        reqParams = JSON.parse(postData);
        const options = {
          exam_id: reqParams.examId,
          uid: reqParams.uid,
          file_type: reqParams.fileType,
          bank_id: reqParams.bankId,
          local_path: reqParams.localPath,
          oss_path: reqParams.ossPath,
          create_time: new Date(),
          update_time: new Date(),
        };
        saveOrUpdateLocalFile(options)
          .then(() => {
            let context = {
              code: 200,
              data: true,
              msg: "保存成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            //console.error("保存失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "保存失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      // 25 查询本地文件
      if (req.method === "POST" && req.url === "/api/student/getLocalFile") {
        reqParams = JSON.parse(postData);
        const options = {
          exam_id: reqParams.examId,
          uid: reqParams.uid,
          file_type: reqParams.fileType,
          bank_id: reqParams.bankId,
        };
        getLocalFile(options)
          .then(({ data }) => {
            let context = {
              code: 200,
              data: data,
              msg: "查询成功",
            };
            res.end(JSON.stringify(context));
          })
          .catch((error) => {
            //console.error("查询失败：", error);
            let context = {
              code: 100,
              data: "",
              msg: "查询失败",
            };
            res.end(JSON.stringify(context));
          });
      }
      //26、同步本地文件到远程
      if (req.method === "POST" && req.url === "/api/rpc/syncLocalFile") {
        reqParams = JSON.parse(postData);
        getLocalFile({ exam_id: reqParams.examId }).then(({ data }) => {
          if (data && data.length > 0) {
            data.forEach((item) => {
              //console.log('item', item);
              if (item.oss_path) {
                //已经存在oss_path的数据，不需要处理
              } else {
                const { full_path, local_path } = item;
                console.log("full_path", full_path);
                console.log("item", item);
                const p1 = local_path.split("/");
                const filename = p1[p1.length - 1];
                const fileData = fs.readFileSync(full_path);
                //读取本地文件， 并需要调用文件上传接口，将返回的oss_path保存到本地
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
                        filename: filename, // 文件名
                      },
                    },
                    dev: "prod",
                    cosPath: local_path,
                    realPath: full_path,
                    fileName: filename,
                    // 可以添加其他参数
                  },
                };

                // 发送POST请求给其他接口
                request(requestOptions, (error, response, body) => {
                  if (error) {
                    console.error("Error:", error);
                  }
                  // 做一些处理后，将结果返回给前端
                  // 文件上传成功后，将当前数据更新
                  console.log(JSON.parse(body));
                  const sourceUrl = JSON.parse(body).sourceUrl;
                  const options = {
                    exam_id: item.exam_id,
                    uid: item.uid,
                    file_type: item.file_type,
                    bank_id: item.bank_id,
                    local_path: item.local_path,
                    oss_path: sourceUrl,
                    update_time: new Date(),
                  };
                  saveOrUpdateLocalFile(options);
                });
              }
            });
            let context = {
              code: 200,
              data: true,
              msg: "文件同步成功1",
            };
            res.end(JSON.stringify(context));
          } else {
            console.log("查询本地文件结果为空");
            let context = {
              code: 200,
              data: true,
              msg: "文件同步成功3",
            };
            res.end(JSON.stringify(context));
          }
        });
      }
      //27、同步文件上传-新
      if (req.method === "POST" && req.url === "/api/rpc/syncLocalFileNew") {
        reqParams = JSON.parse(postData);
        getLocalFile({ exam_id: reqParams.examId }).then(({ data }) => {
          if (data && data.length > 0) {
            const promises = data.map((item) => {
              if (item.oss_path) {
                return Promise.resolve();
              } else {
                const { full_path, local_path } = item;
                const p1 = local_path.split("/");
                const filename = p1[p1.length - 1];
                const fileData = fs.readFileSync(full_path);
                const requestOptions = {
                  url: host + "/v3/common/feign/upload/uploadConven",
                  method: "POST",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  formData: {
                    file: {
                      value: fileData,
                      options: {
                        filename: filename,
                      },
                    },
                    dev: "prod",
                    cosPath: local_path,
                    realPath: full_path,
                    fileName: filename,
                  },
                };
                return new Promise((resolve, reject) => {
                  request(requestOptions, (error, response, body) => {
                    if (error) {
                      console.error("Error:", error);
                      reject(error);
                    } else {
                      const sourceUrl = JSON.parse(body).sourceUrl;
                      const options = {
                        exam_id: item.exam_id,
                        uid: item.uid,
                        file_type: item.file_type,
                        bank_id: item.bank_id,
                        local_path: item.local_path,
                        oss_path: sourceUrl,
                        update_time: new Date(),
                      };
                      saveOrUpdateLocalFile(options).then(() => {
                        resolve();
                      });
                    }
                  });
                });
              }
            });
            Promise.all(promises).then(() => {
              let context = {
                code: 200,
                data: true,
                msg: "文件同步成功",
              };
              res.end(JSON.stringify(context));
            });
          } else {
            let context = {
              code: 200,
              data: false,
              msg: "没有需要同步的文件",
            };
            res.end(JSON.stringify(context));
          }
        });
      }
    });
  });

  // 返回端口开启结果
  server.listen(SERVER_PORT, () => {
    // 服务器正确开启
    // ////console.log(`服务器开启成功，端口: ${SERVER_PORT}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      // 服务器端口已经被使用
      ////console.log(`端口:${SERVER_PORT}被占用,请更换占用端口`);
    }
  });
}

openServer();

// 非法访问
function legalIpCallback(resNode) {
  let context = {
    code: 500,
    data: null,
    msg: "您访问的IP号段不在白名单范围内",
  };
  resNode.end(JSON.stringify(context));
}

// 关闭server
function closeServer() {
  server && server.removeAllListeners();
  server &&
    server.close(() => {
      ////console.log("服务接口关闭");
    });
}

// 获取本机的局域网IP
function getServerIp() {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
// let isLegalIp = false; // false 不在号段内，true 在号段内
function ipNumberRange(ip) {
  getSysSet().then((res) => {
    if (res.data) {
      const val = res.data || [];
      if (val.length > 0) {
        let ipList = []; //'192.168.0.1-192.168.0.100', '192.168.0.200-192.168.0.300'
        val.map((item) => {
          const _ip = item.ip_whitelist.split("-");
          ipList.push([_ip[0] || "", _ip[1] || ""]);
        });
        let isLegalIp = isIPInRange(ip, ipList);
        console.log(isLegalIp);
        return isLegalIp;
      } else {
        return false;
      }
    }
  });
}

function isIPInRange_original(ip, ipRanges) {
  function ipToInt(ipAddress) {
    return (
      ipAddress
        .split(".")
        .reduce((intVal, octet) => (intVal << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }
  const targetInt = ipToInt(ip);
  console.log(ip, ipRanges);
  for (const range of ipRanges) {
    const [startIP, endIP] = range;
    const startInt = ipToInt(startIP);
    const endInt = ipToInt(endIP);

    if (targetInt >= startInt && targetInt <= endInt) {
      return true;
    }
  }

  return false;
}

function ipToNumber(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function isIPInRange(ip, ranges) {
  const ipNumber = ipToNumber(ip);

  for (let range of ranges) {
      const [start, end] = range.split('-').map(ipToNumber);
      if (ipNumber >= start && ipNumber <= end) {
          return true;
      }
  }

  return false;
}

const express = require("express");

const multer = require("multer");
const xlsx = require("xlsx");

const appFile = express();
// appFile.use(
//   cors({
//     origin: "http://localhost:5000", // 允许跨域访问的地址   http://${getServerIp()}:${SERVER_PORT}
//     optionsSuccessStatus: 200, // 设置成功响应状态码
//   })
// );
const upload = multer({ dest: "uploads/" });
// 启动服务器;
appFile.listen(2333, () => {
  ////console.log("学生管理文件处理服务启动，端口: 2333。");
});
// 处理Excel文件上传
appFile.post("/api/teacher/addStuFile", upload.single("file"), (req, res) => {
  const cookies = req.headers.cookie;
  const examid = cookies.split("=")[1];
  // 读取上传的Excel文件
  const id = examid || "";
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  // ////console.log(data);
  // name,s_number,s_mobile,s_real_name,college,major,advisor,dataType,examId
  const enumStu = {
    姓名: "s_real_name",
    学号: "s_number",
    手机号码: "s_mobile",
    学院: "college",
    专业: "major",
    指导老师: "advisor",
  };
  const newData = data.map((item) => {
    let obj = { id: "", dataType: 0, examId: id, name: item["姓名"] };
    Object.keys(item).map((m) => {
      obj[enumStu[m]] = item[m];
    });
    return obj;
  });
  newData.forEach((item) => {
    saveOrUpdateImportStu(item);
  });
});

module.exports = { openServer, closeServer, saveOrUpdateLocalFile };
