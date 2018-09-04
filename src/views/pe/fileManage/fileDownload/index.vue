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
              <treeselect v-model="form.target_ip"
                :disable-branch-nodes="true"
                :multiple="false" 
                :clearable="false"
                :options="options"
                placeholder="请选择" />
            </div>
          </el-form-item>
          <el-form-item label="路径" prop="path"
            :rules="[
              { required: true, message: '路径不能为空', trigger: ['blur', 'change'] }
            ]">
            <el-input v-model="form.path"></el-input>
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
              <div v-if="scope.row.isdir">
                <svg-icon icon-class="folder-icon"/>
                <span class="file-name" @click="enterDir(scope.row.path)">{{ scope.row.name }}</span>
              </div>
              <div v-else>
                <svg-icon icon-class="file-icon"/>
                <span class="file-name">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mode" label="权限"></el-table-column>
          <el-table-column prop="pw_name" label="所有者"></el-table-column>
          <el-table-column prop="gr_name" label="用户组"></el-table-column>
          <el-table-column prop="size" label="大小" :formatter="formatterSize"></el-table-column>
          <el-table-column prop="mtime" label="修改时间" :formatter="formatterTime"></el-table-column>
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
        path: '/home/mds'
      },
      options: [],
      data: [],
      multipleSelection: []
    }
  },
  computed: {
    downloadDisabled() {
      if (!this.multipleSelection.length) {
        return true
      }
      return false
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
    ipChange(value) {
      this.form.target_ip = value
      this.form.path = '/home/mds'
      this.getListData()
    },
    // 文件浏览
    getListData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          getListApi(this.form).then(res => {
            this.data = res
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 创建一个下载
    download() {
      const target_ip_arr = []
      const path_arr = []
      target_ip_arr.push(this.form.target_ip)
      path_arr.push(this.form.path)
      const data = {
        target_ip: target_ip_arr,
        path: path_arr,
        system_type: 'linux'
      }
      postDownloadApi(data).then(() => {
        this.$message.success('成功，请到批量下载中查看')
      })
    },
    // 进去文件夹
    enterDir(path) {
      this.form.path = path
      this.getListData()
    },
    formatterTime(row) {
      if (row.mtime) {
        return this.$dayjs(row.mtime * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    formatterSize(row) {
      return this.renderSize(row.size)
    },
    renderSize(value) {
      if (value === null || value === '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      const srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2)// 保留的小数位数
      return size + unitArr[index]
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
