<template>
  <div class="project-manage">
    <span class="brand">cleverMock</span>
    <div class="title-panel">
      <div class="title">项目列表</div>
      <c-button type="primary" size="large" @click="onCreateProject">创建项目</c-button>
    </div>
    <div class="project-list">
      <div class="project-item"
           v-for="project in projectList"
           :key="project.id" @click="onClickProject(project)">
        <div class="project-logo">
          <i class="mock-package"></i>
          <span class="project-status running"></span>
        </div>
        <div class="project-desc">
          <c-tooltip placement="right" content="项目名称">{{project.name}}</c-tooltip><br/>
          <c-tooltip placement="right" content="创建人">{{project.username}}</c-tooltip><br/>
          <c-tooltip placement="right" content="创建时间">{{timeFormat(project.createTime)}}</c-tooltip>
        </div>
      </div>

      <c-loading v-if="loading"></c-loading>
      <c-reload v-if="queryField" @reload="query"></c-reload>
      <div v-if="!loading && !queryField && !projectList.length" class="empty-tip">暂无数据</div>
    </div>
  </div>
</template>

<script>
import {router} from '../../router/constants'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import {util} from '../../util'
export default {
  name: 'projectManage',
  computed: {
    ...mapState({
      projectList (state) {
        return state.project.list
      },
      queryField (state) {
        return state.project.error.list
      },
      loading (state) {
        return !state.project.ready.list
      }
    })
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.$store.dispatch(actions.project.query)
    },
    onCreateProject () {
      this.$router.push({
        name: router.project.create
      })
    },
    onClickProject (project) {
      this.$router.push({
        name: router.console.index,
        params: {
          id: project.id
        }
      })
    },
    timeFormat (time) {
      let date = new Date(time)
      return util.dateFormat(date) + ' ' + util.timeFormat(date, 'hh:mm')
    }
  }
}
</script>

<style lang="sass">
@import "styles/manage"
</style>
