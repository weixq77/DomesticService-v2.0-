// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default { 
  namespaced: true,
  state: {
    products:[]
  },
  getters: {
   
  },
  mutations: {
    // 将后台查询的结果突变到state里的products里
    refreshProducts(state,products){
      state.products = products;
    }
  },
  actions: {
    async findAllProducts(context){
      // 1. ajax查询
      let response = await get("/product/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshProducts",response.data);
    }
  }
}
