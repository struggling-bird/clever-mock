<template>
  <div class="param-view">
    <table class="param-table">
      <thead>
      <tr>
        <td>必填</td>
        <td>参数名称</td>
        <td>参数类型</td>
        <td>默认值</td>
        <td>描述</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(param, i) in paramList" :key="param.id">
        <td>
          <c-checkbox v-model="param.required"></c-checkbox>
        </td>
        <td>
          <c-input v-model="param.name"/>
        </td>
        <td>
          <c-selector :store="typeList"
                      v-model="param.type"
                      :width="80"
                      keyField="value"
                      labelField="name"></c-selector>
        </td>
        <td>
          <c-input v-model="param.value"/>
        </td>
        <td>
          <c-input v-model="param.description"/>
        </td>
        <td>
          <c-button type="danger" class="btn-del" @click="onDel(i)">删除</c-button>
          <c-button type="primary" @click="onAdd">添加</c-button>
        </td>
      </tr>
      <tr v-if="!paramList.length">
        <td colspan="6" style="text-align: center;padding: 20px 0">
          <c-button type="primary" theme="border" @click="onAdd">添加参数</c-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {util} from '../../util'
export default {
  name: 'paramView',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      typeList: [
        {name: '字符串', value: 'string'},
        {name: '数字', value: 'number'},
        {name: '数组', value: 'array'},
        {name: '布尔值', value: 'boolean'}
      ],
      paramList: this.value.map(param => {
        let res = util.clone(param)
        res.id = util.guid()
        res.type = {value: res.type}
        return res
      })
    }
  },
  watch: {
    paramList: {
      handler (params) {
        let output = []
        params.forEach(item => {
          let param = util.clone(item)
          delete param.id
          param.type = param.type.value
          if (param.name) {
            output.push(param)
          }
        })
        this.$emit('input', output)
      },
      deep: true
    }
  },
  methods: {
    onAdd () {
      this.paramList.push({
        id: util.guid(),
        name: '',
        type: {value: 'string'},
        description: '',
        value: '',
        required: true
      })
    },
    onDel (i) {
      this.paramList.splice(i, 1)
    }
  }
}
</script>

<style lang="sass">
@import "styles/param"
</style>
