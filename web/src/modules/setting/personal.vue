<template>
  <div class="personal-setting">
    <form-item label="姓名">
      <c-input autoFocus :width="230" clearAble/>
    </form-item>
    <form-item label="邮箱">
      <c-input :width="230" clearAble/>
    </form-item>
    <form-item label="微信">
      <c-input :width="230" clearAble/>
    </form-item>
    <form-item label="密码">
      <c-input :width="230" clearAble type="password"/>
    </form-item>
    <form-item label="确认密码">
      <c-input :width="230" clearAble type="password"/>
    </form-item>
    <c-button size="normal" class="btn-save" type="primary">保存</c-button>
  </div>
</template>

<script>
import FormItem from '../../components/formItem/index'
export default {
  name: 'personal-setting',
  components: {FormItem},
  data () {
    return {
      msg: 'personal'
    }
  }
}
</script>

<style lang="sass">
@import "styles/personal"
</style>
