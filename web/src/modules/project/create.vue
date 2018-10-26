<template>
  <div class="project-create">
    <span class="brand">cleverMock</span>
    <div class="title-panel">
      <div class="title">创建项目</div>
    </div>

    <ul class="form-panel">
      <li>
        <span>项目名称：</span>
        <c-input size="big" :width="400" v-model="name" autoFocus></c-input>
      </li>
      <li>
        <span>项目地址：</span>
        <c-input size="big" :width="400" v-model="serverHost" placeholder="http://server.domail.com"/>
      </li>
      <li>
        <span>代理地址：</span>
        <c-input size="big" :width="400" v-model="proxyUrl" placeholder="http://proxy.domain.com"/>
      </li>
      <li>
        <span>描述：</span>
        <textarea rows="8" v-model="desc"></textarea>
      </li>
      <li>
        <c-button size="large" class="btn-save" type="primary" @click="onSave">保存</c-button>
      </li>
    </ul>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {router} from '../../router/constants'
export default {
  name: 'projectCreate',
  data () {
    return {
      name: '',
      proxyUrl: '',
      serverHost: '',
      desc: ''
    }
  },
  methods: {
    onSave () {
      this.$store.dispatch(actions.project.create, {
        name: this.name,
        proxyUrl: this.proxyUrl,
        serverHost: this.serverHost,
        desc: this.desc
      }).then(project => {
        this.$router.replace({
          name: router.console.index,
          params: {
            id: project.id
          }
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '创建项目失败'
        })
        console.error('创建项目失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/create"
</style>
