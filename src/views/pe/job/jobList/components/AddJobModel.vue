<template>
  <el-dialog title="添加作业" :visible.sync="show" @close="handleClose">
    <el-form>
      <el-form-item label="作业类型">
        <el-radio-group v-model="form.type">
          <el-radio label="command">命令</el-radio>
          <el-radio label="script">脚本</el-radio>
          <el-radio label="file">文件分发</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择作业">
        <el-select
          v-model="selected"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          popper-class="script-select"
          :loading="loading"
          @focus="firstData"
          @change="change">
          <el-option v-for="item in jobArr" :key="form.type + item.id" :label="item.name" :value="item.name">
            <command-option v-if="form.type === 'command'" :data="item"></command-option>
            <script-option v-else :data="item"></script-option>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleOk" :disabled="!selectedObj">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ScriptOption from '@/components/ScriptOption'
import CommandOption from '@/components/CommandOption'
import { getJobItemApi } from '@/api/pe/jobManage/jobList'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    addNode: Function,
    systemType: String
  },
  components: {
    ScriptOption,
    CommandOption
  },
  data() {
    return {
      form: {
        name: '',
        type: 'command',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        page: 1,
        per_page: 10
      },
      loading: false,
      selected: '',
      jobArr: [],
      selectedObj: null
    }
  },
  methods: {
    firstData(e) {
      this.loading = true
      this.form.name = e.target.value
      this.form.target_system = this.systemType
      getJobItemApi(this.form).then(res => {
        this.loading = false
        this.jobArr = res.items
      }).catch(() => {
        this.loading = false
        this.jobArr = []
      })
    },
    remoteMethod(query) {
      this.loading = true
      this.form.name = query
      this.form.target_system = this.systemType
      getJobItemApi(this.form).then(res => {
        this.loading = false
        this.jobArr = res.items
      }).catch(() => {
        this.loading = false
        this.jobArr = []
      })
    },
    change(val) {
      for (let i = 0; i < this.jobArr.length; i++) {
        if (this.jobArr[i].name === val) {
          this.selectedObj = this.jobArr[i]
          break
        }
      }
    },
    cancel() {
      this.form = {
        name: '',
        type: 'command',
        target_system: '',
        language: '',
        risk_level: '',
        creator: '',
        page: 1,
        per_page: 10
      }
      this.loading = false
      this.selected = ''
      this.jobArr = []
      this.selectedObj = null
      this.$emit('update:show', false)
    },
    handleClose() {
      this.cancel()
    },
    handleOk() {
      if (!this.selectedObj.next) {
        this.selectedObj.next = []
      }
      this.addNode(this.selectedObj)
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
