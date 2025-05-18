<template>
  <div class="mooc-catalog-list">
    <div class="list">
      <span class="list-num">目录</span>
      <div class="cor">
        <el-tree
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="true"
          node-key="id"
          highlight-current
          @node-click="clickNode"
          icon-class="el-icon-arrow-right"
        >
          <span
            class="custom-tree-node"
            ref="popover"
            slot-scope="{ node, data }"
          >
            <div
              v-if="data.type == 1 && data.subType == 2"
              class="video-icon"
            ></div>
            <!-- <span
              :title="node.label"
              v-if="data.catalogType == 0 || data.catalogSubType == 8"
              >{{ node.label }}</span
            > -->
            <span
              :class="currentVideo.id == data.id ? 'active' : ''"
              :title="node.label"
              style="
                cursor: pointer;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                max-width: 240px;
              "
            >
              {{ node.label }}</span
            >
            <!-- <span v-if="data.catalogIsFree == 1" class="try-see">试看</span> -->
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "moocVideo-list",
  props: {
    courseTotalNum: Number,
    data: Array,
    clickType: Number,
    courseId: String,
    isEnroll: String,
    currentVideo: Object,
  },
  data() {
    return {
      defaultProps: {
        children: "cataList",
        label: "name",
      },
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    clickNode(data, node, obj) {
      if (data.type == 0) {
        return;
      }
      if (data.subType != 2) {
        // 非视频
        this.$message({
          title: "提示",
          message: "非视频内容暂不支持查看,请下载九斗App进行查看",
          type: "warning",
          offset: 80,
        });
        return;
      }
      if (this.isEnroll == 0) {
        this.$message({
          title: "提示",
          message: "您还没有报名哦~",
          type: "warning",
          offset: 80,
        });
        return;
      }
      this.$store.commit("setMoocVideo", data);
      this.$emit("switchVideo", data);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mooc-catalog-list {
  background-color: #fff;
  height: 100%;
  .list {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .list-num {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .cor {
      padding-top: 8px;
      height: 560px;
      width: 100%;
      position: absolute;
      overflow: scroll;
      overflow-x: hidden;
      /deep/ .el-tree-node__content {
        height: 60px;
        border-top: 1px solid #ebeef5;
        .active {
          color: #049efb;
        }
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
      .cor-title {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid #dcdfe6;
        padding-right: 10px;
      }
    }
  }
}
</style>
