<template>
  <div class="setting">
    <c-loading v-if="!ready"></c-loading>
    <template v-else>
      <c-tabs>
        <c-tab-panel title="项目设置">
          <div class="setting-form">
            <form-item label="项目名称">
              <c-input :width="400" autoFocus v-model="name"></c-input>
            </form-item>
            <form-item label="代理地址">
              <c-selector theme="tag"
                          :store="proxyList"
                          v-model="proxyUrl"
                          :max="1"
                          :width="325"
                          :splitStrFormat="{maxLength: 42}"
                          key-field="url"
                          labelField="url">
                <template slot-scope="{data}">
                  <span :title="data.url">{{data.name || data.url}}</span>
                </template>
              </c-selector>
              <c-checkbox class="setting-global-proxy" v-model="proxyGlobal">全局</c-checkbox>
            </form-item>
            <form-item label="描述">
              <textarea v-model="description"></textarea>
            </form-item>
            <div class="setting-handle">
              <c-button type="primary" size="normal" @click="onSaveProject">保存</c-button>
            </div>
          </div>
        </c-tab-panel>
        <c-tab-panel title="API批量操作">
          <div class="setting-form">
            <form-item label="自动更新">
              <c-checkbox v-model="autoUpdate"></c-checkbox>
            </form-item>
            <form-item label="调用延时">
              <c-input v-model="delay"/>
            </form-item>
            <form-item label="运行方式">
              <c-selector :store="runTypeList" v-model="runType" labelField="name" keyField="name"></c-selector>
            </form-item>

            <div class="setting-handle">
              <!--<c-button size="normal">取消</c-button>-->
              <c-button type="primary" size="normal" @click="onUpdateApiList">保存</c-button>
            </div>
          </div>
        </c-tab-panel>
        <c-tab-panel title="成员管理"></c-tab-panel>
        <c-tab-panel title="个人设置">
          <personal-setting></personal-setting>
        </c-tab-panel>
      </c-tabs>
    </template>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
import {mapState} from 'vuex'
import {actions} from '../../store/constants'
import PersonalSetting from './personal'
export default {
  name: 'setting',
  components: {PersonalSetting, FormItem},
  data () {
    return {
      proxyUrl: null,
      name: '',
      description: '',
      autoUpdate: false,
      delay: 0,
      runType: null,
      proxyGlobal: false
    }
  },
  computed: {
    ...mapState({
      proxyList (state) {
        return state.project.proxyServerList
      },
      currentProject (state) {
        let project = state.project.currentProject
        if (project) {
          this.name = project.name
          this.description = project.description
          this.proxyUrl = {url: project.proxyUrl}
        }
        return project
      },
      runTypeList (state) {
        return state.common.runTypeList
      },
      ready (state) {
        return this.currentProject && state.project.ready.proxyServerList
      }
    }),
    project () {
      return {
        id: this.currentProject ? this.currentProject.id : null,
        name: this.name,
        description: this.description,
        proxyUrl: this.proxyUrl ? this.proxyUrl.url : null,
        global: this.proxyGlobal
      }
    },
    api () {
      return {
        autoUpdate: this.autoUpdate,
        delay: this.delay,
        runStyle: this.runType ? this.runType.name : null,
        projectId: this.currentProject ? this.currentProject.id : null
      }
    }
  },
  watch: {
    currentProject: {
      handler (project) {
        if (!project) return
        this.name = project.name
        this.description = project.description
        this.proxyUrl = {url: project.proxyUrl}
      },
      deep: true
    }
  },
  beforeCreate () {
    this.$store.dispatch(actions.project.queryProxyServer, this.$route.params.id)
  },
  methods: {
    onSaveProject () {
      this.$store.dispatch(actions.project.update, this.project).then(() => {
        this.$message({
          message: '更新成功'
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '更新项目失败'
        })
        console.error('更新项目失败', err)
      })
    },
    onUpdateApiList () {
      this.$store.dispatch(actions.api.updateList, this.api).then(() => {
        this.$message({
          message: '更新成功'
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '批量更新API失败'
        })
        console.error('批量更新API失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
