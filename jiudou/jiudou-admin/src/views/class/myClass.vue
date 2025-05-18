<template>
  <el-container class="myClass">
    <!-- <el-header>我的班级</el-header> -->
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="exam-list"
      ref="tabs"
    >
      <el-tab-pane label="我的班级" name="first">
        <el-main v-loading="loading.classList">
          <el-button
            type="primary"
            size="small"
            @click="createClass"
            style="float:right;margin-bottom:15px;"
            >创建班级</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="goPublish"
            style="float:right;margin-bottom:15px;margin-right:10px"
            >发布作业</el-button
          >
          <div class="empty-classes" v-if="ingClass.length === 0">
            <img src="@/assets/images/empty1.png" alt="" />
            <span>暂无班级</span>
          </div>
          <div v-else class="cardbox">
            <div
              v-for="(cls, index) in ingClass"
              :key="index"
              style="display:flex;"
            >
              <div class="classCard-new" @click="enterClass(cls)">
                <div class="classCard-new-t">
                  <div class="className">
                    {{ cls.classname }}
                  </div>
                  <div class="time">
                    <span style="margin-right:90px"
                      >创建时间：{{ formatTime(cls.addTime) }}</span
                    >
                    <div class="class-code" @click.stop="goClassCode(cls)">
                      班级码
                      <img src="../../assets/images/class_code.png" alt="" />
                    </div>
                  </div>
                  <!-- trigger="click" -->
                  <div @click.stop>
                    <el-dropdown class="editButton-new" :hide-on-click="true">
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="editClassInfo(cls)"
                          >班级设置
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="toCopyClass(cls)"
                          >班级复制
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="toAssistClass(cls)"
                          >邀请协助
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                        <el-dropdown-item divided
                          >锁定
                          <el-switch
                            v-model="cls.isLock"
                            :active-value="1"
                            :inactive-value="0"
                            @change="lockChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            锁定后学生不能加入和退出班级
                          </div>
                        </el-dropdown-item>
                        <el-dropdown-item
                          >结课
                          <el-switch
                            v-model="cls.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="closeChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            结课后数据归档，老师不能发起活动
                          </div>
                        </el-dropdown-item>

                        <el-dropdown-item
                          divided
                          @click.native="deleteClass(cls)"
                          >删除
                          <i
                            class="el-icon-delete"
                            style="color:#0177D5;margin-left:170px;"
                          ></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="classCard-new-b">
                  <div class="classCard-new-b-text">
                    <span style="font-size:20px">成员：{{ cls.stuNum }}人</span>
                    <div
                      class="classCard-new-b-text-set-top"
                      @click.stop="classToTop(cls)"
                    >
                      <img src="../../assets/images/set_top.png" alt="" />
                      <span style="font-size:20px;cursor: pointer;">置顶</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div style="display:flex">
                <div
                  class="cardAside"
                  style="background:rgba(57,188,249);"
                ></div>
                <div
                  class="classCard"
                  style="background:rgba(57,188,249,0.1);"
                  @click="enterClass(cls)"
                >
                  <div class="className">{{ cls.classname }}</div>
                  <div class="courseName">
                    {{ cls.coursename }}
                    <span class="stuNum">{{ cls.stuNum }}人</span>
                    <span class="stuNum">创建人:{{ cls.teaName }}</span>
                  </div>
                  <div class="time">
                    创建时间：{{ formatTime(cls.addTime) }}
                  </div>

                  <el-button class="enterButton" size="small" type="text"
                    >进入班级 >></el-button
                  >
                </div>
              </div> -->
              <!-- <div>
                11111
              </div> -->
              <!-- <el-dropdown
                class="editButton"
                trigger="click"
                :hide-on-click="true"
              >
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editClassInfo(cls)"
                    >班级设置
                    <i
                      class="el-icon-arrow-right"
                      style="color:#0177D5;font-weight:bold;margin-left:143px;"
                    ></i>
                  </el-dropdown-item>
                  <el-dropdown-item divided
                    >锁定
                    <el-switch
                      v-model="cls.isLock"
                      :active-value="1"
                      :inactive-value="0"
                      @change="lockChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      锁定后学生不能加入和退出班级
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item
                    >结课
                    <el-switch
                      v-model="cls.status"
                      :active-value="1"
                      :inactive-value="0"
                      @change="closeChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      结课后数据归档，老师不能发起活动
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item divided @click.native="deleteClass(cls)"
                    >删除
                    <i
                      class="el-icon-delete"
                      style="color:#0177D5;margin-left:170px;"
                    ></i>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </div>
          </div>
          <!-- <div
            v-if="endClass && endClass.length"
            style="border-top:1px solid #EAEAEA;"
          >
            <el-button
              size="small"
              type="text"
              style="color:#333;font-size:16px;margin-top:10px;margin-bottom:10px;"
              @click="showClosedClass = !showClosedClass"
            >
              已结课
              <img
                v-if="showClosedClass"
                src="@/assets/images/d_arrow_down.png"
              />
              <img v-else src="@/assets/images/d_arrow_right.png" />
            </el-button>
          </div> -->
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="协助的班级" name="second">
        <el-main v-loading="loading.assistList">
          <!-- <el-button
            type="primary"
            size="small"
            @click="createClass"
            style="float:right;margin-bottom:15px;"
            >创建班级</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="goPublish"
            style="float:right;margin-bottom:15px;margin-right:10px"
            >发布作业</el-button
          > -->
          <div
            class="empty-classes"
            v-if="assistClass.length === 0 && assistEndClass.length === 0"
          >
            <img src="@/assets/images/empty1.png" alt="" />
            <span>暂无协助班级</span>
          </div>
          <div v-else class="cardbox">
            <div
              v-for="(cls, index) in assistClass"
              :key="index"
              style="display:flex;"
            >
              <div class="classCard-new" @click="enterClass(cls)">
                <div class="classCard-new-t">
                  <div class="className">
                    {{ cls.classname }}
                  </div>
                  <div class="time">
                    <span style="margin-right:90px"
                      >创建时间：{{ formatTime(cls.addTime) }}</span
                    >
                    <div class="class-code" @click.stop="goClassCode(cls)">
                      班级码
                      <img src="../../assets/images/class_code.png" alt="" />
                    </div>
                  </div>
                  <!-- trigger="click" -->
                  <div @click.stop>
                    <el-dropdown class="editButton-new" :hide-on-click="true">
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="editClassInfo(cls)"
                          >班级设置
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item @click.native="toCopyClass(cls)"
                          >班级复制
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item> -->
                        <el-dropdown-item divided
                          >锁定
                          <el-switch
                            v-model="cls.isLock"
                            :active-value="1"
                            :inactive-value="0"
                            @change="lockChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            锁定后学生不能加入和退出班级
                          </div>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item
                          >结课
                          <el-switch
                            v-model="cls.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="closeChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            结课后数据归档，老师不能发起活动
                          </div>
                        </el-dropdown-item> -->

                        <el-dropdown-item divided @click.native="quitClass(cls)"
                          >退出协助
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="classCard-new-b">
                  <div class="classCard-new-b-text">
                    <span style="font-size:20px">成员：{{ cls.stuNum }}人</span>
                    <div
                      class="classCard-new-b-text-set-top"
                      @click.stop="classToTop2(cls)"
                    >
                      <img src="../../assets/images/set_top.png" alt="" />
                      <span style="font-size:20px;cursor: pointer;">置顶</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div style="display:flex">
                <div
                  class="cardAside"
                  style="background:rgba(57,188,249);"
                ></div>
                <div
                  class="classCard"
                  style="background:rgba(57,188,249,0.1);"
                  @click="enterClass(cls)"
                >
                  <div class="className">{{ cls.classname }}</div>
                  <div class="courseName">
                    {{ cls.coursename }}
                    <span class="stuNum">{{ cls.stuNum }}人</span>
                    <span class="stuNum">创建人:{{ cls.teaName }}</span>
                  </div>
                  <div class="time">
                    创建时间：{{ formatTime(cls.addTime) }}
                  </div>

                  <el-button class="enterButton" size="small" type="text"
                    >进入班级 >></el-button
                  >
                </div>
              </div> -->
              <!-- <div>
                11111
              </div> -->
              <!-- <el-dropdown
                class="editButton"
                trigger="click"
                :hide-on-click="true"
              >
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editClassInfo(cls)"
                    >班级设置
                    <i
                      class="el-icon-arrow-right"
                      style="color:#0177D5;font-weight:bold;margin-left:143px;"
                    ></i>
                  </el-dropdown-item>
                  <el-dropdown-item divided
                    >锁定
                    <el-switch
                      v-model="cls.isLock"
                      :active-value="1"
                      :inactive-value="0"
                      @change="lockChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      锁定后学生不能加入和退出班级
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item
                    >结课
                    <el-switch
                      v-model="cls.status"
                      :active-value="1"
                      :inactive-value="0"
                      @change="closeChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      结课后数据归档，老师不能发起活动
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item divided @click.native="deleteClass(cls)"
                    >删除
                    <i
                      class="el-icon-delete"
                      style="color:#0177D5;margin-left:170px;"
                    ></i>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </div>
          </div>
          <div
            v-if="assistEndClass && assistEndClass.length"
            style="border-top:1px solid #EAEAEA;"
          >
            <el-button
              size="small"
              type="text"
              style="color:#333;font-size:16px;margin-top:10px;margin-bottom:10px;"
              @click="showClosedClass = !showClosedClass"
            >
              已结课
              <img
                v-if="showClosedClass"
                src="@/assets/images/d_arrow_down.png"
              />
              <img v-else src="@/assets/images/d_arrow_right.png" />
            </el-button>
            <div class="cardbox" v-if="showClosedClass">
              <div
                v-for="(cls, index) in assistEndClass"
                :key="index"
                style="display:flex"
              >
                <div class="classCard-new" @click="enterClass(cls)">
                  <div
                    class="classCard-new-t"
                    style="background:rgba(166,178,197,0.1);"
                  >
                    <div class="className">
                      {{ cls.classname }}
                    </div>
                    <div class="time">
                      <span style="margin-right:90px"
                        >创建时间：{{ formatTime(cls.addTime) }}</span
                      >
                      <div class="class-code" @click.stop="goClassCode(cls)">
                        班级码
                        <img src="../../assets/images/class_code.png" alt="" />
                      </div>
                    </div>
                    <el-dropdown class="editButton-new" :hide-on-click="true">
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="editClassInfo(cls)"
                          >班级设置
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item
                          >邀请协助
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item> -->
                        <el-dropdown-item divided
                          >锁定
                          <el-switch
                            v-model="cls.isLock"
                            :active-value="1"
                            :inactive-value="0"
                            @change="lockChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            锁定后学生不能加入和退出班级
                          </div>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item
                          >结课
                          <el-switch
                            v-model="cls.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="closeChange(index, cls)"
                            active-color="#0177D5"
                            inactive-color="#F0F1F5"
                            style="margin-left:150px;"
                          ></el-switch>
                          <div style="color: #999;font-size: 12px;">
                            结课后数据归档，老师不能发起活动
                          </div>
                        </el-dropdown-item> -->

                        <el-dropdown-item divided @click.native="quitClass(cls)"
                          >退出协助
                          <i
                            class="el-icon-arrow-right"
                            style="color:#0177D5;font-weight:bold;margin-left:143px;"
                          ></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="classCard-new-b">
                    <div class="classCard-new-b-text">
                      <span style="font-size:20px"
                        >成员：{{ cls.stuNum }}人</span
                      >
                      <div
                        @click.stop="classToTop2(cls)"
                        class="classCard-new-b-text-set-top"
                      >
                        <img src="../../assets/images/set_top.png" alt="" />
                        <span style="font-size:20px;cursor: pointer;"
                          >置顶</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="已结课班级" name="third">
        <el-main>
          <div class="empty-classes" v-if="endClass.length === 0">
            <img src="@/assets/images/empty1.png" alt="" />
            <span>暂无已结课班级</span>
          </div>
          <div v-else class="cardbox">
            <div
              v-for="(cls, index) in endClass"
              :key="index"
              style="display:flex"
            >
              <div class="classCard-new" @click="enterClass(cls)">
                <div
                  class="classCard-new-t"
                  style="background:rgba(166,178,197,0.1);"
                >
                  <div class="className">
                    {{ cls.classname }}
                  </div>
                  <div class="time">
                    <span style="margin-right:90px"
                      >创建时间：{{ formatTime(cls.addTime) }}</span
                    >
                    <div class="class-code" @click.stop="goClassCode(cls)">
                      班级码
                      <img src="../../assets/images/class_code.png" alt="" />
                    </div>
                  </div>
                  <el-dropdown class="editButton-new" :hide-on-click="true">
                    <i class="el-icon-more"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editClassInfo(cls)"
                        >班级设置
                        <i
                          class="el-icon-arrow-right"
                          style="color:#0177D5;font-weight:bold;margin-left:143px;"
                        ></i>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="toCopyClass(cls)"
                        >班级复制
                        <i
                          class="el-icon-arrow-right"
                          style="color:#0177D5;font-weight:bold;margin-left:143px;"
                        ></i>
                      </el-dropdown-item>
                      <el-dropdown-item divided
                        >锁定
                        <el-switch
                          v-model="cls.isLock"
                          :active-value="1"
                          :inactive-value="0"
                          @change="lockChange(index, cls)"
                          active-color="#0177D5"
                          inactive-color="#F0F1F5"
                          style="margin-left:150px;"
                        ></el-switch>
                        <div style="color: #999;font-size: 12px;">
                          锁定后学生不能加入和退出班级
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item
                        >结课
                        <el-switch
                          v-model="cls.status"
                          :active-value="1"
                          :inactive-value="0"
                          @change="closeChange(index, cls)"
                          active-color="#0177D5"
                          inactive-color="#F0F1F5"
                          style="margin-left:150px;"
                        ></el-switch>
                        <div style="color: #999;font-size: 12px;">
                          结课后数据归档，老师不能发起活动
                        </div>
                      </el-dropdown-item>

                      <el-dropdown-item divided @click.native="deleteClass(cls)"
                        >删除
                        <i
                          class="el-icon-delete"
                          style="color:#0177D5;margin-left:170px;"
                        ></i>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="classCard-new-b">
                  <div class="classCard-new-b-text">
                    <span style="font-size:20px">成员：{{ cls.stuNum }}人</span>
                    <div
                      @click.stop="classToTop(cls)"
                      class="classCard-new-b-text-set-top"
                    >
                      <img src="../../assets/images/set_top.png" alt="" />
                      <span style="font-size:20px;cursor: pointer;">置顶</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div
                class="cardAside"
                style="background:rgba(166,178,197);"
              ></div>
              <div
                class="classCard"
                style="background:rgba(166,178,197,0.1);"
                @click="enterClass(cls)"
              >
                <div class="className">{{ cls.classname }}</div>
                <div class="courseName">{{ cls.coursename }}</div>
                <div class="time">
                  创建时间：{{ formatTime(cls.addTime) }}
                </div>

                <el-button size="small" type="text" class="enterButton"
                  >进入班级 >></el-button
                >
              </div>
              <el-dropdown
                class="editButton"
                trigger="click"
                :hide-on-click="false"
              >
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editClassInfo(cls)"
                    >班级设置
                    <i
                      class="el-icon-arrow-right"
                      style="color:#0177D5;font-weight:bold;margin-left:143px;"
                    ></i>
                  </el-dropdown-item>
                  <el-dropdown-item divided
                    >锁定
                    <el-switch
                      v-model="cls.isLock"
                      :active-value="1"
                      :inactive-value="0"
                      @change="lockChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      锁定后学生不能加入和退出班级
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item
                    >结课
                    <el-switch
                      v-model="cls.status"
                      :active-value="1"
                      :inactive-value="0"
                      @change="closeChange(index, cls)"
                      active-color="#0177D5"
                      inactive-color="#F0F1F5"
                      style="margin-left:150px;"
                    ></el-switch>
                    <div style="color: #999;font-size: 12px;">
                      结课后数据归档，老师不能发起活动
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="deleteClass(cls)"
                    >删除
                    <i
                      class="el-icon-delete"
                      style="color:#0177D5;margin-left:170px;"
                    ></i>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div> -->
            </div>
          </div>
        </el-main>
      </el-tab-pane>
    </el-tabs>
    <!-- 班级复制 -->
    <el-dialog
      :visible.sync="isClassCopyShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>班级复制</div>
        </div>
      </template>
      <el-form
        :model="classCopyForm"
        :rules="classCopyRules"
        ref="classCopyForm"
        label-width="90px"
        style="margin:0 30px;"
        @submit.native.prevent
      >
        <el-form-item label="班级名称" prop="className">
          <el-input
            size="small"
            v-model.trim="classCopyForm.className"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doCopyClass"
          >确定</el-button
        >
        <el-button size="small" @click="isClassCopyShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 班级协助邀请 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>邀请协助</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取班级管理权限，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2">
        <span style="color:#999;margin-right:15px;">邀请协助班级</span>
        <span>{{ currentShareBank.classname }}</span>
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
          >创建邀请链接</el-button
        >
        <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        >
      </span>
    </el-dialog>
    <!-- 发布作业 -->
    <el-drawer
      title="选择题目"
      :destroy-on-close="true"
      :visible.sync="drawer"
      direction="ltr"
      size="90%"
      :modal-append-to-body="false"
      :before-close="handleCloseDrawer"
    >
      <publishWork
        v-if="drawer"
        :addType="1"
        v-on:toCloseDrawer="toCloseDrawer"
      ></publishWork>
    </el-drawer>
  </el-container>
