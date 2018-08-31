<template>
  <el-dialog
    title="下载日志"
    :visible="dialogVisible"
    width="800px"
    class="pb-dialog"
    @close="handleClose"
    @open="handleOpen()"
    append-to-body>
    <div v-show="codeFileContent" class="max-height-400">
      <codemirror v-model="codeFileContent" ref="myEditor" :options="codeOptions"></codemirror>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/theme/blackboard.css'

import { getLogDetailApi } from '@/api/pe/jobManage/jobRecord'

export default {
  components: {
    codemirror,
    CodeMirror
  },
  data() {
    return {
      dialogVisible: false,
      parames: null,
      codeFileContent: '',
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
    showModel(parames) {
      this.parames = parames
      this.dialogVisible = true
    },
    handleClose() {
      this.parames = null
      this.codeFileContent = ''
      this.dialogVisible = false
    },
    handleOpen() {
      this.getData()
    },
    getData() {
      getLogDetailApi(this.parames.execution_id, this.parames.target_ip).then(res => {
        this.codeFileContent = res.execution_log
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.max-height-400 {
  max-height: 400px;
  overflow-y: auto;
}
</style>
