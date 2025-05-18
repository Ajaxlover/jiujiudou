<template>
  <el-container class="codeOperate">
    <el-header height="50px">
      <span></span>
      <span class="code" @click="toCode">防伪码管理</span> <i class="el-icon-arrow-right"></i> <span>生成/导入/导出</span>
    </el-header>
    <el-main>
      <div class="main-codeOperate" style="position:relative">
        <el-tabs ref="resourceTab" v-model="resActiveName" class="sub-tabs" @tab-click="tabClick">
          <el-tab-pane label="生成" name="first">
            <el-divider></el-divider>
            <div style="height:180px">
              <el-form :model="creatForm" size="small" :rules="creatFormRules" ref="creatForm" v-if="creatForm.showCreat">
                <el-form-item>
                  <span style="font-size:16px;">输入个数，生成一批防伪码</span>
                </el-form-item>
                <el-form-item label="批次" prop="pici">
                  <el-input-number v-model="creatForm.pici" :min="1" controls-position="right" size="small" style="width:200px"></el-input-number>
                </el-form-item>
                <el-form-item label="数量" prop="codeAmount">
                  <el-input v-model="creatForm.codeAmount" size="small" style="width:200px" placeholder="请输入数量" 
                    @input="creatForm.codeAmount = creatForm.codeAmount.replace(/[^0-9]/g, '');"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="doCreat" size="small" :loading="creatForm.loading" style="margin-left:50px">生成</el-button>
                </el-form-item>
              </el-form>
              <div v-else style="width:50%;padding-top:30px;">
                <div style="text-align:center;margin: 5px;">正在生成防伪码，请稍等......</div>
                <el-progress :percentage="creatForm.creatPercent"></el-progress>
                <el-button type="primary" @click="doCancelCreat" size="small" style="margin-left:210px;margin-top:20px">强制结束</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="导入" name="second">
            <div style="height:240px;">
              <el-divider></el-divider>
              <el-form :model="importForm" size="small" :rules="importFormRules" ref="importForm" v-if="importForm.showImport">
                <el-form-item>
                  <span style="font-size:16px;">输入批次，导入一批防伪码</span>
                </el-form-item>
                <el-form-item label="批次" prop="pici" label-width="60px" >
                  <el-input-number v-model="importForm.pici" :min="1" controls-position="right" size="small" style="width:200px"></el-input-number>
                </el-form-item>
                <el-form-item label="防伪码" label-width="60px" >
                  <fileModal ref="fileModal" v-on:fileChange='fileChange' accept='.txt' style="width:300px;"></fileModal>
                  <div style="font-size:12px;color:#999999;">仅支持txt格式</div>
                </el-form-item>
                <el-form-item style="margin-left:60px">
                  <el-button type="primary" @click="doImport" size="small" :loading="importForm.loading">导入</el-button>
                </el-form-item>
              </el-form>
              <div v-else style="width:50%;padding-top:50px;">
                <div style="text-align:center;margin: 5px;">正在导入防伪码，请稍等......</div>
                <el-progress :percentage="importForm.importPercent"></el-progress>
                <el-button type="primary" @click="doCancelImport" size="small" style="margin-left:210px;margin-top:20px">强制结束</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="导出" name="third">
            <el-divider></el-divider>
            <el-form :model="exportForm" size="small">
              <el-form-item>
                <span style="font-size:16px;">输入筛选条件，选择你要导出的防伪码</span>
              </el-form-item>
              <el-form-item label="批次">
                <el-select v-model="exportForm.pici" placeholder="请选择批次" clearable @change="piciChangeSearch($event)" style="width: 150px;">
                  <el-option v-for="item in piciData" :label="`第${item.pici}批次`" :value="item.pici" :key="item.pici"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="序号">
                <el-input-number v-model="exportForm.beginNum" :min="1" controls-position="right" style="width: 120px;"></el-input-number> -
                <el-input-number v-model="exportForm.endNum" :min="1" controls-position="right" style="width: 120px;"></el-input-number>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="exportForm.codeStatus" placeholder="请选择状态" style="width: 100px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未绑定" value="0"></el-option>
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="无效" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doExport" size="small" style="margin-left:40px">导出</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-button @click="toCode" size="small" style="position:absolute;right:0;top:0">返回</el-button>        
      </div>
      <el-divider></el-divider>
      <div style="margin-top:30px">历史记录：</div>
      <div class="main-history">
        <el-table :data="dataList" v-loading="tableLoading" style="margin-top:15px;"
        :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
          <el-table-column label="时间" prop="createTime" align="center" :formatter="formatDate"></el-table-column>
          <el-table-column label="批次" prop="pici" align="center"></el-table-column>
          <el-table-column label="预计数量" prop="expectAmount" align="center"></el-table-column>
          <el-table-column label="实际数量" prop="realAmount" align="center"></el-table-column>
          <el-table-column label="开始序号" prop="beginNum" align="center"></el-table-column>
          <el-table-column label="结束序号" prop="endNum" align="center"></el-table-column>
          <el-table-column label="状态" prop="recordStatus" align="center" :formatter="formatStatus"></el-table-column>
          <el-table-column label="操作类型" prop="operateType" align="center" :formatter="formatOperate"></el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
