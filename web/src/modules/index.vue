<template>
  <div class="index">
    <router-view/>
  </div>
</template>

<script>
import {router} from '../router/constants'
import {actions} from '../store/constants'
export default {
  name: 'layout',
  data () {
    return {
      msg: 'index'
    }
  },
  beforeCreate () {
    // 检查登录状态
    if (![router.login, router.register].includes(this.$route.name)) {
      this.$store.dispatch(actions.user.getUser).catch(err => {
        this.$router.push({
          name: router.login
        })
        console.error('用户未登录', err)
      })
    }
  }
}
</script>

<style lang="sass">
.index
  width: 100%
  height: 100%
</style>
