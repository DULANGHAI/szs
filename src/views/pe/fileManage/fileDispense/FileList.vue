<template>
  <div>
    <div class="container-body">
      <div class="file-model-container">
        <!-- 顶部 -->
        <div class="toolbox">
          <!-- 面包屑 -->
          <div class="my-nav-bar">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item, index) in pathItems" :key="index" @click.native="jump(index)">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <!-- 按钮组 -->
          <div class="btn-container">
            <el-button size="mini" @click="createFolder" :disabled="pathItems.length < 3">新建目录</el-button>
            <el-button size="mini" @click="upload" :disabled="pathItems.length < 3">上传</el-button>
            <el-button size="mini" @click="download" :disabled="downloadDisabled">下载</el-button>
            <el-button size="mini" @click="deleteFiles" :disabled="(pathItems.length < 3) || (multipleSelection.length === 0)">删除</el-button>
            <el-button size="mini" @click="distribution" :disabled="pathItems.length < 3">分发</el-button>
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
                <span class="file-name" @click="enterNext(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注"></el-table-column>
            <el-table-column prop="updated_at" label="上传时间"></el-table-column>
          </el-table>
        </div>

      </div>
    </div>

    <!-- 添加目录model -->
    <create-folder ref="createFolder" :id="project_id" :path="relative_path" :refresh="refresh"></create-folder>
    <!-- 上传文件 -->
    <upload-file ref="uploadFile" :id="project_id" :path="relative_path" :refresh="refresh"></upload-file>
    <!-- 创建文件分发 -->
    <create-distribution ref="createDistribution" :id="project_id" :data="multipleSelection"></create-distribution>
  </div>
</template>

<script>
import CreateFolder from './components/CreateFolder'
import UploadFile from './components/UploadFile'
import CreateDistribution from './components/CreateDistribution'

import { mapGetters } from 'vuex'
import { getFileListApi, deleteFilesApi } from '@/api/pe/fileManage/fileDispense'

export default {
  components: {
    CreateFolder,
    UploadFile,
    CreateDistribution
  },
  data() {
    return {
      loading: false,
      path: 'LDDS/file_buckets',
      pathItems: ['LDDS', 'file_buckets'],
      data: [],
      multipleSelection: [],
      project_id: null
    }
  },
  computed: {
    ...mapGetters([
      'repository'
    ]),
    relative_path() {
      const arr = this.path.split(this.repository + '/file_buckets/home')
      if (arr.length === 2) {
        if (arr[1] === '') {
          return '/'
        } else {
          return arr[1]
        }
      } else {
        return ''
      }
    },
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
    this.init()
  },
  methods: {
    init() {
      this.path = this.repository + '/file_buckets'
      this.pathItems = [this.repository, 'file_buckets']

      this.loading = true
      getFileListApi({
        path: this.path
      }).then(res => {
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      }).finally(() => {
        this.loading = false
      })
    },
    jump(index) {
      if (this.pathItems.length === 1) {
        return
      } else if (index === this.pathItems.length - 1) {
        return
      } else if (index < 2) {
        return
      }
      const arr = this.pathItems.slice(0, index + 1)
      const path = arr.join('/')
      this.loading = true
      getFileListApi({
        path: path
      }).then(res => {
        this.loading = false
        this.pathItems = path.split('/')
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      }).catch(() => {
        this.loading = false
      })
    },
    enterNext(row) {
      if (row.type !== 'tree') {
        return
      }
      const params = {
        path: row.absolute_path
      }
      this.loading = true
      getFileListApi(params).then(res => {
        this.loading = false
        this.pathItems = params.path.split('/')
        this.path = params.path
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    refresh() {
      this.loading = true
      getFileListApi({
        path: this.path
      }).then(res => {
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 按钮操作
     */
    // 创建
    createFolder() {
      this.$refs.createFolder.showModel()
    },
    // 上传
    upload() {
      this.$refs.uploadFile.showModel()
    },
    // 下载
    download() {
      window.open('/v1/repositories/project/' + this.project_id + '/files/download?id=' + this.multipleSelection[0].file_id)
    },
    // 删除文件
    deleteFiles() {
      this.$confirm('您确定要删除吗？', '提示')
        .then(() => {
          const ids = this.getFileId()
          deleteFilesApi(this.project_id, { ids })
            .then(() => {
              this.$message.success('删除成功！')
              this.refresh()
            })
        }, () => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getFileId() {
      const result = []
      this.multipleSelection.forEach((item) => {
        result.push(item.file_id)
      })
      return result
    },
    // 文件分发
    distribution() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选中需要分发的文件')
        return
      }
      this.$refs.createDistribution.showModel()
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.file-model-container {
  & /deep/ .el-breadcrumb__inner {
    cursor: pointer;
    &:hover {
      color: #1890FF;
    }
  }
  .my-nav-bar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    word-break: break-all;
  }
  .marl4{
    margin-left: 4px;
  }
}
.toolbox {
  display: flex;
  justify-content: space-between;
}
.btn-container {
  flex-shrink: 0;
}
.table {
  margin-top: 18px;
  & /deep/ .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.file-name {
  color: #1890FF;
  cursor: pointer;
}
</style>
