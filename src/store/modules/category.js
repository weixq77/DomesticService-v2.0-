// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default { 
  namespaced: true,
  state: {
    categories:[]
  },
  getters: {
   
  },
  mutations: {
    // 将后台查询的结果突变到state里的Categories里
    refreshCategories(state,categories){
      state.categories = categories;
    }
  },
  actions: {
    async findAllCategories(context){
      // 1. ajax查询
      let response = await get("/category/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshCategories",response.data);
    }
  }
}