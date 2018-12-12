<template>
  <div :class="jsonClass">
    <json-line :line-style="lineStyle">
      <span class="json-key" v-if="json.name !== null">
        <c-input v-if="editMode"
                 :ref="'name' + json.id"
                 autoFocus
                 v-model="json.name"
                 width="auto"
                 @key.delete="onDelName"
                 :min-width="0"
                 size="small"/>
        <template v-else>{{json.name}}</template>:
      </span>
      <template v-if="['Object', 'Array'].includes(type)">
        <span class="json-kh">{{type === 'Object' ? '{' : '['}}</span>
        <span class="json-collapse" @click="collapse = !collapse">{{collapse ? '+' : '-'}}</span>
      </template>
      <template v-else>
        <span class="json-val">
          <c-input v-if="editMode"
                   v-model="json.value"
                   width="auto"
                   @key.enter="onAdd()"
                   @key.delete="onDelVal"
                   :minWidth="0"
                   size="small"/>
          <template v-else>
            {{JSON.stringify(json.value)}}<template v-if="!isLast">,</template>
          </template>
        </span>
      </template>
      <span class="json-annotate" v-if="showRequired || editMode || json.desc || !['Object', 'Array'].includes(type)">
        <span class="json-xg">//</span>
        <span class="json-annotation" v-if="showRequired">
          <span class="json-annotation_">@required</span>
          <select v-if="editMode" v-model="json.required">
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <template v-else>
            {{json.required}}
          </template>
        </span>
        <span class="json-annotation" v-if="editMode || !['Object', 'Array'].includes(type)">
          <span class="json-annotation_">@type</span>
          <select v-if="editMode" v-model="json.type" @change="onChangeType">
            <option value="String">字符串</option>
            <option value="Number">数字</option>
            <option value="Boolean">布尔值</option>
            <option value="Object">对象</option>
            <option value="Array">数组</option>
            <option value="Null">Null</option>
          </select>
          <template v-else>
            {{json.type}}
          </template>
        </span>
        <span class="json-annotation" v-if="json.desc || editMode">
          <span class="json-annotation_">@desc</span>
          <c-input v-if="editMode"
                   :ref="'desc' + json.id"
                   v-model="json.desc"
                   width="auto"
                   :min-width="0"
                   @key.enter="onAdd()"
                   size="small"/>
          <template v-else>{{json.desc}}</template>
        </span>
      </span>
      <template v-if="editMode">
        <template v-if="['Object', 'Array'].includes(type) && level > 0">
          <c-button icon="mock-add" class="json-btn-add_" type="primary" @click="onAdd(true)">Inside</c-button>
          <c-button icon="mock-add" class="json-btn-add_" type="primary" @click="onAdd">Outside</c-button>
        </template>
        <i v-else class="mock-add json-btn-add" @click="onAdd"></i>
        <i class="mock-delete-little1 json-btn-del" v-if="level > 0" @click="onDel"></i>
      </template>
    </json-line>
    <div class="json-children" v-if="json.children && json.children.length && !collapse">
      <json-view v-for="(prop, i) in json.children"
                 :key="prop.id"
                 @delProp="onDelProp"
                 @addProp="onAddProp"
                 :parent="json"
                 :level="level + 1"
                 :edit-mode="editMode"
                 :show-required="showRequired"
                 :is-last="i === json.children.length - 1"
                 :store="prop"></json-view>
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
    },
    parent: null
  },
  data () {
    let json = util.isString(this.store) ? JSON.parse(this.store) : this.store
    util.treeLoop(json, {
      childrenField: 'children',
      callback: item => {
        if (!item.id) item.id = util.guid()
      }
    })
    return {
      id: util.guid(),
      collapse: false,
      json
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
    },
    jsonClass () {
      return {
        'json-view': true,
        'json-edit-mode': this.editMode
      }
    }
  },
  watch: {
    json: {
      handler: function (json) {
        this.$emit('change', json)
      },
      deep: true
    }
  },
  methods: {
    onChangeType () {
      switch (this.json.type) {
        case 'Array':
          this.json.children = []
          break
        case 'Object':
          if (this.parent && this.parent.type === 'Array') this.json.name = null
          this.json.children = []
          break
      }
    },
    onDel () {
      this.$emit('delProp', this.json)
    },
    onAdd (inside) {
      if (this.level === 0 || inside) {
        const id = util.guid()
        let toAdd = {
          id,
          name: 'prop',
          type: 'String',
          value: '',
          required: false,
          desc: '',
          children: []
        }
        this.json.children.push(toAdd)
      } else {
        this.$emit('addProp', this.json)
      }
    },
    /**
     * 退无可退就删name
     */
    onDelVal () {
      if (!this.json.value) {
        let name = this.$refs['name' + this.json.id]
        if (name) name.focus()
      }
    },
    /**
     * 退无可退就删了自己
     */
    onDelName () {
      if (!this.json.name) this.$emit('delProp', this.json)
    },
    onDelProp (prop) {
      for (let i = 0; i < this.json.children.length; i++) {
        let item = this.json.children[i]
        if (item === prop) {
          this.json.children.splice(i, 1)
          break
        }
      }
    },
    onAddProp (prop) {
      this.json.children.forEach((item, i) => {
        if (item.id === prop.id) {
          const id = util.guid()
          let toAdd = {
            id,
            name: '',
            type: 'String',
            value: '',
            required: false,
            desc: '',
            children: []
          }
          this.json.children.splice(i, 1, ...[item, toAdd])
        }
      })

    }
  }
}
</script>

<style lang="sass">
@import "styles/index"
</style>
