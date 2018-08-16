<template>
  <div class="file-select-container">
    <el-form :model="selectForm" ref="selectForm" label-width="80px" size="small">
      <el-row v-for="(item, index) in selectForm.group" :key="index">
        <el-col :span="9">
          <el-form-item label="文件选择" :prop="`group.${index}.file.name`" 
            :rules="{
              required: true, message: '文件不能为空', trigger: ['blur', 'change']
            }">
            <el-input v-if="!view" v-model="item.file.name" @focus="openFile(index)" readonly placeholder="请选择"></el-input>
            <div v-if="view">{{item.file.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="目标目录" :prop="`group.${index}.target_path`" 
            :rules="{
              required: true, message: '目标目录不能为空', trigger: ['blur', 'change']
            }">
            <el-input v-if="!view"  v-model="item.target_path"></el-input>
            <div v-if="view">{{item.target_path}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-show="!view && selectForm.group.length > 1">
          <el-form-item label="" label-width="10px">
            <i class="el-icon-delete" @click="deleteItem(index)"></i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!view">
        <el-col :offset="70">
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-plus" plain @click="addItems">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 文件选择model -->
    <file-model ref="fileModel" :fileOk="fileOk"></file-model>
  </div>
</template>

<script>
import FileModel from './FileModel'

export default {
  props: ['view'],
  components: {
    FileModel
  },
  data() {
    return {
      selectForm: {
        group: [
          {
            file: {
              name: ''
            },
            target_path: ''
          }
        ]
      },
      current: null
    }
  },
  methods: {
    addItems() {
      this.selectForm.group.push(
        {
          file: {
            name: '',
            key: Date.now()
          },
          target_path: ''
        }
      )
    },
    deleteItem(index) {
      if (this.selectForm.group.length > 1) {
        this.selectForm.group.splice(index, 1)
      }
    },
    openFile(index) {
      if (!this.view) {
        this.current = index
        this.$refs.fileModel.showMoel()
      }
    },
    setData(data) {
      this.selectForm.group = data
    },
    getData() {
      const result = []
      this.selectForm.group.forEach((item) => {
        if (item.file.name) {
          result.push(item)
        }
      })
      return result
    },
    fileOk(data) {
      if (this.current !== null) {
        this.selectForm.group[this.current].file = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-select-container {
  width: 600px;
  & /deep/ .el-form-item__label {
    color: #889099;
  }
}
</style>
