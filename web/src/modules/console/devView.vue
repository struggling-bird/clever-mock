<template>
  <div class="dev-view">
    <div class="api-list-panel">
      <c-input class="api-search"
               :width="310"
               v-model="filter"
               clearAble
               placeholder="搜索"
               icon="mock-search"/>
      <div class="ctl-panel">
        <i class="btn-sort mock-sort-alpha-desc"></i>
        <i class="btn-add mock-wenjianjia" @click="onAddGroup"></i>
      </div>
      <div class="api-list">
        <ul class="group" v-for="group in groupList" :key="group.id">
          <li class="group-title">
            <i class="mock-folder"></i>
            <i class="btn-add mock-add" @click="addApi(group)"></i>
            <span class="desc">{{group.name}}</span>
          </li>
          <li v-for="api in group.apiList"
              :key="api.id"
              :class="{api: true, active: currentApi === api}"
              v-if="apiVisible(api)"
              @click="currentApi = api">
            <c-tooltip :content="api.path" placement="right">
              <span class="url">{{pathFormat(api.name || api.path)}}</span>
            </c-tooltip>
            <span :class="{method: true, [api.method.toLowerCase()]: true}">{{api.method}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="api-detail-panel">
      <api-detail v-if="currentApi" :api-id="currentApi.id"></api-detail>
      <div v-else class="empty-tip">
        api引导页
      </div>
    </div>
    <group-dialog v-if="showCreateGroup" @submit="showCreateGroup = false" @cancel="showCreateGroup = false"></group-dialog>
  </div>
</template>

<script>
import ApiDetail from './api'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import {util} from '../../util'
import GroupDialog from './groupDialog'
export default {
  name: 'devView',
  components: {GroupDialog, ApiDetail},
  data () {
    return {
      filter: '',
      currentApi: null,
      showCreateGroup: false
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
        beginLength: 12,
        endLength: 15,
        replaceStr: '...'
      })
    },
    apiVisible (api) {
      const filter = this.filter.trim().toLowerCase()
      if (filter) {
        return new RegExp(filter).test(api.path.toLowerCase())
      } else {
        return true
      }
    },
    addApi (group) {
      console.log('add api in group: ', group)
    },
    onAddGroup () {
      this.showCreateGroup = true
    }
  }
}
</script>

<style lang="sass">
@import "styles/devView"
</style>
