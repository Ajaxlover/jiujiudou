<template>
  <div class="viewRes" @contextmenu.prevent>
    <!-- <div class="title">{{data.resName}}</div> -->
    <!-- 音频 -->
    <div v-if="data.resType == 1" class="audio">
      <audio :src="data.resUrl" controls controlslist="nodownload"></audio>
    </div>
    <!-- 视频 -->
    <div v-else-if="data.resType == 2" class="video">
      <video :src="data.resUrl" controls controlslist="nodownload"></video>
    </div>
    <!-- AR -->
    <div v-else-if="data.resType == 3" class="AR">
      <iframe
        v-if="data.resUrlWeb"
        :src="data.resUrlWeb"
        frameborder="0"
        id="iframe"
        width="100%"
        height="440px"
      ></iframe>
      <div v-else>资源建设中</div>
    </div>
    <!-- excel -->
    <div v-else-if="data.resType == 4" class="excel">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrl" target="_blank">点击下载</a>
    </div>
    <!-- h5 -->
    <div v-else-if="data.resType == 5" class="h5" style="background:#fff">
      <iframe
        :src="data.resUrl"
        frameborder="0"
        id="iframe"
        width="100%"
        :height="isFull ? '820px' : '700px'"
      ></iframe>
    </div>
    <!-- 富文本 -->
    <div v-else-if="data.resType == 15" class="h5" style="background:#fff">
      <div v-html="data.resDesc"></div>
    </div>
    <!-- ppt -->
    <div v-else-if="data.resType == 6" class="ppt">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrl" target="_blank">点击下载</a>
    </div>
    <!-- word -->
    <div v-else-if="data.resType == 7" class="word">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrl" target="_blank">点击下载</a>
    </div>
    <!-- pdf -->
    <div v-else-if="data.resType == 9" class="pdf">
      <!-- <div style="text-align: center;font-size: 12px;color: #999999;">该资源不支持在线预览</div> -->
      <iframe
        :src="data.resUrl + '#toolbar=0'"
        frameborder="0"
        id="iframe"
        width="100%"
        :height="isFull ? '820px' : '600px'"
      ></iframe>
    </div>
    <!-- img -->
    <div v-else-if="data.resType == 10" class="img">
      <img :src="data.resUrl" alt="" />
    </div>
    <!-- 文件夹 -->
    <div v-else-if="data.resType == 11" class="yypc">
      <div>文件夹不支持在线预览</div>
    </div>
    <!-- 语音评测 -->
    <div v-else-if="data.resType == 12" class="yypc">
      <div>该资源不支持在线预览</div>
    </div>
    <!-- 其他 -->
    <div v-else-if="data.resType == 0" class="yypc">
      <!-- <div>该资源不支持在线预览</div> -->
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrl" target="_blank">点击下载</a>
    </div>
  </div>
</template>

<style lang="scss">
.viewRes .h5 #iframe,
.viewRes .pdf #iframe {
  width: 100%;
}
.viewRes {
  .title {
    text-align: center;
    margin-bottom: 15px;
  }
  .audio {
    width: 100%;
    margin-top: 20%;
    audio {
      width: 100%;
    }
  }
  .video {
    height: 100%;
    text-align: center;
    video {
      height: 90.5%;
    }
  }
  .AR {
    width: 100%;
    text-align: center;
    div {
      text-align: center;
      font-size: 20px;
      color: #333333;
    }
  }
  .excel,
  .ppt,
  .word,
  .yypc {
    text-align: center;
    font-size: 12px;
    color: #999999;
    div {
      margin-top: 30px;
      margin-bottom: 10px;
    }
    a {
      text-decoration: none;
      text-align: center;
      font-size: 18px;
      color: #2ba1f4;
      cursor: pointer;
    }
  }
  .h5,
  .pdf {
    width: 100%;
    overflow: auto;
  }
  .img {
    width: 100%;
    text-align: center;
    img {
      max-width: 100%;
      max-height: 400px;
    }
  }
}
</style>

<script>
export default {
  props: {
    isFull: Boolean,
    data: Object
  }
};
</script>
