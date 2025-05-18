<template>
  <el-container class="subjectMarket">
    <el-main>
      <div class="top">
        <el-select
          v-model="courseType"
          size="small"
          style="width:100px"
          placeholder="类别"
          @change="courseSerch"
        >
          <el-option
            v-for="type in courseTypeList"
            :key="type.id"
            :label="type.sname"
            :value="type.id"
          ></el-option>
        </el-select>
        <el-input
          size="small"
          v-model="keyWord"
          placeholder="请输入题库名称"
          style="width: 300px"
          @keyup.enter.native="courseSerch"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          @click="courseSerch"
          class="el-icon-search"
        ></el-button>
        <div class="operateBtn"></div>
      </div>
      <div class="main">
        <el-table
          :data="courseListData"
          border
          :row-style="{ height: '120px' }"
          :show-header="false"
          v-loading="loading.tableLoading"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="900"
          >
            <div slot-scope="scope" class="info">
              <div class="left" @click="toViewLib(scope.row)">
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
                <div class="name" @click="toViewLib(scope.row)">
                  <!-- <span>{{formatCourseType(scope.row.feeType)}}</span> -->
                  <span>{{ scope.row.sblName }}</span>
                </div>
                <div class="cloudId">
                  <span>学科:{{ scope.row.subjectName }}</span>
                  <span style="margin-left:200px"
                    >题量:{{ scope.row.bankNum }}题</span
                  >
                  <span style="margin-left:200px;"
                    >定价:{{ scope.row.firstPrice }}</span
                  >
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
                <span style="color:red" v-if="scope.row.hasFlag">已拥有</span>
              </div>
              <!-- <div class="courseTime">{{dateFormat(scope.row.modifyTime)}}</div> -->
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)">详情</el-button> -->
              <el-button
                type="text"
                size="small"
                style="margin-left:0"
                @click="toViewLib(scope.row)"
                >预览</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.buyStatus == 1 || scope.row.buyStatus == 2"
                size="small"
                style="margin-left:0"
                @click="toBuy(scope.row)"
                >{{ scope.row.buyStatus == 1 ? "购买" : "续费" }}</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.buyStatus == 3 || scope.row.buyStatus == 4"
                size="small"
                style="margin-left:0"
                @click="toGet(scope.row)"
                >{{ scope.row.buyStatus == 3 ? "获取" : "已获取" }}</el-button
              >
              <el-button
                type="text"
                size="small"
                v-if="scope.row.applyStatus == 0"
                style="margin-left:0"
                @click="toPartIn(scope.row)"
                >申请试用</el-button
              >
              <el-button
                type="text"
                size="small"
                v-if="scope.row.applyStatus == 1"
                style="margin-left:0"
                >申请中</el-button
              >
              <el-button
                type="text"
                size="small"
                v-if="scope.row.applyStatus == 3"
                style="margin-left:0"
                @click="toPartIn(scope.row)"
                >重新申请</el-button
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
            @current-change="loadData"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <!-- 题库申请试用 -->
    <jd-dialog
      title="题库申请试用"
      top="15vh"
      :visible.sync="showImport"
      @sure="doImportSure"
      :loading="tryLoading"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="70px"
          >
            <el-form-item label="姓名" prop="realName">
              <el-input
                v-model.trim="ruleForm.realName"
                placeholder="请输入您的姓名"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phoneNum">
              <el-input
                v-model.trim="ruleForm.phoneNum"
                placeholder="请输入手机号"
                type="text"
                size="small"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="partInSchool">
              <el-autocomplete
                size="small"
                v-model.trim="ruleForm.partInSchool"
                :fetch-suggestions="querySearch"
                placeholder="请选择学校"
                @select="handleSelectSchool"
                style="width:290px"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="院系" prop="apartment">
              <el-input
                v-model.trim="ruleForm.apartment"
                placeholder="请输入院系"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="期限" prop="apartment">
              <span>{{ tryTime.name }}</span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model.trim="ruleForm.remark"
                placeholder="请输入备注"
                type="textarea"
                size="small"
                :rows="4"
                resize="none"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="选择文件">
              <fileModal
                ref="subjectsFile"
                @fileChange="handleFileChange"
              ></fileModal>
              <div class="el-upload__tip" style="line-height:17px">
                当前仅支持后缀名为.xls的Excel文档;
              </div>
            </el-form-item> -->
          </el-form>
          <span style="padding-left:10px"
            >*请填写您的真实信息，收到信息后，客服将会与您联系.</span
          >
          <!-- <span>集体报名导入模板点击下载：</span
          ><el-button
            type="primary"
            size="mini"
            style="background:#11BCE4;border:none"
            @click="downloadFormwork"
            >竞赛集体报名导入模板.xls</el-button
          > -->
        </div>
      </template>
    </jd-dialog>

    <!-- 题库题目预览 -->
    <el-dialog
      top="6vh"
      v-if="isHandChooseShow"
      :visible.sync="isHandChooseShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1300px"
      class="selectTip"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>题目</div>
        </div>
      </template>

      <div>
        <el-form :inline="true" v-model="testSelectForm1" size="small">
          <el-form-item label="知识点">
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
          <el-form-item label="难度系数" style="margin-left:15px;">
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
          <el-form-item label="题目内容">
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
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
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
            width="200px"
          ></el-table-column>

          <el-table-column
            label="难度系数"
            prop="accuracyRate"
            align="center"
            width="80px"
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
            :formatter="formatType"
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
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="testSelectPage1.total"
            :page-size="testSelectPage1.pagesize"
            :current-page.sync="testSelectPage1.page"
            background
            @current-change="loadSubjects"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
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

    <!-- 题库支付 -->
    <el-dialog
      title=""
      :visible.sync="isPayShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handlePayClose"
      width="45%"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>题库购买</div>
        </div>
      </template>
      <div>
        <el-row>
          <div class="course-name">题库名称:{{ currentLib.sblName }}</div>
        </el-row>
        <el-row>
          <div class="course-name">学科:{{ currentLib.subjectName }}</div>
        </el-row>
        <el-row
          ><div class="course-name">
            题库价格:
            <span
              v-for="(item, idx) in sblPriceList"
              :key="item.uuid"
              :class="idx == sblPriceListIndex ? 'price-item-active' : ''"
              class="price-item"
              @click="choosePrice(idx)"
              >¥{{ item.price }}{{ item.priceUnit }}/{{ item.time
              }}{{ item.timeUnit }}</span
            >
          </div></el-row
        >
        <el-row>
          <div class="course-name">支付方式:</div>
        </el-row>
        <section class="pay-type">
          <ul>
            <li :class="payType == 2 ? 'active' : ''" @click="payType = 2">
              <span class="pay-type-icon2"></span>微信支付
            </li>
            <li :class="payType == 1 ? 'active' : ''" @click="payType = 1">
              <span class="pay-type-icon1"></span>支付宝
            </li>
          </ul>
        </section>
        <section>
          <div style="display:flex">
            <el-button
              @click="goPay"
              :loading="loading.payLoading"
              class="but-pay"
              >去付款</el-button
            >
            <!-- <el-button @click="handlePayClose" class="but-pay">取消</el-button> -->
          </div>
        </section>
      </div>
    </el-dialog>

    <!-- 题库扫码支付 -->
    <el-dialog
      :title="`题库名称：${currentLib.sblName}`"
      :visible.sync="isQRcode"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCode"
      width="40%"
    >
      <section style="width: 150px; margin: 0 auto">
        <section style="text-align: center; margin-bottom: 6px">
          扫一扫付款 (元)
        </section>
        <section class="money-pay-num">￥{{ currentPrice.price }}</section>
        <section class="qrcode">
          <vue-qr
            :text="qrcode"
            colorDark="#000"
            colorLight="#fff"
            :margin="5"
            :size="100"
          ></vue-qr>
          <img src="../../assets/img/zfb1.png" class="zfb-img" width="100%" />
          <section class="money-pay-text">
            <img src="../../assets/img/qrcode.png" width="100%" />
            <div class="pay-text">
              <p>打开手机支付</p>
              <p>扫一扫付款</p>
            </div>
          </section>
        </section>
        <section v-if="payType == 2" class="qrcode-t">微信扫码支付</section>
        <section v-if="payType == 1" class="qrcode-t">支付宝扫码支付</section>
      </section>
      <section style="text-align: center; margin: 20px 0">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button class="but-pay" @click="handleCode">取消</el-button> -->
        </span>
      </section>
    </el-dialog>
    <!-- <jd-dialog
      title="题目预览"
      :noFooter="true"
      :visible.sync="shwoPreviewDialog"
      width="800px"
    >
      <preview
        slot="body"
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
      <el-button
        slot="my-footer"
        size="small"
        type="primary"
        @click="getDirect(previewSubject)"
        >获取</el-button
      >
    </jd-dialog>
    <jd-dialog
      title="获取题目"
      :loading="loading.obtainSubjects"
      :visible.sync="showObtainSubjectsDialog"
      @sure="obtainSubjects"
      class="getModal"
    >
      <template slot="body">
        <ul>
          <li>
            移动到库:<span>{{ moveToLib }}</span>
          </li>
          <li v-if="isOffice == 1">
            <el-tree
              v-loading="loading.bankList"
              ref="getLibTree"
              :data="getLibDatas"
              :props="treeMap"
              highlight-current
              node-key="id"
              :expand-on-click-node="false"
              icon-class="el-icon-arrow-right"
              @node-click="selectDestinationItem"
            >
              <span slot-scope="{ node }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
          <li v-else>
            <el-tree
              v-loading="loading.bankList"
              ref="getLibTree"
              :data="getLibDatas"
              :props="treeMap"
              :expand-on-click-node="false"
              highlight-current
              node-key="id"
              icon-class="el-icon-arrow-right"
              @node-click="selectDestinationItem"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
        </ul>
      </template>
    </jd-dialog>
    <jd-dialog
      title="纠错与举报"
      v-if="showReportDialog"
      :loading="loading.feedback"
      :visible.sync="showReportDialog"
      @sure="reportSure"
    >
      <template slot="body">
        <div style="margin:0 5%">
          <div style="margin-bottom:10px;color:#333;font-size:15px">
            你觉得这个资源有什么问题？
          </div>
          <el-radio-group
            v-model="reportType"
            style="margin-top:10px;margin-bottom:20px;color:#333;font-size:13px;"
          >
            <el-radio style="margin-bottom:10px" label="6">内容有误</el-radio>
            <el-radio style="margin-bottom:10px" label="7">违法违禁</el-radio>
            <el-radio style="margin-bottom:10px" label="8"
              >抄袭我的资源</el-radio
            >
            <el-radio style="margin-bottom:10px" label="5">有其他问题</el-radio>
          </el-radio-group>
          <div style="color:#2BA1F4;font-size:13px;">
            为了帮助审核人员更快处理，请详细描述问题*
          </div>
          <div class="jc-pic">
            <el-input
              :rows="6"
              resize="none"
              type="textarea"
              v-model="reportDes"
            ></el-input>
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="false"
              :on-change="onChange"
              :http-request="uploadSectionFile1"
              action=""
              :show-file-list="false"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
      </template>
    </jd-dialog> -->
  </el-container>
