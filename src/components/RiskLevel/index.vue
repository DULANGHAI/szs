<template>
  <div class="risk-level">
    <span v-for="n in [0, 1, 2]" :key="n" @click="handleChange(n)">
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
      default: 0
    },
    changeable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedLevel() {
      const num = parseInt(this.level)
      if (num < 0) {
        return 0
      }
      return num
    }
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    handleChange(index) {
      if (this.changeable) {
        this.$emit('update:level', index + 1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fire {
  color: #F5222D;
}
</style>
