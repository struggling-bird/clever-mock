<template>
  <div class="group-dialog">
    <c-dialog title="创建分组" @confirm="onSubmit" @cancel="onCancel">
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
  data () {
    return {
      editor: null,
      name: '',
      reg: '',
      description: ''
    }
  },
  computed: {
    ...mapState({
      project (state) {
        return state.project.currentProject
      }
    }),
    form () {
      return {
        name: this.name,
        reg: this.reg,
        projectId: this.project.id
      }
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
      this.$store.dispatch(actions.api.addGroup, {
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
</style>
