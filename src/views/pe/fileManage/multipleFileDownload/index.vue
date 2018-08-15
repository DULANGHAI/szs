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
          <el-form-item label="目标IP">
            <div style="width: 200px;">
              <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
            </div>
          </el-form-item>
          <el-form-item label="路径">
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
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="start_time" label="执行时间"></el-table-column>
          <el-table-column prop="target_ip" label="目标IP"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="" label="下载成功IP"></el-table-column>
          <el-table-column prop="" label="下载失败IP"></el-table-column>
          <el-table-column fixed="right" label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="realDownload(scope.row.execution_id)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" v-if="total">
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="handlePageChange"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { postDownloadApi, downloadListApi } from '@/api/pe/fileManage/multipleFileDownload'
import { getIpApi } from '@/api/pe/common/index'

export default {
  components: {
    Breadcrumb,
    Treeselect
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
        per_page: 10,
        system_type: 'linux'
      },
      data: [],
      total: 0,
      multipleSelection: []
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 创建一个下载
    download() {
      const target_ip = []
      const path = []
      target_ip.push(this.form.target_ip)
      path.push(this.form.path)

      const data = {
        target_ip: target_ip,
        path: path,
        system_type: 'linux'
      }
      postDownloadApi(data).then(() => {
        this.$message.success('成功')
        this.getListData(1)
      })
    },
    // 重置
    reset() {
      this.form = {
        target_ip: [],
        path: '',
        system_type: 'linux'
      }
      this.getListData(1)
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
</style>
