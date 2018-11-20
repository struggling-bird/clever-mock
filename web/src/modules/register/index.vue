<template>
  <div class="register">
    <div class="reg_">
      <form-item label="用户名">
        <c-input :width="260" clearAble autoFocus v-model="form.name"/>
      </form-item>
      <form-item label="密码">
        <c-input type="password" :width="260" v-model="form.password"/>
      </form-item>
      <form-item label="邮箱">
        <c-input :width="260" v-model="form.email"/>
      </form-item>
      <c-button class="btn-reg" type="primary" size="normal" @click="onReg">注册</c-button>
    </div>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
import {actions} from '../../store/constants'
import {router} from '../../router/constants'
export default {
  name: 'index',
  components: {FormItem},
  data () {
    return {
      form: {
        name: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    onReg () {
      this.$store.dispatch(actions.user.addUser, this.form).then(() => {
        this.$router.replace({
          name: router.login
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '注册失败'
        })
        console.error('注册失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
