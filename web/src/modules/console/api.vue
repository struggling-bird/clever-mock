<template>
  <div class="api-detail">
    <c-loading v-if="loading"></c-loading>
    <c-reload v-if="reload" @reload="getById"></c-reload>
    <template v-if="!loading && !reload">
      <c-input v-model="name" placeholder="接口名称" clearAble :width="300" style="margin-bottom: 20px"/><br/>
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
        <c-tabs cleanMode>
          <c-tab-panel title="参数结构">
            <param-view v-model="api.params"></param-view>
          </c-tab-panel>
          <c-tab-panel title="返回结构">
            <res-view v-model="api.resStructure"></res-view>
          </c-tab-panel>
          <c-tab-panel title="接口描述">
            <api-desc v-model="api.description"></api-desc>
          </c-tab-panel>
          <c-tab-panel title="mock数据">
            <mock-data></mock-data>
          </c-tab-panel>
          <c-tab-panel title="mock脚本">
            <mock-script></mock-script>
          </c-tab-panel>
        </c-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import ParamView from './paramView'
import ResView from './resView'
import ApiDesc from './styles/apiDesc'
import MockData from './mockData'
import MockScript from './mockScript'
export default {
  name: 'apiDetail',
  components: {MockScript, MockData, ApiDesc, ResView, ParamView},
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
      name: '',
      api: null,
      loading: true,
      reload: false
    }
  },
  mounted () {
    this.getById()
  },
  watch: {
    apiId () {
      this.getById()
    }
  },
  methods: {
    getById () {
      this.loading = true
      this.reload = false
      this.$store.dispatch(actions.api.getById, this.apiId).then(api => {
        this.api = api
        this.methodName = {name: api.method.toLowerCase()}
        this.runType = {name: api.runStyle}
        this.url = api.path
        this.response = api.mockData
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.reload = true
        this.$message({
          type: 'error',
          message: '获取接口信息失败'
        })
        console.error('获取接口信息失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
