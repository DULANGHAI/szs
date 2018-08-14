<template>
  <div>
    <el-select v-model="businessName" @change="businessChange" size="mini" placeholder="请选择" style="float:left">
      <el-option
        v-for="item in ywzList"
        :key="item.id"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
    <div class="module-nav">
      <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/pe')}" @click="goPe">运维作业</div>
      <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/resouce')}" @click="goResouce">资源管理</div>
      <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/system')}">系统管理</div>
    </div>
  </div>
</template>

<script>
import { getRepository } from '@/api/script'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      businessName: '',
      ywzList: []
    }
  },
  computed: {
    ...mapGetters([
      'moduleName'
    ])
  },
  created() {
    this.getBusiness()
    console.log(999999, this.$store.state.user.repository)
  },
  methods: {
    isActive(path) {
      if (this.$route.path.indexOf(path) === 0) {
        return true
      }
      return false
    },
    getBusiness() {
      getRepository().then(response => {
        this.ywzList = response
        const bsName = Cookies.get('BussinessGroup') || response[0].name
        this.businessName = bsName
        Cookies.set('BussinessGroup', bsName)
        // this.$store.state.user.repository = this.businessName
      }).catch(error => {
        Message.error(error)
      })
    },
    businessChange(val) {
      // this.$store.state.user.repository = val
      Cookies.set('BussinessGroup', val)
    },
    goPe() {
      if (this.moduleName === 'pe') {
        return
      }
      this.$router.push({
        path: '/pe/dashboard/index'
      })
    },
    goResouce() {
      if (this.moduleName === 'resouce') {
        return
      }
      this.$router.push({
        path: '/resouce/dashboard/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module-nav {
  float: left;
  padding: 0 20px;
  width: 260px;
  display: flex;
  justify-content: space-between;
}
.module-nav-item {
  cursor: pointer;
  &:hover {
    color: #409EFF;
  }
}
.module-nav-item-active {
  color: #409EFF;
}
</style>
