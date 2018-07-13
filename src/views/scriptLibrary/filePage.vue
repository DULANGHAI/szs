<template>
  <div class="container-body">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="文件" name="file">
          <div class="tabs-contents">
            <div class="tabs-nav">
              <div class="tabs-nav-left">
                <el-select v-model="branch" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span style="padding-left: 10px;">{{ this.filePath }}</span>
              </div>
              <div class="tabs-nav-right">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-button size="mini">新建</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="clearfix" @click.native="$refs.app.doCreate(false, true)">
                      新建文件夹
                    </el-dropdown-item>
                    <el-dropdown-item class="clearfix" @click.native="$refs.app.doCreate(false, false)">
                      新建文件
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini" :disabled="is_sltmount" @click.native="$refs.app.doCreate(true, multipleSelection[0].is_directory, multipleSelection[0])">编辑</el-button>
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
                <template slot-scope="scope">{{ scope.row.is_directory ? '[文件夹]' : '[文件]' }} {{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
                prop="comment"
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
    <add-file ref="app" v-on:getfilelist="getfilelist" :project_id="project_id" :filePath="filePath" :branch="branch"></add-file>
    <upload-file ref="file"></upload-file>
    <upload-zip ref="zip"></upload-zip>
  </div>
</template>

<script>
import AddVersion from './addVersion' // 新建版本
import AddFile from './AddFile' // 新建文件
import UploadFile from './uploadFile' // 上传文件
import UploadZip from './uploadZip' // 上传压缩包
import { getFileList, getVersionHistory } from '@/api/script'
import { Message } from 'element-ui'
import RiskLevel from '@/components/RiskLevel'

export default {
  name: 'ScriptLibrary',
  props: ['app_id'],
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
      options: [{
        value: 'master',
        label: 'master'
      }],
      value4: '',
      project_id: '',
      fileData: [], // 文件列表
      historyData: [], // 版本历史列表
      multipleSelection: [],
      is_sltmount: true,
      branch: 'master',
      filePath: '/' // 文件路径
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
    this.project_id = this.$props.app_id
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
      this.multipleSelection = val
      val.length > 0 && val.length < 2 ? this.is_sltmount = false : this.is_sltmount = true
      console.log(val)
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
      getFileList(this.$props.app_id).then(response => {
        this.fileData = response
        if (response.length > 0) {
          this.filePath = response[0].path
          console.log(response)
        } else {
          this.filePath = '/'
        }
      }).catch(error => {
        Message.error(error)
      })
    },
    getVersionHistory() {
      var params = {}
      getVersionHistory(this.$props.app_id, params).then(response => {
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
