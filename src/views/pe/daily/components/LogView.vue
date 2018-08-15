<template>
  <el-dialog
    v-loading="loading"
    title="新建目录"
    :visible="dialogVisible"
    width="500px"
    @close="handleClose">
    <div class="log-container">
      <div v-if="log">
        <codemirror v-model="log" ref="codemirror" :options="codeOptions"></codemirror>
      </div>
    </div>
    

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/theme/blackboard.css'

export default {
  props: {
    id: [Number, String],
    path: String,
    refresh: Function
  },
  components: {
    codemirror,
    CodeMirror
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      log: '',
      codeOptions: { // 文件内容配置
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        readOnly: 'nocursor', // 是否编辑
        line: true,
        mode: 'python',
        theme: 'blackboard'
      }
    }
  },
  methods: {
    showModel() {
      this.dialogVisible = true
    },
    handleClose() {
      this.log = ''
      this.dialogVisible = false
    },
    doSubmit() {
      this.dialogVisible = false
    },
    setData(data) {
      this.log = data
    }
  }
}
</script>

<style lang="scss" scoped>
.log-container {
  height: 300px;
  overflow-y: auto;
}
</style>
