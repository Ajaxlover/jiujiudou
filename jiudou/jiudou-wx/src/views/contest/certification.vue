<template>
  <div class="cer-resource">
    <Nav class="page-resource-nav"></Nav>
    <div @click="goView">
      <img :src="imgUrl" alt="" />
    </div>
  </div>
</template>

<script>
// import wxUtils from '@/utils/weixin'
// import { Toast } from 'vant'

import Nav from '@/components/certificationNav'
import { getCredentialDetail } from '@/api/credential'
import { ImagePreview } from 'vant'

export default {
  name: 'Certification',
  components: {
    Nav
  },
  data() {
    return {
      competeStuId: this.$route.query.competeStuId,
      tbId: this.$route.query.tbId,
      qrCode: this.$route.query.qrCode,
      list: [],
      imgUrl: '',
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 9999
    }
  },
  computed: {},
  mounted() {
    this.getListData()
  },
  methods: {
    getListData() {
      getCredentialDetail({
        competeStuId: this.competeStuId
      })
        .then(res => {
          this.imgUrl = res.data.certificateUrl
        })
        .catch(err => {
          console.error(err)
        })
    },
    goView() {
      if (this.imgUrl) {
        ImagePreview({
          images: [this.imgUrl],
          showIndex: false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cer-resource {
  // height: 1400px;
  width: 100%;
  background-color: #f4f4f4;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  img {
    width: 100%;
    margin-top: 20px;
  }
  .page-resource-nav {
    position: fixed;
    bottom: 30px;
  }
}
</style>
