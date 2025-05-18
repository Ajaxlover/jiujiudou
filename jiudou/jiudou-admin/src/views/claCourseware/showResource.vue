<template>
  <el-container class="showResource">
    <el-header>
      <div class="returnBtn" type="text" @click="$emit('close')">
        <i class="el-icon-back"></i>返回PPT
      </div>
      <div class="title">{{ title }}</div>
      <el-button @click="openList" type="primary" size="small"
        >资源列表</el-button
      >
      <el-button
        type="primary"
        class="shareBtn"
        size="small"
        :loading="shareLoading"
        @click="share"
        v-if="resList[currentIdx].resType != 3"
        >分享到班级空间</el-button
      >
    </el-header>
    <el-main>
      <el-carousel
        ref="carousel"
        :autoplay="false"
        arrow="always"
        indicator-position="outside"
        :loop="false"
        @change="carouselChange"
      >
        <el-carousel-item v-for="(res, index) in resList" :key="index">
          <resPlug class="res" :data="res" v-if="currentIdx == index"></resPlug>
        </el-carousel-item>
      </el-carousel>
    </el-main>

    <el-dialog
      title="资源列表"
      :visible.sync="isListShow"
      v-if="isListShow"
      width="50%"
      class="pub_dialog"
      :modal="false"
      :before-close="handleClose"
      :show-close="true"
    >
      <div>
        <el-row class="coursewareContent">
          <el-col v-for="(item, index) in data" :key="item.tContentId">
            <div @click="chooseSource(index)" class="container">
              <div class="left">
                <img
                  v-if="item.tContentSubType == 1"
                  @click="chooseSource(index)"
                  src="@/assets/images/audio.png"
                  alt=""
                />
                <div
                  v-if="item.tContentSubType == 2"
                  @click="chooseSource(index)"
                  style="position:relative;width:100px;height:60px;"
                >
                  <div
                    v-if="item.designPic"
                    style="position:relative;background:rgba(0,0,0,0.5);height:60px;border-radius: 4px;"
                  >
                    <img
                      :src="item.designPic"
                      alt=""
                      style="height:60px;width:auto;max-width:100px;"
                    />
                    <img
                      src="@/assets/images/shipin.png"
                      alt=""
                      style="position:absolute;right:0;top:0;width:27px;height:17px;"
                    />
                  </div>
                  <img v-else src="@/assets/images/video.png" alt="" />
                </div>
                <div
                  v-if="item.tContentSubType == 3"
                  @click="chooseSource(index)"
                  style="position:relative"
                >
                  <img
                    v-if="item.designPic"
                    :src="item.designPic"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    v-else
                    src="@/assets/images/other.png"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    src="@/assets/images/arIcon.png"
                    alt=""
                    style="position:absolute;right:0;top:0;width:27px;height:17px;"
                  />
                </div>
                <img
                  v-if="item.tContentSubType == 4"
                  @click="chooseSource(index)"
                  src="@/assets/images/excel.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 5"
                  @click="chooseSource(index)"
                  src="@/assets/images/h5.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 6"
                  @click="chooseSource(index)"
                  src="@/assets/images/ppt.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 7"
                  @click="chooseSource(index)"
                  src="@/assets/images/word.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 9"
                  @click="chooseSource(index)"
                  src="@/assets/images/pdf.png"
                  alt=""
                />
                <div
                  v-if="item.tContentSubType == 10"
                  @click="chooseSource(index)"
                  style="background:rgba(0,0,0,0.5);width:100px;height:60px;border-radius: 4px;text-align:center"
                >
                  <img
                    v-if="item.tContentUrl"
                    :src="item.tContentUrl"
                    alt=""
                    style="height:60px;width:auto;max-width:100px;"
                  />
                  <img v-else src="@/assets/images/img.png" />
                </div>
                <img
                  v-if="item.tContentSubType == 12"
                  @click="chooseSource(index)"
                  src="@/assets/images/yypc.png"
                  alt=""
                />
              </div>
              <div
                class="middle"
                style="cursor:pointer;"
                @click="chooseSource(index)"
              >
                {{ item.tContentName }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.showResource {
  font-weight: 400;
  background: #1c272e;
  height: 100%;
  .el-header {
    background: #0e1317;
    color: #fff;
    display: flex;
    align-items: center;
    .returnBtn {
      padding: 7px 0;
      color: #fff;
      border: 1px solid #979797;
      height: 34px;
      width: 140px;
      font-size: 14px;
      border-radius: 17px;
      text-align: center;
      cursor: pointer;
      margin-left: 45px;
      i {
        margin-right: 5px;
      }
    }
    .title {
      box-sizing: border-box;
      font-size: 20px;
      width: 100%;
      text-align: center;
    }
    .shareBtn {
      margin-right: 45px;
    }
  }
  .el-main {
    padding: 0;
    font-size: 18px;
    color: white;
    height: 100%;
    .el-carousel {
      height: 100%;
    }
    .el-carousel__container {
      height: 95%;
    }
    .el-carousel__arrow {
      font-size: 70px;
      opacity: 0.2;
      width: 80px;
      height: 80px;
    }
    .el-carousel__arrow:hover {
      opacity: 1;
      background: none;
    }
    .res {
      height: 100%;
      padding: 0 90px;
      margin: 0 auto;
    }
    .el-button:disabled {
      background: #ccc;
      border-color: #ccc;
    }
    .share {
      margin-left: 44%;
    }
  }
  .pub_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
      margin: 0 auto !important;
      height: 70%;
      overflow: hidden;
      .el-dialog__header {
        display: block;
      }
      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
    }
    .coursewareContent {
      margin-top: 1px;
      .el-col {
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.1);
        padding: 16px;
        height: 84px;
        .container {
          display: flex;
          align-items: center;
          cursor: pointer;
          .left {
            cursor: pointer;
            img {
              width: 100px;
              height: 60px;
            }
          }
          .middle {
            margin: 0;
            padding: 0;
            margin-left: 20px;
            text-align: left;
            max-width: 58%;
          }
          .right {
            float: right;
          }
        }
      }
    }
  }
}
</style>

