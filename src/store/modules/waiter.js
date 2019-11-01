// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
   waiters:[],//存放当前页所有的顾客信息
   waiter:{},//单个顾客信息
   visible: false, // 控制对话框的显示与关闭
  //  form:{}
  },
  getters: {
    // 过滤员工状态
    waiterStatusFilter(state){
      return function(status){
        return state.waiters.filters((item)=>item.status===status)
      }
    }
    
  },
  mutations: {
    //  刷新顾客信息
    refreshWaiter(state,waiters) {
      state.waiters = waiters;
    },
    //设置单条顾客信息
    SetWaiter(state,waiter){
      state.waiter = waiter;
    },
    // 显示模态框
    showModal(state) {
      state.visible = true
    },
    // 关闭模态框
    closeModal(state) {
      state.visible = false
    },

  },
  actions: {
    //异步交互
    //查询所有顾客信息
    async findAllWaiters(context) {
      const response = await get('/waiter/findAll');
      // 将顾客信息设置到state.waiters中
      // 使用commit去触发突变，先指定突变名称，再传递一个参数
      context.commit('refreshWaiter',response.data);

    },
  }
}
