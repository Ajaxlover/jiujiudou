<template>
  <div class="test">
    <!-- <StuBreadcrumb></StuBreadcrumb> -->
    <div class="video" style="width: 100%; height: 400px"></div>

    <!-- <el-tree
      :data="catalogList"
      :props="defaultProps"
      :expand-on-click-node="false"
      node-key="catalogId"
      highlight-current
      ref="vueChapterTree"
      icon-class="el-icon-arrow-right"
    >
      <span class="custom-tree-node" ref="popover" slot-scope="{ node, data }">
        <div class="video-icon"></div>
        <span
          :title="node.label"
          v-if="data.catalogType == 0 || data.catalogSubType == 8"
          >{{ node.label }}</span
        >
        <span :title="node.label" v-else style="cursor: pointer">
          {{ node.label }}</span
        >
        <span v-if="data.catalogIsFree == 1" style="color: #2ba1f4">试看</span>
      </span>
    </el-tree> -->
    <StuCatalog_n @switchVideo="switchVideo" :data="catalogList"></StuCatalog_n>
    <!-- <StuCatalog @switchVideo="switchVideo" :data="catalogList"></StuCatalog> -->
    <!-- <div>
      <message-tree
        @on-thumbup="zan"
        @on-reply="onReply"
        :renderLayer="3"
        :data-list="dataList"
      >
      </message-tree>
    </div> -->
    <div>
      <el-collapse-transition>
        <dd class="reply-container" v-show="isExpanded">222222</dd>
      </el-collapse-transition>
    </div>
    <div>
      <CommentEditor @submit="uuuu"></CommentEditor>
    </div>
    <div>
      <el-button type="primary" @click="isQRcode = true">去付款</el-button>
      <section class="pay-type">
        <ul>
          <li :class="type == 2 ? 'active' : ''" @click="type = 2">
            <span class="pay-type-icon2"></span>微信支付
          </li>
          <li :class="type == 1 ? 'active' : ''" @click="type = 1">
            <span class="pay-type-icon1"></span>支付宝
          </li>
        </ul>
      </section>
    </div>
    <div>
      <!-- <StuVideoList :data="catalogList"></StuVideoList> -->
    </div>
    <el-dialog :title="'云课名称：1111'" :visible.sync="isQRcode" width="40%">
      <section style="width: 150px; margin: 0 auto">
        <section style="text-align: center; margin-bottom: 6px">
          扫一扫付款 (元)
        </section>
        <section class="money-pay-num">
          {{ price.toFixed(2) / 100 }}
        </section>
        <section class="qrcode">
          <img :src="qrcode" width="100%" />
          <img src="../assets/img/zfb1.png" class="zfb-img" width="100%" />
          <section class="money-pay-text">
            <img src="../assets/img/qrcode.png" width="100%" />
            <div class="pay-text">
              <p>打开手机支付</p>
              <p>扫一扫付款</p>
            </div>
          </section>
        </section>
        <section v-if="type == 1" class="qrcode-t">支付宝扫码支付</section>
        <section v-if="type == 2" class="qrcode-t">微信扫码支付</section>
      </section>
      <section style="text-align: center; margin: 20px 0">
        <span slot="footer" class="dialog-footer">
          <el-button class="but-pay" @click="isQRcode = false">确 定</el-button>
        </span>
      </section>
    </el-dialog>
    <!-- <div>
      <el-tabs type="card" closable>
        <el-tab-pane
          v-for="(item, index) in 10"
          :key="index"
          :label="index"
          :name="index"
        >
          {{ index }}
        </el-tab-pane>
      </el-tabs>
    </div> -->
    <div>
      <!-- action="https://jsonplaceholder.typicode.com/posts/" -->

      <el-upload
        action=""
        :limit="9"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :auto-upload="true"
        :http-request="uploadSectionFile"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
    <div>
      <!-- <img v-image-preview src="../assets/pic1.png" alt="" /> -->
    </div>
    <div class="container">
      <div class="list">
        <div class="cor">
          <!-- <StuCatalog :data="catalogList"></StuCatalog> -->
          <StuCatalog
            @switchVideo="switchVideo"
            :data="catalogList"
          ></StuCatalog>

          <!-- <p :key="item" v-for="item in 100">
            111111222222222222222222222222222222222222
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
import StuCatalog from "@/components/Stu-Catalog.vue";
import StuCatalog_n from "@/components/Stu-Catalog_1.vue";
// import StuBreadcrumb from "@/components/Stu-Breadcrumb.vue";
// import StuVideoList from "@/components/Stu-VideoList.vue";
// eslint-disable-next-line no-unused-vars
// import comment from "bright-comment";
import CommentEditor from "comment-message-editor";

