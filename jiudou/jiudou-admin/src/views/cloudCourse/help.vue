<template>
  <el-container class="bookHelp">
    <el-header height="50px">
      <span class="book" @click="toCloudCourse">我的云课</span>
      <i class="el-icon-arrow-right"></i> <span>云课帮助</span>
    </el-header>
    <el-main>
      <el-collapse accordion>
        <el-collapse-item title="1、谁可以创建云课？" name="1">
          <div>申请成为云课作者或认证为教师的用户可以创建云课</div>
          <div>申请途径：</div>
          <div style="margin-left:15px;">
            1、打开“九斗”后台（www.jiudou123.com），在页面中找到“申请开课”，提交申请后等待审核通知，审核通过后即可创建云课
          </div>
          <div style="margin-left:15px;">
            2、下载“九斗”APP，在“我的”-“认证为教师”或“申请开课”，提交申请后等待审核通知，审核通过后即可创建云课
          </div>
        </el-collapse-item>
        <el-collapse-item title="2、如何创建一门云课？" name="2">
          <div>
            1、登录“九斗”后台（www.jiudou123.com），找到并打开“云课”页面
          </div>
          <div>2、点击右上角的“新建云课”</div>
          <div>
            3、在新建云课页面输入课程基本信息、创建目录、上传或选择学习内容、输入课程更多信息
          </div>
          <div>4、点击新建云课页面底部的“发布”，等候审核</div>
          <div>
            5、审核通过后，云课即可在“九斗”APP的“云课”内查询、购买、学习
          </div>
        </el-collapse-item>
        <el-collapse-item title="3、云课支持哪些格式的学习内容？" name="3">
          <div>
            1、云课当前支持的学习内容有：视频、音频、图片、PDF、Word、PPT、Excel、TXT等
          </div>
          <div>2、云课支持测试任务，即将选择多个试题，组织成一个测试任务</div>
        </el-collapse-item>
        <el-collapse-item
          title="4、云课的课程目录是什么，云课支持哪些目录层级？"
          name="4"
        >
          <div>
            1、云课的课程目录指的是一个课程的组织结构，如第X章-第X节-第X课，模块X-第X讲，课时X
          </div>
          <div>2、云课可以支持多种目录层级,如:</div>
          <div style="margin-left:15px;">1个层级，在课程名称下直接上传内容</div>
          <div style="margin-left:15px;">
            2个层级，在课程名称下先创建子目录，在子目录下上传学习内容
          </div>
          <div style="margin-left:15px;">
            3个层级，在课程名称下先创建子目录，如“章”，再在“章”目录下再创建子目录，如“节”，在“节”目录下上传学习内容
          </div>
          <div>3、云课最多支持3个层级，如：章-节-课</div>
          <div>
            4、云课同时支持不同目录层级的混排，如：在章下既可以上传课时内容，也可以再创建节
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="5、为了创建一门云课，您可以提前准备以下内容"
          name="5"
        >
          <div>1、构思课程目录</div>
          <div>2、将课程学习内容，导入到“资源”-“我的资源”</div>
          <div>3、将测试任务试题，添加到“题库”-“我的题库”</div>
        </el-collapse-item>
        <el-collapse-item
          title="6、为了让更多人找到您的云课，您可以从以下方面入手"
          name="6"
        >
          <div>1、给云课起个贴切的课程名称</div>
          <div>
            2、设计一个与课程内容相关的图片作为封面，也可以将个人照片作为封面
          </div>
          <div>3、给课程选择正确的课程分类</div>
          <div>4、提炼一些关键字作为课程标签</div>
        </el-collapse-item>
        <el-collapse-item
          title="7、云课创建后，就可以直接在“九斗”APP里查询、购买、学习了吗？"
          name="7"
        >
          <div>
            1、每个云课都需要经过审核，审核通过后才能在“九斗”APP的“云课”里销售
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="8、云课的状态有哪些，分别代表什么含义？"
          name="8"
        >
          <div>1、未发布：新创建的云课，还未发布</div>
          <div>2、审核中：云课创建完成后，点击发布，云课会提交到平台审核</div>
          <div>3、发布失败：审核未通过，手机端不能查询、购买、使用</div>
          <div>4、发布成功：审核通过，手机端能查询、购买、使用</div>
          <div>
            5、修改内容审核中：已经发布成功的云课，云课作者修改云课部分内容后，再次点击“发布”，平台审核
          </div>
          <div>
            6、修改内容审核失败：已经发布成功的云课，修改后审核不通过。需要注意的是这只说明修改后的云课审核不通过，但是修改前的云课正常使用
          </div>
          <div>
            7、已下架：云课不能被查询、购买，但是已购买用户可以正常学习。下架由云课作者自主操作。
          </div>
          <div>
            8、已锁定：云课不能被查询、购买和学习。锁定由平台管理员操作。云课作者有义务及时修改被锁定的云课。
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="9、为什么我的云课修好后，在手机端没有更新？"
          name="9"
        >
          <div>
            1、修改后的云课，需要再次点击“发布”，等待审核。此时云课状态变为“修改内容审核中”
          </div>
          <div>
            2、如果云课状态变为“发布成功”则说明修改成同时会更新手机端内容；
          </div>
          <div>
            3、如果状态变为“修改内容审核失败”即代表修改后云课未通过审核，手机端不会更新云课内容。
          </div>
        </el-collapse-item>
        <el-collapse-item title="10、如何结算我的收益？" name="10">
          <div>1、登录“九斗”后台（www.jiudou123.com），找到“我的收益”</div>
          <div>2、查看“收益余额”，符合条件的用户可以点击“申请结算”</div>
          <div>3、申请后，平台会根据《云课服务协议》中规定进行结算。</div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toCloudCourse() {
      this.$router.push({
        path: "/cloudCourse/cloudCourse"
      });
    }
  }
};
</script>

<style lang="scss">
.bookHelp {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 30px;
    .el-collapse-item__header {
      color: #333333;
      font-size: 16px;
    }
    .el-collapse-item__content {
      padding-left: 25px;
      padding-top: 10px;
      div {
        margin: 8px 0;
      }
    }
  }
}
</style>
