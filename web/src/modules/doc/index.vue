<template>
  <div class="visit-view">
    <h1>接口文档</h1>
    <doc-view></doc-view>
  </div>
</template>

<script>
import DocView from '../console/docView'
export default {
  name: 'index',
  components: {DocView},
  data () {
    return {
      msg: 'index'
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
