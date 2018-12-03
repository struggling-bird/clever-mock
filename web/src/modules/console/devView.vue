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
            <span class="desc" @click="onEditGroup(group)">{{group.name}}</span>
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
      <api-detail v-if="currentApi || addApiMode"
                  @del="onDelApi"
                  @afterAdd="afterAdd"
                  :addMode="addApiMode"
                  :api-id="currentApi ? currentApi.id : null"></api-detail>
      <div v-else class="empty-tip">
        <span class="title">接入方式</span>
        <div class="section">
          <span class="desc">请求头信息中，增加：</span>
          <pre class="language-javascript">
            <code v-html="guideCode"></code>
          </pre>
        </div>
      </div>
    </div>
    <group-dialog v-if="showCreateGroup"
                  :group="currentGroup"
                  @del="showCreateGroup = false"
                  @submit="showCreateGroup = false"
                  @cancel="showCreateGroup = false"></group-dialog>
  </div>
</template>

<script>
import ApiDetail from './api'
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import {util} from '../../util'
import GroupDialog from './groupDialog'
import Prism from 'prismjs'
export default {
  name: 'devView',
  components: {GroupDialog, ApiDetail},
  data () {
    return {
      filter: '',
      currentApi: null,
      showCreateGroup: false,
      currentGroup: null,
      addApiMode: false
    }
  },
  computed: {
    ...mapState({
      groupList (state) {
        return state.api.groupList
      },
      project (state) {
        return state.project.currentProject || {}
      }
    }),
    guideCode () {
      return Prism.highlight(`clever-mock: '${this.project.secretKey}'`, Prism.languages.javascript, 'javascript')
    }
  },
  beforeCreate () {
    this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
    this.$store.dispatch(actions.project.queryProxyServer, this.$route.params.id)
  },
  methods: {
    afterAdd (api) {
      this.addApiMode = false
      this.currentApi = api
    },
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
    addApi () {
      this.currentApi = null
      this.addApiMode = true
    },
    onAddGroup () {
      this.showCreateGroup = true
    },
    onEditGroup (group) {
      this.currentGroup = group
      this.showCreateGroup = true
    },
    onDelApi () {
      this.currentApi = null
    }
  }
}
</script>

<style lang="sass">
@import "styles/devView"
</style>
