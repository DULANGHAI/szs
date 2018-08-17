<template>
  <div class="page-config">
    <Breadcrumb></Breadcrumb>

    <div class="container-title">
      系统配置
    </div>

    <div class="container-body-wrap">
      <el-form
        ref="form"
        :model="form"
        label-width="130px"
        label-position="right"
      >
        <div class="module">
          <h3>审批配置</h3>
          <el-form-item label="任务审批最低等级">
            <el-select v-model="form.rate" placeholder="请选择脚本">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="脚本提交审批">
            <el-switch v-model="form.switch1"></el-switch>
          </el-form-item>
          <el-form-item label="软件包库提交审批">
            <el-switch v-model="form.switch2"></el-switch>
          </el-form-item>
          <el-form-item label="配置库提交审批">
            <el-switch v-model="form.switch3"></el-switch>
          </el-form-item>
        </div>

        <div class="module line">
          <el-row>
            <el-col :span="3">
              <h3>业务集群配置</h3>
            </el-col>
            <el-col :span="6" :offset="15">
              <el-button>添加</el-button>
              <el-button>删除</el-button>
              <el-button>编辑</el-button>
            </el-col>
          </el-row>

          <el-table
            ref="table"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%; margin-top: 30px"
            empty-text="暂无数据"
            v-loading.body="tableLoading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column width="180" prop="name" label="集群名称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
          </el-table>
        </div>

        <div class="module" style="margin-top: 40px">
          <h3>告警配置</h3>
          <el-form-item label="日常检查告警">
            <el-switch v-model="form.switch4"></el-switch>
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item label="异常事件">
                <el-checkbox-group v-model="form.exceptionEvent">
                  <el-checkbox label="短信" name="exceptionEvent"></el-checkbox>
                  <el-checkbox label="邮件" name="exceptionEvent"></el-checkbox>
                  <el-checkbox label="微信" name="exceptionEvent"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="告警人">
                <el-select v-model="form.person">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="风险事件">
                <el-checkbox-group v-model="form.riskEvent">
                  <el-checkbox label="短信" name="riskEvent"></el-checkbox>
                  <el-checkbox label="邮件" name="riskEvent"></el-checkbox>
                  <el-checkbox label="微信" name="riskEvent"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="告警人">
                <el-select v-model="form.person">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <el-row>
            <el-col :span="4">
              <el-form-item label="定时作业告警">
                <el-switch v-model="form.switch5"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="告警方式">
                <el-checkbox-group v-model="form.warnType">
                  <el-checkbox label="短信" name="warnType"></el-checkbox>
                  <el-checkbox label="邮件" name="warnType"></el-checkbox>
                  <el-checkbox label="微信" name="warnType"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <el-row>
            <h3>交易时段配置</h3>
            <el-col>
              <el-form-item label="交易时段运维审批">
                <el-switch v-model="form.switch6"></el-switch>
              </el-form-item>
            </el-col>
           <br>
            <span style="display:inline-block;margin-right:50px;">交易时段</span>
             <el-time-picker
              is-range
              v-model="form.value4"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>   
          </el-row>
        </div>
      </el-form>
    </div>

    <div class="btn-group">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { cpostsysconfigs, getsysconfigs } from '@/api/systemManage/system.js'

export default {
  name: 'config',
  components: {
    Breadcrumb
  },
  data() {
    return {
      tableData: [],
      name: '',
      description: '',
      tableLoading: false,
      form: {
        rate: '',
        switch1: false,
        switch2: false,
        switch3: false,
        switch4: false,
        switch5: false,
        switch6: false,
        exceptionEvent: [],
        riskEvent: [],
        warnType: [],
        person: '',
        value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
      }
    }
  },
  mounted() {
    getsysconfigs().then(res => {
      // 渲染业务集群配置
      // console.log(res.business_config,'业务集群配置')
      this.tableData = res.business_config
      // 渲染审批配置
      console.log(res.approve_config, '审批配置')
      this.form.switch1 = res.script_on
      this.form.switch2 = res.software_on
      this.form.switch3 = res.config_on

      console.log(res, '成功')
    }).catch(res => {
      console.log('失败', '2')
    })
  },
  created() {
    this.tableData = [
      // {
      //   name: "上证云",
      //   describe:
      //     "这是一段很长的文案很长很长的文案很长的很长很长很长很长的很长很长很长很长的很长很长很长很长的很上证云计算集群"
      // },
      // {
      //   name: "LDDS",
      //   describe: "LDDS计算集群"
      // },
      // {
      //   name: "LDDS",
      //   describe: "LDDS计算集群"
      // },
      // {
      //   name: "LDDS",
      //   describe: "LDDS计算集群"
      // }
    ]
    // for(let i=0;i<this.tableData.length;i++){
    //   return this.tableData[i].name; this.tableData[i].description
    // }
    // name =  this.tableData[i].name;
    // description = this.tableData[i].description;
  },
  methods: {
    // for(let i=0;i<this.tableData.length;i++){
    //   return this.tableData[i].name
    // },
    handleSelectionChange(val) {
      console.log(val)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          cpostsysconfigs({
            business_config: [
              {
                name: 'LDD',
                description: 'lDDsedfsfs'
              }
            ],
            approve_config: {
              level: this.form.rate,
              script_on: this.form.switch1,
              software_on: this.form.switch2,
              config_on: this.form.switch3
            },
            alarm_config: [
              {
                alarm_to: '张三',
                type: '日常检查',
                alarm_by: 'wechat, email',
                alarm_on: this.form.switch4,
                name: '风险事件'
              },
              {
                alarm_to: '张三',
                type: '日常检查',
                alarm_by: 'wechat, email',
                alarm_on: 1,
                name: '异常事件'
              },
              {
                alarm_to: '张三',
                type: '定时作业',
                alarm_by: 'wechat, email',
                alarm_on: 0,
                name: null
              }

            ],
            exchange_config: {
              start_time: '08:40:00',
              is_on: 0,
              end_time: '09:00:00'
            }
          }).then(res => {
            this.form.switch1 === false ? this.from.switch1 = '0' : this.from.switch1 = '1'
            this.form.switch2 === false ? this.from.switch2 = '0' : this.from.switch2 = '1'
            this.form.switch3 === false ? this.from.switch3 = '0' : this.from.switch3 = '1'
            this.form.switch4 === false ? this.from.switch4 = '0' : this.from.switch4 = '1'
            this.form.switch5 === false ? this.from.switch5 = '0' : this.from.switch5 = '1'
            this.form.switch6 === false ? this.from.switch6 = '0' : this.from.switch6 = '1'
            console.log(res, '1')
          }).catch(() => {
            console.log('失败', '2')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-config {
  .module {
    h3 {
      color: #333;
    }
    &.line,
    .line {
      border-top: 1px solid #e8e8e8;
      padding-top: 40px;
    }
  }

  .btn-group {
    margin: 0 0 60px 64px;
  }
}
</style>
