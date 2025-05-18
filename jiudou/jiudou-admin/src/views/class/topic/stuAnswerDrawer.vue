<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    :modal="false"
    size="40%"
  >
    <div class="vote-detail">
      <div class="main" v-for="(item, index) in data" :key="index">
        <div>
          <img :src="item.stuPic || defaultPic" alt="touxiang" />
        </div>
        <div class="main-text">
          <span>{{ item.stuName }}</span>
          <span>{{ item.stuNumber }}</span>
        </div>
        <div
          class="main-answer"
          :class="{ active: !item.status || item.status == 3 }"
        >
          <span>{{ item.stuAnswer ? item.stuAnswer : "未答" }}</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "stuAnswerDrawer",
  props: {
    title: String,
    drawer: Boolean,
    direction: String,
    data: Array
  },
  data() {
    return {
      defaultPic:
        "data:image/png;base64,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"
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss">
.vote-detail {
  display: flex;
  flex-wrap: wrap;
  .main {
    display: flex;
    padding: 20px;
    div {
      height: 60px;
      margin-right: 20px;
      img {
        width: 60px;
        border-radius: 50%;
      }
    }
    .main-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .main-answer {
      display: flex;
      align-items: center;
    }
  }
  .active {
    color: red;
  }
}
</style>
