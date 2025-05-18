<template>
  <div class="friendSearchContainer">
    <input
      ref="input"
      v-model.trim="bValue"
      :disabled="isDisable"
      placeholder="学校名称"
      class="smartInput"
      data-toggle="tooltip"
      @click="init"
      @keyup="search"
      @blur="blur"
      @input="input"
    />
    <!-- v-infinite-scroll="load" -->
    <ul v-show="searching" class="friendSearchList van-hairline--surround">
      <li v-if="filtered.length === 0" style="text-align: center">未查询到数据</li>
      <li
        v-for="(item, index) in filtered"
        v-else
        :key="item.id"
        ref="li"
        :class="{ smartliactive: item.isActive, hover: item.isHover }"
        @click.stop="clickOne(index)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div v-show="searching" class="friendSearchModal" @click="searching = false"></div>
  </div>
</template>

<script>
import { getAllSchool } from '@/api/home'

export default {
  props: {
    props: {
      type: Object,
      default: () => {}
    },
    code: {
      type: String,
      default: ''
    },
    isDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searching: false,
      requesting: false,
      timer: null,
      filtered: [],
      selected: {},
      focusIndex: 0,
      invalidData: '',
      qryData: {
        pageNo: 1,
        pageSize: 99999,
        addrName: ''
      },
      newVal: ''
    }
  },
  computed: {
    listLength() {
      return this.filtered.length
    },
    bValue: {
      get() {
        return this.code
      },
      set(newValue) {
        this.$emit('update:code', newValue)
        this.newVal = newValue
      }
    }
  },
  watch: {
    code: {
      deep: true,
      immediate: true, // 很重要，初始化就可以被监听
      handler(newVal) {
        this.newVal = newVal
      }
    }
  },
  mounted() {
    // 支持初始化参数值
    this.qryData.addrName = this.props.value || ''
  },
  methods: {
    load() {
      this.qryData.pageNo++
      this.query()
    },
    // 调整联想搜索面板的大小和位置
    init(e) {
      // this.searching = true
      // this.query()
    },
    input(e) {
      this.query()
    },
    // 失去焦点时关闭面板，主要是按下tab键切换时的作用，随之带来的是所有相关的事件都要清除该定时器
    blur() {
      // this.$emit('sync', { addrName: this.qryData.addrName })
      this.$emit('sync', { name: this.bValue })
    },
    // 在上下键索引后调整视口
    scrollViewport() {
      for (const i in this.filtered) {
        if (parseInt(i) === this.focusIndex) {
          this.$set(this.filtered[i], 'isHover', true)
        } else {
          this.$set(this.filtered[i], 'isHover', false)
        }
      }
    },
    // 联想搜索的主体功能函数，这里使用keydown是为了保证持续性的上下键能够保证执行
    search(e) {
      const preSearching = this.searching
      // 非搜索状态进行点击，则呼出面板
      if (!this.searching) {
        this.searching = true
      }

      e = e || window.event
      // 通过上下键和回车选择
      if (e.keyCode === 38) {
        this.focusIndex = (this.focusIndex - 1 + this.listLength) % this.listLength
        this.scrollViewport()
      } else if (e.keyCode === 40) {
        this.focusIndex = (this.focusIndex + 1 + this.listLength) % this.listLength
        this.scrollViewport()
      } else if (e.keyCode === 13) {
        if (preSearching && this.focusIndex < this.listLength) {
          this.selectOne(this.focusIndex)
        }
      } else {
        this.query()
      }
    },
    query() {
      if (this.requesting) {
        return
      }
      this.requesting = true
      getAllSchool({
        pageNo: '1',
        pageSize: '99999'
        // name: this.newVal
      })
        .then(res => {
          this.requesting = false
          if (res.code === 200) {
            this.filtered = res.data.records
            let filteredItems = []
            for (let index = 0; index < this.filtered.length; index++) {
              const element = this.filtered[index]
              if (element.name.indexOf(this.code) !== -1) {
                filteredItems.push(element)
              }
            }
            this.filtered = filteredItems
            if (this.filtered && this.filtered.length > 0) {
              this.$set(this.filtered[0], 'isHover', true)
            }
            for (const i in this.filtered) {
              if (this.selected.name === this.filtered[i].name) {
                this.$set(this.filtered[i], 'isActive', true)
              }
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    clickOne(index) {
      this.selectOne(index)
    },
    // 选择一个参数
    selectOne(index) {
      for (const i in this.filtered) {
        if (parseInt(i) === index) {
          this.$set(this.filtered[i], 'isActive', true)
          this.qryData.addrName = this.filtered[i].name
          this.selected = this.filtered[i]
          this.$emit('sync', this.filtered[i])
          this.$emit('update:code', this.filtered[i].name)
          this.focusIndex = index
        } else {
          this.$set(this.filtered[i], 'isActive', false)
        }
      }
      this.searching = false
    }
  }
}
</script>

<style>
input::placeholder {
  color: #c8c9cc;
}
input:disabled {
  color: #000;
  background-color: transparent;
  opacity: 1;
  -webkit-text-fill-color: #000;
}
.friendSearchContainer {
  width: 100%;
  position: relative;
}
.friendSearchList {
  width: 100%;
  padding: 6px 12px;
  overflow-y: scroll;
  max-height: 500px;
  background: #fff;
  z-index: 100;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  /* border: 1px solid #ccc; */
  position: absolute;
}
.smartInput {
  width: 100%;
  border: none;
}
.friendSearchList li {
  padding: 3px 12px;
  height: 80px;
  line-height: 80px;
}
/* .friendSearchList li:hover {
        background-color: #36bc7f;
        color: #fff;
    }
    .friendSearchList li.active {
      background: #337ab7;
      color: #fff;
    }
    .friendSearchList li.hover {
      background-color: #36bc7f;
      color: #fff;
    }
    .friendSearchList li.active:hover {
      background-color: #36bc7f;
    } */
.smartliactive {
  /* background: #10c4ee;
  color: #fff; */
}
.hover {
  /* background-color: #36bc7f; */
  /* color: #fff; */
}

.friendSearchModal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
}
</style>
