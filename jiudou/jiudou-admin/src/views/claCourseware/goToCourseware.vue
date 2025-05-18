<template>
  <el-container class="goToCourseware">
    <el-main>
      <div id="baiban" style="width:100%;height:100%"></div>
    </el-main>
    <div>
      <div class="leftBtn">
        <ul>
          <!-- <li @click="showClassTest" v-if="hasRes" style="margin-bottom:12px">
            <img src="@/assets/coursewareIcon/classTest.png" alt="" />
            <div>应答</div>
          </li> -->
          <!-- hasCourseWareAnswer -->
          <li
            v-if="hasCourseWareAnswer"
            @click="showAllCourseAnswer"
            style="margin-bottom:10px"
          >
            <img src="@/assets/coursewareIcon/icon_1.png" alt="" />
            <div>应答</div>
          </li>
          <li @click="showRes" v-if="hasRes">
            <img src="@/assets/coursewareIcon/resIcon.png" alt="" />
            <div>资源分享</div>
          </li>
        </ul>
        <div>
          <div @click="leftSshow = !leftSshow" class="clickBtn">
            <span v-if="!leftSshow"
              ><img
                src="@/assets/coursewareIcon/arrowLeft.png"
                style="width:35px"
                alt=""
              />
              <div>展开</div></span
            >
            <span v-else
              ><img
                src="@/assets/coursewareIcon/arrowRight.png"
                style="width:35px"
                alt=""
              />
              <div>收起</div></span
            >
          </div>
          <el-collapse-transition>
            <div v-show="leftSshow">
              <div class="transition-box" @click="isSignShow = true">
                <img src="@/assets/coursewareIcon/sign.png" alt="" />
                <div>签到</div>
              </div>
              <div class="transition-box" @click="showClassTest">
                <img src="@/assets/coursewareIcon/classTest.png" alt="" />
                <div>应答</div>
              </div>
              <!-- <div class="transition-box" @click="toTask">
                <img src="@/assets/coursewareIcon/exercise.png" alt="" />
                <div>作业</div>
              </div> -->
              <!-- <div class="transition-box" @click="goVoteList">
                <img src="@/assets/coursewareIcon/vote@2x.png" alt="" />
                <div>投票</div>
              </div> -->
              <!-- <div class="transition-box" @click="isVote1Show = true">
                <img src="@/assets/coursewareIcon/vote@2x.png" alt="" />
                <div>投票1</div>
              </div> -->
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <div
        class="bottomBtn"
        id="bottomBtn"
        :style="showEditBtn ? 'margin-left:-449px' : 'margin-left:-225px'"
      >
        <ul
          :style="
            showEditBtn
              ? 'border-top-right-radius: 0 !important;border-bottom-right-radius: 0 !important;padding-right:22.5px;margin-right:1px'
              : 'border-top-right-radius: 33px !important;border-bottom-right-radius: 33px !important;'
          "
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
          <li @click="toEdit">
            <img src="@/assets/coursewareIcon/edit.png" alt="" />
          </li>
        </ul>
        <ul v-if="showEditBtn" class="editBtn">
          <li @click="setToolType(1)">
            <img src="@/assets/coursewareIcon/brush.png" alt="" />
            <div>画笔</div>
          </li>
          <li @click="setToolType(3)">
            <img src="@/assets/coursewareIcon/laser.png" alt="" />
            <div>激光笔</div>
          </li>
          <li @click="setToolType(11)">
            <img src="@/assets/coursewareIcon/text.png" alt="" />
            <div>文本</div>
          </li>
          <li @click="setToolType(2)">
            <img src="@/assets/coursewareIcon/ereaser.png" alt="" />
            <div>橡皮擦</div>
          </li>
          <li @click="undo">
            <img src="@/assets/coursewareIcon/cancel.png" alt="" />
            <div>撤销</div>
          </li>
          <li @click="clear">
            <img src="@/assets/coursewareIcon/clear.png" alt="" />
            <div>清空</div>
          </li>
        </ul>
        <ul class="overBtn">
          <li @click="overClass">
            <img src="@/assets/coursewareIcon/overClass.png" alt="" />
            <div>下课</div>
          </li>
        </ul>
        <ul class="fullScreenBtn">
          <li @click="toFullScreen" v-if="isFullScreen" class="li1">
            <div>全屏</div>
          </li>
          <li @click="toNoFullScreen" v-else class="li2">
            <div>退出全屏</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="startPage" v-if="isShowStartPage">
      <span class="returnBtn" type="text" @click="goBank"
        ><i class="el-icon-back"></i>返回</span
      >
      <el-progress :percentage="percentage"></el-progress>
      <div class="className">班级名：{{ cls.classname }}</div>
      <div class="coursewareName">课件名：{{ coursewareName }}</div>
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
          <div>PPT第{{ item.thumbnailIndex || item.thumIndex }}页</div>
        </li>
      </ul>
    </el-dialog>
    <!-- 作业弹框 -->
    <el-dialog
      :visible.sync="isTaskShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <releaseHomework
        :data="taskData"
        @close="isTaskShow = false"
      ></releaseHomework>
    </el-dialog>
    <!-- 签到弹框 -->
    <el-dialog
      :visible.sync="isSignShow"
      v-if="isSignShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <startClaSign
        v-if="isSignShow"
        :data="taskData"
        @close="isSignShow = false"
      ></startClaSign>
    </el-dialog>
    <!-- 资源分享弹框 -->
    <el-dialog
      :visible.sync="isResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-if="isResShow"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <showResource :data="resData" @close="isResShow = false"></showResource>
    </el-dialog>
    <!-- 应答弹框 -->
    <el-dialog
      v-if="isAnswerShow"
      :visible.sync="isAnswerShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <answer :answerNo="normalAnswerNo" @close="closeAnswerShow"></answer>
    </el-dialog>

    <!-- 应答弹框 -->
    <el-dialog
      v-if="isCourseAnswerShow"
      :visible.sync="isCourseAnswerShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <courseWareAnswer
        :answerNo="answerNo"
        :data="courseWareAnswerList"
        @close="closeCourseWareShow"
      ></courseWareAnswer>
    </el-dialog>
    <!-- 投票列表 -->
    <!-- <el-dialog
      :visible.sync="isVoteShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <voteList @close="isVoteShow = false"></voteList>
    </el-dialog> -->

    <el-dialog
      :visible.sync="isVote1Show"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <voteList @close="isVote1Show = false"></voteList>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import releaseHomework from "./releaseHomework";
