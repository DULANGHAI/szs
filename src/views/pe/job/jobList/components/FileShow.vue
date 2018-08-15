<template>
  <div>
    <el-form ref="form" label-width="84px" size="small" label-position="left">
      <el-form-item label="任务类型">
        <div>{{taskTypeMap[data.type]}}</div>
      </el-form-item>

      <div style="display: flex;">
        <el-form-item label="目标系统">
          <div>{{data.target_system}}</div>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="文件分发"></el-form-item>
        <file-select ref="fileSelect" view="1"></file-select>
        <div style="display: flex;">
          <el-form-item label="文件所有者">
            <el-input v-if="!view" v-model="data.file_owner" placeholder="请输入"></el-input>
            <div v-if="view">{{data.file_owner}}</div>
          </el-form-item>
          <el-form-item label="文件权限" style="margin-left: 40px;">
            <el-input v-if="!view" v-model="data.file_permission" placeholder="请输入"></el-input>
            <div v-if="view">{{data.file_permission}}</div>
          </el-form-item>
        </div>
        <el-form-item label="文件替换">
          <el-switch v-model="data.is_replace" disabled></el-switch>
        </el-form-item>
      </div>

      <el-form-item label="启用">
        <el-switch v-model="data.is_enable" disabled></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FileSelect from '@/views/pe/task/taskList/components/FileSelect'
import { getLanguageApi } from '@/api/pe/taskManage/taskList'

export default {
  props: {
    view: String,
    data: Object
  },
  components: {
    FileSelect
  },
  data() {
    return {
      taskTypeMap: {
        command: '命令',
        script: '脚本',
        file: '文件分发'
      },
      systemAndLang: {}
    }
  },
  created() {
    getLanguageApi().then(res => {
      this.systemAndLang = res
    })
  },
  mounted() {
    const temp = JSON.parse(this.data.file_selection)
    this.$refs.fileSelect.setData(temp)
  }
}
</script>

<style lang="scss" scoped>

</style>
