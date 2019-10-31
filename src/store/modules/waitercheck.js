// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
   waiters:[],//员工的状态
  },
  getters: {
    //过滤员工的状态
    // waiterStatusFilter(state){
    //   //对员工的状态进行过滤
    //   return function(status){   
    //   }
    //}

  },
  mutations: {
    //  刷新员工信息
    refreshWaiter(state,waiters) {
      state.waiters = waiters;
    },
    // 设置单条员工信息
    SetWaiter(state,waiter) {
      state.waiter = waiter;
    },
  },
  actions: {
   //异步交互 
    
    //查询所有员工信息
    async findAllWaiters(context) {
      const response = await get('/waiter/findAll');
      // 将员工信息设置到state.waiters中
      // 使用commit去触发突变，先指定突变名称，再传递一个参数
      context.commit('refreshWaiter',response.data);
    },

  }
}