<template>
  <div class="json-view">
    <div class="json-line">
      <span class="json-key" v-if="json.name">{{json.name}}: </span>
      <span class="json-kh" v-if="['Object', 'Array'].includes(type)">{{type === 'Object' ? '{' : '['}}</span>
      <span class="json-val">
          <template v-if="type === 'String'">"</template>
          {{json.value}}
          <template v-if="type === 'String'">"</template>
        </span>
      <span class="json-annotate" v-if="!['Object', 'Array'].includes(type)">
          <span class="json-xg">//</span>
          <span class="json-annotation" v-if="showRequired"><span class="json-annotation_">@required</span> {{json.required}}</span>
          <span class="json-annotation" v-if="json.type"><span class="json-annotation_">@type</span> {{json.type}}</span>
          <span class="json-annotation" v-if="json.desc"><span class="json-annotation_">@desc</span>{{json.desc}}</span>
        </span>
    </div>
    <div class="json-children" v-if="json.children && json.children.length">
      <json-view v-for="field in json.children" :store="field"></json-view>
    </div>
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
    showRequired: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
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
