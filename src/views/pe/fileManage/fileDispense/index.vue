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
            <el-button size="mini">重命名</el-button>
            <el-button size="mini">新建目录</el-button>
            <el-button size="mini">上传</el-button>
            <el-button size="mini">下载</el-button>
            <el-button size="mini">删除</el-button>
            <el-button size="mini">分发</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <div class="table">
          <el-table
            :data="data"
            border
            style="width: 100%"
            @row-click="selectItem"
            @row-dblclick="enterNext"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="" label="文件名">
              <template slot-scope="scope">
                <svg-icon v-if="scope.row.type === 'tree'" icon-class="folder-icon"/>
                <svg-icon v-else icon-class="file-icon"/>
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="update_user" label="备注"></el-table-column>
            <el-table-column prop="updated_at" label="上传时间"></el-table-column>
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { getFileListApi } from '@/api/pe/fileManage/fileDispense'

export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      path: 'LDDS',
      pathItems: ['LDDS'],
      data: [],
      selected: {},
      multipleSelection: []
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
      }
      const arr = this.pathItems.slice(0, index + 1)
      const path = arr.join('/')
      getFileListApi({
        path: path
      }).then(res => {
        this.pathItems = path.split('/')
        this.data = res
        this.selected = {}
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
</style>
