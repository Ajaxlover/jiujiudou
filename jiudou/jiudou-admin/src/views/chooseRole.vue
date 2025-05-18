<template>
  <div class="container">
    <!-- 头部区域 -->
    <header>
      <img src="@/assets/images/jdlogonew.png" alt="" />
    </header>
    <div class="contentBox">
      <div v-for="(item, index) in list" :key="index" @click="roleRoult(item)">
        <img
          v-if="item.roleType === 0"
          src="@/assets/images/role4.png"
          alt=""
        />
        <img
          v-if="item.roleType === 1"
          src="@/assets/images/role2.png"
          alt=""
        />
        <div>
          <div>{{ item.roleName }}</div>
          <div :title="item.pubName">{{ item.pubName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "@/store";
export default {
  data() {
    return {
      list: store.state.user.roles
    };
  },
  mounted() {
    if (this.list.length == 0) {
      this.$store.dispatch("logout").then(res => {
        this.$router.push({
          name: "login"
        });
      });
    } else {
      const isIframe = sessionStorage.getItem("iframeSrc");
      if (isIframe) {
        const _thisRole = this.list.filter(item => item.roleId === 24);
        store.commit("setCurrentRole", _thisRole);
        localStorage.setItem("currentRole", _thisRole.mrId);
        this.$router.push("/exam/examManage");
      }
    }
  },
  methods: {
    roleRoult(item) {
      store.commit("setCurrentRole", item);
      localStorage.setItem("currentRole", item.mrId);
      if (item.roleId === 24) {
        this.$router.push("/class/myClass");
      } else {
        this.$router.push({
          name: "index"
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  color: #ffffff;
  background: #0d4376;
  padding: 0 15px;
  img {
    float: left;
    width: 124px;
    height: 30px;
    margin-right: 15px;
    margin-top: 15px;
  }
}
.contentBox {
  width: 880px;
  margin: 56px auto;
  text-align: center;
}
.contentBox > div {
  background: #ffffff;
  border-radius: 8px;
  width: 270px;
  height: 170px;
  overflow: hidden;
  display: inline-block;
  padding: 47.5px 20px 47.5px 30px;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
  box-shadow: 5px 5px 5px #cdcfcf;
}
.contentBox > div img {
  width: 75px;
  float: left;
}
.contentBox > div > div {
  float: left;
  margin-left: 15px;
  padding: 10px 0;
  width: 126px;
}
.contentBox > div > div div:first {
  font-size: 20px;
  color: #1c1c1c;
}
.contentBox > div > div div:last-child {
  font-size: 14px;
  color: #3f3f3f;
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
