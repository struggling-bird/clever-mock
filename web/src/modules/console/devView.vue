<template>
  <div class="dev-view">
    <div class="api-list-panel">
      <c-input class="api-search" :width="170" clearAble placeholder="搜索" icon="mock-search"/>
      <div class="ctl-panel">
        <i class="btn-sort mock-sort-alpha-desc"></i>
        <i class="btn-add mock-wenjianjia"></i>
      </div>
      <div class="api-list">
        <ul class="group">
          <li class="group-title">
            <i class="mock-folder"></i>
            <i class="btn-add mock-add"></i>
            <span class="desc">未分组</span>
          </li>
          <li class="api">
            <span class="url">/zgsee/test</span>
            <span class="method get">get</span>
          </li>
          <li class="api">
            <span class="url">/zgsee/test</span>
            <span class="method post">post</span>
          </li>
          <li class="api">
            <span class="url">/zgsee/test</span>
            <span class="method delete">delete</span>
          </li>
          <li class="api">
            <span class="url">/zgsee/test</span>
            <span class="method">put</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="api-detail-panel">
      <api-detail></api-detail>
    </div>
  </div>
</template>

<script>
import ApiDetail from './api'
export default {
  name: 'devView',
  components: {ApiDetail},
  data () {
    return {
      msg: 'develope'
    }
  }
}
</script>

<style lang="sass">
@import "styles/devView"
</style>
