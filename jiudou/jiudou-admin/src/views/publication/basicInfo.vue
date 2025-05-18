<template>
  <div class="basicInfo">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="基本信息" name="first">
        <el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="120px">
          <el-form-item label="封面">
            <img v-if="basicForm.imageUrl" :src="basicForm.imageUrl" alt="" class="userPic" style="width:98px;height:135px;cursor: pointer;" @click="cropperClick">
            <img v-else src="@/assets/images/img_add.png" alt="" class="userPic" style="width:98px;height:135px;cursor: pointer;" @click="cropperClick">
          </el-form-item>
          <el-form-item label="书名" prop="tname">
            <el-input size="small" v-model="basicForm.tname" placeholder="请输入书名" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input size="small" v-model="basicForm.author" placeholder="请输入作者" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="书号" prop="num">
            <el-input size="small" v-model="basicForm.num" placeholder="请输入书号" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="出版社" prop="pubName">
            <el-input size="small" v-model="basicForm.pubName" placeholder="请输入出版社" autocomplete="off" style="width: 350px"></el-input>
            <span v-if="savePubName">
              <span style="color:#999999;margin-left:5px">上次输入：{{savePubName}}</span>
              <el-button type="primary" style="margin-left:15px;" size="small" @click="usSavePubName">使用</el-button>
            </span>
          </el-form-item>
          <el-form-item label="出版时间">
            <el-date-picker size="small" v-model="basicForm.pubDate" type="date" placeholder="选择日期" style="width: 350px" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item size="small" label="学科" prop="subjectId">
            <el-select v-model="basicForm.subjectId" placeholder="请选择" style="width: 350px">
              <el-option v-for="item in subject" :key="item.id" :label="item.sname" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="资源公开" prop="isOpen">
          <el-switch v-model="basicForm.isOpen"></el-switch>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="上架补充信息" name="second">
        <el-form :model="storeForm" ref="storeForm" label-width="120px">
          <el-form-item label="购买链接" prop="storeUrl">
            <el-input size="small" v-model="storeForm.storeUrl" placeholder="请输入购买链接" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="教材简介" prop="bookIntro">
            <textarea id="bookIntro" v-model="storeForm.bookIntro"></textarea>
          </el-form-item>
          <el-form-item label="教材目录" prop="catalogIntro">
            <textarea id="catalogIntro" v-model="storeForm.catalogIntro"></textarea>
          </el-form-item>
          <el-form-item label="作者简介" prop="authorIntro">
            <textarea id="authorIntro" v-model="storeForm.authorIntro"></textarea>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="其他出版信息(选填)" name="third">
        <el-form :model="pubForm" ref="pubForm" label-width="120px">
          <el-form-item label="面数" prop="pages">
            <el-input size="small" v-model="pubForm.pages" placeholder="请输入面数" :change="checkPages()" autocomplete="off" style="width: 350px"></el-input>
            <div class="inputTips">仅支持输入数字</div>
          </el-form-item>
          <el-form-item label="字数" prop="words">
            <el-input size="small" v-model="pubForm.words" placeholder="请输入字数" :change="checkWords()" autocomplete="off" style="width: 350px"></el-input>
            <div class="inputTips">仅支持输入数字</div>
          </el-form-item>
          <el-form-item label="版次" prop="edition">
            <el-input size="small" v-model="pubForm.edition" placeholder="请输入版次" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="成品尺寸" prop="format">
            <el-input size="small" v-model="pubForm.format" placeholder="请输入成品尺寸" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="印张" prop="printSheets">
            <el-input size="small" v-model="pubForm.printSheets" placeholder="请输入印张" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="CIP核字" prop="cip">
            <el-input size="small" v-model="pubForm.cip" placeholder="请输入CIP核字" autocomplete="off" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="定价" prop="price">
            ￥<el-input size="small" v-model="pubForm.price" placeholder="请输入定价" :change="checkPrice()" autocomplete="off" style="width: 350px"></el-input>
            <div class="inputTips">平台当前只提供人民币交易，价格单位为：元</div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="saveBookInfo">
      <el-button type="primary" @click="saveBookInfo" :loading="nextStepLoading">保存</el-button>
    </div>
    <el-dialog :visible.sync="showCropper" :modal-append-to-body="false" width="700px" :close-on-click-modal=false>
      <template slot="title">
        <div><div></div><div>封面裁图</div></div>
      </template>
      <cropper :src="exampleImageSrc" ref="cropper" @on-crop="handleCroped" :aspectRatio=75/106></cropper>
      <span slot="footer">
        <el-button size="small" type="primary" @click="toCropper" :loading="sureCropLoading">确定</el-button>
        <el-button size="small" @click="showCropper=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "@/libs/api.request"
