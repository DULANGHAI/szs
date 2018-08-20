<<<<<<< HEAD
<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <module-nav></module-nav>
    <div class="nav-tooltip">
     
        <span class="tooltip-icon">
           <router-link class="inlineBlock" to="/system/dashboard/setting">
          <svg-icon icon-class="setting" />
          </router-link>
        </span>
      
      <span class="tooltip-icon">
        <svg-icon icon-class="wenti" />
      </span>
      <span class="tooltip-icon">
        <router-link to="/system/dashboard/info">
        <el-badge v-model="num" :max="99" class="item">
          <svg-icon icon-class="notice" />
        </el-badge>
        </router-link>
      </span>
      <span class="tooltip-icon">
        <el-dropdown trigger="click">
          <div>
            <svg-icon icon-class="icon-avatar" :style="{ transform: 'scale(1.5)' }"/>
            <span class="tooltip-name">{{ name }}</span>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/system/dashboard/personalInfo">
              <el-dropdown-item>
                <div>个人信息</div>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <div @click="logout">退出账号</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ModuleNav from '@/components/ModuleNav'
import { getNum } from '@/api/systemManage/system.js'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ModuleNav
  },
  data() {
    return {
      num: '',
      id: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  mounted() {
    setInterval(() => {
      this.id = getToken()
      getNum({ user_id: this.id }).then(res => {
        this.num = res.count
      })
    }, 10000)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 64px;
  line-height: 64px;
  border-radius: 0px !important;
  z-index: 100;
  .nav-tooltip{
    float:right;
    margin-right: 25px;
    .tooltip-icon{
      display: inline-block;
      margin-left: 20px;
      cursor: pointer;
      position: relative;
      line-height: 25px;
    }
    .icon-avatar{
      margin-right: 3px;
    }
    .tooltip-name{
      padding-left: 5px;
    }
  }
  .hamburger-container {
    line-height: 72px;
    height: 64px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

=======
<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <module-nav></module-nav>
    <div class="nav-tooltip">
      <span class="tooltip-icon">
        <svg-icon icon-class="setting" />
      </span>
      <span class="tooltip-icon">
        <svg-icon icon-class="wenti" />
      </span>
      <span class="tooltip-icon">
        <router-link to="/system/dashboard/info">
        <el-badge v-model="num" :max="99" class="item">
          <svg-icon icon-class="notice" />
        </el-badge>
        </router-link>
      </span>
      <span class="tooltip-icon">
        <el-dropdown trigger="click">
          <div>
            <svg-icon icon-class="icon-avatar" :style="{ transform: 'scale(1.5)' }"/>
            <span class="tooltip-name">{{ name }}</span>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item>
                <div>个人信息</div>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <div @click="logout">退出账号</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ModuleNav from '@/components/ModuleNav'
import { getNum } from '@/api/systemManage/system.js'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ModuleNav
  },
  data() {
    return {
      num: '',
      id: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  mounted() {
    this.interval = setInterval(() => {
      this.id = getToken()
      getNum({ user_id: this.id }).then(res => {
        this.num = res.count
      }).catch(() => {
        clearInterval(this.interval)
      })
    }, 10000)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 64px;
  line-height: 64px;
  border-radius: 0px !important;
  z-index: 100;
  .nav-tooltip{
    float:right;
    margin-right: 25px;
    .tooltip-icon{
      display: inline-block;
      margin-left: 20px;
      cursor: pointer;
      position: relative;
      line-height: 25px;
    }
    .icon-avatar{
      margin-right: 3px;
    }
    .tooltip-name{
      padding-left: 5px;
    }
  }
  .hamburger-container {
    line-height: 72px;
    height: 64px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

>>>>>>> d88e09b31067b0193468d03eb93558925596622b
