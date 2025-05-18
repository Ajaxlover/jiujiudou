<template>
  <el-container class="viewCourseware">
    <div @click="goBack" class="backBtn">
      <span class="returnBtn"><i class="el-icon-back"></i>返回</span>
    </div>
    <el-main>
      <div id="baiban" style="width:100%;height:100%"></div>
    </el-main>
    <div>
      <div class="leftBtn" v-if="hasRes">
        <ul>
          <li @click="showRes">
            <img src="@/assets/coursewareIcon/resIcon.png" alt="" />
            <div>资源分享</div>
          </li>
        </ul>
      </div>
      <div class="bottomBtn" style="margin-left:-225px">
        <ul
          style="border-top-right-radius: 33px !important;border-bottom-right-radius: 33px !important;"
        >
          <li @click="isMenuShow = true">
            <img src="@/assets/coursewareIcon/menu.png" alt="" />
          </li>
          <li @click="toPrev">
            <img src="@/assets/coursewareIcon/prev.png" alt="" />
          </li>
          <li>{{ boardData.current }} / {{ boardData.total }}</li>
          <li @click="toNext">
            <img src="@/assets/coursewareIcon/next.png" alt="" />
          </li>
        </ul>
      </div>
    </div>
    <!-- 目录弹框 -->
    <el-dialog
      :visible.sync="isMenuShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="menuTk"
    >
      <span class="returnBtn" @click="isMenuShow = false"
        ><i class="el-icon-back"></i>返回PPT</span
      >
      <div class="menuTitle">课件目录</div>
      <ul class="menu1">
        <li
          v-for="item in menuData1"
          :key="item.thumbnailId || item.thumbId"
          @click="gotoBoard(item.thumbnailIndex || item.thumbIndex)"
        >
          <img
            :src="item.thumbnailUrl || item.thumbUrl"
            alt=""
            class="bigImg"
          />
          <div>
            <span>{{ item.thumbnailIndex || item.thumbIndex }}</span>
            <span v-if="item.tContentList.length > 0"
              ><img src="@/assets/coursewareIcon/menuIcon.png" alt="" />交互内容
              {{ item.tContentList.length }}</span
            >
          </div>
        </li>
      </ul>
      <div class="menuTitle" v-if="menuData2.length > 0">课件目录</div>
      <ul class="menu2">
        <li
          v-for="item in menuData2"
          :key="item.thumbnailId || item.thumbId"
          @click="gotoBoard(item.thumbnailIndex || item.thumbIndex)"
        >
          <div>
            <img src="@/assets/coursewareIcon/resIcon.png" alt="" />资源
          </div>
          <div>PPT第{{ item.thumbnailIndex || item.thumbIndex }}页</div>
        </li>
      </ul>
    </el-dialog>
    <!-- 资源分享弹框 -->
    <el-dialog
      :visible.sync="isResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <showResource :data="resData" @close="isResShow = false"></showResource>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import showResource from "./showResource";

