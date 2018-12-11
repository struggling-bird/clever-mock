<template>
  <div class="tree-menu" :style="style">
    <tree-node v-for="node in store"
               :width="width"
               :node="node"
               :label="label"
               :level="level"
               :key-field="keyField"
               :children-field="childrenField"
               :alias-label="aliasLabel"
               :onChoose="onChoose"
               :key="node[keyField]">
    </tree-node>
  </div>
</template>

<script>
import TreeNode from './treeNode'
export default {
  name: 'treeMenu',
  components: {TreeNode},
  props: {
    width: {
      type: [Number, String],
      default: 200
    },
    label: {
      type: String
    },
    aliasLabel: {
      type: String
    },
    keyField: {
      type: String,
      default: 'id'
    },
    childrenField: {
      type: String,
      default: 'children'
    },
    level: {
      type: Number,
      default: 1
    },
    store: {
      type: Array,
      default () {
        return []
      }
    },
    onChoose: {
      type: Function
    }
  },
  data () {
    return {
    }
  },
  computed: {
    style () {
      return {
        width: this.width + 'px'
      }
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
