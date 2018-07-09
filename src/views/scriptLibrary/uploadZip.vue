<template>
  <el-dialog
    title="上传压缩包"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog">
    <el-form :model="form">
      <div>上传文件(单个文件大小不超过500mb)</div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-plus"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      </el-upload>
      <el-form-item label="提要说明">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="自评风险">
        <el-input v-model="form.name" auto-complete="off" placeholder="请输入"></el-input>
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
          name: ''
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