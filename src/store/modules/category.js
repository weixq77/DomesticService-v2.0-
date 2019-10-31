// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default { 
  namespaced: true,
  state: {
    categories:[],  //存放所有栏目信息
    visible: false, // 控制对话框的显示与关闭
    title:"添加栏目信息", //设置标题
  },
  getters: {
   
  },
  mutations: {
    // 将后台查询的结果突变到state里的Categories里
    refreshCategories(state,categories){
      state.categories = categories;
    },
    // 显示模态框
    showModal(state) {
      state.visible = true
    },
    // 关闭模态框
    closeModal(state) {
      state.visible = false
    },
    // 设置模态框标题
    setTitle(state,title){
      state.title = title;
    }
  },
  actions: {
    async findAllCategories(context){
      // 1. ajax查询
      let response = await get("/category/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshCategories",response.data);
    },
    // 删除栏目信息
    async deleteCategoriesById(context, id){
      let response = await get("/category/deleteById", {id});
      context.dispatch("findAllCategories");
      return response;
    },
    // 批量删除栏目信息
    async batchDeleteCategories({ dispatch }, ids) {
      const response = await post_array('/category/batchDelete', ids)
      dispatch('findAllCategories')
      return response
    },
    // payload 保存或更新顾客信息
    async saveOrUpdateCategory({commit,dispatch},payload){
      // 1. 保存或更新
      let response = await post("/category/saveOrUpdate",payload)
      // 2. 刷新页面
      dispatch("findAllCategories");
      // 3. 关闭模态框
      commit("closeModal");
      // 4. 提示
      return response;
    }
  }
}