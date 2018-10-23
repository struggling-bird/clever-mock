<template>
  <div class="project-create">
    <span class="brand">cleverMock</span>
    <div class="title-panel">
      <div class="title">创建项目</div>
    </div>

    <ul class="form-panel">
      <li>
        <span>项目名称：</span>
        <c-input size="big" :width="400" autoFocus></c-input>
      </li>
      <li>
        <span>代理地址：</span>
        <c-input size="big" :width="400"/>
      </li>
      <li>
        <span>描述：</span>
        <textarea rows="8"></textarea>
      </li>
      <li>
        <c-button size="large" class="btn-save" type="primary">保存</c-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'projectCreate',
  data () {
    return {
      msg: 'create'
    }
  }
}
</script>

<style lang="sass">
@import "styles/create"
</style>
