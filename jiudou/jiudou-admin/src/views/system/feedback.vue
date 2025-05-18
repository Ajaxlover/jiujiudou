<template>
  <el-tabs class="feedback" v-model="current" @tab-click="tabClick">
    <el-tab-pane label="APP问题" name="first">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="70px"
        size="small"
      >
        <el-form-item label="反馈状态" prop="status">
          <el-select
            style="width:110px;"
            v-model="selectForm.status"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="待处理"></el-option>
            <el-option value="1" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP平台" prop="phone">
          <el-select
            style="width:110px;"
            v-model="selectForm.phone"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="Android" label="安卓"></el-option>
            <el-option value="iOS" label="苹果"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select
            style="width:120px;"
            v-model="selectForm.type"
            @change="selectChange"
          >
            <el-option
              v-for="type in sysFeedbackTypes"
              :key="type.type"
              :value="type.type"
              :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="feedBackList"
        v-loading="tableLoading"
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
          label="用户昵称"
          prop="name"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="身份类型"
          prop="identity"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="平台类型"
          prop="mode"
          align="center"
          width="80"
          :formatter="formatPlatformType"
        ></el-table-column>
        <el-table-column
          label="手机型号"
          prop="mode"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="手机系统版本"
          prop="osVersion"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="APP版本"
          prop="appVersion"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="反馈类型"
          prop="subType"
          align="center"
          width="120"
          :formatter="formatSubType"
        ></el-table-column>
        <el-table-column
          label="反馈内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="附件" align="center" width="80">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.img" type="text" class="el-icon-picture" style="font-size:24px;" @click="showFile(scope.row)"></el-button>
            <span v-else>无</span> -->
            <el-image
              v-if="scope.row.img"
              style="width: 50px; height: 50px"
              :src="scope.row.img"
              :preview-src-list="arryWay(scope.row.img)"
            >
            </el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="addTime" align="center" width="150">
          <template slot-scope="scope">{{
            formatTime(scope.row.addTime)
          }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已处理</span>
            <span
              v-else
              style="background: #AFC5D5;color: #ffffff;padding: 3px;"
              >待处理</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              @click="deal(scope.row)"
              type="text"
              size="small"
              >设为已处理</el-button
            >
            <el-button @click="reply(scope.row)" type="text" size="small"
              >回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="feedBackList.length" class="right-footer-first">
          从{{ (appPage.page - 1) * appPage.pageSize + 1 }}到{{
            (appPage.page - 1) * appPage.pageSize + feedBackList.length
          }}记录，共{{ appPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="appPage.total"
          :page-size="appPage.pageSize"
          :current-page.sync="appPage.page"
          background
          @current-change="loadFeedback"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="资源问题" name="second">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="70px"
        size="small"
      >
        <el-form-item label="反馈状态" prop="status">
          <el-select
            style="width:110px;"
            v-model="selectForm.status"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="待处理"></el-option>
            <el-option value="1" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP平台" prop="phone">
          <el-select
            style="width:110px;"
            v-model="selectForm.phone"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="Android" label="安卓"></el-option>
            <el-option value="iOS" label="苹果"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select
            style="width:120px;"
            v-model="selectForm.type"
            @change="selectChange"
          >
            <el-option
              v-for="type in sysFeedbackTypes"
              :key="type.type"
              :value="type.type"
              :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="feedBackList"
        v-loading="tableLoading"
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
          label="手机号"
          prop="mobile"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="反馈内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.img"
              type="text"
              class="el-icon-picture"
              style="font-size:24px;"
              @click="showFile(scope.row)"
            ></el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已处理</span>
            <span
              v-else
              style="background: #AFC5D5;color: #ffffff;padding: 3px;"
              >待处理</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="添加时间"
          prop="addTime"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.addTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              @click="deal(scope.row)"
              type="text"
              size="small"
              >设为已处理</el-button
            >
            <el-button @click="reply(scope.row)" type="text" size="small"
              >回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="feedBackList.length" class="right-footer-first">
          从{{ (resPage.page - 1) * resPage.pageSize + 1 }}到{{
            (resPage.page - 1) * resPage.pageSize + feedBackList.length
          }}记录，共{{ resPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="resPage.total"
          :page-size="resPage.pageSize"
          :current-page.sync="resPage.page"
          background
          @current-change="loadFeedback"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="题库问题" name="third">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="70px"
        size="small"
      >
        <el-form-item label="反馈状态" prop="status">
          <el-select
            style="width:110px;"
            v-model="selectForm.status"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="待处理"></el-option>
            <el-option value="1" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP平台" prop="phone">
          <el-select
            style="width:110px;"
            v-model="selectForm.phone"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="Android" label="安卓"></el-option>
            <el-option value="iOS" label="苹果"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select
            style="width:120px;"
            v-model="selectForm.type"
            @change="selectChange"
          >
            <el-option
              v-for="type in sysFeedbackTypes"
              :key="type.type"
              :value="type.type"
              :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="feedBackList"
        v-loading="tableLoading"
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
          label="手机号"
          prop="mobile"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="反馈内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.img" type="text" class="el-icon-picture" style="font-size:24px;" @click="showFile(scope.row)"></el-button>
            <span v-else>无</span> -->
            <el-image
              v-if="scope.row.img"
              style="width: 50px; height: 50px"
              :src="scope.row.img"
              :preview-src-list="arryWay(scope.row.img)"
            >
            </el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已处理</span>
            <span
              v-else
              style="background: #AFC5D5;color: #ffffff;padding: 3px;"
              >待处理</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="添加时间"
          prop="addTime"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.addTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              @click="deal(scope.row)"
              type="text"
              size="small"
              >设为已处理</el-button
            >
            <el-button @click="reply(scope.row)" type="text" size="small"
              >回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="feedBackList.length" class="right-footer-first">
          从{{ (tikuPage.page - 1) * tikuPage.pageSize + 1 }}到{{
            (tikuPage.page - 1) * tikuPage.pageSize + feedBackList.length
          }}记录，共{{ tikuPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="tikuPage.total"
          :page-size="tikuPage.pageSize"
          :current-page.sync="tikuPage.page"
          background
          @current-change="loadFeedback"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="云课讨论举报" name="forth">
      <el-table
        :data="cloudList"
        v-loading="loading.cloudList"
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
          label="云课id"
          prop="cCourseUuid"
          align="center"
        ></el-table-column>
        <el-table-column
          label="云课"
          prop="cCourseName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="被举报内容"
          prop="discussContent"
          align="center"
        ></el-table-column>
        <el-table-column
          label="举报次数"
          prop="discussNum"
          align="center"
        ></el-table-column>
        <el-table-column label="最近举报时间" align="center">
          <template slot-scope="scope">{{
            formatTime(scope.row.addTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="showCloudReportDetail(scope.row)"
              type="text"
              size="small"
              >查看详情</el-button
            >
            <el-button
              v-if="!scope.row.isDelete"
              @click="deleteMessage(scope.row)"
              type="text"
              size="small"
              >删除讨论</el-button
            >
            <span v-else style="font-size:12px;color:#666;margin-left:10px;"
              >已删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="cloudList.length" class="right-footer-first">
          从{{ (cloudPage.page - 1) * cloudPage.pageSize + 1 }}到{{
            (cloudPage.page - 1) * cloudPage.pageSize + cloudList.length
          }}记录，共{{ cloudPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="cloudPage.total"
          :page-size="cloudPage.pageSize"
          :current-page.sync="cloudPage.page"
          background
          @current-change="loadCloudFeedback"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="答疑" name="seventh">
      <div>
        <div style="margin-bottom:10px">
          <span style="margin-right:20px">学科</span>
          <el-input
            style="width:150px"
            size="small"
            v-model.trim="subjectName"
            placeholder="请输入学科名称"
          ></el-input>
          <el-button
            size="small"
            :disabled="isDisable"
            @click="addRule"
            type="primary"
            >新增学科</el-button
          >
        </div>
        <div class="subject-list">
          <el-tag
            v-for="(tag, index) in subjectList"
            @close="closeTag(tag)"
            :key="index"
            closable
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
      <div style="float:right">
        <el-form
          :model="selectForm"
          :inline="true"
          label-width="50px"
          size="small"
          @submit.native.prevent
        >
          <el-form-item label="状态">
            <el-select
              size="small"
              style="width:110px;"
              v-model="selectForm.delFlag"
              @change="selectChange"
            >
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="未删除"></el-option>
              <el-option value="1" label="已删除"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学科">
            <el-select
              style="width:110px;"
              v-model="selectForm.subjectId"
              @change="selectChange"
            >
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="i in subjectList"
                :key="i.id"
                :value="i.id"
                :label="i.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="selectForm.searchWords"
              placeholder="请输入搜索关键字"
              style="width: 300px"
              size="small"
              @keyup.enter.native="searchQueryList"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchQueryList"
              size="small"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="queryList"
        v-loading="loading.questionAnswerLoading"
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
          label="昵称"
          prop="memberName"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="头像"
          prop="memberPic"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.memberPic"
              :size="50"
              :src="scope.row.memberPic"
            ></el-avatar>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="身份类型" align="center" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.isTeacher">老师</span>
            <span v-else>学生</span>
          </template>
        </el-table-column>

        <el-table-column
          label="主题标题"
          prop="title"
          align="center"
          min-width="120"
        ></el-table-column>
        <el-table-column
          label="主题内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="图片" align="center" width="80">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.img" type="text" class="el-icon-picture" style="font-size:24px;" @click="showFile(scope.row)"></el-button>
            <span v-else>无</span> -->
            <el-image
              v-if="scope.row.contentUrl"
              style="width: 50px; height: 50px"
              :src="formatImg(scope.row.contentUrl)"
              :preview-src-list="questionArrWay(scope.row.contentUrl)"
            >
            </el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读量" prop="readNum" align="center">
        </el-table-column>
        <el-table-column label="点赞数" prop="likeNum" align="center">
        </el-table-column>
        <el-table-column label="评论数" prop="replyNum" align="center">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="toShowQueryDetail(scope.row)"
              >查看评论</el-button
            >
            <el-button
              @click="deleteAnswerQuestion(scope.row)"
              type="text"
              size="small"
              >{{ scope.row.delFlag == 1 ? "恢复" : "删除" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="queryList.length > 0" class="right-footer-first">
          从{{ (queryPage.page - 1) * queryPage.pageSize + 1 }}到{{
            (queryPage.page - 1) * queryPage.pageSize + queryList.length
          }}记录，共{{ queryPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="queryPage.total"
          :page-size="queryPage.pageSize"
          :current-page.sync="queryPage.page"
          background
          @current-change="getQueryList"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="官网问题" name="fifth">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="70px"
        size="small"
      >
        <el-form-item label="反馈状态" prop="status">
          <el-select
            style="width:110px;"
            v-model="selectForm.status"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="待处理"></el-option>
            <el-option value="1" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP平台" prop="phone">
          <el-select
            style="width:110px;"
            v-model="selectForm.phone"
            @change="selectChange"
          >
            <el-option value="" label="全部"></el-option>
            <el-option value="Android" label="安卓"></el-option>
            <el-option value="iOS" label="苹果"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select
            style="width:120px;"
            v-model="selectForm.type"
            @change="selectChange"
          >
            <el-option
              v-for="type in sysFeedbackTypes"
              :key="type.type"
              :value="type.type"
              :label="type.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="feedBackList"
        v-loading="tableLoading"
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
          label="手机号"
          prop="mobile"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          label="反馈内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.img"
              type="text"
              class="el-icon-picture"
              style="font-size:24px;"
              @click="showFile(scope.row)"
            ></el-button>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已处理</span>
            <span
              v-else
              style="background: #AFC5D5;color: #ffffff;padding: 3px;"
              >待处理</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="添加时间"
          prop="addTime"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.addTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              @click="deal(scope.row)"
              type="text"
              size="small"
              >设为已处理</el-button
            >
            <el-button @click="reply(scope.row)" type="text" size="small"
              >回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="feedBackList.length" class="right-footer-first">
          从{{ (gwPage.page - 1) * gwPage.pageSize + 1 }}到{{
            (gwPage.page - 1) * gwPage.pageSize + feedBackList.length
          }}记录，共{{ gwPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="gwPage.total"
          :page-size="gwPage.pageSize"
          :current-page.sync="gwPage.page"
          background
          @current-change="loadFeedback"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="注销账号记录" name="sixth">
      <el-table
        :data="memberOffList"
        v-loading="loading.memberOffLoading"
        stripe
        border
        style="margin-top:15px;"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="用户ID"
          prop="moUid"
          align="center"
        ></el-table-column>
        <el-table-column label="时间" prop="moCreateTime" align="center">
          <template slot-scope="scope">{{
            formatTime(scope.row.moCreateTime)
          }}</template>
        </el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">
            {{ scope.row.moType == 0 ? "用户" : "管理员" }}
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="memberOffList.length" class="right-footer-first">
          从{{ (memberOffPage.page - 1) * memberOffPage.pageSize + 1 }}到{{
            (memberOffPage.page - 1) * memberOffPage.pageSize +
              memberOffList.length
          }}记录，共{{ memberOffPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="memberOffPage.total"
          :page-size="memberOffPage.pageSize"
          :current-page.sync="memberOffPage.page"
          background
          @current-change="loadMemberOff"
        ></el-pagination>
      </div>
    </el-tab-pane>

    <jd-dialog
      title="附件查看"
      :noFooter="true"
      :visible.sync="dialogShow.subFile"
    >
      <template slot="body">
        <img style="width:50%; margin-left:25%" :src="subFile" />
      </template>
    </jd-dialog>
    <jd-dialog
      title="举报详情"
      width="800px"
      :noFooter="true"
      :visible.sync="dialogShow.cloudReportDetail"
    >
      <template slot="body">
        <el-table
          :data="cloudDetailList"
          v-loading="loading.cloudReportDetail"
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
          <el-table-column label="举报者（手机号）" align="center">
            <template slot-scope="scope">{{
              scope.row.name + "(" + scope.row.mobile + ")"
            }}</template>
          </el-table-column>
          <el-table-column label="举报时间" align="center">
            <template slot-scope="scope">{{
              formatTime(scope.row.addTime)
            }}</template>
          </el-table-column>
          <el-table-column
            label="举报类型"
            prop="subType"
            align="center"
            :formatter="formatCloudFeedbackType"
          ></el-table-column>
          <el-table-column
            label="补充说明"
            prop="content"
            align="center"
          ></el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="cloudDetailList.length" class="right-footer-first">
            从{{
              (cloudDetailPage.page - 1) * cloudDetailPage.pageSize + 1
            }}到{{
              (cloudDetailPage.page - 1) * cloudDetailPage.pageSize +
                cloudDetailList.length
            }}记录，共{{ cloudDetailPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="cloudDetailPage.total"
            :page-size="cloudDetailPage.pageSize"
            :current-page.sync="cloudDetailPage.page"
            background
            @current-change="loadCloudReportDetail"
          ></el-pagination>
        </div>
      </template>
    </jd-dialog>
    <jd-dialog
      title="回复反馈消息"
      :loading="loading.replySureLoading"
      width="800px"
      :visible.sync="dialogShow.reply"
      :close_on_click_modal="false"
      @sure="replySure"
    >
      <template slot="body">
        <el-form label-width="180px" style="margin:0 30px;">
          <el-form-item label="用户反馈内容：">{{
            currentRow.content
          }}</el-form-item>
          <div style="max-height:250px;overflow-y:auto">
            <el-form-item
              v-for="item in replyList"
              :key="item.id"
              style="margin-bottom: 5px;"
            >
              <template slot="label"
                >{{ formatTime(item.addTime) }}回复：</template
              >
              {{ item.adminContent }}
            </el-form-item>
          </div>
          <el-form-item label="回复内容：" style="margin-top:15px">
            <el-input type="textarea" v-model="replyDesc"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>

    <!-- 答疑详情 -->
    <el-dialog
      top="6vh"
      v-if="isQueryDetailShow"
      :visible.sync="isQueryDetailShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="1300px"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>查看评论</div>
        </div>
      </template>

      <div class="top">
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入搜索关键字"
          style="width: 300px"
          @keyup.enter.native="searchCommentList"
        ></el-input>
        <el-select
          style="width:110px;"
          size="small"
          v-model="delFlag"
          @change="commentSelectChange"
        >
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="未删除"></el-option>
          <el-option value="1" label="已删除"></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="searchCommentList"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div>
      <el-table
        :data="queryDetailList"
        border
        v-loading="loading.questionCommentLoading"
        style="margin-top:15px"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column
          label="昵称"
          prop="memberName"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column label="头像" prop="mobile" align="center" width="100">
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.memberPic"
              :size="50"
              :src="scope.row.memberPic"
            ></el-avatar>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="身份类型" align="center" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.isTeacher">老师</span>
            <span v-else>学生</span>
          </template>
        </el-table-column>

        <el-table-column
          label="评论内容"
          prop="content"
          align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column label="图片" align="center" width="80">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.img" type="text" class="el-icon-picture" style="font-size:24px;" @click="showFile(scope.row)"></el-button>
            <span v-else>无</span> -->
            <el-image
              v-if="scope.row.contentUrl"
              style="width: 50px; height: 50px"
              :src="formatImg(scope.row.contentUrl)"
              :preview-src-list="questionArrWay(scope.row.contentUrl)"
            >
            </el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读量" prop="readNum" align="center">
        </el-table-column>
        <el-table-column label="点赞数" prop="likeNum" align="center">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              @click="deleteAnswerComment(scope.row)"
              type="text"
              size="small"
              >{{ scope.row.delFlag == 1 ? "恢复" : "删除" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{
            (this.queryDetailPage.page - 1) * this.queryDetailPage.pageSize + 1
          }}
          到
          {{
            (this.queryDetailPage.page - 1) * this.queryDetailPage.pageSize +
              this.queryDetailList.length
          }}
          记录，共 {{ queryDetailPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="queryDetailPage.total"
          :current-page.sync="queryDetailPage.page"
          :page-size="queryDetailPage.pageSize"
          @current-change="getQueryDetailList"
        >
        </el-pagination>
      </div>

      <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
    </el-dialog>
  </el-tabs>
</template>

<style lang="scss">
.feedback {
  .subject-list {
    width: 100%;
    // background-color: red;
    padding-left: 10px;
    margin-bottom: 10px;
    .el-tag {
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
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
  .el-tab-pane {
    background: white;
    margin: 22px 23px;
    padding: 10px 20px;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import JDialog from "@/components/jdialog";
export default {
  components: {
    "jd-dialog": JDialog
  },
  data() {
    return {
      delFlag: "",
      keyWord: "",
      currentDiscussId: "",
      subjectList: [],
      subjectName: "", // 答疑学科
      current: "first",
      feedBackType: "0",
      dialogShow: {
        cloudReportDetail: false,
        subFile: false,
        reply: false
      },
      tableLoading: false,
      loading: {
        cloudList: false,
        cloudReportDetail: false,
        replySureLoading: false,
        memberOffLoading: false,
        questionAnswerLoading: false,
        questionCommentLoading: false
      },
      appPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      queryList: [], // 答疑列表
      isQueryDetailShow: false,
      queryDetailList: [], // 答疑详情列表
      queryPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      queryDetailPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      resPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      tikuPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      cloudPage: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      gwPage: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      cloudDetailPage: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      memberOffPage: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      feedBackList: [],
      cloudList: [],
      cloudDetailList: [],
      memberOffList: [],
      cloudFeedbackTypes: [
        { type: "", name: "全部" },
        { type: "0", name: "违反相关法律法规或相关规定" },
        { type: "1", name: "广告或垃圾信息" },
        { type: "2", name: "与云课无关" },
        { type: "3", name: "低俗或色情" },
        { type: "4", name: "辱骂或不友善" },
        { type: "5", name: "其他原因" }
      ],
      sysFeedbackTypes: [
        { type: "", name: "全部" },
        { type: "0", name: "错误异常" },
        { type: "1", name: "体验问题" },
        { type: "2", name: "内容意见" },
        { type: "3", name: "功能建议" },
        { type: "4", name: "其他" }
      ],
      subFile: "",
      selectForm: {
        status: "",
        phone: "",
        type: "",
        searchWords: "",
        subjectId: "",
        delFlag: ""
      },
      currentRow: {},
      replyList: [],
      replyDesc: ""
    };
  },
  mounted() {
    this.loadFeedback();
  },
  computed: {
    isDisable() {
      return this.subjectName.length == 0;
    }
  },
  methods: {
    handleClose(done) {
      this.keyWord = "";
      this.delFlag = "";
      done();
    },
    getSubjectList() {
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscussType/queryList",
          data: {
            type: 2
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.subjectList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    addRule() {
      if (!this.subjectName) {
        this.$message({
          type: "warning",
          message: "请输入学科名称"
        });
        return;
      }

      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscussType/insert",
          data: {
            name: this.subjectName,
            type: 2
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.subjectName = "";
            this.getSubjectList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    deleteAnswerQuestion(row) {
      let { id, delFlag } = row;
      this.$confirm(`是否${delFlag == 1 ? "恢复" : "删除"}?`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/answerQuestion/manage/operate",
              data: {
                discussIdList: id,
                type: delFlag == 1 ? 2 : 1
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                this.getQueryList();
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
    deleteAnswerComment(row) {
      let { id, delFlag } = row;

      axios
        .request({
          method: "post",
          url: "/openccourse/answerQuestion/manage/operate",
          data: {
            discussIdList: id,
            type: delFlag == 1 ? 2 : 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: `${delFlag == 1 ? "恢复成功" : "删除成功"}`
            });
            this.getQueryDetailList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    closeTag(tag) {
      let { id } = tag;
      this.$confirm("是否删除?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/openDiscussType/delete",
              data: {
                id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getSubjectList();
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
    arryWay(string) {
      let arry = [];
      arry.push(string);
      return arry;
    },
    questionArrWay(str) {
      let arr = str.split(",");
      if (arr.length > 0) {
        return arr;
      } else {
        return [str];
      }
    },
    formatImg(str) {
      let arr = str.split(",");
      if (arr.length > 0) {
        return arr[0];
      } else {
        return str;
      }
    },
    //切换tab
    tabClick(item) {
      this.selectForm.status = "";
      this.selectForm.phone = "";
      this.selectForm.type = "";
      if (item.name === "first") {
        //app问题
        this.feedBackType = "0";
        this.appPage.page = 1;
        this.loadFeedback();
      } else if (item.name === "second") {
        //资源问题
        this.feedBackType = "11";
        this.resPage.page = 1;
        this.loadFeedback();
      } else if (item.name === "third") {
        //题库问题
        this.feedBackType = "12";
        this.tikuPage.page = 1;
        this.loadFeedback();
      } else if (item.name === "forth") {
        this.loadCloudFeedback();
      } else if (item.name === "fifth") {
        //官网问题
        this.feedBackType = "13";
        this.gwPage.page = 1;
        this.loadFeedback();
      } else if (item.name === "sixth") {
        //注销列表
        this.loadMemberOff();
      } else if (item.name === "seventh") {
        this.queryPage.page = 1;
        this.getQueryList();
        this.getSubjectList();
      }
    },
    searchQueryList() {
      this.queryPage.page = 1;
      this.getQueryList();
    },
    searchCommentList() {
      this.queryDetailPage.page = 1;
      this.getQueryDetailList();
    },
    commentSelectChange() {
      this.queryDetailPage.page = 1;
      this.getQueryDetailList();
    },
    selectChange() {
      if (this.current === "first") {
        this.appPage.page = 1;
      } else if (this.current === "second") {
        this.resPage.page = 1;
      } else if (this.current === "third") {
        this.tikuPage.page = 1;
      } else if (this.current === "fifth") {
        this.gwPage.page = 1;
      } else if (this.current === "seventh") {
        this.queryPage.page = 1;
        this.getQueryList();
      }
      this.loadFeedback();
    },
    toShowQueryDetail(row) {
      this.currentDiscussId = row.id;
      this.getQueryDetailList();
      this.isQueryDetailShow = true;
    },
    getQueryList() {
      let data = {
        discussTopId: 0,
        pageNo: this.queryPage.page,
        pageSize: this.queryPage.pageSize
      };
      if (this.selectForm.subjectId) {
        data.discussTypeId = this.selectForm.subjectId;
      }
      if (this.selectForm.searchWords) {
        data.searchWord = this.selectForm.searchWords;
      }
      if (this.selectForm.delFlag === "0") {
        data.delFlag = 0;
      } else if (this.selectForm.delFlag == 1) {
        data.delFlag = 1;
      }
      this.loading.questionAnswerLoading = true;
      axios
        .request({
          method: "post",
          url: "/openccourse/answerQuestion/manage/queryAllList",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.loading.questionAnswerLoading = false;
          if (ret.code == 200) {
            this.queryList = ret.data.records;
            this.queryPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 获取答疑详情
    getQueryDetailList() {
      let data = {
        discussTopId: this.currentDiscussId,
        pageNo: this.queryDetailPage.page,
        pageSize: this.queryDetailPage.pageSize
      };
      if (this.keyWord) {
        data.searchWord = this.keyWord;
      }
      if (this.delFlag === "0") {
        data.delFlag = 0;
      } else if (this.delFlag == 1) {
        data.delFlag = 1;
      }
      this.loading.questionCommentLoading = true;
      axios
        .request({
          method: "post",
          url: "/openccourse/answerQuestion/manage/queryAllList",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.loading.questionCommentLoading = false;
          if (ret.code == 200) {
            this.queryDetailList = ret.data.records;
            this.queryDetailPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // APP、资源、题库
    loadFeedback() {
      this.tableLoading = true;
      let data = {};
      data.type = this.feedBackType;
      if (this.feedBackType == 0) {
        data.page = this.appPage.page;
        data.pageSize = this.appPage.pageSize;
      }
      if (this.feedBackType == 11) {
        data.page = this.resPage.page;
        data.pageSize = this.resPage.pageSize;
      }
      if (this.feedBackType == 12) {
        data.page = this.tikuPage.page;
        data.pageSize = this.tikuPage.pageSize;
      }
      if (this.feedBackType == 13) {
        data.page = this.gwPage.page;
        data.pageSize = this.gwPage.pageSize;
      }
      if (this.selectForm.status) {
        data.status = this.selectForm.status;
      }
      if (this.selectForm.phone) {
        data.os = this.selectForm.phone;
      }
      if (this.selectForm.type) {
        data.subType = this.selectForm.type;
      }
      axios
        .request({
          method: "post",
          url: "/v1/feedback/listByPage",
          data: data
        })
        .then(res => {
          this.tableLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.feedBackList = ret.data.data;
            if (this.current === "first") {
              this.appPage.total = ret.data.total;
            } else if (this.current === "second") {
              this.resPage.total = ret.data.total;
            } else if (this.current === "third") {
              this.tikuPage.total = ret.data.total;
            } else if (this.current === "fifth") {
              this.gwPage.total = ret.data.total;
            }
          }
        });
    },
    //注销列表
    loadMemberOff() {
      this.loading.memberOffLoading = true;
      axios
        .request({
          method: "post",
          url: "/oauth/v4/memberOff/findByPage",
          data: {
            page: this.memberOffPage.page,
            pageSize: this.memberOffPage.pageSize
          }
        })
        .then(res => {
          this.loading.memberOffLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.memberOffList = ret.data.data;
            this.memberOffPage.total = ret.data.total;
          }
        });
    },
    // 云课举报
    loadCloudFeedback() {
      this.loading.cloudList = true;
      axios
        .request({
          method: "post",
          url: "v1/feedback/discussListByPage",
          data: {
            page: this.cloudPage.page,
            pageSize: this.cloudPage.pageSize
          }
        })
        .then(res => {
          this.loading.cloudList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.cloudPage.total = ret.data.total;
            this.cloudList = ret.data.data;
          }
        })
        .catch(() => {
          this.loading.cloudList = false;
        });
    },
    showCloudReportDetail(row) {
      this.dialogShow.cloudReportDetail = true;
      this.loadCloudReportDetail(row.discussId);
    },
    // 云课举报详情
    loadCloudReportDetail(discussId) {
      this.loading.cloudReportDetail = true;
      axios
        .request({
          method: "post",
          url: "v1/feedback/listByPage",
          data: {
            objId: discussId,
            page: this.cloudDetailPage.page,
            pageSize: this.cloudDetailPage.pageSize
          }
        })
        .then(res => {
          this.loading.cloudReportDetail = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.cloudDetailList = ret.data.data;
            this.cloudDetailPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.cloudReportDetail = false;
        });
    },
    // 删除讨论
    deleteMessage(row) {
      this.$confirm("确定删除讨论吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/discuss/remove",
              data: { discussId: row.discussId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                row.isDelete = 1;
              }
            });
        })
        .catch(() => {});
    },
    // 显示附件
    showFile(row) {
      this.subFile = row.img;
      this.dialogShow.subFile = true;
    },
    // 设为已处理
    deal(row) {
      this.$confirm("确定设置为已处理吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/feedback/setStatusDone",
              data: { id: row.id }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                row.status = 1;
              }
            });
        })
        .catch(() => {});
    },
    // 加载回复列表
    reply(row) {
      this.replyList = [];
      this.replyDesc = "";
      this.currentRow = row;
      axios
        .request({
          method: "post",
          url: "v1/feedback/replyList",
          data: {
            id: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.replyList = ret.data;
          }
        });
      this.dialogShow.reply = true;
    },
    // 确定回复事件
    replySure() {
      if (!this.replyDesc) {
        this.$message({
          type: "warning",
          message: "请输入回复内容"
        });
        return;
      }
      this.loading.replySureLoading = true;
      axios
        .request({
          method: "post",
          url: "v1/feedback/replyFeedback",
          data: {
            content: this.replyDesc,
            id: this.currentRow.id
          }
        })
        .then(res => {
          let ret = res.data;
          setTimeout(() => {
            this.loading.replySureLoading = false;
          }, this.global.btnResumeTime);
          this.loading.replySureLoading = false;
          if (ret.code == 200) {
            this.dialogShow.reply = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    formatCloudFeedbackType(row) {
      for (let i = 0; i < this.cloudFeedbackTypes.length; i++) {
        let type = this.cloudFeedbackTypes[i];
        if (type.type == row.subType) {
          return type.name;
        }
      }
      return "";
    },
    //平台类型
    formatPlatformType(row) {
      if (row.os == "iOS") {
        return "苹果";
      } else if (row.os == "Android") {
        return "安卓";
      }
    },
    //反馈类型
    formatSubType(row) {
      if (row.subType == 0) {
        return "错误异常";
      } else if (row.subType == 1) {
        return "体验问题";
      } else if (row.subType == 2) {
        return "内容意见";
      } else if (row.subType == 3) {
        return "功能建议";
      } else if (row.subType == 4) {
        return "其他";
      }
    }
  }
};
</script>
