<template>
  <div class="epub-box">
    <!-- <div class="side-bar"></div>
    <div class="toc-bar"></div>
    <div id="epub-area"></div> -->
    <el-button @click="checkSuccess" type="primary"></el-button>
  </div>
</template>

<script>
import axios from "@/libs/api.request";

// const { EpubRender } = window.Kookit;
export default {
  data() {
    return {
      url:
        "https://find-1253402545.cos.ap-beijing.myqcloud.com/book/zw45_%E6%B5%81%E5%BC%8F.epub",
      buffer: null,
      book: null
    };
  },
  methods: {
    checkSuccess() {
      // 后台返回流的形式，也是我本人项目的使用
      // eslint-disable-next-line no-unused-vars
      let url =
        "http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
      // 当然上面的是可以的，但是此access_token 是有时效性的，只是放在这边当作个例子，至于最后我为什么加了个测试.pdf 是可以在浏览器标签叶上显示
      // this.urlToBlobBase64(url).then(res => {
      //   console.log(res);

      //   let blob = new Blob([res.blob]);
      //   let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
      //   window.open("/static/pdf/web/viewer.html?file=" + fileURL);
      // });

      // /v3/cloudCourse/detailByCatalogId

      axios
        .request({
          method: "post",
          responseType: "blob",
          url: `${process.env.BASE_URL_V3}/cloudCourse/detailByCatalogId`,
          data: {
            catalogId: 61751
          }
        })
        .then(res => {
          console.log(res);
          let blob = new Blob([res.data]);
          let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
          window.open("/static/pdf/web/viewer.html?file=" + fileURL);
        });

      // encodeURIComponent(url)
      // window.open("/static/pdf/web/viewer.html?file=" + url);
      // window.open(
      //   "/static/pdf/web/viewer.html?file=" + "/static/pdf/web/demo.pdf"
      // );
    },
    urlToBlobBase64(imgUrl) {
      return new Promise((resolve, reject) => {
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgUrl, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
          if (this.status == 200) {
            var blob = this.response;
            let oFileReader = new FileReader();
            oFileReader.onloadend = function(e) {
              console.log(e);
              resolve({ blob, base64: e.target.result });
            };
            oFileReader.readAsDataURL(blob);
          } else {
            reject(new Error("异常"));
          }
        };
        xhr.send();
        xhr.onerror = () => {
          reject(new Error("异常"));
        };
      });
    },
    init() {
      // this.urlToBlobBase64(this.url).then(res => {
      //   console.log(res);
      //   let reader = new FileReader();
      //   reader.onload = async result => {
      //     console.log(result);
      //     this.buffer = result.target.result;
      //     let rendition = new EpubRender(this.buffer, "double", false);
      //     console.log(rendition);
      //     console.log(document.getElementById("epub-area"));
      //     await rendition.renderTo(document.getElementById("epub-area"));
      //   };
      //   reader.readAsArrayBuffer(res.blob);
      // });
      // let rendition = new EpubRender(this.buffer, "double", false);
      // eslint-disable-next-line no-undef
      this.book = ePub({
        bookPath:
          "https://find-1253402545.cos.ap-beijing.myqcloud.com/book/zw45_%E6%B5%81%E5%BC%8F.epub",
        width: window.innerWidth,
        height: window.innerHeight,
        restore: false,
        spreads: false
      });
      this.book.getToc().then(toc => {
        console.log(toc);
      });
      // this.book.renderer.forceSingle(false);
      this.book.renderTo("epub-area").then(() => {
        console.log("渲染区域");
      });
    }
  },
  mounted() {
    // this.init();
  }
};
</script>

<style lang="scss" scoped>
.epub-box {
  height: 100%;
  display: flex;
  .side-bar {
    height: 100%;
    width: 60px;
    background-color: red;
  }
  .toc-bar {
    height: 100%;
    width: 300px;
    background-color: pink;
  }
  #epub-area {
    flex: 1;
    background-color: grey;
    // width: 1000px;
    // height: 400px;
  }
}
</style>
