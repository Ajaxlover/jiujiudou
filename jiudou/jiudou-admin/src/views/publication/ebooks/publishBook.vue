<template>
  <el-container class="book">
    <el-header style="height: 50px">
      <span>数字教材上下架</span>
      <span
        v-if="todoNum > 0"
        style="border:1px solid #e6a23c;font-size:14px;padding:6px;border-radius:15px;color:#e6a23c"
        >{{ todoNum }}项待处理</span
      >
      <!-- <div @click="bookHelp">电子书管理帮助</div> -->
    </el-header>
    <el-main>
      <div class="top">
        <el-input
          size="small"
          v-model="searchForm.keyWord"
          placeholder="搜索书名、作者、书号"
          style="width: 320px"
          @keyup.enter.native="enterKeyUp"
        ></el-input>
        <span style="color:#666;font-size:14px">出版规划</span>
        <el-select
          v-model="searchForm.pubPlan"
          size="small"
          @change="enterKeyUp"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="校本资源" value="1"></el-option>
          <el-option label="出版教材" value="2"></el-option>
        </el-select>
        <span style="color:#666;font-size:14px">状态</span>
        <el-select
          v-model="searchForm.status"
          size="small"
          @change="enterKeyUp"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="待处理" value="1"></el-option>
          <el-option label="已处理" value="2"></el-option>
        </el-select>

        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="loadData"
        ></el-button>
        <div class="operateBtn"></div>
      </div>
      <div class="main">
        <el-table
          :data="textbookData"
          border
          :row-style="{ height: '140px' }"
          v-loading="loading"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="300"
          >
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  style="cursor: pointer;"
                  v-if="scope.row.coverPic"
                  :src="scope.row.coverPic"
                  class="userPic"
                />
                <div v-else class="userPicPlachoder" style="cursor: pointer;">
                  <img src="@/assets/images/logoPlacehoder.png" />
                </div>
              </div>
              <div class="right">
                <div class="name">
                  {{ scope.row.tname }}
                  <!-- <span v-if="scope.row.bookAdded == 0">上架</span> -->
                </div>
                <div class="num">书号: {{ scope.row.tbNum }}</div>
                <div class="author">作者: {{ scope.row.author }}</div>
                <!-- <div class="otherRes">
                  <span v-for="item in scope.row.label" :key="item">{{
                    item
                  }}</span>
                </div> -->
              </div>
            </div>
          </el-table-column>
          <el-table-column label="申请人" align="center">
            <div slot-scope="scope" v-if="scope.row.submitUserName">
              {{ scope.row.submitUserName }}({{ scope.row.submitMobile }})
            </div>
          </el-table-column>
          <!-- <el-table-column label="申请人手机号" align="center">
            <div slot-scope="scope" v-if="scope.row.submitMobile">
              {{ scope.row.submitMobile }}
            </div>
          </el-table-column> -->
          <el-table-column label="申请时间" align="center">
            <template slot-scope="scope">
              <div>{{ dateFormat(scope.row.applyForTime) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="出版规划" align="center">
            <div slot-scope="scope">
              <span v-if="scope.row.planType == 1">校本资源</span>
              <span v-else>出版教材</span>
            </div>
          </el-table-column>
          <el-table-column label="编辑方式" align="center">
            <div slot-scope="scope">
              <span v-if="scope.row.editType == 1">Epub编辑</span>
              <span v-else>新型数字教材编辑</span>
            </div>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <div slot-scope="scope">
              <el-tag size="small" v-if="scope.row.status == 2" type="warning"
                >待处理</el-tag
              >
              <el-tag size="small" v-if="scope.row.status == 4" type="success"
                >已上架</el-tag
              >
              <el-tag size="small" v-if="scope.row.status == 5" type="danger"
                >已下架</el-tag
              >
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button
                v-if="scope.row.status == 2 || scope.row.status == 5"
                type="text"
                size="small"
                @click="toOnShelf(scope.row, true)"
                >上架</el-button
              >
              <el-button
                @click="toOnShelf(scope.row, false)"
                v-if="scope.row.status == 4"
                type="text"
                size="small"
                >下架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.textbookData.length
            }}
            记录，共 {{ page.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :total="page.total"
            :current-page.sync="page.currentPage"
            :page-size="page.pagesize"
            @current-change="loadData"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <!-- 备注-->
    <el-dialog
      :visible.sync="reMarkShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>备注</div>
        </div>
      </template>
      <div>
        <div style="margin-bottom:15px;font-size:16px">版本号：111</div>
        <div style="margin-bottom:15px;font-size:16px">投稿时间：222</div>
        <div style="margin-bottom:15px;font-size:16px">转入编辑时间：333</div>
        <div style="margin-bottom:15px;font-size:16px">投稿备注：4444</div>
      </div>

      <span slot="footer">
        <!-- <el-button size="small" type="primary">确认</el-button> -->
        <!-- <el-button size="small" @click="isAddShow = false">取消</el-button> -->
      </span>
    </el-dialog>
    <!-- 退稿 -->
    <el-dialog
      :visible.sync="reBackShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>退稿</div>
        </div>
      </template>
      <div>
        <div>
          退稿章
        </div>
        <div style="display:flex">
          <div style="margin-right:15px">退稿说明</div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入退稿说明"
            v-model="backIntro"
            style="width:500px"
            resize="none"
          >
          </el-input>
        </div>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doQuitBack"
          >确认</el-button
        >
        <!-- <el-button size="small" @click="isAddShow = false">取消</el-button> -->
      </span>
    </el-dialog>
    <!-- 转入编辑 -->
    <el-dialog
      :visible.sync="transEditShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="add-digital-book"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>转入编辑</div>
        </div>
      </template>
      <div>
        <el-form
          :model="addForm"
          ref="addForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="封面" prop="cover">
            <div style="display:flex">
              <el-upload
                :multiple="false"
                :with-credentials="true"
                class="cover-uploader"
                action=""
                :auto-upload="true"
                :http-request="uploadSectionFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="addForm.cover"
                  :src="addForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(addForm.cover)"
                  v-if="addForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="学科">
            <el-select
              v-model="addForm.subjectType"
              style="width:140px;"
              size="small"
            >
              <el-option
                v-for="item in editTypeList"
                :key="item.id"
                :label="item.sname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="书名">
            <el-input
              style="width:300px"
              v-model.trim="addForm.name"
              size="small"
              placeholder="请输入书名"
            ></el-input>
          </el-form-item>
          <el-form-item label="书号">
            <el-input
              style="width:300px"
              v-model.trim="addForm.num"
              size="small"
              placeholder="请输入书号"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input
              style="width:300px"
              v-model.trim="addForm.author"
              size="small"
              placeholder="请输入作者"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input
              style="width:300px"
              v-model.trim="addForm.pubName"
              size="small"
              placeholder="请输入出版社"
            ></el-input>
            <span v-if="savePubName">
              <span style="color:#999999;margin-left:5px"
                >上次输入：{{ savePubName }}</span
              >
              <el-button
                type="primary"
                style="margin-left:15px;"
                size="small"
                @click="usSavePubName"
                >使用</el-button
              >
            </span>
          </el-form-item>

          <el-form-item label="出版规划" prop="title">
            <el-select
              v-model="addForm.pubPlan"
              size="small"
              style="width:200px;"
            >
              <el-option label="校本资源" value="1"></el-option>
              <el-option label="出版教材" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑方式" prop="title">
            <el-select
              disabled
              v-model="addForm.editType"
              size="small"
              style="width:200px;"
            >
              <el-option label="新型数字教材编辑" value="1"></el-option>
              <el-option label="传统Epub编辑方式" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="toEditor"
          >转入编辑</el-button
        >
        <!-- <el-button size="small" @click="isAddShow = false">取消</el-button> -->
      </span>
    </el-dialog>

    <!-- 投稿记录 -->
    <el-dialog
      :visible.sync="reBackListShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>投稿记录</div>
        </div>
      </template>
      <div>
        <el-table
          :data="reBackList"
          border
          :row-style="{ height: '50px' }"
          max-height="400"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column prop="tname" label="版本号" align="center">
          </el-table-column>
          <el-table-column prop="tbNum" label="投稿时间" align="center">
          </el-table-column>
          <el-table-column prop="author" label="内容章" align="center">
          </el-table-column>
          <!-- <el-table-column prop="uid" label="创建者" align="center" width="170">
              <template slot-scope="scope" v-if="scope.row.uid">
                {{scope.row.created}}({{scope.row.creatorMobile}})
              </template>
            </el-table-column> -->
          <el-table-column
            prop="pubDate"
            label="转入编辑时间"
            align="center"
          ></el-table-column>
        </el-table>
      </div>

      <span slot="footer">
        <!-- <el-button size="small" type="primary">转入编辑</el-button> -->
        <!-- <el-button size="small" @click="isAddShow = false">取消</el-button> -->
      </span>
    </el-dialog>
    <!-- 新建教材 -->
    <el-dialog
      :visible.sync="isAddShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="add-digital-book"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建数字教材</div>
        </div>
      </template>
      <div>
        <el-form
          :model="addForm"
          ref="addForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="封面" prop="cover">
            <div style="display:flex">
              <el-upload
                :multiple="false"
                :with-credentials="true"
                class="cover-uploader"
                action=""
                :auto-upload="true"
                :http-request="uploadSectionFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="addForm.cover"
                  :src="addForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(addForm.cover)"
                  v-if="addForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="学科">
            <el-select
              v-model="addForm.subjectType"
              style="width:140px;"
              size="small"
            >
              <el-option
                v-for="item in editTypeList"
                :key="item.id"
                :label="item.sname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="书名">
            <el-input
              style="width:300px"
              v-model.trim="addForm.name"
              size="small"
              placeholder="请输入书名"
            ></el-input>
          </el-form-item>
          <el-form-item label="书号">
            <el-input
              style="width:300px"
              v-model.trim="addForm.num"
              size="small"
              placeholder="请输入书号"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input
              style="width:300px"
              v-model.trim="addForm.author"
              size="small"
              placeholder="请输入作者"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input
              style="width:300px"
              v-model.trim="addForm.pubName"
              size="small"
              placeholder="请输入出版社"
            ></el-input>
            <span v-if="savePubName">
              <span style="color:#999999;margin-left:5px"
                >上次输入：{{ savePubName }}</span
              >
              <el-button
                type="primary"
                style="margin-left:15px;"
                size="small"
                @click="usSavePubName"
                >使用</el-button
              >
            </span>
          </el-form-item>

          <el-form-item label="出版规划" prop="title">
            <el-select
              v-model="addForm.pubPlan"
              size="small"
              style="width:200px;"
            >
              <el-option label="校本资源" value="1"></el-option>
              <el-option label="出版教材" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑方式" prop="title">
            <el-select
              v-model="addForm.editType"
              size="small"
              style="width:200px;"
            >
              <el-option label="新型数字教材编辑" value="1"></el-option>
              <el-option label="传统Epub编辑方式" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary">创建</el-button>
        <el-button size="small" @click="isAddShow = false">取消</el-button>
      </span>
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false;
        }
      "
      :url-list="imgList"
    />
    <!-- 转让 -->
    <el-dialog
      :visible.sync="isTransferShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>转让</div>
        </div>
      </template>
      <span style="padding-left:75px">选择成员：</span>
      <div style="margin-top: 20px">
        <el-radio-group
          size="small"
          v-model="selectedMember"
          style="text-align:center;display: inherit;"
        >
          <el-radio
            border
            :label="item.uid"
            v-for="item in member"
            :key="item.uid"
            style="margin-right:10px;margin-left:0;margin-bottom:15px;text-align:left;min-width:400px;"
          >
            {{ item.username }}({{ item.mobile }})</el-radio
          >
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doTransfer"
          >确定</el-button
        >
        <el-button size="small" @click="isTransferShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
export default {
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer")
  },
  data() {
    return {
      todoNum: 0, // 待处理项
      backIntro: "", // 退稿说明
      savePubName: localStorage.getItem("savePubName"),
      editTypeList: [],
      showViewer: false,
      imgList: [],
      isAddShow: false,
      transEditShow: false,
      reBackShow: false,
      reMarkShow: false,
      reBackListShow: false,
      reBackList: [], // 投稿记录
      addForm: {
        name: "",
        num: "",
        author: "",
        pubName: "",
        subjectType: 16,
        pubPlan: "1",
        editType: "2",
        cover: "",
        coverObj: null
      },
      uid: this.$store.state.user.userId,
      isTransferShow: false,
      lockBook: false,
      bookAdded: false,
      searchForm: {
        keyWord: "",
        pubPlan: "",
        pubType: "",
        status: ""
      },
      loading: false,
      textbookData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      member: [],
      selectedMember: 0,
      currentTextbookId: "",
      currentDtBook: {}
    };
  },
  methods: {
    toOnShelf(row, flag) {
      let str = "是否确定上架？上架后，用户可在九斗App购买该数字教材";
      if (!flag) {
        str = "是否确定下架？下架后，书城中数字教材不可见，仅已购买用户可查看";
      }
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/progress/shelves",
              data: {
                progressId: row.progressId,
                shelvesFlag: flag
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                this.getTodoNum();
                this.loadData();
                this.$message({
                  type: "success",
                  message: `${flag ? "上架成功" : "下架成功"}`
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    getTodoNum() {
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/queryShelvesUnHandleCount",
          data: {
            pubId: this.$store.state.user.currentRole.pubId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.todoNum = ret.data;
          } else {
          }
        });
    },
    doQuitBack() {
      let data = {};
      data.progressId = this.currentDtBook.progressId;
      data.editorUid = this.$store.state.user.userId;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/rejectionContribution",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.reBackShow = false;
            this.$message({
              type: "success",
              message: "退稿成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 转入编辑
    toEditor() {
      if (!this.addForm.cover) {
        this.$message({
          type: "warning",
          message: "请上传封面"
        });
        return;
      }
      if (!this.addForm.name) {
        this.$message({
          type: "warning",
          message: "请填写书名"
        });
        return;
      }
      if (!this.addForm.pubName) {
        this.$message({
          type: "warning",
          message: "请填写出版社"
        });
        return;
      }
      let data = {};
      data.progressId = this.currentDtBook.progressId;
      data.editorUid = this.$store.state.user.userId;
      data.coverPic = this.addForm.cover;
      data.tname = this.addForm.name;
      data.tbNum = this.addForm.num;
      data.author = this.addForm.author;
      data.sid = this.addForm.subjectType;
      data.pubId = this.$store.state.user.currentRole.pubId;
      data.publishName = this.addForm.pubName;
      data.planType = this.addForm.pubPlan;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/startEditing",
          data
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.transEditShow = false;
            this.loadData();
            this.$message({
              type: "success",
              message: "转入编辑成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getCourseTypeList() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listWithCount",
          data: {
            page: 1,
            pagesize: 50
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let temp = [];
            temp = ret.data.data.sort((a, b) => a.id - b.id);
            this.editTypeList = [...temp];
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    // 上传图片
    uploadSectionFile(params) {
      this.addForm.cover = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.addForm.cover = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "图片上传失败"
                  });
                }
              });
          }
        });
    },
    viewImg(url) {
      this.imgList = [url];
      this.showViewer = true;
    },
    dateFormat(row) {
      return formatSS(row);
    },
    usSavePubName() {
      this.addForm.pubName = localStorage.getItem("savePubName");
    },
    loadData() {
      this.loading = true;
      let params = {};
      params.pubId = this.$store.state.user.currentRole.pubId;
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pagesize;
      if (this.searchForm.keyWord) {
        params.keyWord = this.searchForm.keyWord;
      }
      if (this.searchForm.pubPlan) {
        params.planType = this.searchForm.pubPlan;
      }
      if (this.searchForm.status) {
        params.handleStatus = this.searchForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/queryShelvesPage",
          data: params
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.textbookData = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    bookHelp() {
      this.$router.push({
        path: "/publication/bookHelp"
      });
    },
    bookDetail(row) {
      this.$router.push({
        path: "/publication/epubBookDetail",
        query: {
          id: row.id
        }
      });
    },
    delBook(row) {
      this.$confirm("数字教材将会被删除,是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/delete",
              data: {
                dtbookId: row.id
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                if (this.page.currentPage != 1 && this.resList.length == 1) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    editBook(row) {
      this.$router.push({
        path: "/publication/chapterInfo",
        query: {}
      });
      // if (row.type == 1) {
      //   this.$router.push({
      //     path: "/publication/epubBookInfo",
      //     query: {
      //       id: row.id
      //     }
      //   });
      // } else {
      //   this.$router.push({
      //     path: "/publication/chapterInfo",
      //     query: {}
      //   });
      // }
    },
    recommendBook(row) {
      this.$router.push({
        path: "/publication/ebookInfo",
        query: {
          id: row.id,
          activeName: "three"
        }
      });
    },
    newBook(row) {
      this.$router.push({
        name: "epubBookInfo"
      });
    },
    newDigitalBook() {
      this.isAddShow = true;
    },
    transEdit(row) {
      this.currentDtBook = row;
      this.transEditShow = true;
      // this.addForm.cover = row.coverPic
      // this.addForm.name = row.tname;
      // this.addForm.num = row.tbNum
      // this.addForm.author = row.author;
      // this.addForm.pubName = row.publishName;
    },
    toReBack(row) {
      this.currentDtBook = row;
      this.reBackShow = true;
    },
    // 备注
    toReMark(row) {
      this.reMarkShow = true;
    },
    toReBackList(row) {
      this.reBackListShow = true;
      // 获取投稿记录
      this.getReBackList();
    },
    getReBackList() {},
    changeLockBook(row) {
      // let locked = "";
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/lock",
          data: {
            id: row.id
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code === 200) {
            // if (row.locked === 1) {
            //   row.locked = 0;
            // } else {
            //   row.locked = 1;
            // }
            this.loadData();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        });
    },
    changeBookAdded(row) {
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/upTop",
          data: {
            id: row.id
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code === 200) {
            // if (row.bookAdded === 1) {
            //   row.bookAdded = 0;
            // } else {
            //   row.bookAdded = 1;
            // }
            this.loadData();

            this.$message({
              type: "success",
              message: res.msg
            });
          }
        });
    },
    deleteBook(row) {
      this.$confirm("图书将会被删除,不会在APP上展示,是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/delete",
              data: {
                id: row.id
                // delFlag: 1
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                if (this.page.currentPage != 1 && this.resList.length == 1) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    enterKeyUp() {
      this.loadData();
    },
    //转让
    handleTransfer(row) {
      this.selectedMember = 0;
      this.currentTextbookId = row.textbookId;
      axios
        .request({
          method: "post",
          url: "/v1/pubMember/listWithCount",
          data: {
            page: 1,
            pagesize: 30
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.member = ret.data.data;
            this.isTransferShow = true;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //确定转让
    doTransfer() {
      if (this.selectedMember > 0) {
        axios
          .request({
            method: "post",
            url: "/v1/textbook/transferEditPermission",
            data: {
              textbookIds: this.currentTextbookId,
              userId: this.selectedMember
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isTransferShow = false;
              this.loadData();
              this.$message({
                type: "success",
                message: ret.msg
              });
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择转让成员"
        });
      }
    }
  },
  mounted() {
    this.getTodoNum();
    this.loadData();
  }
};
</script>

<style lang="scss">
.add-digital-book {
  .el-form-item {
    margin-bottom: 10px;
  }
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .tiku-cover {
    width: 140px;
    height: 140px;
    display: block;
  }
}

.book {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
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
    .top {
      overflow: hidden;
      .operateBtn {
        float: right;
      }
    }
    .main {
      margin-top: 13px;
      .info {
        padding: 5px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 75px;
            height: 106px;
          }
          .userPicPlachoder {
            width: 75px;
            height: 106px;
            background: #f0f1f5;
            border-radius: 4px;
            text-align: center;
            img {
              width: 24px;
              height: 36px;
              margin-top: 29px;
            }
          }
        }
        .right {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            cursor: pointer;
            span {
              border: 1px solid #2ba1f4;
              color: #2ba1f4;
              font-weight: normal;
              padding: 2px 5px;
              font-size: 12px;
              border-radius: 10px;
              margin-left: 10px;
            }
          }
          .num {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .author {
            margin-top: 5px;
            font-size: 12px;
            color: #999999;
          }
          .otherRes {
            margin-top: 5px;
            span {
              margin-right: 2px;
              display: inline-block;
              padding: 0 12px;
              background: #edf1f7;
              border-radius: 12px;
              color: #0d4376;
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              opacity: 0.7;
            }
          }
        }
      }
      tbody tr td:nth-child(3) {
        font-size: 12px;
        color: #999999;
      }
      tbody tr td:nth-child(2) {
        color: #666666;
      }
    }
  }
}
</style>