import answer from "./answer";
import courseWareAnswer from "./courseWareAnswer.vue";
import startClaSign from "./startClaSign";
import showResource from "./showResource";
import voteList from "./vote/voteList";
import addVote from "./vote/addVote";

export default {
  name: "goToCourseware",
  components: {
    releaseHomework,
    startClaSign,
    showResource,
    answer,
    voteList,
    addVote,
    courseWareAnswer
  },
  data() {
    return {
      courseWareAnswerList: [],
      hasCourseWareAnswer: false, // 是否有课件应答
      isCourseAnswerShow: false, // 课件应答
      isVote1Show: false,
      goType: this.$route.query.goType,
      percentage: 0,
      isShowStartPage: true,
      timer: null,
      isShowBottomBtnTimer: null,
      cls: {},
      leftSshow: false,
      showEditBtn: false,
      isMenuShow: false,
      isTaskShow: false,
      isSignShow: false,
      isResShow: false,
      hasRes: false,
      isAnswerShow: false,
      isVoteShow: false,
      isFullScreen: true,
      coursewareId: this.$route.query.coursewareId,
      courseware_new: this.$route.query.courseware_new,
      menuData1: [],
      menuData2: [],
      gyClassId: this.$route.query.classId, //我的班级id
      coursewareCurrentPage: this.$route.query.coursewareCurrentPage,
      coursewareName: this.$route.query.coursewareName,
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
        paperId: this.$route.query.coursewareExerciseId,
        exerciseId: "", //作业ID
        exerciseName: this.$route.query.exerciseName,
        signNo: "", //签到ID
        coursewareId: this.$route.query.coursewareId
      },
      resData: [],
      tic: null,
      trtcClient: null,
      isToOverClass: false,
      answerNo: "",
      normalAnswerNo: ""
    };
  },
  mounted() {
    //防止页面后退
    history.pushState(null, null, document.URL);
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadData();
    this.loadSignId();
    this.initGetSign();
    // this.loadList(); // 加载作业的题目列表 用于判断作业是否有题目
    this.timer = setInterval(() => {
      if (this.percentage == 100) {
        this.isShowStartPage = false;
        clearInterval(this.timer);
        axios
          .request({
            method: "post",
            url: "/clazz/v4/courseware/start",
            data: {
              classId: this.cls.classId,
              coursewareId: this.coursewareId
            }
          })
          .then(res => {});

        let lastMove;
        document.onmousemove = function(e) {
          lastMove = new Date().getTime();
          e = e || window.event;
          let bottomHeight = e.pageY / document.documentElement.clientHeight;
          if (bottomHeight > 0.7) {
            document.getElementById("bottomBtn").style.display = "block";
          }
        };
        lastMove = new Date().getTime();
        this.isShowBottomBtnTimer = setInterval(function() {
          var now = new Date().getTime();
          if (now - lastMove > 5000) {
            document.getElementById("bottomBtn").style.display = "none";
          }
        }, 1000);
      } else {
        this.percentage = this.percentage + 20;
      }
    }, 1000);
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
    document.onkeydown = null;
    document.onmousemove = null;
    this.quitClassroom();
    clearInterval(this.isShowBottomBtnTimer);
  },
  methods: {
    closeAnswerShow() {
      this.isAnswerShow = false;
      this.normalAnswerNo = "";
    },
    closeCourseWareShow() {
      this.isCourseAnswerShow = false;
      this.answerNo = "";
    },
    showAllCourseAnswer() {
      this.getCourseWareAnswerList();
    },
    // 查询进行中的应答
    getAnswering() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryAvailable",
          data: {
            classId: this.$route.query.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.courseWareAnswerList = ret.data;
            if (ret.data && ret.data.answerNo) {
              this.answerNo = ret.data.answerNo;
            }
            this.isCourseAnswerShow = true;
          }
        });
    },
    // 查询进行中的应答
    getAnsweringNormal() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryAvailable",
          data: {
            classId: this.$route.query.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.courseWareAnswerList = ret.data;
            if (ret.data && ret.data.answerNo) {
              this.normalAnswerNo = ret.data.answerNo;
            }
            this.isAnswerShow = true;
          }
        });
    },
    // 获取课件应答
    getCourseWareAnswerList() {
      let index = this.boardData.current;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryInfoList",
          data: {
            wareId: this.coursewareId,
            thumbnailIndex: index,
            type: 3
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.courseWareAnswerList = ret.data;
            this.getAnswering();
            // this.isCourseAnswerShow = true;
          }
        });
    },
    // 去投票列表
    goVoteList() {
      this.$router.push({
        path: "/vote/voteList",
        query: {
          classId: this.$route.query.classId
        }
      });
    },
    goBank() {
      this.isShowStartPage = true;
      this.percentage = 0;
      clearInterval(this.timer);
      this.$router.back();
    },
    //获取签到ID
    loadSignId() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/activities",
          data: {
            coursewareId: this.coursewareId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // console.log(ret.data);
            if (ret.data.signNo) {
              this.taskData.signNo = ret.data.signNo;
            }
            if (ret.data.exerciseId) {
              this.taskData.exerciseId = ret.data.exerciseId;
            }
          }
        });
    },
    toTask() {
      if (this.pages > 0) {
        this.isTaskShow = true;
      } else {
        this.$message({
          type: "warning",
          message: "该课件暂无作业"
        });
      }
    },
    showRes() {
      this.resData = this.menuData1[this.boardData.current - 1].tContentList;
      this.isResShow = true;
    },
    showClassTest() {
      this.getAnsweringNormal();
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
            this.dataList = ret.data;
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
                    console.error(res);
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
            this.teduBoard = new window.TEduBoard(this.options);
            // window.teduBoard = this.teduBoard = this.tic.getBoardInstance();
            this.initBoardEvent();
          }
        }
      );
    },
    /**
     * 退出课堂
     */
    quitClassroom() {
      this.tic.quitClassroom(res => {
        if (res.code) {
          // this.$message({
          //   message: "退出课堂失败！",
          //   type: "warning"
          // });
        } else {
          // this.$message({
          //   message: "退出课堂成功！",
          //   type: "success"
          // });
        }
      });
    },
    initBoardEvent() {
      var teduBoard = this.teduBoard;
      // 撤销状态改变
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED,
        enable => {
          this.canUndo = enable ? 1 : 0;
          // console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
        }
      );
      // 重做状态改变
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED,
        enable => {
          this.canRedo = enable ? 1 : 0;
          // console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
        }
      );
      // 新增白板
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
        // console.log(
        //   "======================:  ",
        //   "TEB_ADDBOARD",
        //   " boardIds:",
        //   boardIds,
        //   " fid:",
        //   fid
        // );
        // this.proBoardData(boardIds, fid);
      });
      // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
      // TIC已经处理好了，可忽略该事件
      teduBoard.on(window.TEduBoard.EVENT.TEB_SYNCDATA, data => {
        // console.log('======================:  ', 'TEB_SYNCDATA');
      });
      // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
      teduBoard.on(window.TEduBoard.EVENT.TEB_INIT, () => {
        // console.log('======================:  ', 'TEB_INIT');
        // this.showMessageInBox('TIC', "onTEBInit finished");
      });
      teduBoard.on(window.TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        // console.log('======================:  ', 'TEB_HISTROYDATA_SYNCCOMPLETED');
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
        // console.error('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
        // this.showMessageInBox('TIC', "onTEBError code=" + code + " msg:" + msg);
      });
      // 白板警告回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
        // console.error('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
        // this.showMessageInBox('TIC', "onTEBWarning code=" + code + " msg:" + msg);
      });
      // 图片状态加载回调
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED,
        (status, data) => {
          // console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
        }
      );
      // // 删除白板页回调
      // teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
      //   console.log('======================:  ', 'TEB_DELETEBOARD', ' boardIds:', boardIds, ' fid:', fid);
      //   // this.proBoardData();
      // });
      // 跳转白板页回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        // console.log(
        //   "======================:  ",
        //   "TEB_GOTOBOARD",
        //   " boardId:",
        //   boardId,
        //   " fid:",
        //   fid
        // );
        this.proBoardData();
        // axios
        //   .request({
        //     method: "post",
        //     url: "/clazz/v4/courseware/getThumbnail",
        //     data: {
        //       coursewareId: this.coursewareId,
        //       thumbnailIndex: this.boardData.current
        //     }
        //   })
        //   .then(res => {
        //     let ret = res.data;
        //     if (ret.code === 200) {
        //       console.log("记录当前页" + this.boardData.current);
        //     }
        //   });
      });
      // 增加H5动画PPT文件回调
      // teduBoard.on(window.TEduBoard.EVENT.TEB_ADDH5PPTFILE, (fid) => {
      //   console.log('======================:  ', 'TEB_ADDH5PPTFILE', ' fid:', fid);
      //   this.proBoardData();
      // });
      // 增加文件回调
      // teduBoard.on(window.TEduBoard.EVENT.TEB_ADDFILE, (fid) => {
      //   console.log('======================:  ', 'TEB_ADDFILE', ' fid:', fid);
      //   this.proBoardData();
      // });
      // 增加转码文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, fid => {
        // console.log('======================:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid);
        this.proBoardData();
      });
      // 删除文件回调
      teduBoard.on(window.TEduBoard.EVENT.TEB_DELETEFILE, fid => {
        // console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
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
        // console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
        this.proBoardData();
      });
      // 上传背景图片的回调
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE,
        (fileName, fileUrl, userData) => {
          // console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
        }
      );
      // 文件上传进度
      teduBoard.on(window.TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, data => {
        // console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
        // this.showTip('上传进度:' + parseInt(data.percent * 100) + '%');
      });
      // H5背景加载状态
      teduBoard.on(
        window.TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED,
        (status, data) => {
          // console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
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
    //去编辑
    toEdit() {
      this.showEditBtn = !this.showEditBtn;
      this.teduBoard.setToolType(0);
    },
    //设置要使用的白班工具
    setToolType(type) {
      this.teduBoard.setToolType(type);
    },
    //撤销
    undo() {
      this.teduBoard.undo();
    },
    //清空
    clear() {
      this.teduBoard.clear();
    },
    proBoardData() {
      this.currentFileId = this.teduBoard.getCurrentFile();
      var fileInfo = this.teduBoard.getFileInfo(this.currentFileId);
      if (fileInfo) {
        this.boardData = {
          currentBoardId: this.currentFileId,
          boardIdlist: this.teduBoard.getFileBoardList(this.currentFileId),
          current: fileInfo.currentPageIndex + 1,
          total: fileInfo.pageCount
        };
        if (this.menuData1[fileInfo.currentPageIndex].tContentList.length > 0) {
          this.hasRes = true;
        } else {
          this.hasRes = false;
        }
        if (
          this.menuData1[fileInfo.currentPageIndex].clazzAnswerList.length > 0
        ) {
          this.hasCourseWareAnswer = true;
        } else {
          this.hasCourseWareAnswer = false;
        }
      }
    },
    //跳转
    gotoBoard(index) {
      this.teduBoard.gotoBoard(this.boardData.boardIdlist[index - 1], true);
      this.isMenuShow = false;
    },
    // 加载作业的题目
    loadList() {
      axios
        .request({
          method: "post",
          url: "/tiku/paperItem/listAll",
          data: {
            paperId: this.taskData.paperId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            // console.log(ret.data.length);
            this.isToOverClass = ret.data.length > 0;
          }
        });
    },
    //下课
    overClass() {
      if (!this.taskData.exerciseId && this.isToOverClass) {
        this.$confirm(
          "<div>课件中的作业未发布，是否前往发布作业</div>",
          "温馨提示",
          {
            cancelButtonText: "忽略",
            confirmButtonText: "去发布",
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false
            // type: "warning"
          }
        )
          .then(() => {
            this.isTaskShow = true;
          })
          .catch(() => {
            this.$confirm(
              "<div>是否确认下课? </div><div>下课后将关闭本页面，并生成课堂报告发送至APP</div>",
              "下课",
              {
                cancelButtonText: "取消",
                confirmButtonText: "下课",
                dangerouslyUseHTMLString: true,
                closeOnClickModal: false
                // type: "warning"
              }
            )
              .then(() => {
                this.overClassCommon();
              })
              .catch(() => {});
          });
      } else {
        this.$confirm(
          "<div>是否确认下课? </div><div>下课后将关闭本页面，并生成课堂报告发送至APP</div>",
          "下课",
          {
            cancelButtonText: "取消",
            confirmButtonText: "下课",
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false
            // type: "warning"
          }
        )
          .then(() => {
            this.overClassCommon();
          })
          .catch(() => {});
      }
    },
    overClassCommon() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/end",
          data: {
            classId: this.gyClassId,
            coursewareId: this.courseware_new
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.quitClassroom(); // 退出课堂
            this.$router.push({
              path: "/class/classReport",
              query: {}
            });
          }
        });
    },
    //全屏
    toFullScreen() {
      let el = document.documentElement;
      let rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      }
      this.isFullScreen = false;
    },
    //退出全屏
    toNoFullScreen() {
      let el = document.documentElement;
      let cfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
      }
      this.isFullScreen = true;
    }
  }
};
</script>

