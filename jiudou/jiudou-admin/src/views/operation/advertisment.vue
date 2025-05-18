<template>
  <el-container class="advertisment">
    <el-header>首页弹窗</el-header>
    <el-main>
      <el-button size="small" type="primary" @click="addNew" style="float:right;margin-bottom:10px;">新建</el-button>
      <el-table :data="list" v-loading="loading.list" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="图片" align="center" prop="adCover">
          <template slot-scope="scope">
            <img :src="scope.row.adCover" style="width:60px;cursor:pointer" @click="showDetail(scope.row)">
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" prop="adTitle"></el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.adType==2">云课</span>
            <span v-else-if="scope.row.adType==3">竞赛</span>
            <span v-else>资讯</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center" prop="adAdvanceSort"></el-table-column>
        <el-table-column label="点击次数" align="center" prop="adClickNum"></el-table-column>
        <el-table-column label="发布状态" align="center" prop="adStatus">
          <template slot-scope="scope">{{scope.row.adStatus==1?'已发布':'未发布'}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="adAddTime">
          <template slot-scope="scope">{{formatTime(scope.row.adAddTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteAd(scope.row)">删除</el-button>
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
        @current-change="loadList"></el-pagination>
      </div>
    </el-main>
    <jd-dialog title="添加弹窗信息" :visible.sync="dialogVisible.addNew" :close_on_click_modal="false" 
      :loading="loading.editSureLoading" @sure="editSure">
      <template slot="body">
        <el-form :model="form" size="small" label-position="right" label-width="100px" ref="editBanner" :rules="rules" style="padding-left:40px;padding-right:100px;">
          <el-form-item label="标题" prop="adTitle">
            <el-input v-model="form.adTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容类型" prop="adType">
            <el-select v-model="form.adType">
              <el-option label="资讯" value="1"></el-option>
              <el-option label="云课" value="2"></el-option>
              <el-option label="竞赛" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="form.adType==2?'云课编号':'资讯地址'" prop="adUrl">
            <el-input v-model="form.adUrl"></el-input>
          </el-form-item>
          <el-form-item label="封面图片" prop="adCover">
            <div>
              <div class="cover" @click="cropperClick">
                <img :src="form.adCover" alt="" style="width:224px;height:350px"/>
                <i class="el-icon-picture-outline"></i>
              </div>
              <div>图片尺寸 224*350，大小不得超过 1M</div>
            </div>
          </el-form-item>
          <el-form-item label="弹窗排序">
            <el-input-number v-model="form.adAdvanceSort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="form.adStatus">
              <el-option label="未发布" value="0"></el-option>
              <el-option label="已发布" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <jd-dialog title="封面截图" width="700px" :visible.sync="dialogVisible.showCropper" :close_on_click_modal="false" :loading="loading.sureCropLoading" @sure="toCropper">
      <template slot="body">
        <cropper ref="cropper" @on-crop="handleCroped" :aspectRatio=224/350></cropper>
      </template>
    </jd-dialog>
  </el-container>
</template>

<style lang="scss">
.advertisment {
  .el-header {
    height:50px;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
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
    width: 224px;
    height: 350px;
    line-height: 350px;
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
        adTitle: '',
        adType: '1',
        adUrl: '',
        adCover: '',
        adAdvanceSort: 0,
        adStatus: '0'
      },
      rules: {
        adTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        adUrl: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        adCover: [
          { required: true, message: '请添加封面', trigger: 'change' }
        ]
      },
      dialogVisible: {
        addNew: false,
        showCropper: false
      },
      file: null,
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    loadList() {
      this.loading.list = true;
      axios.request({
        method: 'post',
        url: '/v1/advertise/selAdverPage',
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
    addNew() {
      this.file = null
      this.form.adId = null
      this.form.adTitle = ''
      this.form.adCover = ''
      this.form.adUrl = ''
      this.form.adType = '1'
      this.form.adStatus = '0'
      this.form.adAdvanceSort = 0
      this.dialogVisible.addNew = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
    },
    // 编辑
    editClick(row) {
      this.file = null
      this.form.adId = row.adId
      this.form.adTitle = row.adTitle
      this.form.adType = row.adType + ''
      if(row.adType == 2) {
        this.form.adUrl = row.adObjId
      } else {
        this.form.adUrl = row.adUrl
      }
      this.form.adCover = row.adCover
      this.form.adStatus = row.adStatus + ''
      this.form.adAdvanceSort = row.adAdvanceSort
      this.dialogVisible.addNew = true
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
          fd.append('adTitle', this.form.adTitle)
          fd.append('adType', this.form.adType)
          if (this.form.adType == 2) {
            fd.append('adObjId', this.form.adUrl);
          } else {
            fd.append('adUrl', this.form.adUrl)
          }
          if(this.file) {
            fd.append('file', this.file, this.file.name)
          }
          fd.append('adStatus', this.form.adStatus)
          fd.append('adAdvanceSort', this.form.adAdvanceSort)
          let url = '/v1/advertise/insAdver'
          if(this.form.adId) {
            fd.append('adId', this.form.adId)
            url = '/v1/advertise/updAdver'
          }
          axios.request({
            method: 'post',
            url: url,
            data: fd
          }).then(res => {
            this.loading.editSureLoading = false
            let ret = res.data
            if(ret.code == 200) {
              this.dialogVisible.addNew = false
              this.loadList()
            }
          }).catch(() => {
            this.loading.editSureLoading = false
          })
        }
      });
    },
    // 详情
    showDetail(row) {
      if(row.adType == 1) {
        window.open(row.adUrl, "_blank")
      }else{
        if(row.adContentId) {
          this.$router.push({
            path: "/cloudCourse/courseDetail",
            query: {
              ccourseId: row.adContentId,
              type: 7
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
    deleteAd(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'v1/advertise/updAdver',
          data: {
            'adId': row.adId,
            'adDelFlag': 1
          }
        }).then(res => {
          let ret = res.data
          if(ret.code == 200) {
            this.loadList()
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
        this.form.adCover = URL.createObjectURL(this.file)
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

