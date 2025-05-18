<template>
  <div class="data-container">
    <div class="search">
      <div>考试名称: <el-input v-model="searchParam.examName" /></div>
      <div style="margin: 0 10px">
        考试时间:
        <el-date-picker
          v-model="searchParam.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeDate"
        />
      </div>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="primary" @click="examFrequency">同步考试场次</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="exam_name" label="考试名称" />
      <el-table-column label="考试口令">
        <template #default="scope">
          {{ scope.row.password || "-" }}&nbsp;<a
            style="color: #2ea9e6; cursor: pointer"
            @click="copypw(scope.row.password)"
            >复制</a
          >
        </template>
      </el-table-column>
      <el-table-column label="总分">
        <template #default="scope">
          {{ scope.row.score || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="考试开始时间">
        <template #default="scope">
          {{
            scope.row.start_time
              ? tools.timestampToDate(scope.row.start_time)
              : "未设置"
          }}
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间">
        <template #default="scope">
          {{
            scope.row.end_time
              ? tools.timestampToDate(scope.row.end_time)
              : "未设置"
          }}
        </template>
      </el-table-column>
      <el-table-column label="考试创建时间">
        <template #default="scope">
          {{
            scope.row.create_time
              ? tools.timestampToDate(scope.row.create_time)
              : "未设置"
          }}
        </template>
      </el-table-column>
      <el-table-column label="考试状态">
        <template #default="scope">
          {{
            scope.row.status
              ? ["未发布", "已发布", "进行中", "已结束"][scope.row.status]
              : "-"
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <span class="operate-btn" @click="stuInforSync(scope.row)"
            >学生信息同步</span
          >
          <span class="operate-btn" @click="examInforSync(scope.row)"
            >考试信息同步</span
          >
          <span class="operate-btn" @click="stuManageList(scope.row)"
            >学生管理列表</span
          >
          <span class="operate-btn" @click="lookMonitorList(scope.row)"
            >考试监控</span
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="searchParam.pageIndex"
      :page-size="10"
      :small="false"
      :disabled="false"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-model="dialogVisible"
      title="学生列表"
      width="65%"
      :destroy-on-close="true"
    >
      <StuManageList :examInfor="dialogExamItem" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import StuManageList from "./stuManageList.vue";
import { tools } from "@/render/utils/tools";
import {
  stuList,
  examList,
  syncStuInfo,
  syncStuResult,
  getExamList,
} from "@/render/api/login";
import { useAppStore } from "@/render/store/modules/app";
const appStore = useAppStore();

import clipboard3 from "vue-clipboard3";
const { toClipboard } = clipboard3();

const userExam: any = computed(() => {
  return appStore.user.user;
});

const tableData = ref([]);

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
const changeDate = (value: any) => {
  if (value) {
    searchParam.value.createTimeStart = Date.parse(value[0]);
    searchParam.value.createTimeEnd = Date.parse(value[1]);
  } else {
    searchParam.value.createTimeStart = "";
    searchParam.value.createTimeEnd = "";
  }
};
const handleSizeChange = (val: number) => {
  searchParam.value.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  searchParam.value.pageIndex = val;
  getList();
};
const searchParam: any = ref({
  date: [],
  examName: "",
  createTimeStart: "",
  createTimeEnd: "",
  uid: userExam.value.uid,
  pageIndex: 1,
  pageSize: 10,
});

const total = ref(0);
const getList = () => {
  const result: any = examList(searchParam.value);
  result.then((res: any) => {
    if (res.code === 200 && res.data) {
      total.value = res.data?.totalCount || 0;
      tableData.value = res.data?.data || [];
    } else {
      // ElMessage.error(res.msg || "数据有误，请联系管理员");
    }
  });
};

const stuInforSync = (item: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "数据同步中，请稍等",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const result: any = stuList({
    examId: item.id,
    dataType: 0,
    synStatus: 0,
  });
  result.then((res: any) => {
    if (res.code === 200 && res.data) {
      const list = res.data?.data || [];
      if (list.length === 0) {
        ElMessage.warning("暂无需要同步的数据");
        setTimeout(() => {
          loading.close();
        }, 1000);
      } else {
        // [{ "number": "123", "name": "朱四龙", "sUid": "1111", "dataType": 0 }]
        const result2: any = syncStuInfo({
          examId: item.id,
          memberListJson: list,
        });
        result2.then((res: any) => {
          if (res.code === 200) {
            ElMessage.success("学生信息同步完成");
            getList();
          } else {
            ElMessage.error("信息同步有误，请联系管理员");
          }
          setTimeout(() => {
            loading.close();
          }, 1000);
        });
      }
    }
  });
};
const examInforSync = (item: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "数据同步中，请稍等",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const result: any = syncStuResult({
    examId: item.id,
  });
  result
    .then((res: any) => {
      if (res && res.code === 200) {
        ElMessage.success(res.msg || "考试信息同步完成");
        getList();
      } else {
        ElMessage.error("信息同步有误，请联系管理员");
      }
      setTimeout(() => {
        loading.close();
      }, 1000);
    })
    .catch(() => {
      loading.close();
    });
};
const examFrequency = (item: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "数据同步中，请稍等",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const result: any = getExamList({
    uid: userExam.value.uid,
    pageNo: 1,
    pageSize: 200,
  });
  result
    .then((res: any) => {
      if (res && res.code === 200) {
        ElMessage.success("考试信息同步完成");
        setTimeout(() => {
          getList();
        }, 3000);
      } else {
        ElMessage.error("信息同步有误，请联系管理员");
      }
      setTimeout(() => {
        loading.close();
      }, 3300);
    })
    .catch(() => {
      loading.close();
    });
};

const dialogVisible = ref(false);
const dialogExamItem = ref({});
const stuManageList = (item: any) => {
  dialogExamItem.value = item;
  dialogVisible.value = true;
  // const loading = ElLoading.service({
  //     lock: true,
  //     text: "数据同步中，请稍等",
  //     background: "rgba(0, 0, 0, 0.7)",
  // });
  // setTimeout(() => {
  //         loading.close();
  //     }, 1000);
};
const lookMonitorList = (item: any) => {
  window.electronAPI.openFolder(JSON.parse(JSON.stringify(item)));
};
onMounted(() => {
  getList();
});

defineExpose({ getList });
</script>

<style lang="scss" scoped>
.data-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;

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

    :deep(.el-range-editor) {
      flex-grow: inherit;
      width: 400px;
    }
  }

  .el-pagination {
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
