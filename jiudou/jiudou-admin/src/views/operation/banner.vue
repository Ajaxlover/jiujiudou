<template>
  <el-container class="banner">
    <el-header style="height:50px;">轮播管理</el-header>
    <el-main>
      <el-button size="small" type="primary" @click="addNewBanner" style="float:right;margin-bottom:10px;">新建</el-button>
      <el-table :data="list" v-loading="loading.list" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="图片" align="center" prop="bannerCover">
          <template slot-scope="scope">
            <img :src="scope.row.bannerCover" style="width:60px;cursor:pointer" @click="showBannerDetail(scope.row)">
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" prop="bannerName"></el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bannerType==2">教师端</span>
            <span v-else-if="scope.row.bannerType==3">学生PC端</span>
            <span v-else-if="scope.row.bannerType==4">竞赛</span>
            <span v-else>{{scope.row.bannerType==1?'云课':'资讯'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center" prop="bannerSort"></el-table-column>
        <el-table-column label="点击次数" align="center" prop="bannerClickNum"></el-table-column>
        <el-table-column label="发布状态" align="center" prop="bannerStatus">
          <template slot-scope="scope">{{scope.row.bannerStatus==1?'已发布':'未发布'}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="bannerAddTime">
          <template slot-scope="scope">{{formatTime(scope.row.bannerAddTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
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
    <jd-dialog title="添加banner信息" :visible.sync="dialogVisible.addNewBanner" :close_on_click_modal="false" 
      :loading="loading.editSureLoading" @sure="editSure">
      <template slot="body">
        <el-form :model="form" size="small" label-position="right" label-width="100px" ref="editBanner" :rules="rules" style="padding-left:40px;padding-right:100px;">
          <el-form-item label="标题" prop="bannerName">
            <el-input v-model="form.bannerName"></el-input>
          </el-form-item>
          <el-form-item label="内容类型" prop="bannerType">
            <el-select v-model="form.bannerType">
              <el-option label="资讯" value="0"></el-option>
              <el-option label="云课" value="1"></el-option>
              <el-option label="教师端" value="2"></el-option>
              <el-option label="学生PC端" value="3"></el-option>
              <el-option label="竞赛" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.bannerType==2" :label="form.bannerType=='2'?'链接地址':'链接地址'" prop="bannerUrl">
            <el-input v-model="form.bannerUrl"></el-input>
          </el-form-item>
          <el-form-item v-else :label="form.bannerType=='0'?'资讯地址':'云课编号'" prop="bannerUrl">
            <el-input v-model="form.bannerUrl"></el-input>
          </el-form-item>
          <el-form-item v-if="form.bannerType!='3'" label="封面图片" prop="bannerCover">
            <div>
              <div class="cover" @click="cropperClick">
                <img :src="form.bannerCover" alt="" style="width:349px;height:130px"/>
                <i class="el-icon-picture-outline"></i>
              </div>
              <div>图片尺寸 698*260，大小不得超过 1M</div>
            </div>
          </el-form-item>
          <el-form-item v-if="form.bannerType=='3'" label="轮播图" prop="bannerCover">
            <div>
              <div class="teacher-info">
             <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="true"
              :http-request="uploadSectionFile1"
              action=""
              :show-file-list="false"
            >
              <img v-if="form.bannerCover" :src="form.bannerCover" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
              </div>
              
              <div>图片尺寸 1400*200</div>
            </div>
          </el-form-item>
          <el-form-item label="banner排序">
            <el-input-number v-model="form.bannerSort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="form.bannerStatus">
              <el-option label="未发布" value="0"></el-option>
              <el-option label="已发布" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <jd-dialog title="封面截图" width="700px" :visible.sync="dialogVisible.showCropper" :close_on_click_modal="false" :loading="loading.sureCropLoading" @sure="toCropper">
      <template slot="body">
        <cropper ref="cropper" @on-crop="handleCroped" :aspectRatio=349/130></cropper>
      </template>
    </jd-dialog>
  </el-container>
</template>

<style lang="scss"> 
.banner {
  .teacher-info {
    width: 180px;
    // margin: 0 auto;
    // border: 1px dashed #d9d9d9;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 320px;
      height: 100%;
      display: block;
    }
  }
  .el-header {
    line-height: 50px;
    padding: 0 43px;
    background: #ffffff;
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
export default {
  components: {
    'jd-dialog': jdialog,
    cropper
  },
  data() {
    return {
      imgUrl: "",
      list: [],
      loading: {
        list: false,
        sureCropLoading: false,
        editSureLoading: false,
      },
      listPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      form: {
        bannerName: '',
        bannerType: '0',
        bannerUrl: '',
        bannerCover: '',
        bannerSort: 0,
        bannerStatus: '0'
      },
      rules: {
        bannerName: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        bannerUrl: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        bannerCover: [
          { required: true, message: '请添加封面', trigger: 'change' }
        ]
      },
      dialogVisible: {
        addNewBanner: false,
        showCropper: false
      },
      file: null,
    }
  },
  mounted() {
    this.loadBannerList()
  },
  methods: {
     uploadSectionFile1(params) {
      this.file = params.file;
      console.log(params.file)
      const form = new FormData();
      // 文件对象
      form.append("file", params.file);
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/openccourse/openDiscuss/uploadImage`,
          data: form,
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.form.bannerCover = ret.data;
          }
        });
    },
    loadBannerList() {
      this.loading.list = true;
      axios.request({
        method: 'post',
        url: '/v1/banner/selBannerPage',
        data: {
          pageNum: this.listPage.page,
          pagesize: this.listPage.pageSize
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
    // 新增
    addNewBanner() {
      this.file = null
      this.form.bannerId = null
      this.form.bannerName = ''
      this.form.bannerCover = ''
      this.form.bannerUrl = ''
      this.form.bannerType = '0'
      this.form.bannerStatus = '0'
      this.form.bannerSort = 0
      this.dialogVisible.addNewBanner = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
    },
    // 编辑
    editClick(row) {
      this.file = null
      this.form.bannerId = row.bannerId
      this.form.bannerName = row.bannerName
      this.form.bannerType = row.bannerType + ''
      if(row.bannerType == 1) {
        this.form.bannerUrl = row.bannerObjId
      } else {
        this.form.bannerUrl = row.bannerUrl
      }
      this.form.bannerCover = row.bannerCover
      this.form.bannerStatus = row.bannerStatus + ''
      this.form.bannerSort = row.bannerSort
      this.dialogVisible.addNewBanner = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
    },
    editSure() {
      this.$refs['editBanner'].validate((valid) => {
        if (valid) {
          this.loading.editSureLoading = true
          let fd = new FormData()
          fd.append('bannerName', this.form.bannerName)
          fd.append('bannerType', this.form.bannerType)
          if (this.form.bannerType == 0 || this.form.bannerType == 2 || this.form.bannerType == 3) {
            fd.append('bannerUrl', this.form.bannerUrl)
          } else {
            fd.append('objId', this.form.bannerUrl);
          }
          if(this.file) {
            fd.append('coverFile', this.file, this.file.name)
          }
          fd.append('bannerStatus', this.form.bannerStatus)
          fd.append('bannerSort', this.form.bannerSort)
          let url = '/v1/banner/insBanner'
          if(this.form.bannerId) {
            fd.append('bannerId', this.form.bannerId)
            url = 'v1/banner/updBanner'
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
    // 删除
    deleteBanner(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'v1/banner/updBanner',
          data: {
            'bannerId': row.bannerId,
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
    }
  }
}
</script>

