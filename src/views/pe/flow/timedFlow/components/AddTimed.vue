<template>
  <el-dialog :title="title" :visible="show" :show-close="false" :width="'800px'"
    @open="handleOpen" @close="handleClose">
    <el-form :label-position="'left'" label-width="90px" size="small">
      <el-row>
        <el-col :span="14">
          <el-form-item label="定时流程名">
            <el-input v-model="form.name" placeholder="请输入" :disabled="type !== 'add'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="14">
          <el-form-item label="描述">
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
            <div v-show="form.timed_type === 'timed'">
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

      <el-row v-show="form.timed_type === 'cycle'">
        <el-col>
          <el-form-item label="定时配置">
            <el-radio-group v-model="form.timed_config">
              <el-radio v-for="(item, index) in Object.keys(timed_config_map)" :key="index" :label="item">{{timed_config_map[item]}}</el-radio>
            </el-radio-group>
            <div v-show="form.timed_config === 'check'">
              <choose-timed ref="chooseTimed"></choose-timed>
            </div>
            <div v-show="form.timed_config !== 'check'">
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

import { createTimedApi } from '@/api/pe/flowManage/timedFlow'

export default {
  props: {
    type: String,
    data: Object,
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
      }
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
        this.initEdit()
      }
      console.log('open callback ' + this.type)
    },
    handleClose() {
      console.log('close callback ')
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

      this.$refs.chooseTimed.reset()
      this.$refs.customTimed.reset()

      this.show = false
    },
    submit() {
      let express = ''
      if (this.form.timed_config === 'check') {
        express = this.$refs.chooseTimed.getExpress()
      } else {
        express = this.$refs.customTimed.getExpress()
      }
      if (this.type === 'add') {
        const data = {
          id: this.data.id,
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
      }
    }
  }
}
</script>
