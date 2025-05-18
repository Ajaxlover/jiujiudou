<template>
  <el-container class="ebPressRecommend">
    <el-header>书目推荐</el-header>
    <el-main>
      <el-input size="small" v-model="name" placeholder="标题" style="width: 250px" @keyup.enter.native="loadList"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="loadList"></el-button>
      <el-button size="small" type="primary" @click="addNew" style="float:right;margin-bottom:10px;">新建</el-button>
      <el-table :data="list" v-loading="loading.list" stripe border :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="封面" align="center" prop="adCover" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.coverPic" style="width:60px;cursor:pointer" @click="showDetail(scope.row)">
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" prop="name"></el-table-column>
        <el-table-column label="出版社名称" align="center" prop="publishName"></el-table-column>
        <el-table-column label="类型" align="center" width="150">
          <template slot-scope="scope">{{scope.row.type==0?'所有':'教师'}}</template>
        </el-table-column>
        <el-table-column label="发布状态" align="center" width="150">
          <template slot-scope="scope">{{scope.row.status==1?'上架':'下架'}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" width="150">
          <template slot-scope="scope">{{formatTime(scope.row.created)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="书目链接" prop="bookStoreUrl">
            <el-input v-model="form.bookStoreUrl"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type">
              <el-option label="所有" value="0"></el-option>
              <el-option label="教师" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面图片" prop="coverPic">
            <div>
              <div class="cover" @click="cropperClick">
                <img :src="form.coverPic" alt="" style="width:224px;height:350px"/>
                <i class="el-icon-picture-outline"></i>
              </div>
              <div>图片尺寸 224*350，大小不得超过 1M</div>
            </div>
          </el-form-item>
          <el-form-item label="出版社名称">
            <el-input v-model="form.publishName"></el-input>
          </el-form-item>
          <el-form-item label="上架状态" prop="status">
            <el-select v-model="form.status">
              <el-option label="下架" value="0"></el-option>
              <el-option label="上架" value="1"></el-option>
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
.ebPressRecommend {
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
        id: 0,
        name: '',
        publishName: '',
        bookStoreUrl: '',
        coverPic: '',
        status: '0',
        type: '0'
      },
      rules: {
        name: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        bookStoreUrl: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        coverPic: [
          { required: true, message: '请添加封面', trigger: 'change' }
        ],
        publishName: [
          { required: true, message: '请输入出版社名称', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      dialogVisible: {
        addNew: false,
        showCropper: false
      },
      file: null,
      name: '',
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
        url: '/ebook/ebPressRecommend/list',
        data: {
          name: this.name,
          pageNo: this.listPage.page,
          pageSize: this.listPage.pageSize
        }
      }).then(res => {
        this.loading.list = false
        let ret = res.data
        if(ret.code == 200) {
          this.list = ret.data.records
          this.listPage.total = ret.data.total
        }
      }).catch(() => {
        this.loading.list = false
      })
    },
    // 新增
    addNew() {
      this.file = null
      this.form.id = null
      this.form.name = ''
      this.form.coverPic = ''
      this.form.bookStoreUrl = ''
      this.form.status = '0'
      this.form.type = '0'
      this.form.publishName = ''
      this.dialogVisible.addNew = true
      this.loading.editSureLoading = false
      if(this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate()
      }
    },
    // 编辑
    editClick(row) {
      this.file = null
      this.form.id = row.id
      this.form.name = row.name
      this.form.status = row.status + ''
      this.form.type = row.type + ''
      this.form.coverPic = row.coverPic
      this.form.bookStoreUrl = row.bookStoreUrl
      this.form.publishName = row.publishName
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
          fd.append('name', this.form.name)
          fd.append('bookStoreUrl', this.form.bookStoreUrl)
          if(this.file) {
            fd.append('file', this.file, this.file.name)
          }
          fd.append('status', this.form.status)
          fd.append('type', this.form.type)
          fd.append('publishName', this.form.publishName)
          let url = '/ebook/ebPressRecommend/insert'
          if(this.form.id) {
            fd.append('id', this.form.id)
            url = '/ebook/ebPressRecommend/update'
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
      window.open(row.bookStoreUrl)
    },
    // 删除
    deleteAd(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        axios.request({
          method: 'post',
          url: 'ebook/ebPressRecommend/delete',
          data: {
            id: row.id
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
        this.form.coverPic = URL.createObjectURL(this.file)
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

