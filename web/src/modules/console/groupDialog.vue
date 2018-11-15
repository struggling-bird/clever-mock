<template>
  <div class="group-dialog">
    <c-dialog :title="group ? '编辑分组' : '创建分组'" :showFoot="false">
      <form-item label="名称">
        <c-input :width="300" v-model="name"/>
      </form-item>
      <form-item label="匹配规则">
        <c-input :width="300" v-model="reg"/>
      </form-item>
      <form-item label="描述">
        <div class="group-desc">
          <textarea ref="desc" v-model="description"></textarea>
        </div>
      </form-item>
      <div class="btns">
        <c-button type="danger" v-if="group" @click="onDel">删除</c-button>
        <c-button @click="onCancel">取消</c-button>
        <c-button type="primary" @click="onSubmit">确定</c-button>
      </div>
    </c-dialog>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
import SimpleMDE from 'simplemde'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
export default {
  name: 'groupDialog',
  components: {FormItem},
  props: {
    group: null
  },
  data () {
    let data = {
      editor: null,
      name: '',
      reg: '',
      description: ''
    }
    if (this.group) {
      data.name = this.group.name
      data.reg = this.group.reg
      data.description = this.group.description
    }
    return data
  },
  computed: {
    ...mapState({
      project (state) {
        return state.project.currentProject
      }
    }),
    form () {
      let form = {
        name: this.name,
        reg: this.reg,
        projectId: this.project.id
      }
      if (this.group) {
        form.id = this.group.id
      }
      return form
    }
  },
  mounted () {
    this.editor = new SimpleMDE({
      element: this.$refs.desc,
      autofocus: true
    })
  },
  methods: {
    onSubmit () {
      this.$store.dispatch(this.group ? actions.api.updateGroup : actions.api.addGroup, {
        ...this.form,
        description: this.editor.value()
      }).then(() => {
        this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
        this.$emit('submit')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '提交失败，请重试'
        })
        console.error('添加分组失败', err)
      })
    },
    onCancel () {
      this.$emit('cancel')
    },
    onDel () {
      this.$store.dispatch(actions.api.delGroup, {
        id: this.group.id,
        projectId: this.group.projectId
      }).then(() => {
        this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
        this.$emit('del')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '删除分组失败'
        })
        console.error('删除分组失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
.group-dialog
  .c-dialog
    width: 700px
  .group-desc
    display: inline-block
    width: 550px
  textarea
    width: 300px
    height: 150px
  .btns
    text-align: right
    .c-button
      margin-left: 10px
</style>
