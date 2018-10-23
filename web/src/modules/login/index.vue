<template>
  <div class="login">
    <span class="brand">CleverMock</span>
    <div class="form-panel">
      <div class="title">登录</div>
      <c-input size="big" v-model="username" autoFocus clear-able placeholder="用户名或邮箱"/>
      <c-input size="big" v-model="password" type="password" placeholder="密码"/>
      <c-button size="large" type="primary" @click="onLogin">登录</c-button>

      <div class="ref-links">
        还没有账号？立即<a href="">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {router} from '../../router/constants'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    onLogin () {
      this.$store.dispatch(actions.user.login, {
        username: this.username,
        password: this.password
      }).then(() => {
        this.$router.replace({
          name: router.project.manage
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '用户名或密码错误'
        })
        console.error('登录失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
