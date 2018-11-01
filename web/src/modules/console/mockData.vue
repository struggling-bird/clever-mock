<template>
  <div class="mock-data">
    <div class="preview">
      <div>
        <pre class="language-json">
          <code v-html="code"></code>
        </pre>
      </div>
    </div>
    <div class="code-view">
      <textarea v-model="mockData"></textarea>
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs'
export default {
  name: 'mockData',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mockData: this.value,
      code: Prism.highlight(this.value, Prism.languages.json, 'json')
    }
  },
  watch: {
    mockData (res) {
      this.code = Prism.highlight(res, Prism.languages.json, 'json')
      this.$emit('input', res)
    }
  }
}
</script>

<style lang="sass">
@import "styles/mockData"
</style>
