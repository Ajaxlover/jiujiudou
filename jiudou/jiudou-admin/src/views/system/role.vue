<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addRole()">添加</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" border
      :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column prop="id" label="角色ID" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center" :formatter="dateFormat"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteApi(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="tableData.length" class="right-footer-first">
          从{{(page.currentPage-1)*page.pagesize+1}}到{{(page.currentPage-1)*page.pagesize+tableData.length}}记录，共{{page.total}}条
        </div>
        <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
        <el-pagination layout="prev, pager, next, jumper" :total="page.total" :page-size="page.pagesize" :current-page.sync="page.currentPage" background @current-change="loadData"></el-pagination>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="600px">
        <template slot="title">
          <div><div></div><div>添加角色</div></div>
        </template>
        <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" size="small" style="margin:0 30px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="" >
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="授权" name="1">
                <el-tree :data="menu" show-checkbox node-key="perId" :props="defaultProps" ref="tree">
                </el-tree>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('roleForm')">立即创建</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
import { format } from '@/utils/datetime'
export default {
  data () {
    return {
      searchForm: {},
      // menu: this.$store.state.access.fullMenu,
      menu: [],
      currentPer: [],
      defaultProps: {
        children: 'children',
        label: 'perName'
      },
      activeName: [],
      tableData: [],
      dialogFormVisible: false,
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      roleForm: {
        id: 0,
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      return format(date);
    },
    loadData() {
      axios.request({
        method: 'post',
        url: process.env.BASE_URL + '/v1/role/listWithCount',
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
          let nodes = this.$refs.tree.getCheckedNodes(false, true)
          let ids = []
          for(let i = 0; i < nodes.length; i++) {
            ids.push(nodes[i].perId)
          }
          let c = this.currentPer.filter(function(v) {
            return ids.indexOf(v) == -1
          })
          let delStr = ''
          if (c.length > 0) {
            c.forEach(function(currentValue, index, arr) {
              delStr += `${currentValue},`
            })
          }
          let d = ids.filter((v) => {
            return this.currentPer.indexOf(v) == -1
          })
          let addStr = ''
          if (d.length > 0) {
            d.forEach(function(currentValue, index, arr) {
              addStr += `${currentValue},`
            })
          }
          let url = '/v1/role/create'
          if (this.roleForm.id !== 0) {
            url = '/v1/role/modify'
            params.id = this.roleForm.id
          }
          params.name = this.roleForm.name
          params.addPerStr = addStr
          params.delPerStr = delStr

          axios.request({
            method: 'post',
            url: url,
            data: params
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
    addRole() {
      // 重置菜单
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
      this.currentPer = []
      this.roleForm.id = 0
      this.roleForm.name = ''
      this.dialogFormVisible = true
    },
    editRole(row) {
      // 重置菜单
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
      // 加载当前角色的菜单
      axios.request({
        method: 'post',
        url: '/v1/permission/roleMenu',
        data: {
          roleId: row.id
        }
      }).then(res => {
        let data = res.data.data
        this.currentPer = []
        for(let i = 0; i < data.length; i++) {
          this.currentPer.push(data[i].perId)
          this.$refs.tree.setChecked(data[i].perId, true)
        }
      })
      this.roleForm.id = row.id
      this.roleForm.name = row.roleName
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
          url: '/v1/role/remove',
          data: {
            id: row.id
          }
        }).then(function (data) {
          let ret = data.data
          if (ret.code === 200) {
            this.$message({
              type: 'success',
              center: true,
              message: ret.msg
            });
            this.loadData()
          } else {
            this.$message({
              type: 'error',
              message: ret.msg
            })
          }
        }.bind(this))
      }).catch(() => {
        console.log("已取消删除")
      })
    },
    loadMenu() {
      axios.request({
        method: 'post',
        url: process.env.BASE_URL + '/v1/role/myMenu',
        data: {
          mrId: this.$store.state.user.currentRole.mrId
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.menu = ret.data
        }
      })
    },
  },
  mounted() {
    this.loadData()
    this.loadMenu()
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
