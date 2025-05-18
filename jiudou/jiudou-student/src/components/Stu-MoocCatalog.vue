<template>
  <div class="mooc-catalog">
    <el-collapse v-model="activeNames" @change="handleChange">
      <div>
        <el-collapse-item
          :key="index"
          v-for="(i, index) in data"
          :name="`${index + 1}`"
        >
          <template slot="title">
            <span @click="stopProp">{{ i.name }}</span>
          </template>
          <div v-if="i.cataList.length == 0" class="chapter-item-no-data">
            目录内容为空
          </div>
          <div
            v-else
            class="chapter-item"
            @click="changeUrl(j)"
            v-for="(j, idx) in i.cataList"
            :key="idx"
          >
            <div class="chapter-item-l">
              <span class="video-icon"></span>
              <span>{{ j.name }}</span>
            </div>
            <!-- <span class="try-see">试看</span> -->
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "stu-moocCatalog",
  props: {
    data: Array,
    clickType: Number,
    courseId: String,
    isEnroll: String,
  },
  data() {
    return {
      activeNames: ["1"],
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleChange(val) {
      // console.log(val);
    },
    stopProp(e) {
      e.stopPropagation();
    },
    // eslint-disable-next-line no-unused-vars
    changeUrl(j) {
      if (this.isEnroll == 0) {
        this.$message({
          title: "提示",
          message: "您还没有报名哦~",
          type: "warning",
          offset: 80,
        });
        return;
      }
      this.$router.push({
        name: "moocPlay",
        params: {
          moocId: this.courseId,
        },
      });
      this.$store.commit("setMoocVideo", j);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mooc-catalog {
  /deep/ .el-collapse-item__header {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
  }
  /deep/ .el-collapse-item__header.is-active {
    border-bottom-color: #ebeef5;
  }
  .chapter-item-no-data {
    line-height: 40px;
    font-size: 16px;
  }
  .chapter-item {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    &:hover {
      background-color: #f7f7f7;
      color: #049efb;
    }
    .chapter-item-l {
      display: flex;
      align-items: center;
      .video-icon {
        background: url("../assets/img/video_icon.png") no-repeat center;
        background-size: 60%;
        width: 50px;
        height: 50px;
      }
    }

    .try-see {
      color: #10c4ee;
      padding: 0 2px;
    }
  }
}
</style>
