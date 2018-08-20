<template>
  <el-dialog
    :title="isGroup ? '查看主机组' : '查看主机' "
    :visible.sync="dialogVisible"
    width="35%"
    class="pb-dialog add-host-dig">
    <div v-if="isGroup">
      <el-row>
        <el-col :span="24" style="padding-bottom: 10px;">
          <div class="abh-left">组名:</div>
          <div class="abh-right">{{ form.name }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 10px;">
          <div class="abh-left">描述:</div>
          <div class="abh-right">{{ form.description }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 10px;">
          <div class="abh-left">主机:</div>
          <div class="abh-right">
            <div v-for="item in form.hosts">
              {{ item.identity_ip }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-bottom: 10px;">
          <div class="abh-left">变量:</div>
          <div class="abh-right">
            <div v-for="gh in form.params">
              <span>字段 - {{ gh.name }}</span>
              <span>值 - {{ gh.value }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <div style="padding-bottom: 10px;">
        <div class="abh-left">主机名:</div>
        <div class="abh-right">{{ form.name }}</div>
      </div>
      <div v-if="form.business" style="padding-bottom: 10px;">
        <div class="abh-left">业务:</div>
        <div class="abh-right">{{ form.business }}</div>
      </div>
      <div v-if="form.site" style="padding-bottom: 10px;">
        <div class="abh-left">机房:</div>
        <div class="abh-right">{{ form.site }}</div>
      </div>
      <div v-if="form.cabinet" style="padding-bottom: 10px;">
        <div class="abh-left">机柜:</div>
        <div class="abh-right">{{ form.cabinet }}</div>
      </div>
      <div v-if="form.identity_ip" style="padding-bottom: 10px;">
        <div class="abh-left">内网IP:</div>
        <div class="abh-right">{{ form.identity_ip }}</div>
      </div>
      <div v-if="form.os" style="padding-bottom: 10px;">
        <div class="abh-left">操作系统:</div>
        <div class="abh-right">{{ form.os }}</div>
      </div>
      <div v-if="form.machine" style="padding-bottom: 10px;">
        <div class="abh-left">宿主机:</div>
        <div class="abh-right">{{ form.machine }}</div>
      </div>
      <div v-for="kp in form.others" style="padding-bottom: 10px;">
        <div class="abh-left">{{ kp.key_cn }}:</div>
        <div class="abh-right">{{ kp.value }}</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getEditGroups, getHostView } from '@/api/resouce/resouces/host'
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
        isGroup: false,
        hostList: [],
        userarry: [],
        isEditId: '',
        marry: []
      }
    },
    computed: {
      ...mapGetters([
        'repository'
      ])
    },
    created() {
      console.log(123)
    },
    methods: {
      doCreate(flag, item) {
        this.dialogVisible = true
        this.form = Object.assign({}, formData)
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.isGroup = flag
        this.marry = item
        if (flag) {
          this.reviewGroup()
        } else {
          this.reviewHost()
        }
      },
      reviewGroup() {
        getEditGroups(this.marry.id).then(response => {
          this.form = response
        }).catch(error => {
          Message.error(error)
        })
      },
      reviewHost() {
        getHostView(this.marry.id).then(response => {
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
    width: 80px;
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