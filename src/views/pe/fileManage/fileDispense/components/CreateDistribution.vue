<template>
  <el-dialog
    v-loading="loading"
    title="文件分发"
    :visible="dialogVisible"
    width="35%"
    class="pb-dialog"
    @close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="选择主机" prop="target_ip">
        <div>
          <treeselect v-model="form.target_ip" :multiple="true" :options="options" placeholder="请选择" />
        </div>
      </el-form-item>
      <el-form-item label="目标目录" prop="target_dest">
        <el-input v-model="form.target_dest" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
      <div class="flex">
        <el-form-item label="所有者" prop="owner">
          <el-input v-model="form.owner" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="mode" style="margin-left: 40px;">
          <el-input v-model="form.mode" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="替换文件">
        <el-switch v-model="form.replace"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { createDistributionApi } from '@/api/pe/fileManage/fileDispense'
import { getIpApi } from '@/api/pe/common/index'

export default {
  props: ['id', 'data'],
  components: {
    Treeselect
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      options: [],
      form: {
        target_ip: [],
        target_dest: '',
        owner: '',
        mode: '',
        replace: false
      },
      rules: {
        target_ip: [
          { required: true, message: '主机不能为空', trigger: 'blur' }
        ],
        target_dest: [
          { required: true, message: '目标目录不能为空', trigger: 'blur' }
        ],
        owner: [
          { required: true, message: '所有者不能为空', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loading = true
    getIpApi().then(res => {
      this.options = res
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    showModel() {
      this.dialogVisible = true
    },
    handleClose() {
      this.form = {
        target_ip: [],
        target_dest: '',
        owner: '',
        mode: '',
        replace: false
      }
      this.$refs.ruleForm.resetFields()
    },
    doSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const full_path_arr = this.data.map((item) => item.full_path)
          const data = {
            target_ip: this.form.target_ip,
            target_dest: this.form.target_dest,
            owner: this.form.owner,
            mode: this.form.mode,
            replace: this.form.replace,
            project_id: this.id,
            full_path: full_path_arr
          }
          createDistributionApi(data).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
            this.dialogVisible = false
          })
        }
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
