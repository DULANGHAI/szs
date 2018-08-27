<template>
  <div class="app-main">
    <transition name="fade" mode="out-in">
      <router-view :key="activeKey"></router-view>
      <!-- <router-view></router-view> -->
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      activeKey: +new Date()
    }
  },
  computed: {
    ...mapGetters([
      'repository'
    ])
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  watch: {
    repository(val, oldVal) {
      if (val !== oldVal) {
        this.activeKey = +new Date()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  
}
</style>
