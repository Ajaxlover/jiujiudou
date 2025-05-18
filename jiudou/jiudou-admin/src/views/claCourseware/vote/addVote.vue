<template>
  <div>
    <el-container class="addvote">
      <!-- <el-header>
        <div>
          <span class="returnBtn" @click="goBack"
            ><i class="el-icon-back"></i>返回</span
          >
        </div>
        <div>投票</div>
      </el-header> -->
      <el-main>
        <div class="vote-main">
          <el-form ref="form" :model="form" center label-width="80px">
            <el-form-item>
              <el-input
                type="textarea"
                v-model="form.content"
                placeholder="请输入投票内容"
                maxlength="200"
                rows="10"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="form.radio">
                <el-radio :label="1">正确/错误</el-radio>
                <el-radio :label="2">赞同/反对</el-radio>
                <el-radio :label="3">自定义选项</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="form.radio === 3"
              v-for="(item, index) in inputList"
              :key="index"
            >
              <el-input
                v-model="item.content"
                placeholder="自定义选项..."
              ></el-input>
            </el-form-item>
            <el-form-item v-if="form.radio === 3">
              <el-button type="primary" icon="el-icon-plus" @click="add"
                >新增选项</el-button
              >
              <el-button
                type="primary"
                :disabled="inputList.length === 2"
                icon="el-icon-delete"
                @click="deleteInput"
                >删除选项</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <span style="color:#1c272e;">投票图片</span>
              <img
                v-if="form.votePic"
                :src="form.votePic"
                alt=""
                class="userPic"
                style="width:130px;height:71px;cursor: pointer;"
              />
              <img
                v-else
                src="@/assets/images/mukeCover.png"
                alt=""
                class="userPic"
                style="width:130px;height:71px;cursor: pointer;"
              />
              <div class="inputTips">大小不超过1M</div>
            </el-form-item> -->
            <el-form-item>
              <span style="color:#1c272e;">投票时长</span>
              <el-select
                v-model="form.selectTime"
                size="small"
                style="width:100px;margin-left:30px;"
              >
                <el-option label="3分钟" value="180"></el-option>
                <el-option label="5分钟" value="300"></el-option>
                <el-option label="10分钟" value="600"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-checkbox v-model="form.checked">匿名投票</el-checkbox>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="goVote">发起投票</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";

export default {
  data() {
    return {
      classId: this.$route.query.classId,
      form: {
        content: "",
        radio: 1, // 1--正确/错误 2--赞同/反对 3--自定义选项
        checked: false,
        selectTime: "",
        votePic: ""
      },
      inputList: [{ content: "" }, { content: "" }]
    };
  },
  mounted() {},
  methods: {
    checkContent(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].content.trim().length === 0) {
          return true;
        }
      }
    },
    // 新建投票
    goBack() {
      this.$router.back();
    },
    add() {
      this.inputList.push({ content: "" });
    },
    deleteInput() {
      this.inputList.pop();
    },
    async goVote() {
      let { content, radio, selectTime } = this.form;
      if (content.trim().length === 0) {
        this.$message({
          message: "投票内容不能为空",
          type: "warning"
        });
        return;
      }
      if (radio === 3 && this.checkContent(this.inputList)) {
        this.$message({
          message: "投票选项不能为空",
          type: "warning"
        });
        return;
      }
      if (selectTime === "") {
        this.$message({
          message: "请设置投票时间",
          type: "warning"
        });
        return;
      }
      let item = [];
      switch (this.form.radio) {
        case 1:
          item.push({ content: "正确" }, { content: "错误" });
          break;
        case 2:
          item.push({ content: "赞同" }, { content: "反对" });
          break;
        default:
          this.inputList.forEach(val => {
            item.push(val);
          });
          break;
      }
      let isCryptonym = 0;
      await axios
        .request({
          method: "post",
          url: "/clazz/vote/insert",
          data: {
            classId: this.classId,
            content,
            isCryptonym,
            status: "0",
            item: JSON.stringify(item),
            type: "0",
            validTime: selectTime
          }
        })
        .then(res => {
          let { code } = res.data;
          if (code === 200) {
            this.$message({
              message: "发起投票成功！",
              type: "success"
            });
            this.$router.back();
          }
        });
    }
  }
};
</script>

<style lang="scss">
.addvote {
  height: 100%;
  .el-header {
    background: rgba(13, 67, 118, 1);
    text-align: center;
    color: #fff;
    overflow: hidden;
    font-size: 15px;
    line-height: 60px;
    padding: 0 45px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 9999;
    top: 0;
    div:first-child {
      float: left;
      .returnBtn {
        color: #fff;
        border: 1px solid #979797;
        padding-top: 7px;
        padding-bottom: 7px;
        padding-left: 23px;
        padding-right: 23px;
        font-size: 14px;
        border-radius: 17px;
        margin-right: 12px;
        cursor: pointer;
        i {
          margin-right: 8px;
        }
      }
    }
    div:nth-child(2) {
      box-sizing: border-box;
      z-index: 0;
      position: absolute;
      left: 300px;
      right: 300px;
      font-size: 20px;
    }
    div:last-child {
      i {
        margin-right: 5px;
      }
      cursor: pointer;
      float: right;
    }
  }
  .el-main {
    margin-top: 0;
    .vote-main {
      width: 1200px;
      margin: 0 auto;
    }
  }
}
</style>
