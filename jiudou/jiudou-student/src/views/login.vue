<template>
  <div class="login">
    <el-row style="margin-bottom: 30px">
      <el-input v-model="phone" type="text" style="width: 400px" />
    </el-row>
    <el-row style="margin-bottom: 30px">
      <el-input v-model="password" type="text" style="width: 400px" />
    </el-row>
    <el-row>
      <el-button @click="toLogin" type="primary" plain>登录</el-button>
    </el-row>
    <!-- <div>
      <StuCatalog :data="catalogList"></StuCatalog>
    </div> -->
    <div class="container">
      <!-- <div class="list">
        <div class="cor">
          <p :key="item" v-for="item in 100">
            111111222222222222222222222222222222222222
          </p>
        </div>
      </div> -->
    </div>
    <!-- <Comment
      v-model="data"
      :user="currentUser"
      :before-submit="submit"
      :before-like="like"
      :before-delete="deleteComment"
      :upload-img="uploadImg"
      :props="props"
    /> -->
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */

// import Comment from "@/components/Comment"
import { EXAMPLE_DATA } from "../data"
// @ is an alias to /src
import axios from "@/libs/api.request"
// import store from "@/store";
// import StuCatalog from "@/components/Stu-Catalog.vue"

// eslint-disable-next-line no-unused-vars
import { setStuInfo, setStuToken, getStuInfo } from "@/libs/cookieUtil"

export default {
  name: "stu-login",
  components: {
    // StuCatalog,
    // Comment,
  },
  data() {
    const users = [
      {
        name: "Up&Up",
        avatar: require("../assets/image/avatar1.jpg"),
        author: true,
      },
      {
        name: "我叫白云",
        avatar: require("../assets/image/comment.png"),
      },
      {
        name: "我叫黑土",
        avatar: require("../assets/image/avatar3.jpg"),
      },
      {
        name: "NARUTO",
        avatar: require("../assets/image/avatar2.jpg"),
      },
    ]
    return {
      data: [],
      props: {
        id: "_id",
        content: "content",
        // imgSrc: "imgSrc",
        children: "childrenComments",
        likes: "likes",
        liked: "liked",
        reply: "reply",
        createAt: "createAt",
        user: "visitor",
      },
      currentUser: users[0],
      users,
      wrapStyle: "",
      phone: "",
      password: "",
      catalogList: [
        {
          catalogName: "第一章",
          catalog: [
            { catalogName: "1-1第一节", catalogIsFree: 1 },
            { catalogName: "1-2第二节", catalogIsFree: 1 },
            { catalogName: "1-3第三节", catalogIsFree: 0 },
          ],
        },
        {
          catalogName: "第2章",
          catalog: [
            { catalogName: "2-1第一节", catalogIsFree: 0 },
            { catalogName: "2-2第二节", catalogIsFree: 0 },
            { catalogName: "2-3第三节", catalogIsFree: 0 },
          ],
        },
      ],
    }
  },
  methods: {
    toLogin() {
      axios
        .request({
          method: "post",
          url: "https://tfapi.guangyiedu.com/liubingnan/v1/login",
          data: {
            username: this.phone,
            password: this.password,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            let data = ret.data
            if (data.user && data.user.type === 1) {
              setStuToken(data.token)
              setStuInfo(JSON.stringify(data.user))

              this.$router.push({
                name: "home",
              })
            } else {
              setStuToken(data.token)
              setStuInfo(JSON.stringify(data.user))
              // this.$store.commit("setStuToken", data.token) // 存储token
              this.$router.push({
                name: "home",
              })
            }
          } else {
            this.$message({
              type: "error",
              message: ret.msg,
            })
          }
        })
    },
    async submit(newComment, parent, add) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ newComment, parent })
        }, 300)
      })

      add(Object.assign(res.newComment, { _id: new Date().getTime() }))

      console.log("addComment: ", res)
    },

    async like(comment) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(comment)
        }, 0)
      })

      console.log("likeComment: ", res)
    },

    async uploadImg({ file, callback }) {
      const res = await new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {
          resolve(reader.result)
        }

        reader.onerror = () => {
          reject(reader.error)
        }
      })

      callback(res)
      console.log("uploadImg： ", res)
    },

    async deleteComment(comment, parent) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ comment, parent })
        }, 300)
      })

      console.log("deleteComment: ", res)
    },

    addData(times) {
      setTimeout(() => {
        this.data = new Array(times).fill(EXAMPLE_DATA).flat(Infinity)
      }, 0)
    },
  },
  created() {
    this.addData(1)
  },
  mounted() {
    // const header = this.$refs.header
    // this.wrapStyle = `height: calc(100vh - ${header.clientHeight + 20}px)`
    console.log(process.env.NODE_ENV)
  },
}
</script>
<style lang="less" scoped>
.login {
  margin-top: 200px;
  padding-left: 100px;
  .container {
    // width: 500px;
    height: 600px;
    // background-color: red;
    margin: 0 auto;
    // padding: 10px;
    // position: relative;
    .list {
      // width: 100%;
      // height: 100%;
      width: 800px;
      height: 600px;
      position: relative;
      overflow: hidden;
      .cor {
        height: 100px;
        width: 100%;
        position: absolute;
        overflow: scroll;
        overflow-x: hidden;
        // top: 0;
      }
    }
  }
}
</style>
