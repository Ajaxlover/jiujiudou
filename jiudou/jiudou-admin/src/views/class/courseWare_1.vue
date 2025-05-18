<template>
  <div class="courseWare">
    <!-- <div class="handleAddCourse" @click="handleAddCourse">新建授课</div> -->
    <el-tooltip
      style="margin-bottom:15px;"
      content="去往课件库新建和关联班级"
      placement="right"
      effect="light"
    >
      <el-button
        v-if="courseWareListData.length > 0"
        size="small"
        @click="goWare"
        type="primary"
        >从课件库添加</el-button
      >
    </el-tooltip>
    <div v-loading="coursewareListLoading" class="coursewareList">
      <el-tooltip
        class="item"
        content="去往课件库新建和关联班级"
        placement="right"
        effect="light"
      >
        <el-button
          @click="goWare"
          size="small"
          v-if="courseWareListData.length === 0"
          type="primary"
          >从课件库添加</el-button
        >
      </el-tooltip>

      <div class="empty1" v-if="courseWareListData.length === 0">
        <img src="@/assets/images/empty1.png" alt="" />
      </div>
      <div
        class="coursewareCard"
        v-for="item in courseWareListData"
        :key="item.coursewareId"
        @click="handleClickName(item)"
      >
        <div class="coursewareCardLeft">
          <div v-if="item.type == 1" class="excercise-logo">
            <span>课件</span>
          </div>
          <div v-if="item.type == 2" class="excercise-collection">
            <span>课件集</span>
          </div>
          <div
            class="excercise-name"
            :title="item.coursewareName"
            v-if="item.type == 1"
          >
            {{ item.coursewareName }}
          </div>
          <div
            class="excercise-name"
            :title="item.coursewareName"
            v-if="item.type == 2"
          >
            {{ item.coursewareName }}
          </div>
          <div class="excercise-time">
            创建时间：{{ formatDate(item.coursewareCreateTime) }}
          </div>
          <!-- <div class="coursewareData">
            {{ formatDate(item.coursewareCreateTime) }}
          </div>
          <div class="coursewareName" @click="handleClickName(item)">
            <span>课件</span>{{ item.coursewareName }}
          </div> -->
          <!-- <div
            class="coursewareTask"
            v-if="item.coursewareExerciseId"
            @click="toEditCourseTask(item)"
          >
            <span>作业</span>{{ item.exerciseName }}
          </div>
          <div class="coursewareTaskAdd" v-else @click="toEditCourseTask(item)">
            <i class="el-icon-circle-plus-outline"></i> 添加作业
          </div> -->
        </div>
        <div class="coursewareCardRight" @click.stop>
          <el-dropdown class="moreBtn" trigger="click">
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCwareName(item)"
                >课件重命名
                <i
                  class="el-icon-arrow-right"
                  style="color:#0177D5;margin-left:85px"
                ></i>
              </el-dropdown-item>
              <!-- <el-dropdown-item
                @click.native="handleExerciseName(item)"
                v-if="item.coursewareExerciseId"
                >作业重命名
                <i
                  class="el-icon-arrow-right"
                  style="color:#0177D5;margin-left:85px"
                ></i>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item
                divided
                @click.native="deleteExercise(item)"
                v-if="item.coursewareExerciseId"
                >删除作业
                <i
                  class="el-icon-delete"
                  style="color:#0177D5;margin-left:100px"
                ></i>
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="deleteCourseWare(item)"
                >删除课件
                <i
                  class="el-icon-delete"
                  style="color:#0177D5;margin-left:100px"
                ></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="btn">
            <!-- <el-button
              size="small"
              type="primary"
              v-if="item.coursewareIsTranscode == 3"
              @click="againUpload(item)"
              style="margin-left:15px"
              >重新上传</el-button
            > -->
            <el-button
              size="small"
              v-if="item.type == 1"
              @click.stop="toEditCourseware(item)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-if="item.type == 1"
              @click.stop="goToCourseware(item)"
              >{{
                item.coursewareStatus == 1 ? "继续上课" : "开始上课"
              }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 新建授课 -->
    <el-dialog
      :visible.sync="isAddShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="doCancel"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建授课</div>
        </div>
      </template>
      <div style="text-align:center" v-if="!addForm.showProgress">
        <el-upload
          class="uploadBtn"
          :before-upload="fileChange"
          :show-file-list="false"
          action="#"
          :http-request="httprequest"
          accept=".ppt,.pptx"
        >
          <el-button
            size="small"
            v-if="!addForm.showPptName"
            style="background:#11BCE4;color:#fff;width:274px;height:40px;font-size:16px;margin-top:20px;border-radius:5px"
          >
            <i class="el-icon-plus"></i>请上传PPT
          </el-button>
        </el-upload>
        <div style="margin-top:10px">
          {{ addForm.showPptName }}
          <i
            class="el-icon-close"
            v-if="addForm.showPptName"
            @click="clearFile"
            style="color: #2BA1F4; font-size: 20px;margin-left: 15px;cursor: pointer;"
          ></i>
        </div>
        <div style="font-size:16px;color:rgba(51,51,51,1);margin-top:30px;">
          当前支持office2007及以上版本的PPT、PPTX
        </div>
      </div>
      <div style="text-align:center" v-else>
        <el-progress
          :percentage="addForm.percentage"
          style="width:400px;margin: 0 auto"
        ></el-progress>
        <div style="font-size:24px;font-weight:500;color:rgba(45,45,45,1);">
          {{ addForm.addPptStatusTs }}
        </div>
        <div style="font-size:16px;color:rgba(51,51,51,1);margin-top:30px;">
          PPT中嵌入音视频可能会无法正常播放，您可在转码完成后上传音视频
        </div>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="doAddSure"
          :loading="loading.addSureLoading"
          >确定</el-button
        >
        <el-button size="small" @click="doCancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- 课件重命名 -->
    <el-dialog
      :visible.sync="isCoursewareShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>课件重命名</div>
        </div>
      </template>
      <el-form
        :model="coursewareForm"
        :rules="coursewareRules"
        ref="coursewareForm"
        label-width="90px"
        style="margin:0 30px;"
        @submit.native.prevent
      >
        <el-form-item label="课件名称" prop="coursewareName">
          <el-input
            size="small"
            v-model="coursewareForm.coursewareName"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doEditCwareName"
          >确定</el-button
        >
        <el-button size="small" @click="isCoursewareShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 作业重命名 -->
    <el-dialog
      :visible.sync="isExerciseShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>作业重命名</div>
        </div>
      </template>
      <el-form
        :model="exerciseForm"
        :rules="exerciseRules"
        ref="exerciseForm"
        label-width="90px"
        style="margin:0 90px;"
        @submit.native.prevent
      >
        <el-form-item label="作业名称" prop="catelogContent">
          <el-input v-model="exerciseForm.exerciseName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doEditExerciseName"
          >确定</el-button
        >
        <el-button size="small" @click="isExerciseShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看课件集课件 -->
    <el-dialog
      top="6vh"
      v-if="isCollectionItemShow"
      :visible.sync="isCollectionItemShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseCollectionItems"
      width="1000px"
      class="collection-item-list"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>{{ currentCollection.coursewareName }}</div>
          <div class="item-collection">
            <span>课件集</span>
          </div>
        </div>
      </template>

      <!-- <div class="top">
        <el-button type="primary" size="medium" @click="handleAddCourse"
          >导入课件</el-button
        >
      </div> -->
      <div
        v-if="collectionItemList.length == 0"
        style="width:100%;height:90%;display:flex;justify-content:center;align-items: center;"
      >
        <span style="color:#909399;font-size:20px">暂无课件</span>
      </div>
      <div v-else>
        <div
          class="coursewareCard"
          v-for="item in collectionItemList"
          :key="item.coursewareId"
          @click="handleClickName(item)"
        >
          <div class="coursewareCardLeft">
            <div v-if="item.type == 1" class="excercise-logo">
              <span>课件</span>
            </div>
            <div v-if="item.type == 2" class="excercise-collection">
              <span>课件集</span>
            </div>

            <div
              class="excercise-name"
              :title="item.coursewareName"
              v-if="item.type == 1"
            >
              {{ item.coursewareName }}
            </div>
            <div
              class="excercise-name"
              :title="item.coursewareName"
              v-if="item.type == 2"
            >
              {{ item.coursewareName }}
            </div>
            <div class="excercise-time">
              创建时间：{{ formatDate(item.coursewareCreateTime) }}
            </div>
          </div>
          <div class="coursewareCardRight" @click.stop>
            <el-dropdown class="moreBtn" trigger="click">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCwareName(item)"
                  >课件重命名
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:85px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item @click.native="deleteCourseWare1(item)"
                  >删除课件
                  <i
                    class="el-icon-delete"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item>
                <!-- <el-dropdown-item
                  divided
                  @click.native="handleCreatWareCopy(item)"
                  >创建副本
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item> -->
                <!-- <el-dropdown-item @click.native="handleShareWare(item)"
                  >分享
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:128px"
                  ></i>
                </el-dropdown-item> -->
                <!-- <el-dropdown-item
                  v-if="item.type == 1"
                  @click.native="moveOutWare(item)"
                  >移出课件集
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:128px"
                  ></i>
                </el-dropdown-item> -->
                <!-- <el-dropdown-item divided @click.native="deleteCourseWare(item)"
                >删除课件
                <i
                  class="el-icon-delete"
                  style="color:#0177D5;margin-left:100px"
                ></i>
              </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <div class="btn">
              <el-button
                size="small"
                v-if="item.type == 1"
                @click.stop="toEditCourseware(item)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="primary"
                v-if="item.type == 1"
                @click.stop="goToCourseware(item)"
                >{{
                  item.coursewareStatus == 1 ? "继续上课" : "开始上课"
                }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 从课件库中选择课件 -->
    <el-dialog
      top="6vh"
      v-if="isTransPaperShow"
      :visible.sync="isTransPaperShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseTransPaper"
      width="1000px"
      class="class-list"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择课件</div>
        </div>
      </template>

      <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="classKeyWord"
          placeholder="请输入课件名称"
          @keyup.enter.native="searchClass"
          style="width: 300px"
        ></el-input>
        <el-button
          @click="searchClass"
          type="primary"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div> -->
      <el-table
        @selection-change="handleSelectionChange"
        v-loading="loading.tableLoading"
        :data="classList"
        border
        style="margin-top:15px"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column align="center" type="selection" width="40">
        </el-table-column>
        <!-- <el-table-column align="center" label="" width="38">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.paperId"
              v-model="radioSelect"
              @change.native="getRow(scope.$index, scope.row)"
            >
              <span>&nbsp</span>
            </el-radio>
          </template>
        </el-table-column> -->
        <el-table-column label="课件名称" prop="wareName">
          <template slot-scope="scope">
            <span>{{ scope.row.wareName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="wareCreateTime" align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.wareCreateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.classPage.currentPage - 1) * this.classPage.pagesize + 1 }}
          到
          {{
            (this.classPage.currentPage - 1) * this.classPage.pagesize +
              this.classList.length
          }}
          记录，共 {{ classPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="classPage.total"
          :current-page.sync="classPage.currentPage"
          :page-size="classPage.pagesize"
          @current-change="getClassList"
        >
        </el-pagination>
      </div> -->

      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="isAbleTrans"
          size="small"
          @click="doTransPaper"
          type="primary"
          >确认</el-button
        >

        <el-button size="small" @click="handleCloseTransPaper">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.courseWare {
  .class-list {
    /deep/ .el-dialog__body {
      height: 75vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .collection-item-list {
    /deep/ .el-dialog__body {
      height: 75vh;
      overflow: hidden;
      overflow-y: auto;
    }
    .top {
      display: flex;
      justify-content: flex-end;
    }
    .item-collection {
      cursor: pointer;
      margin-left: 5px;
      span {
        display: inline-block;
        color: #fff;
        font-size: 16px;
        width: 68px;
        height: 24px;
        line-height: 24px;
        background: #0f40f5;
        text-align: center;
        border-radius: 2px;
        margin-right: 15px;
      }
      font-size: 17px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .coursewareCard {
      width: 800px;
      margin-right: 20px;
      height: 156px;
      border-radius: 10px;
      border: 1px solid rgba(228, 233, 236, 1);
      box-shadow: 5px 3px 10px #cdcfcf;
      padding: 14px 30px;
      overflow: hidden;
      margin-bottom: 15px;
      cursor: pointer;

      .coursewareCardLeft {
        float: left;
        .coursewareData {
          color: #222220;
          font-size: 24px;
          margin-bottom: 30px;
        }
        .excercise-name {
          color: #222220;
          font-size: 24px;
          margin-bottom: 20px;
          cursor: pointer;
          width: 500px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .excercise-time {
          color: #222220;
          font-size: 18px;
        }
        .coursewareName {
          cursor: pointer;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: rgba(88, 123, 184, 1);
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .excercise-logo {
          cursor: pointer;
          margin-bottom: 20px;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: #81b337;
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .excercise-collection {
          cursor: pointer;
          margin-bottom: 20px;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: #0f40f5;
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .coursewareTask {
          cursor: pointer;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: rgba(94, 197, 208, 1);
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          margin-top: 15px;
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .coursewareTaskAdd {
          margin-top: 15px;
          font-size: 18px;
          color: rgba(43, 161, 244, 1);
          cursor: pointer;
        }
      }
      .coursewareCardRight {
        float: right;
        max-width: 200px;
        overflow: hidden;
        .moreBtn {
          float: right;
          color: #39bcf9;
          cursor: pointer;
          height: 22px;
          .el-icon-more {
            font-size: 22px;
          }
        }
        .btn {
          width: 100%;
          float: right;
          margin-top: 30px;
        }
      }
    }
  }
  .handleAddCourse {
    width: 146px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    border: 1px solid rgba(31, 159, 247, 1);
    cursor: pointer;
    color: rgba(31, 159, 247, 1);
    text-align: center;
    letter-spacing: 1px;
    margin: 20px 0 30px 0;
  }
  .coursewareList {
    display: flex;
    flex-wrap: wrap;
    .empty1 {
      display: flex;
      height: 500px;
      width: 100%;
      justify-content: center;
      align-items: center;
      img {
        width: 396px;
        height: 238px;
      }
    }
    .coursewareCard {
      width: 750px;
      margin-right: 20px;
      height: 160px;
      border-radius: 10px;
      border: 1px solid rgba(228, 233, 236, 1);
      padding: 20px 30px;
      overflow: hidden;
      margin-bottom: 15px;
      box-shadow: 5px 3px 10px #cdcfcf;
      cursor: pointer;

      .coursewareCardLeft {
        float: left;
        .coursewareData {
          color: #222220;
          font-size: 24px;
          margin-bottom: 30px;
        }
        .excercise-name {
          color: #222220;
          font-size: 24px;
          margin-bottom: 20px;
          cursor: pointer;
          width: 500px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .excercise-time {
          color: #222220;
          font-size: 18px;
        }
        .coursewareName {
          cursor: pointer;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: rgba(88, 123, 184, 1);
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .excercise-logo {
          cursor: pointer;
          margin-bottom: 20px;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: #81b337;
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .excercise-collection {
          cursor: pointer;
          margin-bottom: 20px;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: #0f40f5;
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .coursewareTask {
          cursor: pointer;
          span {
            display: inline-block;
            color: #fff;
            font-size: 16px;
            width: 68px;
            height: 24px;
            line-height: 24px;
            background: rgba(94, 197, 208, 1);
            text-align: center;
            border-radius: 2px;
            margin-right: 15px;
          }
          margin-top: 15px;
          font-size: 17px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .coursewareTaskAdd {
          margin-top: 15px;
          font-size: 18px;
          color: rgba(43, 161, 244, 1);
          cursor: pointer;
        }
      }
      .coursewareCardRight {
        float: right;
        max-width: 200px;
        overflow: hidden;
        .moreBtn {
          float: right;
          color: #39bcf9;
          cursor: pointer;
          height: 22px;
          .el-icon-more {
            font-size: 22px;
          }
        }
        .btn {
          width: 100%;
          float: right;
          margin-top: 30px;
        }
      }
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
  }
  .importModal .el-table::before {
    height: 0;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import COS from "cos-js-sdk-v5";
import common from "@/utils/common";
import { formatYMD, dateStr } from "@/utils/datetime";

export default {
  name: "courseWare",
  components: {},
  data() {
    return {
      collectionItemList: [],
      currentCollection: {}, // 当前课件集
      isCollectionItemShow: false,
      isTransPaperShow: false,
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "", // 班级名称
      coursewareListLoading: false,
      cls: {}, //当前班级信息
      courseWareListData: [],
      currentCreatCoursewareId: "", // 新建的正在转码的课件的CoursewareId
      currentRow: {},
      isAgainUpload: false,
      isAddShow: false,
      loading: {
        addSureLoading: false
      },
      addForm: {
        showPptName: "",
        file: null,
        resType: "",
        addPptUrl: "", //ppt上传到腾讯云地址
        coursewareUrl: "", //课件地址
        thumbnail_url: "", //缩略图前缀
        ThumbnailNum: 0, //缩略图数量
        showProgress: false,
        percentage: 0,
        addPptStatusTs: "PPT上传中"
      },
      isCoursewareShow: false,
      coursewareForm: {
        coursewareId: "",
        coursewareName: ""
      },
      coursewareRules: {
        coursewareName: [
          { required: true, message: "请输入课件名称", trigger: "blur" }
        ]
      },
      exerciseForm: {
        exerciseId: "",
        exerciseName: ""
      },
      exerciseRules: {
        exerciseName: [
          { required: true, message: "请输入作业名称", trigger: "blur" }
        ]
      },
      isExerciseShow: false,
      switchParameter: {
        sign: "",
        // TicKey: 'x67MKHGDUbWkwR6grWfOzdLuKEYXEVDU',
        expireTime: "",
        random: "",
        sdkappid: ""
      },
      // 腾讯云 上传
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      taskList: []
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.initCos();
    this.loadData();
    this.getClassList();
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    }
  },
  methods: {
    handleCloseCollectionItems() {
      this.currentCollection = {};
      this.isCollectionItemShow = false;
      this.collectionItemList = [];
    },
    showCollectionItem(item) {
      this.currentCollection = item;
      this.getCollectionItems();
      this.isCollectionItemShow = true;
    },
    getCollectionItems() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/list",
          data: {
            parentId: this.currentCollection.coursewareId,
            type: 1,
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.collectionItemList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleSelectionChange(val) {
      this.selectedClass = val;
    },
    handleCloseTransPaper() {
      this.classKeyWord = "";
      this.classPage.currentPage = 1;
      this.selectedClass = [];
      this.isTransPaperShow = false;
    },
    // 确定导入课件考试
    doTransPaper() {
      let wareIds = [];
      this.selectedClass.forEach(item => {
        wareIds.push(item.wareId);
      });
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/pushToClass",
          data: {
            classIds: this.cls.classId,
            wareIds: wareIds.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("ware_link_class");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              type: "success",
              message: "班级导入课件成功"
            });
            this.handleCloseTransPaper();
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchClass() {
      this.classPage.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      // let data = {
      //   isMasterhead: 0
      // };
      // data.pageNo = this.classPage.currentPage;
      // data.pageSize = this.classPage.pagesize;
      // if (this.classKeyWord) {
      //   data.className = this.classKeyWord;
      // }
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/list"
          // data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.classList = ret.data;
            // this.classPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    goWare() {
      this.isTransPaperShow = true;
      // this.$router.push({
      //   path: "/coursewareLib/myCoursewareLib"
      // });
    },
    //加载课件列表
    loadData() {
      this.coursewareListLoading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/list",
          data: {
            classId: this.cls.classId
          }
        })
        .then(res => {
          this.isAddShow = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.coursewareListLoading = false;
            this.courseWareListData = ret.data;
          }
        });
    },
    //新建授课
    handleAddCourse() {
      if (!this.loading.addSureLoading) {
        this.clearFile();
      }
      this.isAddShow = true;
    },
    // 重新上传
    againUpload(row) {
      this.currentRow = row;
      this.isAgainUpload = true;
      this.handleAddCourse();
    },
    //根据文件类型 转换成类型
    toResType(fileType) {
      let type = 0;
      if (
        fileType.indexOf("application/vnd.ms-powerpoint") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) === 0
      ) {
        type = 6;
      }
      return type;
    },
    fileChange(file) {
      if (file) {
        this.addForm.file = file;
        this.addForm.resType = `${this.toResType(file.type)}`;
        this.addForm.showPptName = file.name;
      }
    },
    // 确定上传
    doAddSure() {
      if (this.addForm.file) {
        if (this.addForm.resType != 6) {
          this.$message({
            type: "warning",
            message: "只支持office2007及以上版本的PPT、PPTX"
          });
          return;
        }
        this.addForm.showProgress = true;
        this.loading.addSureLoading = true;
        //用COS上传
        let path =
          dateStr("YYYYMM") +
          "/" +
          this.$store.state.user.userId +
          new Date().valueOf() +
          common.getFileType(this.addForm.file.name);
        this.cos.putObject(
          {
            Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
            Region: this.cosConfig.region,
            Key: path,
            StorageClass: "STANDARD",
            Body: this.addForm.file,
            onProgress: curr => {
              let p = Number(curr.percent) * 100;
              this.addForm.percentage = parseFloat(p.toFixed(2));
            }
          },
          (err, result) => {
            this.taskList = [];
            if (!err) {
              this.addForm.addPptUrl = encodeURI(`https://${result.Location}`);
              this.toSwitchPpt();
            } else {
            }
          }
        );
        this.taskList = this.cos.getTaskList();
      } else {
        this.$message({
          type: "warning",
          message: "请选择上传文件"
        });
      }
    },
    // 取消新建
    doCancel() {
      if (this.currentCreatCoursewareId) {
        axios
          .request({
            method: "post",
            url: "/clazz/v4/courseware/remove",
            data: {
              classId: this.cls.classId,
              coursewareId: this.currentCreatCoursewareId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.loadData();
            }
          });
      } else {
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
      }
      clearInterval(this.uploadTimer);
      this.loading.addSureLoading = false;
      this.addForm.addPptStatusTs = "PPT上传中";
      this.isAddShow = false;
    },
    //清空上传文件
    clearFile() {
      this.addForm.file = null;
      this.addForm.resType = "";
      this.addForm.showPptName = "";
      this.addForm.showProgress = false;
      this.addForm.percentage = 0;
      this.addForm.addPptUrl = "";
      this.addForm.coursewareUrl = "";
      this.addForm.ThumbnailNum = 0;
      this.addForm.thumbnail_url = "";
    },
    //去转码并创建课程
    toSwitchPpt() {
      this.addForm.addPptStatusTs = "PPT转码中";
      let data = {};
      let url = "";
      if (this.isAgainUpload) {
        // 重新上传
        url = "/clazz/v4/courseware/reCreateAndTranscode";
        data.coursewareId = this.currentRow.coursewareId;
      } else {
        // 新上传
        url = "/clazz/v4/courseware/createAndTranscode";
        data.classId = this.cls.classId;
        data.coursewareName = this.addForm.showPptName
          .substring(0, this.addForm.showPptName.lastIndexOf("."))
          .substring(0, 30);
      }
      data.coursewareSourceUrl = this.addForm.addPptUrl;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200 && ret.data.coursewareTaskId) {
            this.currentCreatCoursewareId = ret.data.coursewareId;
            this.uploadTimer = setInterval(() => {
              this.toGetprocess(ret.data.coursewareTaskId);
            }, 2000);
          } else {
            this.$message({
              type: "warning",
              message: "获取上传任务ID失败"
            });
          }
        });
    },
    //去得到转码进度
    toGetprocess(taskId) {
      axios
        .request({
          method: "post",
          url: "/common/v4/class/query",
          data: {
            taskId: taskId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.addForm.percentage = ret.data.progress;
            if (ret.data.progress == 100) {
              this.addForm.coursewareUrl = ret.data.resultUrl;
              this.addForm.thumbnail_url = ret.data.thumbnailUrl;
              this.addForm.ThumbnailNum = ret.data.pages;
              this.submitResult(); //转码完成之后将结果提交到数据库
              clearInterval(this.uploadTimer);
            }
          } else {
            this.loading.addSureLoading = false;
            clearInterval(this.uploadTimer);
            this.$message({
              type: "warning",
              message: "上传文件有误，请在列表中重新上传"
            });
            this.loadData();
            this.currentRow = {};
            this.isAgainUpload = false;
            this.isAddShow = false;
          }
        });
    },
    //转码完成结果保存到数据库
    submitResult() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/complete",
          data: {
            coursewareId: this.currentCreatCoursewareId,
            coursewareUrl: this.addForm.coursewareUrl,
            coursewareThumbnailPrefix: this.addForm.thumbnail_url,
            coursewareThumbnailNum: this.addForm.ThumbnailNum
          }
        })
        .then(res => {
          this.isAddShow = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.addSureLoading = false;
            this.addForm.addPptStatusTs = "PPT上传中";
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.$router.push({
              path: "/claCourseware/editCourseware",
              query: {
                classId: this.cls.classId,
                coursewareId: this.currentCreatCoursewareId,
                htmlUrl: this.addForm.coursewareUrl,
                pages: this.addForm.ThumbnailNum,
                coursewareName: this.addForm.showPptName
                  .substring(0, this.addForm.showPptName.lastIndexOf("."))
                  .substring(0, 30)
              }
            });
            this.currentRow = {};
            this.isAgainUpload = false;
            this.loadData();
            this.currentCreatCoursewareId = "";
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            this.currentCreatCoursewareId = "";
          }
        });
    },
    //课件重命名
    handleCwareName(row) {
      this.coursewareForm.coursewareId = row.coursewareId;
      this.coursewareForm.coursewareName = row.coursewareName;
      this.isCoursewareShow = true;
    },
    doEditCwareName() {
      this.$refs["coursewareForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/courseware/rename",
              data: {
                classId: this.cls.classId,
                coursewareId: this.coursewareForm.coursewareId,
                coursewareName: this.coursewareForm.coursewareName
              }
            })
            .then(res => {
              this.isCoursewareShow = false;
              let ret = res.data;
              if (ret.code === 200) {
                this.loadData();
                if (this.currentCollection.coursewareId) {
                  this.getCollectionItems();
                }
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    //作业重命名
    handleExerciseName(row) {
      this.exerciseForm.exerciseId = row.coursewareExerciseId;
      this.exerciseForm.exerciseName = row.exerciseName;
      this.isExerciseShow = true;
    },
    doEditExerciseName() {
      this.$refs["exerciseForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/tiku/v4/paper/rename",
              data: {
                classId: this.cls.classId,
                paperId: this.exerciseForm.exerciseId,
                paperName: this.exerciseForm.exerciseName
              }
            })
            .then(res => {
              this.isExerciseShow = false;
              let ret = res.data;
              if (ret.code === 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    //删除作业
    deleteExercise(row) {
      this.$confirm(
        "<div>是否确定删除作业：《" +
          row.exerciseName +
          "》？</div>删除后无法恢复",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/tiku/paper/delete",
              data: {
                paperId: row.coursewareExerciseId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
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
    //删除课件
    deleteCourseWare(row) {
      this.$confirm(
        "<div>是否确定删除课件：《" +
          row.coursewareName +
          "》？</div>删除后将无法恢复",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/courseware/remove",
              data: {
                classId: this.cls.classId,
                coursewareId: row.coursewareId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
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
    //删除课件集课件
    deleteCourseWare1(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/courseware/remove",
          data: {
            classId: this.cls.classId,
            coursewareId: row.coursewareId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadData();
            if (this.currentCollection.coursewareId) {
              this.getCollectionItems();
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      // this.$confirm(
      //   "<div>是否确定删除课件：《" +
      //     row.coursewareName +
      //     "》？</div>删除后将无法恢复",
      //   "提示",
      //   {
      //     cancelButtonText: "取消",
      //     confirmButtonText: "确定",
      //     dangerouslyUseHTMLString: true,
      //     type: "warning"
      //   }
      // )
      //   .then(() => {

      //   })
      //   .catch(() => {});
    },
    // 点击课件名称
    handleClickName(item) {
      if (item.type == 2) {
        this.currentCollection = item;
        this.getCollectionItems();
        this.isCollectionItemShow = true;
        return;
      }
      this.toEditCourseware(item);
      // if (item.coursewareIsTranscode == 2) {
      //   this.toEditCourseware(item);
      // } else {
      //   this.$message({
      //     type: "warning",
      //     message: "请重新上传课件内容!"
      //   });
      // }
    },
    //去编辑课件
    toEditCourseware(row) {
      this.$router.push({
        path: "/claCourseware/editCourseware",
        query: {
          classId: this.cls.classId,
          coursewareId: row.coursewareId,
          htmlUrl: row.coursewareUrl,
          pages: row.coursewareThumbnailNum,
          coursewareName: row.coursewareName
        }
      });
    },
    //去上课
    goToCourseware(row) {
      this.$router.push({
        path: "/claCourseware/goToCourseware",
        query: {
          classId: this.cls.classId,
          coursewareId: row.coursewareId,
          courseware_new: row.coursewareId,
          coursewareName: row.coursewareName,
          coursewareCurrentPage: row.coursewareCurrentPage,
          htmlUrl: row.coursewareUrl,
          pages: row.coursewareThumbnailNum,
          exerciseName: row.coursewareExerciseName,
          coursewareExerciseId: row.coursewareExerciseId
        }
      });
    },
    // 去编辑作业
    toEditCourseTask(row) {
      this.$router.push({
        path: "/claCourseware/editCourseTask",
        query: {
          classId: this.cls.classId,
          coursewareId: row.coursewareId,
          exerciseId: row.coursewareExerciseId ? row.coursewareExerciseId : "",
          exerciseName: row.exerciseName ? row.exerciseName : "新建作业"
        }
      });
    },
    // 时间
    formatDate(time) {
      if (time) {
        return formatYMD(time);
      }
    },
    // 初始化COS
    initCos() {
      axios
        .request({
          method: "post",
          url: "/v1/upload/jsInitInfo"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            var info = ret.data;
            this.cosConfig.bucket = info.bucket;
            this.cosConfig.imgBucket = info.imgBucket;
            this.cosConfig.appId = info.appId;
            if (info.domain) {
              this.cosConfig.topDomain = info.domain;
            }
            if (info.region) {
              this.cosConfig.region = info.region;
            }
            this.cos = new COS({
              // 必选参数
              getAuthorization: function(options, callback) {
                axios
                  .request({
                    method: "post",
                    url: "/v1/upload/cosSignatureV5",
                    data: {
                      bucket: options.Bucket,
                      region: options.Region
                    }
                  })
                  .then(res => {
                    let ret = res.data;
                    if (ret.code === 200) {
                      let obj = {
                        TmpSecretId: ret.data.tmpSecretId,
                        TmpSecretKey: ret.data.tmpSecretKey,
                        XCosSecurityToken: ret.data.xCosSecurityToken,
                        ExpiredTime: ret.data.expiredTime
                      };
                      callback(obj);
                    }
                  });
              }
            });
          }
        });
    },
    httprequest() {
      return false;
    }
  }
};
</script>
