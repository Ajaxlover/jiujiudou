<template>
  <div class="courseDetail">
    <el-header height="50px">
      <span class="courseTop" @click="toCourse">{{ detailName1 }}</span>
      <i class="el-icon-arrow-right"></i> <span>{{ detailName2 }}</span>
    </el-header>
    <div class="contentBox">
      <div class="topInfo">
        <div class="header">
          <img
            v-if="courseInfo.ccourseCover"
            class="cover"
            :src="courseInfo.ccourseCover"
          />
          <img
            v-else
            class="cover"
            src="@/assets/images/ccoursePlacehoder.png"
          />
          <div style="padding-left:19px;">
            <div class="courseName">
              {{ courseInfo.ccourseName }}
              <!-- <span class="price" v-if="originType != 4">{{formatPrice(courseInfo)}}</span> -->
              <span class="price" v-if="originType != 4">{{ price }}</span>
            </div>
            <div class="techer">老师：{{ courseInfo.ccourseTeacherName }}</div>
            <div class="courseTag" v-if="originType != 4">
              {{ formatCourseType(courseInfo.ccourseType) }} |
              <span v-for="item in tagArr" :key="item.index">
                <span style="margin-right:15px;">{{ item }}</span>
              </span>
            </div>
          </div>
        </div>
        <div></div>
        <el-button
          v-if="originType == 4"
          class="editcourse"
          size="mini"
          type="primary"
          @click="editcourse"
          >编辑云课</el-button
        >
      </div>
      <el-tabs class="info" v-model="currentIdx">
        <el-tab-pane label="课程介绍" name="first">
          <div style="font-size:12px;" class="content">
            <div
              v-html="
                courseInfo.ccourseIntroText ? courseInfo.ccourseIntroText : '无'
              "
              style="margin-bottom:32px;"
            ></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程目录" name="second">
          <div class="title">课程配套素材</div>
          <div class="material" v-if="courseInfo.ccSupportMaterialUrl">
            <img src="@/assets/images/material.png" />
            <span>{{ courseInfo.ccSupportMaterialName }}</span>
            <span>{{ dateFormat(courseInfo.ccSupportMaterialTime) }}</span>
            <span>{{ formatSize(courseInfo.ccSupportMaterialSize) }}</span>
          </div>
          <div class="material" v-else>
            <img src="@/assets/images/material.png" />
            <span>您还没有上传课程配套素材</span>
          </div>
          <div class="title">目录大纲</div>
          <div class="courseMaterial"></div>
          <el-tree
            :data="chapterList"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="catalogId"
            highlight-current
            ref="vueChapterTree"
            icon-class="el-icon-arrow-right"
          >
            <span
              class="custom-tree-node"
              ref="popover"
              slot-scope="{ node, data }"
            >
              <span
                :title="node.label"
                v-if="data.catalogType == 0 || data.catalogSubType == 8"
                >{{ node.label }}</span
              >
              <span
                :title="node.label"
                v-else
                @click="handleViewRes(data)"
                style="cursor:pointer"
                >{{ node.label }}</span
              >
              <span v-if="data.catalogIsFree == 1" style="color:#2BA1F4;"
                >试看</span
              >
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="verifyBox" v-if="this.originType == 2">
      <span class="verifyText">审核</span>
      <el-button size="small" class="verifyBtn1" @click="mobileView"
        >手机端预览</el-button
      >
      <el-button size="small" class="verifyBtn2" @click="passBtn"
        >通过</el-button
      >
      <el-button size="small" class="verifyBtn3" @click="refuseBtn"
        >拒绝</el-button
      >
    </div>
    <!-- 手机端预览弹框 -->
    <el-dialog :visible.sync="isMobielShow" :modal-append-to-body="false">
      <template slot="title">
        <div>
          <div></div>
          <div>手机预览</div>
        </div>
      </template>
      <div style="text-align:center">
        <div>打开九斗APP扫一扫，预览云课</div>
        <qrcode :value="qrcode" :options="{ width: 200 }"></qrcode>
      </div>
    </el-dialog>
    <!-- 拒绝弹框 -->
    <el-dialog :visible.sync="isrefuseShow" :modal-append-to-body="false">
      <template slot="title">
        <div>
          <div></div>
          <div>审核</div>
        </div>
      </template>
      <el-form
        :model="refuseForm"
        :rules="refuseRules"
        ref="refuseForm"
        label-width="80px"
      >
        <el-form-item label="拒绝原因" prop="desc">
          <el-input type="textarea" v-model="refuseForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="refuseSure"
          >确定</el-button
        >
        <el-button size="small" @click="isrefuseShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 预览资源 -->
    <el-dialog
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
        </div>
      </template>
      <viewRes
        :data="viewResObj"
        :style="viewResObj.resType == 2 ? 'height:400px' : ''"
      ></viewRes>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.courseDetail {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .courseTop {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .contentBox {
    background: white;
    margin: 23px;
    padding: 34px 32px;
    border-radius: 4px;
    margin-bottom: 100px;
    .topInfo {
      display: flex;
      justify-content: space-between;
      .header {
        display: flex;
        .cover {
          width: 281.97px;
          height: 154px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .courseName {
          color: #333;
          font-size: 24px;
          .price {
            color: #ff783d;
            font-size: 17px;
            margin-top: 20px;
            margin-left: 20px;
          }
        }
        .techer {
          color: #333;
          font-size: 16px;
          margin-top: 21px;
          margin-bottom: 13px;
        }
        .courseTag {
          font-size: 16px;
          color: #333;
          span {
            height: 25px;
            display: inline-block;
            margin-bottom: 10px;
            span {
              color: #10c4ee;
              font-size: 13px;
              border-radius: 2px;
              padding: 4px 10px;
              border: 1px solid rgba(16, 196, 238, 1);
            }
          }
        }
      }
      .editcourse {
        width: 150px;
        height: 40px;
        background: #2ba1f4;
        border: none;
        font-size: 16px;
      }
    }
  }
  .info {
    margin-top: 54px;
    .el-tabs__header .el-tabs__item {
      font-size: 16px;
    }
    .el-tabs__content {
      margin-top: 30px;
    }
    .title {
      color: #333;
      font-size: 16px;
    }
    .courseMaterial {
      margin-bottom: 20px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .content {
      background: rgba(13, 67, 118, 0.03);
      border: 1px solid rgba(13, 67, 118, 0.16);
      border-radius: 4px;
      padding: 10px 20px;
      color: #333333;
      font-size: 12px;
      margin-bottom: 42px;
    }
    .el-tree {
      width: 773px;
      font-size: 16px;
      border: 1px solid rgba(13, 67, 118, 0.2);
      padding: 21px;
      border-radius: 4px;
    }
    .el-tree
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 600px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 580px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 560px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree-node__content {
      height: 46px;
      border-bottom: 1px solid #eaeaea;
      .el-tree-node__expand-icon {
        margin-left: 12px;
      }
      cursor: inherit;
    }
    .el-tree-node__children {
      .el-tree-node__content {
        border-bottom: none;
      }
    }
    .el-tree-node__content:hover {
      background-color: transparent;
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: transparent;
    }
    .material {
      width: 773px;
      height: 65px;
      line-height: 65px;
      margin: 20px 0;
      padding: 0 18px;
      background: rgba(13, 67, 118, 0.03);
      border-radius: 4px;
      border: 1px solid rgba(13, 67, 118, 0.16);
      overflow: hidden;
      color: #333333;
      img {
        float: left;
        width: 44px;
        height: 45px;
        margin-top: 10px;
      }
      span:nth-child(2) {
        margin-left: 15px;
      }
      span:nth-child(3) {
        float: right;
        margin-left: 30px;
        color: #666666;
        font-size: 12px;
      }
      span:nth-child(4) {
        float: right;
        color: #666666;
        font-size: 12px;
      }
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .verifyBox {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 170px;
    background: rgba(43, 161, 244, 1);
    box-shadow: 0px 2px 16px 0px rgba(13, 67, 118, 0.2);
    height: 75px;
    line-height: 75px;
    .verifyText {
      color: #ffffff;
      font-size: 20px;
      margin-left: 62px;
    }
    .verifyBtn1 {
      background: transparent;
      color: #ffffff;
      height: 40px;
      font-size: 14px;
      margin-left: 80px;
      border-radius: 5px;
    }
    .verifyBtn2 {
      float: right;
      height: 40px;
      margin-top: 15px;
      width: 150px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      margin-right: 62px;
      font-size: 14px;
      color: #2ba1f4;
    }
    .verifyBtn3 {
      float: right;
      height: 40px;
      font-size: 14px;
      margin-top: 15px;
      background: rgba(255, 255, 255, 0.54);
      border-radius: 5px;
      color: #ffffff;
      width: 82px;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";
import viewRes from "@/components/viewRes";
export default {
  components: {
    viewRes
  },
  data() {
    return {
      courseId: "",
      originType: 1,
      detailName1: "",
      detailName2: "",
      currentIdx: "first",
      courseInfo: {},
      tagArr: [],
      chapterList: [],
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      defaultProps: {
        children: "sonCatList",
        label: "catalogName"
      },
      refuseForm: {
        desc: ""
      },
      refuseRules: {
        desc: [{ required: true, message: "请输入拒绝原因", trigger: "click" }]
      },
      qrcode: "",
      isMobielShow: false,
      isrefuseShow: false,
      price: ""
    };
  },
  mounted() {
    this.courseId = this.$route.query.ccourseId;
    this.originType = this.$route.query.type;
    if (this.originType == 1) {
      this.detailName1 = "我的云课";
      this.detailName2 = "云课详情";
    } else if (this.originType == 2) {
      this.detailName1 = "云课管理";
      this.detailName2 = "审核详情";
    } else if (this.originType == 3) {
      this.detailName1 = "云课管理";
      this.detailName2 = "查看详情";
    } else if (this.originType == 4) {
      this.detailName1 = "我的班级云课";
      this.detailName2 = "班级云课详情";
    } else if (this.originType == 5) {
      this.detailName1 = "云课分析";
      this.detailName2 = "班级云课详情";
    } else if (this.originType == 6) {
      this.detailName1 = "轮播管理";
      this.detailName2 = "云课详情";
    } else if (this.originType == 7) {
      this.detailName1 = "首页弹窗";
      this.detailName2 = "云课详情";
    }
    this.loadInfo();
  },
  methods: {
    toCourse() {
      this.$router.back(-1);
      // if(this.originType == 1) {
      //   this.$router.push({
      //     name: "cloudCourse"
      //   })
      // }
      // if(this.originType == 2 || this.originType == 3) {
      //   this.$router.push({
      //     name: "courseManage"
      //   })
      // }
      // if(this.originType == 4) {
      //   this.$router.push({
      //     name: "classCourse"
      //   })
      // }
      // if(this.originType == 5) {
      //   this.$router.push({
      //     path: "/operation/courseManage",
      //     query: {
      //       courseManageType: 3
      //     }
      //   })
      // }
      // if(this.originType == 6) {
      //   this.$router.push({
      //     path: "/operation/banner"
      //   })
      // }
      // if(this.originType == 7) {
      //   this.$router.push({
      //     path: "/operation/advertisment"
      //   })
      // }
    },
    //编辑云课
    editcourse() {
      this.$router.push({
        path: "/cloudCourse/courseInfo",
        query: {
          ccourseId: this.courseId,
          newCourseType: 1
        }
      });
    },
    //查看资源
    handleViewRes(row) {
      let arr = {};
      arr.resUrlWeb = row.catalogLeafObj;
      arr.resType = row.catalogSubType;
      arr.resName = row.catalogName;
      this.viewResObj = arr;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    // 加载基本信息
    loadInfo() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selectDetailOfCCWithoutSb",
          data: {
            cCourseId: this.courseId
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.courseInfo = res.data;
            if (this.courseInfo) {
              if (this.courseInfo.ccourseFeeType == 0) {
                this.price = "免费";
              } else {
                this.price = "￥" + this.courseInfo.ccoursePrice / 100;
              }
            }
            this.chapterList = res.data.catList;
            if (this.courseInfo.ccourseTags) {
              this.tagArr = this.courseInfo.ccourseTags.split(",");
            }
            this.qrcode = res.data.cCQRCode;
          }
        })
        .catch(() => {});
    },
    // 云课类型
    formatCourseType(ccourseType) {
      return common.mathCourseType(ccourseType);
    },
    //云课价格类型
    // formatPrice(row) {
    //   if(row) {
    //     if(row.ccourseFeeType == 0) {
    //       return '免费'
    //     }else{
    //       return "￥" + row.ccoursePrice / 100
    //     }
    //   }
    // },
    //课程素材时间
    dateFormat: function(row) {
      return format(row);
    },
    //课程素材大小
    formatSize(row) {
      if (row) {
        if (row < 1024 * 1024) {
          return (row / 1024).toFixed(1) + "KB";
        } else {
          return (row / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    //手机端预览
    mobileView() {
      this.isMobielShow = true;
    },
    passBtn() {
      this.$confirm("是否确定通过审核", "审核", {
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "v1/cCourse/updateCC/cCIntro",
            data: {
              cCId: this.courseId,
              ccStatus: 2
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.originType = 3;
              this.$message({
                type: "success",
                message: ret.msg
              });
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      });
    },
    refuseBtn() {
      this.refuseForm.desc = "";
      this.isrefuseShow = true;
    },
    refuseSure() {
      this.$refs["refuseForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: this.courseId,
                ccStatus: 3,
                refuseDesc: this.refuseForm.desc
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.originType = 3;
                this.isrefuseShow = false;
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        }
      });
    }
  }
};
</script>
