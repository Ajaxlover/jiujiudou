<template>
  <div class="mooc-catalog">
    <el-tree
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="true"
      node-key="id"
      highlight-current
      @node-click="clickNode"
      icon-class="el-icon-arrow-right"
    >
      <span class="custom-tree-node" ref="popover" slot-scope="{ node, data }">
        <div
          v-if="data.type == 1 && data.subType == 2"
          class="video-icon"
        ></div>
        <!-- <span
          :title="node.label"
          v-if="data.type == 0 || data.catalogSubType == 8"
          >{{ node.label }}</span
        > -->
        <span :title="node.label" style="cursor: pointer">
          {{ node.label }}</span
        >
        <!-- <span
          v-if="data.catalogIsFree == 1 && data.catalogSubType == 2"
          class="try-see"
          >试看</span
        > -->
      </span>
    </el-tree>
    <!-- <el-collapse v-model="activeNames" @change="handleChange">
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
          </div>
        </el-collapse-item>
      </div>
    </el-collapse> -->
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
      defaultProps: {
        children: "cataList",
        label: "name",
      },
      activeNames: ["1"],
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    clickNode(data, node, obj) {
      if (data.type == 0) {
        return;
      }
      // if (!data.catalogUrl) {
      //   return;
      // }
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

      this.$router.push({
        name: "moocPlay",
        params: {
          moocId: this.courseId,
        },
      });
      this.$store.commit("setMoocVideo", data);
    },
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