export default {
  name: "viewCourseware",
  components: {
    showResource
  },
  data() {
    return {
      goType: this.$route.query.goType,
      isMenuShow: false,
      isResShow: false,
      hasRes: false,
      coursewareId: this.$route.query.coursewareId,
      menuData1: [],
      menuData2: [],
      gyClassId: this.$route.query.classId, //我的班级id
      currentIndex: Number(this.$route.query.currentIndex),
      htmlUrl: this.$route.query.htmlUrl,
      pages: this.$route.query.pages,
      teduBoard: null,
      //白板参数
      options: {
        id: "baiban",
        classId: "",
        userId: this.$store.state.user.userId,
        sdkAppId: "",
        userSig: "",
        drawEnable: true, //是否可以涂鸦
        synDrawEnable: true, //是否将你画的涂鸦同步给其他人
        toolType: 0,
        brushThin: 100,
        backgroundColor: "#000000",
        globalBackgroundColor: "#000000",
        brushColor: "#ff0000",
        textColor: "#ff0000",
        textStyle: "#ff0000",
        textFamily: "sans-serif,serif,monospace",
        textSize: 320,
        scaleSize: 100,
        fitMode: 1,
        ration: "16:9",
        canRedo: 0,
        canUndo: 0
      },
      currentFileId: "", //当前文件ID
      //board(白板操作)
      boardData: {
        currentBoardId: null, //当前白板ID
        boardIdlist: [], //白板ID列表
        current: 0, //当前白板index
        total: 0 //总页数
      },
      taskData: {
        paperId: 0,
        exerciseId: "", //作业ID
        exerciseName: this.$route.query.exerciseName,
        signNo: "", //签到ID
        coursewareId: this.$route.query.coursewareId
      },
      resData: [],
      tic: null,
      trtcClient: null
    };
  },
  mounted() {
    this.loadData();
    this.initGetSign();
    // 监听键盘上下左右播放ppt事件
    let _self = this;
    let key = "";
    document.onkeydown = function(e) {
      if (window.event == undefined) {
        key = e.keyCode;
      } else {
        key = window.event.keyCode;
      }
      if (key == 37 || key == 38) {
        // 左或上
        _self.teduBoard.prevStep();
      }
      if (key == 39 || key == 40) {
        // 右或下
        _self.teduBoard.nextStep();
      }
    };
  },
  beforeDestroy() {
    // 页面卸载时清除事件
    document.onkeydown = null;
    // console.log("页面卸载");
  },
  methods: {
    goCurrentImg(index) {
      if (this.teduBoard) {
        this.teduBoard.gotoBoard(this.boardData.boardIdlist[index - 1], true);
      }
    },
    goBack() {
      this.$router.back(-1);
      this.clear();
      this.teduBoard.destroy();
    },
    showRes() {
      this.resData = this.menuData1[this.boardData.current - 1].tContentList;
      this.isResShow = true;
    },
    //获取缩略图列表
    loadData() {
      let url = "/clazz/v4/courseware/thumbnail";
      let data = {
        coursewareId: this.coursewareId
      };
      if (this.goType === "ware") {
        url = "/clazz/v4/ware/thumbnail";
        data = {
          wareId: this.coursewareId
        };
      }
      axios
        .request({
          method: "post",
          url,
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.menuData1 = ret.data;
            this.menuData2 = ret.data;
            this.menuData2 = ret.data.filter((item, i) => {
              return item.tContentList.length > 0;
            });
          }
        });
    },
    //获取签名
    initGetSign() {
      axios
        .request({
          method: "post",
          url: "/common/v4/class/boardSign"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.options.sdkAppId = ret.data.sdkappid;
            this.options.userSig = ret.data.sign;
            this.tic = null;
            this.tic = new window.TIC({});
            this.tic.init(ret.data.sdkappid, res => {
              if (res.code) {
              } else {
                this.login();
              }
            });
          }
        });
    },
    login() {
      this.tic.login(
        {
          userId: String(this.$store.state.user.userId),
          userSig: this.options.userSig
        },
        res => {
          // console.error(res.code);
          if (res.code) {
          } else {
            this.tic.addTICEventListener({
              onTICTrtcClientCreated: () => {
                this.trtcClient = this.tic.getTrtcClient();
              }
            });
            this.tic.createClassroom(
              {
                classId: String(this.coursewareId)
              },
              res => {
                if (res.code) {
                  if (res.code == 10021) {
                    // this.showTip('该课堂已被他人创建，请直接加入');
                    this.joinClassroom();
                  } else if (res.code == 10025) {
                    // this.showTip('您已经创建过这个课堂，请直接加入');
                    this.joinClassroom();
                  } else {
                    // this.showErrorTip('创建课堂失败');
                    // console.error(res);
                    // this.showMessageInBox('TIC', "createClassroom error:" + res.code);
                  }
                } else {
                  this.joinClassroom();
                  // this.showTip('创建课堂成功');
                  // this.showMessageInBox('TIC', "createClassroom Succ:");
                }
              }
            );
          }
        }
      );
    },
    joinClassroom() {
      this.tic.joinClassroom(
        {
          // compatSaas: true,
          classId: String(this.coursewareId)
        },
        {
          mode: window.TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE //直播模式，支持1000人以上场景
          // mode: window.TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL, // //实时通话模式，支持1000人以下场景，低延时
          // role: TIC.CONSTANT.TICRoleType.TIC_ROLE_TYPE_ANCHOR // 主播，只在TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE模式下有效
          // role: TIC.CONSTANT.TICRoleType.TIC_ROLE_TYPE_AUDIENCE // 观众（观众角色没有发布本地流的权限，只有收看远端流的权限。如果观众想要连麦跟主播互动， 请先通过 switchRole() 切换角色到主播 anchor 后再发布本地流），只在TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE模式下有效
        },
        {
          id: "paint_box",
          ratio: "16:9",
          smoothLevel: 0,
          boardContentFitMode: 1,
          toolType: 1,
          progressEnable: true,
          progressBarUrl:
            "https://resources-tiw.qcloudtrtc.com/board/icons/Gear-0.2s-48px.png"
        },
        res => {
          if (res.code) {
          } else {
            this.options.classId = String(this.coursewareId);
            if (this.teduBoard) {
              this.teduBoard.destroy();
            }
            this.teduBoard = new TEduBoard(this.options);
            // window.teduBoard = this.teduBoard = this.tic.getBoardInstance();
            this.initBoardEvent();
          }
        }
      );
    },
    initBoardEvent() {
      var teduBoard = this.teduBoard;
      // 撤销状态改变
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED,
        enable => {
          this.canUndo = enable ? 1 : 0;
          // console.log(
          //   "======================:  ",
          //   "TEB_OPERATE_CANUNDO_STATUS_CHANGED",
          //   enable ? "可撤销" : "不可撤销"
          // );
        }
      );
      // 重做状态改变
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED,
        enable => {
          this.canRedo = enable ? 1 : 0;
          // console.log(
          //   "======================:  ",
          //   "TEB_OPERATE_CANREDO_STATUS_CHANGED",
          //   enable ? "可恢复" : "不可恢复"
          // );
        }
      );
      // 新增白板
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
        this.proBoardData();
        // console.log(
        //   "======================:  ",
        //   "新增白板",
        //   " boardIds:",
        //   boardIds,
        //   " fid:",
        //   fid
        // );
      });
      // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
      // TIC已经处理好了，可忽略该事件
      teduBoard.on(window.TEduBoard.EVENT.TEB_SYNCDATA, data => {
        console.log("======================:  ", "同步数据");
      });
      // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
      teduBoard.on(window.TEduBoard.EVENT.TEB_INIT, () => {
        console.log("======================:  ", "白板初始化");
      });
      teduBoard.on(window.TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log("======================:  ", "历史数据完成");
        this.teduBoard.addTranscodeFile({
          title: "", // 文件名
          resolution: "1024x768", // 文件的分辨率
          url: this.htmlUrl, // 转码后的url
          pages: this.pages // 文件总页数
        });
        this.proBoardData();
      });
      // 白板错误回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
        // console.error(
        //   "======================:  ",
        //   "白板错误",
        //   " code:",
        //   code,
        //   " msg:",
        //   msg
        // );
        this.teduBoard.destroy();
        this.teduBoard = new TEduBoard(this.options);
        // this.showMessageInBox('TIC', "onTEBError code=" + code + " msg:" + msg);
      });
      // 白板警告回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
        // console.error(
        //   "======================:  ",
        //   "白板警告",
        //   " code:",
        //   code,
        //   " msg:",
        //   msg
        // );
        // this.showMessageInBox('TIC', "onTEBWarning code=" + code + " msg:" + msg);
      });
      // 图片状态加载回调
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED,
        (status, data) => {
          // console.log(
          //   "======================:  ",
          //   "白板图片加载状态改变",
          //   " status:",
          //   status,
          //   " data:",
          //   data
          // );
        }
      );
      // // 删除白板页回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
        // console.log(
        //   "======================:  ",
        //   "TEB_DELETEBOARD",
        //   " boardIds:",
        //   boardIds,
        //   " fid:",
        //   fid
        // );
        // this.proBoardData();
      });
      // 跳转白板页回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        // console.log(
        //   "======================:  ",
        //   "白板跳转",
        //   " boardId:",
        //   boardId,
        //   " fid:",
        //   fid
        // );
        this.proBoardData();
      });
      // 增加H5动画PPT文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDH5PPTFILE, fid => {
        // console.log(
        //   "======================:  ",
        //   "TEB_ADDH5PPTFILE",
        //   " fid:",
        //   fid
        // );
        this.proBoardData();
      });
      // 增加文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDFILE, fid => {
        // console.log("======================:  ", "TEB_ADDFILE", " fid:", fid);
        this.proBoardData();
      });
      // 增加转码文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, fid => {
        console.log("======================:  ", "增加转码文件", " fid:", fid);
        // this.proBoardData();
      });
      // 删除文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEFILE, fid => {
        // console.log("======================:  ", "删除文件", " fid:", fid);
        // this.proBoardData();
      });
      // 文件上传状态
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_FILEUPLOADSTATUS,
        (status, data) => {
          // console.log(
          //   "======================:  ",
          //   "TEB_FILEUPLOADSTATUS",
          //   status,
          //   data
          // );
          if (status === 1) {
            this.showTip("上传成功");
          } else {
            this.showTip("上传失败");
          }
          document.getElementById("file_input").value = "";
        }
      );
      // 切换文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_SWITCHFILE, fid => {
        // console.log("======================:  ", "切换文件", " fid:", fid);
        this.proBoardData();
      });
      // 上传背景图片的回调
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE,
        (fileName, fileUrl, userData) => {
          //   console.log(
          //     "======================:  ",
          //     "TEB_SETBACKGROUNDIMAGE",
          //     "  fileName:",
          //     fileName,
          //     "  fileUrl:",
          //     fileUrl,
          //     " userData:",
          //     userData
          //   );
        }
      );
      // 文件上传进度
      teduBoard.on(window.TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, data => {
        // console.log(
        //   "======================:  ",
        //   "TEB_FILEUPLOADPROGRESS:: ",
        //   data
        // );
        // this.showTip('上传进度:' + parseInt(data.percent * 100) + '%');
      });
      // H5背景加载状态
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED,
        (status, data) => {
          //   console.log(
          //     "======================:  ",
          //     "TEB_H5BACKGROUND_STATUS_CHANGED:: status:",
          //     status,
          //     "  data:",
          //     data
          //   );
        }
      );
    },
    //上一页
    toPrev() {
      this.teduBoard.prevBoard();
    },
    //下一页
    toNext() {
      this.teduBoard.nextBoard();
    },
    //清空
    clear() {
      this.teduBoard.clear();
    },
    proBoardData() {
      // console.log("CurrentFile", this.teduBoard.getCurrentFile());
      this.currentFileId = this.teduBoard.getCurrentFile();
      // this.currentFileId = fid;
      // var fileInfo = this.teduBoard.getFileInfo(fid);
      var fileInfo = this.teduBoard.getFileInfo(this.currentFileId);
      // console.log("CurrenfileInfo", fileInfo);
      if (fileInfo) {
        this.boardData = {
          currentBoardId: this.currentFileId,
          // boardIdlist: boardIds,
          boardIdlist: this.teduBoard.getFileBoardList(this.currentFileId),
          current: fileInfo.currentPageIndex + 1,
          total: fileInfo.pageCount
        };
        if (this.menuData1[fileInfo.currentPageIndex].tContentList.length > 0) {
          this.hasRes = true;
        } else {
          this.hasRes = false;
        }
      }
    },
    //跳转
    gotoBoard(index) {
      this.teduBoard.gotoBoard(this.boardData.boardIdlist[index - 1], true);
      this.isMenuShow = false;
    }
  }
};
</script>

