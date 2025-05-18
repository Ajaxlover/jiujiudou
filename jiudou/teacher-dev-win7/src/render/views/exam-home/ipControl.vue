<template>
  <div class="ip-container">
    <h3>IP 访问控制</h3>
    <el-input v-model="IPvalue.ip_whitelist" :rows="5" type="textarea"
      placeholder="请输入IP地址,如:192.168.1.0-192.168.1.100,120.133.2.0-120.133.2.100" />
    <p class="tips">
      1. 网络隔离模式: 通用白名单模式。以下白名单不区分经典网络及专有网络。
    </p>
    <p class="tips">
      2. IP设置说明: 如 192.168.1.0-192.168.1.100,表示服务将在 0(包括) 到
      100(包括) 之间的IP号段内提供访问服务
    </p>
    <p class="tips">
      3.
      IP设置多个,请使用中文或英文逗号分隔开,如:192.168.1.0-192.168.1.100,120.133.2.0-120.133.2.100
    </p>
    <p class="tips">4. 若为了测试连接设置，测试后请立即修改。</p>
    <el-button type="primary" class="operate-btn" @click="updateSys">确认设置</el-button>
    <div class="ip-adress" v-if="_ip">
      <label for="ip-input">学生访问地址：</label>
      <input :value="_ip" disabled id="ip-input" />
    </div>
    <div class="clear-session">
      <h3>清理缓存</h3>
      <el-button type="primary" class="operate-btn" @click="clearSession">清理缓存</el-button>
    </div>
    <div class="online-upload">
      <h3>作答文件上传</h3>
      <el-switch v-model="isOnline" class="ml-2" inline-prompt size="large" @change="changeFileOnline"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #3678ca" active-text="实时上传" inactive-text="离线上传" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSysSet, addSysSet, updateSysSet } from "@/render/api/login";
const IPvalue: any = ref({});

const setIpWhite = () => {
  addSysSet({
    interface_name: "局域网IP",
    ...IPvalue.value,
  }).then((res: any) => {
    if (res.code === 200 && res.data) {
      getYsyData();
      ElMessage.success("配置存储成功");
    } else {
      ElMessage.error("配置存储失败");
    }
  });
};

const updateSys = () => {
  if (IPvalue.value.id) {
    updateSysSet({
      ...IPvalue.value,
    }).then((res: any) => {
      if (res.code === 200 && res.data) {
        getYsyData();
        ElMessage.success("配置存储成功");
      } else {
        ElMessage.error("配置存储失败");
      }
    });
  } else {
    setIpWhite();
  }
};

const getYsyData = () => {
  const result: any = getSysSet({});
  result.then((res: any) => {
    if (res.code === 200 && res.data) {
      const val = res.data?.data || [];
      IPvalue.value = val[0] || {};
    } else {
      ElMessage.error("考试有误，请联系老师");
    }
  });
};
const clearSession = () => {
  ElMessageBox.confirm("确认清理缓存吗？", "温馨提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      window.electronAPI.dropTable();
      const loading = ElLoading.service({
        lock: true,
        text: "正在清理，请稍等",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 3300);
    })
    .catch(() => {
      console.log("删表失败");
    });
};

const isOnline = ref(true)
const changeFileOnline = (val: any) => {
  // localStorage.setItem("uploadFileOnline", val ? '1' : '0')
  const flag = val ? '1' : '0'
  window.electronAPI.saveFileOnline(flag).then((res: any) => {
    console.log(res);
  });
}

const _ip = ref("");
onMounted(() => {
  getYsyData();
  localStorage.setItem("uploadFileOnline", isOnline.value ? '1' : '0')
  window.electronAPI.queryLocalIP().then((res: any) => {
    _ip.value = "http://" + res + ":35872";
  });
});
</script>

<style lang="scss" scoped>
.ip-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;

  .el-textarea {
    margin: 10px 0;
  }

  .tips {
    margin: 10px 0;
    color: #909399;
    font-size: 12px;
  }

  .operate-btn {
    display: block;
    margin: 0 auto;
  }

  .ip-adress {
    margin-right: 20px;

    label,
    input {
      font-size: 18px;
      font-weight: 800;
      color: rgb(156, 60, 60);
    }

    // display: flex;
    // width: 200px;
  }

  .clear-session {
    margin-top: 20px;

    h3 {
      display: inline-block;
    }

    .operate-btn {
      display: inline-block;
      margin: -2px 0 0 20px;
    }
  }

  .online-upload {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 20px;

  }
}
</style>