</template>

<style lang="scss" scoped>
.subjectMarket {
  //   margin: 22px 23px;
  .course-name {
    font-size: 18px;
    margin-bottom: 20px;
    .price-item {
      width: 130px;
      height: 45px;
      line-height: 45px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
    .price-item-active {
      border: 2px solid #409eff;
      color: #409eff;
    }
  }
  .but-pay {
    background-color: #409eff;
    border-color: #409eff;
    // width: 50%;
    width: 30%;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0;
  }
  .pay-type {
    ul li {
      width: 180px;
      height: 60px;
      line-height: 60px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      //   transition: .1s;
      span {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      .pay-type-icon1 {
        background: url("../../assets/img/zfb.png") no-repeat #fff;
        background-size: 100%;
      }
      .pay-type-icon2 {
        background: url("../../assets/img/wx.png") no-repeat #fff;
        background-size: 100%;
      }
    }
    .active {
      border: 2px solid #409eff;
    }
  }
  .money-pay-num {
    color: #f0742b;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .money-pay-text {
    color: #666;
    font-size: 12px;
    // margin-top: 10px;
    text-align: center;
    .pay-text {
      display: inline-block;
      text-align: left;
      vertical-align: middle;
    }
    img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
    }
  }
  .but-pay {
    background-color: #409eff;
    border-color: #409eff;
    width: 30%;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0;
  }
  .qrcode {
    display: flex;
    flex-direction: column;
    border: 1px #d1d1d1 solid;
    padding-bottom: 10px;
    margin-top: 5px;
    position: relative;
    .zfb-img {
      position: absolute;
      right: -161px;
      top: -70px;
    }
  }
  .qrcode-t {
    color: #333;
    font-size: 16px;
    text-align: center;
    margin-top: 10px;
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
  }
}
// .el-tree-select-popper{
//   left: 400px !important;
// }
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { formatYMD } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import math from "@/components/jmath";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import preview from "./previewSubject";
import vueQr from "vue-qr";

export default {
  name: "CommonMall",
  components: {
    "jd-dialog": jdialog,
    "jd-math": math,
    ElTreeSelect,
    preview,
    vueQr
  },
  data() {
    var checkPhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }
      const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
      if (reg.test(value) != true) {
        return callback(new Error("手机号码格式不对，请重新输入"));
      }
      callback();
    };
    return {
      qrcode: "5555",
      orderCode: "",
      timerId: "",
      isQRcode: false,
      payType: 2,
      isPayShow: false,
      // -------------------
      courseType: "",
      courseTypeList: [
        {
          sname: "全部",
          id: ""
        }
      ],
      isPreviewShow: false, // 预览题目
      previewSubject: {},
      isHandChooseShow: false, // 题库预览所有题目
      tryLoading: false,
      showImport: false, // 题库申请试用
      schoolList: [],
      ruleForm: {
        realName: "",
        phoneNum: "",
        partInSchool: "",
        apartment: "",
        remark: ""
      },
      rules: {
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phoneNum: [
          { validator: checkPhoneNum, trigger: "blur", required: true }
        ],
        partInSchool: [
          { required: true, message: "请选择学校", trigger: "change" }
        ]
      },
      uid: this.$store.state.user.userId,
      keyWord: "",
      courseListData: [],
      loading: {
        tableLoading: false,
        loadingChangePrice: false,
        handLoading: false,
        payLoading: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      currentCourse: {},
      allTypes: common.allTypes,
      allDiffs: common.allRateLevel,
      // 题目列表
      testSelectList1: [],
      testSelectForm1: {
        rlType: "0",
        myLib: "",
        comLib: "",
        type: "",
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
      currentLib: {},
      sblPriceList: [],
      sblPriceListIndex: 0,
      currentPrice: {},
      tryTime: {
        name: "",
        timeLimit: ""
      }
    };
  },
  mounted() {
    this.getTryTime();
    this.getCourseTypeList();
    this.getSchoolList();
    this.loadData();
  },
  methods: {
    // 获取可申请试用期限
    getTryTime() {
      axios
        .request({
          method: "post",
          url: "/subject/libraryMainUser/querySystemApplyTime"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.tryTime = ret.data;
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
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toBuy(row) {
      this.currentLib = row;
      this.sblPriceList = row.priceList;
      this.sblPriceListIndex = 0;
      this.currentPrice = row.priceList[0];
      if (row.unUseAbleFlag) {
        this.$message({
          type: "warning",
          message: "您的这个题库已被禁用，不能进行购买"
        });
        return;
      }
      this.isPayShow = true;
    },
    toGet(row) {
      this.currentLib = row;
      if (row.buyStatus == 4) {
        this.$message({
          type: "warning",
          message: "此题库已获取，不能重复获取"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/freeGet",
          data: { sblId: this.currentLib.sblId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.loadData();
              this.$message({
                type: "success",
                message: res.msg
              });
            } else {
              this.$message({
                type: "warning",
                message: res.msg
              });
            }
          }.bind(this)
        );
    },
    choosePrice(idx) {
      this.sblPriceListIndex = idx;
      this.currentPrice = this.sblPriceList[idx];
    },
    toViewLib(row) {
      // @todo
      this.currentLib = row;
      this.isHandChooseShow = true;
      // this.bus.$emit("myReload");
      this.loadTips();
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 预览
    preview(row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    //题目查询
    testSearch() {
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 获取公共库知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentLib.courseId }
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
    // 获取题库题目
    loadSubjects() {
      this.loading.handLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {};
      if (this.testSelectForm1.type) {
        data.tSubject = parseInt(this.testSelectForm1.type);
      }
      if (this.testSelectForm1.diff) {
        data.difficultRateLevel = this.testSelectForm1.diff;
      }
      data.keyWord = this.testSelectForm1.keywords;
      data.libId = this.currentLib.sblId;
      data.tip = this.testSelectForm1.comTipText;
      data.page = this.testSelectPage1.page;
      data.pagesize = this.testSelectPage1.pagesize;
      data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url,
          data
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
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.keyWord) {
        data.keyWord = this.keyWord;
      }
      if (this.courseType) {
        data.subjectId = this.courseType;
      }
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/queryPage",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.courseListData = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
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
    // 知识点搜索
    tipSearch(value) {
      this.$refs.comTreeSelect.filterFun(value);
    },
    courseSerch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    //更新时间
    dateFormat: function(row) {
      return formatYMD(row);
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 难点
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    // 时间
    formatDate(row) {
      return formatYMD(row.createTime);
    },
    // 状态
    formatStatus(row) {
      if (row.status == 0) {
        return "已停用";
      } else if (row.status == 1) {
        return "纠错中";
      } else {
        return "启用中";
      }
    },
    doImportSure() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // @todo  调用接口  tryLoading  true=>false
          this.tryLoading = true;
          axios
            .request({
              method: "post",
              url: "/subject/libraryMainUser/applyTry",
              data: {
                sblId: this.currentLib.sblId,
                username: this.ruleForm.realName,
                mobile: this.ruleForm.phoneNum,
                school: this.ruleForm.partInSchool,
                department: this.ruleForm.apartment,
                remark: this.ruleForm.remark,
                timeLimit: this.tryTime.timeLimit
              }
            })
            .then(res => {
              this.tryLoading = false;
              let ret = res.data;
              if (ret.code === 200) {
                this.showImport = false;
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("lib_try_apply");
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
          return false;
        }
      });
    },
    toPartIn(row) {
      this.currentLib = row;
      if (row.unUseAbleFlag) {
        this.$message({
          type: "warning",
          message: "您的这个题库已被禁用，不能申请试用"
        });
        return;
      }
      this.showImport = true;
      this.$nextTick(function() {
        this.$refs["ruleForm"].resetFields();
      });
    },
    querySearch(queryString, cb) {
      var schools = this.schoolList;
      var results = queryString
        ? this.createFilter(queryString, schools)
        : schools;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString, schoolList) {
      let arr = [];
      schoolList.forEach(item => {
        if (item.value.includes(queryString)) {
          arr.push({
            value: item.value
          });
        }
      });
      return arr;
    },
    handleSelectSchool(item) {
      this.ruleForm.partInSchool = item.value;
    },
    getSchoolList() {
      axios
        .request({
          method: "post",
          url: `${process.env.BASE_URL_V3}/ebook/school/list`,
          data: {
            pageNo: 1,
            pageSize: 9999
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let school = [];
            ret.data.records.forEach(element => {
              school.push({
                value: element.name
              });
            });
            this.schoolList = school;
          }
        });
    },
    goPay() {
      this.loading.payLoading = true;
      axios
        .request({
          method: "post",
          url: `/subject/libraryMall/pay`,
          data: {
            chargeType: this.payType,
            chargeMethod: 2,
            os: "PC",
            sblId: this.currentLib.sblId,
            uuid: this.sblPriceList[this.sblPriceListIndex].uuid // 价格uuid
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.payLoading = false;
          if (ret.code === 200) {
            this.qrcode = ret.data.codeUrl;
            this.orderCode = ret.data.orderCode;
            this.isPayShow = false;
            this.isQRcode = true;
            setTimeout(() => {
              this.queryPayStatus();
            }, 1000);
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    queryPayStatus() {
      axios
        .request({
          method: "post",
          url: `/order/queryOrderPayStatus`,
          data: {
            orderCode: this.orderCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("lib_buy");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              title: "提示",
              message: `支付成功，可前往"我的题库"查看`,
              type: "success",
              offset: 80
            });
            this.isQRcode = false;
            this.bus.$emit("myReload"); // 通知更新我的已购题库
            this.loadData();
          } else {
            this.timerId = setTimeout(() => {
              this.queryPayStatus();
            }, 1000);
          }
        });
    },
    handlePayClose() {
      this.isPayShow = false;
      this.payType = 2;
    },
    handleCode() {
      this.payType = 2;
      this.isQRcode = false;
      clearTimeout(this.timerId);
    }
  }
};
</script>