<style lang="scss">
.goToCourseware {
  height: 100%;
  background: rgba(28, 39, 46, 1);
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
        color: rgba(255, 255, 255, 0.8);
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
    .fullScreenBtn {
      font-size: 12px;
      padding: 0;
      width: 52px;
      height: 52px;
      text-align: center;
      border-radius: 50% !important;
      margin-left: 40px;
      .li1 {
        width: 52px;
        height: 52px;
        line-height: 52px;
      }
      .li2 {
        width: 52px;
        height: 52px;
        padding: 10px;
      }
    }
  }
  .menuTk {
    .el-dialog {
      min-height: 100%;
      margin-bottom: 0;
      border-radius: 0;
      background: rgba(0, 0, 0, 0.8);
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        // height: -moz-calc(100% - 54px);
        // height: -webkit-calc(100% - 54px);
        // height: calc(100% - 54px);
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
  .startPage {
    text-align: center;
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: 20%;
    .returnBtn {
      position: absolute;
      top: 13px;
      left: 0;
      z-index: 2;
      color: #333;
      border: 1px solid #979797;
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      border-radius: 17px;
      cursor: pointer;
      margin-left: 45px;
    }
    .el-progress {
      width: 800px;
      margin: 0 auto;
    }
    .className {
      font-size: 28px;
      margin: 30px 0 15px;
    }
    .coursewareName {
      font-size: 16px;
    }
  }
}
</style>
