<template>
  <div class="page-audit">
    <Breadcrumb></Breadcrumb>

    <div class="container-title">
      系统配置
    </div>

    <div class="container-body-wrap">
      <el-form
        size="small"
        label-width="70px"
        label-position="right">
        <el-row>
          <el-col :span="9">
            <el-form-item label="时间">
              <el-date-picker
                v-model="queryForm.time"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="用户">
              <el-select style="width: 200px" v-model="queryForm.val"  placeholder="请选择">
                <el-option
                  v-for="item in queryForm.user"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>  
          </el-col>
          <el-col :span="5">
            <el-form-item label="源IP">
              <el-input style="width: 200px" v-model="queryForm.sourceId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="资源类型">
              <el-select style="width: 200px" v-model="queryForm.val2" placeholder="请选择">
                <el-option
                  v-for="item in queryForm.resourceType"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="资源ID">          
                 <el-input style="width: 200px" v-model="queryForm.resourceId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="操作">
               <el-input style="width: 200px" v-model="queryForm.actionType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
               <el-input style="width: 200px" v-model="queryForm.status"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="消息">
              <el-input style="width: 200px" v-model="queryForm.message"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="20">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              class="margl-70"
              @click="handleSearchBtn">查询
            </el-button>
            <el-button size="small" icon="el-icon-printer" @click="handleExportBtn">导出</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="table"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 30px"
        empty-text="暂无数据"
        v-loading.body="tableLoading">
        <el-table-column prop="created_at" label="时间"></el-table-column>
        <el-table-column prop="source_ip" label="源IP"></el-table-column>
        <el-table-column label="资源ID">
          <template slot-scope="scope">
            <router-link :to="jumper1"><el-button type="text">{{ scope.row.resource_id }}</el-button></router-link>
          </template>  
        </el-table-column>
        <el-table-column prop="resource" label="资源类型"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
        <el-table-column prop="status" label="结果"></el-table-column>
        <el-table-column prop="message" label="消息"></el-table-column>
      </el-table>
      <el-pagination
        v-if="total > 0"
        style="text-align: right"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizesArray"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { UserSearch, Resources, getAudit, getAuditSearch } from '@/api/systemManage/system.js'

