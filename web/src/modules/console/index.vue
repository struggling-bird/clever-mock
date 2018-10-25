<template>
  <div class="console-index">
    <console-top></console-top>
    <div class="console-center">
      <router-view/>
    </div>
  </div>
</template>

<script>
import ConsoleTop from './top'
import {actions} from '../../store/constants'
export default {
  name: 'consoleIndex',
  components: {ConsoleTop},
  data () {
    return {
      msg: 'index'
    }
  },
  beforeCreate () {
    this.$store.dispatch(actions.project.getById, this.$route.params.id)
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
