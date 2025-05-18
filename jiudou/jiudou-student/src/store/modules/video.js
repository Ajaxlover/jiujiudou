export default {
  state: {
    videoUrl: null,
    moocVideo: null,
  },
  mutations: {
    setVideoUrl(state, url) {
      state.videoUrl = url;
    },
    setMoocVideo(state, val) {
      state.moocVideo = val;
    },
  },
  actions: {},
};
