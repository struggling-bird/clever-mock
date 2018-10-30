<template>
  <div class="api-detail">
    <div class="url-line">
      <c-selector
          class="method-select"
          size="big"
          :width="80"
          :store="methodList"
          v-model="methodName"
          label-field="name"
          keyField="name">
      </c-selector>
      <c-input class="url-input"
               v-model="url"
               :width="400"
               clearAble
               autoFocus
               size="big"
               placeholder="URL"/>
      <c-selector :store="runTypeList"
                  class="run-type-select"
                  v-model="runType"
                  :width="120"
                  size="big"
                  keyField="name"
                  labelField="name"></c-selector>
      <c-button size="large" type="primary" theme="border" v-if="runType.name === 'test'">发送</c-button>
      <c-button size="large" type="primary">保存</c-button>
    </div>

    <div class="api-config">
      <pre class="language-json">
        <code v-html="responseCode"></code>
      </pre>
    </div>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import Prism from 'prismjs'
export default {
  name: 'apiDetail',
  props: {
    apiId: null
  },
  data () {
    return {
      methodName: {name: 'get'},
      methodList: ['get', 'post', 'delete', 'put'].map(name => {
        return {name: name}
      }),
      runTypeList: ['staticMock', 'scriptMock', 'proxy', 'auto', 'test'].map(type => {
        return {name: type}
      }),
      runType: {name: 'proxy'},
      url: '',
      params: [],
      response: '',
      responseCode: '',
      description: '',
      api: null
    }
  },
  computed: {
    ...mapState({
      ready (state) {
        return state.api.ready.current
      }
    })
  },
  mounted () {
    this.getById()
  },
  watch: {
    apiId () {
      this.getById()
    },
    response (text) {
      this.responseCode = Prism.highlight(text, Prism.languages.json, 'json')
      console.log(Prism)
    }
  },
  methods: {
    getById () {
      this.$store.dispatch(actions.api.getById, this.apiId).then(api => {
        this.api = api
        this.methodName = {name: api.method.toLowerCase()}
        this.runType = {name: api.runStyle}
        this.url = api.path
        this.response = api.mockData
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
