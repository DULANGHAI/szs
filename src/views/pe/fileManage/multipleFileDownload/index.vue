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
            <el-input>
              <i class="el-input__icon" slot="prefix">～</i>
            </el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" size="small" @click="download">下载</el-button>
          <el-button size="small">重置</el-button>
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
          <el-table-column prop="" label="执行时间"></el-table-column>
          <el-table-column prop="" label="目标IP"></el-table-column>
          <el-table-column prop="" label="创建人"></el-table-column>
          <el-table-column prop="" label="状态"></el-table-column>
          <el-table-column prop="" label="下载成功IP"></el-table-column>
          <el-table-column prop="" label="下载失败IP"></el-table-column>
          <el-table-column fixed="right" label="操作" width="70">
            <template slot-scope="scope">
              <el-button type="text" size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    Breadcrumb,
    Treeselect
  },
  data() {
    return {
      form: {
        target_ip: []
      },
      options: [
        {
          id: '10.111.2.41',
          label: '10.111.2.41',
          children: [
            {
              id: '10.111.2.42',
              label: '10.111.2.43'
            },
            {
              id: '10.111.2.43',
              label: '10.111.2.43'
            }
          ]
        },
        {
          id: '10.111.2.44',
          label: '10.111.2.44'
        },
        {
          id: '10.111.2.40',
          label: '10.111.2.40'
        }
      ],
      data: [],
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 下载
    download() {

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
