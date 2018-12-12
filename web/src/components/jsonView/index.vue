<template>
  <div class="json-view">
    <json-line :line-style="lineStyle">
      <span class="json-key" v-if="json.name">
        {{json.name}}:
      </span>
      <template v-if="['Object', 'Array'].includes(type)">
        <span class="json-kh">{{type === 'Object' ? '{' : '['}}</span>
        <span class="json-collapse" @click="collapse = !collapse">{{collapse ? '+' : '-'}}</span>
      </template>
      <template v-else>
        <span class="json-val">
          {{JSON.stringify(json.value)}}<template v-if="!isLast">,</template>
        </span>
      </template>
      <span class="json-annotate" v-if="showRequired || editMode || json.desc || !['Object', 'Array'].includes(type)">
          <span class="json-xg">//</span>
          <span class="json-annotation" v-if="showRequired">
            <span class="json-annotation_">@required</span> {{json.required}}
          </span>
          <span class="json-annotation" v-if="editMode || !['Object', 'Array'].includes(type)">
            <span class="json-annotation_">@type</span> {{json.type}}
          </span>
          <span class="json-annotation" v-if="json.desc">
            <span class="json-annotation_">@desc</span>{{json.desc}}
          </span>
        </span>
    </json-line>
    <div class="json-children" v-if="json.children && json.children.length && !collapse">
      <json-view v-for="(field, i) in json.children"
                 :key="id + '_' + field + '_' + i"
                 :level="level + 1"
                 :is-last="i === json.children.length - 1"
                 :store="field"></json-view>
    </div>
    <json-line :line-style="lineStyle" v-show="collapse">...</json-line>
    <json-line :line-style="lineStyle" v-if="['Object', 'Array'].includes(type)">
      <span class="json-kh">{{type === 'Object' ? '}' : ']'}}</span><template v-if="!isLast">,</template>
    </json-line>
  </div>
</template>

<script>
import {util} from '../../util'
import JsonLine from './jsonLine'
export default {
  name: 'jsonView',
  components: {JsonLine},
  props: {
    store: null,
    editMode: {
      type: Boolean,
      default: false
    },
    showRequired: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
    isLast: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      id: util.guid(),
      collapse: false,
      json: util.isString(this.store) ? JSON.parse(this.store) : this.store
    }
  },
  computed: {
    lineStyle () {
      return {
        paddingLeft: (this.level * 10) + 20 + 'px'
      }
    },
    type () {
      return this.json.type
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