export default {
  name: "stu-test",
  components: {
    StuCatalog,
    StuCatalog_n,
    // StuVideoList,
    CommentEditor,
    // StuBreadcrumb,
  },
  data() {
    return {
      defaultProps: {
        children: "catalog",
        label: "catalogName",
      },
      imgUrls: [],
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      price: 15000,
      qrcode: "11",
      isQRcode: false,
      type: 2,
      isExpanded: false,
      dataList: [
        {
          thumbupCount: 4,
          email: "email@sina.com",
          nickname: "nickname",
          content: "message",
          createdAt: "2020-02-29T03:57:51.466Z",
          updatedAt: "2020-02-29T10:37:39.238Z",
          id: "5e59e13f961db51ad45c9ebb",
          children: [],
        },
        {
          thumbupCount: 0,
          email: "email@sina.com.cn",
          nickname: "昵称二",
          content: "这是第二个留言",
          createdAt: "2020-03-23T06:23:15.952Z",
          updatedAt: "2020-03-23T06:23:15.952Z",
          id: "5e7855d3ffbc160b9c2d3098",
          children: [
            {
              thumbupCount: 0,
              email: "email@sina.com",
              nickname: "昵称",
              content: "这是一条回复",
              parentID: "5e7855d3ffbc160b9c2d3098",
              createdAt: "2020-03-23T06:23:37.972Z",
              updatedAt: "2020-03-23T06:23:37.972Z",
              id: "5e7855e9ffbc160b9c2d3099",
              children: [
                {
                  thumbupCount: 0,
                  email: "email@sina.com",
                  nickname: "昵称1",
                  content: "这是一条@昵称的回复",
                  parentID: "5e7855e9ffbc160b9c2d3099",
                  createdAt: "2020-03-23T06:24:00.857Z",
                  updatedAt: "2020-03-23T06:24:00.857Z",
                  id: "5e785600ffbc160b9c2d309a",
                  children: [
                    {
                      thumbupCount: 0,
                      email: "email@sina.com",
                      nickname: "哈哈哈哈",
                      content: "hahhahhahhahhahah",
                      parentID: "5e59e13f961db51ad45c9ebb",
                      createdAt: "2020-03-23T06:24:00.857Z",
                      updatedAt: "2020-03-23T06:24:00.857Z",
                      id: "5e785600ffbc160b9c2d309a",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      videoObject: {
        container: ".video", //“#”代表容器的ID，“.”或“”代表容器的class
        seek: "cookie", //指定跳转到cookie记录的时间，使用该属性必需配置属性cookie
        cookie: "abcdefg", //cookie名称,请在同一域中保持唯一
        timeScheduleAdjust: 5,
        video:
          "http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/70882cbf4564972818475607977/v.f30.mp4", //视频地址
      },
      catalogList: [],
      player: null,
      currentPlayer: null,
    };
  },
  methods: {
    uploadSectionFile(params) {
      console.log(params);
      const form = new FormData();
      // 文件对象
      form.append("file", params.file);
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/uploadImage",
          data: form,
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.imgUrls.push({
              picUid: params.file.uid,
              url: ret.data,
            });
          }
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let index = this.imgUrls.findIndex((item) => item.picUid == file.uid);
      this.imgUrls.splice(index, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uuuu(data) {
      console.log(data);
    },
    zan(data) {
      console.log(data);
    },
    onReply(data) {
      console.log(data);
    },
    switchVideo(data) {
      console.log(data);
      this.videoObject.video = data.catalogUrl;
      // eslint-disable-next-line no-undef
      this.currentPlayer = new ckplayer(this.videoObject);
      this.currentPlayer.ended(function () {
        console.log("end11");
      });
    },
    getCloudCourseDetail() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/detail`,
          data: {
            // cCourseId: 1834,
            cCourseId: 2264,
            // cCourseId: 1951,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            console.log(ret);
            this.catalogList = ret.data.catalog;
          }
        });
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.player = new ckplayer(this.videoObject);
    this.player.ended(function () {
      console.log("end");
    });

    this.getCloudCourseDetail();
  },
};
</script>
<style lang="less" scoped>
.container {
  // width: 500px;
  // height: 600px;
  // background-color: red;
  margin: 0 auto;
  // padding: 10px;
  // position: relative;
  .list {
    // width: 100%;
    // height: 100%;
    width: 800px;
    height: 600px;
    position: relative;
    overflow: hidden;
    .cor {
      height: 600px;
      width: 100%;
      position: absolute;
      overflow: scroll;
      overflow-x: hidden;
      // top: 0;
    }
  }
}

.test {
  padding: 50px 300px;
  margin-top: 90px;
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;
  // /deep/ .el-tree-node__content {
  //   height: 60px;
  //   .custom-tree-node {
  //     display: flex;
  //     align-items: center;
  //   }
  //   .video-icon {
  //     background: url("../assets/img/video_icon.png") no-repeat center;
  //     background-size: 60%;
  //     width: 50px;
  //     height: 50px;
  //   }
  // }

  .pay-type {
    ul li {
      width: 180px;
      height: 60px;
      line-height: 60px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      //   transition: .1s;
      span {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      .pay-type-icon1 {
        background: url("../assets/img/zfb.png") no-repeat #fff;
        background-size: 100%;
      }
      .pay-type-icon2 {
        background: url("../assets/img/wx.png") no-repeat #fff;
        background-size: 100%;
      }
    }
    .active {
      border: 2px #03d3f2 solid;
    }
  }
  .money-pay-num {
    color: #f0742b;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .money-pay-text {
    color: #666;
    font-size: 12px;
    // margin-top: 10px;
    text-align: center;
    .pay-text {
      display: inline-block;
      text-align: left;
      vertical-align: middle;
    }
    img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
    }
  }
  .but-pay {
    background: #03d3f2;
    width: 50%;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0;
  }
  .qrcode {
    border: 1px #d1d1d1 solid;
    padding-bottom: 10px;
    margin-top: 5px;
    position: relative;
    .zfb-img {
      position: absolute;
      right: -161px;
      top: -70px;
    }
  }
  .qrcode-t {
    color: #333;
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
