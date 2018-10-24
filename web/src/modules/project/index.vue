<template>
  <div class="project-detail">
    project detail
  </div>
</template>

<script>
import {actions} from '../../store/constants'
export default {
  name: 'projectDetail',
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