<script>
import resPlug from "./resPlug";
import axios from "@/libs/api.request";
export default {
  props: {
    data: Array
  },
  components: {
    resPlug
  },
  data() {
    return {
      shareLoading: false,
      resList: [],
      currentIdx: 0,
      title: "",
      isListShow: false
    };
  },
  watch: {
    data: {
      handler(newName) {
        this.resList = [];
        this.data.forEach(res => {
          this.resList.push({
            resName: res.tContentName,
            resType: res.tContentSubType,
            resUrlWeb: res.tContentUrl
          });
        });
        this.title = this.resList[0].resName;
      },
      immediate: true
    }
  },
  mounted() {
    let carousel = this.$refs.carousel;
    if (carousel) {
      carousel.handleIndicatorHover = () => {};
      carousel.handleIndicatorClick = () => {};
    }
  },
  methods: {
    openList() {
      this.isListShow = true;
    },
    handleClose(done) {
      done();
    },
    chooseSource(index) {
      let carousel = this.$refs.carousel;
      if (carousel) {
        this.$refs.carousel.setActiveItem(index);
      }
      this.isListShow = false;
    },
    carouselChange(idx) {
      this.currentIdx = idx;
      this.title = this.resList[idx].resName;
    },
    // 分享
    share() {
      if (this.currentIdx <= this.resList.length - 1) {
        let res = this.resList[this.currentIdx];
        let data = [
          {
            res_name: res.resName,
            res_type: res.resType,
            res_url: res.resUrlWeb
          }
        ];
        this.shareLoading = true;
        axios
          .request({
            method: "post",
            url: "/clazz/v4/clazzMessage/uploadResource",
            data: {
              classIds: this.$route.query.classId,
              resources: JSON.stringify(data)
            }
          })
          .then(res => {
            this.shareLoading = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "分享成功"
              });
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    }
  }
};
</script>
