<template>
  <div class="risk-level">
    <span v-for="n in [0, 1, 2]" :key="n">
      <svg-icon v-if="n < computedLevel" icon-class="fire-red" />
      <svg-icon v-else icon-class="fire" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: [String, Number],
      default: 1
    }
  },
  computed: {
    computedLevel() {
      const num = parseInt(this.level)
      if (num < 1) {
        return 1
      }
      return num
    }
  },
  data() {
    return {
      levelList: null
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fire {
  color: #F5222D;
}
</style>
