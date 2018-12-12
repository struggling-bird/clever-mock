<template>
  <div class="json-line" :style="lineStyle">
    <!--<span class="json-row-num">{{rowNumber}}</span>--><slot></slot>
  </div>
</template>

<script>
export default {
  name: 'jsonLine',
  props: {
    lineStyle: null,
    rowNumber: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="sass">

</style>
