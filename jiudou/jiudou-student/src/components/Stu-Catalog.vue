<template>
  <div class="course-catalog">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="(i, index) in data"
        :key="index"
        :name="`${index + 1}`"
      >
        <template slot="title">
          <span @click="stopProp($event, i)">{{ i.catalogName }}</span>
          <!-- <span v-if="i.catalogIsFree == 1 && isEnroll == 0" class="try-see"
            >试看</span
          > -->
        </template>
        <div v-if="i.catalog.length == 0" class="chapter-item-no-data">
          二级目录内容为空
        </div>
        <div
          v-else
          class="chapter-item"
          @click="changeUrl(j)"
          v-for="(j, idx) in i.catalog"
          :key="idx"
        >
          <div class="chapter-item-l">
            <span class="video-icon"></span>
            <span>{{ j.catalogName }}</span>
          </div>
          <!-- <span v-if="j.isStudy == 1 && isEnroll == 1" class="try-see"
            >上次学到</span
          > -->
          <span v-if="j.catalogIsFree == 1 && isEnroll == 0" class="try-see"
            >试看</span
          >
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "stu-catalog",
  props: {
    data: Array,
    clickType: Number,
    courseId: String,
    isEnroll: String,
  },
  data() {
    return {
      activeNames: [],
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleChange(val) {
      // console.log(val);
    },
    stopProp(e, i) {
      e.stopPropagation();
      if (!i.catalogUrl) {
        return;
      }
      if (i.catalogSubType != 2) {
        // 非视频
        this.$message({
          title: "提示",
          message: "非视频内容暂不支持查看,请下载九斗App进行查看",
          type: "warning",
          offset: 80,
        });
        return;
      }
      if (this.isEnroll == 0 && i.catalogIsFree == 0) {
        this.$message({
          title: "提示",
          message: "您还没有获取哦~",
          type: "warning",
          offset: 80,
        });
        return;
      }

      // 云课详情页
      this.$router.push({
        name: "cloudPlay",
        params: {
          courseId: this.courseId,
        },
      });
      this.$store.commit("setVideoUrl", i);
      this.$emit("switchVideo", i);
    },
    changeUrl(j) {
      console.log(j);
      if (this.clickType === 1) {
        if (j.catalogSubType != 2) {
          // 非视频
          this.$message({
            title: "提示",
            message: "非视频内容暂不支持查看,请下载九斗App进行查看",
            type: "warning",
            offset: 80,
          });
          return;
        }
        if (this.isEnroll == 0 && j.catalogIsFree == 0) {
          this.$message({
            title: "提示",
            message: "您还没有获取哦~",
            type: "warning",
            offset: 80,
          });
          return;
        }

        // 云课详情页
        this.$router.push({
          name: "cloudPlay",
          params: {
            courseId: this.courseId,
          },
        });
        this.$store.commit("setVideoUrl", j);
        this.$emit("switchVideo", j);
      } else if (this.clickType === 2) {
        this.$emit("switchVideo", j);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.course-catalog {
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
