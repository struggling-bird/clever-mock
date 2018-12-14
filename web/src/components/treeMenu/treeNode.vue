<template>
  <div class="tree-node" :key="node[keyField]">
    <div :class="nodeClass"
         v-show="haveChildren || (new RegExp(filter).test(node[label]) || new RegExp(filter).test(node[aliasLabel]))"
         @click="onClick">
        <slot :node="node">
          <span class="tree-node-label"
                :title="node[label] || node[aliasLabel]"
                :style="nodeStyle">{{node[label] || node[aliasLabel]}}</span>
          <i v-if="haveChildren" class="mock-pulldown tree-collapse"></i>
        </slot>
    </div>
    <tree-menu v-if="haveChildren && expand"
               :width="width"
               :onChoose="onChoose"
               :level="level + 1"
               :label="label"
               :key-field="keyField"
               :children-field="childrenField"
               :alias-label="aliasLabel"
               :filter="filter"
               :chosenNode="chosenNode"
               :store="node[childrenField]">
    </tree-menu>
  </div>
</template>

<script>
export default {
  name: 'treeNode',
  components: {
    TreeMenu: () => import('./index.vue')
  },
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
    node: {
      type: Object
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
      expand: true
    }
  },
  computed: {
    checked () {
      return this.chosenNode === this.node
    },
    nodeClass () {
      return {
        'tree-banner': true,
        '__have-children': this.haveChildren,
        '__expand': this.expand && this.haveChildren,
        '__checked': this.checked
      }
    },
    nodeStyle () {
      return {
        paddingLeft: this.level * 10 + 'px'
      }
    },
    haveChildren () {
      return this.node[this.childrenField] && this.node[this.childrenField].length
    }
  },
  methods: {
    onClick () {
      if (!this.haveChildren && this.onChoose && !this.checked) {
        this.onChoose(this.node)
      } else {
        this.expand = !this.expand
      }
    }
  }
}
</script>

<style lang="sass">

</style>
