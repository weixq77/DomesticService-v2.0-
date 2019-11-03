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
    async findAllWaiters({commit},payload = false) {
      const response = await get('/waiter/findAll');
      // 将顾客信息设置到state.waiters中
      // 使用commit去触发突变，先指定突变名称，再传递一个参数

      // payload 是否开启过滤，
      let tempData = response.data;
      if(payload) {
        tempData = response.data.filter(item => {
          return item.enabled===true
         
       })
       tempData.map(item => {
      
        !item.enabled?item.enabled = "未审核":item.enabled="审核"
        !item.idCard?item.idCard = "无":item.idCard
        !item.bankCard?item.bankCard = "无":item.bankCard
        return true
     })
       console.log(tempData,"过滤过后")
       commit('refreshWaiter',tempData);
      } else {
        tempData.map(item => {
      
          !item.enabled?item.enabled = "未审核":item.enabled="审核"
          !item.idCard?item.idCard = "无":item.idCard
          !item.bankCard?item.bankCard = "无":item.bankCard
          return true
         
       })
       console.log(tempData)
       commit('refreshWaiter',tempData);
      }
      
     
    },

    //保存或修改员工信息
    async saveOrUpdateWaiter({dispatch,commit},{isFilter = false,waiter}){
      //1.提交请求
      const response = await post("waiter/saveOrUpdate",waiter);
      // 2.关闭模态框
      commit("closeModal");
      // 3.刷新页面
      if(isFilter) {
        dispatch('findAllWaiters',true);
      } else {
        dispatch('findAllWaiters');
      }
     
      //4.提示成功
      return response;

    }

    // 通过审批
    // async 
  }
}
