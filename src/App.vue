<template>
  <div id="app">
    <a-input :value="inputValue" @change="handleInputChange" placeholder="请输入任务" class="my_ipt" />
    <a-button type="primary" @click="addItemToList">添加事项</a-button>
    <a-list bordered :dataSource="infolist" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox @change="handleCheckboxChange(item.id)" :checked="item.done">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>
      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary': ''" @click="changList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary': ''" @click="changList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary': ''" @click="changList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
// 按需导入所需要的函数方法
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  // 计算机属性,在这里用来映射state和getters
  computed: {
    // 映射state
    ...mapState(['list', 'inputValue', 'viewKey']),
    // 映射处理过的数据
    ...mapGetters(['unDoneLength', 'infolist'])
  },
  methods: {
    // 异步函数映射
    ...mapActions(['getList']),
    // 映射函数，用来改变数据源数据值
    ...mapMutations(['setInputValue', 'addItem', 'removeItem', 'checkboxChange', 'cleanDone', 'changeListIndex']),

    // 同步改变备注输入框的内容
    handleInputChange (e) {
      // 通过e.target.value获取当前文本框的内容
      this.setInputValue(e.target.value)
    },
    // 向列表中新增 item 项
    addItemToList () {
      // 判断文本框内容，如果文本框为空，则返回一条提示信息
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框不能为空')
      }
      // 如果文本框内容不为空，则调用mutations中的函数，从而来操作数据源内容
      this.addItem()
    },
    // 根据Id值从列表中删除 item 项
    removeItemById (Id) {
      // 调用mutations函数来改变数据源数据
      this.removeItem(Id)
    },
    // 选中状态的更改
    handleCheckboxChange (Id) {
      // 调用mutations函数来改变数据源数据
      this.checkboxChange(Id)
    },
    // 清除已完成的任务
    clean () {
      this.cleanDone()
    },
    // 改变列表内容选项卡
    changList (Index) {
      this.changeListIndex(Index)
    }
  },
  created () {
    // 在加载页面的时候,发起请求,获取原始数据
    this.getList()
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
