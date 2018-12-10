<template>
  <div class="json-view">
    <template v-if="type === 'Object'">
      <div class="json-line">
        <span class="json-key" v-if="json.name">{{json.name}}: </span><span class="json-kh">{</span>
      </div>
      <div class="json-children">
        <json-view v-for="field in json.children" :store="field"></json-view>
      </div>
      <div class="json-line">
        <span class="json-kh">}</span>
      </div>
    </template>
    <template v-else-if="type === 'Array'">
      <div class="json-line">
        <span class="json-key" v-if="json.name">{{json.name}}: </span><span class="json-kh">[</span>
      </div>
      <div class="json-line">
        <span class="json-kh">]</span>
      </div>
    </template>
    <template v-else>
      <div class="json-line">
        <span class="json-key">{{json.name}}: </span>
        <span class="json-val">
          <template v-if="type === 'String'">"</template>
          {{json.value}}
          <template v-if="type === 'String'">"</template>
        </span>
        <span class="json-annotate">
          <span class="json-xg">//</span>
          <span class="json-annotation"><span class="json-annotation_">@required</span> {{json.required}}</span>
          <span class="json-annotation"><span class="json-annotation_">@type</span> {{json.type}}</span>
          <span class="json-annotation"><span class="json-annotation_">@desc</span>{{json.desc}}</span>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import {util} from '../../util'
export default {
  name: 'jsonView',
  props: {
    store: null
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