</template>

<style lang="scss" scoped>
.myClass {
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
  .exam-list {
    width: 100%;
    .el-main {
      margin: 20px;
      background: #ffffff;
      border-radius: 4px;
      min-height: 600px;
      padding-top: 36px;
      padding-left: 43px;
      padding-right: 43px;
      padding-bottom: 36px;
      .empty-classes {
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
      .cardbox {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }
      .cardAside {
        width: 14px;
        height: 169px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      .classCard {
        color: #333;
        font-size: 14px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        width: 474px;
        height: 169px;
        margin-right: 20px;
        margin-bottom: 40px;
        padding: 24px 16px 25px 32px;
        position: relative;
        cursor: pointer;
        box-shadow: 5px 8px 5px #cdcfcf;
      }
      .classCard-new {
        color: #333;
        font-size: 14px;
        border: 1px solid #cdcfcf;
        border-radius: 8px;
        // border-top-right-radius: 8px;
        // border-bottom-right-radius: 8px;
        width: 474px;
        height: 240px;
        margin-right: 20px;
        margin-bottom: 30px;
        // padding: 24px 16px 25px 32px;
        // position: relative;
        cursor: pointer;
        box-shadow: 5px 8px 5px #cdcfcf;
        display: flex;
        flex-direction: column;
        .classCard-new-t {
          position: relative;
          flex: 1;
          padding: 24px 24px 0px 24px;

          border-bottom: 1px solid #cdcfcf;
          background: rgba(57, 188, 249, 0.1);
          // background-color: red;
          .className {
            color: #222;
            font-size: 24px;
            font-weight: bold;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 这里是超出几行省略 */
            overflow: hidden;
          }
          .time {
            position: absolute;
            bottom: 10px;
            display: flex;
            // justify-content: space-between;
            font-size: 18px;
          }
          .class-code {
            display: flex;
            align-items: center;
            img {
              margin-left: 5px;
              width: 20px;
              height: 20px;
            }
          }
          .editButton-new {
            position: absolute;
            right: 20px;
            top: 10px;
            color: #39bcf9;
            cursor: pointer;
            height: 22px;
          }
        }
        .classCard-new-b {
          width: 100%;
          height: 80px;
          // background-color: red;
          padding: 24px 24px 0px 24px;
          .classCard-new-b-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .classCard-new-b-text-set-top {
              img {
                width: 20px;
                height: 20px;
                vertical-align: text-bottom;
              }
            }
          }
        }
      }
      .className {
        color: #222;
        font-size: 24px;
        font-weight: bold;
      }
      .editButton {
        right: 90px;
        top: 10px;
        color: #39bcf9;
        cursor: pointer;
        height: 22px;
      }
      .courseName {
        color: #333;
        font-size: 14px;
        margin-top: 40px;
        margin-bottom: 10px;
        .stuNum {
          margin-left: 30px;
        }
      }
      .enterButton {
        position: absolute;
        right: 24px;
        bottom: 18px;
        color: #333;
        font-size: 14px;
        font-weight: 400;
      }
      .el-icon-more {
        font-size: 22px;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import publishWork from "./publishWork";
export default {
  components: {
    publishWork
  },
  data() {
    return {
      isClassCopyShow: false,
      classCopyForm: {
        className: ""
      },
      classCopyRules: {
        className: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      },
      activeName: "first",
      showClosedClass: true,
      loading: {
        classList: false,
        assistList: false
      },
      ingClass: [],
      endClass: [],
      assistClass: [],
      assistEndClass: [],
      drawer: false,
      copyClass: {},
      isShareShow: false, // 邀请协助弹框
      shareModal2: false, // 是否展示邀请协助弹框第二部分
      currentShareBank: {}, // 发起班级协助邀请的班级
      shareLink: "",
      tsCode: ""
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 去创建分享链接
    toCreateShareLink() {
      this.tsCode = "";
      axios
        .request({
          method: "post",
          url: "/clazz/classAssistant/createShareCode",
          data: {
            classId: this.currentShareBank.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.tsCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=7&shareCode=" + this.tsCode;
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: "创建邀请协助链接成功"
            });
          }
        });
    },
    // 重置链接
    resetLink() {
      axios
        .request({
          method: "post",
          url: "/clazz/classAssistant/resetShareCode",
          data: {
            code: this.tsCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tsCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=7&shareCode=" + this.tsCode;
            this.$message({
              type: "success",
              message: "重置成功"
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
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.loadData2();
      } else if (tab.name == "first") {
      }
    },
    publish(cls) {
      this.drawer = true;
    },
    // 关掉选题抽屉
    handleCloseDrawer() {
      this.drawer = false;
    },
    toCloseDrawer() {
      this.handleCloseDrawer(); // 关闭抽屉
      this.loadData(); // 重新加载题目列表
    },
    doCopyClass() {
      this.$refs["classCopyForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/clazz/clazz/copyClassAndStu",
              data: {
                classId: this.copyClass.classId,
                className: this.classCopyForm.className
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "复制班级成功"
                });
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("copy_class");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.isClassCopyShow = false;
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
    classToTop(cls) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/sortTop",
          data: {
            classId: cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "置顶成功"
            });
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 置顶协助的班级
    classToTop2(cls) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/sortTop",
          data: {
            classId: cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "置顶成功"
            });
            this.loadData2();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadData() {
      this.loading.classList = true;
      axios
        .request({
          method: "post",
          // url: "v1/calzz/mineClazz"
          url: "/clazz/clazz/myAllClass",
          data: {
            isMasterhead: 0
          }
        })
        .then(res => {
          this.loading.classList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.ingClass = [];
            this.endClass = [];
            ret.data.forEach(cls => {
              if (cls.status == 0) {
                this.ingClass.push(cls);
              } else {
                this.endClass.push(cls);
              }
            });
          }
        })
        .catch(() => {
          this.loading.classList = false;
        });
    },
    // 获取协助班级列表
    loadData2() {
      this.loading.assistList = true;
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAssistantClass",
          data: {}
        })
        .then(res => {
          this.loading.assistList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.assistClass = [];
            this.assistEndClass = [];
            ret.data.forEach(cls => {
              if (cls.status == 0) {
                this.assistClass.push(cls);
              } else {
                this.assistEndClass.push(cls);
              }
            });
            // this.getTeaClass();
          }
        })
        .catch(() => {
          this.loading.assistList = false;
        });
    },
    // 发布作业
    goPublish() {
      this.$router.push({
        path: "/class/publishHomework"
      });
    },
    // 创建班级
    createClass() {
      sessionStorage.removeItem("currentClass");
      this.$router.push({
        path: "/class/classSetting"
      });
    },
    // 锁定班级
    lockChange(index, cls) {
      axios
        .request({
          method: "post",
          url: "clazz/v4/clazz/lockClazz",
          data: {
            classId: cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            if (cls.isLock == 1) {
              cls.isLock = 0;
            } else {
              cls.isLock = 1;
            }
          }
        })
        .catch(error => {
          this.$message({
            type: "warning",
            message: error.message
          });
          if (cls.isLock == 1) {
            cls.isLock = 0;
          } else {
            cls.isLock = 1;
          }
        });
    },
    // 结课
    closeChange(index, cls) {
      axios
        .request({
          method: "post",
          url: "clazz/v4/clazz/doneClazz",
          data: {
            classId: cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (cls.status == 0) {
              this.$message({
                type: "success",
                message: "开课成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.loadData();
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
            if (cls.status == 1) {
              cls.status = 0;
            } else {
              cls.status = 1;
            }
          }
        })
        .catch(error => {
          this.$message({
            type: "warning",
            message: error.message
          });
          if (cls.status == 1) {
            cls.status = 0;
          } else {
            cls.status = 1;
          }
        });
    },
    // 删除班级
    deleteClass(cls) {
      this.$confirm(
        "你确定要删除班级" + cls.classname + "吗？删除后无法恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "clazz/v4/clazz/deleteClazz",
              data: {
                classId: cls.classId
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  if (cls.status == 0) {
                    this.ingClass.splice(this.ingClass.indexOf(cls), 1);
                  } else {
                    this.endClass.splice(this.endClass.indexOf(cls), 1);
                  }
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    // 退出班级协助
    quitClass(cls) {
      this.$confirm("你确定要退出班级协助吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/classAssistant/exit",
              data: {
                classId: cls.classId,
                classAssistantUid: this.$store.state.user.userId
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.loadData2();
                  // if (cls.status == 0) {
                  //   this.ingClass.splice(this.ingClass.indexOf(cls), 1);
                  // } else {
                  //   this.endClass.splice(this.endClass.indexOf(cls), 1);
                  // }
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    editClassInfo(cls) {
      if (cls.bundBookId) {
        cls.bundBookIds = cls.bundBookId.split(",");
      }
      sessionStorage.setItem("currentClass", JSON.stringify(cls));
      this.$router.push({
        path: "/class/classInfo"
      });
    },
    toAssistClass(cls) {
      this.currentShareBank = cls;
      this.shareModal2 = false;
      this.isShareShow = true;
    },
    toCopyClass(cls) {
      this.copyClass = cls;
      // this.classCopyForm.className = cls.classname;
      this.isClassCopyShow = true;
    },
    enterClass(cls) {
      if (cls.bundBookId) {
        cls.bundBookIds = cls.bundBookId.split(",");
      }
      sessionStorage.setItem("currentClass", JSON.stringify(cls));
      this.$store.commit("setCurrentClass", cls);
      this.$store.commit("setClassTabName", "zero");
      this.$router.push({
        path: "/class/classReport"
      });
    },
    goClassCode(cls) {
      this.$router.push({
        path: "/class/classInvitation",
        query: {
          classId: cls.classId,
          className: cls.classname
        }
      });
    },
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    }
  }
};
</script>
