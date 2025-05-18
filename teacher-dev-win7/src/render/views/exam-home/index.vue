<template>
  <div class="exam-home">
    <!-- <el-menu default-active="1" :active="activeKey" mode="horizontal" class="el-menu-vertical-demo" @select="handleOpen">
      <el-menu-item index="1">
        <span>考试题库</span>
      </el-menu-item>
      <el-menu-item index="2">
        <span>考试列表</span>
      </el-menu-item>
    </el-menu> -->
    <el-tabs
      v-model="activeKey"
      :class="['demo-tabs', Number(activeKey) > 3 ? 'tabContent' : '']"
      @tab-click="handleOpen"
    >
      <el-tab-pane label="考试列表" name="1"> </el-tab-pane>
      <el-tab-pane label="题库管理列表" name="2"> </el-tab-pane>
      <el-tab-pane label="组卷列表" name="3"> </el-tab-pane>
      <!-- <el-tab-pane label="学生管理列表" name="4">
        <StuManageList />
      </el-tab-pane> -->
      <el-tab-pane label="数据同步" name="4">
        <DataSync ref="dataSyncRef" />
      </el-tab-pane>
      <el-tab-pane label="系统管理" name="5">
        <IpControl />
      </el-tab-pane>
    </el-tabs>
    <div
      class="content"
      :style="{ display: Number(activeKey) > 3 ? 'none' : 'block' }"
    >
      <!-- <iframe src="http://localhost:6060" frameborder="0" class="iframe" ref="iframeSrc"></iframe> -->
      <!-- <iframe src="https://tfwww.jiudou123.com/" frameborder="0" class="iframe" ref="iframeSrc"></iframe> -->
      <!-- 预发 -->
      <iframe
        src="https://tfwww.jiudou123.com/"
        frameborder="0"
        class="iframe"
        ref="iframeSrc"
        v-if="env == 'development'"
      ></iframe>
      <!-- 生产 -->
      <iframe
        v-else
        src="https://www.jiudou123.com/"
        frameborder="0"
        class="iframe"
        ref="iframeSrc"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { getUserInfor, startExam } from "@/render/api/login"
import { tools } from "@/render/utils/tools"
import { useAppStore } from "@/render/store/modules/app"
import { request_url } from "@/render/utils/config"

import DataSync from "./dataSync.vue"
import IpControl from "./ipControl.vue"

const env = ref("development")

if (request_url.indexOf("tfapi") > -1) {
  env.value = "development"
} else {
  env.value = "production"
}

const appStore = useAppStore()

const router = useRouter()
const route: any = useRoute()
const centerDialogVisible = ref(false)

const isExam = ref(true)

const userExam: any = computed(() => {
  return appStore.user.exam[0]
})
const startExamination = () => {
  const infor: any = JSON.parse(JSON.stringify(userExam.value))
  const result: any = startExam({
    examId: infor.id,
  })
  result.then((res: any) => {
    if (res.code === 200 && res.data?.length > 0) {
      appStore.setQuestionList(res.data)
      setTimeout(() => {
        router.push({
          path: "/questions",
        })
      }, 300)
    } else {
      ElMessage.error("考试有误，请联系老师")
    }
  })
}

const dataSyncRef: any = ref(null)

// const iframePath: any = ref({
//   "0": "http://0.0.0.0:8081/",
//   "1": "http://0.0.0.0:8081/exam/examManage",
//   "2": "http://0.0.0.0:8081/tiku/tiku",
//   "3": "http://0.0.0.0:8081/paper/paper",
// });
const iframePath: any = ref({
  "1": "/exam/examManage",
  "2": "/tiku/tiku",
  "3": "/paper/paper",
})
const activeKey = ref("0")
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
//   activeKey.value = key;
// };
const handleOpen = (tab: any, event: Event) => {
  activeKey.value = tab.props.name
  console.log(tab.props.name)
  console.log(dataSyncRef.value)
  if (tab.props.name === "4") {
    dataSyncRef.value.getList()
  }
  if (
    tab.props.name === "1" ||
    tab.props.name === "2" ||
    tab.props.name === "3"
  ) {
    let data = {
      data: {
        isChangeTab: 1,
        path: iframePath.value[tab.props.name],
      },
    }
    console.log(data, "--------------")

    iframeSrc.value.contentWindow.postMessage(data, "*")
  }
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const iframeSrc = ref()
const handleToIframe = () => {
  let data = {
    data: {
      username: route.query.username,
      password: route.query.pw,
      path: "/admin/exam/examManage",
    },
  }
  iframeSrc.value.contentWindow.postMessage(data, "*")
  setTimeout(() => {
    activeKey.value = "1"
  }, 400)
}

onMounted(() => {
  iframeSrc.value.onload = () => {
    handleToIframe()
  }
  // window.electronAPI.setLogin('登陆成功')
})
</script>

<style>
#app .footer-container {
  bottom: 30px;
}
</style>

<style lang="scss" scoped>
.exam-home {
  position: relative;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // text-align: center;
  background-color: #f1f8fe;
  height: calc(100vh - 80px);

  .el-menu-vertical-demo {
    // position: absolute;
    // height: 100%;
    // left: 0;
    // top: 0;
    width: 100%;

    .el-menu-item.is-active {
      background: #edf6ff;
    }
  }

  :deep(.el-tabs__header) {
    padding: 0 10px;
  }

  .content {
    flex: 1;
    // margin-left: 150px;
    height: calc(100vh - 260px);

    .iframe {
      width: 100%;
      height: 100%;
    }
  }

  .tabContent {
    :deep(.el-tabs__content),
    :deep(.el-tab-pane) {
      flex: 1;
      // margin-left: 150px;
      height: calc(100vh - 230px);
      overflow-y: scroll;
    }
  }

  .iframe-content {
    display: block;
  }
}
</style>