import { format } from '@/utils/datetime'
import fileModal from '@/components/fileModal'
export default {
  components: {
    fileModal
  },
  data() {
    var validateCreatCodeAmount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入生成防伪码数量'))
      } else {
        if (value > 1000000) {
          callback(new Error('请输入生成防伪码数量,最大1000000'));
        } else {
          callback();
        }
      }
    };
    return {
      dataList: [],
      piciData: [],
      tableLoading: false,
      resActiveName: 'first',
      //生成
      creatForm: {
        loading: false,
        pici: 0,
        codeAmount: '',
        creatPercent: 0,
        showCreat: true,
      },
      creatFormRules: {
        pici: [
          {required: true, message: '请输入防伪码批次', trigger: 'change'}
        ],
        codeAmount: [
          {validator: validateCreatCodeAmount, required: true, trigger: 'change'}
        ]
      },
      creatTimer: '',
      creatId: '',
      //导入
      importForm: {
        pici: 0,
        file: null,
        importPercent: 0,
        showImport: true,
        loading: false
      },
      importFormRules: {
        pici: [
          {required: true, message: '请输入防伪码批次', trigger: 'change'}
        ]
      },
      importTimer: '',
      importId: '',
      //导出
      exportForm: {
        pici: '',
        codeStatus: '',
        beginNum: '',
        endNum: '',
      }
    }
  },
  methods: {
    toCode() {
      this.$router.push({
        name: "code"
      })
    },
    //切换tab
    tabClick(item) {
      if(item.name === 'third') {
        this.loadPici()
      }
    },
    // 加载 批次列表
    loadPici() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/selPicisByOrgId'
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.piciData = ret.data
        }
      })
    },
    //批次变化时查询数据
    piciChangeSearch(pici) {
      if(pici) {
        let currentObj = {}
        currentObj = this.piciData.find((item) => { //这里的userRoleList就是上面遍历的数据源
          return item.pici === pici //筛选出匹配数据
        })
        this.exportForm.beginNum = currentObj.minNum
        this.exportForm.endNum = currentObj.maxNum
      }else{
        this.exportForm.beginNum = '1'
        this.exportForm.endNum = '1'
      }
    },
    //加载历史记录
    loadData() {
      this.tableLoading = true
      axios.request({
        method: 'post',
        url: '/v1/qrCode/selIndividualCodeRecord'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          this.tableLoading = false
          if(ret.data) {
            this.dataList = ret.data
          } else {
            this.dataList = []
          }
        }
      })
    },
    //生成
    doCreat() {
      this.$refs['creatForm'].validate((valid) => {
        if (valid) {
          this.creatForm.loading = true
          axios.request({
            method: 'post',
            url: '/v1/qrCode/createCodes',
            data: {
              pici: this.creatForm.pici,
              codeAmount: this.creatForm.codeAmount
            }
          }).then(res => {
            let ret = res.data
            this.creatForm.loading = false
            if(ret.code == 200) {
              this.creatForm.showCreat = false
              this.creatForm.creatPercent = 0
              this.creatTimer = setInterval(this.loadCreatStatus, 2000);
              this.loadData()
            }else{
              this.$message({
                type: 'warning',
                message: ret.msg
              });
            }
          })
        }
      })
    },
    // 定时去拿生成防伪码的状态
    loadCreatStatus() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/selExpectAndgeneratedAmountOfGeneratingCode'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          if(ret.data) {
            ret.data.forEach(element => {
              if(element.operateType == 1) {
                this.creatId = element.codeRecordId
                if(element.expectAmount) {
                  // this.creatForm.creatPercent = parseFloat((element.generatedAmount / element.expectAmount * 100).toFixed(2))
                  this.creatForm.creatPercent = Math.ceil((element.generatedAmount / element.expectAmount * 100))
                }else{
                  this.creatForm.creatPercent = 0
                }
              }
            })
          }else{
            this.$message({
              type: 'warning',
              message: '生成成功'
            });
            this.creatForm.pici = 0
            this.creatForm.codeAmount = ''
            this.creatId = ''
            clearInterval(this.creatTimer)
            this.creatForm.showCreat = true
            this.loadData()
          }
        }else{
          clearInterval(this.creatTimer)
          this.creatForm.showCreat = true
          this.$message({
            type: 'warning',
            message: ret.msg
          });
        }
      })
    },
    //导入
    doImport() {
      this.$refs['importForm'].validate((valid) => {
        if (valid) {
          if (this.importForm.file) {
            if(this.importForm.file.type.indexOf("text/plain") == -1) {
              this.$message({
                type: 'warning',
                center: true,
                message: '仅支持txt格式'
              })
              return
            }
            this.importForm.loading = true
            let fd = new FormData()
            fd.append('pici', this.importForm.pici)
            fd.append('txtFile', this.importForm.file)
            axios.request({
              method: 'post',
              url: '/v1/qrCode/importCodes',
              data: fd
            }).then(res => {
              let ret = res.data
              this.importForm.loading = false
              if (ret.code === 200) {
                this.importForm.showImport = false
                this.importForm.importPercent = 0
                this.importTimer = setInterval(this.loadImportStatus, 2000)
                this.loadData()
              }else{
                this.$message({
                  type: 'warning',
                  message: ret.msg
                });
              }
            }).catch(() => {
              this.importForm.loading = false
              this.$message({
                type: 'warning',
                message: '导入服务不可用'
              });
            })
          }else{
            this.$message({
              type: 'warning',
              center: true,
              message: '请选择文件'
            })
          }
        }
      })
    },
    fileChange(file) {
      this.importForm.file = file
    },
    // 定时去拿导入防伪码的状态
    loadImportStatus() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/selExpectAndgeneratedAmountOfGeneratingCode'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          if(ret.data) {
            ret.data.forEach(element => {
              if(element.operateType == 2) {
                this.importId = element.codeRecordId
                if(element.expectAmount) {
                  this.importForm.importPercent = Math.ceil((element.generatedAmount / element.expectAmount * 100))
                }else{
                  this.importForm.importPercent = 0
                }
              }
            })
          }else{
            this.$message({
              type: 'warning',
              message: '导入成功'
            });
            this.importForm.pici = 0
            this.importForm.file = null
            this.importId = ''
            clearInterval(this.importTimer)
            this.importForm.showImport = true
            this.loadData()
          }
        }
      })
    },
    //强制结束正在生成的防伪码
    doCancelCreat() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/stopInsAntiFakeCodes',
        data: {
          codeRecordId: this.creatId
        }
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          clearInterval(this.creatTimer)
          this.creatForm.pici = 0
          this.creatForm.codeAmount = ''
          this.creatId = ''
          this.creatForm.showCreat = true
          this.loadData()
        }else{
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    //导出
    doExport() {
      if (!this.exportForm.pici) {
        this.$message({
          type: 'warning',
          message: '请选择批次'
        })
        return
      }
      if (!this.exportForm.beginNum || !this.exportForm.endNum) {
        this.$message({
          type: 'warning',
          message: '请选择序号'
        })
        return
      }
      if (this.exportForm.beginNum > this.exportForm.endNum) {
        this.$message({
          type: 'warning',
          message: '范围起始不能大于截止'
        })
        return
      }
      let url = process.env.BASE_URL + "/v1/qrCode/exportCodes?pici=" + this.exportForm.pici + '&beginNum=' +
      this.exportForm.beginNum + '&endNum=' + this.exportForm.endNum + '&codeStatus=' +
      this.exportForm.codeStatus + '&token=' + this.$store.state.user.token
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
      this.loadData()
    },
    //强制结束正在导入的防伪码
    doCancelImport() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/stopInsAntiFakeCodes',
        data: {
          codeRecordId: this.importId
        }
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          clearInterval(this.importTimer)
          this.importForm.pici = 0
          this.importForm.file = null
          this.importId = ''
          this.importForm.showImport = true
          this.loadData()
        }else{
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    // 日期
    formatDate(row) {
      return format(row.createTime)
    },
    // 状态
    formatStatus(row) {
      if(row.recordStatus == 1) {
        return '进行中'
      } else if (row.recordStatus == 2) {
        return '已结束'
      }
    },
    //操作
    formatOperate(row) {
      if(row.operateType == 1) {
        return '生成'
      } else if (row.operateType == 2) {
        return '导入'
      } else {
        return '导出'
      }
    },
    //进入页面查看是否有正在执行的任务
    initTask() {
      axios.request({
        method: 'post',
        url: '/v1/qrCode/selExpectAndgeneratedAmountOfGeneratingCode'
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          if(ret.data) {
            ret.data.forEach(element => {
              if(element.operateType == 1) {
                this.creatForm.showCreat = false
                this.creatId = element.codeRecordId
                if(element.expectAmount) {
                  // this.creatForm.creatPercent = parseFloat((element.generatedAmount / element.expectAmount * 100).toFixed(2))
                  this.creatForm.creatPercent = Math.ceil((element.generatedAmount / element.expectAmount * 100))
                }else{
                  this.creatForm.creatPercent = 0
                }
                this.creatTimer = setInterval(this.loadCreatStatus, 2000)
              }else{
                this.importId = element.codeRecordId
                this.importForm.showImport = false
                if(element.expectAmount) {
                  this.importForm.importPercent = Math.ceil((element.generatedAmount / element.expectAmount * 100))
                }else{
                  this.importForm.importPercent = 0
                }
                this.importTimer = setInterval(this.loadImportStatus, 2000)
              }
            })
          }else{
            this.creatId = ''
            this.importId = ''
            clearInterval(this.creatTimer)
            clearInterval(this.importTimer)
            this.creatForm.showCreat = true
            this.importForm.showImport = true
          }
        }else{
          this.creatForm.showCreat = true
          this.$message({
            type: 'warning',
            message: ret.msg
          });
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.creatTimer)
    clearInterval(this.importTimer)
  },
  mounted() {
    this.loadData()
    this.initTask()
  }
};
</script>

<style lang="scss">
.codeOperate {
  .el-header{
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .code{
      cursor: pointer;
      color: #2BA1F4;
    }
  }
  .el-main{
    margin: 22px 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding: 15px 25px 70px;
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .main-codeOperate{
      background: #ffffff;
      border-radius: 4px;
      .el-divider--horizontal {
        margin: 10px 0 30px;
      }
      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }
    }
  }
}
</style>