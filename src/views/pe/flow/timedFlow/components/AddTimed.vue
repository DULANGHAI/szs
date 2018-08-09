<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="90px" size="small">
      <el-form-item label="定时作业名">
        <el-input v-model="form.name" placeholder="请输入" :disabled="type !== 'add'"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    type: String,
    data: Object,
    refresh: Function
  },
  data() {
    this.timed_type_map = {
      cycle: '周期',
      timed: '定时'
    }
    this.timed_config_map = {
      check: '勾选',
      custom: '自定义'
    }
    return {
      show: false,
      form: {
        name: '',
        description: '',
        target_ip: [],
        timed_type: 'cycle',
        timed_config: 'check',
        timed_date: '',
        timed_expression: '',
        frequency: '',
        status: 0
      }
    }
  },
  computed: {
    title() {
      if (this.type === 'edit') {
        return '定时流程配置'
      } else {
        return '添加定时流程'
      }
    }
  },
  methods: {
    showMoel() {
      this.show = true
    },
    hideModel() {
      this.show = false
    },
    handleOpen() {
      console.log('open callback ' + this.type)
    },
    handleClose() {
      console.log('close callback ')
    },
    cancel() {
      this.show = false
    },
    submit() {}
  }
}
</script>
