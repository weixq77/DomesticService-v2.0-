// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
   waiters:[],//存放当前页所有的顾客信息
   waiter:{},//单个顾客信息
  },
  getters: {
   
    
  },
  mutations: {
    //  刷新顾客信息
    refreshWaiter(state,waiters) {
      state.waiters = waiters;
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

    }
  }
}
