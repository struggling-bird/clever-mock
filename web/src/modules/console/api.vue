<template>
  <div class="api-detail">
    <c-loading v-if="loading"></c-loading>
    <c-reload v-if="reload" @reload="getById"></c-reload>
    <template v-if="!loading && !reload">
      <div class="api-base">
        <form-item label="API名称">
          <c-input v-model="api.name" clearAble :width="300"/>
          <c-button v-if="api.id" type="danger" class="btn-del" size="normal" @click="onDel">删除</c-button>
        </form-item>
        <form-item label="自动更新">
          <c-checkbox v-model="api.autoUpdate"></c-checkbox>
        </form-item>
        <form-item label="调用延时">
          <c-input v-model="api.delay"/><span class="unit">s</span>
        </form-item>
        <form-item label="代理地址">
          <c-selector theme="tag"
                      :store="proxyList"
                      v-model="proxyUrl"
                      :max="1"
                      :width="300"
                      :splitStrFormat="{maxLength: 42}"
                      key-field="url"
                      labelField="url">
            <template slot-scope="{data}">
              <span :title="data.url">{{data.name || data.url}}</span>
            </template>
          </c-selector>
        </form-item>
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
import FormItem from '../../components/formItem/index'
import {mapState} from 'vuex'
export default {
  name: 'apiDetail',
  components: {FormItem, MockScript, MockData, ApiDesc, ResView, ParamView},
  props: {
    apiId: null,
    addMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      methodName: {name: 'GET'},
      methodList: ['GET', 'POST', 'DELETE', 'PUT'].map(name => {
        return {name: name}
      }),
      runTypeList: ['staticMock', 'scriptMock', 'proxy', 'auto', 'test'].map(type => {
        return {name: type}
      }),
      runType: {name: 'proxy'},
      proxyUrl: null,
      api: {
        autoUpdate: false,
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
        runStyle: 'proxy',
        delay: 0
      },
      preApi: null,
      loading: this.addMode ? false : true,
      reload: false
    }
  },
  computed: {
    saveParam () {
      return {
        ...this.api,
        delay: Number(this.api.delay),
        method: this.methodName.name,
        runStyle: this.runType.name,
        proxyUrl: this.proxyUrl ? this.proxyUrl.url : ''
      }
    },
    saveAble () {
      return !util.equal(this.saveParam, this.preApi)
    },
    ...mapState({
      proxyList (state) {
        return state.project.proxyServerList
      }
    })
  },
  mounted () {
    if (!this.addMode) this.getById()
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
        this.proxyUrl = {url: api.proxyUrl}
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
      if (this.addMode) {
        this.add()
      } else {
        this.update()
      }
    },
    add () {
      this.$store.dispatch(actions.api.add, {
        api: this.saveParam,
        projectId: this.$route.params.id
      }).then(api => {
        this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
        this.$store.dispatch(actions.project.queryProxyServer, this.$route.params.id)
        this.$emit('afterAdd', api)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '添加接口失败'
        })
        console.error('添加接口失败', err)
      })
    },
    update () {
      this.$store.dispatch(actions.api.update, this.saveParam).then(() => {
        this.preApi = util.clone(this.saveParam)
        this.$store.dispatch(actions.api.queryGroup, this.$route.params.id)
        this.$store.dispatch(actions.project.queryProxyServer, this.$route.params.id)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '更新接口失败'
        })
        console.error('更新接口失败', err)
      })
    },
    onDel () {
      this.$store.dispatch(actions.api.del, this.api.id).then(() => {
        this.$emit('del')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '删除API失败'
        })
        console.error('删除API失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
