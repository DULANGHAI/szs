<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
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
            <el-button size="mini" @click="createFolder" :disabled="!project_id">新建目录</el-button>
            <el-button size="mini" @click="upload" :disabled="!project_id">上传</el-button>
            <el-button size="mini" @click="download" :disabled="downloadDisabled">下载</el-button>
            <el-button size="mini" @click="deleteFiles" :disabled="!project_id">删除</el-button>
            <el-button size="mini" :disabled="!project_id">分发</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <div class="table">
          <el-table
            :data="data"
            border
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
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import CreateFolder from './components/CreateFolder'
import UploadFile from './components/UploadFile'

import { getFileListApi, deleteFilesApi } from '@/api/pe/fileManage/fileDispense'

export default {
  components: {
    Breadcrumb,
    CreateFolder,
    UploadFile
  },
  data() {
    return {
      group: 'LDDS',
      path: 'LDDS/file_buckets',
      pathItems: ['LDDS', 'file_buckets'],
      data: [],
      multipleSelection: [],
      project_id: null
    }
  },
  computed: {
    relative_path() {
      const arr = this.path.split('LDDS/file_buckets/home')
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
      getFileListApi({
        path: this.path
      }).then(res => {
        this.data = res
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
      getFileListApi({
        path: path
      }).then(res => {
        this.pathItems = path.split('/')
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      })
    },
    enterNext(row) {
      if (row.type !== 'tree') {
        return
      }
      const params = {
        path: row.absolute_path
      }
      getFileListApi(params).then(res => {
        this.pathItems = params.path.split('/')
        this.path = params.path
        this.data = res
        if (res.length) {
          this.project_id = res[0].project_id
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    refresh() {
      this.init()
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
    }
    // 文件分发
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
}
.file-model-container {
  .el-breadcrumb__inner {
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
