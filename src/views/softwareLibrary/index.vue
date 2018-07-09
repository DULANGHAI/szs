<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      软件包库
    </div>
    <div class="container-body">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文件" name="first">
            <div class="tabs-contents">
              <div class="tabs-nav">
                <div class="tabs-nav-left">
                  <el-select v-model="value4" size="mini" clearable placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-button size="mini"><i class="el-icon-plus"></i></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" @click.native="$refs.create.doCreate(false)">
                        新建版本
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix">
                        删除版本
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="tabs-nav-right">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-button size="mini">新建</el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" @click.native="$refs.folder.doCreate(false)">
                        新建文件夹
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" @click.native="$refs.app.doCreate(false)">
                        新建文件
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button size="mini">编辑</el-button>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-button size="mini">上传</el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" @click.native="$refs.file.doCreate(false)">
                        上传文件
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" @click.native="$refs.zip.doCreate(false)">
                        上传压缩包
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button size="mini">下载</el-button>
                  <el-button size="mini">删除</el-button>
                </div>
              </div>
              <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                empty-text="暂无数据"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection">
                </el-table-column>
                <el-table-column
                  label="文件名">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="最近提交">
                </el-table-column>
                <el-table-column
                  prop="rank"
                  label="风险等级"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="更新时间"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="版本历史" name="second">版本历史</el-tab-pane>
        </el-tabs>
      </template>
      <add-version ref="create"></add-version>
      <add-folder ref="folder"></add-folder>
      <add-app ref="app"></add-app>
      <upload-file ref="file"></upload-file>
      <upload-zip ref="zip"></upload-zip>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import AddVersion from './addVersion' // 新建版本
import AddFolder from './addFolder' // 新建文件夹
import AddApp from './addApp' // 新建文件
import UploadFile from './uploadFile' // 新建文件
import UploadZip from './uploadZip' // 新建文件
export default {
  name: 'ScriptLibrary',
  components: {
    Breadcrumb,
    AddVersion,
    AddFolder,
    AddApp,
    UploadFile,
    UploadZip
  },
  data() {
    return {
      activeName: 'first',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value4: '',
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        rank: 2,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        rank: 3,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        rank: 4,
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        rank: 3,
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getlist() {
      console.log(199)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
