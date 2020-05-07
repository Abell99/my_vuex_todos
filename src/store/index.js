import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框内容
    inputValue: '',
    // 新的数据结点，当前最大的Id值
    nextId: 5,
    // 控制列表内容显示的选项卡名称
    viewKey: 'all'
  },
  mutations: {
    // 赋值list的函数方法
    initList (state, list) {
      // console.log(list)
      state.list = list
    },
    // 同步更改备注的文本框内容
    setInputValue (state, value) {
      // 将传入的实参value赋值给当前的文本框的内容
      state.inputValue = value
    },
    // 用来添加item到list中去
    addItem (state) {
      // 初始化一个对象，因为每一条信息都是对象形式
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      // 将新声明的对象，拼接到list中，并渲染到页面中去
      state.list.push(obj)
      // 下一个id值进行累加，保证id值不会重复
      state.nextId++
      // 将当前的文本框内容置空，方便下一条数据的输入
      state.inputValue = ''
    },
    // 根据Id值来删除list中的一项
    removeItem (state, Id) {
      // 通过findIndex来查询数组对象的对应索引值
      const i = state.list.findIndex(x => x.id === Id)
      // 根据索引值来删除对应的itme项
      state.list.splice(i, 1)
    },
    // 改变item的选中状态
    checkboxChange (state, Id) {
      // 通过findIndex来查询数组对象的对应索引值
      const i = state.list.findIndex(x => x.id === Id)
      // 根据索引值，设置当前值取反
      state.list[i].done = !state.list[i].done
    },
    // 清除已完成的任务
    cleanDone (state) {
      // 过滤done为false的
      state.list = state.list.filter(x => x.done === false)
    },
    // 变更列表内容选项卡
    changeListIndex (state, Index) {
      state.viewKey = Index
    }
  },
  actions: {
    // 定义一个异步的函数方法
    getList (context) {
      // axios异步请求json文件
      axios.get('/list.json')
        // 在请求返回成功之后，返回data
        .then(({ data }) => {
          // 通过形参调用commit函数，调用mutations中的方法，间接的控制state中的数值的变化
          context.commit('initList', data)
        })
    }
  },
  getters: {
    unDoneLength (state) {
    // 使用过滤器统计未完成的条数
      return state.list.filter(x => x.done === false).length
    },
    // 根据当前的选项卡选项，来按需切换显示内容
    infolist (state) {
      // 由viewKey来决定显示的内容
      if (state.viewKey === 'all') {
        return state.list
      } else if (state.viewKey === 'undone') {
        // 通过过滤器来过滤数据
        return state.list.filter(x => !x.done) // 过滤器根据当前内容是否为true判断是否通过
      } else if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      } else {
        return state.list
      }
    }
  },
  modules: {
  }
})