<style lang="scss">
.viewCourseware {
  height: 100%;
  background: rgba(28, 39, 46, 1);
  .backBtn {
    position: fixed;
    top: 0;
    left: 45px;
    z-index: 1;
    color: #fff;
    height: 60px;
    line-height: 60px;
    .returnBtn {
      color: #fff;
      border: 1px solid #979797;
      background: rgba(28, 39, 46, 0.5);
      padding-top: 7px;
      padding-bottom: 7px;
      padding-left: 23px;
      padding-right: 23px;
      font-size: 14px;
      border-radius: 17px;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
  }
  .leftBtn {
    width: 56px;
    position: fixed;
    top: 30%;
    left: 0;
    background: rgba(0, 0, 0, 0.52);
    color: #fff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    ul {
      list-style: none;
      padding: 0;
      margin-bottom: 30px;
      li {
        width: 72px;
        height: 62px;
        background: #0078e9;
        font-size: 14px;
        text-align: center;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        img {
          vertical-align: bottom;
          margin-top: 3px;
        }
      }
    }
    div {
      div {
        .transition-box {
          width: 56px;
          height: 62px;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 15px;
          div {
            color: rgba(255, 255, 255, 0.8);
          }
          img {
            vertical-align: bottom;
          }
        }
      }
    }
    .clickBtn {
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      padding-bottom: 25px;
      img {
        vertical-align: bottom;
      }
    }
  }
  .bottomBtn {
    height: 52px;
    position: fixed;
    bottom: 10px;
    left: 50%;
    overflow: hidden;
    ul {
      background: rgba(0, 0, 0, 0.52);
      list-style: none;
      overflow: hidden;
      float: left;
      height: 100%;
      padding: 0 45px;
      margin: 0;
      border-radius: 33px !important;
      color: #fff;
      li {
        float: left;
        cursor: pointer;
      }
    }
    ul:first-child {
      font-size: 16px;
      line-height: 52px;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      li {
        margin-right: 17px;
        img {
          vertical-align: middle;
        }
      }
      li:first-child {
        margin-right: 36px;
      }
      li:last-child {
        margin-left: 19px;
        margin-right: 0;
      }
    }
    .editBtn {
      font-size: 12px;
      padding-left: 22.5px;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      li {
        margin-right: 36px;
        text-align: center;
        padding: 3.5px 5px 0;
        img {
          width: 24px;
          height: 24px;
          vertical-align: bottom;
          margin-bottom: 2px;
        }
      }
      li:last-child {
        margin-right: 0;
      }
      li:hover {
        background: #2ba1f4;
      }
    }
    .overBtn {
      font-size: 12px;
      padding: 0;
      width: 52px;
      height: 52px;
      text-align: center;
      border-radius: 50% !important;
      padding-top: 3.5px;
      margin-left: 40px;
      li {
        width: 52px;
        height: 52px;
        img {
          vertical-align: bottom;
        }
      }
    }
  }
  .menuTk {
    .el-dialog {
      height: 100%;
      margin-bottom: 0;
      border-radius: 0;
      background: rgba(0, 0, 0, 0.8);
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding-top: 0;
        .returnBtn {
          display: inline-block;
          width: 100px;
          height: 34px;
          border-radius: 50px;
          border: 1px solid white;
          line-height: 34px;
          text-align: center;
          cursor: pointer;
          margin-left: 9px;
          font-size: 14px;
          margin: 20px;
          color: #fff;
          i {
            margin-right: 5px;
          }
        }
        .menuTitle {
          padding-left: 100px;
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 22px;
        }
        .menu1 {
          padding: 0 100px;
          list-style: none;
          overflow: hidden;
          margin-bottom: 18px;
          li {
            float: left;
            width: 283px;
            margin-right: 20px;
            color: #fff;
            margin-bottom: 32px;
            cursor: pointer;
            .bigImg {
              width: 100%;
            }
            div {
              color: #2ba1f4;
              font-size: 18px;
              margin-top: 5px;
              height: 26px;
              span:first-child {
                float: left;
                color: rgba(255, 255, 255, 0.5);
                margin-right: 70px;
              }
              span:nth-child(2) {
                float: left;
                img {
                  vertical-align: middle;
                  margin-right: 3px;
                  float: left;
                  margin-top: 5px;
                }
              }
            }
          }
        }
        .menu2 {
          padding: 0 100px;
          list-style: none;
          overflow: hidden;
          li {
            float: left;
            width: 283px;
            margin-right: 20px;
            color: #fff;
            margin-bottom: 32px;
            cursor: pointer;
            div:first-child {
              width: 100%;
              height: 94px;
              background: rgba(82, 140, 242, 1);
              border-radius: 4px;
              padding: 23px 42px 28px;
              font-size: 18px;
              line-height: 36px;
              margin-bottom: 5px;
              img {
                float: left;
                margin-right: 15px;
              }
            }
            div:nth-child(2) {
              text-align: center;
              font-size: 18px;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
      }
    }
  }
  .taskTk {
    .el-dialog {
      height: 100%;
      margin-bottom: 0;
      border-radius: 0;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        height: 100%;
        padding: 0 !important;
      }
    }
  }
}
</style>
