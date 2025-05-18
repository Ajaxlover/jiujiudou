<template>
  <div class="course-catalog">
    <el-tree
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="true"
      node-key="catalogId"
      highlight-current
      @node-click="clickNode"
      ref="vueChapterTree"
      icon-class="el-icon-arrow-right"
    >
      <span class="custom-tree-node" ref="popover" slot-scope="{ node, data }">
        <div
          v-if="data.catalogType == 1 && data.catalogSubType == 2"
          class="video-icon"
        ></div>
        <span
          :title="node.label"
          v-if="data.catalogType == 0 || data.catalogSubType == 8"
          >{{ node.label }}</span
        >
        <span :title="node.label" v-else style="cursor: pointer">
          {{ node.label }}</span
        >
        <span v-if="data.catalogIsFree == 1" class="try-see">试看</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import axios from "@/libs/api.request";

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
      defaultProps: {
        children: "catalog",
        label: "catalogName",
      },
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    clickNode(data, node, obj) {
      // console.log(data);
      // console.log(node);
      // console.log(obj);
      if (data.catalogType == 0) {
        // 非叶子节点
        return;
      }
      // if (!data.catalogUrl) {
      //   return;
      // }
      if (data.catalogSubType != 2) {
        if (data.catalogSubType == 9) {
          if (this.isEnroll == 0 && data.catalogIsFree == 0) {
            this.$message({
              title: "提示",
              message: "您还没有获取哦~",
              type: "warning",
              offset: 80,
            });
            return;
          }
          axios
            .request({
              method: "post",
              responseType: "blob",
              url: `/cloudCourse/detailByCatalogId`,
              data: {
                catalogId: data.catalogId,
              },
            })
            .then((res) => {
              console.log(res);
              let blob = new Blob([res.data]);
              let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
              window.open("../pdf/web/viewer.html?file=" + fileURL);
            });
          return;
        } else {
          // 非视频
          this.$message({
            title: "提示",
            message: "非视频内容暂不支持查看,请下载九斗App进行查看",
            type: "warning",
            offset: 80,
          });
          return;
        }
      }
      if (this.isEnroll == 0 && data.catalogIsFree == 0) {
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
      this.$store.commit("setVideoUrl", data);
      this.$emit("switchVideo", data);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.course-catalog {
  /deep/ .el-tree-node__content {
    height: 60px;
    border-top: 1px solid #ebeef5;
    .custom-tree-node {
      display: flex;
      align-items: center;
    }
    .video-icon {
      background: url("../assets/img/video_icon.png") no-repeat center;
      background-size: 60%;
      width: 50px;
      height: 50px;
    }
    .try-see {
      margin-left: 10px;
      color: #10c4ee;
      padding: 0 2px;
    }
  }
}
</style>
