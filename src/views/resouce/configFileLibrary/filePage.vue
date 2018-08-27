<template>
  <div class="container-body">
    <template v-if="!fileDetailWrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="文件" name="file">
          <div class="tabs-contents" style="position:relative">
            <div class="file-nav">
              <div class="file-nav-left">
                <el-select v-model="branch" filterable @change="selectBranch" size="mini" placeholder="请选择分支">
                  <el-option
                    v-for="item in branchOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-button size="mini"><i class="el-icon-plus"></i></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="clearfix" @click.native="$refs.branch.doCreate(false, true)">
                      新建版本
                    </el-dropdown-item>
                    <el-dropdown-item class="clearfix" @click.native="BranchDelete">
                      删除版本
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <span style="padding-left: 10px;" class="pathspan">
                  <a style="display: inline-block;" @click="getfilelist()">{{ this.project_name }} </a>
                  <span v-if="pathSpan.length >= 1" role="presentation" class="el-breadcrumb__separator">/</span>
                  <el-breadcrumb separator="/" style="display: inline-block;vertical-align: middle;">
                    <el-breadcrumb-item v-for="(item, index) in pathSpan" :key="index"><a v-if="index !== pathSpan.length -1" @click="breadItem(index)">{{ item }}</a><span v-else>{{ item }}</span></el-breadcrumb-item>
                  </el-breadcrumb>
                </span>
              </div>
              <div class="file-nav-right">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-button size="mini">新建</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="clearfix" @click.native="$refs.app.doCreate(false, 'tree')">
                      新建文件夹
                    </el-dropdown-item>
                    <el-dropdown-item class="clearfix" @click.native="$refs.app.doCreate(false, 'blob')">
                      新建文件
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini" :disabled="is_sltmount" @click.native="$refs.app.doCreate(true, multipleSelection[0].type, multipleSelection[0])">编辑</el-button>
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
                <el-button size="mini" :disabled="is_sltmount" @click.native="FileDownload(multipleSelection[0].id)">下载</el-button>
                <el-button size="mini" :disabled="is_dltmount" @click.native="FileDelete(SelectionArray)">删除</el-button>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="fileData"
              tooltip-effect="dark"
              style="width: 100%"
              empty-text="暂无数据"
              v-loading.body="fileLoading"
              element-loading-text="加载中"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                label="文件名">
                <template slot-scope="scope"><el-button type="text" size="small" @click="isfiletype(scope.row.type, scope.row.full_path)"> <svg-icon :icon-class="scope.row.type === 'tree' ? 'wenjianjia' : 'wenjian'" /> {{ scope.row.name }}</el-button></template>
              </el-table-column>
              <el-table-column
                prop="comment"
                label="最近提交">
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
          <template v-if="!historyfilediff">
            <div class="tabs-contents">
              <div class="file-nav">
                <div class="file-nav-left">
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
                  min-width="20%"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="filelookhash(scope.row.id, scope.row.title, scope.row.committer_name)"><span class="text-yc" :title="scope.row.id">{{ scope.row.id}}</span></el-button>
                    <el-button type="text" size="small" @click="filebrowse(scope.row.id)">浏览文件</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template v-else>
            <file-diff ref="diff" :project_id="project_id" :branch="branch" :fid="hashdiff_id" :hashdiff_title="hashdiff_title" :hashdiff_user="hashdiff_user"></file-diff>
          </template>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-else>
      <div class="container-body-wrap">
        <div class="file-nav">
          <div class="file-nav-left">
            <el-select v-model="branch" filterable @change="selectBranch" size="mini" placeholder="请选择分支">
              <el-option
                v-for="item in branchOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <span style="padding-left: 10px;" class="pathspan">
              <a style="display: inline-block;" @click="getfilelist()">{{ this.project_name }} </a>
              <span v-if="pathSpan.length >= 1" role="presentation" class="el-breadcrumb__separator">/</span>
              <el-breadcrumb separator="/" style="display: inline-block;vertical-align: middle;">
                <el-breadcrumb-item v-for="(item, index) in pathSpan" :key="index"><a v-if="index !== pathSpan.length -1" @click="breadItem(index)">{{ item }}</a><span v-else>{{ item }}</span></el-breadcrumb-item>
              </el-breadcrumb>
            </span>
          </div>
          <div class="file-nav-right" v-if="!is_editContent">
            <el-button size="mini" @click="editFileContent(true)">编辑</el-button>
            <el-button size="mini" @click="FileDelete(SelectionArray)">删除</el-button>
          </div>
        </div>
        <div class="file-content">
          <div class="file-content-header">
            <div class="file-content-header-left">
              <svg-icon icon-class="wenjian" />
              <span>{{codeFileName}}</span>
            </div>
            <!-- <div class="file-content-header-right">
              <span>风险等级</span>
              <span><risk-level :level="codeFileRiskLevel"></risk-level></span>
            </div> -->
          </div>
          <div class="cm-container">
            <codemirror v-model="codeFileContent" @change="change" ref="myEditor" :options="codeOptions"></codemirror>
          </div>
          <!--<code-diff :old-string="oldStr" :new-string="newStr" :context="10" />-->
        </div>
      </div>
      <div class="container-body-wrap" v-if="is_editContent">
        <el-form :model="editForm">
          <el-form-item label="提交说明：" prop="codeFileComment">
            <el-input type="textarea" placeholder="请填写提交说明" :maxlength="200" v-model="editForm.comment"></el-input>
          </el-form-item>
          <!-- <el-form-item label="风险等级：" prop="codeFileLevel">
            <el-select v-model="editForm.risk_level" size="mini" placeholder="请选择">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
      </div>
      <div class="container-body-wrap" v-if="is_editContent" style="background:#f8f9fe;padding-top:5px;">
        <el-button type="primary" @click="submitEdit()">提交</el-button>
        <el-button @click="editFileContent(false)">取消</el-button>
      </div>
    </template>
    <add-version ref="branch" v-on:getfilelist="getBranch" :branch="branchOptions" :project_id="project_id"></add-version>
    <add-file ref="app" v-on:getfilelist="getfilelist(ckPath)" :project_id="project_id" :filePath="ckPath === '' ?  '/' : ckPath" :branch="branch"></add-file>
    <upload-file ref="file" v-on:getfilelist="getfilelist(ckPath)" :project_id="project_id" :path="ckPath === '' ?  '/' : ckPath" :branch="branch"></upload-file>
    <upload-zip ref="zip" v-on:getfilelist="getfilelist(ckPath)" :project_id="project_id" :path="ckPath === '' ?  '/' : ckPath" :branch="branch"></upload-zip>
  </div>
