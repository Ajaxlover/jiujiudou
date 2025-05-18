<template>
  <el-container class="myCoursewareLib">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="exam-list"
      ref="tabs"
    >
      <el-tab-pane label="我的课件" name="first">
        <el-main v-if="activeName == 'first'">
          <div
            style="display:flex;align-items:center;justify-content:space-between"
          >
            <div>
              <el-input
                size="small"
                v-model.trim="courseWareKeyWord"
                placeholder="请输入课件名称"
                @keyup.enter.native="courseWareSearch"
                style="width: 200px"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="courseWareSearch"
                class="el-icon-search"
              ></el-button>
            </div>
            <div style="display:flex">
              <div class="handleAddCourse" @click="handleAddCollection">
                新建课件集
              </div>
              <div
                class="handleAddCourse"
                style="margin-left:30px"
                @click="handleAddCourse"
              >
                导入课件
              </div>
            </div>
          </div>
          <div class="empty-exercise" v-if="courseWareListData.length === 0">
            <img src="@/assets/images/empty1.png" alt="" />
            <span>暂无课件</span>
          </div>
          <div v-else class="coursewareList" v-loading="loading.wareLoading">
            <div
              class="coursewareCard"
              v-for="item in courseWareListData"
              :key="item.wareId"
              @click="handleClickName(item)"
            >
              <div class="coursewareCardLeft">
                <div v-if="item.type == 1" class="excercise-logo">
                  <span>课件</span>
                </div>
                <div v-if="item.type == 2" class="excercise-collection">
                  <span>课件集</span>
                </div>
                <!-- <div
                  class="coursewareTask"
                  v-if="item.wareExerciseId"
                  @click="toEditCourseTask(item)"
                >
                  <span>作业</span>{{ item.wareExerciseName }}
                </div> -->
                <div
                  v-if="item.type == 1"
                  :title="item.wareName"
                  class="excercise-name"
                >
                  {{ item.wareName }}
                </div>
                <div
                  v-if="item.type == 2"
                  :title="item.wareName"
                  class="excercise-name"
                >
                  {{ item.wareName }}
                </div>
                <div class="excercise-time">
                  创建时间：{{ formatDate(item.wareCreateTime) }}
                </div>
                <!-- <div class="coursewareData">
                  {{ formatDate(item.wareCreateTime) }}
                </div>
                <div class="coursewareName" @click="handleClickName(item)">
                  <span>课件</span>{{ item.wareName }}
                </div> -->
                <!-- <div
                  class="coursewareTask"
                  v-if="item.wareExerciseId"
                  @click="toEditCourseTask(item)"
                >
                  <span>作业</span>{{ item.wareExerciseName }}
                </div> -->
                <!-- <div
                  class="coursewareTaskAdd"
                  v-else
                  @click="toEditCourseTask(item)"
                >
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
                    <!-- v-if="item.wareIsTranscode == 2" -->
                    <el-dropdown-item
                      divided
                      @click.native="handleCreatWareCopy(item)"
                      >创建副本
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:100px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleShareWare(item)"
                      >分享
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:128px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="item.type == 1"
                      @click.native="moveWare(item)"
                      >移入课件集
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:85px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item
                      divided
                      @click.native="deleteCourseWare(item)"
                      >删除课件
                      <i
                        class="el-icon-delete"
                        style="color:#0177D5;margin-left:100px"
                      ></i>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="btn">
                  <el-button
                    size="small"
                    type="primary"
                    v-if="item.wareIsTranscode == 3"
                    @click.stop="againUpload(item)"
                    style="margin-left:15px"
                    >重新上传</el-button
                  >
                  <el-button
                    size="small"
                    v-if="item.type == 1"
                    @click.stop="toEditCourseware(item)"
                    >编辑</el-button
                  >
                  <!-- <el-button
                    size="small"
                    type="primary"
                    @click="goToCourseware(item)"
                    >{{
                      item.wareStatus == 1 ? "继续上课" : "关联班级"
                    }}</el-button
                  > -->
                  <el-button
                    size="small"
                    type="primary"
                    @click.stop="goToCourseware(item)"
                    >关联班级</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="作业" name="second">
        <el-main v-if="activeName == 'second'">
          <div
            style="display:flex;align-items:center;justify-content:space-between"
          >
            <div>
              <el-input
                size="small"
                v-model.trim="excerciseKeyWord"
                placeholder="请输入作业名称"
                @keyup.enter.native="excerciseSearch"
                style="width: 200px"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="excerciseSearch"
                class="el-icon-search"
              ></el-button>
            </div>
            <div class="handleAddCourse" @click="toAddExercise">创建作业</div>
          </div>
          <div class="empty-exercise" v-if="excerciseListData.length === 0">
            <img src="@/assets/images/empty1.png" alt="" />
            <span>暂无作业</span>
          </div>
          <div
            v-else
            class="coursewareList"
            v-loading="loading.exerciseLoading"
          >
            <div
              class="coursewareCard"
              v-for="item in excerciseListData"
              :key="item.exerciseId"
              @click="toEditExercise(item)"
            >
              <div class="coursewareCardLeft">
                <div class="excercise-logo">
                  <span>作业</span>
                </div>
                <div class="excercise-name">
                  {{ item.exerciseName }}
                </div>
                <div class="excercise-time">
                  创建时间：{{ formatDate(item.exerciseCreateTime) }}
                </div>
              </div>
              <div class="coursewareCardRight" @click.stop>
                <el-dropdown class="moreBtn" trigger="click">
                  <i class="el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleExerciseName(item)"
                      >作业重命名
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:85px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item
                      divided
                      @click.native="handleExerciseCopy(item)"
                      >创建副本
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:100px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleShareExercise(item)"
                      >分享
                      <i
                        class="el-icon-arrow-right"
                        style="color:#0177D5;margin-left:128px"
                      ></i>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="deleteExercise(item)"
                      >删除作业
                      <i
                        class="el-icon-delete"
                        style="color:#0177D5;margin-left:100px"
                      ></i>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="btn">
                  <el-button size="small" @click.stop="toEditExercise(item)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click.stop="toPublishExercise(item)"
                    >发布</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="班级云课" name="third">
        <el-main class="third-main" v-if="activeName == 'third'">
          <div class="top">
            <el-input
              size="small"
              v-model="keyWord"
              placeholder="搜索班课"
              style="width: 200px"
              @keyup.enter.native="courseSerch"
            ></el-input>
            <el-button
              size="small"
              type="primary"
              @click="courseSerch"
              class="el-icon-search"
            ></el-button>
            <div class="operateBtn">
              <el-button size="small" type="primary" @click="importCourse"
                >导入云课</el-button
              >
              <el-button
                size="small"
                type="primary"
                icon="el-icon-plus"
                @click="newCourse"
                >新建班级云课</el-button
              >
            </div>
          </div>
          <div class="main">
            <el-table
              :data="courseListData"
              border
              :row-style="{ height: '120px' }"
              :show-header="false"
              v-loading="loadingClassCourse.tableLoading"
            >
              <el-table-column
                prop="tname"
                label="书名"
                align="center"
                min-width="600"
              >
                <div slot-scope="scope" class="info">
                  <div class="left">
                    <img
                      style="cursor: pointer;"
                      v-if="scope.row.coverUrl"
                      :src="scope.row.coverUrl"
                      class="userPic"
                      @click="bigImg(scope.row)"
                    />
                    <img v-else src="@/assets/images/cloudCourseCover.png" />
                  </div>
                  <div class="middle">
                    <div class="name" @click="courseDetail(scope.row)">
                      {{ scope.row.claCName }}
                    </div>
                    <div class="cloudId">班课ID: {{ scope.row.claCUUID }}</div>
                    <div class="courseTime">
                      更新时间: {{ dateFormat(scope.row.modifyTime) }}
                    </div>
                  </div>
                  <div class="right">
                    <div
                      v-if="!scope.row.claList || scope.row.claList.length == 0"
                    >
                      未绑定班级
                    </div>
                    <div v-else>
                      <el-dropdown
                        trigger="click"
                        :hide-on-click="false"
                        class="dropdownBtn"
                      >
                        <span
                          class="el-dropdown-link"
                          style="color:#409EFF;font-size:12px;cursor: pointer;"
                        >
                          学习进度
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" style="top:200px">
                          <el-dropdown-item
                            v-for="item in scope.row.claList"
                            :key="item.clId"
                            @click.native="
                              lookLearnProcess(scope.row, item.clId)
                            "
                            >{{ item.clName }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </el-table-column>
              <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="editCourse(scope.row)"
                    style="margin-left:0"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="bindCourse(scope.row)"
                    style="margin-left:0"
                    >绑定</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="shareCourse3(scope.row)"
                    style="margin-left:0"
                    >分享</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteCourse(scope.row)"
                    style="margin-left:0"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div class="right-footer-first">
                从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
                {{
                  (this.page.currentPage - 1) * this.page.pagesize +
                    this.courseListData.length
                }}
                记录，共 {{ page.total }} 条
              </div>
              <el-pagination
                layout="prev, pager, next, jumper"
                background
                :total="page.total"
                :current-page.sync="page.currentPage"
                :page-size="page.pagesize"
                @current-change="loadData3"
              ></el-pagination>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-header style="height: 50px">
      我的课件
    </el-header>
    <el-main>
      <div class="handleAddCourse" @click="handleAddCourse">新建授课</div>
      <div class="coursewareList">
        <div
          class="coursewareCard"
          v-for="item in courseWareListData"
          :key="item.wareId"
        >
          <div class="coursewareCardLeft">
            <div class="coursewareData">
              {{ formatDate(item.wareCreateTime) }}
            </div>
            <div class="coursewareName" @click="handleClickName(item)">
              <span>课件</span>{{ item.wareName }}
            </div>
            <div
              class="coursewareTask"
              v-if="item.wareExerciseId"
              @click="toEditCourseTask(item)"
            >
              <span>作业</span>{{ item.wareExerciseName }}
            </div>
            <div
              class="coursewareTaskAdd"
              v-else
              @click="toEditCourseTask(item)"
            >
              <i class="el-icon-circle-plus-outline"></i> 添加作业
            </div>
          </div>
          <div class="coursewareCardRight">
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
                <el-dropdown-item
                  @click.native="handleExerciseName(item)"
                  v-if="item.wareExerciseId"
                  >作业重命名
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:85px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  v-if="item.wareIsTranscode == 2"
                  @click.native="handleCreatWareCopy(item)"
                  >创建副本
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item @click.native="handleShareWare(item)"
                  >分享
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:128px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="deleteCourseWare(item)"
                  >删除课件
                  <i
                    class="el-icon-delete"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="deleteExercise(item)"
                  v-if="item.wareExerciseId"
                  >删除作业
                  <i
                    class="el-icon-delete"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="btn">
              <el-button
                size="small"
                type="primary"
                v-if="item.wareIsTranscode == 3"
                @click="againUpload(item)"
                style="margin-left:15px"
                >重新上传</el-button
              >
              <el-button size="small" @click="toEditCourseware(item)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="goToCourseware(item)"
                >{{ item.wareStatus == 1 ? "继续上课" : "关联班级" }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-main> -->
    <!-- 新建课件集 -->
    <el-dialog
      :visible.sync="isAddModeShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建课件集</div>
        </div>
      </template>
      <el-form
        :model="modeAddForm"
        :rules="modeAddFormRules"
        ref="modeAddForm"
        label-width="100px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <el-form-item label="课件集名称" prop="name">
          <el-input v-model.trim="modeAddForm.name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="addCollectionSure"
          >确定</el-button
        >
        <el-button size="small" @click="isAddModeShow = false" type="primary"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 新建作业 -->
    <el-dialog
      :visible.sync="isAddExcerciseShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建作业</div>
        </div>
      </template>
      <el-form
        :model="excerciseAddForm"
        :rules="excerciseAddFormRules"
        ref="excerciseAddForm"
        label-width="100px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <el-form-item label="作业名称" prop="name">
          <el-input
            v-model.trim="excerciseAddForm.name"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="addExcerciseSure"
          >确定</el-button
        >
        <el-button
          size="small"
          @click="isAddExcerciseShow = false"
          type="primary"
          >取消</el-button
        >
      </span>
    </el-dialog>
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

    <!-- 选择课件集 -->
    <el-dialog
      top="6vh"
      v-if="isMoveShow"
      :visible.sync="isMoveShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseMove"
      width="1000px"
      class="collection-list"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择课件集</div>
        </div>
      </template>

      <el-table
        @row-click="handleRowClick"
        :data="collectionList"
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
        <!-- <el-table-column align="center" type="selection" width="40">
        </el-table-column> -->
        <el-table-column align="center" label="" width="38">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.wareId"
              v-model="radioSelect"
              @change.native="getRow(scope.$index, scope.row)"
            >
              <span>&nbsp</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="课件集名称" prop="wareName">
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

      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :disabled="isAbleMove"
          @click="doMove"
          >移入</el-button
        >

        <el-button size="small" @click="handleCloseMove">取消</el-button>
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
          <div>{{ currentCollection.wareName }}</div>
          <div class="item-collection">
            <span>课件集</span>
          </div>
        </div>
      </template>

      <div class="top">
        <el-button type="primary" size="medium" @click="handleAddCourse"
          >导入课件</el-button
        >
      </div>
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
          :key="item.wareId"
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
              :title="item.wareName"
              v-if="item.type == 1"
            >
              {{ item.wareName }}
            </div>
            <div
              class="excercise-name"
              :title="item.wareName"
              v-if="item.type == 2"
            >
              {{ item.wareName }}
            </div>
            <div class="excercise-time">
              创建时间：{{ formatDate(item.wareCreateTime) }}
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
                <!-- <el-dropdown-item
                  divided
                  @click.native="handleCreatWareCopy(item)"
                  >创建副本
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:100px"
                  ></i>
                </el-dropdown-item> -->
                <el-dropdown-item @click.native="handleShareWare(item)"
                  >分享
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:128px"
                  ></i>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="item.type == 1"
                  @click.native="moveOutWare(item)"
                  >移出课件集
                  <i
                    class="el-icon-arrow-right"
                    style="color:#0177D5;margin-left:128px"
                  ></i>
                </el-dropdown-item>
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
                type="primary"
                v-if="item.wareIsTranscode == 3"
                @click.stop="againUpload(item)"
                style="margin-left:15px"
                >重新上传</el-button
              >
              <el-button
                size="small"
                v-if="item.type == 1"
                @click.stop="toEditCourseware(item)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click.stop="goToCourseware(item)"
                >关联班级</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 选择班级 -->
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
          <div>选择班级</div>
        </div>
      </template>

      <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="classKeyWord"
          placeholder="请输入班级名称"
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
        <el-table-column label="班级名称" prop="paperName">
          <template slot-scope="scope">
            <span>{{ scope.row.classname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="班级人数"
          prop="stuNum"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="teaName"
          align="center"
          width="200px"
        >
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
          @click="bindSure"
          type="primary"
          >关联班级</el-button
        >

        <el-button size="small" @click="handleCloseTransPaper">取消</el-button>
      </span>
    </el-dialog>
    <!-- 选择班级 -->
    <el-dialog
      :visible.sync="isBindShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>请选择班级</div>
        </div>
      </template>
      <el-radio-group v-model="bindValue">
        <el-radio
          :disabled="item.isLike == 1"
          v-for="(item, index) in bindClassList"
          :key="index"
          :label="item.clId"
          >{{ item.clName }}</el-radio
        >
      </el-radio-group>
      <div class="inputTips" style="text-align:center;margin-top:5px">
        目前暂时只能选定1个班级进行上课，如果存在多个班同时上课的情况，请将学生加入到同一个班级中。
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.bindSureLoading"
          @click="bindSure"
          :disabled="bindValue == ''"
          >确定</el-button
        >
        <el-button size="small" @click="isBindShow = false">取消</el-button>
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
        <el-form-item label="作业名称" prop="exerciseName">
          <el-input size="small" v-model="exerciseForm.exerciseName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doEditExerciseName"
          >确定</el-button
        >
        <el-button size="small" @click="isExerciseShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 课件分享 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取分享内容，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2">
        <span style="color:#999;margin-right:15px;">分享内容</span>
        <span>{{ currentShareBank.wareName }}</span>
      </div>
      <div style="font-size:18px;margin-top:30px;overflow:hidden;" v-else>
        <span style="color:#999;margin-right:15px;float:left;margin-top:5px;"
          >链接</span
        >
        <el-input v-model="shareLink" style="width:550px;float:left;">
          <el-button slot="append" @click="resetLink">重置</el-button>
        </el-input>
        <el-button
          type="primary"
          style="margin-left:20px;float:left;"
          @click="copyShareLink"
          >复制链接</el-button
        >
        <div
          style="color:#999999;float:left;width:100%;font-size:14px;margin-top:20px;"
        >
          点击重置后，原链接会失效。
        </div>
      </div>
      <span slot="footer">
        <el-button @click="isShareShow = false" v-if="!shareModal2"
          >取消</el-button
        >
        <el-button type="primary" @click="toCreateShareLink" v-if="!shareModal2"
          >创建分享链接</el-button
        >
        <!-- <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        > -->
      </span>
    </el-dialog>

    <!-- 作业分享 -->
    <el-dialog
      :visible.sync="isShareShowExercise"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>作业分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取您分享出去的作业，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2Exercise">
        <span style="color:#999;margin-right:15px;">分享作业</span>
        <span>{{ currentShareBankExercise.exerciseName }}</span>
      </div>
      <div style="font-size:18px;margin-top:30px;overflow:hidden;" v-else>
        <span style="color:#999;margin-right:15px;float:left;margin-top:5px;"
          >链接</span
        >
        <el-input v-model="shareLinkExercise" style="width:550px;float:left;">
          <el-button slot="append" @click="resetLink2">重置</el-button>
        </el-input>
        <el-button
          type="primary"
          style="margin-left:20px;float:left;"
          @click="copyShareLink2"
          >复制链接</el-button
        >
        <div
          style="color:#999999;float:left;width:100%;font-size:14px;margin-top:20px;"
        >
          点击重置后，原链接会失效。
        </div>
      </div>
      <span slot="footer">
        <el-button
          @click="isShareShowExercise = false"
          v-if="!shareModal2Exercise"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="toCreateShareLink2"
          v-if="!shareModal2Exercise"
          >创建分享链接</el-button
        >
        <!-- <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        > -->
      </span>
    </el-dialog>

    <!-- 发布作业选择班级弹窗 -->
    <el-dialog
      :visible.sync="isSelectClassShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-if="isSelectClassShow"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            发布作业
          </div>
        </div>
      </template>
      <!-- style="height:200px;overflow-y: auto;margin:0 auto" -->
      <div style="width:600px;margin:0 auto">
        <el-form
          ref="publishForm"
          :model="publishForm"
          :rules="publishFormRules"
          label-width="80px"
        >
          <el-form-item label="作业名称" prop="name">
            <el-input size="small" v-model="publishForm.name"></el-input>
          </el-form-item>
          <el-form-item label="作业时间" prop="value1">
            <el-date-picker
              size="small"
              v-model="publishForm.value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="选择班级" prop="checkList">
            <el-checkbox-group size="small" v-model="publishForm.checkList">
              <div
                style="height:240px;overflow-y: auto;display: flex;flex-direction:column"
              >
                <el-checkbox
                  v-for="(item, index) in classList"
                  :key="index"
                  :label="item.classId"
                  >{{ item.classname
                  }}<span v-if="item.isAssistant"
                    >（协助班级）</span
                  ></el-checkbox
                >
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <!-- <div>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in classList"
              :key="index"
              :label="item.classId"
              >{{ item.classname }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="startTimeContainer">
          <div style="margin-right:0px">开始时间：</div>
          <el-date-picker
            size="small"
            ref="datePicker"
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择"
            :prefix-icon="
              datePickShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
            :editable="false"
            :clearable="false"
            @focus="datePickShow = true"
            @blur="datePickShow = false"
          ></el-date-picker>
        </div>
        <div class="deadlineContainer">
          <div style="margin-right:0px">结束时间：</div>
          <el-date-picker
            size="small"
            ref="datePicker"
            v-model="deadline"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择"
            :prefix-icon="
              datePickShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
            :editable="false"
            :clearable="false"
            @focus="datePickShow = true"
            @blur="datePickShow = false"
          ></el-date-picker>
        </div> -->
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="publishExercise"
          >发布</el-button
        >
        <el-button size="small" @click="isSelectClassShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- --------------------------班级云课------------------------------------------- -->

    <!-- 导入云课 -->
    <el-dialog
      :visible.sync="isImportShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
      class="importModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>选择云课</div>
        </div>
      </template>
      <el-input
        size="small"
        v-model="importKeyWord"
        placeholder="云课ID、云课标题、老师"
        style="width: 200px"
        @keyup.enter.native="loadImportData"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="loadImportData"
      ></el-button>
      <el-table
        :data="dataList"
        v-loading="loading.importTableLoading"
        style="margin-top:15px;"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="选择" align="center" width="60px">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.ccourseId"
              v-model="importResRadio"
              @change="importResRadioData(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="云课ID"
          prop="ccourseUuid"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="云课标题"
          prop="ccourseName"
          align="center"
          min-width="200px"
        ></el-table-column>
        <el-table-column
          label="老师"
          prop="ccourseTeacherName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="价格"
          prop="ccoursePrice"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          label="云课分类"
          prop="ccourseType"
          align="center"
          :formatter="formatCourseType"
        ></el-table-column>
        <!-- <el-table-column label="开课用户" align="center" width="300">
          <div slot-scope="scope" class="info">{{scope.row.creatorName}}({{scope.row.mobile}})</div>
        </el-table-column> -->
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.importPage.currentPage - 1) * this.importPage.pagesize + 1 }}
          到
          {{
            (this.importPage.currentPage - 1) * this.importPage.pagesize +
              this.dataList.length
          }}
          记录，共 {{ importPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="importPage.total"
          :current-page.sync="importPage.currentPage"
          :page-size="importPage.pagesize"
          @current-change="loadImportData"
        ></el-pagination>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.importLoadingSure"
          @click="doImport"
          >确定</el-button
        >
        <el-button size="small" @click="isImportShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 绑定班级 -->
    <el-dialog
      :visible.sync="isBindShowClassCourse"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>绑定班级</div>
        </div>
      </template>
      <!-- <el-transfer
        filterable
        filter-placeholder="请输入搜索内容"
        :titles="['我的班级', '已绑定班级']"
        v-model="bindValue"
        :data="classListData">
      </el-transfer> -->
      <el-checkbox-group
        v-model="bindValueClassCourse"
        style="padding-left:90px;"
      >
        <el-checkbox
          v-for="(item, index) in bindClassListClassCourse"
          :key="index"
          :label="item.clId"
          style="display:block;margin-bottom:10px"
          :disabled="item.clCoUuid && currentCourse.claCUUID != item.clCoUuid"
          >{{ item.clName }}</el-checkbox
        >
      </el-checkbox-group>
      <div class="inputTips" style="text-align:center;margin-top:30px">
        每个班级限1个云课，当班级已绑定其他云课时需先解除绑定
      </div>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :loading="loadingClassCourse.bindSureLoading"
          @click="bindSure3"
          >确定</el-button
        >
        <el-button size="small" @click="isBindShowClassCourse = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 云课封面大图 -->
    <el-dialog
      :visible.sync="isBigImageShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面</div>
        </div>
      </template>
      <img :src="currentCourse.coverUrl" alt="" style="width:560px;" />
    </el-dialog>
    <!-- 班级云课分享 -->
    <el-dialog
      :visible.sync="isShareShowClassCourse"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取分享内容，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div
        style="font-size:18px;margin-top:30px;"
        v-if="!shareModal2ClassCourse"
      >
        <span style="color:#999;margin-right:15px;">分享内容</span>
        <span>{{ currentShareContent.claCName }}</span>
      </div>
      <div style="font-size:18px;margin-top:30px;overflow:hidden;" v-else>
        <span style="color:#999;margin-right:15px;float:left;margin-top:5px;"
          >链接</span
        >
        <el-input
          v-model="shareLinkClassCourse"
          style="width:550px;float:left;"
        >
          <el-button slot="append" @click="resetLink3">重置</el-button>
        </el-input>
        <el-button
          type="primary"
          style="margin-left:20px;float:left;"
          @click="copyShareLink3"
          >复制链接</el-button
        >
        <div
          style="color:#999999;float:left;width:100%;font-size:14px;margin-top:20px;"
        >
          点击重置后，原链接会失效。
        </div>
      </div>
      <span slot="footer">
        <el-button
          @click="isShareShowClassCourse = false"
          v-if="!shareModal2ClassCourse"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="toCreateShareLink3"
          v-if="!shareModal2ClassCourse"
          >创建分享链接</el-button
        >
        <!-- <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        > -->
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import COS from "cos-js-sdk-v5";
import common from "@/utils/common";
import { formatYMD, dateStr, format } from "@/utils/datetime";

export default {
  data() {
    return {
      publishForm: {
        name: "",
        value1: "",
        checkList: [],
        exerciseId: ""
      },
      publishFormRules: {
        name: [{ required: true, message: "请输入作业名称", trigger: "blur" }],
        value1: [
          {
            // type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        checkList: [
          {
            type: "array",
            required: true,
            message: "请选择班级",
            trigger: "change"
          }
        ]
      },
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      datePickShow: false,
      startTime: "", // 作业开始时间
      deadline: "", // 作业结束时间
      checkList: [],
      isSelectClassShow: false, // 发布作业弹框
      isShareShowExercise: false, // 作业分享弹框
      shareModal2Exercise: false, // 作业分享弹框第二部分
      currentShareBankExercise: {}, // 分享的作业
      shareLinkExercise: "",
      tsCodeExercise: "",
      collectionItemList: [],
      currentCollection: {}, // 当前课件集
      isCollectionItemShow: false,
      radioSelect: "", // 课件集id
      radioCheck: {}, // 课件集id
      currentMoveWare: {},
      isMoveShow: false,
      collectionList: [],
      isTransPaperShow: false,
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "", // 班级名称
      isAddExcerciseShow: false, // 新建作业
      excerciseAddForm: {
        name: ""
      },
      excerciseAddFormRules: {
        name: [{ required: true, message: "请输入作业名称", trigger: "click" }]
      },
      isAddModeShow: false, // 新建课件集
      modeAddForm: {
        name: ""
      },
      modeAddFormRules: {
        name: [
          { required: true, message: "请输入课件集名称", trigger: "click" }
        ]
      },
      courseWareKeyWord: "",
      excerciseKeyWord: "",
      activeName: sessionStorage.getItem("exerciseTabs")
        ? sessionStorage.getItem("exerciseTabs")
        : "first",
      cls: {}, //当前班级信息
      courseWareListData: [],
      excerciseListData: [],
      currentCreatCoursewareId: "", // 新建的正在转码的课件的CoursewareId
      currentRow: {},
      isAgainUpload: false,
      isAddShow: false,
      isBindShow: false,
      bindValue: "",
      classListData: [],
      bindClassList: [],
      currentBindValue: [],
      loading: {
        addSureLoading: false,
        wareLoading: false,
        exerciseLoading: false
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
      isShareShow: false, // 分享弹框
      shareModal2: false, // 是否展示分享弹框的第二部分
      currentShareBank: {},
      shareLink: "",
      csCode: "",
      // 腾讯云 上传
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      taskList: [],
      bindTimer: 0,
      queryResult: {},
      // ----------------------班级云课------------------------
      isShareShowClassCourse: false, // 班级云课分享弹窗
      shareModal2ClassCourse: false, // 是否展示分享弹框的第二部分
      shareLinkClassCourse: "", // 班级云课分享链接
      currentShareContent: {},
      csCodeClassCourse: "",
      isBigImageShow: false,
      isBindShowClassCourse: false,
      keyWord: "",
      courseListData: [],
      loadingClassCourse: {
        tableLoading: false,
        loadingChangePrice: false,
        bindSureLoading: false,
        importTableLoading: false,
        importLoadingSure: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      currentCourse: {},
      bindValueClassCourse: [],
      classListDataClassCourse: [],
      //导入云课参数
      isImportShow: false,
      importKeyWord: "",
      importResRadio: "",
      currentRowCourse: {},
      dataList: [],
      importPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      bindClassListClassCourse: [],
      currentBindValueClassCourse: []
    };
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    },
    isAbleMove() {
      return !this.radioSelect;
    }
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.initCos();
    if (this.activeName == "first") {
      this.loadData();
    } else if (this.activeName == "second") {
      this.loadData2();
    } else {
      this.loadData3();
    }
    this.getClassList();
  },
  beforeDestroy() {
    // sessionStorage.removeItem("exerciseTabs");
  },
  methods: {
    toPublishExercise(item) {
      this.isSelectClassShow = true;
      this.publishForm.name = item.exerciseName;
      this.publishForm.value1 = "";
      this.publishForm.checkList = [];
      this.publishForm.exerciseId = item.exerciseId;
    },
    publishExercise() {
      this.$refs["publishForm"].validate(valid => {
        if (valid) {
          // 发布作业
          axios
            .request({
              method: "post",
              url: "/clazz/exercisesv3/publishBatchFromExercises",
              data: {
                exerciseName: this.publishForm.name,
                exerciseId: this.publishForm.exerciseId,
                startTime: this.publishForm.value1[0],
                endTime: this.publishForm.value1[1],
                classIds: this.publishForm.checkList.join(",")
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("distribute_exercise");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.$message({
                  type: "success",
                  message: "发布作业成功"
                });
                this.isSelectClassShow = false;
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        } else {
          return false;
        }
      });
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
          url: "/clazz/v4/ware/list",
          data: {
            parentId: this.currentCollection.wareId,
            type: 1
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
    doMove() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/moveInCollection",
          data: {
            wareId: this.currentMoveWare.wareId,
            wareCollectionId: this.radioSelect
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "移入课件集成功"
            });
            this.isMoveShow = false;
            this.radioSelect = "";
            this.radioCheck = {};
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleCloseMove() {
      this.radioSelect = "";
      this.radioCheck = {};
      this.isMoveShow = false;
    },
    handleRowClick(row, column, event) {
      this.radioSelect = row.paperId;
      this.radioCheck = row;
    },
    getRow(i, row) {
      this.radioCheck = row;
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
    handleCloseCollectionItems() {
      this.currentCollection = {};
      this.isCollectionItemShow = false;
      this.collectionItemList = [];
    },
    searchClass() {
      this.classPage.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      let data = {
        isMasterhead: 0,
        isQueryAssistant: 1
      };
      // data.pageNo = this.classPage.currentPage;
      // data.pageSize = 999;
      // if (this.classKeyWord) {
      //   data.className = this.classKeyWord;
      // }
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClass",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(cls => {
              if (cls.status == 0) {
                this.classList.push(cls);
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleClick(tab, event) {
      sessionStorage.setItem("exerciseTabs", tab.name);

      if (tab.name == "second") {
        this.loadData2();
      } else if (tab.name == "first") {
        this.loadData();
      } else if (tab.name == "third") {
        this.loadData3();
      }
    },
    courseWareSearch() {
      this.loadData();
    },
    excerciseSearch() {
      this.loadData2();
    },
    //作业列表
    loadData2() {
      let data = {
        page: 1,
        pageSize: 999
      };
      if (this.excerciseKeyWord) {
        data.keyWord = this.excerciseKeyWord;
      }
      // this.loading.exerciseLoading = true;
      axios
        .request({
          method: "post",
          // url: "/clazz/v4/ware/list",
          url: "/tiku/v4/exercise/exerciseList",
          data
        })
        .then(res => {
          this.isAddShow = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.excerciseListData = ret.data;
            // this.loading.exerciseLoading = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载课件列表
    loadData() {
      let data = {};
      if (this.courseWareKeyWord) {
        data.keyWord = this.courseWareKeyWord;
      }
      this.loading.wareLoading = true;
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/list",
          data
        })
        .then(res => {
          this.isAddShow = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.courseWareListData = ret.data;
            this.loading.wareLoading = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toAddExercise() {
      // -----------------------------------------------------------------
      this.isAddExcerciseShow = true;
      this.excerciseAddForm.name = "";
      this.$nextTick(() => {
        this.$refs.excerciseAddForm.clearValidate();
      });
    },
    addExcerciseSure() {
      this.$refs["excerciseAddForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/ware/addExercise",
              data: {
                exerciseName: this.excerciseAddForm.name,
                type: 1 // 作业库作业
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.isAddExcerciseShow = false;
                this.$router.push({
                  path: "/claCourseware/editLibTask",
                  query: {
                    exerciseId: ret.data.exerciseId
                  }
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    // 新建课件集
    handleAddCollection() {
      this.isAddModeShow = true;
      this.modeAddForm.name = "";
      this.$nextTick(() => {
        this.$refs.modeAddForm.clearValidate();
      });
    },
    // 新建课件集确定
    addCollectionSure() {
      this.$refs["modeAddForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/ware/createCollection",
              data: {
                wareName: this.modeAddForm.name
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.isAddModeShow = false;
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("create_ware_collection");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
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
        url = "/clazz/v4/ware/reCreateAndTranscode";
        data.wareId = this.currentRow.coursewareId;
      } else {
        // 新上传
        url = "/clazz/v4/ware/createAndTranscode";
        data.wareName = this.addForm.showPptName
          .substring(0, this.addForm.showPptName.lastIndexOf("."))
          .substring(0, 30);
      }
      data.wareSourceUrl = this.addForm.addPptUrl;
      if (this.currentCollection.wareId) {
        data.parentId = this.currentCollection.wareId;
      }
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200 && ret.data.wareTaskId) {
            this.currentCreatCoursewareId = ret.data.wareId;
            this.uploadTimer = setInterval(() => {
              this.toGetprocess(ret.data.wareTaskId);
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
          url: "/clazz/v4/ware/complete",
          data: {
            wareId: this.currentCreatCoursewareId,
            wareUrl: this.addForm.coursewareUrl,
            wareThumbnailPrefix: this.addForm.thumbnail_url,
            wareThumbnailNum: this.addForm.ThumbnailNum
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
            // this.$router.push({
            //   path: "/claCourseware/editCourseware",
            //   query: {
            //     classId: this.cls.classId,
            //     coursewareId: this.currentCreatCoursewareId,
            //     htmlUrl: this.addForm.coursewareUrl,
            //     pages: this.addForm.ThumbnailNum,
            //     coursewareName: this.addForm.showPptName
            //       .substring(0, this.addForm.showPptName.lastIndexOf("."))
            //       .substring(0, 30)
            //   }
            // });
            this.currentRow = {};
            this.isAgainUpload = false;
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("import_ware");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.loadData();
            if (this.currentCollection.wareId) {
              this.getCollectionItems();
            }
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
      this.coursewareForm.coursewareId = row.wareId;
      this.coursewareForm.coursewareName = row.wareName;
      this.isCoursewareShow = true;
    },
    doEditCwareName() {
      this.$refs["coursewareForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/ware/rename",
              data: {
                wareId: this.coursewareForm.coursewareId,
                wareName: this.coursewareForm.coursewareName
              }
            })
            .then(res => {
              this.isCoursewareShow = false;
              let ret = res.data;
              if (ret.code === 200) {
                this.loadData();
                if (this.currentCollection.wareId) {
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
      this.exerciseForm.exerciseId = row.exerciseId;
      this.exerciseForm.exerciseName = row.exerciseName;
      this.isExerciseShow = true;
    },
    doEditExerciseName() {
      this.$refs["exerciseForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/tiku/v4/exercise/rename",
              data: {
                exerciseId: this.exerciseForm.exerciseId,
                exerciseName: this.exerciseForm.exerciseName
              }
            })
            .then(res => {
              this.isExerciseShow = false;
              let ret = res.data;
              if (ret.code === 200) {
                this.loadData2();
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
      // axios
      //   .request({
      //     method: "post",
      //     url: "/tiku/v4/exercise/removeExercise",
      //     data: {
      //       exerciseId: row.exerciseId
      //     }
      //   })
      //   .then(res => {
      //     let ret = res.data;
      //     if (ret.code == 200) {
      //       this.loadData2();
      //       this.$message({
      //         type: "success",
      //         message: "删除成功!"
      //       });
      //     }
      //   });

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
              url: "/tiku/v4/exercise/removeExercise",
              data: {
                exerciseId: row.exerciseId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData2();
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
          row.wareName +
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
              url: "/clazz/v4/ware/remove",
              data: {
                wareId: row.wareId
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
    //创建副本
    handleCreatWareCopy(row) {
      this.$confirm("<div>是否确定创建副本", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "info"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/v4/ware/copy",
              data: {
                wareId: row.wareId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "创建成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    handleExerciseCopy(row) {
      this.$confirm("<div>是否确定创建副本", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/tiku/v4/exercise/copy",
              data: {
                exerciseId: row.exerciseId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData2();
                this.$message({
                  type: "success",
                  message: "创建成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    moveWare(item) {
      this.currentMoveWare = item;
      this.getCollectionList();
      this.isMoveShow = true;
    },
    moveOutWare(item) {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/moveOutCollection",
          data: {
            wareId: item.wareId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "移出成功!"
            });
            this.getCollectionItems();
            this.loadData();
          }
        });
    },
    getCollectionList() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/ware/list",
          data: {
            type: 2
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.collectionList = ret.data;
          }
        });
    },
    //分享
    handleShareWare(row) {
      this.currentShareBank = row;
      this.shareModal2 = false;
      this.isShareShow = true;
    },
    // 去创建分享链接
    toCreateShareLink() {
      this.csCode = "";
      axios
        .request({
          method: "post",
          url: `/clazz/v4/wareShare/create`,
          data: {
            wareId: this.currentShareBank.wareId,
            uid: this.$store.state.user.userId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.csCode = ret.data.csCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=3&shareCode=" + this.csCode;
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
    },
    // 重置链接
    resetLink() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/wareShare/reset",
          data: {
            code: this.csCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.csCode = ret.data.csCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=3&shareCode=" + this.csCode;
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
    },
    //复制链接
    copyShareLink() {
      if (this.shareLink.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLink; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    //分享作业
    handleShareExercise(row) {
      this.currentShareBankExercise = row;
      this.shareModal2Exercise = false;
      this.isShareShowExercise = true;
    },
    // 去创建分享链接  作业
    toCreateShareLink2() {
      this.csCodeExercise = "";
      axios
        .request({
          method: "post",
          url: `/tiku/exerciseShare/create`,
          data: {
            exerciseId: this.currentShareBankExercise.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2Exercise = true;
            this.csCodeExercise = ret.data.code;
            this.shareLinkExercise =
              process.env.THIS_URI +
              "/index?type=6&shareCode=" +
              this.csCodeExercise;
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
    },
    // 重置链接 作业
    resetLink2() {
      axios
        .request({
          method: "post",
          url: "/tiku/exerciseShare/reset",
          data: {
            code: this.csCodeExercise
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.csCodeExercise = ret.data.code;
            this.shareLinkExercise =
              process.env.THIS_URI +
              "/index?type=6&shareCode=" +
              this.csCodeExercise;
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
    },
    //复制链接 作业
    copyShareLink2() {
      if (this.shareLinkExercise.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLinkExercise; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    // 点击课件名称
    handleClickName(item) {
      if (item.type == 2) {
        this.currentCollection = item;
        this.getCollectionItems();
        this.isCollectionItemShow = true;
        return;
      }
      if (item.wareIsTranscode == 3) {
        this.$message({
          type: "warning",
          message: "请重新上传课件内容!"
        });
      } else {
        this.toEditCourseware(item);
      }
    },
    //去编辑课件
    toEditCourseware(row) {
      this.$router.push({
        path: "/claCourseware/editCourseware",
        query: {
          goType: "ware",
          coursewareId: row.wareId,
          htmlUrl: row.wareUrl,
          pages: row.wareThumbnailNum,
          coursewareName: row.wareName
        }
      });
    },
    //去上课
    goToCourseware(row) {
      this.$store.commit("setCourseWareRowItem", row);
      this.currentRow = row;
      this.isTransPaperShow = true;
      // this.bindValue = "";
      // this.classListData = [];
      // axios
      //   .request({
      //     method: "post",
      //     url: "/v1/calzz/selectClsByUid",
      //     data: {
      //       wareId: row.wareId
      //     }
      //   })
      //   .then(res => {
      //     let ret = res.data;
      //     if (ret.code == 200) {
      //       this.bindClassList = ret.data;
      //       this.isBindShow = true;
      //     }
      //   });
      // if (row.coursewareStatus == 1) {
      //   //继续上课
      //   this.$router.push({
      //     path: "/claCourseware/goToCourseware",
      //     query: {
      //       goType: "ware",
      //       coursewareId: row.wareId,
      //       coursewareName: row.wareName,
      //       coursewareCurrentPage: row.wareCurrentPage,
      //       htmlUrl: row.wareUrl,
      //       pages: row.wareThumbnailNum,
      //       exerciseName: row.exerciseName,
      //       coursewareExerciseId: row.wareExerciseId
      //     }
      //   });
      // } else {
      //   this.bindValue = "";
      //   this.classListData = [];
      //   axios
      //     .request({
      //       method: "post",
      //       url: "/v1/calzz/selectClsByUid",
      //       data: {
      //         wareId: row.wareId
      //       }
      //     })
      //     .then(res => {
      //       let ret = res.data;
      //       if (ret.code == 200) {
      //         this.bindClassList = ret.data;
      //         this.isBindShow = true;
      //       }
      //     });
      // }
    },
    //选择班级确定开始上课
    async bindSure() {
      let {
        wareId,
        // eslint-disable-next-line no-unused-vars
        wareCurrentPage,
        // eslint-disable-next-line no-unused-vars
        wareExerciseId,
        // eslint-disable-next-line no-unused-vars
        wareExerciseName
      } = this.$store.state.courseWare.courseWareRowItem;
      // 课件关联班级
      let classIds = [];
      this.selectedClass.forEach(item => {
        classIds.push(item.classId);
      });
      // let res = await axios.request({
      //   method: "post",
      //   url: "/clazz/v4/courseware/createAndTranscode",
      //   data: {
      //     classId: classIds.join(","),
      //     coursewareSourceId: wareId, // 课件id
      //     coursewareName: wareName, // 课件名称
      //     coursewareSourceUrl: wareSourceUrl // 课件链接
      //   }
      // });
      let res = await axios.request({
        method: "post",
        url: "/clazz/v4/ware/pushToClass",
        data: {
          classIds: classIds.join(","),
          wareIds: wareId
        }
      });
      let { code } = res.data;
      if (code === 200) {
        var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
        var cEvent = new CountEvent("ware_link_class");
        window.JAnalyticsInterface.onEvent(cEvent);
        this.$message({
          type: "success",
          message: "课件关联班级成功!请进入班级的'班级课件'中查看"
        });
        // let params = {
        //   coursewareId: data.coursewareId,
        //   wareUrl,
        //   wareThumbnailPrefix,
        //   wareThumbnailNum
        // };
        // 关联成功后转码成功回调
        // this.bindComplete(params);

        this.$router.push({
          path: "/class/myClass"
        });
        // this.isBindShow = false;
        this.isTransPaperShow = false;
      }
    },
    // 去编辑作业
    toEditCourseTask(row) {
      this.$router.push({
        path: "/claCourseware/editCourseTask",
        query: {
          coursewareId: row.wareId,
          exerciseId: row.wareExerciseId ? row.wareExerciseId : "",
          exerciseName: row.wareExerciseName ? row.wareExerciseName : "作业一"
        }
      });
    },
    toEditExercise(row) {
      this.$router.push({
        path: "/claCourseware/editLibTask",
        query: {
          exerciseId: row.exerciseId
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
    },
    // 关联班级完成回调接口
    async bindComplete(data) {
      await axios.request({
        method: "post",
        url: "/clazz/v4/courseware/complete",
        data: {
          coursewareId: data.coursewareId,
          coursewareUrl: data.wareUrl,
          coursewareThumbnailPrefix: data.wareThumbnailPrefix,
          coursewareThumbnailNum: data.wareThumbnailNum
        }
      });
    },
    //--------------------------------------------------------------------班级云课
    loadData3() {
      this.loadingClassCourse.tableLoading = true;
      let data = {};
      data.pageNum = this.page.currentPage;
      data.pagesize = this.page.pagesize;
      if (this.keyWord) {
        data.searchWords = this.keyWord;
      }
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/selClaCList",
          data: data
        })
        .then(res => {
          this.loadingClassCourse.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data) {
              this.courseListData = ret.data.data;
              this.page.total = ret.data.total;
            } else {
              this.courseListData = [];
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //导入云课
    importCourse() {
      this.importResRadio = "";
      this.importKeyWord = "";
      this.loadImportData();
      this.isImportShow = true;
    },
    //加载添加分类列表data
    loadImportData() {
      this.loadingClassCourse.importTableLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/freeList",
          data: {
            page: this.importPage.currentPage,
            pageSize: this.importPage.pagesize,
            keyword: this.importKeyWord
          }
        })
        .then(res => {
          this.loadingClassCourse.importTableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.dataList = ret.data.data;
            this.importPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //radio change选中行数据
    importResRadioData(row) {
      this.currentRowCourse = row;
    },
    //确定导入云课
    doImport() {
      if (!this.importResRadio) {
        this.$message({
          type: "warning",
          message: "请选择云课"
        });
        return;
      }
      this.loadingClassCourse.importLoadingSure = true;
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/cCourse/copy2BCourse",
          data: {
            cCourseId: this.currentRowCourse.ccourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadingClassCourse.importLoadingSure = false;
            this.$router.push({
              path: "/cloudCourse/courseInfo",
              query: {
                ccourseId: ret.data.cCourseId,
                newCourseType: 1
              }
            });
            this.isImportShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    courseSerch() {
      this.page.currentPage = 1;
      this.loadData3();
    },
    cCourseHelp() {
      this.$router.push({
        path: "/cloudCourse/help"
      });
    },
    bigImg(row) {
      this.isBigImageShow = true;
      this.currentCourse = row;
    },
    // 云课类型
    formatCourseType(row) {
      return common.mathCourseType(row.ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.ccoursePrice == 0) {
          return "免费";
        } else {
          return row.ccoursePrice / 100;
        }
      }
    },
    //新建班课
    newCourse(row) {
      this.$router.push({
        path: "/cloudCourse/courseInfo",
        query: {
          newCourseType: 1
        }
      });
    },
    //更新时间
    dateFormat: function(row) {
      return format(row);
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.claCId,
          type: 4 // 查看班课详情
        }
      });
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/cloudCourse/courseInfo",
        query: {
          ccourseId: row.claCId,
          newCourseType: 1
        }
      });
    },
    //绑定班级
    bindCourse(row) {
      this.bindValueClassCourse = [];
      this.classListData = [];
      this.currentCourse = row;
      axios
        .request({
          method: "post",
          url: "v1/calzz/selClsByUid"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.bindClassListClassCourse = ret.data;
            ret.data.forEach((e, i) => {
              if (e.clCoUuid && e.clCoUuid == row.claCUUID) {
                this.bindValueClassCourse.push(e.clId);
              }
              // this.classListData.push({
              //   label: e.clName,
              //   key: e.clId,
              //   disabled: e.clCoUuid && e.clCoUuid != row.claCUUID
              // });
            });
          }
        });
      this.isBindShowClassCourse = true;
    },
    //确定绑定班级
    bindSure3() {
      this.loadingClassCourse.bindSureLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/calzz/rebindClCAndCla",
          data: {
            clCUUId: this.currentCourse.claCUUID,
            clIds: this.bindValueClassCourse.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          this.loadingClassCourse.bindSureLoading = false;
          if (ret.code == 200) {
            this.loadData3();
            this.isBindShowClassCourse = false;
          }
        });
    },
    shareCourse3(row) {
      // console.log(row);
      this.currentShareContent = row;
      this.shareModal2ClassCourse = false;
      this.isShareShowClassCourse = true;
    },
    // 去创建分享链接
    toCreateShareLink3() {
      this.csCode = "";
      axios
        .request({
          method: "post",
          url: `/ccourse/v4/courseShare/create`,
          data: {
            ccourseId: this.currentShareContent.claCId,
            uid: this.$store.state.user.userId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2ClassCourse = true;
            this.csCodeClassCourse = ret.data.code;
            this.shareLinkClassCourse =
              process.env.THIS_URI +
              "/index?type=4&shareCode=" +
              this.csCodeClassCourse;
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
    },
    // 重置链接
    resetLink3() {
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/courseShare/reset",
          data: {
            code: this.csCodeClassCourse
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.csCodeClassCourse = ret.data.code;
            this.shareLinkClassCourse =
              process.env.THIS_URI +
              "/index?type=4&shareCode=" +
              this.csCodeClassCourse;
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
    },
    //复制链接
    copyShareLink3() {
      if (this.shareLinkClassCourse.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLinkClassCourse; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    //删除
    deleteCourse(row) {
      this.$confirm(
        "<div>是否确定删除班课：《" +
          row.claCName +
          "》？</div>删除后班课将无法恢复",
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
              url: "v1/cCourse/delClC",
              data: {
                clCId: row.claCId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  this.courseListData.length == 1
                ) {
                  this.page.currentPage--;
                }
                this.loadData3();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //统计
    lookLearnProcess(row1, row2) {
      this.$router.push({
        path: "/class/countCourse",
        query: {
          classId: row2,
          ccourseId: row1.claCId,
          courseName: row1.claCName
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-radio {
  margin-bottom: 15px;
}
.myCoursewareLib {
  /deep/ .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
    .el-tabs__item {
      font-size: 16px;
    }
  }
  .collection-list {
    /deep/ .el-dialog__body {
      height: 45vh;
      overflow: hidden;
      overflow-y: auto;
    }
  }
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
      margin-left: 5px;
      cursor: pointer;
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
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    .class {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .exam-list {
    width: 100%;
    .el-main {
      margin: 20px;
      background: #ffffff;
      border-radius: 4px;
      min-height: 700px;
      padding-top: 0;
      padding-left: 18px;
      padding-right: 18px;
      padding-bottom: 12px;
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
      .empty-exercise {
        display: flex;
        height: 500px;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: rgb(144, 147, 153);
        img {
          width: 396px;
          height: 238px;
        }
      }
      .coursewareList {
        display: flex;
        flex-wrap: wrap;
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
    }

    .third-main {
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
          padding: 0px 10px;
          overflow: hidden;
          text-align: left;
          .left {
            float: left;
            img {
              width: 130px;
              height: 72px;
              display: block;
              cursor: pointer;
            }
          }
          .middle {
            margin-left: 18px;
            float: left;
            .name {
              font-weight: bold;
              font-size: 14px;
              color: #333333;
              cursor: pointer;
            }
            .cloudId {
              margin-top: 3px;
              font-size: 14px;
              color: #666666;
            }
            .courseTime {
              margin-top: 3px;
              font-size: 12px;
              color: #999999;
            }
          }
          .right {
            float: right;
            height: 30px;
            line-height: 30px;
            margin-top: 28px;
            margin-right: 50px;
            color: #2ba1f4;
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

  .el-date-editor .el-range-separator {
    width: auto;
  }
  .importModal .el-table::before {
    height: 0;
  }
}
</style>
