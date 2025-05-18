<template>
  <div class="page-home">
    <div class="content">
      <video ref="videoPlayer" width="100%" controls="controls" @loadedmetadata="playVideo">
        <source :src="videoUrl" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArDetails',
  data() {
    return {
      videoTitle: this.$route.query.videoTitle,
      videoUrl: this.$route.query.videoUrl
    }
  },
  computed: {},
  created() {},
  mounted() {
    document.title = this.videoTitle
  },
  methods: {
    playVideo() {
      this.$refs.videoPlayer.play()
    }
  }
}
</script>
<style lang="scss" scoped>
.page-home {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    width: 100%;
  }
}
</style>
