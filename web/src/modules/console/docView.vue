<template>
  <div class="doc-view">
    <template v-for="group in groupList">
      <div class="api-doc" v-for="api in group.apiList" :key="api.id">
        <h3 v-if="api.name">{{api.name}}</h3>
        <div class="api-url">
          <span class="api-method" :class="api.method.toLowerCase()">{{api.method}}</span>{{api.path}}
        </div>
        <c-tabs v-if="api.description">
          <c-tab-panel title="描述">
            {{api.description}}
          </c-tab-panel>
        </c-tabs>
        <c-tabs>
          <c-tab-panel title="参数">
            {{api.params}}
          </c-tab-panel>
        </c-tabs>
        <c-tabs>
          <c-tab-panel title="返回结构">
            {{api.resStructure}}
          </c-tab-panel>
        </c-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
export default {
  name: 'docView',
  data () {
    return {
      msg: 'doc'
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
  }
}
</script>

<style lang="sass">
@import "styles/docView"
</style>
