<template>
  <el-container class="bookInfo">
    <el-header height="50px">
      <span class="book" @click="toBook">数字教材管理</span>
      <i class="el-icon-arrow-right"></i> <span>编辑数字教材</span>
    </el-header>
    <el-main>
      <div class="chapter-info-top">
        <div class="dtbook-name">{{ bookBaseInfo.tname }}</div>
        <div class="dtbook-info">
          <div class="dtbook-cover" @click="editInfo">
            <img
              v-if="bookBaseInfo.coverPic"
              :src="bookBaseInfo.coverPic"
              alt=""
            />
            <img
              v-else
              src="https://iph.href.lu/180x220?text=%E5%B0%81%E9%9D%A2&fg=666666&bg=cccccc"
              alt=""
            />
          </div>
          <div class="dtbook-info-l">
            <span>出版社:{{ bookBaseInfo.publishName }}</span>
            <span>作者:{{ bookBaseInfo.author }}</span>
            <span>总编辑:{{ bookBaseInfo.mainEditorName }}</span>
          </div>
          <div class="dtbook-info-r">
            <span>创建时间:{{ dateFormat(bookBaseInfo.createTime) }}</span>
            <span
              >出版状态:<span class="dtbook-info-status">{{
                formatStatus(bookBaseInfo.publishStatus)
              }}</span></span
            >
            <span>更新时间:{{ dateFormat(bookBaseInfo.updateTime) }}</span>
          </div>
        </div>
        <div class="dtbook-pub-btns">
          <el-button type="text" @click="editInfo">
            <template>
              <div
                style="width:100px;height:60px;display:flex;flex-direction:column;justify-content:center"
              >
                <i
                  class="iconfont icon-bianji"
                  style="font-size:25px;margin-bottom:5px"
                ></i>
                <span style="color:#666">修改基本信息</span>
              </div>
            </template>
          </el-button>
          <el-button type="text" @click="toApplyPublish">
            <template>
              <div
                style="width:100px;height:60px;display:flex;flex-direction:column;justify-content:center"
              >
                <i
                  class="iconfont icon-shangchuan"
                  style="font-size:25px;margin-bottom:5px"
                ></i>
                <span style="color:#666">申请发布</span>
              </div>
            </template>
          </el-button>
          <el-button type="text" @click="toUpdate">
            <template>
              <div
                style="width:100px;height:60px;display:flex;flex-direction:column;justify-content:center"
              >
                <i
                  class="iconfont icon-xiugaijilu"
                  style="font-size:25px;margin-bottom:5px"
                ></i>
                <span style="color:#666">发布更新</span>
              </div>
            </template>
          </el-button>
        </div>
      </div>
      <div class="chapter-info-b">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="章节目录" name="first">
            <div
              style="margin-bottom:10px;display:flex;justify-content:space-between"
            >
              <div style="display:flex;align-items: center;">
                <el-checkbox v-model="selectAll" @change="onSelectAll"
                  >全部章节</el-checkbox
                >

                <el-button
                  style="margin-left:30px"
                  :disabled="isAbleSubmit"
                  size="small"
                  plain
                  @click="submitAll"
                  >提交</el-button
                >
              </div>
              <div>
                <el-button
                  v-if="bookBaseInfo.joinType == 1"
                  style="float:right;margin-left:10px"
                  size="small"
                  plain
                  @click="goDtBook"
                  >查看内容</el-button
                >
                <el-button
                  v-if="bookBaseInfo.joinType == 1"
                  style="float:right;margin-left:10px"
                  size="small"
                  plain
                  @click="toExport"
                  >导出目录</el-button
                >
                <el-button
                  v-if="bookBaseInfo.joinType == 1"
                  style="float:right;"
                  size="small"
                  plain
                  @click="toBuild"
                  >新建章</el-button
                >
              </div>
            </div>
            <div>
              <el-tree
                ref="chapterTree"
                :data="data"
                show-checkbox
                node-key="id"
                :expand-on-click-node="true"
                @check="handleCheck"
                :check-strictly="true"
                :props="defaultProps"
              >
                <div
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @mouseenter="handleMouseenter($event)"
                  @mouseleave="handleMouseleave($event)"
                >
                  <!-- <img src="../../../assets/images/180.png" alt="" /> -->
                  <img
                    v-if="data.chapterId && data.coverPic"
                    :src="data.coverPic"
                    alt=""
                  />
                  <!-- <img v-if="" src="" alt="" /> -->
                  <div class="custom-tree-text">
                    <div>
                      <span @click.stop="editNode(data)">{{ data.title }}</span>
                      <span class="pub-status" v-if="data.status == 1"
                        >编辑中</span
                      >
                      <span class="pub-status" v-if="data.status == 2"
                        >已提交</span
                      >
                      <span class="pub-status" v-if="data.status == 3"
                        >已发布</span
                      >
                    </div>
                    <div
                      v-if="data.chapterId"
                      @click.stop="toChangeEditor(data)"
                    >
                      编辑：{{ data.editorName }}
                    </div>
                    <div v-if="data.chapterId">
                      共{{ data.nodeList ? data.nodeList.length : 0 }}节<span
                        >丨</span
                      >
                      <span
                        v-for="(item, index) in data.resourceNumList"
                        :key="index"
                        >{{ item.label }}：{{ item.num }}</span
                      >
                    </div>
                  </div>
                  <div class="custom-tree-btns">
                    <el-button v-if="data.status == 1" type="text" @click.stop>
                      <template>
                        <div>
                          <i class="iconfont icon-bianxiejuben"></i>
                          <span style="color:#666">编写</span>
                        </div>
                      </template>
                    </el-button>
                    <el-button
                      v-if="data.chapterId && data.status == 1"
                      type="text"
                      @click.stop="toBuildNode(data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-xinjian"></i>
                          <span style="color:#666">新建节</span>
                        </div>
                      </template>
                    </el-button>
                    <el-button
                      v-if="data.nodeId && bookBaseInfo.joinType == 1"
                      type="text"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-bianxiejuben"></i>
                          <span style="color:#666">编写内容</span>
                        </div>
                      </template>
                    </el-button>
                    <el-button
                      v-if="data.nodeId && bookBaseInfo.joinType == 1"
                      type="text"
                      @click.stop="toMoveNode(node, data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-xinjian"></i>
                          <span style="color:#666">转移节</span>
                        </div>
                      </template>
                    </el-button>

                    <el-button
                      v-if="data.chapterId && data.status == 1"
                      type="text"
                      @click.stop="submitContent(node, data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-tijiao"></i>
                          <span style="color:#666">提交</span>
                        </div>
                      </template>
                    </el-button>
                    <el-button
                      v-if="
                        data.chapterId &&
                          bookBaseInfo.joinType == 1 &&
                          data.status == 1
                      "
                      type="text"
                      @click.stop="deleteChapter(node, data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-shanchu"></i>
                          <span style="color:#666">删除</span>
                        </div>
                      </template>
                    </el-button>
                    <!-- v-if="data.nodeId && bookBaseInfo.joinType == 2" -->
                    <el-button
                      v-if="data.nodeId"
                      type="text"
                      @click.stop="deleteNode(node, data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-shanchu"></i>
                          <span style="color:#666">删除</span>
                        </div>
                      </template>
                    </el-button>
                    <el-button
                      v-if="data.chapterId && data.status != 1"
                      type="text"
                      @click.stop="reEdit(node, data)"
                    >
                      <template>
                        <div>
                          <i class="iconfont icon-lishijilu"></i>
                          <span style="color:#666">重新编辑</span>
                        </div>
                      </template>
                    </el-button>
                  </div>
                </div>
                <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
          <div>
            <img src="../assets/images/180.png" alt="" />
          </div>
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              Delete
            </el-button>
          </span>
        </span> -->
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="团队管理" name="second">
            <div style="margin-bottom:10px;overflow:hidden">
              <el-button
                style="float:right;margin-left:10px"
                size="small"
                type="primary"
                v-if="selectedEditor.length > 0"
                @click="batchDelEditor"
                >移除成员</el-button
              >
              <el-button
                style="float:right"
                size="small"
                @click="toAddEditor"
                type="primary"
                >添加成员</el-button
              >
            </div>
            <div>
              <el-table
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
                :data="memberList"
                border
                v-loading="loading.tableLoading"
                @selection-change="selectEditor"
              >
                <!-- :row-style="{ height: '60px' }" -->
                <el-table-column type="selection" align="center">
                </el-table-column>

                <el-table-column prop="id" label="ID" align="center" width="50">
                </el-table-column>
                <el-table-column prop="name" label="名字" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center">
                </el-table-column>
                <el-table-column label="角色" align="center" width="80">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.type == 1 ? "总编辑" : "辅助编辑"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="已分配章节"
                  align="center"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.chapterName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="添加时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ dateFormat(scope.row.addTime) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="toChangeChapter(scope.row)"
                      style="margin-left:0"
                      >转移章节</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="delEditor(scope.row)"
                      style="margin-left:0"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="tabelFooter">
                <div class="right-footer-first">
                  从
                  {{
                    (this.memberPage.currentPage - 1) *
                      this.memberPage.pagesize +
                      1
                  }}
                  到
                  {{
                    (this.memberPage.currentPage - 1) *
                      this.memberPage.pagesize +
                      this.memberList.length
                  }}
                  记录，共 {{ memberPage.total }} 条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  background
                  :total="memberPage.total"
                  :current-page.sync="memberPage.currentPage"
                  :page-size="memberPage.pagesize"
                  @current-change="getFeedList"
                ></el-pagination>
              </div> -->
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据概览" name="third">
            <div>数据概览</div>
          </el-tab-pane>
          <!-- <el-tab-pane label="读者反馈" name="fourth">
            <div style="margin-bottom:10px;overflow:hidden">
              <span style="color:#666;font-size:14px">状态</span>
              <el-select
                v-model="feedSearchForm.status"
                size="small"
                style="width:100px;"
                @change="enterKeyUp"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="待处理" value="1"></el-option>
                <el-option label="已处理" value="2"></el-option>
              </el-select>
              <span style="color:#666;font-size:14px">类型</span>
              <el-select
                v-model="feedSearchForm.type"
                size="small"
                style="width:100px;"
                @change="enterKeyUp"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="错别字" value="1"></el-option>
                <el-option label="内容错误" value="2"></el-option>
                <el-option label="其他" value="3"></el-option>
              </el-select>
            </div>
            <div>
              <el-table
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
                :data="feedList"
                border
                :row-style="{ height: '60px' }"
                v-loading="loading.feedLoading"
              >
                <el-table-column
                  prop="className"
                  label="序号"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="shouldStuNum"
                  label="章/节"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="教材内容"
                  label="角色"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="takeRate"
                  label="错误类型"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="takeRate"
                  label="反馈时间"
                  align="center"
                  min-width="120"
                >
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div class="right-footer-first">
                  从
                  {{
                    (this.feedPage.currentPage - 1) * this.feedPage.pagesize + 1
                  }}
                  到
                  {{
                    (this.feedPage.currentPage - 1) * this.feedPage.pagesize +
                      this.feedList.length
                  }}
                  记录，共 {{ feedPage.total }} 条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  background
                  :total="feedPage.total"
                  :current-page.sync="feedPage.currentPage"
                  :page-size="feedPage.pagesize"
                  @current-change="getFeedList"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="发布记录" name="fifth">
            <div>
              <div
                @click="showPubRecord = !showPubRecord"
                style="height:50px;line-height: 50px;user-select: none;cursor: pointer;"
              >
                <span>发布记录</span>
                <i
                  :class="
                    showPubRecord ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                  "
                ></i>
              </div>
              <el-collapse-transition>
                <div v-show="showPubRecord">
                  <el-table
                    :header-cell-style="{
                      'background-image':
                        'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                      color: '#333333',
                      height: '40px',
                      padding: '0'
                    }"
                    :data="pubRecordList"
                    border
                    :row-style="{ height: '60px' }"
                  >
                    <el-table-column prop="index" label="序号" align="center">
                    </el-table-column>
                    <el-table-column
                      prop="createUserName"
                      label="发布人"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="versionCode"
                      label="版本号"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="发布时间"
                      align="center"
                      min-width="120"
                    >
                      <template slot-scope="scope">
                        <span>{{ dateFormat(scope.row.createTime) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          style="margin-left:0"
                          @click="searchVersion(scope.row)"
                          >查看</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <div class="tabelFooter">
                    <div class="right-footer-first">
                      从
                      {{
                        (this.feedPage.currentPage - 1) *
                          this.feedPage.pagesize +
                          1
                      }}
                      到
                      {{
                        (this.feedPage.currentPage - 1) *
                          this.feedPage.pagesize +
                          this.feedList.length
                      }}
                      记录，共 {{ feedPage.total }} 条
                    </div>
                    <el-pagination
                      layout="prev, pager, next, jumper"
                      background
                      :total="feedPage.total"
                      :current-page.sync="feedPage.currentPage"
                      :page-size="feedPage.pagesize"
                      @current-change="getFeedList"
                    ></el-pagination>
                  </div> -->
                </div>
              </el-collapse-transition>
            </div>
            <!-- <div>
              <div
                @click="showModifyRecord = !showModifyRecord"
                style="height:50px;line-height: 50px;user-select: none;cursor: pointer;"
              >
                <span>修改记录</span>
                <i
                  :class="
                    showModifyRecord
                      ? 'el-icon-arrow-down'
                      : 'el-icon-arrow-right'
                  "
                ></i>
              </div>
              <el-collapse-transition>
                <div v-show="showModifyRecord">
                  <el-table
                    :header-cell-style="{
                      'background-image':
                        'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                      color: '#333333',
                      height: '40px',
                      padding: '0'
                    }"
                    :data="modifyRecordList"
                    border
                    :row-style="{ height: '60px' }"
                  >
                    <el-table-column
                      prop="order"
                      label="序号"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="发起人"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="handler"
                      label="处理人"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="提交时间"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      label="状态"
                      align="center"
                      min-width="120"
                    >
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                    
                    </el-table-column>
                  </el-table>
                 
                </div>
              </el-collapse-transition>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>

    <!-- 转移章节 -->
    <el-dialog
      title="转移章节"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-if="isChangeChapterShow"
      :visible.sync="isChangeChapterShow"
      :modal-append-to-body="false"
      :before-close="handleCloseChangeChapter"
      width="600px"
    >
      <div>
        可以选择另外的成员来编辑这个成员负责的章节，此成员将无法访问这本数字教材的内容
      </div>
      <el-form
        :model="userFormChangeChapter"
        ref="userFormChangeChapter"
        @submit.native.prevent
      >
        <el-form-item style="margin:20px 20%;" label="选择编辑">
          <el-select
            v-model="userFormChangeChapter.editorId"
            style="width:200px;"
            size="small"
          >
            <el-option
              v-for="item in memberList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="doAddMemberChangeChapter"
          >转移</el-button
        >
        <el-button size="small" @click="handleCloseChangeChapter"
          >取消</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加成员 -->
    <el-dialog
      title="添加成员"
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
          <span>请输入九斗用户手机号</span>
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

    <!-- 编辑分配 -->
    <el-dialog
      :visible.sync="isChangeEditorShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>编辑分配</div>
        </div>
      </template>
      <div>
        <el-form
          :model="changeEditorForm"
          ref="changeEditorForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="章名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="changeEditorForm.name"
              size="small"
              placeholder="请输入章名称"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="内容编辑" prop="editor">
            <el-select
              v-model="changeEditorForm.editor"
              style="width:300px;"
              size="small"
            >
              <el-option
                v-for="item in memberList"
                :key="item.id"
                :label="item.name"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doChangeEditor"
          >确认</el-button
        >
        <el-button size="small" @click="isChangeEditorShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改章 -->
    <el-dialog
      :visible.sync="isUpdateChapterShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
      class="add-chapter"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改章</div>
        </div>
      </template>
      <div>
        <el-form
          :model="updateChapterForm"
          ref="updateChapterForm"
          label-width="90px"
          :rules="updateChapterRules"
          @submit.native.prevent
        >
          <el-form-item label="章名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="updateChapterForm.name"
              size="small"
              placeholder="请输入章名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容编辑" prop="editor">
            <el-select
              v-model="updateChapterForm.editor"
              style="width:300px;"
              size="small"
            >
              <el-option
                v-for="item in memberList"
                :key="item.id"
                :label="item.name"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="章序号" prop="sort">
            <el-input
              style="width:300px"
              v-model.trim="updateChapterForm.sort"
              size="small"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="章序号"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <div style="display:flex">
              <el-upload
                :multiple="false"
                :with-credentials="true"
                class="cover-uploader"
                action=""
                :auto-upload="true"
                :http-request="uploadUpdateChapterFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="updateChapterForm.cover"
                  :src="updateChapterForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(updateChapterForm.cover)"
                  v-if="updateChapterForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doUpdateChapter"
          >确认</el-button
        >
        <el-button size="small" @click="isUpdateChapterShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 新建章 -->
    <el-dialog
      :visible.sync="isAddChapterShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
      class="add-chapter"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建章</div>
        </div>
      </template>
      <div>
        <el-form
          :model="chapterForm"
          ref="chapterForm"
          :rules="chapterRules"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="章名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="chapterForm.name"
              size="small"
              placeholder="请输入章名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容编辑" prop="editor">
            <el-select
              v-model="chapterForm.editor"
              style="width:300px;"
              size="small"
            >
              <el-option
                v-for="item in memberList"
                :key="item.id"
                :label="item.name"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="章序号" prop="sort">
            <el-input
              style="width:300px"
              v-model.trim="chapterForm.sort"
              size="small"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="章序号"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <div style="display:flex">
              <el-upload
                :multiple="false"
                :with-credentials="true"
                class="cover-uploader"
                action=""
                :auto-upload="true"
                :http-request="uploadChapterFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="chapterForm.cover"
                  :src="chapterForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(chapterForm.cover)"
                  v-if="chapterForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="chapterSureBuild"
          >确认</el-button
        >
        <el-button size="small" type="primary" @click="doNextBuild"
          >确认并继续新建</el-button
        >
        <el-button size="small" @click="isAddChapterShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 新建节 -->
    <el-dialog
      :visible.sync="isAddNodeShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建节</div>
        </div>
      </template>
      <div>
        <el-form
          :model="nodeForm"
          ref="nodeForm"
          label-width="90px"
          :rules="nodeFormRules"
          @submit.native.prevent
        >
          <el-form-item label="节名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="nodeForm.name"
              size="small"
              placeholder="请输入节名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="节序号" prop="sort">
            <el-input
              style="width:300px"
              v-model.trim="nodeForm.sort"
              size="small"
              placeholder="节序号"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="nodeSureBuild"
          >确认</el-button
        >
        <el-button size="small" type="primary" @click="doNextNode"
          >确认并继续新建</el-button
        >
        <el-button size="small" @click="isAddNodeShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改节 -->
    <el-dialog
      :visible.sync="isUpdateNodeShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改节</div>
        </div>
      </template>
      <div>
        <el-form
          :model="updateNodeForm"
          ref="updateNodeForm"
          label-width="90px"
          :rules="nodeFormRules"
          @submit.native.prevent
        >
          <el-form-item label="节名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="updateNodeForm.name"
              size="small"
              placeholder="请输入节名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="节序号" prop="sort">
            <el-input
              style="width:300px"
              v-model.trim="updateNodeForm.sort"
              size="small"
              placeholder="节序号"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doNodeUpdate"
          >确认</el-button
        >
        <el-button size="small" @click="isUpdateNodeShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 转移节 -->
    <el-dialog
      :visible.sync="isMoveNodeShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>转移节</div>
        </div>
      </template>
      <div>
        <el-form
          :model="moveNodeForm"
          ref="moveNodeForm"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="选择转移到的章" prop="editor">
            <el-select
              v-model="moveNodeForm.chapter"
              style="width:300px;"
              size="small"
            >
              <el-option
                v-for="item in data"
                :key="item.id"
                :label="item.title"
                :value="item.chapterId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转移后的节名称" prop="name">
            <el-input
              style="width:300px"
              v-model.trim="moveNodeForm.name"
              size="small"
              placeholder="请输入节名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="节排序">
            <el-input
              style="width:300px"
              v-model.trim="moveNodeForm.sort"
              oninput="value=value.replace(/[^0-9]/g,'')"
              size="small"
              placeholder="请输入节排序"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doMoveNode"
          >确认</el-button
        >
        <el-button size="small" @click="isMoveNodeShow = false">取消</el-button>
      </span>
    </el-dialog>

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
          <div>修改信息</div>
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
              <el-option label="新型数字教材编辑" value="2"></el-option>
              <el-option label="传统Epub编辑方式" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <span>￥</span>
            <el-input
              style="width:120px"
              v-model.trim="addForm.price"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              size="small"
              placeholder="请输入价格"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="教材简介" prop="intro">
            <Ueditor
              v-model.trim="addForm.bookIntro"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
          <el-form-item label="作者简介" prop="intro">
            <Ueditor
              v-model.trim="addForm.authorIntro"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="doSure"
          >确认修改</el-button
        >
        <el-button size="small" @click="isAddShow = false">取消修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="isSureShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="add-digital-book"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>确认信息</div>
        </div>
      </template>
      <div>
        <el-form
          :model="sureForm"
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
                :http-request="uploadSureFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="sureForm.cover"
                  :src="sureForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(sureForm.cover)"
                  v-if="sureForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="学科">
            <el-select
              v-model="sureForm.subjectType"
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
              v-model.trim="sureForm.name"
              size="small"
              placeholder="请输入书名"
            ></el-input>
          </el-form-item>
          <el-form-item label="书号">
            <el-input
              style="width:300px"
              v-model.trim="sureForm.num"
              size="small"
              placeholder="请输入书号"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input
              style="width:300px"
              v-model.trim="sureForm.author"
              size="small"
              placeholder="请输入作者"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input
              style="width:300px"
              v-model.trim="sureForm.pubName"
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
                @click="sureName"
                >使用</el-button
              >
            </span>
          </el-form-item>

          <el-form-item label="出版规划" prop="title">
            <el-select
              v-model="sureForm.pubPlan"
              size="small"
              style="width:200px;"
            >
              <el-option label="校本资源" value="1"></el-option>
              <el-option label="出版教材" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑方式" prop="title">
            <el-select
              v-model="sureForm.editType"
              size="small"
              style="width:200px;"
            >
              <el-option label="新型数字教材编辑" value="2"></el-option>
              <el-option label="传统Epub编辑方式" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <span>￥</span>
            <el-input
              style="width:120px"
              v-model.trim="sureForm.price"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              size="small"
              placeholder="请输入价格"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="教材简介" prop="intro">
            <Ueditor
              v-model.trim="sureForm.bookIntro"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
          <el-form-item label="作者简介" prop="intro">
            <Ueditor
              v-model.trim="sureForm.authorIntro"
              :initialFrameHeight="initialFrameHeight"
              :toolbars="toolbars"
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary" @click="sureInfo"
          >确认</el-button
        >
        <!-- <el-button size="small" @click="isAddShow = false">取消修改</el-button> -->
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="isExportShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-if="isExportShow"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>导出目录</div>
        </div>
      </template>
      <div>
        <el-tree
          ref="exportTree"
          :data="data"
          node-key="nodeId"
          :expand-on-click-node="true"
          default-expand-all
          :props="defaultProps"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <div class="custom-tree-text">
              <div>
                <span>{{ data.title }}</span>
              </div>
            </div>
          </div>
        </el-tree>
      </div>

      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          :disabled="data.length == 0"
          @click="doExport"
          >确认导出</el-button
        >
        <el-button size="small" @click="isExportShow = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="isPublishShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="add-chapter"
      v-if="isPublishShow"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>申请发布</div>
        </div>
      </template>
      <div>
        <div style="margin-bottom:20px">
          <el-checkbox
            style="font-size:16px"
            v-model="publishSelectAll"
            @change="onSelectAllApply"
            >全部章节</el-checkbox
          >
          <div style="font-size:16px">
            <el-tree
              ref="applyTree"
              :data="applyData"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              default-expand-all
              @check="handleCheckApply"
              :check-strictly="true"
              :props="defaultPropsApply"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <div class="custom-tree-text">
                  <div>
                    <span>{{ data.title }}</span>
                    <span
                      style="border: 1px solid #2ba1f4;color: #2ba1f4;font-weight: normal;padding: 2px 5px;font-size: 14px;border-radius: 10px;margin-left: 10px;"
                      v-if="data.status == 1"
                      >编辑中</span
                    >
                    <span
                      style="border: 1px solid #2ba1f4;color: #2ba1f4;font-weight: normal;padding: 2px 5px;font-size: 14px;border-radius: 10px;margin-left: 10px;"
                      v-if="data.status == 2"
                      >已提交</span
                    >
                    <span
                      style="border: 1px solid #2ba1f4;color: #2ba1f4;font-weight: normal;padding: 2px 5px;font-size: 14px;border-radius: 10px;margin-left: 10px;"
                      v-if="data.status == 3"
                      >已发布</span
                    >
                  </div>
                </div>
              </div>
            </el-tree>
          </div>
        </div>
        <div style="display:flex;margin-bottom:20px">
          <div style="margin-right:15px">申请发布说明</div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入申请发布说明"
            v-model.trim="publishIntro"
            style="width:500px"
            resize="none"
          >
          </el-input>
        </div>
        <div>
          <span>基本信息设置确认</span>
          <el-button
            type="text"
            size="small"
            :disabled="isConfirm"
            @click="toSure"
            >{{ isConfirm ? "已确认" : "去确认" }}</el-button
          >
        </div>
      </div>

      <span slot="footer">
        <el-button
          size="small"
          :disabled="!isConfirm || checkedNodesApply.length == 0"
          @click="doDistribute"
          type="primary"
          >申请发布</el-button
        >
        <el-button size="small" @click="isPublishShow = false">取消</el-button>
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
  </el-container>
</template>

<script>
// import { format } from "@/utils/datetime";
import { formatSS } from "@/utils/datetime";
import Ueditor from "@/components/ueditor";

import axios from "@/libs/api.request";

// import recommend from "./recommend";
export default {
  components: {
    Ueditor,
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer")
  },
  data() {
    // const data = [
    //   {
    //     id: 1,
    //     label: "一级 1",
    //     children: [
    //       {
    //         id: 4,
    //         label: "二级 1-1"
    //       }
    //     ]
    //   },
    //   {
    //     id: 2,
    //     label: "一级 2",
    //     children: [
    //       {
    //         id: 5,
    //         label: "二级 2-1"
    //       },
    //       {
    //         id: 6,
    //         label: "二级 2-2"
    //       }
    //     ]
    //   },
    //   {
    //     id: 3,
    //     label: "一级 3",
    //     children: [
    //       {
    //         id: 7,
    //         label: "二级 3-1"
    //       },
    //       {
    //         id: 8,
    //         label: "二级 3-2"
    //       }
    //     ]
    //   }
    // ];
    return {
      applyData: [],
      checkedNodesApply: [],
      // -----------
      isMoveNodeShow: false,
      moveNodeForm: {
        chapter: "",
        name: "",
        sort: ""
      },
      currentMoveNode: {},
      // ------------------ 章节转移
      isChangeChapterShow: false,
      isSelectChangeChapter: false,
      userResultChangeChapter: {},
      userFormChangeChapter: {
        editorId: "",
        id: ""
      },
      // ------------------
      selectedEditor: [],
      isSelect: false,
      userResult: {},
      isMemberShow: false,
      userForm: {
        mobile: ""
      },
      userRules: {
        mobile: [
          { required: true, message: "请输入正确手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      },
      // -------------------
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
      isConfirm: false,
      isSureShow: false,
      sureForm: {
        name: "",
        num: "",
        author: "",
        pubName: "",
        subjectType: 16,
        pubPlan: "1",
        editType: "2",
        cover: "",
        coverObj: null,
        price: "",
        bookIntro: "",
        authorIntro: ""
      },
      isUpdateNodeShow: false, // 修改节
      isPublishShow: false, // 申请发布
      publishSelectAll: false,
      publishIntro: "", // 申请发布说明
      data1: [],
      dtbookId: this.$route.query.dtbookId,
      bookBaseInfo: {
        tname: "",
        author: "",
        coverPic: "",
        publishName: "",
        tbNum: ""
      },
      selectAll: false,
      data: [],
      checkedNodes: [],
      savePubName: localStorage.getItem("savePubName"),
      editTypeList: [],
      showViewer: false,
      imgList: [],
      isAddShow: false,
      isAddChapterShow: false, // 新建章
      addForm: {
        name: "",
        num: "",
        author: "",
        pubName: "",
        subjectType: 16,
        pubPlan: "1",
        editType: "2",
        cover: "",
        coverObj: null,
        price: "",
        bookIntro: "",
        authorIntro: ""
      },
      chapterForm: {
        name: "",
        cover: "",
        sort: "",
        editor: ""
      },
      chapterRules: {
        name: [{ required: true, message: "请输入章名称", trigger: "blur" }],
        editor: [
          { required: true, message: "请选择内容编辑", trigger: "change" }
        ],
        sort: [{ required: true, message: "请输入章序号", trigger: "blur" }]
      },
      isUpdateChapterShow: false, // 修改章
      updateChapterForm: {
        name: "",
        cover: "",
        sort: "",
        editor: "",
        chapterVersionId: ""
      },
      updateChapterRules: {
        name: [{ required: true, message: "请输入章名称", trigger: "blur" }],
        editor: [
          { required: true, message: "请选择内容编辑", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入章序号", trigger: "blur" }]
      },
      isChangeEditorShow: false,
      changeEditorForm: {
        name: "",
        editor: "",
        chapterVersionId: ""
      },
      isAddNodeShow: false,
      nodeForm: {
        name: "",
        sort: "1",
        chapterVersionId: ""
      },
      nodeFormRules: {
        name: [{ required: true, message: "请输入节名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入节序号", trigger: "blur" }]
      },
      updateNodeForm: {
        name: "",
        sort: "",
        nodeVersionId: ""
      },
      activeName: "first",
      id: "",
      alreadySave: "",
      memberList: [],
      memberPage: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      loading: {
        tableLoading: false,
        feedLoading: false
      },
      feedSearchForm: {
        status: "",
        type: ""
      },
      feedList: [],
      feedPage: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      showPubRecord: true,
      showModifyRecord: true,
      pubRecordList: [],
      modifyRecordList: [],
      defaultProps: {
        children: "nodeList",
        label: "nodeId",
        disabled: "isGrey"
      },
      defaultPropsApply: {
        children: "nodeList",
        label: "nodeId",
        disabled: "isAble"
      },
      isExportShow: false
    };
  },
  computed: {
    isAbleSubmit() {
      return this.checkedNodes.length == 0;
    },
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  methods: {
    // 申请发布
    doDistribute() {
      let data = {};
      let ids = [];
      this.checkedNodesApply.forEach(item => {
        ids.push(item.chapterId);
      });
      data.dtbookId = this.dtbookId;
      data.chapterIds = ids.join(",");
      data.description = this.publishIntro;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/applyForPublishAudit",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.publishSelectAll = false;
            this.$refs.applyTree.setCheckedKeys([]);
            this.checkedNodesApply = [];
            this.isPublishShow = false;
            this.getChapter();
            this.$message({
              type: "success",
              message: "发布成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toMoveNode(node, data) {
      this.currentMoveNode = data;
      this.isMoveNodeShow = true;
      this.moveNodeForm.chapter = "";
      this.moveNodeForm.name = data.title;
      this.moveNodeForm.sort = data.ordering;
    },
    // 转移节
    doMoveNode() {
      if (!this.moveNodeForm.chapter) {
        this.$message({
          type: "warning",
          message: "请选择转移到的章"
        });
        return;
      }
      if (!this.moveNodeForm.name) {
        this.$message({
          type: "warning",
          message: "请填写转移后的节名称"
        });
        return;
      }
      if (!this.moveNodeForm.sort) {
        this.$message({
          type: "warning",
          message: "请填写转移后的节排序"
        });
        return;
      }
      let data = {};
      data.nodeId = this.currentMoveNode.nodeVerSionId;
      data.title = this.moveNodeForm.name;
      data.targetChapterId = this.moveNodeForm.chapter;
      data.ordering = this.moveNodeForm.sort;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/chapter/moveNode",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isMoveNodeShow = false;
            this.getChapter();
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
    // 转移章节
    toChangeChapter(row) {
      this.isChangeChapterShow = true;
      this.userFormChangeChapter.editorId = row.id;
      this.userFormChangeChapter.id = row.id;
    },
    // 团队成员选择事件
    selectEditor(selection) {
      this.selectedEditor = selection;
    },
    toAddEditor() {
      this.isMemberShow = true;
    },
    // 转移章节
    handleCloseChangeChapter() {
      this.isChangeChapterShow = false;
    },
    handleClose() {
      this.userForm.mobile = "";
      this.userResult = {};
      this.isSelect = false;
      this.isMemberShow = false;
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
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },
    doAddMember() {
      let data = {};
      data.dtbookId = this.dtbookId;
      data.teamUid = this.userResult.uid;
      data.name = this.userResult.username;
      data.mobile = this.userResult.mobile;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/team/add",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isMemberShow = false;
            this.getMemberList();
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
    doAddMemberChangeChapter() {
      let data = {};
      data.id = this.userFormChangeChapter.id;
      data.targetId = this.userFormChangeChapter.editorId;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/team/moveChapter",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isChangeChapterShow = false;
            this.getMemberList();
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
    goDtBook() {
      // 跳转编辑器
    },
    // 导出目录
    toExport() {
      this.isExportShow = true;
    },
    doExport() {
      // 导出目录
    },
    toSure() {
      this.isSureShow = true;
      this.sureForm.name = this.bookBaseInfo.tname;
      this.sureForm.cover = this.bookBaseInfo.coverPic;
      this.sureForm.pubName = this.bookBaseInfo.publishName;
      this.sureForm.author = this.bookBaseInfo.author;
      this.sureForm.num = this.bookBaseInfo.tbNum;
      this.sureForm.pubPlan = String(this.bookBaseInfo.planType);
      this.sureForm.editType = String(this.bookBaseInfo.editType);
      this.sureForm.subjectType = this.bookBaseInfo.sid;
      this.sureForm.price = this.bookBaseInfo.price
        ? this.bookBaseInfo.price
        : "";
      this.sureForm.bookIntro = this.bookBaseInfo.bookIntro
        ? this.bookBaseInfo.bookIntro
        : "";
      this.sureForm.authorIntro = this.bookBaseInfo.authorIntroduction
        ? this.bookBaseInfo.authorIntroduction
        : "";
    },
    // 申请发布
    toApplyPublish() {
      this.isPublishShow = true;
      console.log(this.data);
      let arr = JSON.parse(JSON.stringify(this.data));
      arr.forEach(item => {
        if (item.status == 2) {
          item.isAble = false;
        } else {
          item.isAble = true;
        }
        delete item.nodeList;
      });
      this.applyData = arr.length > 0 ? arr : [];
    },
    toUpdate() {
      this.$confirm(
        `已经发布的章节可以进行重新编辑，确认将会重新替换内容！`,
        "发布更新",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          let params = {};
          params.dtbookId = this.dtbookId;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/publishUpdate",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "warning",
                  message: "发布更新成功"
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
    handleMouseenter(e) {
      e.target.lastChild.style.display = "block";
    },
    handleMouseleave(e) {
      e.target.lastChild.style.display = "none";
    },
    // 获取el-tree所有节点的id数组
    getAllTreeNodeIds() {
      let nodeIds = [];
      this.getTreeNodeIds(this.data, nodeIds);
      return nodeIds;
    },
    // 获取el-tree所有节点的id数组（申请发布）
    getAllTreeNodeIdsApply() {
      let nodeIds = [];
      this.getTreeNodeIdsApply(this.applyData, nodeIds);
      return nodeIds;
    },
    getTreeNodeIds(nodes, nodeIds) {
      for (const node of nodes) {
        if (!node.isGrey && node.status == 1) {
          nodeIds.push(node.id);
        }
        if (node.nodeList) {
          this.getTreeNodeIds(node.nodeList, nodeIds);
        }
      }
    },
    getTreeNodeIdsApply(nodes, nodeIds) {
      for (const node of nodes) {
        if (node.status == 2) {
          nodeIds.push(node.id);
        }
      }
    },
    // 处理勾选事件
    handleCheck(checkedNodes) {
      // 比较选中节点的数量与所有节点的数量，修改selectAll的状态
      let allNode = [];
      allNode = this.getAllTreeNodeIds();
      console.log(allNode);
      let arr = [];
      arr = this.$refs.chapterTree.getCheckedNodes();
      console.log(arr);
      this.checkedNodes = this.$refs.chapterTree.getCheckedNodes();
      this.selectAll = allNode.length === arr.length;
    },
    // 处理勾选事件(申请发布)
    handleCheckApply(checkedNodes) {
      let allNode = [];
      allNode = this.getAllTreeNodeIdsApply();
      console.log(allNode);
      let arr = [];
      arr = this.$refs.applyTree.getCheckedNodes();
      console.log(arr);
      this.checkedNodesApply = this.$refs.applyTree.getCheckedNodes();
      this.publishSelectAll = allNode.length === arr.length;
    },
    // 选中所有章节（申请发布）
    onSelectAllApply(val) {
      if (val) {
        this.$refs.applyTree.setCheckedKeys(this.getAllTreeNodeIdsApply());
        this.checkedNodesApply = this.$refs.applyTree.getCheckedNodes();
      } else {
        this.$refs.applyTree.setCheckedKeys([]);
        this.checkedNodesApply = [];
      }
    },
    // 选中所有章节
    onSelectAll(val) {
      console.log(this.checkedNodes);
      if (val) {
        this.$refs.chapterTree.setCheckedKeys(this.getAllTreeNodeIds());
        this.checkedNodes = this.$refs.chapterTree.getCheckedNodes();
      } else {
        this.$refs.chapterTree.setCheckedKeys([]);
        this.checkedNodes = [];
      }
    },
    editInfo() {
      this.isAddShow = true;
      this.addForm.name = this.bookBaseInfo.tname;
      this.addForm.cover = this.bookBaseInfo.coverPic;
      this.addForm.pubName = this.bookBaseInfo.publishName;
      this.addForm.author = this.bookBaseInfo.author;
      this.addForm.num = this.bookBaseInfo.tbNum;
      this.addForm.pubPlan = String(this.bookBaseInfo.planType);
      this.addForm.editType = String(this.bookBaseInfo.editType);
      this.addForm.subjectType = this.bookBaseInfo.sid;
      this.addForm.price = this.bookBaseInfo.price
        ? this.bookBaseInfo.price
        : "";
      this.addForm.bookIntro = this.bookBaseInfo.bookIntro
        ? this.bookBaseInfo.bookIntro
        : "";
      this.addForm.authorIntro = this.bookBaseInfo.authorIntroduction
        ? this.bookBaseInfo.authorIntroduction
        : "";
    },
    doSure() {
      let data = {};
      data.dtbookId = this.dtbookId;
      data.coverPic = this.addForm.cover;
      data.tname = this.addForm.name;
      data.tbNum = this.addForm.num;
      data.author = this.addForm.author;
      data.sid = this.addForm.subjectType;
      data.publishName = this.addForm.pubName;
      data.planType = this.addForm.pubPlan;
      data.editType = this.addForm.editType;
      data.price = this.addForm.price;
      data.bookIntro = this.addForm.bookIntro;
      data.authorIntroduction = this.addForm.authorIntro;
      data.pubId = this.pubId;

      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/updateBaseInfo",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isAddShow = false;
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.getBaseInfo();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    sureInfo() {
      if (!this.sureForm.name) {
        this.$message({
          type: "warning",
          message: "请填写书名"
        });
        return;
      }
      if (!this.sureForm.num) {
        this.$message({
          type: "warning",
          message: "请填写书号"
        });
        return;
      }
      if (!this.sureForm.price) {
        this.$message({
          type: "warning",
          message: "请填写价格"
        });
        return;
      }
      let data = {};
      data.dtbookId = this.dtbookId;
      data.coverPic = this.sureForm.cover;
      data.tname = this.sureForm.name;
      data.tbNum = this.sureForm.num;
      data.author = this.sureForm.author;
      data.sid = this.sureForm.subjectType;
      data.publishName = this.sureForm.pubName;
      data.planType = this.sureForm.pubPlan;
      data.editType = this.sureForm.editType;
      data.price = this.sureForm.price;
      data.bookIntro = this.sureForm.bookIntro;
      data.authorIntroduction = this.sureForm.authorIntro;
      data.pubId = this.pubId;

      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/updateBaseInfo",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isSureShow = false;
            this.isConfirm = true;
            this.$message({
              type: "success",
              message: "确认信息成功"
            });
            this.getBaseInfo();
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
    // 上传章封面
    uploadUpdateChapterFile(params) {
      this.updateChapterForm.cover = params;
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
                  this.chapterForm.cover = accessUrl;
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
    // 上传章封面
    uploadChapterFile(params) {
      this.chapterForm.cover = params;
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
                  this.chapterForm.cover = accessUrl;
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
    // 上传图片(确认信息)
    uploadSureFile(params) {
      this.sureForm.cover = params;
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
                  this.sureForm.cover = accessUrl;
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
    usSavePubName() {
      this.addForm.pubName = localStorage.getItem("savePubName");
    },
    sureName() {
      this.sureForm.pubName = localStorage.getItem("savePubName");
    },
    dateFormat(row) {
      return formatSS(row);
    },
    formatStatus(status) {
      if (status == 0) {
        return "创建中";
      } else if (status == 1) {
        return "审核中";
      } else if (status == 2) {
        return "发行处理中";
      } else if (status == 3) {
        return "审核不通过";
      } else if (status == 4) {
        return "已上架";
      } else if (status == 4) {
        return "已下架";
      }
    },
    toBook() {
      this.$router.push({
        name: "epubBooks"
      });
    },
    getBaseInfo() {
      let params = {};
      params.dtbookId = this.dtbookId;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/queryBaseInfo",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookBaseInfo = ret.data;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    getMemberList() {
      this.loading.tableLoading = true;
      let params = {};
      params.pageNo = this.memberPage.currentPage;
      params.pageSize = this.memberPage.pagesize;

      params.dtbookId = this.dtbookId;

      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/team/queryList",
          data: params
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.memberList = ret.data;
            // this.memberPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    enterKeyUp() {
      this.feedPage.currentPage = 1;
      this.getFeedList();
    },
    getFeedList() {
      this.loading.feedLoading = true;
      let params = {};
      params.pageNo = this.feedPage.currentPage;
      params.pageSize = this.feedPage.pagesize;
      if (this.feedSearchForm.status) {
        params.status = this.feedSearchForm.status;
      }
      if (this.feedSearchForm.type) {
        params.type = this.feedSearchForm.type;
      }
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/readerFeedback/queryPage",
          data: params
        })
        .then(res => {
          this.loading.feedLoading = false;

          let ret = res.data;
          if (ret.code === 200) {
            this.feedList = ret.data.records;
            this.feedPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    getPubList() {
      let params = {};
      params.dtbookId = this.dtbookId;
      params.pageNo = 1;
      params.pageSize = 999;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/queryEditorBookProgressPage",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.records.forEach((element, idx) => {
              element.index = idx + 1;
            });
            this.pubRecordList = ret.data.records;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchVersion(row) {
      let params = {};
      params.progressId = row.progressId;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/queryProgressVersionContent",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // @todo  跳转编辑器
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getModifyList() {
      let params = {};
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/version/queryUpdateOperationList",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.modifyRecordList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toBuild() {
      this.isAddChapterShow = true;
    },
    toBuildNode(data) {
      this.nodeForm.chapterVersionId = data.chapterVersionId;
      if (data.nodeList && data.nodeList.length > 0) {
        this.nodeForm.sort = data.nodeList.length + 1;
      } else {
        this.nodeForm.sort = "1";
      }
      this.isAddNodeShow = true;
    },
    // 编辑分配
    toChangeEditor(data) {
      this.isChangeEditorShow = true;
      this.changeEditorForm.name = data.title;
      this.changeEditorForm.editor = data.editorUid;
      this.changeEditorForm.chapterVersionId = data.chapterVersionId;
    },
    editNode(data) {
      if (data.nodeId) {
        // 修改节
        this.isUpdateNodeShow = true;
        this.updateNodeForm.name = data.title;
        this.updateNodeForm.sort = data.ordering;
        this.updateNodeForm.nodeVersionId = data.nodeVerSionId;
      } else {
        // 修改章
        this.isUpdateChapterShow = true;
        this.updateChapterForm.name = data.title;
        this.updateChapterForm.cover = data.coverPic;
        this.updateChapterForm.sort = data.ordering;
        this.updateChapterForm.editor = data.editorUid;
        this.updateChapterForm.chapterVersionId = data.chapterVersionId;
      }
    },
    handleTabClick(tab, event) {
      if (tab.name == "first") {
        // 章节目录
        this.getChapter();
      } else if (tab.name == "second") {
        // 团队管理
        this.getMemberList();
      } else if (tab.name == "third") {
        // 数据概览
      } else if (tab.name == "fourth") {
        // 读者反馈
        this.getFeedList();
      } else if (tab.name == "fifth") {
        // 发布记录
        this.getPubList();
        // this.getModifyList();
      }
    },
    getChapter() {
      let data = {};
      data.dtbookId = this.dtbookId;
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/chapter/queryEditorInfoList",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.data = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    doChangeEditor() {
      let data = {
        chapterVersionId: this.changeEditorForm.chapterVersionId,
        title: this.changeEditorForm.name,
        editorUid: this.changeEditorForm.editor
      };
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/chapter/update",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "分配成功"
            });
            this.isChangeEditorShow = false;
            this.getChapter();
          } else {
            this.$message({
              type: "error",
              message: ret.msg
            });
          }
        });
    },
    doNodeUpdate() {
      this.$refs["updateNodeForm"].validate(valid => {
        if (valid) {
          let data = {
            nodeVersionId: this.updateNodeForm.nodeVersionId,
            title: this.updateNodeForm.name,
            ordering: this.updateNodeForm.sort
          };
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/updateNode",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.isUpdateNodeShow = false;
                this.getChapter();
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
    doUpdateChapter() {
      this.$refs["updateChapterForm"].validate(valid => {
        if (valid) {
          let data = {
            chapterVersionId: this.updateChapterForm.chapterVersionId,
            title: this.updateChapterForm.name,
            ordering: this.updateChapterForm.sort,
            editorUid: this.updateChapterForm.editor
          };
          if (this.updateChapterForm.cover) {
            data.cover = this.updateChapterForm.cover;
          }
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/update",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.isUpdateChapterShow = false;
                this.getChapter();
              } else {
                this.$message({
                  type: "error",
                  message: ret.msg
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    doNextBuild() {
      this.$refs["chapterForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.dtbookId = this.dtbookId;
          data.title = this.chapterForm.name;
          data.editorUid = this.chapterForm.editor;
          data.ordering = this.chapterForm.sort;
          data.coverPic = this.chapterForm.cover;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/add",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "新建成功"
                });
                this.chapterForm.name = "";
                this.chapterForm.sort = "";
                this.chapterForm.cover = "";
                this.getChapter();
                this.$nextTick(function() {
                  this.$refs["chapterForm"].resetFields();
                });
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
    chapterSureBuild() {
      this.$refs["chapterForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.dtbookId = this.dtbookId;
          data.title = this.chapterForm.name;
          data.editorUid = this.chapterForm.editor;
          data.ordering = this.chapterForm.sort;
          data.coverPic = this.chapterForm.cover;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/add",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isAddChapterShow = false;
                this.chapterForm.name = "";
                this.chapterForm.editor = "";
                this.chapterForm.sort = "";
                this.chapterForm.cover = "";
                this.$message({
                  type: "success",
                  message: "新建成功"
                });
                this.getChapter();
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
    nodeSureBuild() {
      this.$refs["nodeForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.chapterVersionId = this.nodeForm.chapterVersionId;
          data.title = this.nodeForm.name;
          data.ordering = this.nodeForm.sort;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/addNode",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isAddNodeShow = false;
                this.nodeForm.name = "";
                this.nodeForm.sort = "";
                this.$message({
                  type: "success",
                  message: "新建节成功"
                });
                this.getChapter();
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
    doNextNode() {
      this.$refs["nodeForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.chapterVersionId = this.nodeForm.chapterVersionId;
          data.title = this.nodeForm.name;
          data.ordering = this.nodeForm.sort;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/addNode",
              data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "新建节成功"
                });
                this.getChapter();
                this.$nextTick(function() {
                  this.$refs["nodeForm"].resetFields();
                });
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
    submitAll() {
      this.$confirm(`确定要全部提交已选中章节内容吗?`, "提交内容", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          let chapterVersionIds = [];
          this.checkedNodes.forEach(item => {
            if (item.chapterVersionId) {
              chapterVersionIds.push(item.chapterVersionId);
            }
          });
          params.chapterVersionIds = chapterVersionIds.join(",");
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/submitEdit",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.selectAll = false;
                this.$refs.chapterTree.setCheckedKeys([]);
                this.checkedNodes = [];
                this.getChapter();
                this.$message({
                  type: "success",
                  message: "提交成功"
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
    // 提交内容
    submitContent(node, data) {
      console.log(node, data);

      this.$confirm(`确定要提交本书"${data.title}"的内容吗?`, "提交内容", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          params.chapterVersionIds = data.chapterVersionId;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/submitEdit",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.getChapter();
                this.$message({
                  type: "success",
                  message: "提交成功"
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
    // 重新编辑
    reEdit(node, data) {
      this.$confirm(
        "确定要重新编辑本章?编辑后需要再次提交，更新内容才会重新上传",
        "重新编辑",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          let params = {};
          params.chapterVersionId = data.chapterVersionId;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/reEdit",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$refs.chapterTree.setCheckedKeys([]);
                this.checkedNodes = [];
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.getChapter();
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
    // 删除章
    deleteChapter(node, data) {
      this.$prompt(`确定要删除本书"${data.title}"的内容吗?`, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value != data.title) {
            this.$message({
              type: "warning",
              message: "输入的章名称与要删除的章名称不匹配，请检查"
            });
            return;
          }
          let params = {};
          params.chapterVersionId = data.chapterVersionId;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/delete",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getChapter();
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
    //  删除节
    deleteNode(node, data) {
      this.$confirm("确定要删除该节吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          params.nodeVersionId = data.nodeVersionId;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/chapter/deleteNode",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.getChapter();
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
    delEditor(row) {
      this.$confirm(
        "确定要移除成员吗?移除成员后，该成员上传的数据会保留，但是该成员将无法访问这本数字教材的内容",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = {};
          params.id = row.id;
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/team/remove",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.getMemberList();
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
    },
    batchDelEditor() {
      this.$confirm(
        "确定要移除成员吗?移除成员后，该成员上传的数据会保留，但是该成员将无法访问这本数字教材的内容",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let ids = [];
          this.selectedEditor.forEach(i => {
            ids.push(i.id);
          });
          let params = {};
          params.id = ids.join(",");
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/team/remove",
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.selectedEditor = [];
                this.getMemberList();
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
  },
  mounted() {
    this.getBaseInfo();
    this.getCourseTypeList();
    this.getChapter();
    this.getMemberList();
  }
};
</script>

<style lang="scss">
.add-digital-book {
  .el-dialog__body {
    height: 65vh;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-form-item {
    margin-bottom: 18px;
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

.add-chapter {
  .el-form-item {
    margin-bottom: 18px;
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

.bookInfo {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2ba1f4;
    }
  }
  .el-tabs__item.is-active {
    color: #2ba1f4;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px 18px 12px 18px;
    .chapter-info-top {
      height: 340px;
      .dtbook-name {
        margin-bottom: 10px;
      }
      .dtbook-info {
        display: flex;
        .dtbook-cover {
          font-size: 0;
          margin-right: 20px;
          cursor: pointer;
          img {
            width: 160px;
            height: 200px;
          }
        }
        .dtbook-info-l {
          width: 40%;
          display: flex;
          flex-direction: column;
          span {
            margin-bottom: 30px;
          }
        }
        .dtbook-info-r {
          width: 30%;
          display: flex;
          flex-direction: column;
          span {
            margin-bottom: 30px;
          }
          .dtbook-info-status {
            border: 1px solid #409eff;
            padding: 4px;
            border-radius: 5px;
            color: #409eff;
          }
        }
        .dtbook-pub-btns {
          display: flex;
          .el-button:focus,
          .el-button:hover {
            background-color: none;
          }
          // /deep/ .mmy-btn {
          //   padding: 0;
          // }
        }
      }
    }
    .chapter-info-b {
      height: 100%;
      .el-tabs__content {
        .el-tree-node__content {
          height: 80px;
        }
        .custom-tree-node {
          width: 100%;
          display: flex;
          position: relative;
          align-items: center;
          img {
            width: 60px;
            height: 60px;
          }
          .custom-tree-text {
            margin-left: 10px;
            .pub-status {
              border: 1px solid #2ba1f4;
              color: #2ba1f4;
              font-weight: normal;
              padding: 2px 5px;
              font-size: 14px;
              border-radius: 10px;
              margin-left: 10px;
            }
          }
          .custom-tree-btns {
            position: absolute;
            right: 0;
            line-height: 80px;
            display: none;
          }
        }
      }
    }
  }
}
</style>
