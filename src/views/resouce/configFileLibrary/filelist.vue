<template>
  <div class="pb-library">
    <template>
      <div class="page-bar">
        <el-breadcrumb class="app-breadcrumb" separator="/">
          <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
              <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
              <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
            </el-breadcrumb-item>
          </transition-group>
          <span role="presentation" class="el-breadcrumb__separator">/</span>
          <el-select v-model="value4" size="mini" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span role="presentation" class="el-breadcrumb__separator">/</span>
          <el-select v-model="value4" size="mini" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-breadcrumb>
      </div>
    </template>
    <div class="container-title">
      脚本库
    </div>
    <div class="container-body">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="文件" name="file">
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
                  <span> /patyon</span>
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
                :data="fileData"
                tooltip-effect="dark"
                style="width: 100%"
                empty-text="暂无数据"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection">
                </el-table-column>
                <el-table-column
                  label="文件名">
                  <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="最近提交">
                </el-table-column>
                <el-table-column
                  label="风险等级"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <risk-level :level="scope.row.risk_level"></risk-level>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="更新时间"
                  :formatter="formatterTime"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="版本历史" name="history">
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
                  <span> /patyon</span>
                </div>
              </div>
              <el-table
                ref="multipleTable"
                :data="historyData"
                tooltip-effect="dark"
                style="width: 100%"
                empty-text="暂无数据">
                <el-table-column
                  prop="committed_date"
                  label="提交时间"
                  :formatter="formatterTime"
                  min-width="20%">
                </el-table-column>
                <el-table-column
                  prop="title"
                  label="提交说明">
                </el-table-column>
                <el-table-column
                  prop="rank"
                  label="hash"
                  min-width="30%"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" size="small"><span class="text-yc" :title="scope.row.id">{{ scope.row.id}}</span></el-button>
                    <el-button type="text" size="small">复制</el-button>
                    <el-button type="text" size="small">浏览文件</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <add-version ref="create"></add-version>
      <add-app ref="app"></add-app>
      <upload-file ref="file"></upload-file>
      <upload-zip ref="zip"></upload-zip>
    </div>
  </div>
</template>

<script>
import AddVersion from './addVersion' // 新建版本
import AddFile from './addFile' // 新建文件
import UploadFile from './uploadFile' // 上传文件
import UploadZip from './uploadZip' // 上传压缩包
import { getFileList, getVersionHistory } from '@/api/script'
import { Message } from 'element-ui'
import RiskLevel from '@/components/RiskLevel'

export default {
  name: 'ScriptLibrary',
  components: {
    AddVersion,
    AddFile,
    UploadFile,
    UploadZip,
    getFileList,
    getVersionHistory,
    RiskLevel
  },
  data() {
    return {
      activeName: 'file',
      levelList: null,
      path: '/',
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
      fileData: [], // 文件列表
      historyData: [], // 版本历史列表
      multipleSelection: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
    this.getfilelist()
    console.log(34, this.$route.params)
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'history') {
        this.getVersionHistory()
      } else {
        this.getfilelist()
      }
    },
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
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
      console.log(val)
      this.multipleSelection = val
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [].concat(matched)
      }
      this.levelList = matched
    },
    getfilelist() {
      var params = {
        path: this.path
      }
      getFileList('2', params).then(response => {
        this.fileData = response
      }).catch(error => {
        Message.error(error)
      })
    },
    getVersionHistory() {
      var params = {}
      getVersionHistory('2', params).then(response => {
        this.historyData = response
      }).catch(error => {
        Message.error(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
