<template>
  <div class="question-container">
    <div class="question-wrapper">
      <!-- <h2>{{ quesionItem?.course_name || "" }}</h2> -->
      <SingleChoice :content="quesionItem" v-if="quesionItem.tSubject == 1 || quesionItem.tSubject == 2" />
      <MultipleChoice :content="quesionItem" v-else-if="quesionItem.tSubject == 3" />
      <div class="btns">
        <el-button type="primary" @click="answer('-')">上一题</el-button>
        <el-button type="primary" @click="answer('+')">下一题</el-button>
      </div>
    </div>
    <div class="exam-infor">
      <User />
      <div class="subject">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="item of Object.keys(questionMap)" :title="qusetionEnum[item]" :name="item"
            :key="'qusetion' + item">
            <div class="queston-status">
              <span v-for="(self, index) of questionMap[item]" :class="[
                'question-index',
                self.stuAnswer ? 'question-active' : '',
              ]" :key="self.bankId" @click="chooseQue(self)">
                {{ self.queIndex + 1 }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="operate">
        <el-button @click="save">保存答案</el-button>
        <el-button type="primary" @click="submit">我要交卷</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  getCurrentInstance,
  nextTick,
  computed,
  watchEffect,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import SingleChoice from "./singleChoice.vue";
import MultipleChoice from "./multipleChoice.vue";
import User from "@/render/views/exam-card/user.vue";
import { useAppStore } from "@/render/store/modules/app";
const appStore: any = useAppStore();
const router = useRouter();

const activeNames: any = ref([]);
const handleChange = (val: string[]) => {
  activeNames.value = val;
};

const qusetionEnum: any = ref({
  0: "其他题目",
  1: "判断题",
  2: "单选题",
  3: "多选题",
  4: "填空题",
  5: "问答题",
  11: "组合题",
});
const questionMap: any = ref({});
const questionList: any = ref([]);
const quesionItem: any = ref({});
// const getList = async (val: number) => {
//     const res = await window.electronAPI.querySubject(val);
//     if (res.code === 200) {
//         quesionItem.value = res.data[0];
//     }
// }
const chooseQue = (item: any) => {
  quesionItem.value = { ...item };
};

const answer = (flag: string) => {
  const _index = quesionItem.value.queIndex;
  if (flag === "-" && quesionItem.value.queIndex === 0) {
    ElMessage.warning("本题是第一题");
    return false;
  }
  if (
    flag === "+" &&
    quesionItem.value.queIndex === questionList.value.length - 1
  ) {
    ElMessage.warning("本题已是最后一题");
    return false;
  }
  if (flag === "-") {
    quesionItem.value = questionList.value[_index - 1];
  }
  if (flag === "+") {
    quesionItem.value = questionList.value[_index + 1];
  }
};

// 保存试卷
const save = () => {
  ElMessageBox.confirm("您确定要保存您的试卷吗?", "温馨提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "试卷已保存",
      });
      setTimeout(() => {
        router.push({
          path: "/",
        });
      }, 500);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "试卷保存失败",
      });
    });
};
// 提交答案
const submit = () => {
  ElMessageBox.confirm("您确定要提交您的试卷吗?", "温馨提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "您已交卷",
      });
      setTimeout(() => {
        router.push({
          path: "/",
        });
      }, 500);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "试卷提交失败",
      });
    });
};
// const activeNames = appStore.$computed(() => Object.keys(appStore.questionMap));
const list = computed(() => appStore.questionList);
const listMap = computed(() => appStore.questionMap);
watch(
  list,
  (newValue, oldValue) => {
    questionList.value = newValue;
  },
  { immediate: true, deep: true }
);
watch(
  listMap,
  (newValue, oldValue) => {
    questionMap.value = newValue;
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  nextTick(() => {
    activeNames.value = Object.keys(appStore.questionMap);
    // questionList.value = appStore.questionList;
    // questionMap.value = appStore.questionMap;
    quesionItem.value = appStore.questionList[0];
  });
});
</script>

<style scoped lang="scss">
.question-container {
  display: flex;
  justify-content: space-between;
  padding: 10px;

  .question-wrapper {
    position: relative;
    // flex: 1;
    width: calc(100vw - 400px);
    height: calc(100vh - 200px);
    overflow-y: scroll;
    padding: 40px;
    -webkit-box-shadow: 1px 2px 3px 4px #eee;
    box-shadow: 1px 2px 3px 4px #eee;
    margin: 20px 0 0 20px;
    background: #ffffff;
    border-radius: 13px;

    .btns {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .exam-infor {
    width: 352px;
    height: calc(100vh - 200px);
    margin-left: 10px;
    padding-top: 20px;

    ::v-deep(.el-collapse-item__header) {
      background: #3678ca;
      border-radius: 5px;
      color: #ffffff;
      padding: 0 10px;
    }

    .queston-status {
      padding: 10px;
      max-height: 300px;
      display: flex;
      flex-wrap: wrap;

      &::-webkit-scrollbar {
        width: 4px;
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #9a9a9a;
      }

      &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #e3ecf6;
      }
    }

    .question-index {
      padding: 10px 15px;
      width: 42px;
      text-align: center;
      font-size: 12px;
      font-family: STHeiti;
      font-weight: 400;
      color: #000000;
      background: #e0ecf7;
      border-radius: 5px;
      margin: 10px 10px 0 10px;
      cursor: pointer;
    }

    .question-active {
      background: #3678ca;
      color: #ffffff;
    }
  }

  .subject {
    height: calc(100% - 250px);
    overflow-y: scroll;
  }

  .operate {
    margin: 10px 0;
    text-align: center;
  }
}
</style>
