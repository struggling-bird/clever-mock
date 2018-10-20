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
  }
}
</script>

<style lang="sass">
.index
  width: 100%
  height: 100%
</style>
