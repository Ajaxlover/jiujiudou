<template>
  <div class="data-container">
    <div class="search">
      <div>
        考生学号: <el-input v-model="searchParam.sNumber" placeholder="学号" />
      </div>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="primary" @click="() => {
        flag = 1;
        dialogFormVisible = true;
      }
        ">添加学生</el-button>
      <el-button type="primary" @click="batchAdd">批量添加</el-button>
      <el-button type="primary" @click="jiudouStu">同步九斗学生</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="s_real_name" label="姓名" />
      <!-- <el-table-column prop="s_number" label="学号" /> -->
      <el-table-column label="学号">
        <template #default="scope">
          {{ scope.row.s_number || "-" }}
          &nbsp;<a style="color: #2ea9e6; cursor: pointer" @click="copypw(scope.row.s_number)">复制</a>
        </template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template #default="scope">
          {{ scope.row.s_mobile || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="学校">
        <template #default="scope">
          {{ scope.row.school || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="学院">
        <template #default="scope">
          {{ scope.row.college || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="专业">
        <template #default="scope">
          {{ scope.row.major || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="指导老师">
        <template #default="scope">
          {{ scope.row.advisor || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录状态">
        <template #default="scope">
          {{ scope.row.login_status === 1 ? "已登录" : "未登录" }}
        </template>
      </el-table-column>
      <el-table-column label="是否交卷">
        <template #default="scope">
          {{ scope.row.submitPaper === 1 ? "已交卷" : "未交卷" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <span class="operate-btn" @click="() => editStudent(scope.row)" v-if="scope.row.data_type !== 1">编辑</span>
          <span class="operate-btn" @click="() => deleteStudent(scope.row)">删除</span>
          <span class="operate-btn" @click="() => loginStudent(scope.row)" v-if="scope.row.login_status === 1">重置登录</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="searchParam.pageIndex" :page-size="10" :small="false" :disabled="false"
      layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <el-dialog v-model="dialogFormVisible" width="500" title="导入学生">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.s_real_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="form.s_number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.s_mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学院" :label-width="formLabelWidth">
          <el-input v-model="form.college" autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="form.major" autocomplete="off" />
        </el-form-item>
        <el-form-item label="指导老师" :label-width="formLabelWidth">
          <el-input v-model="form.advisor" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addStudent">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="stuFileVisible" width="500" title="导入学生">
      <form id="form" :action="ipVal" method="POST" enctype="multipart/form-data" target="myframe">
        <el-button type="default" class="file-box">
          <input type="file" name="file" />
        </el-button>
        <el-button type="primary" class="file-box">
          <button type="submit">上传</button>
        </el-button>
      </form>
      <iframe src="" width="200" height="200" frameborder="0" name="myframe" style="display: none"></iframe>
      <!-- <form id="uploadForm">
        <input type="file" id="excelFile" accept=".xlsx, .xls" />
        <button type="submit">上传</button>
      </form> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { tools } from "@/render/utils/tools";
import clipboard3 from "vue-clipboard3";
const { toClipboard } = clipboard3();
import {
  stuList,
  addStu,
  updateStudent,
  delStudent,
  queryJiudouStuInfoList,
  logout,
  batchGetExamResult
} from "@/render/api/login";
const copypw = async (value: string) => {
  try {
    await toClipboard(value);
    ElMessage({
      type: "success",
      message: "复制成功!",
    });
  } catch (err) {
    console.error(err);
    ElMessage({
      type: "error",
      message: "复制失败，请手动复制",
    });
  }
};
const infor: any = ref();
const props = defineProps({
  examInfor: Object,
});

let form: any = ref({
  examId: "",
  id: "",
  name: "",
  s_number: "",
  s_mobile: "",
  college: "",
  major: "",
  advisor: "",
  s_real_name: "",
});
const searchParam: any = ref({
  sNumber: "",
  pageIndex: 1,
  pageSize: 10,
  examId: "",
});
watch(
  () => props.examInfor,
  (val: any) => {
    document.cookie = "examId=" + val.id;
    form.value.examId = val.id;
    searchParam.value.examId = val.id;
    infor.value = { ...val };
  },
  { immediate: true, deep: true }
);
const dialogFormVisible = ref(false);
const stuFileVisible = ref(false);
const batchAdd = () => {
  stuFileVisible.value = true;
  setTimeout(() => {
    (document.getElementById("form") as any).addEventListener(
      "submit",
      function (event) {
        // event.preventDefault();
        setTimeout(() => {
          ElMessage({
            type: "success",
            message: "上传完成",
          });
          getList();
        }, 200);
      }
    );
  }, 300);
  // setTimeout(() => {
  //   document
  //     .getElementById("uploadForm")
  //     .addEventListener("submit", function (event) {
  //       event.preventDefault();
  //       const fileInput = document.getElementById("excelFile");
  //       const file = fileInput.files[0];

  //       // 使用 FormData 来构建包含文件的请求
  //       const formData = new FormData();
  //       formData.append("excelFile", file);

  //       // 发送文件到后端
  //       fetch(ipVal.value, {
  //         method: "POST",
  //         body: formData,
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           console.log(data); // 可以在这里处理后端返回的数据
  //         })
  //         .catch((error) => {
  //           console.error("上传出错:", error);
  //         });
  //     });
  // }, 300);
};
const allKeysHaveValue = (obj: any) => {
  return Object.keys(obj).every((key) => !obj[key]);
};
const formLabelWidth = "100px";
const flag = ref(1); //1 新增， 2 更新

const resetForm = () => {
  form.value = {
    examId: infor.value.id || "",
    id: "",
    name: "",
    s_number: "",
    s_mobile: "",
    college: "",
    major: "",
    advisor: "",
    s_real_name: "",
  };
};
const editStudent = (item: any) => {
  flag.value = 2;
  form.value.examId = infor.value.id || "";
  form.value.id = item.id;
  form.value.s_real_name = item.s_real_name;
  form.value.s_number = item.s_number;
  form.value.s_mobile = item.s_mobile;
  form.value.college = item.college || "";
  form.value.major = item.major || "";
  form.value.advisor = item.advisor || "";
  dialogFormVisible.value = true;
};
const deleteStudent = (item: any) => {
  ElMessageBox.confirm("确定要删除此学生信息吗？", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const result: any = delStudent({ id: item.id });
      result.then((res: any) => {
        if (res.code === 200 && res.data) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          getList();
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {
      ElMessage.error("删除失败");
    });
};
const addStudent = () => {
  const isEmpty = allKeysHaveValue(form.value);
  if (isEmpty) {
    ElMessage.warning("请将学生信息填写完整");
  } else {
    if (flag.value === 2) {
      updateStudent(form.value).then((res) => {
        if (res.code == 200 && res.data) {
          ElMessage.success("学生信息更新成功");
          dialogFormVisible.value = false;
          setTimeout(() => {
            resetForm();
            getList();
          }, 300);
        } else {
          ElMessage.error("学生信息更新失败");
        }
      });
    } else {
      addStu(Object.assign(form.value, { dataType: 0 })).then((res) => {
        if (res.code == 200 && res.data) {
          ElMessage.success("学生信息添加成功");
          dialogFormVisible.value = false;
          setTimeout(() => {
            resetForm();
            getList();
          }, 300);
        } else {
          ElMessage.error("学生信息添加失败");
        }
      });
    }
  }
};
const loginStudent = (item: any) => {
  if (item.login_status === 1) {
    ElMessageBox.confirm("确定要重置学生登录吗？", "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        const result: any = logout({
          stuId: item.id,
        });
        result.then((res: any) => {
          if (res.code === 200 && res.data) {
            ElMessage({
              type: "success",
              message: "重置成功",
            });
            getList();
          } else {
            ElMessage.error("重置失败");
          }
        });
      })
      .catch(() => { });
  } else {
    ElMessage.warning("学生未登录，无须重置");
  }
};

const tableData: any = ref([]);
const handleSizeChange = (val: number) => {
  searchParam.value.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  searchParam.value.pageIndex = val;
  getList();
};

const total = ref(0);

const getList = () => {
  const result: any = stuList(searchParam.value);
  result.then((res: any) => {
    if (res.code === 200 && res.data) {
      total.value = res.data?.totalCount || 0;
      tableData.value = res.data?.data || [];

      const ids = tableData.value.map((user: any) => {
        return (user.data_type === 1
          ? user.s_uid
          : user.class_id + "" + user.id)
      });
      isFinishExam(ids || [])
    } else {
      ElMessage.error("考试有误，请联系老师");
    }
  });
};

// 是否交卷
const isFinishExam = (ids: any) => {
  const result: any = batchGetExamResult({
    exam_id: searchParam.value.examId,
    u_ids: ids
  });
  result.then((res: any) => {
    if (res.code === 200 && res.data) {
      // submitPaper 新增字段
      const answer = res.data.data || [];
      const list = tableData.value.map((user: any) => {
        const id = user.data_type === 1
          ? user.s_uid
          : user.class_id + "" + user.id;

        const answerCount = answer.find((item: any) => item.uid == id);
        if (answerCount) {
          user.submitPaper = answerCount.answer_count >= 1 ? 1 : 0;
        }
        return user;
      });
      tableData.value = list;
    }
  });
}

const jiudouStu = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "数据同步中，请稍等",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const result: any = queryJiudouStuInfoList({
    examId: infor.value.id,
  });
  result.then((res: any) => {
    if (res && res.code === 200) {
      ElMessage.success("学生信息同步完成");
      setTimeout(() => {
        getList();
      }, 2000);
    } else {
      ElMessage.error("信息同步有误，请联系管理员");
    }
    setTimeout(() => {
      loading.close();
    }, 2200);
  });
};

const ipVal: any = ref("");
onMounted(() => {
  getList();
  // sessionStorage.setItem("examidStuAdd", infor.value.id);
  // const _adr: any = sessionStorage.getItem("ipLocal")?.split(":");
  const isDev = location.hostname.indexOf("localhost") > -1;
  const ipAdr = isDev
    ? "http://localhost:2333"
    : sessionStorage.getItem("ipLocal");
  ipVal.value = ipAdr + "/api/teacher/addStuFile";
  // ipVal.value = _adr[0] + _adr[1] + ":2333/api/teacher/addStuFile";
});
</script>

<style lang="scss" scoped>
.data-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;

  :deep(.el-form-item__content) {
    flex: none;
    width: 300px;
  }

  .operate-btn {
    display: inline-block;
    margin-right: 5px;
    font-size: 12px;
    cursor: pointer;
    color: rgb(79, 123, 212);
  }

  .search {
    display: flex;
    margin-bottom: 10px;

    .el-input {
      width: 200px;
      display: inline-block;
    }

    .upload-operate {
      margin-left: 12px;

      .el-upload-list {
        margin: 0;
      }
    }

    :deep(.el-range-editor) {
      flex-grow: inherit;
      width: 400px;
    }
  }

  .el-pagination {
    justify-content: flex-end;
    margin-top: 10px;
  }

  #form {
    margin-left: 12px;
  }

  .file-box {
    position: relative;

    button {
      background: transparent;
      border: none;
      color: #fff;
    }

    // input {
    //   width: 160px;
    //   height: 30px;
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   z-index: 99;
    // }
  }

  // .file-box div {
  //   height: 35px;
  //   line-height: 35px;
  //   background-color: #03a9f4;
  //   color: #fff;
  //   width: 100px;
  //   text-align: center;
  //   font-size: 14px;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   z-index: 98;
  // }
}
</style>
