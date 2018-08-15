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
              <treeselect v-model="form.target_ip" :multiple="false" :options="options" placeholder="请选择" />
            </div>
          </el-form-item>
          <el-form-item label="路径">
            <el-input>
              <i class="el-input__icon" slot="prefix">～</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListData">查询</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="small" @click="download" :disabled="downloadDisabled">下载</el-button>
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
          <el-table-column prop="" label="文件名">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.type === 'tree'" icon-class="folder-icon"/>
              <svg-icon v-else icon-class="file-icon"/>
              <span class="file-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="权限"></el-table-column>
          <el-table-column prop="" label="所有者"></el-table-column>
          <el-table-column prop="" label="用户组"></el-table-column>
          <el-table-column prop="" label="大小"></el-table-column>
          <el-table-column prop="updated_at" label="上传时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { getListApi, postDownloadApi } from '@/api/pe/fileManage/fileDownload'
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
        target_ip: null,
        path: ''
      },
      options: [],
      data: [],
      multipleSelection: [],
      project_id: null
    }
  },
  computed: {
    downloadDisabled() {
      if (!this.project_id) {
        return true
      }
      if (this.multipleSelection.length !== 1) {
        return true
      }
      if (this.multipleSelection.length === 1 && this.multipleSelection[0].type === 'tree') {
        return true
      }
      return false
    }
  },
  created() {
    this.loading = true
    Promise.all([getIpApi(), getListApi(this.form)])
      .then(res => {
        this.options = res[0]
        this.data = res[1]
      }).finally(() => {
        this.loading = false
      })
  },
  methods: {
    // 下载历史记录
    getListData() {
      this.loading = true
      getListApi(this.form).then(res => {
        this.data = res
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 创建一个下载
    download() {
      const temp = this.getIpAndPath()

      const data = {
        target_ip: temp.target_ip,
        path: temp.path,
        system_type: 'linux'
      }
      postDownloadApi(data).then(() => {
        this.$message.success('成功，请到批量下载中查看')
      })
    },
    getIpAndPath() {
      const result = {
        target_ip: [],
        path: []
      }
      this.multipleSelection.forEach((item) => {
        result.target_ip.push(item.target_ip)
        result.path.push(item.path)
      })
      return result
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
</style>
