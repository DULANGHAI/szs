<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      {{$route.name}}
    </div>
    <div class="container-body">
      <div class="container-content">
        <!-- 左侧筛选列表 -->
        <div class="left">
          <!-- 筛选 -->
          <div class="job-filter">
            <el-input placeholder="可搜索作业名"
              suffix-icon="el-icon-search"
              v-model="form1.name">
            </el-input>
            <el-dropdown>
              <span class="el-dropdown-link">
                <svg-icon :icon-class="form1.system_type ? 'filter_active' : 'filter'" :style="{ margin: '0 10px' }"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in system_type_arr"
                  :key="index"
                  @click.native="systemClick(item)">
                  <span :class="{'active-blue': form1.system_type === item.value}">{{item.label}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 列表 -->
          <div class="job-list">
            <div v-for="(item, index) in dataJob" :key="index">
              <job-item :data="item"></job-item>
            </div>
          </div>
        </div>
        <!-- 右侧内容 -->
        <div class="right">
          <!-- 操作列表 -->
          <div class="tool-box">
            <div class="flex">
              <div class="op-item">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="refresh_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">刷新</div>
              </div>
            </div>
            <div class="flex">
              <div class="op-item">
                <svg-icon icon-class="create_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="refresh_instant" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">刷新</div>
              </div>
              <div class="op-item">
                <svg-icon icon-class="delete_job" :style="{ transform: 'scale(1.5)' }" />
                <div class="mart-10">创建</div>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <!-- 分页 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskLevel from '@/components/RiskLevel'
import JobItem from './components/JobItem'

import { getLanguageApi, getJobListApi, getInstantListApi } from '@/api/pe/jobManage/instantJob'

export default {
  components: {
    Breadcrumb,
    RiskLevel,
    JobItem
  },
  data() {
    return {
      form1: { // 左侧的作业筛选列表
        name: '',
        system_type: '',
        type: '',
        creator: '',
        start_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      form2: { // 右边的即时作业列表
        page: 1,
        per_page: 10
      },
      system_type_arr: [],
      dataJob: [],
      dataInstant: []
    }
  },
  created() {
    Promise.all([getLanguageApi(), getJobListApi(this.form1), getInstantListApi(this.form2)])
      .then(res => {
        this.system_type_arr = this.handleSystemData(res[0])
        this.dataJob = res[1].items
        this.dataInstant = res[2].items
      })
  },
  methods: {
    handleSystemData(data) {
      const result = [{ label: '全部', value: '' }]
      Object.keys(data).forEach((item) => {
        result.push({ label: item, value: item })
      })
      return result
    },
    systemClick(item) {
      if (this.form1.system_type !== item.value) {
        this.form1.system_type = item.value
        this.getListData(1)
      }
    },
    getListData(index) {
      const params = this.form1
      if (index) {
        params.page = index
      }
      getJobListApi(params).then(res => {
        this.dataJob = res.items
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-body {
  margin: 24px;
  border-radius: 4px;
  background-color: #fff;
  & /deep/ .el-select {
    width: 100%;
  }
}
.container-content {
  display: flex;
}
.left {
  width: 300px;
  padding: 29px 0;
  min-height: 700px;
  border-right: 1px solid #E8E8E8;
  .job-filter {
    display: flex;
    align-items: center;
    padding-left: 13px;
  }
  .job-list {
    margin-top: 10px;
    overflow-y: auto;
  }
}
.right {
  flex: 1;
  padding: 29px 0;
  .tool-box {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
  }
  .op-item {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: rgba(0,0,0,0.85);
    &.disable {
      opacity: 0.65;
      pointer-events: none;
    }
  }
}
.flex {
  display: flex;
}
.mart-10 {
  margin-top: 10px;
}
</style>
