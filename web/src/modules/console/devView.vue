<template>
  <div class="dev-view">
    <div class="api-list-panel">
      <c-input class="api-search" :width="310" clearAble placeholder="搜索" icon="mock-search"/>
      <div class="ctl-panel">
        <i class="btn-sort mock-sort-alpha-desc"></i>
        <i class="btn-add mock-wenjianjia"></i>
      </div>
      <div class="api-list">
        <ul class="group" v-for="group in groupList" :key="group.id">
          <li class="group-title">
            <i class="mock-folder"></i>
            <i class="btn-add mock-add"></i>
            <span class="desc">{{group.name}}</span>
          </li>
          <li class="api" v-for="api in group.apiList" :key="api.id">
            <c-tooltip :content="api.path" placement="right">
              <span class="url">{{pathFormat(api.path)}}</span>
            </c-tooltip>
            <span class="method get">{{api.method}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="api-detail-panel">
      <api-detail></api-detail>
    </div>
  </div>
</template>

<script>
import ApiDetail from './api'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import {util} from '../../util'
export default {
  name: 'devView',
  components: {ApiDetail},
  data () {
    return {
      msg: 'develope'
    }
  },
  computed: {
    ...mapState({
      groupList (state) {
        return state.api.groupList
      }
    })
  },
  beforeCreate () {
    this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
  },
  methods: {
    pathFormat (path) {
      return util.strMiddleSplit(path, {
        maxLength: 30,
        beginLength: 10,
        endLength: 10,
        replaceStr: '...'
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/devView"
</style>
