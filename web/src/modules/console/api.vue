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
      <div class="api-config" :key="'api-config-' + apiId">
        <c-tabs>
          <c-tab-panel title="参数结构">
            <param-view :store="api.params" @change="onChangeParams"></param-view>
          </c-tab-panel>
        </c-tabs>
        <c-tabs>
          <c-tab-panel title="返回结构">
            <res-view :structure="api.resStructure" @change="onChangeRes"></res-view>
          </c-tab-panel>
        </c-tabs>
        <c-tabs>
          <c-tab-panel title="接口描述">
            <api-desc v-model="api.description"></api-desc>
          </c-tab-panel>
        </c-tabs>
        <c-tabs>
          <c-tab-panel title="mock数据">
            <mock-data :text="api.mockData" @change="onChangeMockData"></mock-data>
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
import ApiDesc from './apiDesc'
import MockData from './mockData'
import {util} from '../../util'
import FormItem from '../../components/formItem/index'
import {mapState} from 'vuex'
export default {
  name: 'apiDetail',
  components: {FormItem, MockData, ApiDesc, ResView, ParamView},
  props: {
    apiId: null,
    addMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return this.getData()
  },
  computed: {
    saveParam () {
      let api = {
        ...this.api,
        delay: Number(this.api.delay),
        method: this.methodName.name,
        runStyle: this.runType.name,
        proxyUrl: this.proxyUrl ? this.proxyUrl.url : ''
      }
      if (api.resStructure && !util.isString(api.resStructure)) {
        api.resStructure = JSON.stringify(api.resStructure)
      }
      if (api.params && !util.isString(api.params)) {
        api.params = JSON.stringify(api.params)
      }
      return api
    },
    saveAble () {
      return !util.equal(this.saveParam, this.preApi)
    },
    ...mapState({
      runTypeList (state) {
        return state.common.runTypeList
      },
      methodList (state) {
        return state.common.methodList
      },
      proxyList (state) {
        return state.project.proxyServerList
      }
    })
  },
  mounted () {
    if (!this.addMode) this.getById()
  },
  watch: {
    apiId (id) {
      if (id) {
        this.getById()
      } else {
        let data = this.getData()
        for (let prop in data) {
          this[prop] = data[prop]
        }
      }
    }
  },
  methods: {
    getData () {
      return {
        methodName: {name: 'GET'},
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
          params: null,
          path: '',
          projectId: '',
          proxyUrl: '',
          resFormatScript: null,
          resStructure: null,
          runStyle: 'proxy',
          delay: 0
        },
        preApi: null,
        loading: !this.addMode,
        reload: false
      }
    },
    getById () {
      this.loading = true
      this.reload = false
      this.$store.dispatch(actions.api.getById, this.apiId).then(api => {
        if (api.resStructure) api.resStructure = JSON.parse(api.resStructure)
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
    },
    onChangeParams (json) {
      if (json) {
        util.treeLoop(json, {
          childrenField: 'children',
          callback (item) {
            delete item.id
          }
        })
      }
      this.api.params = json ? JSON.stringify(json) : null
    },
    onChangeRes (json) {
      if (json) {
        util.treeLoop(json, {
          childrenField: 'children',
          callback (item) {
            delete item.id
          }
        })
      }
      this.api.resStructure = json ? JSON.stringify(json) : null
    },
    onChangeMockData (data) {
      this.api.mockData = data
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
