<template>
  <div class="pb-library review-body">
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      文件审批
    </div>
    <div class="container-body">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="文件审批" name="filereview">
          <div class="tabs-contents">
            <div>
              <el-row>
                <el-col :span="20">
                  <div style="color:#000;font-weight:600;font-size:16px;">
                    {{ form.path }}
                    <a @click="goReviewHash(form.commit_sha)"><span class="text-yc" style="margin-left:25px;width:80px;">{{ form.commit_sha }}</span><svg-icon icon-class="commit_sha" /></a>
                  </div>
                  <div>{{ form.comment }}</div>
                </el-col>
                <el-col :span="4">自评风险 <span style="display:inline-block;margin-left:10px;"><risk-level :level="form.risk_level"></risk-level></span></el-col>
              </el-row>
            </div>
            <div style="padding-bottom: 10px;margin-bottom: 20px;border-bottom: 1px solid #ddd;">
              <el-row>
                <el-col :span="2">
                  提交者:
                </el-col>
                <el-col :span="7">
                  {{ form.submitter }}
                </el-col>
                <el-col :span="2">
                  提交时间:
                </el-col>
                <el-col :span="7">
                  {{ form.created_at }}
                </el-col>
                <el-col :span="2">
                  状态:
                </el-col>
                <el-col :span="4" v-html="form.status"></el-col>
              </el-row>
              <el-row>
                <el-col :span="2">
                  审批者:
                </el-col>
                <el-col :span="6">
                  {{ form.approver }}
                </el-col>
              </el-row>
            </div>
            <div v-for="(item, index) in ftstr" style="margin-bottom:20px;">
              <div class="diff-content-header">
                <svg-icon icon-class="wenjian" /> {{ item.new_path }}
              </div>
              <code-diff :old-string="item.old_content" outputFormat="side-by-side" :new-string="item.new_content" :context="5" />
            </div>
          </div>
          <div class="review-body-wrap" v-if="form.approver === '/'">
            <el-form :model="reviewForm" :rules="rules" ref="ruleForm">
              <el-form-item label="审批结果：" prop="status">
                <el-select v-model="reviewForm.status" placeholder="请选择">
                  <el-option v-for="item in fileStutas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审批意见：" prop="approval_comments">
                <el-input type="textarea" v-model="reviewForm.approval_comments" placeholder="请填写审批意见" :maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="风险等级：" prop="risk_level">
                <el-select v-model="reviewForm.risk_level" placeholder="请选择">
                  <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="review-body-wrap" v-if="form.approver === '/'" style="background:#f8f9fe;padding-top:5px;">
            <el-button type="primary" @click="doSubmit()">提交</el-button>
            <el-button @click="backList()">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批记录" name="record">
          <div class="tabs-contents">
            <div>
              <el-row>
                <el-col :span="20">
                  <div style="color:#000;font-weight:600;font-size:16px;">{{ form.path }}</div>
                  <div>{{ form.comment }}</div>
                </el-col>
                <el-col :span="4">自评风险 <span style="display:inline-block;margin-left:10px;"><risk-level :level="form.risk_level"></risk-level></span></el-col>
              </el-row>
            </div>
            <div style="padding-bottom: 10px;margin-bottom: 20px;border-bottom: 1px solid #ddd;">
              <el-row>
                <el-col :span="2">
                  提交者:
                </el-col>
                <el-col :span="7">
                  {{ form.submitter }}
                </el-col>
                <el-col :span="2">
                  提交时间:
                </el-col>
                <el-col :span="7">
                  {{ form.created_at }}
                </el-col>
                <el-col :span="2">
                  状态:
                </el-col>
                <el-col :span="4" v-html="form.status"></el-col>
              </el-row>
              <el-row>
                <el-col :span="2">
                  审批者:
                </el-col>
                <el-col :span="6">
                  {{ form.approver }}
                </el-col>
              </el-row>
            </div>
            <div v-for="code in ftstr">
              <el-table
                ref="multipleTable"
                :data="recordData"
                tooltip-effect="dark"
                style="width: 100%"
                empty-text="暂无数据">
                <el-table-column
                  prop="approver"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="updated_at"
                  :formatter="formatterTime"
                  label="审批时间">
                </el-table-column>
                <el-table-column
                  prop="approval_comments"
                  label="审批意见">
                </el-table-column>
                <el-table-column
                  label="风险等级">
                  <template slot-scope="scope">
                    <risk-level :level="scope.row.risk_level"></risk-level>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审批结果">
                  <template slot-scope="scope">
                    <div v-html="scope.row.status"></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="hash文件" name="hash" v-if="hashTabs">
          <div class="tabs-contents" v-if="!fileDetailWrap">
            <div class="file-nav">
              <div class="file-nav-left">
                <el-select v-model="branch" filterable @change="selectBranch" size="mini" placeholder="请选择分支">
                  <el-option :value="branch">{{ branch }}</el-option>
                </el-select>
                <span style="padding-left: 10px;" class="pathspan">
                  <a style="display: inline-block;" @click="getfilelist()">{{ this.project_name }} </a>
                  <span v-if="pathSpan.length >= 1" role="presentation" class="el-breadcrumb__separator">/</span>
                  <el-breadcrumb separator="/" style="display: inline-block;vertical-align: middle;">
                    <el-breadcrumb-item v-for="(item, index) in pathSpan"><a v-if="index !== pathSpan.length -1" @click="breadItem(index)">{{ item }}</a><span v-else>{{ item }}</span></el-breadcrumb-item>
                  </el-breadcrumb>
                </span>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="fileData"
              tooltip-effect="dark"
              style="width: 100%"
              empty-text="暂无数据"
              v-loading.body="fileLoading"
              element-loading-text="加载中">
              <el-table-column
                label="文件名">
                <template slot-scope="scope"><el-button type="text" size="small" @click="isfiletype(scope.row.type, scope.row.path, scope.row.project_id)"> <svg-icon :icon-class="scope.row.type === 'tree' ? 'wenjianjia' : 'wenjian'" /> {{ scope.row.name }}</el-button></template>
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
          <div class="tabs-contents" v-else>
            <div class="file-nav">
              <div class="file-nav-left">
                <el-select v-model="branch" filterable @change="selectBranch" size="mini" placeholder="请选择分支">
                  <el-option :value="branch">{{ branch }}</el-option>
                </el-select>
                <span style="padding-left: 10px;" class="pathspan">
                  <a style="display: inline-block;" @click="getfilelist()">{{ this.project_name }} </a>
                  <span v-if="pathSpan.length >= 1" role="presentation" class="el-breadcrumb__separator">/</span>
                  <el-breadcrumb separator="/" style="display: inline-block;vertical-align: middle;">
                    <el-breadcrumb-item v-for="(item, index) in pathSpan"><a v-if="index !== pathSpan.length -1" @click="breadItem(index)">{{ item }}</a><span v-else>{{ item }}</span></el-breadcrumb-item>
                  </el-breadcrumb>
                </span>
              </div>
            </div>
            <div class="file-content">
              <div class="file-content-header">
                <div class="file-content-header-left">
                  <svg-icon icon-class="wenjian" />
                  <span>{{codeFileName}}</span>
                </div>
              </div>
              <div class="cm-container">
                <codemirror v-model="codeFileContent" @change="change" ref="myEditor" :options="codeOptions"></codemirror>
              </div>
              <!--<code-diff :old-string="oldStr" :new-string="newStr" :context="10" />-->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getReviewDetail, getReviewDiff, postReview } from '@/api/resouce/versionLibrary/review'
