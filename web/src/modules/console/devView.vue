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
        <tree-menu :store="groupList"
                   :onChoose="toEditApi"
                   width="300"
                   key-field="id"
                   children-field="apiList"
                   label="name"
                   alias-label="path">
          <div slot-scope="{node}" class="api-group">
            <i class="mock-folder"></i>
            <i class="btn-add mock-add" @click.stop="addApi(node)"></i>
            <span class="desc" @click.stop="onEditGroup(node)">{{node.name}}</span>
            </div>
        </tree-menu>
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
            clever-mock: '{{project.secretKey}}'
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
import TreeMenu from '../../components/treeMenu/index'
export default {
  name: 'devView',
  components: {TreeMenu, GroupDialog, ApiDetail},
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
    })
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
    },
    toEditApi (api) {
      this.currentApi = api
    }
  }
}
</script>

<style lang="sass">
@import "styles/devView"
</style>
