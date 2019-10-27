// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
    address: [], // 存放所有的地址信息
  },
  mutations: {
    // 突变函数，唯一修改state的方法
    // 所有突变函数接收的第一个参数都是state
    // 刷新地址信息
    refreshAddress(state, address) {
      // 需要接收一个参数address，state是系统给的
      state.address = address
    }
  },
  actions: {
    // 做异步交互
    // 根据顾客id查询地址信息
    async findCustomerAddressById({commit},id) {
      // context是系统分发给actions的对象，里面包含的commit可以让action去触发突变，让突变去修改state
      const response = await get('/address/findByCustomerId',{ id });
      // 2.将地址信息设置到state.address中
      // 使用commit去触发突变，先指定突变名称，再传递一个参数
      commit('refreshAddress', response.data)
    }
  }
}
