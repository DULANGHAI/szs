<template>
  <div class="module-nav">
    <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/pe')}">运维作业</div>
    <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/resource')}">资源管理</div>
    <div class="module-nav-item" :class="{'module-nav-item-active': isActive('/system')}">系统管理</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    isActive(path) {
      if (this.$route.path.indexOf(path) === 0) {
        return true
      }
      return false
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
