// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
   customers:[],//存放当前页所有的顾客信息
   customer:{},//单个顾客信息
  },
  getters: {
   
    
  },
  mutations: {
    //  刷新顾客信息
    refreshCustomer(state,customers) {
      state.customers = customers;
    },
    // 设置单条顾客信息
    SetCustomer(state,customer) {
      state.customer = customer;
    },
  },
  actions: {
    //异步交互 
    
    //查询所有顾客信息
    async findAllCustomers(context) {
      const response = await get('/customer/findAll');
      // 将顾客信息设置到state.customers中
      // 使用commit去触发突变，先指定突变名称，再传递一个参数
      context.commit('refreshCustomer',response.data);
    },

  }
}
