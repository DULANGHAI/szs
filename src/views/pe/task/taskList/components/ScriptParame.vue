<template>
  <div class="file-select-container">
    <el-form :model="selectForm" ref="selectForm" label-width="20px" size="small">
      <el-row v-for="(item, index) in selectForm.group" :key="index">
        <el-col :span="9">
          <el-form-item label="键" :prop="`group.${index}.key`">
            <el-input v-if="!view" v-model="item.key" placeholder="请输入"></el-input>
            <div v-if="view">{{item.key}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="值" :prop="`group.${index}.value`">
            <el-input v-if="!view"  v-model="item.value" placeholder="请输入"></el-input>
            <div v-if="view">{{item.value}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-show="!view">
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
        group: []
      },
      current: null
    }
  },
  methods: {
    addItems() {
      this.selectForm.group.push(
        {
          key: '',
          value: ''
        }
      )
    },
    deleteItem(index) {
      this.selectForm.group.splice(index, 1)
    },
    setData(data) {
      this.selectForm.group = data
    },
    getData() {
      const result = {}
      this.selectForm.group.forEach((item) => {
        if (item.key && !result[item.key]) {
          result[item.key] = item.value
        }
      })
      return result
    },
    reset() {
      this.selectForm = {
        group: [
          {
            key: '',
            value: ''
          }
        ]
      }
      this.current = null
      this.$refs.selectForm.resetField()
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
