<template>
  <div class="doc-view">
    <c-loading v-if="loading" tip="文档加载中"></c-loading>
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
          <c-tabs>
            <c-tab-panel title="参数">
              <json-view :store="api.params"></json-view>
            </c-tab-panel>
          </c-tabs>
          <c-tabs>
            <c-tab-panel title="返回结构">
              <json-view :store="api.resStructure"></json-view>
            </c-tab-panel>
          </c-tabs>
          <c-tabs v-if="api.description">
            <c-tab-panel title="描述">
              <div class="doc-md" v-html="getDesc(api)"></div>
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
      currentApi: null,
      loading: true
    }
  },
  computed: {
    ...mapState({
      groupList (state) {
        return state.api.groupList
      }
    })
  },
  beforeMount () {
    this.$store.dispatch(actions.api.queryGroup, this.$route.params.id).finally(() => {
      this.loading = false
    })
  },
  mounted () {
    setTimeout(() => {
      this.$refs.docList.scrollTop = 0
    })
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
