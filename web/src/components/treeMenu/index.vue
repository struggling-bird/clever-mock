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
               :filter="filter"
               :onChoose="onClickNode"
               :chosenNode="chosenNode || currentNode"
               :key="node[keyField]">
      <slot :node="node"></slot>
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
    },
    chosenNode: null,
    filter: {
      type: String
    }
  },
  data () {
    return {
      currentNode: null
    }
  },
  computed: {
    style () {
      return {
        width: this.width + 'px'
      }
    }
  },
  methods: {
    onClickNode (node) {
      this.currentNode = node
      this.onChoose(node)
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