import ckeditorConfig from '@/config/ckeditor_config.js'
import CKEDITOR from 'CKEDITOR'
import cropper from '@/components/cropper'
export default {
  components: {
    cropper
  },
  props: {
    textbookId: ''
  },
  data() {
    return {
      exampleImageSrc: '',
      showCropper: false,
      activeName: 'first',
      subject: [],
      basicForm: {
        tname: '',
        imageUrl: '',
        pubDate: '',
        num: '',
        author: '',
        pubName: '',
        subjectId: '',
        isOpen: true
      },
      basicRules: {
        tname: [
          { required: true, message: '请输入书名', trigger: 'blur' },
        ],
        num: [
          { required: true, message: '请输入书号', trigger: 'blur' },
        ],
        pubName: [
          { required: true, message: '请输入出版社', trigger: 'blur' },
        ],
        subjectId: [
          { required: true, message: '请选择所属学课', trigger: 'blur' },
        ],
      },
      storeForm: {
        storeUrl: ''
      },
      pubForm: {
        pages: '',
        words: '',
        edition: '',
        format: '',
        printSheets: '',
        cip: '',
        price: '',
      },
      file: '',
      bookId: '',
      sureCropLoading: false,
      nextStepLoading: false,
      savePubName: localStorage.getItem('savePubName')
    }
  },
  watch: {
    textbookId(value) {
      if (value && value != this.bookId) {
        this.bookId = value
        this.loadBookDetail()
      }
    }
  },
  methods: {
    loadSubject() {
      axios.request({
        method: 'post',
        url: '/subject/subject/listAll'
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.subject = ret.data
        }
      })
    },
    loadBookDetail() {
      if (CKEDITOR.instances['bookIntro']) {
        CKEDITOR.instances['bookIntro'].destroy()
      }
      if (CKEDITOR.instances['catalogIntro']) {
        CKEDITOR.instances['catalogIntro'].destroy()
      }
      if (CKEDITOR.instances['authorIntro']) {
        CKEDITOR.instances['authorIntro'].destroy()
      }
      axios.request({
        method: 'post',
        url: '/book/textbook/detail',
        data: {
          id: this.bookId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.basicForm.imageUrl = ret.data.cover_pic
          this.basicForm.tname = ret.data.tname
          this.basicForm.author = ret.data.author
          this.basicForm.num = ret.data.tb_num
          this.basicForm.pubName = ret.data.pubName
          this.basicForm.subjectId = ret.data.sid
          this.basicForm.isOpen = ret.data.isPublic == 1
          this.basicForm.pubDate = ret.data.pub_date
          this.storeForm.storeUrl = ret.data.bookStoreUrl
          CKEDITOR.replace('bookIntro', Object.assign(ckeditorConfig, {
            'height': '100%'
          }))
          CKEDITOR.replace('catalogIntro', Object.assign(ckeditorConfig, {
            'height': '100%'
          }))
          CKEDITOR.replace('authorIntro', Object.assign(ckeditorConfig, {
            'height': '100%'
          }))
          CKEDITOR.instances['bookIntro'].setData(ret.data.book_intro ? ret.data.book_intro : '')
          CKEDITOR.instances['catalogIntro'].setData(ret.data.bookCatalogIntro ? ret.data.bookCatalogIntro : '')
          CKEDITOR.instances['authorIntro'].setData(ret.data.author_introduction ? ret.data.author_introduction : '')
          this.pubForm.pages = ret.data.pages
          this.pubForm.words = ret.data.words
          this.pubForm.edition = ret.data.edition
          this.pubForm.format = ret.data.format
          this.pubForm.price = ret.data.price
          this.pubForm.printSheets = ret.data.printSheets
          this.pubForm.cip = ret.data.cip
        }
      })
    },
    saveBookInfo() {
      this.nextStepLoading = true
      this.$refs['basicForm'].validate((valid) => {
        if (valid) {
          localStorage.setItem('savePubName', this.basicForm.pubName)
          let fd = new FormData();
          let url = '/v1/textbook/addTextbookOrg'
          if(this.bookId) {
            fd.append('textbookId', this.bookId);
            url = '/v1/textbook/updateTextbookOrg'
          }
          if(this.file) {
            fd.append('file', this.file);
          }
          fd.append('tname', this.basicForm.tname);
          fd.append('author', this.basicForm.author);
          fd.append('tb_num', this.basicForm.num);
          fd.append('pubName', this.basicForm.pubName);
          fd.append('isPublic', this.basicForm.isOpen ? 1 : 0);
          if(this.basicForm.pubDate) {
            fd.append('pub_date', this.basicForm.pubDate);
          }
          fd.append('sid', this.basicForm.subjectId);
          if(this.storeForm.storeUrl) {
            fd.append('bookStoreUrl', this.storeForm.storeUrl)
          }
          fd.append('book_intro', CKEDITOR.instances.bookIntro.getData());
          fd.append('bookCatalogIntro', CKEDITOR.instances.catalogIntro.getData());
          fd.append('author_introduction', CKEDITOR.instances.authorIntro.getData());

          fd.append('edition', this.pubForm.edition);
          if(this.pubForm.pages) {
            fd.append('pages', this.pubForm.pages);
          }
          if(this.pubForm.words) {
            fd.append('words', this.pubForm.words);
          }
          fd.append('format', this.pubForm.format);
          if(this.pubForm.price) {
            fd.append('price', this.pubForm.price);
          }
          if(this.pubForm.cip) {
            fd.append('cip', this.pubForm.cip);
          }
          if(this.pubForm.printSheets) {
            fd.append('printSheets', this.pubForm.printSheets);
          }
          axios.request({
            method: 'post',
            url: url,
            data: fd
          }).then(res => {
            let ret = res.data
            setTimeout(() => {
              this.nextStepLoading = false
            }, 500)
            if (ret.code === 200) {
              this.savePubName = this.basicForm.pubName
              if(!this.bookId) {
                this.bookId = ret.data
                this.$emit('addSuccess', this.bookId)
              }else{
                this.$emit('saveSuccess', this.bookId)
              }
            }else{
              this.$message({
                type: 'warning',
                message: ret.msg
              })
            }
          })
        }else{
          this.nextStepLoading = false
          this.activeName = 'first'
        }
      })
    },
    usSavePubName() {
      this.basicForm.pubName = localStorage.getItem('savePubName')
    },
    cropperClick() {
      this.showCropper = true
      this.$nextTick(() => {
        this.$refs.cropper.clear();
      })
    },
     //父组件调用子组件裁剪方法
    toCropper() {
      this.sureCropLoading = true
      setTimeout(() => {
        this.$refs.cropper.crop()
      }, 100)
    },
    handleCroped (file) {
      if(file) {
        this.file = file
        this.basicForm.imageUrl = URL.createObjectURL(this.file)
        this.sureCropLoading = false
        this.showCropper = false
      }else{
        this.sureCropLoading = false
      }
    },
    checkPrice() {
      var price = '' + this.pubForm.price
      price = price
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
      if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
      }
      this.pubForm.price = price;
    },
    checkPages() {
      var price = '' + this.pubForm.pages
      price = price
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
      if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
      }
      this.pubForm.pages = price;
    },
    checkWords() {
      var price = '' + this.pubForm.words
      price = price
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
      if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
      }
      this.pubForm.words = price;
    }
  },
  beforeDestroy() {
    CKEDITOR.instances['bookIntro'].destroy()
    CKEDITOR.instances['catalogIntro'].destroy()
    CKEDITOR.instances['authorIntro'].destroy()
  },
  mounted() {
    this.loadSubject()
    CKEDITOR.replace('bookIntro', Object.assign(ckeditorConfig, {
    'height': '100%'
    }))
    CKEDITOR.replace('catalogIntro', Object.assign(ckeditorConfig, {
      'height': '100%'
    }))
    CKEDITOR.replace('authorIntro', Object.assign(ckeditorConfig, {
      'height': '100%'
    }))
  }
}
</script>
<style lang="scss">
.basicInfo{
  background: #ffffff;
  min-height: 680px;
  padding: 30px 80px;
  .sub-tabs {
    .el-tab-pane {
      padding-left: 100px;
      .el-form-item__content {
        padding-right: 180px;
      }
    }
  }
  .saveBookInfo{
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
}
</style>
