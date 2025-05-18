<template>
  <!--  <h1>{{ count }}</h1>-->
  <!--  <div class="box" @click="handleChange"></div>-->
  <!--  <el-button type="primary">Primary</el-button>-->
  <!--  <New />-->
  <el-config-provider :locale="zhCn">
    <RouterView />
    <Footer />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TopHeader from "@/render/layout/navBar/TopHeader.vue";
import { useAppStore } from "@/render/store/modules/app";
import { useOpenByBrowser } from "@/render/hooks/useOpenByBrowser";
import { loginApi } from "@/render/api/login";
import { ipcRenderer } from "electron";
import Footer from "./render/views/footer/index.vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const appStore = useAppStore();
const { openByBrowser } = useOpenByBrowser();
// console.log(window.electronAPI)
onMounted(() => {
  // if (window.electronAPI && window.electronAPI.ipcRenderer) {
  //   window.electronAPI?.ipcRenderer?.on('local-ip', (event: any, data: any) => {
  //     console.log(event, data)
  //   })
  // }
})

// if(window.electronAPI.shortCut){
//   window.electronAPI.shortCut()
//   // console.log(ipcRenderer)
//   // ipcRenderer('on-shortcut-event',(event,data)=>{
//   //   console.log(data)
//   // })
// }

const handleChange = async () => {
  // const params={}
  // const res=await loginApi(params)
  // console.log(import.meta.env)
  // appStore.increment()
  //  wsCache.set('test','111')
  // const res= wsCache.get('test')
  //  console.log(res)
  //  const url='https://m.up678.com/'
  //  openByBrowser(url)
  // window.open('https://m.up678.com/','_blank')
  // console.log(window.electronAPI)
  // window.electronAPI.setTitle('1111')
  // document.body.className = 'dark';
  // document.documentElement.style.setProperty('--dark-bg-color','red')
};
</script>

<style lang="scss" scoped>
//h1{
//  color: red;
//}
.box {
  width: 200px;
  height: 200px;
  background: var(--dark-bg-color);
}

#app {
  position: relative;
}
</style>
