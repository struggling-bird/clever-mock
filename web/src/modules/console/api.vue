<template>
  <div class="api-detail">
    <c-loading v-if="loading"></c-loading>
    <c-reload v-if="reload" @reload="getById"></c-reload>
    <template v-if="!loading && !reload">
      <c-input v-model="api.name" placeholder="接口名称" clearAble :width="300" style="margin-bottom: 20px"/><br/>
      <c-input v-model="api.proxyUrl" placeholder="代理地址" clearAble :width="300" style="margin-bottom: 20px"></c-input><br/>
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
                 v-model="api.path"
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
        <c-button v-show="saveAble" size="large" type="primary" @click="onSave">保存</c-button>
      </div>
      <div class="api-config">
        <c-tabs>
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
            <mock-data v-model="api.mockData"></mock-data>
          </c-tab-panel>
          <c-tab-panel title="mock脚本">
            <mock-script v-model="api.mockScript"></mock-script>
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
import {util} from '../../util'
export default {
  name: 'apiDetail',
  components: {MockScript, MockData, ApiDesc, ResView, ParamView},
  props: {
    apiId: null
  },
  data () {
    return {
      methodName: {name: 'get'},
      methodList: ['GET', 'POST', 'DELETE', 'PUT'].map(name => {
        return {name: name}
      }),
      runTypeList: ['staticMock', 'scriptMock', 'proxy', 'auto', 'test'].map(type => {
        return {name: type}
      }),
      runType: {name: 'proxy'},
      api: {
        autoUpdate: 0,
        description: '',
        groupId: '',
        method: 'POST',
        mockData: '',
        mockScript: '',
        name: '',
        params: [],
        path: '',
        projectId: '',
        proxyUrl: '',
        resFormatScript: null,
        resStructure: '',
        runStyle: 'proxy'
      },
      preApi: null,
      loading: true,
      reload: false
    }
  },
  computed: {
    saveParam () {
      return {
        ...this.api,
        method: this.methodName.name,
        runStyle: this.runType.name
      }
    },
    saveAble () {
      return !util.equal(this.saveParam, this.preApi)
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
        this.preApi = util.clone(api)
        this.methodName = {name: api.method}
        this.runType = {name: api.runStyle}
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
    },
    onSave () {
      this.$store.dispatch(actions.api.update, this.saveParam).then(() => {
        console.log('更新成功')
        this.preApi = util.clone(this.saveParam)
        this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '更新接口失败'
        })
        console.error('更新接口失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
