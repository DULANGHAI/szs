<template>
  <div class="tabs-contents">
    <div style="padding-bottom: 30px;border-bottom:1px solid #ddd;margin-bottom:30px;">
      <el-row style="padding-bottom: 15px;">
        <el-col :span="10">
          提交HASH: {{ hashid }}
        </el-col>
        <el-col :span="10">
          提交人: {{ hashuser }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          提交说明: {{ hashtitle }}
        </el-col>
      </el-row>
    </div>
    <div v-for="(item, index) in ftstr" style="margin-bottom:20px;">
      <div class="diff-content-header">
        <svg-icon icon-class="wenjian" /> {{ item.new_path }}
      </div>
      <code-diff :old-string="item.old_content" outputFormat="side-by-side" :new-string="item.new_content" :context="5" />
    </div>
  </div>
</template>

<script>
  import { getReviewDiff } from '@/api/resouce/versionLibrary/review'
  import CodeDiff from 'vue-code-diff'

  const formData = {
    'name': ''
  }
  export default {
    props: ['project_id', 'fid', 'branch', 'hashdiff_title', 'hashdiff_user'],
    components: {
      CodeDiff
    },
    data() {
      return {
        dialogVisible: false,
        ftstr: [],
        hashid: '',
        form: JSON.parse(JSON.stringify(formData))
      }
    },
    created() {
      this.temDiff()
      this.hashid = this.$props.fid
      this.hashtitle = this.$props.hashdiff_title
      this.hashuser = this.$props.hashdiff_user
    },
    methods: {
      temDiff() {
        const params = {
          'branch': this.$props.branch
        }
        getReviewDiff(this.$props.project_id, this.$props.fid, params).then(response => {
          this.ftstr = response
        })
      }
    }
  }
</script>