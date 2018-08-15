<template>
<div class="file-model-container">
  <el-dialog
    title="文件选择"
    :visible.sync="show"
    width="600px"
    @open="handleOpen" @close="handleClose">
    <div class="file-content">
      <!-- 面包屑 -->
      <div class="my-nav-bar">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in pathItems" :key="index" @click.native="jump(index)">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-select v-if="form.branch" v-model="form.branch" size="mini" class="marl4" @change="branchChange">
          <el-option v-for="(item, index) in branchOption" :key="index" :label="item.name" :value="item.name">
          </el-option>
        </el-select>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="data"
        height="300"
        border
        style="width: 100%"
        :row-style="rowStyle"
        @row-click="selectItem"
        @row-dblclick="enterNext">
        <el-table-column prop="" label="名称" width="180">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.type === 'tree'" icon-class="folder-icon"/>
            <svg-icon v-else icon-class="file-icon"/>
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="编辑者" width="180"></el-table-column>
        <el-table-column prop="updated_at" label="编辑时间"></el-table-column>
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="ok" :disabled="okDisable">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFileListApi, getBranchApi } from '@/api/pe/taskManage/taskList'

export default {
  props: {
    fileOk: Function
  },
  data() {
    return {
      show: false,
      pathItems: ['LDDS'],
      form: {
        path: 'LDDS',
        branch: ''
      },
      branchOption: [],
      data: [],
      selected: {}
    }
  },
  computed: {
    ...mapGetters([
      'repository'
    ]),
    okDisable() {
      if (this.selected.project_id) {
        return false
      }
      return true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.pathItems = [this.repository]
      this.form.path = this.repository
      getFileListApi(this.form).then(res => {
        this.data = res
      })
    },
    handleOpen() {
      this.init()
    },
    handleClose() {
      this.pathItems = [this.repository]
      this.form = {
        path: this.repository,
        branch: ''
      }
      this.branchOption = []
      this.data = []
      this.selected = {}
    },
    showMoel() {
      this.show = true
    },
    cancel() {
      this.show = false
    },
    ok() {
      this.fileOk(this.selected)
      this.cancel()
    },
    rowStyle({ row }) {
      if (row.file_id === this.selected.file_id) {
        return {
          backgroundColor: '#f5f7fa'
        }
      }
    },
    selectItem(row, event, column) {
      this.selected = row
    },
    enterNext(row, event) {
      if (row.type !== 'tree') {
        return
      }
      const params = {
        path: row.absolute_path,
        branch: row.branch
      }
      getFileListApi(params).then(res => {
        this.pathItems = params.path.split('/')
        this.form = params
        this.data = res
        this.selected = {}
        // 看看请求的下一层数据是不是要选分支
        if (res[0] && res[0].project_id) {
          this.form.branch = res[0].branch
          getBranchApi(res[0].project_id).then(res => {
            this.branchOption = res
          })
        }
      })
    },
    jump(index) {
      if (this.pathItems.length === 1) {
        return
      } else if (index === this.pathItems.length - 1) {
        return
      }
      const arr = this.pathItems.slice(0, index + 1)
      const params = {
        path: arr.join('/'),
        branch: ''
      }
      getFileListApi(params).then(res => {
        this.pathItems = params.path.split('/')
        this.form = params
        this.data = res
        this.selected = {}
        // 看看请求的下一层数据是不是要选分支
        if (res[0] && res[0].project_id) {
          this.form.branch = res[0].branch || ''
          getBranchApi(res[0].project_id).then(res => {
            this.branchOption = res
          })
        }
      })
    },
    branchChange(val) {
      const params = {
        path: this.form.path,
        branch: val
      }
      getFileListApi(params).then(res => {
        this.pathItems = params.path.split('/')
        this.form = params
        this.data = res
        this.selected = {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.file-model-container {
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  /deep/ .el-breadcrumb__inner {
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
  }
  .marl4{
    margin-left: 4px;
  }
}

</style>
