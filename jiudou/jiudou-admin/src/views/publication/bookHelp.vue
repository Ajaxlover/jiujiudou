<template>
  <el-container class="help">
    <el-header height="50px">
      <span class="book" @click="toBook">教材管理</span>
      <i class="el-icon-arrow-right"></i> <span>教材管理帮助</span>
    </el-header>
    <el-main>
      <el-collapse accordion>
        <el-collapse-item title="1、谁可以创建教材？" name="1">
          <div>在九斗平台成为机构管理员或机构下编辑成员的用户可以创建教材</div>
        </el-collapse-item>
        <el-collapse-item
          title="2、创建一本教材需要的最基本内容有哪些？"
          name="2"
        >
          <div>1、教材信息，教材信息里的基本信息必须填写</div>
          <div>2、教材资源，平台资源里的教材资源必须有内容</div>
        </el-collapse-item>
        <el-collapse-item
          title="3、教材资源里的扫码资源是指什么，如何绑定？"
          name="3"
        >
          <div>
            1、扫码资源是指与纸质教材绑定的线上资源，通过纸质教材上二维码可以扫描查看的资源
          </div>
          <div>2、绑定过程：</div>
          <div style="margin-left:15px;">
            第一步：根据纸质教材的目录建立一个对应的教材目录
          </div>
          <div style="margin-left:15px;">
            第二步：根据纸质教材的资源数量生成对应数量的资源二维码（需要将生成的资源二维码下载下来，排版到纸质教材中）
          </div>
          <div style="margin-left:15px;">
            第三步：选定目录，点击“选择资源”或“上传资源”，
          </div>
          <div style="margin-left:15px;">
            第四步：从资源库选择一个资源或上传一个资源后，点击下一步，设置资源展示名、页码，选择一个二维码，点击“确定”即绑定成功；
          </div>
          <div style="margin-left:15px;">
            重复第三步和第四步，即可绑定所有教材资源
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="4、教材资源里的自测训练是指什么，如何绑定？"
          name="4"
        >
          <div>
            1、自测训练是指用户验证教材后，在教材资源里可以自由练习的题目，主要供学生用户使用，<span
              style="color:red"
              >仅支持客观题</span
            >
          </div>
          <div>2、绑定过程：</div>
          <div style="margin-left:15px;">
            第一步：根据纸质教材的目录建立一个对应的教材目录（在绑定教材资源时已建立教材目录则可直接使用）
          </div>
          <div style="margin-left:15px;">
            第二步：选定目录，点击“找题”、“批量上传”、“单题录入”
          </div>
          <div style="margin-left:15px;">
            第三步：选择、添加、或导入题目后，即绑定成功
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="5、教材资源里的教材习题是指什么，如何绑定？"
          name="5"
        >
          <div>
            1、教材习题是指教师用户验证教材后，在发布作业、应答或者后台的“题库”-“教材题库”可以查看的题目，主要供教师发布作业使用，学生用户不可见。<span
              style="color:red"
              >支持客观题和主观题</span
            >
          </div>
          <div>2、绑定过程：</div>
          <div style="margin-left:15px;">
            第一步：根据纸质教材的目录建立一个对应的教材目录（在绑定教材资源时已建立教材目录则可直接使用）
          </div>
          <div style="margin-left:15px;">
            第二步：选定目录，点击“找题”、“批量上传”、“单题录入”
          </div>
          <div style="margin-left:15px;">
            第三步：选择、添加、或导入题目后，即绑定成功
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="6、批量上传有什么规则？自测训练与教材习题的模板是否一样？"
          name="6"
        >
          <div>
            1、批量上传的规则，详见:
            <el-button
              type="primary"
              size="mini"
              style="background:#11BCE4;border:none"
              @click="downloadFormwork"
              >试题模板</el-button
            >
          </div>
          <div>2、自测训练与教材习题模板是同一个模板</div>
          <div>3、上架是什么意思，需要准备什么信息？</div>
          <div style="margin-left:15px;">
            1、上架是指将教材展示在“云端书架”，让未验证的用户也能查看教材介绍
          </div>
          <div style="margin-left:15px;">2、上架需要准备的信息有：</div>
          <div style="margin-left:28px;">
            • 商城网址：选填，指的是教材在淘宝商城的网址
          </div>
          <div style="margin-left:28px;">• 教材简介：必填，纸质教材的介绍</div>
          <div style="margin-left:28px;">
            • 教材目录：必填，纸质教材上的完整目录
          </div>
          <div style="margin-left:28px;">• 作者简介：选填，作者的介绍</div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import COS from "cos-js-sdk-v5";
import axios from "@/libs/api.request";
export default {
  data() {
    return {
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      }
    };
  },
  methods: {
    toBook() {
      this.$router.push({
        name: "book"
      });
    },
    // 下载模板
    downloadFormwork() {
      this.cos.getObjectUrl(
        {
          Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
          Region: this.cosConfig.region,
          Key: "download/题库模板.docx",
          Sign: true
        },
        function(err, data) {
          if (!err) {
            var url =
              data.Url +
              (data.Url.indexOf("?") > -1 ? "&" : "?") +
              "response-content-disposition=attachment"; // 补充强制下载的参数
            // window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
            let elemIF = window.document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            window.document.body.appendChild(elemIF);
          }
        }
      );
    }
  },
  mounted() {
    // 初始化COS
    axios
      .request({
        method: "post",
        url: "/v1/upload/jsInitInfo"
      })
      .then(res => {
        let ret = res.data;
        if (ret.code == 200) {
          var info = ret.data;
          this.cosConfig.bucket = info.bucket;
          this.cosConfig.imgBucket = info.imgBucket;
          this.cosConfig.appId = info.appId;
          if (info.domain) {
            this.cosConfig.topDomain = info.domain;
          }
          if (info.region) {
            this.cosConfig.region = info.region;
          }
          this.cos = new COS({
            // 必选参数
            getAuthorization: function(options, callback) {
              axios
                .request({
                  method: "post",
                  url: "/v1/upload/cosSignatureV5",
                  data: {
                    bucket: options.Bucket,
                    region: options.Region
                  }
                })
                .then(res => {
                  let ret = res.data;
                  if (ret.code === 200) {
                    let obj = {
                      TmpSecretId: ret.data.tmpSecretId,
                      TmpSecretKey: ret.data.tmpSecretKey,
                      XCosSecurityToken: ret.data.xCosSecurityToken,
                      ExpiredTime: ret.data.expiredTime
                    };
                    callback(obj);
                  }
                });
            }
          });
        }
      });
  }
};
</script>

<style lang="scss">
.help {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 30px;
    .el-collapse-item__header {
      color: #333333;
      font-size: 16px;
    }
    .el-collapse-item__content {
      padding-left: 25px;
      padding-top: 10px;
      div {
        margin: 8px 0;
      }
    }
  }
}
</style>
