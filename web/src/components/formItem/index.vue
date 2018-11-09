<template>
  <div class="form-item">
    <label class="form-label" :style="style">{{label}}：</label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'formItem',
  props: {
    label: {
      type: String
    },
    labelWidth: {
      type: [String, Number],
      default: 70
    },
    labelAlign: {
      type: String,
      default: 'right'
    }
  },
  computed: {
    style () {
      return {
        width: this.labelWidth + 'px',
        textAlign: this.labelAlign
      }
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
