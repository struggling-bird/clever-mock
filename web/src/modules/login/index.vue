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
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