export default {
  name: 'audit',
  components: {
    Breadcrumb
  },
  data() {
    return {
      currentPage: 1, // 当前页数
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 0,
      total: 0, // 总条目数
      tableData: [],
      tableLoading: false,
      jumper1: '',
      queryForm: {
        time: '',
        user: '',
        val: '',
        sourceId: '',
        resourceType: '',
        val2: '',
        resourceId: '',
        actionType: '',
        status: '',
        message: ''
      }
    }
  },
  mounted() {
    getAudit({
      page: this.currentPage,
      per_page: this.total
      // start_time:
    }).then(res => {
      // console.log(res.items,'3')
      this.total = res.items.length
      //  this.tableData.time="2017-10-31  23:12:00";
      //   this.tableData.sourceId=res.items.resource_id
      this.tableData = res.items
      // this.tableData.message=res.items.message.notes;

      for (let i = 0; i < this.tableData.length; i++) {
        // console.log(JSON.stringify(res.items[i].resource)+JSON.stringify(JSON.parse(res.items[i].message).path_args.identifier))
        // console.log(JSON.stringify(JSON.parse(res.items[i].message).notes))
        // console.log( JSON.stringify(JSON.parse(res.items[i].message).path_args))
      //  console.log('/system/dashboard/audit'+JSON.stringify(res.items[i].resource)+JSON.stringify(JSON.parse(res.items[i].message).path_args))
        // console.log(JSON.stringify(res.items[i].resource)+JSON.stringify(JSON.parse(res.items[i].message).path_args.identifier))
        this.tableData[i].message = JSON.parse(res.items[i].message).notes
      }
      for (let i = 0; i < this.tableData.length; i++) {
        // console.log(res.items[i].resource)
        if (res.items[i].resource === 'Todo') {
          this.jumper1 = '/system/dashboard/role'
          // console.log( this.jumper1)
        }
      }
      //  this.jumper1='/system/dashboard/audit'+JSON.stringify(res.items[i].resource)+JSON.stringify(JSON.parse(res.items[i].message).path_args.identifier)
    }).catch(() => {
      // console.log('2')
    })
    // handleExportBtn()
    UserSearch().then(res => {
      // console.log(res,'1')
      this.queryForm.user = res.creator
    }).catch(error => {
      console.error(error)
    })
    Resources().then(res => {
      this.queryForm.resourceType = res.resource
      // console.log(res,'1')
    }).catch(error => {
      // console.log(res,'2')
      console.error(error)
    })
  },
  created() {
    // getAudit()
    // createUserApi({
    //   username:'1',
    //   status:0,
    //   role_ids:[3],
    //   modified_by:'1',
    //   realname:'1',
    //   business:'31',
    //   telephone:'31',
    //   wechat:'31',
    //   password:'Spf11111!',
    //   email:'11321@qq.com'
    // }).then(res=>{
    //   console.log(res)
    // }).catch(res=>{
    //   console.log('2')
    // })

    this.total = 6
    this.tableData = [
      // {
      //   time: "2017-10-31  23:12:00",
      //   application: "root",
      //   sourceId: "10.193.123.12",
      //   resourceType: "user",
      //   resourceId:'1',
      //   actionType: "login",
      //   result: "200",
      //   message: "用户登录成功"
      // },
      // {
      //   time: "2017-10-31  23:12:00",
      //   application: "root",
      //   sourceId: "10.193.123.12",
      //   resourceType: "user",
      //   resourceId:'1',
      //   actionType: "login",
      //   result: "200",
      //   message: "用户登录成功"
      // },
      // {
      //   time: "2017-10-31  23:12:00",
      //   application: "root",
      //   sourceId: "10.193.123.12",
      //   resourceType: "user",
      //   resourceId:'1',
      //   actionType: "login",
      //   result: "200",
      //   message: "用户登录成功"
      // },
      // {
      //   time: "2017-10-31  23:12:00",
      //   application: "root",
      //   sourceId: "10.193.123.12",
      //   resourceType: "user",
      //   resourceId:'1',
      //   actionType: "login",
      //   result: "200",
      //   message: "用户登录成功"
      // },
      // {
      //   time: "2017-10-31  23:12:00",
      //   application: "root",
      //   sourceId: "10.193.123.12",
      //   resourceType: "user",
      //   resourceId:'1',
      //   actionType: "login",
      //   result: "200",
      //   message: "用户登录成功"
      // }
    ]
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSearchBtn() {
      // console.log('2')
      getAuditSearch().then(res => {
        // console.log('1')
        this.queryForm.time = res.created_at
        this.queryForm.sourceId = res.id
        this.queryForm.message = res.message.notes
        this.queryForm.resourceId = res.source_ip
        this.queryForm.status = res.status
        this.queryForm.actionType = res.operation

        console.log(res, '1')
      }).catch(() => {
        console.log('2')
      })

      // console.log("search");
    },
    handleExportBtn() {
      getAudit({
        page: this.currentPage,
        per_page: this.total
      // start_time:
      }).then(res => {
        console.log(res.items, '3')
        this.total = res.items.length
        //  this.tableData.time="2017-10-31  23:12:00";
        //   this.tableData.sourceId=res.items.resource_id
        this.tableData = res.items
        // this.tableData.message=res.items.message.notes;

        for (let i = 0; i < this.tableData.length; i++) {
        // console.log(JSON.parse(res.items[i].message))
        // console.log(res.items[i].message)

          this.tableData[i].message = JSON.parse(res.items[i].message).notes
        }
      }).catch(() => {
      // console.log('2')
      })
    }
  }
}
</script>

<style scoped>
</style>