</template>

<script>
import AddVersion from './addVersion' // 新建版本
import AddFile from './AddFile' // 新建文件
import UploadFile from './uploadFile' // 上传文件
import UploadZip from './uploadZip' // 上传压缩包
import FileDiff from './filediff' // hash 文件diff
import { getFileList, getVersionHistory, deleteAppFile, getAppFile, putAppFile, getBranchList, deleteBranch } from '@/api/script'
import { Message, MessageBox } from 'element-ui'
import RiskLevel from '@/components/RiskLevel'
import CodeDiff from 'vue-code-diff'
import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/mode/shell/shell' // js的语法高亮，自行替换为你需要的语言

const formData = {
  'comment': '',
  'risk_level': ''
}
export default {
  name: 'ScriptLibrary',
  props: ['app_id', 'app_name'],
  components: {
    AddVersion,
    AddFile,
    UploadFile,
    UploadZip,
    getFileList,
    getVersionHistory,
    RiskLevel,
    CodeDiff,
    codemirror,
    CodeMirror,
    FileDiff
  },
  data() {
    return {
      activeName: 'file',
      levelList: null,
      branchOptions: [],
      levelOptions: [{
        label: '低危',
        value: 1
      }, {
        label: '中危',
        value: 2
      }, {
        label: '高危',
        value: 3
      }],
      editForm: JSON.parse(JSON.stringify(formData)),
      fileLoading: true,
      historyLoading: true,
      project_id: '',
      project_name: '',
      fileDetailWrap: false,
      fileData: [], // 文件列表
      ckPath: '', // 点击时获取的path
      pathSpan: [' '], // path 路径html
      historyData: [], // 版本历史列表
      multipleSelection: [],
      is_sltmount: true, // 禁用编辑状态是否开启
      is_dltmount: true,
      is_editContent: false, // 是否处于编辑状态
      historyfilediff: false, // 展示hash文件diff面板
      hashdiff_id: '', // 接受可传递的id
      hashdiff_title: '',
      hashdiff_user: '',
      codeOptions: { // 文件内容配置
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        readOnly: 'nocursor', // 是否编辑
        line: true,
        mode: 'python',
        theme: 'default'
      },
      branch: '',
      codeFileContent: '',
      codeFileName: '',
      codeFileRiskLevel: 0,
      codeFileComment: '', // 提交说明
      oldStr: 'var component = {\n\tname: "vue-codemirror-lite",\n\tauthor: "Fangxw",\n\trepo: "https://github.com/cnu4/vue-codemirror-lite"\n}',
      newStr: 'new code',
      SelectionArray: [], // 删除文件选中id
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
    this.getBranch()
    this.project_id = this.$props.app_id
    this.project_name = this.$props.app_name
    this.branchOptions = []
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.myEditor.editor
    }
  },
  methods: {
    change(code) {
      console.log('change', code)
    },
    // tab
    handleClick(tab, event) {
      if (tab.name === 'history') {
        this.getVersionHistory()
        this.historyfilediff = false
      } else {
        this.pathSpan = []
        this.getfilelist()
        this.getBranch()
      }
    },
    // 时间转换
    formatterTime(row) {
      return this.$dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.SelectionID = val
      var sary_path = []
      for (const item in val) {
        sary_path.push(val[item].file_id)
      }
      this.SelectionArray = sary_path
      val.length > 0 ? this.is_dltmount = false : this.is_dltmount = true
      val.length > 0 && val.length < 2 ? this.is_sltmount = false : this.is_sltmount = true
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [].concat(matched)
      }
      this.levelList = matched
    },
    // path路径字符串截取
    frArray(row) {
      var strs = row
      this.pathSpan = strs.split('/')
    },
    // 文件列表
    getfilelist(row) {
      this.ckPath = row || '/'
      const file_path = {
        path: row || '/',
        branch: this.branch
      }
      this.fileLoading = true
      this.fileDetailWrap = false
      this.pathSpan = []
      getFileList(this.$props.app_id, file_path).then(response => {
        this.fileData = response
        this.fileLoading = false
        if (row !== undefined && row !== '/') this.frArray(row)
        if (response.length > 0) {
          this.ckPath = response[0].path
        }
      }).catch(error => {
        Message.error(error)
      })
    },
    // 版本历史
    getVersionHistory() {
      var params = {}
      this.historyData = []
      this.fileLoading = false
      getVersionHistory(this.$props.app_id, params).then(response => {
        this.historyData = response
      }).catch(error => {
        Message.error(error)
      })
    },
    // 查看版本历史的hash文件diff
    filelookhash(fid, title, user) {
      this.historyfilediff = true
      this.hashdiff_id = fid
      this.hashdiff_title = title
      this.hashdiff_user = user
    },
    // 浏览文件 =》 将文件版本上呈现一个hash版本文件列表
    filebrowse(id) {
      this.activeName = 'file'
      this.branchOptions.push({
        'name': id
      })
      this.branch = id
      this.selectBranch()
    },
    // 获取版本
    getBranch(new_name) {
      getBranchList(this.$props.app_id).then(response => {
        this.branchOptions = response
        this.branch = new_name !== undefined ? new_name : (response[0].name || '')
        this.getfilelist()
      }).catch(error => {
        Message.error(error)
      })
    },
    // 删除版本
    BranchDelete() {
      MessageBox.confirm('您确定要删除此版本', '友情提示', { type: 'warning' }).then(() => {
        deleteBranch(this.project_id, this.branch).then(response => {
          this.branch = ''
          this.getBranch()
          Message.success('删除成功！')
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    // 查看文件内容
    getFileDetail(path) {
      const params = {
        full_path: path,
        branch: this.branch
      }
      this.codeFileContent = ''
      getAppFile(this.$props.app_id, params).then(response => {
        this.codeFileContent = response.content
        this.codeFileName = response.name
        this.codeFileRiskLevel = response.risk_level
        this.editForm = response || []
        this.SelectionArray = [response.file_id]
      }).catch(error => {
        Message.error(error)
      })
    },
    // 子路径方法
    breadItem(index) {
      var src_path = []
      for (var i = 0; i <= index; i++) {
        src_path.push(this.pathSpan[i])
      }
      this.fileDetailWrap = false
      this.getfilelist(src_path.join('/'))
    },
    // 删除文件
    FileDelete(id) {
      MessageBox.confirm('您确定要删除此文件', '友情提示', { type: 'warning' }).then(() => {
        this.fileLoading = true
        deleteAppFile(this.project_id, id).then(response => {
          this.getfilelist(this.ckPath)
          this.fileLoading = false
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    // 下载文件
    FileDownload(id) {
      window.open('/v1/repository/project/' + this.project_id + '/files/download?id=' + id)
    },
    // 点击文件判断类型进行操作
    isfiletype(type, path) {
      if (type === 'tree') {
        this.getfilelist(path)
      } else {
        this.frArray(path)
        this.getFileDetail(path)
        this.fileDetailWrap = true
      }
    },
    // 选择版本
    selectBranch() {
      this.getfilelist()
    },
    // 编辑文件内容
    editFileContent(type) {
      if (type) {
        this.codeOptions = {
          ...this.codeOptions,
          readOnly: false
        }
        this.is_editContent = true
      } else {
        this.codeOptions = {
          ...this.codeOptions,
          readOnly: true,
          autofocus: false
        }
        this.is_editContent = false
      }
    },
    // 确定编辑文件内容
    submitEdit() {
      const successCallBack = () => {
        Message.success('编辑成功')
        this.$router.push({
          name: 'review'
        })
      }
      const params = {
        'content': this.codeFileContent,
        'comment': this.editForm.comment,
        // 'risk_level': '', this.editForm.risk_level,
        'full_path': this.editForm.full_path,
        'branch': this.branch,
        'repository_type': 'configurations'
      }
      putAppFile(this.project_id, params).then(response => {
        successCallBack()
      }).catch(error => {
        Message.error(error)
      })
    }
  }
}
</script>