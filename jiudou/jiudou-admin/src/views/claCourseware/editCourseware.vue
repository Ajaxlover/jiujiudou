<template>
  <el-container class="editCourseware">
    <el-header>
      <div>
        <span class="returnBtn" @click="goBack"
          ><i class="el-icon-back"></i>返回</span
        >
        <span>{{ coursewareName }}</span>
      </div>
      <div>编辑交互内容</div>
      <div @click="toView"><i class="el-icon-view"></i>预览</div>
    </el-header>
    <el-main>
      <div class="contentBox">
        <ul class="imgList">
          <li v-for="item in dataList" :key="item.thumbnailId || item.thumbId">
            <span>{{ item.thumbnailIndex || item.thumbIndex }}</span>
            <img
              :src="item.thumbnailUrl || item.thumbUrl"
              class="imgLi"
              alt=""
              @click="handleClickImg(item, $event)"
            />
            <!-- <el-image
              :src="item.thumbnailUrl || item.thumbUrl"
              class="imgLi"
              @click="handleClickImg(item, $event)"
              lazy
            ></el-image> -->
          </li>
        </ul>
        <div class="contentBoxRg">
          <img
            :src="currentImg.thumbnailUrl || currentImg.thumbUrl"
            class="bigImg"
          />
          <div
            style="text-align:center;font-size:24px;color:rgba(165,186,205,1);margin-top:16px;"
          >
            <!-- 单击下面的功能命令 -->
          </div>
          <el-row class="coursewareContent">
            <el-col
              v-for="item in currentImg.tContentList"
              :key="item.tContentId"
            >
              <div class="left">
                <img
                  v-if="item.tContentSubType == 1"
                  @click="handleViewRes(item)"
                  src="@/assets/images/audio.png"
                  alt=""
                />
                <div
                  v-if="item.tContentSubType == 2"
                  @click="handleViewRes(item)"
                  style="position:relative;width:100px;height:60px;"
                >
                  <div
                    v-if="item.designPic"
                    style="position:relative;background:rgba(0,0,0,0.5);height:60px;border-radius: 4px;"
                  >
                    <img
                      :src="item.designPic"
                      alt=""
                      style="height:60px;width:auto;max-width:100px;"
                    />
                    <img
                      src="@/assets/images/shipin.png"
                      alt=""
                      style="position:absolute;right:0;top:0;width:27px;height:17px;"
                    />
                  </div>
                  <img v-else src="@/assets/images/video.png" alt="" />
                </div>
                <div
                  v-if="item.tContentSubType == 3"
                  @click="handleViewRes(item)"
                  style="position:relative"
                >
                  <img
                    v-if="item.designPic"
                    :src="item.designPic"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    v-else
                    src="@/assets/images/other.png"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <img
                    src="@/assets/images/arIcon.png"
                    alt=""
                    style="position:absolute;right:0;top:0;width:27px;height:17px;"
                  />
                </div>
                <img
                  v-if="item.tContentSubType == 4"
                  @click="handleViewRes(item)"
                  src="@/assets/images/excel.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 5"
                  @click="handleViewRes(item)"
                  src="@/assets/images/h5.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 6"
                  @click="handleViewRes(item)"
                  src="@/assets/images/ppt.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 7"
                  @click="handleViewRes(item)"
                  src="@/assets/images/word.png"
                  alt=""
                />
                <img
                  v-if="item.tContentSubType == 9"
                  @click="handleViewRes(item)"
                  src="@/assets/images/pdf.png"
                  alt=""
                />
                <div
                  v-if="item.tContentSubType == 10"
                  @click="handleViewRes(item)"
                  style="background:rgba(0,0,0,0.5);width:100px;height:60px;border-radius: 4px;text-align:center"
                >
                  <img
                    v-if="item.tContentUrl"
                    :src="item.tContentUrl"
                    alt=""
                    style="height:60px;width:auto;max-width:100px;"
                  />
                  <img v-else src="@/assets/images/img.png" />
                </div>
                <img
                  v-if="item.tContentSubType == 12"
                  @click="handleViewRes(item)"
                  src="@/assets/images/yypc.png"
                  alt=""
                />
              </div>
              <div
                class="middle"
                style="cursor:pointer;"
                @click="handleViewRes(item)"
              >
                {{ item.tContentName }}
              </div>
              <el-button
                class="right"
                size="mini"
                @click="deletCContent(item)"
                style="border-color: #2ba1f4;"
                >删除</el-button
              >
            </el-col>
            <el-col
              v-for="item in currentImg.clazzAnswerList"
              :key="item.answerId"
            >
              <div class="left"></div>
              <div class="middle" @click="showAnswerDetail(item)">
                {{ item.name }}
              </div>
              <el-button
                class="right"
                size="mini"
                @click="deletAnswer(item)"
                style="border-color: #2ba1f4;"
                >删除</el-button
              >
            </el-col>
          </el-row>
          <ul class="operationBtn">
            <!-- <li @click="handleSelectTest">
              <img src="@/assets/coursewareIcon/icon_1.png" alt="" />
              <div>随堂测试</div>
            </li> -->
            <li class="uploadFile">
              <img src="@/assets/coursewareIcon/icon_3.png" alt="" />
              <div>本地文件</div>
              <el-upload
                :before-upload="fileChange"
                :show-file-list="false"
                action="#"
                :http-request="httprequest"
              >
                <el-button></el-button>
              </el-upload>
            </li>
            <li @click="handleSelectRes">
              <img src="@/assets/coursewareIcon/icon_4.png" alt="" />
              <div>资源库</div>
            </li>
            <li @click="selectAnswerTimu">
              <img src="@/assets/coursewareIcon/icon_1.png" alt="" />
              <div>应答</div>
            </li>
            <!-- <li @click="arShow">
              <img src="@/assets/coursewareIcon/icon_1.png" alt="" />
              <div>应答</div>
            </li> -->
          </ul>
        </div>
      </div>
    </el-main>
    <!-- 随堂测试 -->
    <el-drawer
      title="添加授课内容"
      :destroy-on-close="true"
      :visible.sync="drawer"
      direction="ltr"
      size="90%"
      :modal-append-to-body="false"
      :before-close="handleCloseDrawer"
    >
      <addTest v-if="drawer" :addType="2"></addTest>
    </el-drawer>
    <!-- 上传 -->
    <el-dialog
      :visible.sync="isUploadShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
      :before-close="doCancelUploadRes"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>本地文件上传</div>
        </div>
      </template>
      <div>
        <div style="margin-top:10px">{{ fileInfo.name }}</div>
        <el-progress :percentage="fileInfo.percentage"></el-progress>
      </div>
      <span slot="footer">
        <el-button size="small" @click="doCancelUploadRes">取消上传</el-button>
      </span>
    </el-dialog>
    <!-- 添加资源弹框 -->
    <el-dialog
      :visible.sync="isResShow"
      :modal-append-to-body="false"
      class="addModal"
      v-if="isResShow"
      :close-on-click-modal="false"
      width="90%"
      top="6vh"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            找资源<span v-if="selectedRes.length > 0"
              >-已选{{ selectedRes.length }}个</span
            >
          </div>
        </div>
      </template>
      <el-form :inline="true" v-model="resForm" size="small">
        <el-form-item label="资源库">
          <el-select
            v-model="resForm.type"
            @change="resSearch"
            style="width:100px;"
          >
            <el-option label="公共" value="0"></el-option>
            <el-option label="我的" value="1"></el-option>
            <el-option label="教材" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resForm.type == 0" style="width:200px;">
          <el-select v-model="resForm.comLib" @change="resSearch" size="small">
            <el-option
              v-for="item in comLibList"
              :key="item.rlId"
              :label="item.rlName"
              :value="item.rlId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resForm.type == 1" style="width:200px;">
          <el-select v-model="resForm.myLib" @change="resSearch" size="small">
            <el-option
              v-for="item in myLibList"
              :key="item.libId"
              :label="item.libName"
              :value="item.libId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resForm.type == 2" style="width:200px;">
          <el-select
            @change="textResSearch"
            v-model="resForm.textbookId"
            size="small"
          >
            <el-option
              v-for="item in textBookList"
              :key="item.textbookId"
              :label="item.tname"
              :value="item.textbookId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="resForm.type == 2"
          label="资源类型"
          style="margin-left:15px;"
        >
          <el-select
            v-model="resForm.resType"
            style="width:100px"
            placeholder="题型"
            @change="textResSearch"
          >
            <el-option
              v-for="type in resTypes"
              :key="type.type"
              :label="type.name"
              :value="type.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resForm.type == 2" label="名称">
          <el-input
            placeholder="搜索资源"
            v-model="resForm.keyword"
            @keyup.enter.native="textResSearch"
            style="width:auto"
          ></el-input>
          <el-button
            type="primary"
            @click="textResSearch"
            class="el-icon-search"
            style="margin-left:15px;"
          ></el-button>
        </el-form-item>
        <el-form-item
          v-if="resForm.type != 2"
          label="资源类型"
          style="margin-left:15px;"
        >
          <el-select
            v-model="resForm.resType"
            style="width:100px"
            placeholder="资源类型"
            @change="resSearch"
          >
            <el-option
              v-for="type in resTypes"
              :key="type.type"
              :label="type.name"
              :value="type.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="resForm.type != 2" label="名称">
          <el-input
            placeholder="搜索资源"
            v-model="resForm.keyword"
            @keyup.enter.native="resSearch"
            style="width:auto"
          ></el-input>
          <el-button
            type="primary"
            @click="resSearch"
            class="el-icon-search"
            style="margin-left:15px;"
          ></el-button>
        </el-form-item>
      </el-form>
      <div class="resPath">
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          v-if="isShowBreadcrumb"
        >
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="`b-${item.rlrNo}`"
          >
            <span
              @click="toFolder(item, index)"
              :class="index === breadcrumb.length - 1 ? 'current' : 'path'"
              >{{ item.name }}</span
            >
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="resData"
        stripe
        border
        v-loading="tableLoading"
        @selection-change="changeSelect"
        :row-key="getRowKeys"
        ref="resTable"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          :selectable="isSelectable"
        ></el-table-column>
        <el-table-column
          label="资源类型"
          align="center"
          prop="resType"
          :formatter="formatResType"
        >
          <div slot-scope="scope">
            <i
              v-if="scope.row.resType == 11"
              class="el-icon-folder"
              style="cursor:pointer;"
              @click="toFolder(scope.row)"
            ></i>
            {{ formatResType(scope.row) }}
          </div>
        </el-table-column>
        <el-table-column
          label="资源名称"
          align="center"
          prop="resName"
        ></el-table-column>
        <el-table-column
          label="资源大小"
          align="center"
          prop="resSize"
          :formatter="formatResSize"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updated"
          :formatter="formatDate"
        ></el-table-column>
      </el-table>
      <div v-if="resForm.type == 2" class="tabelFooter">
        <div v-if="resData.length" class="right-footer-first">
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + resData.length
          }}记录，共{{ page.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="sizes, prev, pager, next, jumper"
          :page-sizes="[10, 30, 50]"
          :total="page.total"
          @size-change="handleSizeChange"
          :page-size="page.pagesize"
          :current-page.sync="page.currentPage"
          background
          @current-change="loadTextBookRes"
        >
        </el-pagination>
      </div>
      <div v-if="resForm.type != 2" class="tabelFooter">
        <div v-if="resData.length" class="right-footer-first">
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + resData.length
          }}记录，共{{ page.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="sizes, prev, pager, next, jumper"
          :page-sizes="[10, 30, 50]"
          :total="page.total"
          @size-change="handleSizeChange"
          :page-size="page.pagesize"
          :current-page.sync="page.currentPage"
          background
          @current-change="loadResList"
        >
        </el-pagination>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doAddResSure"
          >确定</el-button
        >
        <el-button size="small" @click="isResShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 添加ar资源弹框 -->
    <el-dialog
      :visible.sync="isARShow"
      :modal-append-to-body="false"
      class="arModal"
      :close-on-click-modal="false"
      width="90%"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>AR资源</div>
        </div>
      </template>
      <ul>
        <li v-for="item in arData" :key="item.rlrResourceId">
          <img
            v-if="item.designPic"
            :src="item.designPic"
            alt=""
            style="border-radius:4px;"
          />
          <img v-else src="@/assets/images/other.png" alt="" />
          <el-checkbox v-model="item.checked"></el-checkbox>
          <div class="resName" :title="item.resName">{{ item.resName }}</div>
        </li>
      </ul>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doAddARSure"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 预览资源 -->
    <el-dialog
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
        </div>
      </template>
      <viewRes
        :data="viewResObj"
        :style="viewResObj.resType == 2 ? 'height:350px' : ''"
      ></viewRes>
    </el-dialog>

    <!-- 应答选题弹窗 -->
    <el-dialog
      top="4vh"
      v-if="isHandChooseShow"
      :visible.sync="isHandChooseShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1200px"
      class="selectTip"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>应答选题(已选{{ selectedTest.length }}题)</div>
        </div>
      </template>

      <div>
        <el-form :inline="true" v-model="testSelectForm1" size="small">
          <el-form-item label="题库">
            <el-select
              v-model="testSelectForm1.rlType"
              @change="slTypeChange"
              style="width:100px;margin-left:28px;"
            >
              <el-option label="已购" value="0"></el-option>
              <el-option label="我的" value="1"></el-option>
              <el-option label="使用记录" value="2"></el-option>
              <el-option label="教材" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="testSelectForm1.rlType == 0" style="width:200px;">
            <el-select
              v-model="testSelectForm1.comLib"
              @change="testComTkSearch"
              size="small"
            >
              <el-option
                v-for="item in comTKList"
                :key="item.id"
                :label="item.sblName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="testSelectForm1.rlType == 1" style="width:200px;">
            <el-cascader
              v-model="testSelectForm1.myLib"
              :options="myTKList"
              @change="testMyTkSearch"
              :props="myTkProps1"
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="testSelectForm1.rlType == 0">
            <el-tree-select
              @input="tipSelectChange"
              :styles="tipTreeStyle1"
              :value="testSelectForm1.tips"
              :selectParams="selectParams1"
              :treeParams="treeParams1"
              @searchFun="tipSearch"
              ref="comTreeSelect"
            />
          </el-form-item>
          <el-form-item style="width:200px" v-if="testSelectForm1.rlType == 1">
            <el-select
              v-model="testSelectForm1.tipText"
              filterable
              clearable
              placeholder="请选择知识点"
              size="small"
              @change="slTypeChange"
            >
              <el-option
                v-for="item in myLibTip1"
                :key="item.tipText"
                :label="item.tipText"
                :value="item.tipText"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:200px" v-if="testSelectForm1.rlType == 3">
            <el-select
              @change="selectBookChange"
              v-model="bookId"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in bookList"
                :key="index"
                :label="item.textbookName"
                :value="item.textbookId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型" style="margin-left:15px;">
            <el-select
              v-model="testSelectForm1.type"
              style="width:100px"
              placeholder="题型"
              @change="testSearch"
            >
              <el-option
                v-for="type in allTypes"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="testSelectForm1.rlType != 3"
            label="难度系数"
            style="margin-left:15px;"
          >
            <el-select
              v-model="testSelectForm1.diff"
              style="width:100px"
              placeholder="难度系数"
              @change="testSearch"
            >
              <el-option
                v-for="diff in allDiffs"
                :key="diff.type"
                :label="diff.name"
                :value="diff.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目内容" style="display:block">
            <el-input
              placeholder="搜索题目"
              v-model="testSelectForm1.keywords"
              @keyup.enter.native="testSearch"
              style="width:auto"
            ></el-input>
            <el-button
              type="primary"
              @click="testSearch"
              class="el-icon-search"
              style="margin-left:15px;"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="testSelectListTable"
          :data="testSelectList1"
          stripe
          border
          v-loading="loading.handLoading"
          @selection-change="changeSelect1"
          :row-key="getRowKeys1"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
          ></el-table-column>
          <el-table-column
            label="ID"
            align="center"
            prop="id"
            width="90px"
          ></el-table-column>
          <el-table-column
            label="标签"
            prop="uniqueId"
            align="center"
            width="150px"
            v-if="roleId != 24"
          ></el-table-column>
          <el-table-column
            label="难度系数"
            prop="accuracyRate"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column label="知识点" align="center" width="250px">
            <template slot-scope="scope">
              <span v-html="scope.row.learnPort"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="题型"
            align="center"
            prop="tSubject"
            :formatter="formatType1"
            width="90px"
          ></el-table-column>
          <el-table-column label="题目" align="center" prop="briefTitle">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div
                  style="text-align: left;max-height: 18px;overflow: hidden;"
                  v-html="scope.row.briefTitle"
                ></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="testSelectForm1.rlType == 2"
            label="使用次数"
            align="center"
            prop="answerCounts"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="70px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="preview(scope.row)"
                >预览</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="testSelectList1.length" class="right-footer-first">
            从{{
              (testSelectPage1.page - 1) * testSelectPage1.pagesize + 1
            }}到{{
              (testSelectPage1.page - 1) * testSelectPage1.pagesize +
                testSelectList1.length
            }}记录，共{{ testSelectPage1.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            v-if="testSelectForm1.rlType == 3"
            layout="prev, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="testSelectPage1.total"
            @size-change="handleSizeChange"
            :page-size="testSelectPage1.pagesize"
            :current-page.sync="testSelectPage1.page"
            background
            @current-change="loadBookTestList"
          >
          </el-pagination>
          <el-pagination
            v-else
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="testSelectPage1.total"
            @size-change="handleSizeChange"
            :page-size="testSelectPage1.pagesize"
            :current-page.sync="testSelectPage1.page"
            background
            @current-change="loadSubjects"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handChooseSure"
          >确认</el-button
        >
        <el-button size="small" @click="isHandChooseShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog
      :visible.sync="isPreviewShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>题目预览</div>
        </div>
      </template>
      <preview
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
    </el-dialog>
    <!-- 预览应答 -->
    <el-dialog
      v-if="isCourseAnswerShow"
      :visible.sync="isCourseAnswerShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="100%"
      top="0"
      :show-close="false"
      class="taskTk"
    >
      <courseWareAnswer
        :data="courseWareAnswerList"
        @close="isCourseAnswerShow = false"
      ></courseWareAnswer>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format, dateStr } from "@/utils/datetime";
import viewRes from "@/components/viewRes";
import addTest from "./addTest";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import timu from "@/views/exam/timu.vue";
import courseWareAnswer from "./courseWareAnswerInfo.vue";

import preview from "@/views/tiku/previewSubject.vue";
export default {
  name: "editCourseware",
  components: {
    viewRes,
    addTest,
    ElTreeSelect,
    timu,
    preview,
    courseWareAnswer
  },
  data() {
    return {
      // 手动抽题
      loading: {
        nameListLoading: false,
        handLoading: false,
        fixLoading: false
      },
      comTKList: [], // 公共库列表
      myTkProps1: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      bookList: [],
      bookId: 0,
      roleId: this.$store.state.user.currentRole.roleId,
      comTKList1: [], // 公共库列表
      currentComTk1: {}, //选中的当前库
      myTKList1: [], // 我的库列表
      myLibTip1: [], // 我的库知识点
      allTypes: common.allAnswerTypes,
      allDiffs: common.allRateLevel,
      // 题目列表
      testSelectList1: [],
      testSelectForm1: {
        rlType: "0",
        myLib: "",
        comLib: "",
        type: "2",
        diff: "",
        keywords: "",
        tips: "",
        tipText: "",
        comTipText: ""
      },
      testSelectPage1: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      //知识点查询参数
      selectParams1: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tipTreeStyle1: {
        width: "130px"
      },
      treeParams1: {
        clickParent: false,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "name",
          value: "tipId"
        }
      },
      // 选中添加的题目
      selectedTest: [],
      isPreviewShow: false,
      previewSubject: {},
      isHandChooseShow: false,
      isCourseAnswerShow: false, // 预览应答
      goType: this.$route.query.goType,
      coursewareId: this.$route.query.coursewareId,
      coursewareName: this.$route.query.coursewareName,
      classId: this.$route.query.classId,
      htmlUrl: this.$route.query.htmlUrl,
      pages: this.$route.query.pages,
      cls: {},
      dataList: [],
      currentImg: {
        thumbnailUrl: "",
        tContentList: [] //每一页ppt的交互内容
      },
      //随堂测试
      drawer: false,
      selectedRes: [], //选中资源的原数组
      //上传
      fileInfo: {
        file: null,
        name: "",
        type: "",
        size: "",
        cloudId: "",
        resUrl: "",
        percentage: 0
      },
      isUploadShow: false,
      // 腾讯云 上传
      vod: null,
      cos: null,
      taskList: [], // 常规资源任务列表
      uploader: null, // 视频音频上传存储对象
      cosConfig: {
        topDomain: "",
        region: ""
      },
      //找资源
      isResShow: false,
      tableLoading: false,
      isShowBreadcrumb: false,
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      resForm: {
        type: "0",
        resType: "",
        comLib: "",
        myLib: "",
        keyword: "",
        textbookId: ""
      },
      comLibList: [],
      myLibList: [],
      textBookList: [], // 教材列表
      resTypes: common.resTypes,
      resData: [],
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      isARShow: false,
      arData: [],
      isViewResShow: false,
      viewResObj: {} //预览资源传入的数据
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.initCosV5();
    this.initVod();
    this.initComResLib();
    this.initMyResLib();
    this.loadData();
    this.initComTkLib();
    this.initMyTkLib();
    this.loadVerifiedList();
  },
  methods: {
    checkLib(id) {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/hasUnUseBank",
          data: { sblId: id }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            if (res.data.unUseBankFlag) {
              this.$alert(
                "该题库中有过期的收费题目，不可使用，已为您隐藏",
                "",
                {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {}
                }
              );
            }
          }
        });
    },
    // ----------------------------------选题开始--------------------
    // 类型
    formatType1(row) {
      return common.typeFormat(row.tSubject);
    },
    selectAnswerTimu() {
      this.testSelectPage1.page = 1;
      this.testSelectForm1.rlType = "0";
      this.testSelectForm1.myLib = "";
      this.testSelectForm1.comLib = "";
      this.testSelectForm1.diff = "";
      this.testSelectForm1.keywords = "";
      this.testSelectForm1.tips = "";
      this.testSelectForm1.tipText = "";
      this.testSelectForm1.comTipText = "";
      this.treeParams1.data = [];
      this.selectedTest = [];
      this.testSelectForm1.type = "2";
      this.isHandChooseShow = true;
      this.loadSubjects();
    },
    // 添加应答题目
    handChooseSure() {
      if (this.selectedTest.length == 0) {
        this.$message({
          message: "请选择题目",
          type: "warning"
        });
        return;
      }
      let ids = [];
      this.selectedTest.forEach(element => {
        ids.push(element.id);
      });
      if (this.goType == "ware") {
        // 备课区

        axios
          .request({
            method: "post",
            url: "/clazz/v4/ware/addAnswer",
            data: {
              wareId: this.coursewareId,
              thumbnailIndex: this.currentImg.thumbIndex,
              answerBankIds: ids.join(",")
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isHandChooseShow = false;
              var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
              var cEvent = new CountEvent("create_ware_answer");
              window.JAnalyticsInterface.onEvent(cEvent);
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        // 班级课件
        axios
          .request({
            method: "post",
            url: "/clazz/v4/courseware/addAnswer",
            data: {
              coursewareId: this.coursewareId,
              thumbnailIndex: this.currentImg.thumbnailIndex,
              answerBankIds: ids.join(",")
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.isHandChooseShow = false;
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    getRowKeys1(row) {
      return row.id;
    },
    // 题目列表选中事件
    changeSelect1(select) {
      this.selectedTest = select;
    },
    //题目查询
    testSearch() {
      this.testSelectPage1.page = 1;
      if (this.testSelectForm1.rlType == 3) {
        this.loadBookTestList();
      } else {
        this.loadSubjects();
      }
    },
    selectBookChange(val) {
      this.bookId = val;
      this.loadBookTestList();
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.comTreeSelect.filterFun(value);
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.testSelectForm1.tips = ids;
      if (labels) {
        this.testSelectForm1.comTipText = labels.join(",");
      } else {
        this.testSelectForm1.comTipText = "";
      }
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    //点击公共库查询知识点
    testComTkSearch() {
      if (this.testSelectForm1.comLib) {
        this.checkLib(this.testSelectForm1.comLib);
        this.currentComTk1 = this.comTKList.filter((item, i) => {
          return item.id == this.testSelectForm1.comLib;
        });
        this.loadTips1();
      } else {
        this.treeParams1.data = [];
        this.$refs.comTreeSelect.treeDataUpdateFun(this.treeParams1.data);
      }
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    //点击我的库查询知识点
    testMyTkSearch() {
      this.checkLib(this.testSelectForm1.myLib);
      this.loadMyLibTip1();
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 加载我的库知识点
    loadMyLibTip1() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.testSelectForm1.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myLibTip1 = ret.data;
          }
        });
    },
    // 获取公共库知识点
    loadTips1() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentComTk1[0].sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams1.data = res.data;
              if (res.data.length >= 0) {
                this.$refs.comTreeSelect.treeDataUpdateFun(res.data);
              }
            }
          }.bind(this)
        );
    },
    slTypeChange() {
      this.testSelectPage1.page = 1;
      if (this.testSelectForm1.rlType == 3) {
        this.loadBookTestList();
      } else {
        this.loadSubjects();
      }
    },
    // 手动选题题目列表
    async loadSubjects() {
      this.loading.handLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {};
      if (this.testSelectForm1.type) {
        data.tSubject = parseInt(this.testSelectForm1.type);
      }

      if (this.testSelectForm1.diff) {
        // data.difficultLevel = parseInt(this.testSelectForm.diff);
        data.difficultRateLevel = this.testSelectForm1.diff;
      }
      data.keyWord = this.testSelectForm1.keywords;
      if (this.testSelectForm1.rlType == 1) {
        url = "/subject/personalSubjectBankLibrary/itemsWithCount";
        data.libId = this.testSelectForm1.myLib;
        data.tip = this.testSelectForm1.tipText;
        data.currentUid = this.$store.state.user.userId;
        data.hideUnUseFlag = true;
      } else if (this.testSelectForm1.rlType == 2) {
        // 使用记录
        url = "/subject/subjectBankLibrary/getSlsInfoWithSb4";
      } else {
        data.libId = this.testSelectForm1.comLib;
        data.tip = this.testSelectForm1.comTipText;
        data.currentUid = this.$store.state.user.userId;
        data.hideUnUseFlag = true;
      }
      // await this.getSubjectIds().then(() => {
      //   if (this.subjectIds.length > 0) {
      //     data.selectSubjectIds = this.subjectIds.join(",");
      //   }
      // });
      data.page = this.testSelectPage1.page;
      data.pagesize = this.testSelectPage1.pagesize;
      data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.handLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testSelectList1 = res.data.data;
              this.testSelectPage1.total = res.data.total;
            }
          }.bind(this)
        );
    },
    async loadBookTestList() {
      let data = {
        textbookId: this.bookId,
        tSubject: this.testSelectForm1.type,
        keyWord: this.testSelectForm1.keywords,
        page: this.testSelectPage1.page,
        pagesize: 10
      };
      // await this.getSubjectIds().then(() => {
      //   if (this.subjectIds.length > 0) {
      //     data.selectSubjectIds = this.subjectIds.join(",");
      //   }
      // });
      axios
        .request({
          method: "post",
          url: "/v1/bookSbLib/listWithCountBook",
          data
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            this.testSelectList1 = ret.data.data;
            this.testSelectPage1.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadVerifiedList() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              if (element) {
                this.bookList.push(element);
              }
            });
            this.bookId = this.bookList[0].textbookId;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 预览
    preview(row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    // 加载公共题库列表
    initComTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/queryMyBuyList",
          data: {
            hideUnUseFlag: true
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTKList = res.data;
            }
          }.bind(this)
        );
    },
    // 加载我的题库
    initMyTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTKList = this.removeEmptyChildren(ret.data);
          }
        });
    },
    removeEmptyChildren(data) {
      if (Array.isArray(data)) {
        // 判断是否是数组
        return data.map(item => {
          if (item.children && item.children.length > 0) {
            item.children = this.removeEmptyChildren(item.children); // 递归遍历
          } else {
            delete item.children; // 删除空的children字段
          }
          return item;
        });
      } else if (typeof data === "object") {
        // 判断是否是对象
        if (data.children && data.children.length > 0) {
          data.children = this.removeEmptyChildren(data.children); // 递归遍历
        } else {
          delete data.children; // 删除空的children字段
        }
        return data;
      }
    },
    // ----------------------------------选题结束--------------------

    showAnswerDetail(item) {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/answer/queryInfoList",
          data: {
            answerId: item.answerId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.courseWareAnswerList = ret.data;
            this.isCourseAnswerShow = true;
          }
        });
    },
    goBack() {
      if (this.goType == "ware") {
        this.$router.push({
          path: "/coursewareLib/myCoursewareLib"
        });
        return;
      }
      this.$router.push({
        path: "/class/classReport"
      });
    },
    //去预览
    toView() {
      let currentIndex =
        this.currentImg.thumbnailIndex || this.currentImg.thumbIndex;
      console.log("currentIndex", currentIndex);
      this.$router.push({
        path: "/claCourseware/viewCourseware",
        query: {
          goType: this.$route.query.goType,
          classId: this.classId,
          coursewareId: this.coursewareId,
          htmlUrl: this.htmlUrl,
          pages: this.pages,
          currentIndex
          // coursewareCurrentPage:
          //   this.currentImg.thumbnailIndex || this.currentImg.thumbIndex
        }
      });
    },
    // 加载教材列表
    loadTextBookList() {
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/updateBookShelf",
          data: {
            updated: 0
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.textBookList = ret.data.bookUpdate;
            this.resForm.textbookId = this.textBookList[0].textbookId;
            this.loadTextBookRes(); // 加载第一本教材的资源
          }
        });
    },
    //加载缩略图列表
    loadData() {
      let url = "/clazz/v4/courseware/thumbnail";
      let data = {
        coursewareId: this.coursewareId
      };
      if (this.goType === "ware") {
        url = "/clazz/v4/ware/thumbnail";
        data = {
          wareId: this.coursewareId
        };
      }
      axios
        .request({
          method: "post",
          url,
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.dataList = ret.data;
            if (this.goType === "ware") {
              this.$nextTick(() => {
                if (this.currentImg.thumbId) {
                  // eslint-disable-next-line standard/computed-property-even-spacing
                  document.getElementsByClassName("imgLi")[
                    this.currentImg.thumbIndex - 1
                  ].style.border = "3px solid rgba(43,161,244,1)";
                  // eslint-disable-next-line standard/computed-property-even-spacing
                  this.currentImg = this.dataList[
                    this.currentImg.thumbIndex - 1
                  ];
                } else {
                  document.getElementsByClassName("imgLi")[0].style.border =
                    "3px solid rgba(43,161,244,1)";
                  this.currentImg = this.dataList[0];
                  this.currentImg.thumbUrl = this.dataList[0].thumbUrl;
                }
              });
              return;
            }
            this.$nextTick(() => {
              if (this.currentImg.thumbnailId) {
                // eslint-disable-next-line standard/computed-property-even-spacing
                document.getElementsByClassName("imgLi")[
                  this.currentImg.thumbnailIndex - 1
                ].style.border = "3px solid rgba(43,161,244,1)";
                // eslint-disable-next-line standard/computed-property-even-spacing
                this.currentImg = this.dataList[
                  this.currentImg.thumbnailIndex - 1
                ];
              } else {
                document.getElementsByClassName("imgLi")[0].style.border =
                  "3px solid rgba(43,161,244,1)";
                this.currentImg = this.dataList[0];
                this.currentImg.thumbnailUrl = this.dataList[0].thumbnailUrl;
              }
            });
          }
        });
    },
    //点击左侧图片
    handleClickImg(item, el) {
      this.currentImg = item;
      let arr = document.getElementsByClassName("imgLi");
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        element.style.border = "1px solid rgba(197,206,213,1)";
      }
      el.target.style.border = "3px solid rgba(43,161,244,1)";
    },
    // 添加随堂测试
    handleSelectTest() {
      this.drawer = true;
    },
    handleCloseDrawer() {
      this.drawer = false;
    },
    fileChange(file) {
      if (file) {
        this.fileInfo.file = file;
        this.fileInfo.size = file.size;
        this.fileInfo.type = `${this.toResType(file.type)}`;
        this.fileInfo.name = file.name;
        // 不支持的文件类型不能上传
        if (this.fileInfo.type == 0) {
          this.$message({
            type: "warning",
            message: "不支持该文件类型"
          });
          return;
        }
        this.fileInfo.percentage = 0;
        this.isUploadShow = true;
        this.fileInfo.cloudId = "";
        if (this.fileInfo.type === "1" || this.fileInfo.type === "2") {
          // 音频和视频 用VOD上传
          this.uploader = this.vod.upload({
            mediaFile: this.fileInfo.file // file是js的文件引用
          });
          this.uploader.on("media_progress", info => {
            let p = Number(info.percent) * 100;
            this.fileInfo.percentage = parseFloat(p.toFixed(2));
          });
          this.uploader
            .done()
            .then(info => {
              this.uploader = null;
              this.fileInfo.resUrl = info.video.url;
              this.fileInfo.cloudId = info.fileId;
              this.uploadSubmit();
            })
            .catch(() => {
              this.fileInfo.percentage = 0;
              this.fileInfo.cloudId = "";
              this.$message({
                type: "warning",
                message: "不支持的音视频类型"
              });
            });
        } else {
          // 其他的 用COS上传
          let path =
            dateStr("YYYYMM") +
            "/" +
            this.$store.state.user.userId +
            new Date().valueOf() +
            common.getFileType(this.fileInfo.name);
          this.cos.putObject(
            {
              Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
              Region: this.cosConfig.region,
              Key: path,
              StorageClass: "STANDARD",
              Body: this.fileInfo.file,
              onProgress: curr => {
                let p = Number(curr.percent) * 100;
                this.fileInfo.percentage = parseFloat(p.toFixed(2));
              }
            },
            (err, result) => {
              this.taskList = [];
              if (!err) {
                this.fileInfo.resUrl = encodeURI(
                  `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                );
                this.uploadSubmit();
              } else {
              }
            }
          );
          this.taskList = this.cos.getTaskList();
        }
      }
    },
    //上传的常规资源提交到数据库
    uploadSubmit() {
      // 课件库本地上传资源
      if (this.goType == "ware") {
        axios
          .request({
            method: "post",
            url: "/v1/ware/addResource",
            data: {
              wareId: this.coursewareId,
              thumbnailIndex:
                this.currentImg.thumbnailIndex || this.currentImg.thumbIndex,
              resName: this.fileInfo.name,
              resUrl: this.fileInfo.resUrl,
              resSize: this.fileInfo.size,
              resType: this.fileInfo.type,
              cloudId: this.fileInfo.cloudId
            }
          })
          .then(res => {
            let ret = res.data;
            this.isUploadShow = false;
            setTimeout(() => {}, this.global.btnResumeTime);
            if (ret.code == 200) {
              this.fileInfo.percentage = 0;
              this.isUploadShow = false;
              this.loadData();
            }
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: "该服务不可用"
            });
          });
        return;
      }
      // 班级课件本地上传资源
      axios
        .request({
          method: "post",
          url: "/v1/courseware/addResource",
          data: {
            coursewareId: this.coursewareId,
            thumbnailIndex:
              this.currentImg.thumbnailIndex || this.currentImg.thumbIndex,
            resName: this.fileInfo.name,
            resUrl: this.fileInfo.resUrl,
            resSize: this.fileInfo.size,
            resType: this.fileInfo.type,
            cloudId: this.fileInfo.cloudId
          }
        })
        .then(res => {
          let ret = res.data;
          this.isUploadShow = false;
          setTimeout(() => {}, this.global.btnResumeTime);
          if (ret.code == 200) {
            this.fileInfo.percentage = 0;
            this.isUploadShow = false;
            this.loadData();
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "该服务不可用"
          });
        });
    },
    //取消上传
    doCancelUploadRes() {
      if (this.uploader) {
        this.uploader.cancel();
      }
      this.taskList.forEach(element => {
        this.cos.cancelTask(element.id);
      });
      this.fileInfo.percentage = 0;
      this.isUploadShow = false;
    },
    httprequest() {
      return false;
    },
    //找资源
    handleSelectRes() {
      this.loadResList();
      this.selectedRes = [];
      // this.$nextTick(() => {
      //   this.$refs["resTable"].clearSelection();
      // });
      this.isResShow = true;
      this.resForm.type = "0";
      this.resSearch();
    },
    loadTextBookRes() {
      this.tableLoading = true;
      axios
        .request({
          method: "post",
          url: "/resource/v4/tbMatchPic/pageResourceNormal",
          data: {
            textbookId: this.resForm.textbookId,
            type: this.resForm.resType,
            keyword: this.resForm.keyword,
            page: this.page.currentPage,
            pagesize: this.page.pagesize
          }
        })
        .then(data => {
          this.tableLoading = false;
          let res = data.data;
          if (res.code == 200) {
            this.page.total = res.data.total;
            this.resData = res.data.data;
          }
        });
    },
    //资源列表
    loadResList() {
      let url = "";
      let data = {};
      data.pagesize = this.page.pagesize;
      data.resType = this.resForm.resType;
      data.page = this.page.currentPage;
      data.resName = this.resForm.keyword;
      if (this.resForm.type == 0) {
        url = "/resource/v4/commonRL/itemsWithCount";
        data.rlrRlId = this.resForm.comLib;
      } else {
        url = "/resource/v4/personalRL/itemsWithCount";
        data.rlrRlId = this.resForm.myLib;
      }
      if (this.resForm.rlrParentNo) {
        data.rlrParentNo = this.resForm.rlrParentNo;
      } else {
        data.rlrParentNo = "0";
      }
      this.tableLoading = true;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(data => {
          this.tableLoading = false;
          let res = data.data;
          if (res.code == 200) {
            this.page.total = res.data.total;
            this.resData = res.data.data;
          }
        });
    },
    // 进入文件夹
    toFolder(row, index) {
      this.resForm.rlrParentNo = row.rlrNo;
      if (index === undefined) {
        let current = {
          name: row.resName,
          rlrNo: row.rlrNo
        };
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = true;
        }
        this.breadcrumb.push(current);
      } else {
        this.breadcrumb.splice(index + 1);
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = false;
        }
      }
      this.resForm.resType = "";
      this.page.currentPage = 1;
      this.loadResList();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.loadResList();
    },
    resSearch() {
      if (this.resForm.type == 2) {
        this.loadTextBookList();
      }
      this.resForm.keyword = "";
      this.page.currentPage = 1;
      this.loadResList();
    },
    textResSearch() {
      if (this.resForm.type == 2) {
        this.loadTextBookRes();
      }
    },
    changeSelect(selection) {
      this.selectedRes = selection;
    },
    getRowKeys(row) {
      return row.rlrId;
    },
    //确定添加资源
    doAddResSure() {
      if (this.selectedRes.length > 0) {
        let arr = [];
        this.selectedRes.forEach(el => {
          let contentJson = {};
          contentJson.contentName = el.resName;
          contentJson.contentUrl = el.resUrlWeb || el.resUrl;
          contentJson.contentObjId = el.rlrResourceId || el.id;
          contentJson.contentType = 1;
          contentJson.contentUrlIos = el.resUrlIos || el.resUrl;
          contentJson.contentUrlAndroid = el.resUrl;
          contentJson.contentSubType = el.resType;
          arr.push(contentJson);
        });
        let url = "/clazz/v4/courseware/addTContent";
        if (this.goType == "ware") {
          url = "/clazz/v4/ware/addTContent";
        }
        axios
          .request({
            method: "post",
            url,
            data: {
              coursewareId: this.coursewareId,
              thumbnailIndex:
                this.currentImg.thumbnailIndex || this.currentImg.thumbIndex,
              contentJson: JSON.stringify(arr)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isResShow = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.loadData();
            }
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: "该服务不可用"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择资源"
        });
      }
    },
    //查看资源
    handleViewRes(row) {
      let arr = {};
      arr.resUrlWeb = row.tContentUrl;
      arr.resType = row.tContentSubType;
      arr.resName = row.tContentName;
      this.viewResObj = arr;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    // 删除应答
    deletAnswer(item) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/clazz/v4/answer/delAnswer";
          if (this.goType == "ware") {
            url = "/clazz/v4/answer/delAnswer";
          }
          axios
            .request({
              method: "post",
              url,
              data: {
                answerId: item.answerId
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.loadData();
              }
            });
        })
        .catch(() => {});
    },
    //删除交互内容
    deletCContent(item) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/clazz/v4/courseware/removeTContent";
          if (this.goType == "ware") {
            url = "/clazz/v4/ware/removeTContent";
          }
          axios
            .request({
              method: "post",
              url,
              data: {
                // coursewareId: this.coursewareId,
                // thumbnailIndex:
                //   this.currentImg.thumbnailIndex || this.currentImg.thumbIndex,
                contentId: item.tContentId
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                const index = this.currentImg.tContentList.findIndex(
                  d => d.tContentId === item.tContentId
                );
                this.currentImg.tContentList.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 如果是文件夹不能选中
    isSelectable(row) {
      if (row && (row.resType == 11 || row.resType == 0)) {
        return false;
      }
      return true;
    },
    //table资源类型
    formatResType(row) {
      return common.resTypeFormat(row.resType);
    },
    //table资源大小
    formatResSize(row) {
      if (row.resSize) {
        if (row.resSize < 1024 * 1024) {
          return (row.resSize / 1024).toFixed(1) + "KB";
        } else {
          return (row.resSize / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    formatDate(row) {
      return format(row.updated);
    },
    //加载AR列表
    initARList() {
      axios
        .request({
          method: "post",
          url: "/resource/v4/commonRL/itemsWithCount",
          data: {
            page: 1,
            resType: 3,
            subjectId: this.cls.classSubjectId,
            isWeb: 1,
            pagesize: 150
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            ret.data.data.forEach(element => {
              element.checked = false;
            });
            this.arData = ret.data.data;
          }
        });
    },

    //显示AR
    arShow() {
      this.initARList();
      this.arData.forEach(element => {
        element.checked = false;
      });
      this.isARShow = true;
    },
    //确定添加AR
    doAddARSure() {
      let arr = [];
      arr = this.arData.filter((item, i) => {
        return item.checked == true;
      });
      if (arr.length > 0) {
        let arr1 = [];
        arr.forEach(el => {
          let contentJson = {};
          contentJson.contentName = el.resName;
          contentJson.contentUrl = el.resUrlWeb || el.resUrl;
          contentJson.contentType = 1;
          contentJson.contentSubType = el.resType;
          contentJson.contentUrlIos = el.resUrlIos || el.resUrl;
          contentJson.contentUrlAndroid = el.resUrl;
          arr1.push(contentJson);
        });
        let url = "/clazz/v4/courseware/addTContent";
        if (this.goType == "ware") {
          url = "/clazz/v4/ware/addTContent";
        }
        axios
          .request({
            method: "post",
            url,
            data: {
              coursewareId: this.coursewareId,
              thumbnailIndex:
                this.currentImg.thumbnailIndex || this.currentImg.thumbIndex,
              contentJson: JSON.stringify(arr1)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isARShow = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.loadData();
            }
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: "该服务不可用"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择AR资源"
        });
      }
    },
    // 加载公共资源库
    initComResLib() {
      axios
        .request({
          method: "post",
          url: "/resource/resourceLibrary/commonList",
          data: {
            rlIsOfficial: 1
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comLibList = res.data;
              this.comLibList.unshift({
                rlName: "全部",
                rlId: ""
              });
            }
          }.bind(this)
        );
    },
    // 加载我的资源库
    initMyResLib() {
      axios
        .request({
          method: "post",
          url: "/resource/v4/resource/selPersonalLibList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myLibList = ret.data;
            this.myLibList.unshift({
              libName: "全部",
              libId: ""
            });
          }
        });
    },
    /**
     * 根据文件类型 转换成 资源类型
     */
    toResType(fileType) {
      // file.name.endsWith(".flv") 判断字符串以什么结尾 true
      let type = 0;
      if (fileType.indexOf("image") === 0) {
        type = 10;
      } else if (fileType.indexOf("video") === 0) {
        type = 2;
      } else if (fileType.indexOf("audio") === 0) {
        type = 1;
      } else if (fileType.indexOf("application/pdf") === 0) {
        type = 9;
      } else if (
        fileType.indexOf("application/msword") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) === 0
      ) {
        type = 7;
      } else if (
        fileType.indexOf("application/mssheet") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) === 0
      ) {
        type = 4;
      } else if (fileType.indexOf("text/html") === 0) {
        type = 5;
      } else if (
        fileType.indexOf("application/vnd.ms-powerpoint") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) === 0
      ) {
        type = 6;
      }
      return type;
    },
    // 初始化COS
    initCosV5() {
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
    // 初始化VOD
    initVod() {
      axios
        .request({
          method: "post",
          url: "/v1/upload/vodSignature"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.vod = new Vod({
              getSignature: () => ret.data.signature
            });
          }
        });
    }
  }
};
</script>

<style lang="scss">
.taskTk {
  .el-dialog {
    height: 100%;
    margin-bottom: 0;
    border-radius: 0;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      height: 100%;
      padding: 0 !important;
    }
  }
}
.selectTip {
  /deep/ .el-dialog__body {
    height: 60vh;
    overflow: hidden;
    overflow-y: auto;
    .el-container {
      padding: 0;
      .el-aside {
        overflow-y: auto;
        .el-tree {
          background: #fbfbfb;
          padding: 10px 0;
        }
        .el-tree-node__label {
          display: inline-block;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .el-main {
        background: #ffffff;
        border-radius: 4px;
        min-height: 638px;
        padding: 20px 20px 0 20px;
        position: relative;
        .lisTitle {
          overflow: hidden;
          height: 36px;
          line-height: 36px;
          margin-bottom: 10px;
          .verLine {
            float: left;
            width: 3px;
            height: 16px;
            background: #2ba1f4;
            margin-top: 10px;
            margin-right: 8px;
          }
          .el-button {
            float: right;
          }
          span:nth-child(3) {
            color: #999999;
            font-size: 12px;
          }
          span:nth-child(4) {
            color: #999999;
            float: right;
          }
        }
        .emptyTipTs {
          margin-top: 15px;
          margin-left: 12px;
          font-size: 16px;
          color: #999999;
        }
        .el-tag {
          margin-right: 10px;
          margin-bottom: 5px;
        }
        .el-tag + .el-tag {
          margin-right: 10px;
        }
        .btmBtn {
          text-align: center;
          margin-top: 30px;
          .ts {
            font-size: 12px;
            color: #999999;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
.editCourseware {
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
    background: #f0f1f5;
    margin-top: 60px;
    height: 100%;
    padding: 0;
    overflow-y: scroll;
    .contentBox {
      width: 1034px;
      height: 100%;
      margin: 0 auto;
      .imgList {
        position: fixed;
        top: 0;
        bottom: 0;
        margin-top: 80px;
        transition: padding-top 0.3s;
        width: 283px;
        height: 100%;
        margin: 0;
        margin-top: 60px;
        list-style: none;
        overflow-y: scroll;
        padding-left: 0;
        padding-bottom: 16px;
        border-left: 1px solid rgba(197, 206, 213, 1);
        li {
          overflow: hidden;
          padding: 16px 20px 0;
          span {
            float: left;
            width: 15px;
          }
          img {
            margin-left: 15px;
            cursor: pointer;
            box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(197, 206, 213, 1);
            float: left;
            width: 202px;
            height: 147px;
          }
        }
      }
      .imgList::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background: rgba(240, 241, 245, 1);
        border-radius: 5px;
        border: 1px solid rgba(214, 220, 222, 1);
      }
      .imgList::-webkit-scrollbar-thumb {
        display: block;
        width: 7px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(196, 201, 205, 1);
      }
      .contentBoxRg {
        width: 100%;
        padding-left: 324px;
        // height: 100%;
        padding-bottom: 100px;
        .bigImg {
          width: 100%;
          margin-top: 16px;
        }
        .coursewareContent {
          margin-top: 15px;
          .el-col {
            margin-bottom: 15px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.1);
            padding: 21px;
            .left {
              float: left;
              cursor: pointer;
              img {
                width: 100px;
                height: 60px;
              }
            }
            .middle {
              float: left;
              margin: 0;
              padding: 0;
              margin-left: 10px;
              text-align: left;
              max-width: 58%;
              cursor: pointer;
            }
            .right {
              float: right;
            }
          }
        }
        .operationBtn {
          padding: 0;
          list-style: none;
          height: 66px;
          background: rgba(110, 142, 175, 1);
          box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          position: fixed;
          bottom: 0;
          padding: 0 24px;
          margin-left: 111px;
          li {
            float: left;
            text-align: center;
            width: 110px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            height: 100%;
            padding-top: 4px;
            img {
              width: 35px;
              height: 35px;
            }
          }
          li:hover {
            background: #50779d;
          }
          li:active {
            background: #50779d;
          }
          .uploadFile {
            position: relative;
            div:nth-child(3) {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
              .el-upload {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
  .el-main::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background: rgba(240, 241, 245, 1);
    border-radius: 5px;
    border: 1px solid rgba(214, 220, 222, 1);
  }
  .el-main::-webkit-scrollbar-thumb {
    display: block;
    width: 7px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(196, 201, 205, 1);
  }
  :focus {
    outline: 0;
  }
  .el-drawer__header {
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 15px;
  }
  .el-drawer__body {
    overflow-y: scroll;
    padding-bottom: 150px;
  }
  .el-drawer__body::-webkit-scrollbar {
    width: 8px;
    height: 2px;
    // background:#ccc;
    border-radius: 5px;
  }
  .el-drawer__body::-webkit-scrollbar-thumb {
    display: block;
    width: 8px;
    margin: 0 auto;
    border-radius: 5px;
    background: rgba(43, 161, 244, 0.6);
  }
  .addModal {
    .resPath {
      margin-top: 15px;
      margin-bottom: 15px;
      .path {
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
  .arModal {
    ul {
      list-style: none;
      overflow: hidden;
      height: 500px;
      overflow-y: scroll;
      li {
        float: left;
        width: 208px;
        position: relative;
        margin-right: 23px;
        margin-bottom: 45px;
        .el-checkbox {
          position: absolute;
          top: 0;
          left: 0;
          width: 208px;
          height: 125px;
          .el-checkbox__inner {
            width: 27px;
            height: 27px;
            border-radius: 4px;
          }
          .el-checkbox__inner::after {
            width: 6px;
            height: 16px;
            left: 9px;
          }
        }
        img {
          width: 208px;
          height: 125px;
        }
        .resName {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 6px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 18px;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
</style>
