<template>
  <div class="tree-node" :key="node[keyField]">
    <div :class="nodeClass"
         @click="onClick">
        <span class="tree-node-label"
              v-click-outside="onClickOther"
              :title="node[label] || node[aliasLabel]"
              :style="nodeStyle">{{node[label] || node[aliasLabel]}}</span>
      <i v-if="haveChildren" class="mock-pulldown tree-collapse"></i>
    </div>
    <tree-menu v-if="haveChildren && expand"
               :width="width"
               :onChoose="onChoose"
               :level="level + 1"
               :label="label"
               :key-field="keyField"
               :children-field="childrenField"
               :alias-label="aliasLabel"
               :store="node[childrenField]"></tree-menu>
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
    }
  },
  data () {
    return {
      expand: true,
      checked: false
    }
  },
  computed: {
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
        this.checked = true
        this.onChoose(this.node)
      } else {
        this.expand = !this.expand
      }
    },
    onClickOther () {
      this.checked = false
    }
  }
}
</script>

<style lang="sass">

</style>
