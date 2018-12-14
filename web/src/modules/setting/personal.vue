<template>
  <div class="personal-setting">
    <form-item label="姓名">
      <c-input autoFocus :width="230" clearAble v-model="name"/>
    </form-item>
    <form-item label="邮箱">
      <c-input :width="230" clearAble v-model="email"/>
    </form-item>
    <form-item label="微信">
      <c-input :width="230" clearAble v-model="wechat"/>
    </form-item>
    <form-item label="密码">
      <c-input :width="230" clearAble type="password" v-model="password"/>
    </form-item>
    <form-item label="确认密码" v-if="password">
      <c-input :width="230" clearAble type="password" v-model="repassword"/>
    </form-item>
    <c-button size="normal" class="btn-save" type="primary" @click="onSave">保存</c-button>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
export default {
  name: 'personal-setting',
  components: {FormItem},
  data () {
    return {
      name: '',
      password: '',
      repassword: '',
      email: '',
      wechat: ''
    }
  },
  computed: {
    ...mapState({
      currentUser (state) {
        let user = state.user.user
        this.name = user.name
        this.email = user.email
        this.wechat = user.wechat
        return user
      }
    }),
    form () {
      let param = {
        id: this.currentUser.id,
        name: this.name,
        email: this.email,
        wechat: this.wechat
      }
      if (this.password && this.password === this.repassword) {
        param.password = this.password
      }
      return param
    }
  },
  watch: {
    currentUser () {}
  },
  methods: {
    onSave () {
      if (this.password && this.password !== this.repassword) {
        this.$message({
          type: 'error',
          message: '两次密码输入不一致'
        })
        return
      }
      this.$store.dispatch(actions.user.update, this.form).then(() => {
        this.$message({
          message: '保存成功'
        })
      }).catch(err => {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
        console.error('保存用户信息失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/personal"
</style>
