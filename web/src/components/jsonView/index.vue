<template>
  <div class="json-view">
    <div class="json-line">
      <span class="json-key" v-if="json.name">{{json.name}}: </span>
      <template v-if="['Object', 'Array'].includes(type)">
        <span class="json-kh">{{type === 'Object' ? '{' : '['}}</span>
        <span class="json-collapse" @click="collapse = !collapse">{{collapse ? '+' : '-'}}</span>
        <span class="json-annotate">
          <span class="json-xg">//</span>
          <span class="json-annotation" v-if="showRequired">
            <span class="json-annotation_">@required</span> {{json.required}}
          </span>
          <span class="json-annotation" v-if="json.desc">
            <span class="json-annotation_">@desc</span>{{json.desc}}
          </span>
        </span>
      </template>
      <template v-else>
        <span class="json-val">
          {{JSON.stringify(json.value)}}
        </span>
        <span class="json-annotate">
          <span class="json-xg">//</span>
          <span class="json-annotation" v-if="showRequired">
            <span class="json-annotation_">@required</span> {{json.required}}
          </span>
          <span class="json-annotation" v-if="json.type">
            <span class="json-annotation_">@type</span> {{json.type}}
          </span>
          <span class="json-annotation" v-if="json.desc">
            <span class="json-annotation_">@desc</span>{{json.desc}}
          </span>
        </span>
      </template>
    </div>
    <div class="json-children" v-if="json.children && json.children.length && !collapse">
      <json-view v-for="(field, i) in json.children"
                 :key="id + '_' + field + '_' + i"
                 :store="field"></json-view>
    </div>
    <div class="json-line" v-show="collapse">...</div>
    <div class="json-line" v-if="['Object', 'Array'].includes(type)">
      <span class="json-kh">{{type === 'Object' ? '}' : ']'}}</span>
    </div>
  </div>
</template>

<script>
import {util} from '../../util'
export default {
  name: 'jsonView',
  props: {
    store: null,
    editMode: {
      type: Boolean,
      default: false
    },
    showRequired: {
      type: Boolean,
      default: false
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
    type () {
      return this.json.type
    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
