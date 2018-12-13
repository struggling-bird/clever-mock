<template>
  <div class="param-view">
    <json-view :store="store" edit-mode @change="onChange"></json-view>
  </div>
</template>

<script>
import {util} from '../../util'
import JsonView from '../../components/jsonView/index'
export default {
  name: 'paramView',
  components: {JsonView},
  props: {
    store: null
  },
  data () {
    return {}
  },
  methods: {
    onChange (json) {
      this.$emit('change', json ? util.clone(json) : null)
    }
  }
}
</script>

<style lang="sass">
@import "styles/param"
</style>
