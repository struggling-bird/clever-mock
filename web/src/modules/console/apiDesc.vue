<template>
  <div class="api-desc">
    <textarea ref="dom"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde'
export default {
  name: 'apiDesc',
  props: {
    value: null
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = new SimpleMDE({
      element: this.$refs.dom
    })
    this.editor.value(this.value || '')
    this.editor.codemirror.on('change', () => {
      this.$emit('input', this.editor.value())
    })
  },
  methods: {
  }
}
</script>

<style lang="sass">

</style>
