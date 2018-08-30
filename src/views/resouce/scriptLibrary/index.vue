<template>
  <div class="pb-library">
    <template>
      <div class="page-bar">
        <el-breadcrumb class="app-breadcrumb" separator="/">
          <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index)  in levelList" :key="index" v-if="item.meta.title">
              <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
            </el-breadcrumb-item>
          </transition-group>
          <template v-if="isSpeed === 1">
            <span role="presentation" class="el-breadcrumb__separator">/</span>
            <el-dropdown @command="ywzChange" trigger="click">
              <el-button size="mini">
                {{ywzSelectName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in ywzList" :key="index" :command="item.id">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-if="isSpeed === 2">
            <span role="presentation" class="el-breadcrumb__separator">/</span>
            <el-dropdown @command="ywzChange" trigger="click">
              <el-button size="mini">
                {{ywzSelectName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in ywzList" :key="index" :command="item.id">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span role="presentation" class="el-breadcrumb__separator">/</span>
            <el-select v-model="zzSelect" size="mini" placeholder="请选择" @change="zzChange">
              <el-option
                v-for="item in zizuList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-breadcrumb>
      </div>
    </template>
    <div class="container-title">
      脚本
    </div>
    <div class="container-body-wrap" v-if="!isfile">
      <!-- <template v-if="isSpeed === 1">
        <dl class="ovinfo-dl">
          <dd v-for="item in ywzList" @click="zzDetail(item.id)">
            <span>{{ item.name }}</span>
            <div>{{ item.description }}</div>
          </dd>
        </dl>
      </template> -->
      <template v-if="isSpeed === 1">
        <el-table
          ref="multipleTable"
          :data="zizuList"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading.body="listLoading" 
          element-loading-text="Loading"
          empty-text="暂无数据">
          <el-table-column
            label="项目名"
            min-width="30%"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="yyDetail(scope.row.project_id)">{{ scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="提交说明">
          </el-table-column>
        </el-table>
      </template>
      <template v-if="isSpeed === 2">
        <div style="text-align:right;margin-bottom:15px;">
          <el-button size="mini" @click.native="$refs.addproject.doCreate(false)">添加</el-button>
        </div>
        <el-table
          ref="yyTable"
          :data="yyList"
          style="width: 100%"
          v-loading.body="listLoading" 
          element-loading-text="Loading"
          empty-text="暂无数据">
          <el-table-column
            label="项目名"
            min-width="30%"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goFileDetail(scope.row.id, scope.row.name)">{{ scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="提交说明">
          </el-table-column>
          <el-table-column
            prop="update_user"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="created_at"
            :formatter="formatterTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="30%"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="yyListDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="container-body" v-if="isfile">
      <file-page ref="create" :app_id="app_id" :app_name="app_name"></file-page>
    </div>
    <add-project ref="addproject" v-on:getList="getList" :group_id="zzSelect"></add-project>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import { getRepository, getRepositoryZizu, getRepositoryYuyan, deleteRepositoryYuyan } from '@/api/script'
import { Message, MessageBox } from 'element-ui'
import FilePage from './filePage' // 新建版本
import AddProject from './addProject' // 新建项目

export default {
  name: 'ScriptLibrary',
  components: {
    Breadcrumb,
    RiskLevel,
    FilePage,
    AddProject
  },
  data() {
    return {
      r_type: 'scripts',
      levelList: null,
      value4: '',
      isZizu: false,
      isSpeed: 1,
      isfile: false,
      activeName: 'file',
      ywzList: [],
      zizuList: [], // 子组list =》 子组列表
      yyList: [], // 语言list =》 列表
      ywzSelect: '', // 面包 =》 业务组select
      zzSelect: '',
      ywzSelectName: '',
      listLoading: true,
      yySelection: [],
      app_id: '',
      app_name: ''
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
    this.getYWZ()
    this.isSpeed = 2
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [].concat(matched)
      }
      this.levelList = matched
    },
    formatterTime(row) {
      return this.$dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    },
    getYWZ() {
      getRepository().then(response => {
        this.ywzList = response
        this.zzDetail(response[0].id)
      }).catch(error => {
        Message.error(error)
      })
    },
    // 加载子组列表
    getZizu(id, name) {
      this.zizuList = []
      this.listLoading = true
      getRepositoryZizu(name, this.r_type).then(response => {
        this.zizuList = response
        if (response.length > 0) {
          this.zzSelect = response[0].id
          this.getYuyan(response[0].id)
        } else {
          this.isSpeed = 1
        }
        this.listLoading = false
      }).catch(error => {
        Message.error(error)
      })
    },
    // 选择业务组select
    ywzChange(id) {
      this.isfile = false
      for (var item in this.ywzList) {
        if (this.ywzList[item].id === id) {
          this.getZizu(id, this.ywzList[item].name)
          this.ywzSelectName = this.ywzList[item].name
        }
      }
    },
    // 子组select
    zzChange(id) {
      this.getYuyan(id)
      this.isSpeed = 2
      this.isfile = false
    },
    // 打开子组显示
    zzDetail(id) {
      this.isSpeed = 1
      this.ywzChange(id)
      this.ywzSelect = id
    },
    // 打开语言组显示
    yyDetail(id) {
      this.isSpeed = 2
      this.getYuyan(id)
    },
    getYuyan(id) {
      this.yyList = []
      var params = {
        group_id: id
      }
      this.listLoading = true
      getRepositoryYuyan(params).then(response => {
        this.yyList = response
        this.listLoading = false
      }).catch(error => {
        Message.error(error)
      })
    },
    // 语言list 删除
    yyListDelete(id) {
      MessageBox.confirm('您确定要删除此项目', '友情提示', { type: 'warning' }).then(() => {
        deleteRepositoryYuyan(id).then(response => {
          this.getList()
        }).catch(error => {
          Message.error(error)
        })
      }).catch(() => { })
    },
    goFileDetail(id, name) {
      this.isfile = true
      this.app_id = id
      this.app_name = name
      // this.$router.push({
      //   name: 'fileList',
      //   params: {
      //     id: 'aaa'
      //   }
      // })
    },
    getList() {
      this.zizuList = []
      this.yyList = []
      this.getYuyan(this.zzSelect)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
