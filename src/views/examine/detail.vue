<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      文件审批详细
    </div>
    <div class="container-body-wrap">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="7">
              <el-form-item label="提交时间">
                <el-date-picker
                  v-model="form.datatime"
                  align="right"
                  type="date"
                  style="width:100%" 
                  placeholder="选择日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="类型">
                <el-select v-model="form.user" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="目标系统">
                <el-select v-model="form.target_system" placeholder="请选择">
                  <el-option :label="'test1'" :value="'test1'"></el-option>
                  <el-option :label="'test2'" :value="'test2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="文件类型">
                <el-select v-model="form.datatime"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="状态">
                <el-select v-model="form.user" placeholder="请选择">
                  <el-option v-for="item in fileStutas" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="文件名">
                <el-select v-model="form.target_system" placeholder="请选择">
                  <el-option :label="'test1'" :value="'test1'"></el-option>
                  <el-option :label="'test2'" :value="'test2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button size="small" type="primary">查询</el-button>
              <el-button size="small">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template>
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          empty-text="暂无数据">
          <el-table-column
            prop="name"
            label="文件名">
          </el-table-column>
          <el-table-column
            prop="name"
            label="文件类型">
          </el-table-column>
          <el-table-column
            prop="name"
            label="提交说明">
          </el-table-column>
          <el-table-column
            prop="name"
            label="提交人">
          </el-table-column>
          <el-table-column
            prop="name"
            label="提交时间">
          </el-table-column>
          <el-table-column
            label="风险等级">
            <template slot-scope="scope">
              <risk-level :level="scope.rank"></risk-level>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="审批人">
          </el-table-column>
          <el-table-column
            prop="name"
            label="状态">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'

export default {
  name: 'ScriptLibrary',
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      fileTypeList: [{
        label: '全部',
        value: 0
      }, {
        label: '脚本',
        value: 1
      }, {
        label: '软件包',
        value: 2
      }, {
        label: '配置文件',
        value: 3
      }],
      fileStutas: [{
        label: '全部',
        value: 0
      }, {
        label: '审批中',
        value: 1
      }, {
        label: '通过',
        value: 2
      }, {
        label: '拒绝',
        value: 3
      }],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        rank: 3,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        rank: 4,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        rank: 3,
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      form: {
        datatime: '',
        user: '',
        target_system: ''
      }
    }
  },
  methods: {
    getlist() {
      console.log(199)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
