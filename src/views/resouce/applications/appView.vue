<template>
  <el-dialog
    title="应用实例详情"
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog add-host-dig">
    <div>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">实例名称:</div>
          <div class="abh-right">{{ form.instance_name }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">实例介绍:</div>
          <div class="abh-right">{{ form.instance_description }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">状态:</div>
          <div class="abh-right">
            <span v-if="form.instance_status === 1">新建</span>
            <span v-else-if="form.instance_status === 2" style="color:#FAAD14">已修改</span>
            <span v-else-if="form.instance_status === 3" style="color:#52C41A">已发布</span>
            <span v-else-if="form.instance_status === 4" style="color:#F5222D">已下线</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">应用:</div>
          <div class="abh-right">{{ form.name }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">版本:</div>
          <div class="abh-right">{{ form.version }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">应用类型:</div>
          <div class="abh-right">{{ form.type }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">开发语言:</div>
          <div class="abh-right">{{ form.language }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">创建人:</div>
          <div class="abh-right">{{ form.creator }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">修改时间:</div>
          <div class="abh-right">{{ form.updated_at }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">软件包库:</div>
          <div class="abh-right">{{ form.sw_package_repository }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">配置文件库:</div>
          <div class="abh-right">{{ form.cfg_file_repository }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">IP:</div>
          <div class="abh-right">
            <span v-for="(item, index) in form.host_ips" :key="index">{{ form.host_ips[index] }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 15px;">
          <div class="abh-left">变量:</div>
          <div class="abh-right">
            <span v-for="(item, index) in form.parameters" :key="index">{{ form.parameters[index] }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getApplicationDetail } from '@/api/resouce/applications/application'
  import { Message } from 'element-ui'

  const formData = {
    'name': ''
  }
  export default {
    props: ['pid'],
    data() {
      return {
        dialogVisible: false,
        form: JSON.parse(JSON.stringify(formData)),
        isAppId: ''
      }
    },
    computed: {
      ...mapGetters([
        'repository'
      ])
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.isAppId = item.id
        this.reviewAppDetail()
      },
      reviewAppDetail() {
        getApplicationDetail(this.isAppId).then(response => {
          this.form = response
        }).catch(error => {
          Message.error(error)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .add-host-dig .abh-left{
    width: 90px;
    font-weight: 600;
    display: inline-block;
    text-align: right;
    vertical-align: top;
    padding-right: 10px;
  }
  .add-host-dig .abh-right{
    display: inline-block;
  }
</style>