<template>
  <div class="page-home">
    <div class="content">
      <van-tabs color="#10c4ee" v-model="active">
        <van-tab title-style='font-size: 18px;' v-for="item in classify" :key="item.id" :title="item.content" />
      </van-tabs>
      <van-grid :border="false" :column-num="2">
        <van-grid-item v-for="item in filteredData" :key="item.id" @click="clickItem(item)">
          <van-image radius="10" :src="item.cover" />
          <div class="item-title">{{ item.title }}</div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AR',
  data() {
    return {
      active: 0,
      classify: [
        {
          id: 1,
          content: '物理类'
        },
        {
          id: 2,
          content: '数学类'
        }
      ],
      listData: [
        // classify必须和classify对象的id对应
        {
          id: 1,
          title: '质点运动的描述',
          cover: require('@/assets/image/zhidianyundong.png'),
          url: 'http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/2760e5e41397757887894394309/v.f30.mp4',
          classify: 1
        },
        {
          id: 2,
          title: '杨氏双缝干涉',
          cover: require('@/assets/image/yangshishuangfengganshe.png'),
          url: 'http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/e7d56e631397757887893915553/v.f30.mp4',
          classify: 1
        },
        {
          id: 3,
          title: '示波器',
          cover: require('@/assets/image/shiboqi.png'),
          url: 'http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/27606a831397757887894393705/v.f30.mp4',
          classify: 1
        },
        {
          id: 4,
          title: '旋转曲面',
          cover: require('@/assets/image/xuanzhuanqumian.png'),
          url: 'http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/e7d606e81397757887893916809/v.f30.mp4',
          classify: 2
        },
        {
          id: 5,
          title: '线性方程组',
          cover: require('@/assets/image/xianxingfangchengzu.png'),
          url: 'http://1253402545.vod2.myqcloud.com/e1e48346vodtransgzp1253402545/8aed91841397757887949869040/v.f30.mp4',
          classify: 2
        }
      ],
      filteredData: []
    }
  },
  watch: {
    active: function (newValue, oldValue) {
      this.filteredDataMethod()
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.filteredDataMethod()
  },
  methods: {
    filteredDataMethod() {
      this.filteredData = []
      for (let index = 0; index < this.listData.length; index++) {
        const element = this.listData[index]
        if (element.classify == this.active + 1) {
          this.filteredData.push(element)
        }
      }
    },
    clickItem(item) {
      this.$router.push({
        path: '/arDetails',
        query: {
          videoTitle: item.title,
          videoUrl: item.url
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  height: 100vh;
  width: 100%;
  background-color: #fff;
  .content {
    .item-title {
      margin-top: 24px;
      font-size: 28px;
    }
  }
}
</style>