import { getFileList, getAppFile, getAppInfo } from '@/api/script'
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { Message } from 'element-ui'
import CodeDiff from 'vue-code-diff'
import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/mode/shell/shell' // js的语法高亮，自行替换为你需要的语言

const formData = {
  'submitter': '',
  'status': '',
  'created_at': ''
}

const reviewFormData = {
  'status': '',
  'approval_comments': '',
  'risk_level': ''
}
export default {
  name: 'ScriptLibrary',
  components: {
    Breadcrumb,
    RiskLevel,
    CodeDiff,
    codemirror,
    CodeMirror
  },
  data() {
    return {
      activeName: 'filereview',
      identifier: '',
      filePath: '',
      form: JSON.parse(JSON.stringify(formData)),
      ftstr: [],
      recordData: [],
      hashTabs: false,
      branch: '',
      ckPath: '', // 点击时获取的path
      app_id: '',
      pathSpan: [], // path 路径html
      fileData: [], // 文件列表
      fileDetailWrap: false,
      codeFileContent: '',
      codeFileName: '',
      project_name: '',
      codeOptions: { // 文件内容配置
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        readOnly: 'nocursor', // 是否编辑
        line: true,
        mode: 'python',
        theme: 'default'
      },
      branchOptions: [],
      fileStutas: [{
        label: '通过',
        value: 'pass'
      }, {
        label: '拒绝',
        value: 'not_pass'
      }],
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
      reviewForm: JSON.parse(JSON.stringify(reviewFormData)),
      rules: {
        status: [
          { required: true, message: '审批结果不能为空', trigger: 'blur' }
        ],
        risk_level: [
          { required: true, message: '风险等级不能为空', trigger: 'blur' }
        ],
        approval_comments: [
          { required: true, message: '审批意见不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.identifier = this.$route.params.id
    this.getInfo()
    this.reviewForm = Object.assign({}, reviewFormData)
    this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
  },
  methods: {
    getInfo() {
      getReviewDetail(this.identifier).then(response => {
        let fstatus
        switch (response.status) {
          case 'initial':
            fstatus = '<span>审批中</span>'
            break
          case 'cancel':
            fstatus = '<span>已撤销</span>'
            break
          case 'pending':
            fstatus = '<span>审批中</span>'
            break
          case 'pass':
            fstatus = '<span style="color:green">通过</span>'
            break
          case 'not_pass':
            fstatus = '<span style="color:red">拒绝</span>'
            break
        }
        this.form.created_at = this.formatterTime(response.created_at)
        this.form.submitter = response.submitter
        this.form.risk_level = response.risk_level
        this.form.approver = response.approver || '/'
        this.form.status = fstatus
        this.form.commit_sha = response.commit_sha
        this.form.project_id = response.project_id
        this.form.target_branch = response.target_branch
        this.form.path = response.path
        this.form.comment = response.comment
        this.form.commit_sha = response.commit_sha
        this.app_id = response.id
        this.recordData = [{
          'approver': response.approver || '/',
          'updated_at': response.updated_at,
          'approval_comments': response.approval_comments,
          'risk_level': response.risk_level,
          'status': fstatus
        }]
        this.getDiff(response.project_id, response.commit_sha, response.target_branch)
        this.getProjectName()
      })
    },
    getDiff(project_id, commit_sha, target_branch) {
      const params = {
        'branch': target_branch
      }
      getReviewDiff(project_id, commit_sha, params).then(response => {
        this.ftstr = response
      })
    },
    formatterTime(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const successCallBack = () => {
            Message.success('操作成功')
            this.backList()
          }
          const params = this.reviewForm
          postReview(this.identifier, params).then(response => {
            successCallBack()
          }).catch(error => {
            Message.error(error)
          })
        }
      })
    },
    backList() {
      this.$router.push({
        name: 'review'
      })
    },
    // 获取hash版本文件tab
    goReviewHash(hash) {
      this.activeName = 'hash'
      this.hashTabs = true
      this.getBranch(hash)
      this.getfilelist()
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
      getFileList(this.form.project_id, file_path).then(response => {
        this.fileData = response
        this.fileLoading = false
        if (row !== undefined) this.frArray(row)
        if (response.length > 0) {
          this.ckPath = response[0].path
        }
      }).catch(error => {
        Message.error(error)
      })
    },
    getProjectName() {
      getAppInfo(this.form.project_id).then(response => {
        this.project_name = response.name
      }).catch(error => {
        Message.error(error)
      })
    },
    // 选择版本
    selectBranch() {
      this.getfilelist()
    },
    // path路径字符串截取
    frArray(row) {
      var strs = row
      this.pathSpan = strs.split('/')
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
    // 获取版本
    getBranch(hash) {
      // 这里默认输出 hash版本
      this.branch = hash !== undefined ? hash : (hash || '')
    },
    // 点击文件判断类型进行操作
    isfiletype(type, path, pid) {
      if (type === 'tree') {
        this.getfilelist(path)
      } else {
        this.frArray(path)
        this.getFileDetail(path, pid)
        this.fileDetailWrap = true
      }
    },
    // 查看文件内容
    getFileDetail(path, pid) {
      const params = {
        full_path: path,
        branch: this.branch
      }
      this.codeFileContent = ''
      getAppFile(pid, params).then(response => {
        this.codeFileContent = response.content
        this.codeFileName = response.name
        this.editForm = response || []
      }).catch(error => {
        Message.error(error)
      })
    },
    change(code) {
      console.log('change', code)
    },
    handleClick(val) {
      console.log('tabs')
      this.fileLoading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row{
    padding-bottom: 25px;
  }
</style>
