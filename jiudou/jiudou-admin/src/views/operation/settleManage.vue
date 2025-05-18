<template>
  <el-tabs class="settleManage" v-model="current">
    <el-tab-pane label="结算管理" name="first" class="settlement container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-date-picker
            v-model="settleDates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="settleDatesChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select
            v-model="settleForm.accoType"
            style="width:100px;"
            @change="settleParamChange"
          >
            <el-option
              v-for="item in settleStatus"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="settleForm.keyWord"
            placeholder="用户、姓名、单号"
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
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="结算单号"
          prop="stateId"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column label="用户" align="center" width="250">
          <template slot-scope="scope">
            {{
              scope.row.stateApplicantNickname +
                "（" +
                scope.row.applicantPhone +
                "）"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="收款人姓名"
          prop="statePayeeName"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column label="申请结算金额（元）" align="center">
          <template slot-scope="scope">{{
            formatMoney(scope.row.stateApplyAmount)
          }}</template>
        </el-table-column>
        <el-table-column label="服务费（元）" align="center">
          <template slot-scope="scope">{{
            scope.row.stateStatus == 2
              ? formatMoney(scope.row.stateServiceAmount)
              : "核算中"
          }}</template>
        </el-table-column>
        <el-table-column label="实际支付金额（元）" align="center">
          <template slot-scope="scope">{{
            scope.row.stateStatus == 2
              ? formatMoney(scope.row.statePaymentAmount)
              : "核算中"
          }}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="150px">
          <template slot-scope="scope">{{
            formatTime(scope.row.stateApplyTime)
          }}</template>
        </el-table-column>
        <el-table-column label="结算时间" align="center" width="150px">
          <template slot-scope="scope">{{
            formatTime(scope.row.stateDoneTime)
          }}</template>
        </el-table-column>
        <el-table-column label="结算状态" align="center">
          <template slot-scope="scope">{{
            scope.row.stateStatus == 2 ? "已结算" : "处理中"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.stateStatus == 2"
              @click="showDetail(scope.row)"
              type="text"
              size="small"
              >查看</el-button
            >
            <el-button
              v-else
              @click="dealSettle(scope.row)"
              type="text"
              size="small"
              >结算</el-button
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
          @current-change="loadSettleList"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="购课记录" name="second" class="order container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-date-picker
            size="small"
            v-model="orderDates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="orderDatesChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select
            v-model="orderForm.platformType"
            style="width:100px;"
            @change="onSearchOrder"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="安卓" value="2"></el-option>
            <el-option label="苹果" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select
            v-model="orderForm.payType"
            style="width:100px;"
            @change="onSearchOrder"
          >
            <el-option
              v-for="type in payTypes"
              :key="type.type"
              :label="type.name"
              :value="type.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="orderForm.keyword"
            class="input-with-select"
            @keyup.enter.native="onSearchOrder"
          >
            <el-select
              v-model="orderForm.searchType"
              slot="prepend"
              placeholder="请选择"
              style="width: 130px;"
            >
              <el-option label="用户手机号" value="1"></el-option>
              <el-option label="九斗订单号" value="3"></el-option>
              <el-option label="支付交易单号" value="2"></el-option>
            </el-select>
          </el-input>
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
          <el-button size="small" type="primary" @click="exportOrderExcel"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="orderList"
        v-loading="loading.orderList"
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
          label="平台类型"
          prop="platformType"
          align="center"
          width="80"
          :formatter="formatPlatformType"
        ></el-table-column>
        <el-table-column
          label="支付方式"
          prop="payType"
          align="center"
          width="100"
          :formatter="formatPayType"
        ></el-table-column>
        <el-table-column
          label="九斗订单号"
          prop="orderNum"
          align="center"
          width="270"
        ></el-table-column>
        <el-table-column
          label="支付交易单号"
          prop="tradeNum"
          align="center"
          width="240"
        ></el-table-column>
        <el-table-column label="云课名称" min-width="150" align="center">
          <template slot-scope="scope">
            <span style="margin-right:5px;">{{ scope.row.goodsName }}</span>
            <el-button type="text" @click="copyText(scope.row.goodsId)"
              >复制ID</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="用户信息" align="center" width="200">
          <template slot-scope="scope"
            >{{ scope.row.consumerName }} ({{
              scope.row.consumerPhone
            }})</template
          >
        </el-table-column>
        <el-table-column
          label="订单状态"
          prop="orderStatus"
          align="center"
          :formatter="formatOrderType"
        ></el-table-column>
        <el-table-column
          label="订单金额（元）"
          prop="orderMoney"
          align="center"
          width="120"
        >
          <template slot-scope="scope">{{
            formatMoney(scope.row.orderMoney)
          }}</template>
        </el-table-column>
        <el-table-column
          label="实际收益（元）"
          prop="realIncomeMoney"
          align="center"
          width="120"
        >
          <template slot-scope="scope">{{
            formatMoney(scope.row.realIncomeMoney)
          }}</template>
        </el-table-column>
        <el-table-column label="订单时间" align="center" width="150">
          <template slot-scope="scope">{{
            formatTime(scope.row.createTime)
          }}</template>
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
    <el-tab-pane label="充值记录" name="third" class="record container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-date-picker
            size="small"
            v-model="recordDates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="recordDatesChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select
            v-model="recordForm.platformType"
            style="width:100px;"
            @change="onSearchRecord"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="安卓" value="2"></el-option>
            <el-option label="苹果" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select
            v-model="recordForm.chargeType"
            style="width:100px;"
            @change="onSearchRecord"
          >
            <el-option
              v-for="type in payTypes"
              :key="type.type"
              :label="type.name"
              :value="type.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="recordForm.keyword"
            class="input-with-select"
            @keyup.enter.native="onSearchRecord"
          >
            <el-select
              v-model="recordForm.searchType"
              slot="prepend"
              placeholder="请选择"
              style="width: 130px;"
            >
              <el-option label="用户手机号" value="1"></el-option>
              <el-option label="九斗订单号" value="3"></el-option>
              <el-option label="支付交易单号" value="2"></el-option>
            </el-select>
          </el-input>
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
          <el-button size="small" type="primary" @click="exportRecordExcel"
            >导出</el-button
          >
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
          label="平台类型"
          prop="platformType"
          align="center"
          width="80"
          :formatter="formatPlatformType"
        ></el-table-column>
        <el-table-column
          label="支付方式"
          prop="chargeType"
          align="center"
          width="100"
          :formatter="formatChargeType"
        ></el-table-column>
        <el-table-column
          label="九斗订单号"
          prop="orderUniqueNum"
          align="center"
        ></el-table-column>
        <el-table-column
          label="支付交易单号"
          prop="tradeNum"
          align="center"
        ></el-table-column>
        <el-table-column label="用户信息" align="center" width="200">
          <template slot-scope="scope"
            >{{ scope.row.customerNN }} ({{ scope.row.customerAcco }})</template
          >
        </el-table-column>
        <el-table-column
          label="充值状态"
          prop="orderStatus"
          align="center"
          :formatter="formatOrderType"
          width="200"
        ></el-table-column>
        <el-table-column
          label="充值金额（九斗币）"
          prop="orderLabelMoney"
          align="center"
          width="150"
        >
          <template slot-scope="scope">{{
            formatMoney(scope.row.orderLabelMoney)
          }}</template>
        </el-table-column>
        <el-table-column
          label="实付金额（元）"
          prop="realBenifitMoney"
          align="center"
          width="120"
        >
          <template slot-scope="scope">{{
            formatMoney(scope.row.realBenifitMoney)
          }}</template>
        </el-table-column>
        <el-table-column
          label="充值时间"
          prop="orderT"
          align="center"
          width="160"
        >
          <template slot-scope="scope">{{
            formatTime(scope.row.orderT)
          }}</template>
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
    </el-tab-pane>
    <el-tab-pane label="入账统计" name="fourth" class="record container">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-date-picker
            size="small"
            v-model="staticDates"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="staticDatesChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入账类型">
          <el-select
            v-model="staticForm.incomeType"
            style="width:100px;"
            @change="onSearchStatic"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="余额充值" value="6"></el-option>
            <el-option label="云课直购" value="5"></el-option>
            <el-option label="考试" value="8"></el-option>
            <el-option label="竞赛" value="9"></el-option>
            <el-option label="刷题测验" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select
            v-model="staticForm.payType"
            style="width:100px;"
            @change="onSearchStatic"
          >
            <el-option
              v-for="type in payTypes"
              :key="type.type"
              :label="type.name"
              :value="type.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="staticForm.keyword"
            class="input-with-select"
            @keyup.enter.native="onSearchStatic"
          >
            <el-select
              v-model="staticForm.searchType"
              slot="prepend"
              placeholder="请选择"
              style="width: 130px;"
            >
              <el-option label="用户手机号" value="1"></el-option>
              <el-option label="九斗订单号" value="3"></el-option>
              <el-option label="支付交易单号" value="2"></el-option>
              <el-option label="云课名称" value="4"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="onSearchStatic"
            class="el-icon-search"
          ></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button size="small" type="primary" @click="exportStaticExcel"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
      <div style="font-size:20px;margin-bottom:20px">
        查询合计：<span style="color: #FF783D;">{{
          staticForm.totalMoeny
        }}</span>
      </div>
      <el-table
        :data="staticList"
        v-loading="loading.staticList"
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
          label="入账类型"
          prop="platformType"
          align="center"
          width="80"
          :formatter="formatStaticType"
        ></el-table-column>
        <el-table-column
          label="支付方式"
          prop="chargeType"
          align="center"
          width="100"
          :formatter="formatPayType"
        ></el-table-column>
        <el-table-column
          label="九斗订单号"
          prop="jdOrderCode"
          align="center"
        ></el-table-column>
        <el-table-column
          width="150"
          label="云课名称"
          prop="orderBookName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="支付交易单号"
          prop="thirdpartyPayCode"
          align="center"
        ></el-table-column>
        <el-table-column label="用户信息" align="center" width="200">
          <template slot-scope="scope"
            >{{ scope.row.consumerName }} ({{
              scope.row.consumerPhone
            }})</template
          >
        </el-table-column>
        <el-table-column
          label="入账金额（元）"
          prop="realBenifitMoney"
          align="center"
          width="120"
        >
          <template slot-scope="scope">{{
            formatMoney(scope.row.realIncomeMoney)
          }}</template>
        </el-table-column>
        <el-table-column
          label="入账时间"
          prop="payTimeFormat"
          align="center"
          width="160"
        ></el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="staticList.length" class="right-footer-first">
          从{{ (staticPage.page - 1) * staticPage.pagesize + 1 }}到{{
            (staticPage.page - 1) * staticPage.pagesize + staticList.length
          }}记录，共{{ staticPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="staticPage.total"
          :page-size="staticPage.pagesize"
          :current-page.sync="staticPage.page"
          background
          @current-change="loadStaticList"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="异常订单" name="fifth" class="record container">
      <el-table
        :data="badOrderList"
        v-loading="loading.badOrderList"
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
          label="九斗订单号"
          prop="aprOrderCode"
          align="center"
        ></el-table-column>
        <el-table-column label="用户信息" align="center">
          <span slot-scope="scope">{{
            scope.row.aprUserName + "(" + scope.row.aprMobile + ")"
          }}</span>
        </el-table-column>
        <el-table-column label="订单状态" prop="jdOrderCode" align="center">
          <span slot-scope="scope">{{
            scope.row.aprStatus == 3 ? "异常" : "正常"
          }}</span>
        </el-table-column>
        <el-table-column label="充值金额" prop="aprOrderPrice" align="center">
          <span slot-scope="scope">{{ scope.row.aprOrderPrice / 100 }}</span>
        </el-table-column>
        <el-table-column
          label="失败原因"
          prop="aprReason"
          align="center"
        ></el-table-column>
        <el-table-column label="充值时间" align="center">
          <span slot-scope="scope">{{ formatTime(scope.row.aprPayTime) }}</span>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.aprStatus == 3"
              type="text"
              size="small"
              @click="handleBadOrder(scope.row)"
              >处理</el-button
            >
            <span v-else style="color:#999">已处理</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="badOrderList.length" class="right-footer-first">
          从{{ (badOrderPage.page - 1) * badOrderPage.pagesize + 1 }}到{{
            (badOrderPage.page - 1) * badOrderPage.pagesize +
              badOrderList.length
          }}记录，共{{ badOrderPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="badOrderPage.total"
          :page-size="badOrderPage.pagesize"
          :current-page.sync="badOrderPage.page"
          background
          @current-change="loadBadOrderList"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <!-- 结算 -->
    <jd-dialog
      :loading="loading.settleSure"
      title="结算处理"
      :visible.sync="dialogShow.dealSettle"
      :close_on_click_modal="false"
      width="700px"
      @sure="settleSure"
    >
      <template slot="body">
        <el-form
          :model="dealSettleForm"
          ref="dealSettleForm"
          :rules="dealSettleRules"
          label-width="150px"
          size="small"
        >
          <el-form-item label="服务费：￥" prop="serviceAmount">
            <el-input
              style="width: 200px"
              v-model="dealSettleForm.serviceAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="实际支付金额：￥" prop="payAmount">
            <el-input
              style="width: 200px"
              v-model="dealSettleForm.payAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算凭证：">
            <el-upload
              ref="uploadFiles"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              accept="image/png, image/jpeg"
              :multiple="true"
            >
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <!-- 结算详情 -->
    <jd-dialog
      title="结算详情"
      :visible.sync="dialogShow.settleDetail"
      :noFooter="true"
    >
      <template slot="body">
        <div>申请结算</div>
        <el-form
          label-width="100px"
          label-position="left"
          style="margin: 0 80px;"
        >
          <el-form-item label="结算单号">
            <div>{{ currentSettlement.stateId }}</div>
          </el-form-item>
          <el-form-item label="结算金额">
            <div>{{ currentSettlement.stateApplyAmount }}</div>
          </el-form-item>
          <el-form-item label="收款人姓名">
            <div>{{ currentSettlement.statePayeeName }}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div>{{ currentSettlement.applicantPhone }}</div>
          </el-form-item>
          <el-form-item label="收款银行">
            <div>{{ currentSettlement.stateBankName }}</div>
          </el-form-item>
          <el-form-item label="收款银行卡号">
            <div>{{ currentSettlement.stateBankAccount }}</div>
          </el-form-item>
        </el-form>
        <div>
          <span style="padding-right: 20px;">结算结果</span>
          <span>{{
            currentSettlement.stateStatus == 2 ? "已结算" : "处理中"
          }}</span>
        </div>
        <div
          v-if="
            currentSettlement.stateStatus == 2 &&
              currentSettlement.pPicUrlList &&
              currentSettlement.pPicUrlList.length
          "
          style="margin-top: 22px;margin-bottom: 22px;overflow:hidden"
        >
          <div style="padding-right:20px;float:left">结算凭证</div>
          <div style="width:480px;float:left">
            <img
              class="settleImage"
              v-for="(item, index) in currentSettlement.pPicUrlList"
              :key="index"
              :value="index"
              :src="item"
            />
          </div>
        </div>
      </template>
    </jd-dialog>
  </el-tabs>
</template>

<style lang="scss">
.settleManage {
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
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import common from "@/utils/common";
export default {
  components: {
    "jd-dialog": jdialog
  },
  data() {
    return {
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
        staticList: false,
        badOrderList: false
      },
      settleList: [],
      settlePage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      orderList: [],
      orderPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      settleStatus: [
        { type: "", name: "全部" },
        { type: "1", name: "处理中" },
        { type: "2", name: "已结算" }
      ],
      settleForm: {
        beginT: 0,
        endtT: 0,
        accoType: "",
        keyWord: ""
      },
      settleDates: [],
      orderForm: {
        beginT: 0,
        endT: 0,
        keyword: "",
        platformType: "",
        payType: "",
        searchType: "1"
      },
      orderDates: [],
      currentSettlement: {},
      dealSettleForm: {
        serviceAmount: "",
        payAmount: "",
        files: []
      },
      dealSettleRules: {
        serviceAmount: [
          { required: true, message: "请输入服务费", trigger: "blur" }
        ],
        payAmount: [
          { required: true, message: "请输入实际支付金额", trigger: "blur" }
        ]
      },
      //充值记录
      recordList: [],
      recordDates: [],
      recordForm: {
        beginT: 0,
        endT: 0,
        keyword: "",
        platformType: "",
        chargeType: "",
        searchType: "1"
      },
      recordPage: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      //入账统计
      staticDates: [],
      staticList: [],
      staticForm: {
        beginT: 0,
        endT: 0,
        keyword: "",
        incomeType: "",
        payType: "",
        searchType: "1",
        totalMoeny: ""
      },
      staticPage: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 异常订单
      badOrderList: [],
      badOrderPage: {
        page: 1,
        pagesize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.loadSettleList();
    this.loadOrderList();
    this.loadRecordList();
    this.loadStaticList();
    this.loadBadOrderList();
  },
  methods: {
    // 结算明细
    loadSettleList() {
      this.loading.settleList = true;
      axios
        .request({
          method: "post",
          url: "v1/ccStatement/selStates",
          data: {
            startTime: this.settleForm.beginT ? this.settleForm.beginT : "",
            endTime: this.settleForm.endtT ? this.settleForm.endtT : "",
            stateStatus: this.settleForm.accoType,
            searchWords: this.settleForm.keyWord,
            pageNum: this.settlePage.page,
            pagesize: this.settlePage.pageSize
          }
        })
        .then(res => {
          this.loading.settleList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.settlePage.total = ret.data.total;
            if (ret.data.data) {
              this.settleList = ret.data.data;
            } else {
              this.settleList = [];
            }
          }
        })
        .catch(() => {
          this.loading.settleList = false;
        });
    },
    // 订单管理
    loadOrderList() {
      this.loading.orderList = true;
      let data = {};
      if (this.orderForm.beginT) {
        data.beginTime = this.orderForm.beginT;
      }
      if (this.orderForm.endT) {
        data.endTime = this.orderForm.endT;
      }
      if (this.orderForm.keyword) {
        data.searchWords = this.orderForm.keyword;
        data.searchType = this.orderForm.searchType;
      }
      if (this.orderForm.platformType) {
        data.platformType = this.orderForm.platformType;
      }
      if (this.orderForm.payType) {
        data.payType = this.orderForm.payType;
      }
      data.pageNum = this.orderPage.page;
      data.pagesize = this.orderPage.pageSize;
      axios
        .request({
          method: "post",
          url: "/v1/order/superMannagerSelOrders",
          data: data
        })
        .then(res => {
          this.loading.orderList = false;
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data) {
              this.orderList = ret.data.data;
              this.orderPage.total = ret.data.total;
            } else {
              this.orderList = [];
            }
          }
        })
        .catch(() => {
          this.loading.orderList = false;
        });
    },
    settleParamChange() {
      this.settlePage.page = 1;
      this.loadSettleList();
    },
    settleDatesChange() {
      if (this.settleDates) {
        this.settleForm.beginT = this.settleDates[0].getTime();
        this.settleForm.endtT = this.settleDates[1].getTime();
      } else {
        this.settleForm.beginT = 0;
        this.settleForm.endtT = 0;
      }
      this.settleParamChange();
    },
    onSearchOrder() {
      this.orderParamChange();
    },
    orderParamChange() {
      this.orderPage.page = 1;
      this.loadOrderList();
    },
    orderDatesChange() {
      if (this.orderDates) {
        this.orderForm.beginT = this.orderDates[0].getTime();
        this.orderForm.endT = this.orderDates[1].getTime();
      } else {
        this.orderForm.beginT = 0;
        this.orderForm.endT = 0;
      }
      this.orderParamChange();
    },
    onSearchSettlement() {
      this.settleParamChange();
    },
    // 结算
    settleSure() {
      this.$refs["dealSettleForm"].validate(valid => {
        if (valid) {
          let fd = new FormData();
          fd.append("stateId", this.currentSettlement.stateId);
          fd.append("serviceAmount", this.dealSettleForm.serviceAmount * 100);
          fd.append("payAmount", this.dealSettleForm.payAmount * 100);
          let files = this.$refs["uploadFiles"].uploadFiles;
          if (files && files.length) {
            files.forEach(element => {
              fd.append("files", element.raw);
            });
          }
          this.loading.settleSure = true;
          axios
            .request({
              method: "post",
              url: "v1/ccStateProof/uploadStateProofs",
              data: fd
            })
            .then(res => {
              this.loading.settleSure = false;
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadSettleList();
                this.dialogShow.dealSettle = false;
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.loading.settleSure = false;
            });
        } else {
          return false;
        }
      });
    },
    // 开始结算
    dealSettle(row) {
      this.currentSettlement = row;
      this.dealSettleForm.serviceAmount = "";
      this.dealSettleForm.payAmount = "";
      this.dealSettleForm.files = [];
      this.dialogShow.dealSettle = true;
    },
    // 结算详情
    showDetail(row) {
      this.currentSettlement = row;
      this.dialogShow.settleDetail = true;
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
    // 导出excel
    exportOrderExcel() {
      let url = "";
      if (this.orderForm.beginT == 0) {
        url =
          process.env.BASE_URL +
          "/v1/order/exportOrderXlsx?beginTime=" +
          "&platformType=" +
          this.orderForm.platformType +
          "&payType=" +
          this.orderForm.payType +
          "&searchType=" +
          this.orderForm.searchType +
          "&searchWords=" +
          this.orderForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      } else {
        url =
          process.env.BASE_URL +
          "/v1/order/exportOrderXlsx?beginTime=" +
          this.orderForm.beginT +
          "&endTime=" +
          this.orderForm.endT +
          "&platformType=" +
          this.orderForm.platformType +
          "&payType=" +
          this.orderForm.payType +
          "&searchType=" +
          this.orderForm.searchType +
          "&searchWords=" +
          this.orderForm.keyword +
          "&token=" +
          this.$store.state.user.token;
      }
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 订单状态
    formatOrderType(row) {
      if (row.orderStatus == 0) {
        return "未付款";
      } else if (row.orderStatus == 1) {
        return "已付款未发货";
      } else if (row.orderStatus == 2) {
        return "已发货";
      } else if (row.orderStatus == 3) {
        return "已经收货";
      } else if (row.orderStatus == 4) {
        return "作废";
      } else if (row.orderStatus == 5) {
        return "其他";
      } else if (row.orderStatus == 6) {
        return "申请退款";
      } else if (row.orderStatus == 7) {
        return "申请退货";
      } else if (row.orderStatus == 8) {
        return "同意退货";
      } else if (row.orderStatus == 9) {
        return "拒绝退货";
      } else if (row.orderStatus == 10) {
        return "确认收货(已付款)";
      } else if (row.orderStatus == 11) {
        return "订单结束";
      } else if (row.orderStatus == 12) {
        return "同意退款";
      } else if (row.orderStatus == 13) {
        return "拒绝退款";
      } else if (row.orderStatus == 14) {
        return "已提交退货审核";
      } else if (row.orderStatus == 15) {
        return "已提交退款审核";
      } else if (row.orderStatus == 16) {
        return "收货失败";
      } else if (row.orderStatus == 17) {
        return "已退款";
      } else if (row.orderStatus == 18) {
        return "订单取消";
      }
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
    //充值记录
    recordDatesChange() {
      if (this.recordDates) {
        this.recordForm.beginT = this.recordDates[0].getTime();
        this.recordForm.endT = this.recordDates[1].getTime();
      } else {
        this.recordForm.beginT = 0;
        this.recordForm.endT = 0;
      }
      this.onSearchRecord();
    },
    onSearchRecord() {
      this.recordPage.page = 1;
      this.loadRecordList();
    },
    loadRecordList() {
      this.loading.recordList = true;
      let data = {};
      if (this.recordForm.endT) {
        data.beginT = this.recordForm.beginT;
        data.endT = this.recordForm.endT;
      }
      data.platformType = this.recordForm.platformType;
      data.chargeType = this.recordForm.chargeType;
      if (this.recordForm.keyword) {
        data.searchType = this.recordForm.searchType;
        data.keyword = this.recordForm.keyword;
      }
      data.page = this.recordPage.page;
      data.pageSize = this.recordPage.pagesize;
      axios
        .request({
          method: "post",
          url: "/v1/order/chargeListWithCount",
          data: data
        })
        .then(res => {
          this.loading.recordList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.recordPage.total = ret.data.total;
            if (ret.data.data) {
              this.recordList = ret.data.data;
              this.recordList.total = ret.data.total;
            } else {
              this.recordList = [];
            }
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
    //入账统计
    staticDatesChange() {
      if (this.staticDates) {
        this.staticForm.beginT = this.staticDates[0].getTime();
        this.staticForm.endT = this.staticDates[1].getTime();
      } else {
        this.staticForm.beginT = 0;
        this.staticForm.endT = 0;
      }
      this.onSearchStatic();
    },
    onSearchStatic() {
      this.staticPage.page = 1;
      this.loadStaticList();
    },
    loadStaticList() {
      this.loading.staticList = true;
      let data = {};
      if (this.staticForm.beginT) {
        data.beginTime = this.staticForm.beginT;
        data.endTime = this.staticForm.endT;
      }
      if (this.staticForm.incomeType) {
        data.incomeType = this.staticForm.incomeType;
      }
      if (this.staticForm.payType) {
        data.payType = this.staticForm.payType;
      }
      if (this.staticForm.keyword) {
        data.searchType = this.staticForm.searchType;
        data.searchWords = this.staticForm.keyword;
      }
      if (this.staticForm.searchType == 4) {
        data.orderBookName = this.staticForm.keyword;
      }
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
    //异常订单
    loadBadOrderList() {
      this.loading.badOrderList = true;
      axios
        .request({
          method: "post",
          url: "/order/v4/apr/listWithCount",
          data: {
            page: this.badOrderPage.page,
            pageSize: this.badOrderPage.pagesize
          }
        })
        .then(res => {
          this.loading.badOrderList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.badOrderList = ret.data.data;
            this.badOrderPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.badOrderList = false;
        });
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
    }
  }
};
</script>
