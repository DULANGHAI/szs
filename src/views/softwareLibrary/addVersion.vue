<template>
  <el-dialog
    title="新建版本"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form">
      <el-form-item label="活动名称">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.version" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        versionList: [],
        form: {
          name: '',
          version: ''
        }
      }
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        console.log(333)
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      }
    }
  }
</script>