<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :model="form" ref="form" :rules="rules" :label-position="'left'" label-width="100px" size="small">
      <el-row>
        <el-col :span="14">
          <el-form-item label="定时流程名" prop="name">
            <el-input v-model="form.name" placeholder="请输入" :disabled="type !== 'add'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="14">
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="定时类型">
            <el-radio-group v-model="form.timed_type">
              <el-radio v-for="(item, index) in Object.keys(timed_type_map)" :key="index" :label="item">{{timed_type_map[item]}}</el-radio>
            </el-radio-group>
            <div v-if="form.timed_type === 'timed'">
              <el-date-picker
                v-model="form.timed_date"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.timed_type === 'cycle'">
        <el-col>
          <el-form-item label="定时配置">
            <el-radio-group v-model="form.timed_config">
              <el-radio v-for="(item, index) in Object.keys(timed_config_map)" :key="index" :label="item">{{timed_config_map[item]}}</el-radio>
            </el-radio-group>
            <div v-if="form.timed_config === 'check'">
              <choose-timed ref="chooseTimed"></choose-timed>
            </div>
            <div v-if="form.timed_config !== 'check'">
              <custom-timed ref="customTimed"></custom-timed>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ChooseTimed from '@/views/pe/job/timedJob/components/ChooseTimed'
import CustomTimed from '@/views/pe/job/timedJob/components/CustomTimed'

import { createTimedApi, updateFlowApi } from '@/api/pe/flowManage/timedFlow'

export default {
  props: {
    type: String,
    data1: Object, // 创建
    data2: Object, // 编辑
    refresh: Function
  },
  components: {
    ChooseTimed,
    CustomTimed
  },
  data() {
    this.timed_type_map = {
      cycle: '周期',
      timed: '定时'
    }
    this.timed_config_map = {
      check: '勾选',
      custom: '自定义'
    }
    return {
      show: false,
      form: {
        name: '',
        description: '',
        timed_type: 'cycle',
        timed_config: 'check',
        timed_date: '',
        timed_expression: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入定时流程名', trigger: ['blur', 'change'] }
        ],
        timed_type: [
          { required: true, message: '请选择定时类型', trigger: ['blur', 'change'] }
        ],
        timed_config: [
          { required: true, message: '请选择定时配置', trigger: ['blur', 'change'] }
        ]
      },
      data: null
    }
  },
  computed: {
    title() {
      if (this.type === 'edit') {
        return '定时流程配置'
      } else {
        return '添加定时流程'
      }
    }
  },
  methods: {
    showMoel() {
      this.show = true
    },
    hideModel() {
      this.show = false
    },
    handleOpen() {
      if (this.type !== 'add') {
        this.data = this.data2
        this.initEdit()
      } else {
        this.data = this.data1
      }
    },
    handleClose() {
    },
    initEdit() {
      // 编辑时，已经选的作业和定时作业名不能更改
      // 赋值
      this.form = {
        name: this.data.name,
        description: this.data.description,
        timed_type: this.data.timed_type,
        timed_config: this.data.timed_config,
        timed_date: this.data.timed_date,
        timed_expression: this.data.timed_expression
      }
      this.$nextTick(() => {
        if (this.data.timed_config === 'check') {
          this.$refs.chooseTimed.setExpress(this.data.timed_expression)
        } else {
          this.$refs.customTimed.setExpress(this.data.timed_expression)
        }
      })
    },
    cancel() {
      this.form = {
        name: '',
        description: '',
        timed_type: 'cycle',
        timed_config: 'check',
        timed_date: '',
        timed_expression: ''
      }

      this.$refs.chooseTimed && this.$refs.chooseTimed.reset()
      this.$refs.customTimed && this.$refs.customTimed.reset()

      this.$refs.form.resetFields()

      this.show = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.timed_type === 'timed' && !this.form.timed_date) {
            this.$message.error('日期不能为空')
            return
          }

          let express = ''
          if (this.form.timed_config === 'check') {
            express = this.$refs.chooseTimed.getExpress()
          } else {
            express = this.$refs.customTimed.getExpress()
          }
          if (this.form.timed_type === 'cycle' && (express === '* * * * *' || express === '')) {
            this.$message.error('表达式不能为空')
            return
          }
          if (this.type === 'add') { // 创建
            const data = {
              process_id: this.data.id,
              name: this.form.name,
              description: this.form.description,
              timed_type: this.form.timed_type,
              timed_config: this.form.timed_config,
              timed_date: this.form.timed_date,
              timed_expression: express
            }
            if (data.timed_type === 'cycle') {
              data.timed_date = ''
            } else {
              data.timed_expression = ''
            }
            createTimedApi(data).then(() => {
              this.refresh(1)
              this.cancel()
            })
          } else { // 更新
            const temp = this.deleteAttr(this.data.scheduling)
            const data = {
              scheduling: JSON.stringify(temp),
              description: this.form.description,
              timed_expression: this.form.timed_expression,
              timed_date: this.form.timed_date,
              timed_type: this.form.timed_type,
              timed_config: this.form.timed_config
            }
            if (data.timed_type === 'cycle') {
              data.timed_date = ''
            } else {
              data.timed_expression = ''
            }
            updateFlowApi(this.data.id, data).then(() => {
              this.cancel()
              this.refresh()
            })
          }
        }
      })
    },
    deleteAttr(obj) {
      const objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && key !== '_expanded' && key !== '_level' && key !== '_show' && key !== 'parent') {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deleteAttr(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
    }
  }
}
</script>

<style lang="scss" scoped>
.up-to-previous {
  margin-top: -20px;
}
</style>
