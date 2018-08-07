<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      添加应用实例
    </div>
    <div class="container-body-wrap add-app-body">
      <template>
        <!-- 筛选 -->
        <el-form
          size="small"
          label-width="70px"
          label-position="right">
          <el-row>
            <el-col :span="12">
              <el-form-item label="实例名称">
                <el-input v-model="form.submitter" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实例介绍">
                <el-input v-model="form.submitter" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="版本">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应用类型">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开发语言">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="软件包库">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="配置文件库">
                <el-select v-model="form.type"  style="width:100%" placeholder="请选择">
                  <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="变量">
                <el-button type="text" size="small" >添加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="字段">
                <el-input v-model="form.submitter" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="值">
                <el-input v-model="form.submitter" auto-complete="off" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="10">
              <el-button size="small" type="primary" >确定</el-button>
              <el-button size="small" >取消</el-button>
              <el-button size="small" >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import { getReviewList } from '@/api/resouce/versionLibrary/review'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb,
    RiskLevel
  },
  data() {
    return {
      fileTypeList: [{
        label: '脚本',
        value: 'scripts'
      }, {
        label: '软件包',
        value: 'applications'
      }, {
        label: '配置文件',
        value: 'configurations'
      }],
      fileStutas: [{
        label: '审批中',
        value: 'pending'
      }, {
        label: '通过',
        value: 'pass'
      }, {
        label: '拒绝',
        value: 'not_pass'
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
      listLoading: false,
      form: JSON.parse(JSON.stringify(formData))
    }
  },
  created() {
    console.log(99)
  },
  methods: {
    // 跳转到详情页
    goDetail(val) {
      this.$router.push({
        name: 'reviewDetail',
        params: {
          id: val
        }
      })
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    // 重置
    searchReset() {
      this.form = JSON.parse(JSON.stringify(formData))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
