<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <!-- 筛选 -->
      <div class="toolbar">
        <el-form :model="form" :inline="true" ref="ruleForm" size="small">
          <el-form-item label="目标IP" prop="target_ip"
            :rules="[
              { required: true, message: '目标IP不能为空', trigger: ['blur', 'change'] }
            ]">
            <div style="width: 200px;">
              <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
            </div>
          </el-form-item>
          <el-form-item label="路径" prop="path"
            :rules="[
              { required: true, message: '路径不能为空', trigger: ['blur', 'change'] }
            ]">
            <el-input v-model="form.path">
              <i class="el-input__icon" slot="prefix">～</i>
            </el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" size="small" @click="download">下载</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      

      <!-- 表格 -->
      <div class="table">
        <el-table
          v-loading="loading"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="created_at" label="执行时间" width="160px" :formatter="formatterTime"></el-table-column>
          <el-table-column prop="target_ip" label="目标IP" width="120px">
            <template slot-scope="scope">
              <div v-if="scope.row.target_ip">
                <div v-for="(item, index) in scope.row.target_ip.split(',')" :key="index">
                  {{item}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="success_ip" label="下载成功IP" width="120px">
            <template slot-scope="scope">
              <div v-if="scope.row.success_ip">
                <div v-for="(item, index) in scope.row.success_ip.split(',')" :key="index"
                  class="can-click"
                  @click="handleViewLog(scope.row.execution_id, item)">
                  {{item}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="failed_ip" label="下载失败IP" width="120px">
            <template slot-scope="scope">
              <div v-if="scope.row.failed_ip">
                <div v-for="(item, index) in scope.row.failed_ip.split(',')" :key="index"
                  class="can-click"
                  @click="handleViewLog(scope.row.execution_id, item)">
                  {{item}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="realDownload(scope.row.execution_id)" :disabled="scope.row.status !== '下载完成'">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" v-if="total">
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
        </div>
      </div>

      <!-- 查看下载日志 -->
      <view-log ref="viewLog"></view-log>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ViewLog from './components/ViewLog'

import { postDownloadApi, downloadListApi } from '@/api/pe/fileManage/multipleFileDownload'
import { getIpApi } from '@/api/pe/common/index'

export default {
  components: {
    Breadcrumb,
    Treeselect,
    ViewLog
  },
  data() {
    return {
      loading: false,
      form: {
        target_ip: [],
        path: '',
        system_type: 'linux'
      },
      options: [],
      form2: {
        page: 1,
        per_page: 10
      },
      data: [],
      total: 0
    }
  },
  created() {
    this.loading = true
    Promise.all([getIpApi(), downloadListApi(this.form2)])
      .then(res => {
        this.options = res[0]
        this.data = res[1].items
        this.total = res[1].total
      }).finally(() => {
        this.loading = false
      })
  },
  methods: {
    formatterTime(row) {
      if (row.created_at) {
        return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    // 创建一个下载
    download() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const path = []
          path.push(this.form.path)

          const data = {
            target_ip: this.form.target_ip,
            path: path,
            system_type: 'linux'
          }
          postDownloadApi(data).then(() => {
            this.$message.success('成功')
            this.getListData(1)
          })
        }
      })
    },
    // 重置
    reset() {
      this.form = {
        target_ip: [],
        path: '',
        system_type: 'linux'
      }
    },
    // 下载历史记录
    getListData(index) {
      this.loading = true
      const params = this.form2
      if (index) {
        params.page = index
      }
      downloadListApi(params).then(res => {
        this.data = res.items
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
    // 翻页
    handlePageChange(val) {
      this.form2.page = val
      this.getListData()
    },
    // 真正的下载
    realDownload(id) {
      window.open(`/v1/buckets/mul-download/${id}`)
    },
    // 查看下载记录
    handleViewLog(execution_id, target_ip) {
      this.$refs.viewLog.showModel({ execution_id, target_ip })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
  padding: 29px 32px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
  & /deep/ .vue-treeselect__control {
    height: 32px;
  }
}
.toolbar {
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
.pagination {
  display: flex;
  justify-content: flex-end;
}
.can-click {
  cursor: pointer;
  color: #409EFF;
}
</style>
