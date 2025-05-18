<template>
  <div class="mooc-catalog-list">
    <div class="list">
      <span class="list-num">目录</span>
      <div class="cor">
        <div v-for="(i, index) in data" :key="index">
          <div @click="foldAndUnfold(index, i)" class="cor-title">
            <span>{{ i.name }}</span>
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
            <div v-if="i.cataList.length == 0" class="chapter-item">
              <span>内容为空</span>
            </div>
            <div
              v-else
              @click="selectVideo(j)"
              class="chapter-item"
              v-for="(j, idx) in i.cataList"
              :key="idx"
            >
              <div class="chapter-item-l">
                <span class="video-icon"></span>
                <span
                  :title="j.name"
                  style="
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    max-width: 240px;
                  "
                  :class="currentVideo.id == j.id ? 'active' : ''"
                  >{{ j.name }}</span
                >
              </div>
            </div>
          </div>
        </div>
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
      activeList: [],
      num: 0,
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
    selectVideo(j) {
      if (this.isEnroll == 0) {
        this.$message({
          title: "提示",
          message: "您还没有报名哦~",
          type: "warning",
          offset: 80,
        });
        return;
      }
      this.$store.commit("setMoocVideo", j);
      this.$emit("switchVideo", j);
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
