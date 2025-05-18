<template>
  <div class="single-question">
    <div
      class="title"
      v-html="question.queIndex + 1 + '. ' + question.title"
    ></div>
    <div class="content">
      <el-radio-group v-model="name" @change="onchange">
        <el-radio
          v-for="item of question.answerList"
          :key="item.option"
          :label="item.option"
          size="large"
        >
          {{ item.text }}
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, nextTick, watch } from "vue";
const { proxy } = getCurrentInstance() as any;

import { useAppStore } from "@/render/store/modules/app";
const appStore: any = useAppStore();

const props = defineProps({
  content: {
    type: Object,
    default: {},
  },
});
const name = ref("");
const question: any = ref({});
watch(
  () => props.content,
  (value) => {
    name.value = "";
    question.value = { ...value };
  },
  { immediate: true, deep: true }
);

const onchange = (value: any) => {
  if (value !== undefined && value !== null) {
    const _answer = { ...question.value, stuAnswer: value };
    const list = JSON.parse(JSON.stringify(appStore.questionList));
    list.splice(question.value.queIndex, 1, _answer);

    let listMap = JSON.parse(JSON.stringify(appStore.questionMap));
    const list1 = JSON.parse(JSON.stringify(listMap[question.value.tSubject]));
    const ary: any = [];
    list1.map((item: any) => {
      if (item.bankId === question.value.bankId) {
        ary.push({ ...item, stuAnswer: value });
      } else {
        ary.push(item);
      }
    });
    listMap[question.value.tSubject] = [...ary];

    appStore.changeQueList(list, listMap);
  }
};

onMounted(() => {
  nextTick(() => {
    //这里要注意，使用$nextTick等组件数据渲染完之后再调用MathJax渲染方法，要不然会获取不到数据
    // if (proxy.MathJax.isMathjaxConfig) {//判断是否初始配置，若无则配置。
    //     proxy.MathJax.initMathjaxConfig();
    // }
    // proxy.MathJax.MathQueue("question-wrapper");//传入组件id，让组件被MathJax渲染
  });
});
</script>

<style>
.single-question .title p {
  display: inline-block;
}
</style>

<style scoped lang="scss">
.single-question {
  .title {
    color: #333;
    font-weight: 700;
    font-size: 18px;
    margin: 40px 0;
  }

  .el-radio-group {
    display: block;
  }

  .el-radio {
    display: block;
  }
}
</style>
