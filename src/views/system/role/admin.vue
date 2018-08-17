<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="container-title">
      超级管理员
    </div>
    <!-- 列表 -->
    <div class="container-body-wrap">
      <el-row class="table-buttons">
        <el-button size="small" @click.native="createPremission">添加权限</el-button>
        <el-button size="small" @click.native="removePremission" :disabled="!selected">删除权限</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        v-loading.body="tableLoading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="permission" label="权限">
          <template slot-scope="{ row }">
            <el-tag
              v-for="permission in row.permission"
              :key="permission"
            >
              {{ permission }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource_type" label="资源类型"></el-table-column>
        <el-table-column prop="resource_type" label="资源操作"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="desc" label="描述"> </el-table-column>
      </el-table>
      <div class="list-paging">
        <el-pagination
          v-if="this.totalPage > 0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="this.pageSizesArray"
          :page-size="this.pageSize"
          :total="this.totalPage"
          layout="prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="添加权限" :visible.sync="dialogVisible" width="35%">
      <el-form ref="form-permission" :model="temp" :rules="rulesPermission" label-width="80px" size="small">
        <el-form-item label="选择权限" prop="roles">
          <el-select v-model="temp.permission" multiple placeholder="请选择" :style="{width: '100%'}">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('form-permission')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import common from '../common'

const defaultFormData = {
  permission: [],
  resource_type: '',
  resource_action: '',
  desc: ''
}

export default {
  mixins: [common],
  components: {
    Breadcrumb
  },
  data() {
    return {
      currentPage: 1,
      pageSizesArray: [10, 20, 30, 40, 50],
      pageSize: 0,
      totalPage: 0,
      multipleSelection: [],
      tableLoading: true,
      tableData: [],
      temp: defaultFormData,
      // 弹出框
      dialogVisible: false,
      rulesPermission: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ]
      },
      options: [
        {
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        },
        {
          value: '选项4',
          label: '选项4'
        },
        {
          value: '选项5',
          label: '选项5'
        }
      ]
    }
  },
  computed: {
    selected() {
      return Boolean(this.multipleSelection.length)
    },
    selectedOne() {
      return this.multipleSelection.length === 1
    },
    multipleSelectionFilter() {
      return this.tableData.filter(item => {
        return !~this.multipleSelection.indexOf(item)
      })
    }
  },
  created() {
    setTimeout(() => {
      this.tableLoading = false
      this.tableData = [
        {
          permission: ['1', '2'],
          resource_type: 'rt1',
          resource_action: 'ra1',
          created_at: '2018-07-25T04:31:00.499Z',
          desc: 'desc1'
        },
        {
          permission: ['2', '3'],
          resource_type: 'rt2',
          resource_action: 'ra2',
          created_at: '2018-07-25T04:31:00.499Z',
          desc: 'desc2'
        }
      ]
      this.currentPage = 1
      this.totalPage = 2
    }, 2000)
  },
  methods: {
    formatterTime(row, column, cellValue) {
      return this.formatterDate(cellValue)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    createPremission() {
      this.temp = { ...defaultFormData }
      this.dialogVisible = true
    },
    removePremission() {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.tableData = this.multipleSelectionFilter
          this.messageSuccess()
          this.$refs.multipleTable.clearSelection()
        })
        .catch(e => {
          this.messageCancel()
        })
    },
    // 选择展示页数
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    // 选择当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    submit(fromName) {
      this.$refs[fromName].validate(valid => {
        if (valid) {
          console.log('submit', fromName)
          this.messageSuccess()
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-buttons {
  text-align: right;
  padding-bottom: 20px;
}
</style>
