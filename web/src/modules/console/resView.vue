<template>
  <div class="res-view">
    <json-view :store="store" edit-mode></json-view>
  </div>
</template>

<script>
import Prism from 'prismjs'
import JsonView from '../../components/jsonView/index'
export default {
  name: 'resView',
  components: {JsonView},
  props: {
    structure: null
  },
  data () {
    return {
      store: this.structure
    }
  },
  watch: {
    response (res) {
      this.code = Prism.highlight(res, Prism.languages.json, 'json')
      this.$emit('input', res)
    }
  }
}
</script>

<style lang="sass">
@import "styles/res"
</style>
