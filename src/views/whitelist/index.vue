<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      命令白名单
    </div>
    <div class="container-body-wrap">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="10">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="form.datatime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="创建人">
                <el-select v-model="form.user" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in fileTypeList" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="命令">
                <el-select v-model="form.target_system" placeholder="请选择" style="width:100%;">
                  <el-option :label="'test1'" :value="'test1'"></el-option>
                  <el-option :label="'test2'" :value="'test2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="file-nav">
          <div class="file-nav-left">
            <el-button size="small" type="primary">查询</el-button>
            <el-button size="small">重置</el-button>
          </div>
          <div class="file-nav-right">
            <el-button size="small">添加命令白名单</el-button>
            <el-button size="small">编辑</el-button>
            <el-button size="small">删除</el-button>
          </div>
        </div>
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
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="name"
            label="命令">
          </el-table-column>
          <el-table-column
            prop="name"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="name"
            label="创建人">
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
    },
    // 跳转到详情页
    goDetail(val) {
      console.log(val)
      this.$router.push({
        name: 'examineDetail',
        params: {
          id: 'aaa'
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
