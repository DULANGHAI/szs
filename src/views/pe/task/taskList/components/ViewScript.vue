<template>
  <el-dialog
    title="查看脚本"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose"
    @open="handleOpen()">
    <div v-if="codeFileContent">
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
import 'codemirror/mode/shell/shell' // js的语法高亮，自行替换为你需要的语言

import { getScriptApi } from '@/api/pe/taskManage/taskList'

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
        theme: 'default'
      }
    }
  },
  methods: {
    showModel() {
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
    setParames(parames) {
      this.parames = parames
    },
    getData() {
      getScriptApi(this.parames.id, this.parames).then(res => {
        this.codeFileContent = res.content
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>
