<template>
  <div class="console-top">
    <span class="logo">cleverMock</span>
    <span class="project-name">{{project.name}}</span>

    <div class="tab-bar">
      <span :class="{'btn-tab': true, active: mode === 'dev'}"
            @click="redirect('dev')"><i class="mock-tiaoshi"></i>开发模式</span>
      <span :class="{'btn-tab': true, active: mode === 'doc'}"
            @click="redirect('doc')"><i class="mock-wendang"></i>文档模式</span>
    </div>

    <span class="logout" @click="onLogout">
      {{user.name}}<i class="mock-logout"></i>
    </span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {actions} from '../../store/constants'
import {router} from '../../router/constants'
export default {
  name: 'consoleTop',
  data () {
    return {
      mode: this.$route.params.mode || 'dev' // dev doc
    }
  },
  computed: {
    ...mapState({
      user (state) {
        return state.user.user || {}
      },
      project (state) {
        return state.project.currentProject || {}
      }
    })
  },
  watch: {
    '$route' (route) {
      this.mode = route.params.mode
    }
  },
  methods: {
    redirect (mode) {
      if (mode === this.mode) return
      this.$router.push({
        name: this.$route.name,
        params: {
          id: this.$route.params.id,
          mode: mode
        }
      })
    },
    onLogout () {
      this.$store.dispatch(actions.user.logout).then(() => {
        this.$router.push({
          name: router.login
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '退出账号失败'
        })
        console.error('退出账号失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/top"
</style>
