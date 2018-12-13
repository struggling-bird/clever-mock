<template>
  <div class="res-view">
    <json-view :store="store" edit-mode @change="onChange"></json-view>
  </div>
</template>

<script>
import JsonView from '../../components/jsonView/index'
import {util} from '../../util'
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
  methods: {
    onChange (json) {
      this.$emit('change', json ? util.clone(json) : null)
    }
  }
}
</script>

<style lang="sass">
@import "styles/res"
</style>
