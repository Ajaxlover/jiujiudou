<template>
  <div class="viewRes-ke-jian">
    <!-- 音频 -->
    <div v-if="data.resType == 1" class="audio">
      <audio :src="data.resUrlWeb" controls controlslist="nodownload"></audio>
    </div>
    <!-- 视频 -->
    <div v-else-if="data.resType == 2" class="video">
      <video :src="data.resUrlWeb" controls controlslist="nodownload"></video>
    </div>
    <!-- AR -->
    <div v-else-if="data.resType == 3" class="AR">
      <iframe
        v-if="data.resUrlWeb"
        :src="data.resUrlWeb"
        frameborder="0"
        scrolling="no"
      ></iframe>
      <div v-else>
        <i class="el-icon-warning-outline"></i>
        <div>资源建设中</div>
      </div>
    </div>
    <!-- excel -->
    <div v-else-if="data.resType == 4" class="excel">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrlWeb" target="_blank">点击下载</a>
    </div>
    <!-- h5 -->
    <div v-else-if="data.resType == 5" class="h5" style="background:#fff">
      <iframe :src="data.resUrlWeb" frameborder="0"></iframe>
    </div>
    <!-- ppt -->
    <div v-else-if="data.resType == 6" class="ppt">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrlWeb" target="_blank" class="download">点击下载</a>
    </div>
    <!-- word -->
    <div v-else-if="data.resType == 7" class="word">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrlWeb" target="_blank" class="download">点击下载</a>
    </div>
    <!-- pdf -->
    <div v-else-if="data.resType == 9" class="pdf">
      <div style="text-align: center;">
        <i class="el-icon-warning-outline"></i>
        <div>该资源不支持在线预览</div>
      </div>
      <!-- <iframe  :src='data.resUrlWeb' frameborder='0' width='100%' height='500px'></iframe> -->
    </div>
    <!-- img -->
    <div v-else-if="data.resType == 10" class="img">
      <img :src="data.resUrlWeb" alt="" />
    </div>
    <!-- 文件夹 -->
    <div v-else-if="data.resType == 11" class="yypc">
      <div>
        <i class="el-icon-warning-outline"></i>
        <div>文件夹不支持在线预览</div>
      </div>
    </div>
    <!-- 语音评测 -->
    <div v-else-if="data.resType == 12" class="yypc">
      <div>
        <i class="el-icon-warning-outline"></i>
        <div>该资源不支持在线预览</div>
      </div>
    </div>
    <!-- 其他 -->
    <div v-else-if="data.resType == 0" class="yypc">
      <div>该资源不支持在线预览，请下载查看</div>
      <a :href="data.resUrlWeb" target="_blank" class="download">点击下载</a>
    </div>
  </div>
</template>

<style lang="scss">
.viewRes-ke-jian {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  .audio {
    width: 50%;
    audio {
      width: 100%;
    }
  }
  .video {
    height: 100%;
    text-align: center;
    video {
      height: 100%;
    }
  }
  // 要使 <iframe> 标签的 height=100% 生效，一定要保证其父容器的 height=100% 有效
  .AR {
    width: 100%;
    iframe {
      width: 100%;
      height: 624px;
    }
  }
  .excel,
  .ppt,
  .word,
  .yypc {
    text-align: center;
    div {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    a {
      text-decoration: none;
      text-align: center;
      font-size: 18px;
      color: #fff;
      background: #2ba1f4;
      cursor: pointer;
      border-radius: 4px;
      padding: 10px 80px;
      margin-top: 15px;
    }
  }
  .h5,
  .pdf {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    iframe {
      width: 100%;
      min-height: 100%;
    }
  }
  .img {
    width: 100%;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
  .el-icon-warning-outline {
    font-size: 96px;
    color: #2ba1f4;
    opacity: 0.8;
    margin-bottom: 17px;
    font-weight: 300;
  }
}
</style>

<script>
export default {
  props: {
    data: Object
  }
};
</script>
