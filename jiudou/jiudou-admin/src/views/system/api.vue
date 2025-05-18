<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addApi()" v-if="hasButton('addApi')">添加</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" border >
        <el-table-column prop="apiName" label="接口名称" width="180"></el-table-column>
        <el-table-column prop="apiUrl" label="接口地址" width="180"></el-table-column>
        <el-table-column prop="apiCreateTime" label="添加时间" width="180" :formatter="dateFormat"></el-table-column>
        <el-table-column fixed="right" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editApi(scope.row)" v-if="hasButton('modifyApi')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteApi(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div  class="right-footer-first">
          从 {{(this.page.currentPage - 1) * this.page.pagesize + 1}} 到 {{(this.page.currentPage - 1) * this.page.pagesize + this.tableData.length}} 记录，共 {{page.total}} 条
        </div>
        <el-pagination layout="prev, pager, next, jumper" background :total="page.total" :page-size="page.pagesize" @current-change="changePage"></el-pagination>
      </div>

      <el-dialog title="添加接口" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
        <el-form :model="apiForm" :rules="rules" ref="apiForm" label-width="120px">
          <el-form-item label="接口名称" prop="name">
            <el-input v-model="apiForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="接口地址" prop="url">
            <el-input v-model="apiForm.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('apiForm')">立即创建</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
import { format } from '@/utils/datetime'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      searchForm: {},
      tableData: [],
      dialogFormVisible: false,
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      apiForm: {
        id: 0,
        name: '',
        url: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入接口名称', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入接口地址', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'hasButton'
    ])
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      return format(date);
    },
    loadData() {
      axios.request({
        method: 'post',
        url: '/v1/api/listWithCount',
        data: {
          page: this.page.currentPage,
          pagesize: this.page.pagesize
        }
      }).then(res => {
        this.tableData = res.data.data.data
        this.page.total = res.data.data.total
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          params.name = this.apiForm.name
          params.url = this.apiForm.url
          let url = '/v1/api/create'
          if (this.apiForm.id != 0) {
            url = '/v1/api/modify'
            params.id = this.apiForm.id
          }
          axios.request({
            method: 'post',
            url: url,
            data: params
          }).then(res => {
            let ret = res.data
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
          })
        } else {
          return false
        }
      })
    },
    changePage(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    addApi() {
      this.apiForm.id = 0
      this.apiForm.name = ""
      this.apiForm.url = ""
      this.dialogFormVisible = true
    },
    editApi(row) {
      this.apiForm.id = row.apiId
      this.apiForm.name = row.apiName
      this.apiForm.url = row.apiUrl
      this.dialogFormVisible = true
    },
    deleteApi(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/v1/api/remove',
          data: {
            id: row.apiId
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
    }
  },
  mounted() {
    this.loadData()
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
