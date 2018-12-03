<template>
  <div class="setting">
    <div class="setting-form">
      <form-item label="项目名称">
        <c-input :width="400" autoFocus></c-input>
      </form-item>
      <form-item label="代理地址">
        <c-input :width="325"></c-input>
        <c-checkbox class="setting-global-proxy">全局</c-checkbox>
      </form-item>
      <form-item label="描述">
        <textarea></textarea>
      </form-item>

      <div class="setting-line">
        <div class="line"></div>
        <label>API全局设置</label>
      </div>
      <form-item label="自动更新">
        <c-checkbox></c-checkbox>
      </form-item>
      <form-item label="调用延时">
        <c-input/>
      </form-item>
      <form-item label="运行方式">
      </form-item>
    </div>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
export default {
  name: 'setting',
  components: {FormItem},
  data () {
    return {
      msg: 'index'
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
