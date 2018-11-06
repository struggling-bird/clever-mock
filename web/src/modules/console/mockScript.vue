<template>
  <div class="mock-script">
    <div class="preview">
      <div>
        <pre class="language-json">
          <code v-html="code"></code>
        </pre>
      </div>
    </div>
    <div class="code-view">
      <textarea v-model="mockScript"></textarea>
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs'
export default {
  name: 'mockScript',
  props: {
    value: null
  },
  data () {
    return {
      mockScript: this.value,
      code: Prism.highlight(this.value || '', Prism.languages.javascript, 'javascript')
    }
  },
  watch: {
    mockScript (res) {
      this.code = Prism.highlight(res, Prism.languages.javascript, 'javascript')
      this.$emit('input', res)
    }
  }
}
</script>

<style lang="sass">
@import "styles/mockScript"
</style>
