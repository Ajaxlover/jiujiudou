<template>
  <span ref="mymath" class="mymath"></span>
</template>

<style>
  .mymath img {
    display: block;
    max-width: 180px;
    /* height: auto !important; */
  }
  .mymath p {
    margin: 0;
    display: inline-block;
    vertical-align:top;
  }
  .mymath .MathJax_CHTML{
    outline: 0 !important
  }
</style>

<script>
export default {
  name: 'Math',
  props: {
    data: String
  },
  watch: {
    data () {
      this.renderMathJax()
    }
  },
  mounted () {
    this.renderMathJax()
  },
  methods: {
    renderMathJax() {
      if (this.data === undefined || !this.data) {
        return
      }
      let reg = new RegExp('data-original', 'g')
      let temp = this.data.replace(reg, 'src')
      this.$refs.mymath.innerHTML = temp
      if (!window.MathJax) {
        return
      }
      window.MathJax.Hub.Config({
        messageStyle: "none", //不显示信息
        extensions: ["tex2jax.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
          inlineMath: [['$', '$'], ["\\(", "\\)"]],
          displayMath: [['$$', '$$'], ["\\[", "\\]"]],
          skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"], //避开某些标签
          ignoreClass: "comment-content",
          processEscapes: true
        },
        "HTML-CSS": {
          fonts: ["TeX"],
          styles: {'.MathJax_Display': {margin: 0}},
          // linebreaks: {automatic: true},
          scale: 85,
          availableFonts: ["STIX", "TeX"], //可选字体
          showMathMenu: false, //关闭右击菜单显示
          imageFont: null
        }
      })
      window.MathJax.Hub.Queue([
        'Typeset',
        window.MathJax.Hub,
        // this.$refs.mymath
      ])
    }
  }
}
</script>