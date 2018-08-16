export default {
  filters: {
    status(status, type = 'status') {
      // return this.formatterStatus(row)
      if (type === 'status') {
        switch (status) {
          case 1:
            return '启用'
          case 0:
            return '停用'
        }
      }
      if (type === 'theme') {
        switch (status) {
          case 1:
            return 'success'
          case 0:
            return 'danger'
        }
      }
    }
  },
  methods: {
    formatterDate(date) {
      return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    messageSuccess() {
      this.$message({
        type: 'success',
        message: '成功!'
      })
    },
    messageCancel() {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    }
  }
}
