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
      <c-input class="url-input" :width="400" clearAble autoFocus size="big" placeholder="URL"/>
      <c-selector :store="runTypeList"
                  class="run-type-select"
                  v-model="runType"
                  :width="80"
                  size="big"
                  keyField="value"
                  labelField="name"></c-selector>
      <c-button size="large" type="primary" theme="border" v-if="runType.name === 'test'">发送</c-button>
      <c-button size="large" type="primary">保存</c-button>
    </div>

    <div class="api-config">
      <c-tabs>
        <c-tab-panel title="请求参数">
          <table class="param-table">
            <thead>
            <tr>
              <td>参数名</td>
              <td>参数值</td>
              <td>类型</td>
              <td>说明</td>
              <td>操作</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td><c-input/></td>
              <td><c-input/></td>
              <td><c-input/></td>
              <td><c-input/></td>
              <td>
                <c-button type="danger" class="btn-del">删除</c-button>
                <c-button type="primary">添加</c-button>
              </td>
            </tr>
            </tbody>
          </table>
        </c-tab-panel>
        <c-tab-panel title="响应体">
          this is response
        </c-tab-panel>
        <c-tab-panel title="说明">

        </c-tab-panel>
      </c-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'apiDetail',
  data () {
    return {
      methodName: {name: 'get'},
      methodList: ['get', 'post', 'delete', 'put'].map(name => {
        return {name: name}
      }),
      runTypeList: ['mock', 'proxy', 'auto', 'test'].map((type, i) => {
        return {name: type, value: i}
      }),
      runType: {value: 0}
    }
  }
}
</script>

<style lang="sass">
@import "styles/api"
</style>
