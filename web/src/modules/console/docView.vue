<template>
  <div class="doc-view">
    <div class="doc-guide">
      <tree-menu :store="groupList"
                 :onChoose="onClickApi"
                 width="300"
                 key-field="id"
                 children-field="apiList"
                 label="name"
                 alias-label="path"></tree-menu>
    </div>
    <div class="doc-main" ref="docList">
      <template v-for="group in groupList">
        <div v-for="api in group.apiList" :key="api.id"
             :class="{'api-doc': true, active: currentApi && currentApi.id === api.id}">
          <h3 :ref="api.id"># {{api.name || api.path}}</h3>
          <div class="api-url">
            <span class="api-method" :class="api.method.toLowerCase()">{{api.method}}</span>{{api.path}}
          </div>
          <c-tabs v-if="api.description">
            <c-tab-panel title="描述">
              <div class="doc-md" v-html="getDesc(api)"></div>
            </c-tab-panel>
          </c-tabs>
          <c-tabs>
            <c-tab-panel title="参数">
              {{api.params}}
            </c-tab-panel>
          </c-tabs>
          <c-tabs>
            <c-tab-panel title="返回结构">
              <json-view :store="api.resStructure"></json-view>
            </c-tab-panel>
          </c-tabs>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import JsonView from '../../components/jsonView/index'
import TreeMenu from '../../components/treeMenu/index'
import showDown from 'showdown'
export default {
  name: 'docView',
  components: {TreeMenu, JsonView},
  data () {
    return {
      currentApi: null
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
    onClickApi (api) {
      this.currentApi = api
      let ele = this.$refs[api.id][0]
      let docList = this.$refs.docList
      docList.scrollTop = ele.offsetTop - 130
    },
    getDesc (api) {
      let converter = new showDown.Converter({
        openLinksInNewWindow: true,
        emoji: true
      })
      converter.setFlavor('github')
      let md = converter.makeHtml(api.description)
      return md
    }
  }
}
</script>

<style lang="sass">
@import "styles/docView"
</style>
