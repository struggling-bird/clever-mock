<template>
  <div class="member-manage">
    <div class="member-add-form">
      <h4>添加成员</h4>
      <c-input autoFocus clearAble :width="230" placeholder="邮箱地址" v-model="email"/>
      <c-button size="normal" type="primary" @click="onAdd">添加</c-button>
    </div>
    <c-data-grid :store="userList" show-index indexTitle="序列">
      <c-grid-column field="name" title="用户名" sort-able></c-grid-column>
      <c-grid-column field="email" title="邮箱" sort-able></c-grid-column>
      <c-grid-column field="roleName" title="角色" sort-able></c-grid-column>
      <c-grid-column field="_" title="操作">
        <template slot-scope="{data,field}">
          <c-button type="danger" :disable="data.roleId === 0" @click="onDel(data.id)">删除</c-button>
        </template>
      </c-grid-column>
    </c-data-grid>
  </div>
</template>

<script>
import {actions} from '../../store/constants'
import {mapState} from 'vuex'
import FormItem from '../../components/formItem/index'
export default {
  name: 'memberManage',
  components: {FormItem},
  data () {
    return {
      email: ''
    }
  },
  computed: {
    ...mapState({
      currentProject (state) {
        return state.project.currentProject
      },
      userList (state) {
        return state.user.memberList
      }
    })
  },
  created () {
    this.$store.dispatch(actions.user.query, this.currentProject.id)
  },
  methods: {
    onDel (id) {
      this.$store.dispatch(actions.user.removeMember, {
        projectId: this.currentProject.id,
        userId: id
      }).then(() => {
        this.$message({
          message: '删除成功'
        })
      }).catch(err => {
        this.$message({
          message: '删除成员失败',
          type: 'error'
        })
        console.error('删除成员失败', err)
      })
    },
    onAdd () {
      if (!this.email) {
        this.$message({
          message: '请填写被邀请人的邮箱地址',
          type: 'error'
        })
        return
      }
      this.$store.dispatch(actions.user.invite, {
        email: this.email,
        projectId: this.currentProject.id
      }).then(() => {
        this.$message({
          message: '邀请成功'
        })
      }).catch(err => {
        this.$message({
          message: '邀请失败',
          type: 'error'
        })
        console.error('邀请失败', err)
      })
    }
  }
}
</script>

<style lang="sass">
@import "styles/member"
</style>
