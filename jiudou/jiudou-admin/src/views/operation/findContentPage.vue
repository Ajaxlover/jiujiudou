<template>
  <el-container class="banner">
    <el-header style="height:50px;">
      <el-tabs v-model="typeTab" class="findManage" @tab-click="typeTabClick">
        <el-tab-pane label="发现管理" name="1">
        </el-tab-pane>
        <el-tab-pane label="活动管理" name="0">
        </el-tab-pane>
      </el-tabs>
    </el-header>
    
    <el-main>
      <label>栏目：</label>
      <el-select v-model="contentChannelId" size="small" style="width:150px;" @change="loadBannerList">
        <el-option label="全部" value=""></el-option>
         <el-option v-for="type in channeList" :key="type.channelId" :label="type.channelName" :value="type.channelId"></el-option>
      </el-select>
      <label>标题：</label>
      <el-input size="small" v-model="extTitle" placeholder="文章标题" style="width: 250px" @keyup.enter.native="loadBannerList"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="loadBannerList"></el-button>
      <el-button size="small" type="info" @click="channelManage" style="float:right;margin-bottom:10px;">栏目管理</el-button>
      <el-button size="small" type="primary" @click="addNewBanner" style="float:right;margin-bottom:10px;">新建文章</el-button>
      <el-table :data="list" v-loading="loading.list" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        
        <el-table-column label="文章标题" align="center" show-overflow-tooltip="">
          <template slot-scope="scope">
            {{scope.row.contentExt.extTitle}}
          </template>
        </el-table-column>
        <el-table-column label="栏目" align="center" width="180" show-overflow-tooltip="">
          <template slot-scope="scope">
            <span v-if="typeTab == 0">{{idChannelName(scope.row.contentChannelId)}}</span>
            <span v-else>{{scope.row.channel.channelName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问次数" align="center" prop="viewsTotal" width="100"></el-table-column>
        <el-table-column label="点赞次数" align="center" prop="upsTotal" width="100"></el-table-column>
        <el-table-column label="收藏次数" align="center" prop="collTotal" width="100"></el-table-column>
        <el-table-column label="评论条数" align="center" prop="commentsTotal" width="100" v-if="typeTab == 0" :key="0">
        </el-table-column>
        <el-table-column label="发布时间" align="center" width="150">

          <template slot-scope="scope">{{formatTime(scope.row.contentExt.extReleaseTime)}}</template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="150" v-if="typeTab == 0" :key="1">
          <template slot-scope="scope">{{formatTime(scope.row.contentExt.extModifyTime)}}</template>
        </el-table-column>
        <el-table-column label="发布状态" align="center" prop="bannerStatus" width="120">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if='scope.row.status==1'>已发布</el-tag>
            <span v-else>未发布</span>
            </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="publishContent(scope.row)">{{scope.row.status==1?'废除':'发布'}}</el-button>
            <el-button type="text" size="small" v-if="typeTab==0" @click="messageList(scope.row)">留言</el-button>
            <el-button type="text" size="small" @click="deleteBanner(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="list.length" class="right-footer-first">
          从{{(listPage.page-1)*listPage.pageSize+1}}到{{(listPage.page-1)*listPage.pageSize+list.length}}记录，共{{listPage.total}}条
        </div>
        <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
        <el-pagination
        layout="prev, pager, next, jumper"
        :total="listPage.total"
        :page-size="listPage.pageSize"
        :current-page.sync="listPage.page"
        background
        @current-change="loadBannerList"></el-pagination>
      </div>
    </el-main>
    <jd-dialog title="添加文章信息" :visible.sync="dialogVisible.addNewBanner" :close_on_click_modal="false" width="800px"
      :loading="loading.editSureLoading" @sure="editSure">
      <template slot="body">
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-form :model="form" size="small" label-position="right" label-width="100px" ref="editBanner" :rules="rules" style="padding-left:40px;padding-right:100px;">
          <el-form-item label="文章标题" prop="extTitle">
            <el-input v-model="form.extTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容地址">
            <el-input v-model="form.extOriginUrl"></el-input>
          </el-form-item>
          <el-form-item label="内容栏目" prop="contentChannelId" v-if="typeTab==1">
            <el-select v-model="form.contentChannelId" size="small" style="width:100%;">
              <el-option v-for="type in channeList" :key="type.channelId" :label="type.channelName" :value="type.channelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容栏目" prop="activityChannelId" v-if="typeTab==0">
            <el-select v-model="form.activityChannelId" multiple :multiple-limit="5" size="small" style="width:100%;">
              <el-option v-for="type in channeList" :key="type.channelId" :label="type.channelName" :value="type.channelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面图片" prop="bannerCover">
            <div>
              <div class="cover" @click="cropperClick">
                <img :src="form.bannerCover" alt="" style="width:330px;height:173px"/>
                <i class="el-icon-picture-outline"></i>
              </div>    
              <div>图片尺寸 660*346，大小不得超过 1M</div>
            </div>
          </el-form-item>
          <el-form-item label="文章作者">
            <el-input v-model="form.extAuthor"></el-input>
          </el-form-item>
          <el-form-item label="发布类型">
            <el-radio-group  v-model="form.extType">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="转载来源" v-if="form.extType == 1">
            <el-input v-model="form.extOrigin"></el-input>
          </el-form-item>
          
        </el-form>
          </el-tab-pane>
          <el-tab-pane label="正文" name="second">
            <textarea name="description" id="description" v-model="form.extContent"></textarea>
          </el-tab-pane>
        </el-tabs>
        
      </template>
    </jd-dialog>
    <jd-dialog title="封面截图" width="700px" :visible.sync="dialogVisible.showCropper" :close_on_click_modal="false" :loading="loading.sureCropLoading" @sure="toCropper">
      <template slot="body">
        <cropper ref="cropper" @on-crop="handleCroped" :aspectRatio=330/173></cropper>
      </template>
    </jd-dialog>
    <el-dialog  title="栏目管理" width="700px" :visible.sync="dialogVisible.channel" :loading="loading.channelLoading" :append-to-body="true">
        <el-button size="small" type="primary" @click="addChannel" style="float:right;margin-bottom:10px;">新建栏目</el-button>
        <el-table
          :data="channeList"
          border
          style="width: 100%">
          <el-table-column
          align="center"
            prop="channelName"
            label="栏目名称">
          </el-table-column>
          <el-table-column
          align="center"
            label="创建时间"
            width="200">
            <template slot-scope="scope">{{formatTime(scope.row.channelCreateTime)}}</template>
          </el-table-column>
         <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editChannel(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteChannel(scope.row,'one')">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
    </el-dialog>
    <el-dialog  title="评论列表" class="discussClass" width="1000px" :visible.sync="dialogVisible.message" :loading="loading.messageLoading" :append-to-body="true">
        <el-table
          :data="discussList"
          border
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          max-height="500"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-for="item in props.row.reply" :key="item.discussId" style="margin-top:10px">
                <span style="color:#999999">{{formatTime(item.discussCreateTime)}} {{item.discussMemberName}}：</span><span :style="{color:item.status==1?'#67c23a':'#333333'}">{{item.discussContent}}</span>
                <span style="display:inline-block;float:right"><el-link type="danger" @click="verifyDiscuss(item)">{{item.status==1?'隐藏 ':"显示 "}}</el-link>
                <el-link type="danger" @click="deleteDiscuss(item,props.row)"> 删除</el-link></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
            prop="discussContent"
            show-overflow-tooltip=""
            label="评论内容">
          </el-table-column>
          <el-table-column
          align="center"
            prop="discussMemberName"
            show-overflow-tooltip=""
            width="130"
            label="评论人">
          </el-table-column>
          <el-table-column
          align="center"
            label="评论时间"
            width="150">
            <template slot-scope="scope">{{formatTime(scope.row.discussCreateTime)}}</template>
          </el-table-column>
          <el-table-column
          align="center"
            label="评论条数"
            width="80">
            <template slot-scope="scope"><span v-if="scope.row.reply">{{scope.row.reply.length}}</span></template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" width="120">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if='scope.row.status==1'>显示</el-tag>
            <el-tag type="danger" size="small" v-if='scope.row.isRead!=1'>未读</el-tag>
            <el-tag type="success" size="small" v-else>已读</el-tag>
            <!-- <span v-else>隐藏</span> -->
            </template>
        </el-table-column>
         <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if='scope.row.isRead!=1' @click="isRead(scope.row)">已读</el-button>
            <el-button type="text" size="small" @click="verifyDiscuss(scope.row)">{{scope.row.status==1?'隐藏':"显示"}}</el-button>
            <el-button type="text" size="small" @click="sortDiscuss(scope.row)">置顶</el-button>
            <el-button type="text" size="small" @click="replyDiscuss(scope.row)">回复</el-button>
            <el-button type="text" size="small" @click="deleteDiscuss(scope.row,'one')">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <div class="tabelFooter">
        <div v-if="discussList.length" class="right-footer-first">
          从{{(discussPage.page-1)*discussPage.pageSize+1}}到{{(discussPage.page-1)*discussPage.pageSize+discussList.length}}记录，共{{discussPage.total}}条
        </div>
        <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
        <el-pagination
        layout="prev, pager, next, jumper"
        :total="discussPage.total"
        :page-size="discussPage.pageSize"
        :current-page.sync="discussPage.page"
        background
        @current-change="getMessageList"></el-pagination>
      </div>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.banner {
  .findManage{
    padding-top: 50px;
    height: 100%;
    .el-tabs__header{
      background-color: #ffffff;
      padding-right: 52px;
      width: 100%;
      position: fixed;
      top:60px;
      .el-tabs__item {
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-weight: 400;
        // color: #222222;
        position: relative;
      }
    }
    .el-tabs__content{
      max-height: 100%;
      overflow-y: auto;
    }
  }
  .el-header {
    line-height: 50px;
    background: #ffffff;
    z-index: 3;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px; 
    padding-right: 18px;
    padding-bottom: 12px;
  }
  .cover {
    background: #F3F4F5;
    width: 349px;
    height: 130px;
    line-height: 130px;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid #ccc;
  }
}
</style>
<script>
import axios from '@/libs/api.request'
import { format } from '@/utils/datetime'
import jdialog from '@/components/jdialog'
import cropper from '@/components/cropper'
import CKEDITOR from 'CKEDITOR'
import ckeditorConfig from '@/config/ckeditor_config_editor.js'
export default {
  components: {
    'jd-dialog': jdialog,
    cropper
  },
  data() {
    return {
      list: [],
      loading: {
        list: false,
        sureCropLoading: false,
        editSureLoading: false,
        channelLoading: false,
        messageLoading: false
      },
      listPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      discussPage: {
        page: 1,
        pageSize: 8,
        total: 0
      },
      form: {
        contentId: '',
        extId: '',
        extTitle: '',
        extAuthor: '0',
        extOriginUrl: '',
        contentChannelId: '',
        activityChannelId: [],
        extType: '',
        extOrigin: '',
        extContent: '',
        bannerUrl: '',
        bannerCover: '',
        bannerSort: 0,
        bannerStatus: '0'
      },
      rules: {
        extTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        extOriginUrl: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        bannerCover: [
          { required: true, message: '请添加封面', trigger: 'change' }
        ],
        contentChannelId: [
          { required: true, message: '请选择栏目', trigger: 'change' }
        ],
        activityChannelId: [
          { required: true, message: '请选择栏目', trigger: 'change' }
        ]
      },
      dialogVisible: {
        addNewBanner: false,
        showCropper: false,
        channel: false,
        message: false
      },
      file: null,
      activeName: 'first',
      contentChannelId: '',
      extTitle: '',
      channeList: [],
      typeTab: '1',
      discussList: [],
      rowData: {},
      expands: [],
      getRowKeys(row) {
          return row.discussId;
      },
    }
  },
  mounted() {
    this.loadBannerList()
    this.contentChannelList()
  },
  methods: {
    typeTabClick(tab, event) {
      this.extTitle = ''
      this.contentChannelId = ''
      this.listPage.page = 1
      this.listPage.pageSize = 10
      this.loadBannerList()
      this.contentChannelList()
    },
    loadBannerList() {
      this.list = []
      this.loading.list = true;
      let url = '/platform/content/contentList'
      if(this.typeTab == 1) {
        url = '/platform/content/contentList'
      }else {
        url = '/platform/content/activityList'
      }
      axios.request({
        method: 'post',
        url: url,
        data: {
          page: this.listPage.page,
          pagesize: this.listPage.pageSize,
          contentChannelId: this.contentChannelId,
          extTitle: this.extTitle
        }
      }).then(res => {
        this.loading.list = false
        let ret = res.data
        if(ret.code == 200) {
          this.list = ret.data.data
          this.listPage.total = ret.data.total
        }
      }).catch(() => {
        this.loading.list = false
      })
    },
    process2ckeditor(content) {
      if(content === undefined) return ''
      var imgReg = /<img.*?class=('|")lazy('|").*?(?:>|\/>)/gi;
      var srcReg = /data-original=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = content.match(imgReg);
      if(arr) {
        for(var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          if(src.length >= 2) {
            content = content.replace(arr[i], "<img src='" + src[1] + "' />");
          }
        }
      }
      content = content.replace("&/g", "&amp;");
      if(content.indexOf("math-tex") == -1) {
        content = content.replace(/(\$.*?\$)/g, function(match, p1) {
          return '<span class="math-tex">' + p1 + '</span>'
        })
      }
      return content;
    },
    // 新增
    addNewBanner() {
      this.activeName = 'first'
      this.file = null
      this.form.bannerId = null
      this.form.contentId = ''
      this.form.extTitle = ''
      this.form.bannerCover = ''
      this.form.extOriginUrl = ''
      this.form.extOrigin = ''
      this.form.extType = 0
      this.form.contentChannelId = ''
      this.form.activityChannelId = []
      this.form.extAuthor = ''
      this.form.extContent = ''
      this.dialogVisible.addNewBanner = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
      for (const name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy();
      }
      // var vm = this
      // this.$nextTick(function() {
      //   CKEDITOR.replace('description');
      //   CKEDITOR.instances['description'].setData(this.form.extContent);
      //   CKEDITOR.instances['description'].on('change', function(event) {
      //     vm.form.extContent = this.getData()
      //   })
      // })
      var vm = this
      // title
      this.$nextTick(function() {
        CKEDITOR.replace('description', Object.assign(ckeditorConfig, {
          height: 350
        }))
        CKEDITOR.instances['description'].setData(this.process2ckeditor(this.form.extContent));
        CKEDITOR.instances['description'].on('change', function(event) {
          vm.form.extContent = this.getData()
        })
      })
    },
    // 编辑
    editClick(row) {
      this.activeName = 'first'
      this.file = null
      this.form.contentId = row.contentId
      this.form.extId = row.contentExt.extId
      this.form.extTitle = row.contentExt.extTitle
      this.form.bannerCover = row.contentExt.extCoverImg
      this.form.extOriginUrl = row.contentExt.extOriginUrl
      this.form.extOrigin = row.contentExt.extOrigin
      this.form.extType = row.contentExt.extType
      this.form.activityChannelId = []
      if(this.typeTab == 0) {
        let arry = row.contentChannelId.split(',')
        for(let item of arry) {
          this.form.activityChannelId.push(Number(item))
        }
      }else {
        this.form.contentChannelId = Number(row.contentChannelId)
      }
      console.log(this.form.contentChannelId)
      this.form.extAuthor = row.contentExt.extAuthor
      if(row.contentExt.extContent != undefined) {
        this.form.extContent = row.contentExt.extContent
      }else {
        this.form.extContent = ''
      }
      this.form.bannerId = row.bannerId
      this.form.bannerName = row.bannerName
      this.form.bannerType = row.bannerType + ''
      if(row.bannerType == 1) {
        this.form.bannerUrl = row.bannerObjId
      } else {
        this.form.bannerUrl = row.bannerUrl
      }
      this.form.bannerStatus = row.bannerStatus + ''
      this.form.bannerSort = row.bannerSort
      this.dialogVisible.addNewBanner = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
      for (const name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy();
      }
      // var vm = this
      // this.$nextTick(function() {
      //   CKEDITOR.replace('description');
      //   CKEDITOR.instances['description'].setData(this.form.extContent);
      //   CKEDITOR.instances['description'].on('change', function(event) {
      //     vm.form.extContent = this.getData()
      //   })
      // })
      var vm = this
      // title
      this.$nextTick(function() {
        CKEDITOR.replace('description', Object.assign(ckeditorConfig, {
          height: 350
        }))
        CKEDITOR.instances['description'].setData(this.process2ckeditor(this.form.extContent));
        CKEDITOR.instances['description'].on('change', function(event) {
          vm.form.extContent = this.getData()
        })
      })
    },
    editSure() {
      this.$refs['editBanner'].validate((valid) => {
        if (valid) {
          this.loading.editSureLoading = true
          let fd = new FormData()
          fd.append('extTitle', this.form.extTitle)
          fd.append('extOriginUrl', this.form.extOriginUrl)
          // fd.append('file', this.form.bannerCover)
          if(this.typeTab == 0) {
            fd.append('contentChannelId', this.form.activityChannelId)
          }else {
            fd.append('contentChannelId', this.form.contentChannelId)
          }
          if(this.file) {
            fd.append('file', this.file, this.file.name)
          }
          fd.append('extAuthor', this.form.extAuthor)
          fd.append('extType', this.form.extType)
          fd.append('extOrigin', this.form.extOrigin)
          fd.append('extContent', this.form.extContent)
          fd.append('type', this.typeTab)
          let url = '/platform/content/createContent'
          if(this.form.contentId) {
            fd.append('contentId', this.form.contentId)
            fd.append('extId', this.form.extId)
            url = 'platform/content/alterContent'
          }
          axios.request({
            method: 'post',
            url: url,
            data: fd
          }).then(res => {
            this.loading.editSureLoading = false
            let ret = res.data
            if(ret.code == 200) {
              this.dialogVisible.addNewBanner = false
              this.loadBannerList()
            }
          }).catch(() => {
            this.loading.editSureLoading = false
          })
        }
      });
    },
    // 详情
    showBannerDetail(row) {
      if(row.bannerType == 0) {
        window.open(row.bannerUrl, "_blank")
      }else{
        if(row.bannerContentId) {
          this.$router.push({
            path: "/cloudCourse/courseDetail",
            query: {
              ccourseId: row.bannerContentId,
              type: 6
            }
          })
        }else{
          this.$message({
            type: 'success',
            message: '该云课不存在'
          })
        }
      }
    },
    //发布，废除
    publishContent(row) {
      let status = 0
      let text = '发布'
      if(row.status == 1) {
        status = 2
        text = '废除'
      }else {
        status = 1
        text = '发布'
      }
      this.$confirm('确定' + text + '此文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'platform/content/publishContent',
          data: {
            'contentId': row.contentId,
            'status': status
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.loadBannerList()
            this.$message({
              type: 'success',
              message: text + '成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    // 删除
    deleteBanner(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'platform/content/alterContent',
          data: {
            'contentId': row.contentId,
            'extId': row.contentExt.extId,
            'extDelFlag': 1,
            'delFlag': 1
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.loadBannerList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    cropperClick() {
      this.dialogVisible.showCropper = true
      this.$nextTick(() => {
        this.$refs.cropper.clear();
      })
    },
    //父组件调用子组件裁剪方法
    toCropper() {
      this.loading.sureCropLoading = true
      setTimeout(() => {
        if(this.$refs.cropper) {
          this.$refs.cropper.crop()
        }
      }, 100);
    },
    handleCroped (file) {
      if(file) {
        this.file = file
        this.form.bannerCover = URL.createObjectURL(this.file)
        this.loading.sureCropLoading = false
        this.dialogVisible.showCropper = false
      }else{
        this.loading.sureCropLoading = false
      }
    },
    formatTime(time) {
      if(time) {
        return format(time)
      }
      return ''
    },
    contentChannelList() {
      axios.request({
        method: 'post',
        url: '/platform/content/channeList',
        data: {
          type: this.typeTab
        }
      }).then(res => {
        this.channeList = res.data.data.data
      }).catch(() => {
      })
    },
    channelManage() {
      this.dialogVisible.channel = true
    },
    addChannel() {
      this.$prompt('请输入栏目名称', '', {
          confirmButtonText: '新增',
          cancelButtonText: '取消',
          inputPattern: /\s*\S+?/,
          inputErrorMessage: '栏目名称不能为空'
        }).then(({ value }) => {
          axios.request({
            method: 'post',
            url: 'platform/content/addChannel',
            data: {
              channelName: value,
              type: this.typeTab
            }
          }).then(res => {
            this.contentChannelList()
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '服务器异常，请稍后重试'
            })
          })
        }).catch(() => {
        });
    },
    // 编辑栏目
    editChannel(row) {
      this.$prompt('修改栏目名称', '', {
          confirmButtonText: '修改',
          cancelButtonText: '取消',
          inputPattern: /\s*\S+?/,
          inputValue: row.channelName,
          inputErrorMessage: '栏目名称不能为空'
        }).then(({ value }) => {
          axios.request({
            method: 'post',
            url: 'platform/content/alterChannelInfo',
            data: {
              channelName: value,
              type: this.typeTab,
              channelId: row.channelId
            }
          }).then(res => {
            this.contentChannelList()
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '服务器异常，请稍后重试'
            })
          })
        }).catch(() => {
        });
    },
    // 删除栏目
    deleteChannel(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'platform/content/alterChannelInfo',
          data: {
            'channelId': row.channelId,
            'channelDelFlag': 1
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.contentChannelList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    getMessageList() {
      axios.request({
        method: 'post',
        url: 'ccourse/v1/discuss/listReplyByPage',
        data: {
          cCourseUuid: this.rowData.contentId,
          page: this.discussPage.page,
          pageSize: this.discussPage.pageSize
        }
      }).then(res => {
        this.discussList = res.data.data.data
        this.discussPage.total = res.data.data.total
      }).catch(() => {
      })
    },
    messageList(row) {
      this.rowData = row
      this.getMessageList()
      this.dialogVisible.message = true
    },
    replyDiscuss(row) {
      this.$prompt('回复内容', '', {
          confirmButtonText: '回复',
          cancelButtonText: '取消',
          inputPattern: /\s*\S+?/,
          inputErrorMessage: '回复内容不能为空'
        }).then(({ value }) => {
          axios.request({
            method: 'post',
            url: 'v1/discuss/reply',
            data: {
              content: value,
              replyId: row.discussId,
              title: this.rowData.contentExt.extTitle
            }
          }).then(res => {
            this.getMessageList()
            this.$message({
              type: 'success',
              message: '回复成功'
            })
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: '服务器异常，请稍后重试'
            })
          })
        }).catch(() => {
        });
    },
    // 审核评论
    verifyDiscuss(row) {
      let status = 1
      let text = '显示'
      if(row.status == 1) {
        status = 0
        text = '隐藏'
      }
      this.$confirm('是否' + text + '该评论', '提示', {
        confirmButtonText: text,
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'v1/discuss/audit',
          data: {
            'discussId': row.discussId,
            'status': status
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            // row.status = status
            this.getMessageList()
            this.$message({
              type: 'success',
              message: text + '成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    // 已读
    isRead(row) {
      axios.request({
        method: 'post',
        url: 'v1/discuss/read',
        data: {
          'discussId': row.discussId,
          'status': 1
        }
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          this.getMessageList()
        } else {
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '服务器异常，请稍后重试'
        })
      })
    },
    // 置顶
    sortDiscuss(row) {
      this.$confirm('是否置顶此评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'v1/discuss/sort',
          data: {
            'discussId': row.discussId,
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.getMessageList()
            this.$message({
              type: 'success',
              message: '置顶成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    // 删除评论
    deleteDiscuss(row, value) {
      console.log(value)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'v1/discuss/remove',
          data: {
            'discussId': row.discussId,
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.getMessageList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '服务器异常，请稍后重试'
          })
        })
      }).catch(() => {
      })
    },
    // 栏目
    idChannelName(ids) {
      let text = []
      let arry = ids.split(',')
      for(let item of arry) {
        for(let value of this.channeList) {
          if(item == value.channelId) {
            text.push(value.channelName)
          }
        }
      }
      return text.join('，')
      // return 99
    }
  }
}
</script>

