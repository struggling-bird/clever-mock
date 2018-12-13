<template>
  <div class="mock-data" ref="main">
  </div>
</template>

<script>
import codeMirror from 'codemirror'
export default {
  name: 'mockData',
  props: {
    text: null
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = codeMirror(this.$refs.main, {
      mode: 'javascript',
      theme: 'darcula',
      lineNumbers: true,
      line: true,
      value: this.text
    })
    this.editor.on('change', editor => {
      this.$emit('change', editor.getValue())
    })
  }
}
</script>

<style lang="sass">
@import "styles/mockData"
</style>
