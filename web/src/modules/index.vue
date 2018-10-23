<template>
  <div class="index">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data () {
    return {
      msg: 'index'
    }
  },
  beforeCreate () {
    // 检查登录状态
  }
}
</script>

<style lang="sass">
.index
  width: 100%
  height: 100%
</style>
