<template>
  <div class="res-view">
    <div class="preview">
      <div>
        <pre class="language-json">
          <code v-html="code"></code>
        </pre>
      </div>
    </div>
    <div class="code-view">
      <textarea v-model="response"></textarea>
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs'
export default {
  name: 'resView',
  props: {
    value: null
  },
  data () {
    return {
      response: this.value,
      code: Prism.highlight(this.value, Prism.languages.json, 'json')
    }
  },
  watch: {
    response (res) {
      this.code = Prism.highlight(res, Prism.languages.json, 'json')
    }
  }
}
</script>

<style lang="sass">
@import "styles/res"
</style>
