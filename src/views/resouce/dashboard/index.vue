<template>
  <div>
    <div>
      <breadcrumb></breadcrumb>
    </div>
    <div class="container-title">
      主机组管理
    </div>
    <div class="container-body-wrap review-body">
      salads
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { Message } from 'element-ui'

const formData = {
  'datatime': []
}
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      multipleSelection: [],
      listLoading: false,
      form: JSON.parse(JSON.stringify(formData)),
      listData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(123)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
