// import request from '@/utils/request'
import {get,post,post_array} from "@/http/axios";
export default {
  namespaced:true,
  state:{
    visible:false,
    categories:[],//存放当前页的栏目信息
    // ids:[],
    title:"添加栏目信息",
    params:{
      page:0,
      pageSize:5,
      name:'',
      num:''
    },
    categoryFistList:[],//存放一级栏目的信息
  },
  getters:{
    countCategories:(state)=>{
      return state.categories.length;
    },
    // 需要为获取器传递参数的写法
    categoryStatusFilter:(state)=>{
      return function(status){
        if(status){
          return state.categories.filter(item=>item.status===status)
        } else {
          return state.categories;
        }
      }
    }
  },
  mutations:{
    // 显示模态框
    showModal(state){
      state.visible = true;
    },
    // 关闭模态框
    closeModal(state){
      state.visible = false;
    },
    // 需要接受一个参数，这个参数就是categories
    refreshCategories(state,categories){
      // console.log('state->',state.categories);
      // 修改当前页的栏目信息
      state.categories = categories;
      
    },
    // 需要接受一个参数，这个参数就是categories
    refreshCategoryFistList(state,categories){
      // 修改一级的栏目信息
      state.categoryFistList = categories.filter(item=>item.parentId == null); 
    },
    // 模态框标题
    setTitle(state,title){
      state.title = title;
    },
    // 根据栏目名称查询
    searchByName(state,name){
      state.params.name = name;
      state.params.num = ''
    },
    // 根据序号查询
    searchByNum(state,num){
      state.params.num = num;
      state.params.name = ''
    }
  },

  actions:{
    // 查询栏目信息
    async findAllCategories(context){
      // console.log("context->",context);
      // 1. 查询所有栏目信息
      let response = await get("/category/findAll");
      // 2. 将栏目信息设置到state.categories中
      context.commit("refreshCategoryFistList",response.data)
    },
    
    async loadCategoryData({state,commit,dispatch}){
      // 每次模糊查询先将page设置为0，不然有一些显示不了
      if(state.params.name || state.params.num){
        state.params.page = 0;
      }
      let response = await post("/category/query",state.params);
      // state.categories = response.data;
      // alert(response.data);
      commit('refreshCategories',response.data);
      // 查询全部栏目信息获取一级栏目
      dispatch('findAllCategories');
    },

    // 根据id删除
    async deleteCategoryById({state,dispatch},id){
       // 先判断当前删除的是否为当前页最后一条，如果是，则查询页减一
       if((state.categories.total%state.params.pageSize)==1){
        state.params.page--;
        }
      // 1. 删除栏目信息
      let response = await get("/category/deleteById",{id});

      // 2. 刷新
      dispatch("loadCategoryData")
      // 3. 提示成功
      return response;
    },

    // 批量删除
    async batchDeleteCategory({state,dispatch},ids){
      // 先判断当前删除的是否为当前页最后一条，如果是，则查询页减一
      if(((state.categories.total-ids.length)%state.params.pageSize)==0){
        state.params.page--;
      }
      let response = await post_array("/category/batchDelete",ids);
      dispatch("loadCategoryData")
      return response;
    },

    // 提交保存
    async saveOrUpdateCategory({dispatch,commit},category){
       
      // 1. 提交请求
      let response = await post("/category/saveOrUpdate",category)
      // 2. 关闭模态
      commit("closeModal");
      // 3. 刷新页面
      dispatch("loadCategoryData");
      // 4. 提示成功 react
      return response;
    }
  }
}