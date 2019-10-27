import { get, post, post_array } from '@/http/axios'
export default {
    namespaced: true,
    state:{
        orders: [], // 存放所有的订单信息
        waiters:[], //存放所有员工信息
        visible: false,
        visible_takeorder: false,
        params: {
            // 存放分页查询所需的参数
            page: 0, // 第几页
            pageSize: 7,
        },
        customersOrders:[]//存放指定顾客的所有订单信息
    },
    getters:{
        conuntOrders(state) {
            // 统计订单的个数
            return state.orders.length
          },
        // 需要为获取器传递参数的写法
        orderStatusFilter(state) {
            // 对订单的状态进行过滤
            return function(status) {
            if (status) {
                // 如果传递的状态存在则返回过滤
                return state.orders.filter(item => item.status === status)
            } else {
                // 不存在返回全部
                return state.orders
            }
            }
        }
    },
    mutations:{
        // 突变函数，唯一修改state的方法
        // 刷新订单信息
        refreshOrder(state, orders) {
        // 需要接收一个参数orders，state是系统给的
            state.orders = orders
        },
        // 刷新指定顾客的所有订单
        refreshCustomerOrder(state, orders) {
            // 需要接收一个参数orders，state是系统给的
            state.customersOrders = orders
        },
        refreshWaiter(state, waiters) {
            // 需要接收一个参数orders，state是系统给的
                state.waiters = waiters
        },
        // 打开派单模态框
        showModal(state) {
            state.visible = true
          },
        // 关闭派单模态框
        closeModal(state) {
            state.visible = false
          },
        // 打开接单模态框
        showModal_takeorder(state) {
        state.visible_takeorder = true
        },
        // 关闭接单模态框
        closeModal_takeorder(state) {
            state.visible_takeorder = false
        }
    },
    actions: {
        // 查询所有订单信息
        // async findAllCustomers({commit,dispatch,getters,state}){
        async findAllOrders(context) {
            // context是系统分发给actions的对象，里面包含的commit可以让action去触发突变，让突变去修改state
            const response = await get('/order/findAll')
            // 2.将订单信息设置到state.customers中
            // 使用commit去触发突变，先指定突变名称，再传递一个参数
            context.commit('refreshOrder', response.data)
        },
        // 查询所有员工信息
        // async findAllCustomers({commit,dispatch,getters,state}){
        async findAllWaiter(context) {
            // context是系统分发给actions的对象，里面包含的commit可以让action去触发突变，让突变去修改state
            const response = await get('/waiter/findAll')
            // 2.将订单信息设置到state.customers中
            // 使用commit去触发突变，先指定突变名称，再传递一个参数
            context.commit('refreshWaiter', response.data)
        },
        // 派单操作
        async sendOrder({ dispatch, commit }, form){
            // context是系统分发给actions的对象，里面包含的commit可以让action去触发突变，让突变去修改state
            const response = await get('/order/sendOrder',form)
             // 2. 关闭模态框
            commit('closeModal')
            dispatch('loadOrderData')
            return response;
        },
        // 接单操作
        async takeOrder({ dispatch, commit }, form){
        // context是系统分发给actions的对象，里面包含的commit可以让action去触发突变，让突变去修改state
        const response = await get('/order/takeOrder',form)
        // 2. 关闭模态框
        commit('closeModal_takeorder')
        // 3.刷新页面 
        dispatch('loadOrderData')
        // 4.提示成功
        return response;
        },
        // 根据id删除订单信息
        async deleteOrderById({ dispatch }, id) {
            // 1.删除订单信息
            const response = await get('/order/deleteById', { id })
            // 2.刷新(再用dispatch去触发获取一遍数据)
            dispatch('loadOrderData')
            // 3.提示成功
            return response
        },
        // 批量删除订单信息
        async batchDeleteOrders({ dispatch }, ids) {
            const response = await post_array('/order/batchDelete', ids)
            dispatch('loadOrderData')
            return response
        },
        async loadOrderData({ state, commit }) {
            // 1.  传递分页查询所需的参数
            // console.log("params======>",state.params)
            const response = await post('/order/queryPage', state.params)
            commit('refreshOrder', response.data)
        },
        // 获取指定顾客的所有信息
        async loadCustomerOrderData({ state, commit },id) {
            // 1.  传递分页查询所需的参数
            // console.log("params======>",state.params)
            const response = await get('/order/queryBasic', {customerId:id})
            commit('refreshCustomerOrder', response.data)
        },
          
    }
}
