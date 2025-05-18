<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addMenu">添加</el-button>
        </el-row>
      </div>
      <!-- 菜单table -->
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="perId"
      :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column prop="perName" label="菜单名称">
          <template slot-scope="scope">
            <i :class="scope.row.perIcon"></i> {{scope.row.perName}}
          </template>
        </el-table-column>
        <el-table-column prop="perUrl" label="菜单地址" align="center"></el-table-column>
        <el-table-column prop="perType" label="菜单类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.perType === 2">目录</span>
            <span v-else-if="scope.row.perType === 1">页面</span>
            <span v-else-if="scope.row.perType === 3">子页面</span>
            <span v-else-if="scope.row.perType === 0">按钮</span>
          </template>
        </el-table-column>
        <el-table-column prop="perSort" label="排序" align="center" sortable></el-table-column>
        <el-table-column prop="perCode" label="菜单编码" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="addChild(scope.row)" type="text" size="small">添加子菜单</el-button>
            <el-button @click.native.prevent="editRow(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" v-if="scope.row.perType === 0" @click.native.prevent="bindApi(scope.row)">关联接口</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加 -->
      <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="600px">
        <template slot="title">
          <div><div></div><div>添加接口</div></div>
        </template>
        <el-form :model="menuForm" :rules="rules" ref="menuForm" label-width="100px" size="small" style="margin:0 30px;">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="menuForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" prop="url">
            <el-input v-model="menuForm.url" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单编码" prop="code">
            <el-input v-model="menuForm.code" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="type">
            <el-select v-model="menuForm.type" placeholder="请选择菜单类型">
              <el-option v-for="item in menuTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="menuForm.sort" :min="1" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="menuForm.icon" autocomplete="off" style="width: 200px"></el-input>
            <i :class="menuForm.icon"></i>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('menuForm')">立即创建</el-button>
        </div>
      </el-dialog>
      <!-- 新建/编辑 关联接口 -->
      <el-dialog :visible.sync="dialogBindApi" :modal-append-to-body="false" width="600px">
        <template slot="title">
          <div><div></div><div>关联接口</div></div>
        </template>
        <span style="color: red">已绑定接口</span>
        <el-table :data="perApiData" border style="margin-bottom:15px;"
        :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
          <el-table-column prop="apiName" label="接口名称" align="center"></el-table-column>
          <el-table-column prop="apiUrl" label="接口地址" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delApi(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span style="color: blue">所有接口</span>
        <el-table :data="apiData" border
        :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
          <el-table-column prop="apiName" label="接口名称" align="center"></el-table-column>
          <el-table-column prop="apiUrl" label="接口地址" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addApi(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="apiData.length" class="right-footer-first">
            从{{(page.currentPage-1)*page.pagesize+1}}到{{(page.currentPage-1)*page.pagesize+apiData.length}}记录，共{{page.total}}条
          </div>
          <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
          <el-pagination layout="prev, pager, next, jumper" :total="page.total" :page-size="page.pagesize" :current-page.sync="page.currentPage" background @current-change="loadApiData"></el-pagination>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import axios from "@/libs/api.request"
export default {
  data() {
    return {
      menuForm: {
        parentId: 0,
        name: '',
        url: '',
        code: '',
        type: '2',
        icon: '',
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' },
        ]
      },
      dialogFormVisible: false,
      tableData: [],
      menuTypes: [{
        value: '2',
        label: '目录'
      }, {
        value: '1',
        label: '页面'
      }, {
        value: '3',
        label: '子页面'
      }, {
        value: '0',
        label: '按钮'
      }],
      dialogBindApi: false,
      perApiForm: {
        perId: 0
      },
      perApiData: [],
      apiData: [],
      page: {
        total: 0,
        pagesize: 5,
        currentPage: 1
      },
    }
  },
  methods: {
    loadData() {
      axios.request({
        method: 'post',
        url: '/v1/permission/list'
      }).then(function (data) {
        this.tableData = data.data.data
      }.bind(this))
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '/v1/permission/create'
          if (this.menuForm.id) {
            url = '/v1/permission/modify'
          }
          axios.request({
            method: 'post',
            url: url,
            data: this.menuForm
          }).then(function (data) {
            let ret = data.data
            if (ret.code === 200) {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: ret.msg
              })
              this.loadData()
            } else {
              this.$message({
                type: 'error',
                message: ret.msg
              })
            }
          }.bind(this))
        } else {
          return false
        }
      })
    },
    addMenu() {
      this.menuForm.id = 0
      this.menuForm.name = ''
      this.menuForm.url = ''
      this.menuForm.code = ''
      this.menuForm.icon = ''
      this.menuForm.sort = ''
      this.menuForm.type = '2'
      this.dialogFormVisible = true
    },
    addChild(row) {
      this.menuForm.parentId = row.perId
      this.menuForm.id = 0
      this.menuForm.name = ''
      this.menuForm.url = ''
      this.menuForm.code = ''
      this.menuForm.icon = ''
      this.menuForm.sort = ''
      this.menuForm.type = '2'
      this.dialogFormVisible = true
    },
    editRow(row) {
      this.menuForm.parentId = row.perParentId
      this.menuForm.id = row.perId
      this.menuForm.name = row.perName
      this.menuForm.url = row.perUrl
      this.menuForm.code = row.perCode
      this.menuForm.icon = row.perIcon
      this.menuForm.sort = row.perSort
      this.menuForm.type = `${row.perType}`
      this.dialogFormVisible = true
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/v1/permission/remove',
          data: {
            perId: row.perId
          }
        }).then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '删除成功!'
          })
          this.loadData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          center: true,
          message: '已取消删除'
        })
      })
    },
    bindApi(row) {
      this.perApiForm.perId = row.perId
      this.dialogBindApi = true
      this.loadPerApiData()
    },
    loadPerApiData() {
      axios.request({
        method: 'post',
        url: '/v1/permission/listApi',
        data: {
          perId: this.perApiForm.perId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.perApiData = ret.data
        } else {
          this.$message({
            type: 'error',
            center: true,
            message: ret.msg
          })
        }
      })
    },
    delApi(row) {
      axios.request({
        method: 'post',
        url: '/v1/permission/delApi',
        data: {
          perId: this.perApiForm.perId,
          apiId: row.apiId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.loadPerApiData()
        } else {
          this.$message({
            type: 'error',
            center: true,
            message: ret.msg
          })
        }
      })
    },
    loadApiData() {
      axios.request({
        method: 'post',
        url: '/v1/api/listWithCount',
        data: {
          page: this.page.currentPage,
          pagesize: this.page.pagesize
        }
      }).then(res => {
        this.apiData = res.data.data.data
        this.page.total = res.data.data.total
      })
    },
    addApi(row) {
      axios.request({
        method: 'post',
        url: '/v1/permission/addApi',
        data: {
          perId: this.perApiForm.perId,
          apiId: row.apiId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.loadPerApiData()
        } else {
          this.$message({
            type: 'error',
            center: true,
            message: ret.msg
          })
        }
      })
    }
  },
  mounted() {
    this.loadData()
    this.loadApiData()
  }
}
</script>

<style scoped lang="scss">
.myResource{
  width: 100%;
  padding: 20px;
  .el-main{
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px; 
    .tabelHeader{
      overflow: hidden;
      margin-bottom: 13px;
      .operateBtn{
        float: right;
      }
    }
  }
}
</style>
