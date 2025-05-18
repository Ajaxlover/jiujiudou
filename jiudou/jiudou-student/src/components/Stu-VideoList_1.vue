<template>
  <div class="catalog-list">
    <div class="list">
      <span class="list-num">目录({{ courseTotalNum }}讲)</span>
      <div class="cor">
        <el-tree
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="true"
          node-key="catalogId"
          highlight-current
          @node-click="clickNode"
          ref="vueChapterTree1"
          icon-class="el-icon-arrow-right"
        >
          <span
            class="custom-tree-node"
            ref="popover"
            slot-scope="{ node, data }"
          >
            <div
              v-if="data.catalogType == 1 && data.catalogSubType == 2"
              class="video-icon"
            ></div>
            <span
              :title="node.label"
              v-if="data.catalogType == 0 || data.catalogSubType == 8"
              >{{ node.label }}</span
            >
            <span
              :class="currentVideo.catalogId == data.catalogId ? 'active' : ''"
              :title="node.label"
              v-else
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
            <span v-if="data.catalogIsFree == 1" class="try-see">试看</span>
          </span>
        </el-tree>
        <!-- <div :id="index" v-for="(i, index) in data" :key="index">
          <div @click="foldAndUnfold(index, i)" class="cor-title">
            <span>{{ i.catalogName }}</span>
            <i
              style="cursor: pointer"
              :class="
                activeName.includes(index)
                  ? 'el-icon-arrow-down'
                  : 'el-icon-arrow-right'
              "
            ></i>
          </div>

          <div v-show="activeName.includes(index)">
            <div
              @click="selectVideo(j)"
              class="chapter-item"
              v-for="(j, idx) in i.catalog"
              :key="idx"
            >
              <div class="chapter-item-l">
                <span class="video-icon"></span>
                <span
                  :title="j.catalogName"
                  style="
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    max-width: 240px;
                  "
                  :class="currentVideo.catalogId == j.catalogId ? 'active' : ''"
                  >{{ j.catalogName }}</span
                >
              </div>
              <span v-if="j.catalogIsFree == 1 && isEnroll == 0" class="try-see"
                >试看</span
              >
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "video-list",
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
      showDetail: 0,
      isActive: true,
      activeClass: "activeClass",
      normalClass: "chapter-item",
      // activeList: [{ num: 0, idx: 0 }],
      activeList: [],
      num: 0,
      defaultProps: {
        children: "catalog",
        label: "catalogName",
      },
    };
  },
  computed: {
    activeName() {
      let arr = [];
      this.activeList.forEach((item) => {
        arr.push(item.idx);
      });
      return [...new Set(arr)];
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    foldAndUnfold(index, item) {
      if (this.activeName.includes(index)) {
        var i = this.activeList.findIndex((item) => item.idx == index);
        this.activeList.splice(i, 1);
      } else {
        this.num++;
        this.activeList.push({ num: this.num, idx: index });
      }
    },
    // eslint-disable-next-line no-unused-vars
    clickNode(data, node, obj) {
      if (data.catalogType == 0) {
        return;
      }
      if (data.catalogSubType != 2) {
        this.$message({
          title: "提示",
          message: "非视频内容暂不支持查看,请下载九斗App进行查看",
          type: "warning",
          offset: 80,
        });
        return;
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
      this.$store.commit("setVideoUrl", data);
      this.$emit("switchVideo", data);
    },
    selectVideo(j) {
      if (this.isEnroll == 0 && j.catalogIsFree == 0) {
        this.$message({
          title: "提示",
          message: "您还没有获取哦~",
          type: "warning",
          offset: 80,
        });
        return;
      }
      this.$store.commit("setVideoUrl", j);
      this.$emit("switchVideo", j);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// .activeClass {
//   display: none;
// }
.catalog-list {
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
  .activeClass {
    display: none;
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
      .active {
        color: #049efb;
      }
    }

    .try-see {
      color: #10c4ee;
      padding: 0 2px;
    }
  }
}
</style>
