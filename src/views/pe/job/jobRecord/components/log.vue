<template>
  <div>
    <div class="basic-info">
      <el-form ref="form" label-width="80px" size="small" label-position="left">
        <el-row>
          <el-col :span="5">
            <el-form-item label="作业名">
              <div>{{form.name}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="作业类型">
              <div>{{job_type_map[form.job_type]}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="IP">
              <div>{{form.target_ip}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开始时间">
              <div>{{form.start_time ? $dayjs(form.start_time).format('YYYY-MM-DD HH:mm:ss') : ''}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="结束时间">
              <div>{{form.end_time ? $dayjs(form.end_time).format('YYYY-MM-DD HH:mm:ss') : ''}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="执行耗时">
              <div>{{form.time}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <div>{{form.status}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="结果">
              <div>{{form.result}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-show="log">
      <codemirror v-model="log" ref="codemirror" :options="codeOptions"></codemirror>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/python/python' // js的语法高亮，自行替换为你需要的语言
import 'codemirror/theme/blackboard.css'

export default {
  components: {
    codemirror,
    CodeMirror
  },
  data() {
    this.execution_type_map = {
      instant: '即时作业',
      timed: '定时作业'
    }
    this.job_type_map = {
      ordinary: '普通作业',
      update: '应用更新&发布',
      quit: '应用下线',
      inspection: '日常检查',
      distribution: '文件分发'
    }
    return {
      form: {
        name: '',
        job_type: 'ordinary',
        target_ip: '',
        start_time: '',
        end_time: '',
        time: '',
        status: '',
        result: ''
      },
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
  computed: {
    editor() {
      // get current editor object
      return this.$refs.codemirror.editor
    }
  },
  mounted() {
    this.editor.focus()
  },
  methods: {
    setData(data1, data2) {
      this.form = {
        name: data1.name,
        job_type: data1.job_type,
        target_ip: data1.target_ip,
        start_time: data1.start_time,
        end_time: data1.end_time,
        time: data1.time,
        status: data1.status,
        result: data1.result
      }
      this.log = data2
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
