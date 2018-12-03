<template>
  <div class="console-top">
    <span class="logo" @click="toIndex">cleverMock</span>
    <span class="project-name">{{project.name}}</span>

    <div class="tab-bar">
      <span :class="{'btn-tab': true, active: mode === 'dev'}"
            @click="redirect('dev')"><i class="mock-tiaoshi"></i>开发模式</span>
      <span :class="{'btn-tab': true, active: mode === 'doc'}"
            @click="redirect('doc')"><i class="mock-wendang"></i>文档模式</span>
      <span :class="{'btn-tab': true, active: mode === 'setting'}"
            @click="redirect('setting')">
        <i class="mock-setting"></i>设置
      </span>
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
    let arr = this.$route.name.split('-')
    return {
      mode: arr[arr.length -1]
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
      let arr = route.name.split('-')
      this.mode = arr[arr.length - 1]
    }
  },
  methods: {
    redirect (mode) {
      if (mode === this.mode) return
      this.$router.push({
        name: router.console[mode],
        params: {
          id: this.$route.params.id
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
    },
    toIndex () {
      this.$router.push({
        name: router.project.manage
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/top"
</style>
