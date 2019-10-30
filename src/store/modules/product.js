// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default { 
  namespaced: true,
  state: {
    visible: false, // 控制对话框的显示与关闭
    products:[], //存放所有产品信息
    title:"添加产品信息", //设置标题
    product:{} //当前产品信息
  },
  getters: {
   
  },
  mutations: {
    // 将后台查询的结果突变到state里的products里
    refreshProducts(state,products){
      state.products = products;
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
    },
    // 获取单个产品信息
    refreshProduct(state,product){
      state.product = product;
    }
  },
  actions: {
    // 根据id查询产品信息
    async findProductById(context,id){
      const response = await get('/product/findById',{id});
      context.commit('refreshProduct',response.data)
    },
    // 查询所有产品信息
    async findAllProducts(context){
      // 1. ajax查询
      let response = await get("/product/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshProducts",response.data);
    },
    // 删除产品信息
    async deleteProductsById(context, id){
      let response = await get("/product/deleteById", {id});
      context.dispatch("findAllProducts");
      return response;
    },
    // 批量删除产品信息
    async batchDeleteProducts({ dispatch }, ids) {
      const response = await post_array('/product/batchDelete', ids)
      dispatch('findAllProducts')
      return response
    },
    // payload 保存或更新顾客信息
    async saveOrUpdateProduct({commit,dispatch},payload){
      // 1. 保存或更新
      let response = await post("/product/saveOrUpdate",payload)
      // 2. 刷新页面
      dispatch("findAllProducts");
      // 3. 关闭模态框
      commit("closeModal");
      // 4. 提示
      return response;
    }
  }
}
