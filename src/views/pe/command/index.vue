<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body" v-loading="loading">
      <!-- 目标及命令 -->
      <div class="block-item">
        <div class="block-title">目标及命令</div>
        <div class="block-content">
          <el-form :model="form" ref="form" :rules="rules"  label-width="70px" size="small" label-position="left">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="目标IP" prop="target_ip">
                  <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号" prop="execution_account">
                  <el-input v-model="form.execution_account" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="命令" prop="command">
                  <el-input type="textarea" v-model="form.command" :rows="4" placeholder="请输入命令"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-button type="primary" @click="submit">提交</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <!-- 历史和结果 -->
      <div class="container-content">
        <!-- 左侧筛选列表 -->
        <div class="left">
          <div class="title">执行历史</div>
          <!-- 筛选 -->
          <div class="job-filter">
            <el-input placeholder="可搜索IP"
              suffix-icon="el-icon-search"
              v-model="form1.ip">
            </el-input>
          </div>
          <!-- 列表 -->
          <div class="job-list">
            <div v-for="(item, index) in dataJob" :key="index">
              <flow-item :uniqueId="uniqueId" :data="item" :selected="selectedJob" :selectNode="selectNode"></flow-item>
            </div>
            <infinite-loading ref="infiniteLoading" @infinite="loadMore" spinner="spiral">
              <span slot="no-more">
                没有更多数据了
              </span>
            </infinite-loading>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="right">
          <div class="flex">
            <div class="title">执行结果</div>
            <div class="select-container">
              <el-select v-model="selectedIp" placeholder="请选择" @change="changeIp" size="small" :disabled="ipList.length === 0">
                <el-option v-for="item in ipList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
          <!-- 执行记录 -->
          <div v-if="log">
            <codemirror v-model="log" ref="codemirror" :options="codeOptions"></codemirror>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import InfiniteLoading from 'vue-infinite-loading'
import FlowItem from './components/FlowItem'

import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/theme/blackboard.css'

import { createApi, getListApi, getResultApi } from '@/api/pe/command/index'
import { getIpApi } from '@/api/pe/common/index'

export default {
  components: {
    Breadcrumb,
    Treeselect,
    InfiniteLoading,
    FlowItem,
    codemirror,
    CodeMirror
  },
  data() {
    return {
      loading: false,
      options: [],
      form: {
        target_ip: [],
        execution_account: '',
        command: ''
      },
      rules: {
        target_ip: [
          { required: true, message: '目标IP不能为空', trigger: 'blur' }
        ],
        execution_account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        command: [
          { required: true, message: '命令不能为空', trigger: 'blur' }
        ]
      },
      form1: { // 左侧的作业筛选列表
        ip: '',
        page: 1,
        per_page: 10
      },
      dataJob: [],
      selectedJob: {},
      uniqueId: +new Date(),
      ipList: [],
      selectedIp: '',
      log: '',
      codeOptions: { // 文件内容配置
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        readOnly: 'nocursor', // 是否编辑
        line: true,
        mode: 'python',
        theme: 'blackboard'
      }
    }
  },
  watch: {
    selectedJob(val) {
      if (val.id) {
        this.form.execution_account = val.execution_account
        this.form.command = val.command
        if (val.time !== '执行中') {
          this.ipList = val.target_ip.split(',')
        } else {
          this.ipList = []
        }

        this.selectedIp = ''
        this.log = ''
      }
    },
    'form1.ip'(val, oldVal) {
      this.form1.ip = val
      this.form1.page = 1
      this.dataJob = []
      this.selectedJob = {}
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    }
  },
  created() {
    this.loading = true
    Promise.all([getIpApi()])
      .then(res => {
        this.options = res[0]
      }).finally(() => {
        this.loading = false
      })
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createApi(this.form).then(res => {
            this.$message.success('成功')
          })
        }
      })
    },
    resetForm() {
      this.form = {
        target_ip: [],
        execution_account: '',
        command: ''
      }
      this.$refs.form.resetFields()
    },
    loadMore($state) {
      getListApi(this.form1).then(res => {
        if (res.items.length === 0) {
          $state.loaded()
          $state.complete()
          this.$refs.infiniteLoading.isComplete = true
        } else {
          this.dataJob = this.dataJob.concat(res.items)
          $state.loaded()
          if (res.pages > res.page) {
            this.form1.page++
            this.$refs.infiniteLoading.isLoading = false
          } else {
            $state.complete()
            this.$refs.infiniteLoading.isComplete = true
          }
        }
      }).catch(() => {
        $state.loaded()
        $state.complete()
        this.$refs.infiniteLoading.isComplete = true
      })
    },
    selectNode(obj) {
      this.selectedJob = obj
      this.uniqueId = +new Date()
    },
    changeIp(val) {
      this.getResult(val)
    },
    getResult(ip) {
      getResultApi({
        target_ip: ip,
        execution_id: this.selectedJob.execution_id
      }).then(res => {
        this.log = res.execution_log
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container-body {
  margin: 24px;
  & /deep/ .el-select {
    width: 100%;
  }
}
.block-item {
  border-radius: 4px;
  background: #ffffff;
  &:not(:first-child) {
    margin-top: 24px;
  }
}
.block-title {
  padding: 16px 32px;
  font-size: 18px;
  color: rgba(0,0,0,0.85);
  line-height: 28px;
  font-weight: 700;
  border-bottom: 1px solid #E8E8E8;
}
.block-content {
  padding: 24px 32px;
}
.container-content {
  margin-top: 20px;
  background: #ffffff;
  overflow: hidden;
}
.left {
  float: left;
  width: 300px;
  padding: 29px 0 0;
  border-right: 1px solid #E8E8E8;
  .title {
    font-size: 18px;
    color: rgba(0,0,0,0.85);
    line-height: 28px;
    padding: 0 0 10px 20px;
    font-weight: 700;
  }
  .job-filter {
    display: flex;
    align-items: center;
    padding: 0 13px;
  }
  .job-list {
    margin-top: 10px;
    overflow-y: auto;
    height: 600px;
  }
}
.right {
  overflow: hidden;
  margin-left: 300px;
  padding: 29px 0;
  .title {
    font-size: 18px;
    color: rgba(0,0,0,0.85);
    line-height: 28px;
    padding: 0 20px 10px 20px;
    font-weight: 700;
  }
}
.margl-70 {
  margin-left: 70px;
}
.toolbar {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.table {
  margin-top: 18px;
  & /deep/ .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.danger {
  color: #f56c6c;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
.flex {
  display: flex;
}
.select-container {
  width: 200px;
}
</style>
