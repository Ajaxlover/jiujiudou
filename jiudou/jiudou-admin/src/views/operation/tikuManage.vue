<template>
  <el-tabs class="tikuManage" v-model="current" @tab-click="handleClick">
    <el-tab-pane label="题库管理" name="first" class="settlement container">
      <el-form :inline="true" size="small">
        <el-form-item label="学科">
          <el-select
            v-model="settleForm.accoType"
            style="width:100px;"
            @change="settleParamChange"
          >
            <el-option
              v-for="item in courseTypeList"
              :key="item.id"
              :label="item.sname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="settleForm.status"
            size="small"
            @change="settleParamChange"
            style="width:100px;"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="已下架" value="0"></el-option>
          </el-select>
          <!-- <el-select
            v-model="settleForm.accoType"
            style="width:100px;"
            @change="settleParamChange"
          >
            <el-option
              v-for="item in courseTypeList"
              :key="item.id"
              :label="item.sname"
              :value="item.id"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="settleForm.keyWord"
            placeholder="请输入题库名称"
            style="width:300px;"
            @keyup.enter.native="onSearchSettlement"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearchSettlement"
            class="el-icon-search"
          ></el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary">导出</el-button>
        </el-form-item> -->
      </el-form>
      <el-table
        :data="settleList"
        v-loading="loading.settleList"
        stripe
        border
        :row-style="{ height: '120px' }"
        :show-header="false"
      >
        <el-table-column
          prop="tname"
          label="书名"
          align="center"
          min-width="900"
        >
          <div slot-scope="scope" class="info">
            <div class="left">
              <img
                style="cursor: pointer;"
                v-if="scope.row.coverPic"
                :src="scope.row.coverPic"
                class="userPic"
              />
              <img
                style="cursor: pointer;"
                v-else
                src="https://iph.href.lu/750x406?text=%E5%B0%81%E9%9D%A2&fg=f3f6f4&bg=bcbcbc"
              />
              <!-- <img v-else src="@/assets/images/mukeCover.png" /> -->
            </div>
            <div class="middle">
              <div class="name">
                <!-- <span>{{formatCourseType(scope.row.feeType)}}</span> -->
                <span>{{ scope.row.sblName }}</span>
              </div>
              <div>
                <span>学科:{{ scope.row.subjectName }}</span>
              </div>
              <div style="margin-top:10px">
                <span>定价:{{ scope.row.firstPrice }}</span>
              </div>
              <!-- <div class="cloudId" v-if="scope.row.modifyTime">
                更新时间:{{ dateFormat(scope.row.modifyTime) }}
              </div> -->
              <!-- <div class="price">{{ moocStatus(scope.row.status) }}</div> -->
            </div>
            <div class="right">
              <!-- <el-button
                  type="text"
                  size="small"
                  @click="studyInfo(scope.row)"
                  >学习进度</el-button
                > -->
              <span v-if="scope.row.shelfStatus == 1">已上架</span>
              <span style="color:red" v-else>已下架</span>
            </div>
            <!-- <div class="courseTime">{{dateFormat(scope.row.modifyTime)}}</div> -->
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)">详情</el-button> -->
            <el-button
              type="text"
              size="small"
              v-if="scope.row.shelfStatus == 0"
              style="margin-left:0"
              @click="editTiku(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              @click="addFreeCount(scope.row)"
              >+免费账号</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="libIsOn(scope.row)"
              style="margin-left:0"
              >{{ scope.row.shelfStatus == 1 ? "下架" : "上架" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="settleList.length" class="right-footer-first">
          从{{ (settlePage.page - 1) * settlePage.pageSize + 1 }}到{{
            (settlePage.page - 1) * settlePage.pageSize + settleList.length
          }}记录，共{{ settlePage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="settlePage.total"
          :page-size="settlePage.pageSize"
          :current-page.sync="settlePage.page"
          background
          @current-change="loadData"
        ></el-pagination>
      </div>
      <!-- 编辑题库 -->
      <el-dialog
        v-if="isEditShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="isEditShow"
        :modal-append-to-body="false"
        width="1200px"
        class="tiku-edit"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>编辑题库</div>
          </div>
        </template>
        <el-form
          :model="editForm"
          :rules="editFormRule"
          ref="editForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="题库名称" prop="title">
            <el-input
              style="width:300px"
              v-model.trim="editForm.title"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="学科" prop="subjectType">
            <el-select
              v-model="editForm.subjectType"
              style="width:100px;"
              disabled
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
          <el-form-item label="排序" prop="sort">
            <el-input
              style="width:80px"
              v-model.trim="editForm.sort"
              oninput="value=value.replace(/[^0-9]/g,'')"
              size="small"
            ></el-input>
            <el-tooltip effect="dark" placement="right">
              <div slot="content">
                注：填写数字，数字越小则排序靠前
              </div>
              <img
                style="width:15px;margin-left:10px"
                src="@/assets/images/icon_help.png"
              />
            </el-tooltip>
          </el-form-item>
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
                  v-if="editForm.cover"
                  :src="editForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(editForm.cover)"
                  v-if="editForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="简介" prop="intro">
            <Ueditor
              v-model.trim="editForm.intro"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
          <el-form-item label="">
            <div>
              <span>时间：</span>
              <el-input
                style="width:60px"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                v-model.trim="editForm.time"
                size="small"
              ></el-input>
              <span>年</span>
              <span style="margin-left:30px">价格：</span>
              <el-input
                oninput="value=value.replace(/[^0-9.]/g,'')"
                style="width:60px"
                v-model.trim="editForm.price"
                size="small"
              ></el-input>
              <span>元</span>
              <el-button
                @click="addPriceItem"
                :disabled="isSblPriceListDisable"
                style="margin-left: 30px;"
                type="primary"
                size="small"
                >新增</el-button
              >
            </div>
          </el-form-item>
          <el-form-item v-if="sblPriceList.length > 0" label="价格">
            <div class="price-rule-list">
              <el-tag
                v-for="(tag, index) in sblPriceList"
                :key="index"
                closable
                @close="delPriceItem(tag, index)"
              >
                {{ tag.price + "元/" + tag.time + "年" }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="doEditLib"
            >确定</el-button
          >
          <el-button size="small" @click="isEditShow = false">取消</el-button>
        </div>
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

      <el-dialog
        title="题库免费账号添加"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        v-if="isMemberShow"
        :visible.sync="isMemberShow"
        :modal-append-to-body="false"
        :before-close="handleClose"
        width="600px"
      >
        <el-form
          :model="userForm"
          :rules="userRules"
          ref="userForm"
          @submit.native.prevent
        >
          <el-form-item prop="mobile" style="margin:0 20%;">
            <span>请输入教师用户手机号</span>
            <el-input
              v-model="userForm.mobile"
              style="width:250px;margin: 10px 0"
              @input="userForm.mobile = userForm.mobile.replace(/[^0-9]/g, '')"
              size="small"
              type="tel"
              autocomplete="off"
              @keyup.enter.native="handleSearchUser"
              :maxlength="11"
            >
            </el-input>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleSearchUser"
            ></el-button>
          </el-form-item>
        </el-form>
        <div class="result" v-if="isSelect" style="text-align:center;">
          <div v-if="userResult.uid">
            <div>
              <img
                v-if="userResult.pic"
                :src="userResult.pic"
                style="width:100px;border-radius:50%;"
              />
              <img
                v-else
                src="@/assets/images/userPic.png"
                style="width:100px;border-radius:50%;"
              />
              <div class="username">{{ userResult.username }}</div>
              <div>{{ userResult.mobile }}</div>
            </div>
          </div>
          <div v-else style="text-align:center;">
            该用户不存在，请先注册九斗账号
          </div>
        </div>
        <el-form
          :model="yearForm"
          :rules="yearRules"
          ref="yearForm"
          @submit.native.prevent
        >
          <el-form-item v-if="userResult.uid" prop="year" style="margin:0 20%;">
            <span>请输入免费年限</span>
            <el-input
              v-model.trim="yearForm.year"
              style="width:250px;margin: 0px 0"
              @input="yearForm.year = yearForm.year.replace(/[^0-9.]/g, '')"
              size="small"
              type="tel"
              autocomplete="off"
            >
            </el-input
            ><span style="margin-left: 10px;">年</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            :disabled="!userResult.uid"
            type="primary"
            size="small"
            @click="doAddMember"
            >确定</el-button
          >
          <el-button size="small" @click="handleClose">取消</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="题库申请" name="second" class="order container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input
            v-model="applyForm.phone"
            placeholder="请输入手机号"
            style="width:200px;"
            oninput="value=value.replace(/[^0-9]/g,'')"
            maxlength="11"
            @keyup.enter.native="onSearchOrder"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="applyForm.teacherName"
            placeholder="请输入教师姓名"
            style="width:200px;"
            @keyup.enter.native="onSearchOrder"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="applyForm.school"
            placeholder="请输入学校名称"
            style="width:200px;"
            @keyup.enter.native="onSearchOrder"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            @change="onSearchOrder"
            v-model="applyForm.status"
            style="width:100px;"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="已通过" value="2"></el-option>
            <el-option label="已拒绝" value="3"></el-option>
            <el-option label="未处理" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="onSearchOrder"
            class="el-icon-search"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            @click="toAllowBatch(1)"
            v-if="selectedApplyList.length"
            size="small"
            type="primary"
            >批量通过</el-button
          >
          <el-button
            @click="toAllowBatch(2)"
            v-if="selectedApplyList.length"
            size="small"
            type="primary"
            >批量拒绝</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="orderList"
        v-loading="loading.orderList"
        stripe
        border
        ref="applyTable"
        row-key="libraryUserId"
        @selection-change="selectChange"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          :reserve-selection="true"
          :selectable="checkSelectable"
          type="selection"
          align="center"
        ></el-table-column>
        <el-table-column
          label="教师姓名"
          prop="username"
          align="center"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学校"
          prop="school"
          align="center"
        ></el-table-column>
        <el-table-column
          label="院系"
          prop="department"
          align="center"
        ></el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请题库"
          prop="sblName"
          align="center"
        ></el-table-column>
        <el-table-column label="申请时长(月)" align="center" width="160">
          <template slot-scope="scope">
            <span>{{
              scope.row.timeLimit == -1 ? "无期限" : scope.row.timeLimit
            }}</span>
          </template></el-table-column
        >
        <el-table-column label="申请时间" align="center" width="160">
          <template slot-scope="scope">{{
            formatTime(scope.row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.applyStatus == 1"
              type="text"
              size="small"
              style="margin-left:0"
              @click="toAllow(scope.row, true)"
              >通过</el-button
            >
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              v-if="scope.row.applyStatus == 1"
              @click="toAllow(scope.row, false)"
              >拒绝</el-button
            >
            <el-tag v-if="scope.row.applyStatus == 3" type="danger"
              >已拒绝</el-tag
            >
            <el-tag v-if="scope.row.applyStatus == 2" type="success"
              >已通过</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="orderList.length" class="right-footer-first">
          从{{ (orderPage.page - 1) * orderPage.pageSize + 1 }}到{{
            (orderPage.page - 1) * orderPage.pageSize + orderList.length
          }}记录，共{{ orderPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="orderPage.total"
          :page-size="orderPage.pageSize"
          :current-page.sync="orderPage.page"
          background
          @current-change="loadOrderList"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="使用情况" name="third" class="record container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input
            v-model="recordForm.phone"
            placeholder="请输入手机号"
            style="width:200px;"
            oninput="value=value.replace(/[^0-9]/g,'')"
            maxlength="11"
            @keyup.enter.native="onSearchRecord"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="recordForm.teacherName"
            placeholder="请输入教师姓名"
            style="width:200px;"
            @keyup.enter.native="onSearchRecord"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="recordForm.school"
            placeholder="请输入学校名称"
            style="width:200px;"
            @keyup.enter.native="onSearchRecord"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            @change="onSearchRecord"
            v-model="recordForm.status"
            style="width:100px;"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="自购" value="1"></el-option>
            <el-option label="分配" value="2"></el-option>
            <el-option label="申请" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="onSearchRecord"
            class="el-icon-search"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <!-- <el-button
            size="small"
            type="primary"
            :disabled="recordList.length == 0"
            @click="exportRecordExcel"
            >导出</el-button
          > -->
        </el-form-item>
      </el-form>
      <el-table
        :data="recordList"
        v-loading="loading.recordList"
        stripe
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="教师姓名"
          prop="username"
          align="center"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          align="center"
        ></el-table-column>
        <el-table-column
          label="学校"
          prop="school"
          align="center"
        ></el-table-column>
        <el-table-column
          label="使用题库"
          prop="sblName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="截止日期"
          prop="orderT"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.deadlineStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              @click="toUseSituation(scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="small"
              style="margin-left:0"
              @click="forBidUse(scope.row)"
              >{{ scope.row.status == 1 ? "启用" : "禁用" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="recordList.length" class="right-footer-first">
          从{{ (recordPage.page - 1) * recordPage.pagesize + 1 }}到{{
            (recordPage.page - 1) * recordPage.pagesize + recordList.length
          }}记录，共{{ recordPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="recordPage.total"
          :page-size="recordPage.pagesize"
          :current-page.sync="recordPage.page"
          background
          @current-change="loadRecordList"
        ></el-pagination>
      </div>

      <!-- 题库使用情况 -->
      <el-dialog
        top="6vh"
        v-if="isUseShow"
        :visible.sync="isUseShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>题库使用情况</div>
          </div>
        </template>
        <div>
          题库名称：<span>{{ currentUse.sblName }}</span>
        </div>
        <el-table
          v-loading="useSituationLoading"
          :data="useSituation"
          border
          height="300px"
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="获取时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span> {{ formatTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="使用期限"
            prop="timeLimitStr"
            align="center"
          ></el-table-column>
          <el-table-column label="获取途径" prop="accessWay" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accessWay == 1">自购</span>
              <span v-if="scope.row.accessWay == 2">分配</span>
              <span v-if="scope.row.accessWay == 3">申请</span>
            </template>
          </el-table-column>
          <el-table-column
            label="支付金额（元）"
            prop="payPrice"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.tiku-edit {
  .el-form-item {
    margin-bottom: 10px;
  }
  .price-rule-list {
    .el-tag {
      margin-right: 20px;
      margin-bottom: 20px;
    }
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
.tikuManage {
  .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    background: none;
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
  }
  .container {
    background: white;
    margin: 22px 23px;
    padding: 10px 20px;
  }
  .settleImage {
    width: 230px;
    height: 150px;
    margin-right: 3px;
  }
  .imageContainer {
    position: relative;
    .el-icon-circle-close {
      position: absolute;
      right: 6px;
      top: -10px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .info {
    padding: 0px 10px;
    overflow: hidden;
    text-align: left;
    .left {
      float: left;
      img {
        width: 157.4px;
        height: 86px;
        display: block;
      }
    }
    .middle {
      margin-left: 18px;
      float: left;
      .name {
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        margin-bottom: 10px;
        span:first-child {
          // border:1px solid #2BA1F4;
          // color:#2BA1F4;
          // font-weight:normal;
          // padding: 2px 5px;
          // font-size: 12px;
          // border-radius: 10px;
          // margin-right: 10px;
          cursor: pointer;
        }
        // span:nth-child(2){
        //   cursor: pointer;
        // }
      }
      .cloudId {
        margin-top: 40px;
        font-size: 14px;
        color: #666666;
      }
      .price {
        color: #ff783d;
        margin-top: 6px;
        font-weight: 600;
      }
    }
    .courseTime {
      float: right;
      font-size: 14px;
      margin-right: 20px;
      color: #999999;
      line-height: 86px;
    }
    .right {
      float: right;
      line-height: 86px;
      margin-right: 50px;
      color: #2ba1f4;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format, formatYMD } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import common from "@/utils/common";
import Ueditor from "@/components/ueditor";
import fileModal from "@/components/fileModal";

export default {
  components: {
    fileModal,
    "jd-dialog": jdialog,
    Ueditor,
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer")
  },
  data() {
    var checkYear = (rule, value, callback) => {
      if (value.startsWith(".")) {
        return callback(new Error("免费年限输入有误，请检查"));
      }
      if (value == 0) {
        return callback(new Error("免费年限必须大于0"));
      }
      if (!value) {
        return callback(new Error("请输入免费年限"));
      }
      callback();
    };
    return {
      // 发票详情
      isTicketDetailShow: false,
      ticketDetailForm: {
        type: 1,
        title: "",
        taxNo: "",
        taxContent: "购买题库",
        remark: "",
        money: "",
        email: ""
      },
      // 发送发票
      sendLoading: false,
      isSendShow: false,
      ticketForm: {
        pdfUrl: "",
        mailTitle: "",
        mailContent: ""
      },
      ticketFormRule: {
        mailTitle: [
          { required: true, message: "邮件主题不能为空", trigger: "blur" }
        ]
      },
      uploadFile: null,
      // 编辑题库
      isEditShow: false,
      editForm: {
        title: "1",
        intro: "",
        sort: "12",
        subjectType: 16,
        cover: "",
        coverObj: null,
        time: "",
        price: ""
      },
      editFormRule: {},
      sblPriceList: [],
      showViewer: false,
      imgList: [],
      editTypeList: [],
      initialFrameHeight: 100,
      toolbars: [
        [
          "fullscreen",
          "source",
          "|",
          "undo",
          "redo",
          "|",
          "emotion",
          "rowspacingtop",
          "rowspacingbottom",
          "lineheight",
          "|",
          "directionalityltr",
          "directionalityrtl",
          "indent",
          "|",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyjustify"
        ]
      ],
      // -----------------------------
      isSelect: false,
      userResult: {},
      isMemberShow: false,
      userForm: {
        mobile: ""
      },
      yearForm: {
        year: ""
      },
      userRules: {
        mobile: [
          { required: true, message: "请输入正确手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      },
      yearRules: {
        year: [{ validator: checkYear, trigger: "blur" }]
      },
      courseTypeList: [
        {
          sname: "全部",
          id: ""
        }
      ],
      settleForm: {
        accoType: "",
        keyWord: "",
        status: ""
      },
      settleList: [],
      settlePage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      // 题库申请
      applyForm: {
        phone: "",
        teacherName: "",
        school: "",
        status: ""
      },
      currentApply: {},
      selectedApplyList: [],
      orderList: [],
      orderPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      payTypes: common.payTypes,
      current: "first",
      dialogShow: {
        dealSettle: false,
        settleDetail: false
      },
      loading: {
        settleList: false,
        orderList: false,
        recordList: false,
        settleSure: false,
        staticList: false
      },
      currentSettlement: {},
      //题库使用情况
      recordList: [],
      recordForm: {
        phone: "",
        teacherName: "",
        school: "",
        status: ""
      },
      recordPage: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      isUseShow: false,
      currentUse: {},
      useSituation: [],
      useSituationLoading: false,
      // 发票申请
      staticList: [],
      staticForm: {
        payType: "",
        searchType: "1",
        totalMoeny: "",
        phone: "",
        teacherName: "",
        school: "",
        status: ""
      },
      staticPage: {
        page: 1,
        pagesize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.getCourseTypeList();
    this.loadData(); // 题库管理
  },
  computed: {
    isSblPriceListDisable() {
      let flag = false;
      for (let index = 0; index < this.sblPriceList.length; index++) {
        const element = this.sblPriceList[index];
        if (element.price === "0") {
          flag = true;
        }
      }
      if (this.sblPriceList.length == 3 || flag) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.loadOrderList(); // 题库申请
      } else if (tab.name == "first") {
        this.loadData(); // 题库管理
      } else if (tab.name == "third") {
        this.loadRecordList(); // 使用情况
      }
    },
    // 题库申请是否可选
    checkSelectable(row, index) {
      let flag = true;
      for (let i = 0; i < this.orderList.length; i++) {
        if (row.applyStatus >= 2) {
          // applyStatus=2或3  已处理(2-通过 3-拒绝)
          flag = false;
          break;
        } else {
          flag = true;
        }
      }
      return flag;
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
      this.editForm.cover = params;
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
                  this.editForm.cover = accessUrl;
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
    showTicketDetail(row) {
      this.isTicketDetailShow = true;
    },
    toSendTicket(row) {
      this.isSendShow = true;
      this.ticketForm.pdfUrl = "";
      this.ticketForm.mailContent = "";
      this.ticketForm.mailTitle = "";
      this.$nextTick(() => {
        this.$refs["ticketForm"].resetFields();
        this.$refs.ticketFile.clearFile();
      });
    },
    doSend() {
      // @todo  发送邮件
      this.$refs["ticketForm"].validate(valid => {
        if (valid) {
          // this.sendLoading = true;
          // axios
          //   .request({
          //     method: "post",
          //     url: "/exam/importStu/parseExcelData",
          //     data: {}
          //   })
          //   .then(data => {
          //     let res = data.data;
          //     if (res.code == 200) {
          // this.sendLoading = true;
          //     } else {
          //       this.$message({
          //         message: res.msg,
          //         type: "warning"
          //       });
          //     }
          //   });
        } else {
          return false;
        }
      });
    },
    handleFileChange(file) {
      this.uploadFile = file;
    },
    toAllowBatch(flag) {
      let str = "通过";
      if (flag == 2) {
        str = "拒绝";
      }
      this.$confirm(`确定批量${str}题库使用申请？`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          let ids = [];
          this.selectedApplyList.forEach(i => {
            ids.push(i.libraryUserId);
          });
          axios
            .request({
              method: "post",
              url: "/subject/libraryMainUser/auditApply",
              data: {
                libraryUserIds: ids.join(","),
                passFlag: flag == 1
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadOrderList(); // 题库申请
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.$refs.applyTable.clearSelection();
              }
            });
        })
        .catch(() => {});
    },
    toAllow(row, passFlag) {
      this.currentApply = row;
      this.$confirm(
        `确定${passFlag ? "通过" : "拒绝"}该教师对该题库的申请？`,
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
              url: "/subject/libraryMainUser/auditApply",
              data: {
                libraryUserIds: this.currentApply.libraryUserId,
                passFlag
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadOrderList(); // 题库申请
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    forBidUse(row) {
      this.currentUse = row;
      this.$confirm(
        `是否确定${row.status == 1 ? "开启" : "禁止"}该教师对题库的使用？`,
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
              url: "/subject/libraryMainUser/editUseAble",
              data: {
                libraryMainId: this.currentUse.libraryMainId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadRecordList(); // 使用情况
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    toUseSituation(row) {
      this.currentUse = row;
      this.isUseShow = true;
      this.getUseSituation();
    },
    getUseSituation() {
      this.useSituationLoading = true;
      axios
        .request({
          method: "post",
          url: "/subject/libraryMainUser/queryLibraryUserAccessItem",
          data: {
            libraryMainId: this.currentUse.libraryMainId
          }
        })
        .then(res => {
          this.useSituationLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.useSituation = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadData() {
      this.loading.settleList = true;
      let data = {};
      data.pageNo = this.settlePage.page;
      data.pageSize = this.settlePage.pageSize;
      if (this.settleForm.keyWord) {
        data.keyword = this.settleForm.keyWord;
      }
      if (this.settleForm.accoType) {
        data.subjectId = this.settleForm.accoType;
      }
      if (this.settleForm.status === "0" || this.settleForm.status === "1") {
        data.shelfStatus = this.settleForm.status;
      }
      axios
        .request({
          method: "post",
          // url: "/openccourse/openCcourse/list",
          url: "/subject/libraryManage/queryPage",
          data: data
        })
        .then(res => {
          this.loading.settleList = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.settleList = ret.data.records;
            this.settlePage.total = ret.data.total;
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
            this.courseTypeList = [...this.courseTypeList, ...temp];
            this.editTypeList = [...temp];
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //更新时间
    dateFormat: function(row) {
      return formatYMD(row);
    },
    onSearchSettlement() {
      this.settleParamChange();
    },
    settleParamChange() {
      this.settlePage.page = 1;
      this.loadData();
    },
    searchApplyList() {},
    // 申请题库选中状态发生变化
    selectChange(select) {
      this.selectedApplyList = select;
    },
    // 题库申请列表
    loadOrderList() {
      this.loading.orderList = true;
      let data = {};
      data.pageNo = this.orderPage.page;
      data.pagesize = this.orderPage.pageSize;
      if (this.applyForm.phone) {
        data.mobile = this.applyForm.phone;
      }
      if (this.applyForm.teacherName) {
        data.username = this.applyForm.teacherName;
      }
      if (this.applyForm.school) {
        data.school = this.applyForm.school;
      }
      if (this.applyForm.status) {
        data.applyStatus = this.applyForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/subject/libraryMainUser/queryUserApplyPage",
          data: data
        })
        .then(res => {
          this.loading.orderList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.orderList = ret.data.records;
            this.orderPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        })
        .catch(() => {
          this.loading.orderList = false;
        });
    },
    onSearchOrder() {
      this.orderParamChange();
    },
    orderParamChange() {
      this.orderPage.page = 1;
      this.loadOrderList();
    },
    delPriceItem(tag, index) {
      this.sblPriceList.splice(index, 1);
    },
    editTiku(row) {
      this.currentSettlement = row;
      this.isEditShow = true;
      this.getLibDetail();
    },
    getLibDetail() {
      axios
        .request({
          method: "post",
          url: "/subject/libraryManage/queryInfo",
          data: {
            sblId: this.currentSettlement.sblId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            let {
              sblName,
              subjectId,
              coverPic,
              sblIntro,
              sort,
              sblPriceList
            } = ret.data;
            this.editForm.title = sblName;
            this.editForm.intro = sblIntro;
            this.editForm.sort = sort;
            this.editForm.subjectType = subjectId;
            this.editForm.cover = coverPic;
            this.sblPriceList = sblPriceList;
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    addPriceItem() {
      for (let index = 0; index < this.sblPriceList.length; index++) {
        const element = this.sblPriceList[index];
        if (element.price === "0") {
          return false;
        }
      }
      if (this.editForm.time === "" || this.editForm.time === "0") {
        this.$message({
          message: "年限设置必须大于0",
          type: "warning"
        });
        return;
      }
      if (this.editForm.price === "") {
        this.$message({
          message: "价格不能为空",
          type: "warning"
        });
        return;
      }

      this.sblPriceList.push({
        time: this.editForm.time,
        price: this.editForm.price
      });
      this.editForm.time = "";
      this.editForm.price = "";
      const uniqueArr = this.sblPriceList.reduce((unique, item) => {
        const fields = item.time + "-" + item.price;
        if (!unique.has(fields)) {
          unique.set(fields, item);
        }
        return unique;
      }, new Map());

      this.sblPriceList = Array.from(uniqueArr.values());
      this.sblPriceList = this.sblPriceList.sort((a, b) => a.time - b.time);
    },
    doEditLib() {
      let data = {
        sblId: this.currentSettlement.sblId
      };
      if (this.editForm.title) {
        data.sblName = this.editForm.title;
      }
      if (this.editForm.cover) {
        data.coverPic = this.editForm.cover;
      }
      if (this.editForm.sort) {
        data.sort = this.editForm.sort;
      }
      if (this.editForm.intro) {
        data.sblIntro = this.editForm.intro;
      }
      data.sblPriceListJson = JSON.stringify(this.sblPriceList);
      if (this.editForm.title == "") {
        this.$message({
          message: "请填写题库名称",
          type: "warning"
        });
        return;
      }
      if (this.editForm.sort == "") {
        data.sort = 0;
      }
      if (this.sblPriceList.length == 0) {
        this.$message({
          message: "未设置价格，请检查",
          type: "warning"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/subject/libraryManage/editInfo",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.isEditShow = false;
            this.loadData();
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    addFreeCount(row) {
      this.currentSettlement = row;
      this.isMemberShow = true;
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    //平台类型
    formatPlatformType(row) {
      if (row.platformType == 1) {
        return "苹果";
      } else if (row.platformType == 2) {
        return "安卓";
      }
    },
    //支付方式
    formatPayType(row) {
      return common.payTypeFormat(row.payType);
    },
    // 金额
    formatMoney(money) {
      if (money) {
        return money / 100.0;
      }
      return 0;
    },
    getURLFromFile(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    copyText(row) {
      let Url2 = row; //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = Url2; //赋值
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
    copyInfo() {
      var name = "标题：南京大学在职本科、学历/学位2021春季班招生" + "\r\n";
      var url =
        "原文链接：http://www.baidu.com/html/zsxx/2020/1126/670.html" + "\r\n";
      var form = "出处：学友圈" + "\r\n";
      var content = name.concat(url, form);
      // 使用textarea支持换行，使用input不支持换行
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        //alert(content);
        this.$message({
          message: "复制成功",
          type: "success"
        });
      }
      document.body.removeChild(textarea);
    },
    onSearchRecord() {
      this.recordPage.page = 1;
      this.loadRecordList();
    },
    loadRecordList() {
      this.loading.recordList = true;
      let data = {};
      data.pageNo = this.recordPage.page;
      data.pageSize = this.recordPage.pagesize;
      if (this.recordForm.phone) {
        data.mobile = this.recordForm.phone;
      }
      if (this.recordForm.teacherName) {
        data.username = this.recordForm.teacherName;
      }
      if (this.recordForm.school) {
        data.school = this.recordForm.school;
      }
      if (this.recordForm.status) {
        data.accessWay = this.recordForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/subject/libraryMainUser/queryUserUsePage",
          data: data
        })
        .then(res => {
          this.loading.recordList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.recordList = ret.data.records;
            this.recordPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.recordList = false;
        });
    },
    //充值方式
    formatChargeType(row) {
      return common.payTypeFormat(row.chargeType);
    },
    exportRecordExcel() {
      let url = "";
      if (this.staticForm.beginT == 0) {
        url =
          process.env.BASE_URL +
          "/v1/order/exportChargesXlsx?platformType=" +
          this.recordForm.platformType +
          "&chargeType=" +
          this.recordForm.chargeType +
          "&searchType=" +
          this.recordForm.searchType +
          "&searchWords=" +
          this.recordForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      } else {
        url =
          process.env.BASE_URL +
          "/v1/order/exportChargesXlsx?beginT=" +
          this.recordForm.beginT +
          "&endT=" +
          this.recordForm.endT +
          "&platformType=" +
          this.recordForm.platformType +
          "&chargeType=" +
          this.recordForm.chargeType +
          "&searchType=" +
          this.recordForm.searchType +
          "&searchWords=" +
          this.recordForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      }
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 发票申请
    onSearchStatic() {
      this.staticPage.page = 1;
      this.loadStaticList();
    },
    loadStaticList() {
      this.loading.staticList = true;
      let data = {};
      data.pageNum = this.staticPage.page;
      data.pagesize = this.staticPage.pagesize;
      axios
        .request({
          method: "post",
          url: "/v1/order/selJiuDouRealIncome",
          data: data
        })
        .then(res => {
          this.loading.staticList = false;
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data) {
              this.staticList = ret.data.data;
              this.staticPage.total = ret.data.totals.totalCount;
              this.staticForm.totalMoeny =
                ret.data.totals.totalMoney / 100.0 + "元";
            } else {
              this.staticForm.totalMoeny = "";
              this.staticList = [];
            }
          }
        })
        .catch(() => {
          this.loading.staticList = false;
        });
    },
    formatStaticType(row) {
      if (row.incomeType == 6) {
        return "余额充值";
      } else if (row.incomeType == 5) {
        return "云课直购";
      } else if (row.incomeType == 8) {
        return "考试";
      } else if (row.incomeType == 9) {
        return "竞赛";
      } else if (row.incomeType == 10) {
        return "刷题测验";
      }
    },
    exportStaticExcel() {
      let url = "";
      if (this.staticForm.beginT == 0) {
        url =
          process.env.BASE_URL +
          "/v1/order/exportJiuDouRealIncomeXlsx?incomeType=" +
          this.staticForm.incomeType +
          "&payType=" +
          this.staticForm.payType +
          "&searchType=" +
          this.staticForm.searchType +
          "&searchWords=" +
          this.staticForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      } else {
        url =
          process.env.BASE_URL +
          "/v1/order/exportJiuDouRealIncomeXlsx?beginTime=" +
          this.staticForm.beginT +
          "&endTime=" +
          this.staticForm.endT +
          "&incomeType=" +
          this.staticForm.incomeType +
          "&payType=" +
          this.staticForm.payType +
          "&searchType=" +
          this.staticForm.searchType +
          "&searchWords=" +
          this.staticForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      }
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    handleBadOrder(row) {
      this.$confirm(
        "<div>是否手动修改订单状态？</div><div>修改后充值金额将写入用户账户余额中，不可撤回。</div>",
        "异常订单处理",
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
              url: "/order/v4/apr/process",
              data: { aprId: row.aprId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                row.aprStatus = 4;
                this.$message({
                  message: ret.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  message: ret.msg,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        })
        .catch(() => {});
    },
    handleClose() {
      this.userForm.mobile = "";
      this.userResult = {};
      this.isSelect = false;
      this.isMemberShow = false;
    },
    doAddMember() {
      this.$refs["yearForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/libraryMainUser/allocateTime",
              data: {
                teaUid: this.userResult.uid,
                sblId: this.currentSettlement.sblId,
                timeYearLimit: this.yearForm.year
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isMemberShow = false;
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
        }
      });
    },
    handleSearchUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/user/userInfoByMobile",
              data: {
                mobile: this.userForm.mobile
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isSelect = true;
                this.userResult = ret.data;
              } else {
                this.userResult = {};
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器错误!"
              });
            });
        } else {
        }
      });
    },
    libIsOn(row) {
      this.currentSettlement = row;
      this.$confirm(
        `是否确定${row.shelfStatus == 1 ? "下架" : "上架"}该题库？`,
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
              url: "/subject/libraryManage/onOffShelf",
              data: {
                sblId: this.currentSettlement.sblId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
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
        })
        .catch(() => {});
    }
  }
};
</script>
