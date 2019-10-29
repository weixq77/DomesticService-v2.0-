<template>
  <div id="customer">
    <h4>{{ title }}</h4>
    <!-- 按钮和搜索栏 gutter=20栅格间隔-->
    <el-row :gutter="20" justify="end">
      <!-- 添加 删除按钮 -->
      <el-col :span="6">
        <div>
          <el-button type="primary" size="small" plain @click="addCustomer">添加</el-button>
          <el-button type="danger" size="small" plain @click.prevent="deleteCustomer()">批量删除</el-button>
        </div>
      </el-col>
      <!-- 搜索 -->
      <!-- {{name}} -->
      <el-col :span="8" :offset="10">
        <el-form :inline="true" class="search" size="small" @submit.native.prevent>
          <el-form-item style="width:80px;">
            <el-select v-model="typeTag" placeholder="姓名" @change="typeChange">
              <el-option label="姓名" value="realname" />
              <el-option label="号码" value="telephone" />
            </el-select>
          </el-form-item>
          <el-form-item style="width:180px;">
             <el-input
              v-if="typeTag == 'telephone'"
              v-model="tel"
              placeholder="请输入内容"
              key="telephone-input"
              @keyup.enter.native="searchFind"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
            <el-input
              v-else
              v-model="name"
              placeholder="请输入内容"
              key="name-input"
              @keyup.enter.native="searchFind"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
           

          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="searchFind">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <!-- <a href="" class="el-icon-refresh-right" @click.prevent="referData" /> -->
            <a href="" class="el-icon-refresh" @click.prevent="referData" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 按钮和搜索栏结束 -->

    <!-- 列表显示表格
        selection-change  当行或者checkbox被选中时发生的事件
       -->
    <div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="customers.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="SelectChangeHandle"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="realname" label="姓名" align="center" />
        <el-table-column prop="telephone" label="号码" align="center" />
        <el-table-column prop="photo" label="头像" align="center" />
        <el-table-column prop="status" label="当前状态" align="center" />
        <el-table-column label="状态" align="center">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="正常"
              inactive-text=""
              active-value="正常"
              inactive-value="不正常"
              @change="updateCustomerStatus($event,scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!-- 通过默认的插槽获取该行的对象值scope.row -->
          <template v-slot:default="scope">
            <!-- 删除 -->
            <a href="" class="el-icon-delete" @click.prevent="deleteCustomer(scope.row.id)" />
            <span class="blank_margin" />
            <!-- 修改 -->
            <a href="" class="el-icon-edit-outline" @click.prevent="editCustomer(scope.row)" />
            <span class="blank_margin" />
            <!-- 详情 -->
            <a href="" class="el-icon-tickets" @click.prevent="DetailsHandler(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 列表显示表格结束 -->

    <!-- 分页按钮
        @current-change 当前页数改变的函数
        :current-page   当前页数(后台的页数从0开始，使用动态属性绑定)
        :page-size      每页显示具体条目数(使用动态属性绑定,pageSize为后台返回的数据)
        layout          组件布局，子组件名用逗号分隔
        :total          总条目数(后台返回数据total)
       -->
    <div class="mypages">
      <el-pagination
        background
        :current-page="params.page+1"
        :page-size="customers.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="customers.total"
        @current-change="CurrentPageChangeHandle"
      />
    </div>
    <!-- 分页按钮 -->

    <!-- 对话框 -->
    <el-dialog title="添加/修改顾客信息" :visible="visible" width="40%" @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="customerForm">
        <!-- {{form}} -->
        <el-form-item label="姓名" label-width="60px" prop="realname">
          <el-input v-model="form.realname" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="60px" prop="telephone">
          <el-input v-model="form.telephone" auto-complete="off" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框结束 -->
  </div>
</template>

<script>
// 导入封装好的指定json请求函数
// import {post,get,post_array} from '../http/axios.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Customer',
  data() {
    return {
      title: '顾客管理',
      typeTag: 'realname', // 存放搜索类型realname和telephone
      selectedDelete: [], // 存放批量删除的id的数组
      name: '', // 存放按照realname搜索的内容
      tel: '', // 存放按照telephone搜索的内容
      form: {},// 存放添加或修改的单个顾客信息
      rules:{//表单验证规则
        realname:[
          {required:true,message:'请输入姓名',trigger: 'blur'},
          {min:2,max:10,message:'长度在 2 到 10 个字符',trigger: 'blur'}
        ],
        telephone:[
          {required:true,message:'请输入手机号',trigger: 'blur'},
          {min:11,max:11,message:'长度为11个字符',trigger: 'blur'}
        ]
      }
    }
  },
  computed: {// 计算属性
    // 映射在vuex中管理的data
    // 第一个customer是绑定store中customer的模块
    // 全部顾客信息，控制模态框显示与关闭的属性,分页查询需要的参数,加载时的旋转圈
    ...mapState('customer', ['customers', 'visible', 'params','loading']),
    // 计算顾客信息总数，根据顾客状态过滤信息
    ...mapGetters('customer', ['countCustomers', 'customerStatusFilter'])
    // 普通data
  },
  created() {
    //   vue实例初始化完成，可以通过vue访问data和methods
    // 需要传递分页查询所需的参数
    this.loadData()// store中的异步请求的动作
  },
  methods: {
    // 映射store中的突变函数和异步请求的动作
    // 分页查询顾客信息，根据id删除顾客信息，修改保存顾客信息，批量删除顾客信息
    ...mapActions('customer', ['loadCustomerData', 'deleteCustomerById', 'saveOrUpdateCustomer', 'batchDeleteCustomers']),
    // 显示模态框，关闭模态框,根据名字查询，跟号码查询,设置单条顾客信息
    ...mapMutations('customer', ['showModal', 'closeModal', 'searchByName', 'searchByTel','SetCustomer']),

    // 普通方法
    //   fun:当多选的checkbox发生变化时将选中的当前行id添加到被选中批量删除的数组中
    SelectChangeHandle(val) {
    //    每一次checkbox发生变化都先将这个变量值清空
      this.selectedDelete = val.map(item => item.id)
    },
    // fun:关闭模态框的回调函数
    closeDialog() {
      this.form = {}
      this.closeModal()
    },
    // 刷新数据
    referData(){
      // 可以清空之前搜索留下的内容，也可以起到刷新的作用
      this.params.realname = '';
      this.params.telephone = '';
      this.name = '';
      this.tel = '';
      this.loadData();
    },
    // fun:分页加载数据
    loadData() {
      this.loadCustomerData()
    },
    // 搜索的类型发生改变的时候调用的函数
    typeChange(){
      // 若当前类型为realname
      if(this.typeTag == 'realname'){
        // 清空输入tel的inpu值
        this.tel = '';
      }else if(this.typeTag == 'telephone'){
        // 清空输入realname的inpu值
        this.name = '';
      }
    },
    // fun：搜索查询
    searchFind(){
      // 判断是否有根据名字或者号码进行查询
      // 每次搜索前先将搜索的page页数设置为0，也就是从第一页开始搜索
      this.params.page=0;
      // 判断name是否有内容有就是按照名字查询
      if (this.name) {
        // alert(this.name)
        this.searchByName(this.name)
      } else if (this.tel) {
        // 如果name没有内容查看tel是否有内容，有按照tel查询
        this.searchByTel(this.tel)
      }else{
        // 如果名字和号码都没有内容则不是模糊查询都设置为空
        // 因为这个函数有设置tel为空，所以只需设置一个即可
        this.searchByName("")
      }
      this.loadData();
    },
    //   fun：删除信息(有id为单个删除，无id为批量删除)
    deleteCustomer(id) {
      //   先询问是否确认删除(element-ui)
      this.$confirm('此操作将永久删除信息,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除执行
        let p
        // 判断是单个删除还是批量删除
        if (id) {
          // 有id，单删
          // console.log("有",id);
          p = this.deleteCustomerById(id)// 映射action里的
        } else {
          // 无id,批量删除
          // console.log("无");
          p = this.batchDeleteCustomers(this.selectedDelete)// 映射action里的
          // console.log(p);
        }
        p.then((response) => {
          // 删除成功，弹出提示 element-ui
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
          // 当后台删除失败时
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      }).catch((error) => {
        console.log(error)
        // 捕获取消删除的错误或者出错的信息
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //   fun:当分页的当前页发生了改变
    CurrentPageChangeHandle(currentPage) {
      //   将存放分页查询所需的参数值改变(后台分页从0开始，所以查询时比实际页数少1)
      this.params.page = currentPage - 1;
      // 再次刷新获取数据
      this.loadData()
    },
    // fun: 添加信息
    addCustomer() {
      // 添加信息
      this.form = {}
      this.showModal() // 显示模态框
    },
    // fun: 修改信息
    editCustomer(row) {
      // 添加信息
      this.form = row
      this.showModal() // 显示模态框
    },
    // fun:保存与修改数据
    submitHandler() {
      // 1.校验表单
      this.$refs.customerForm.validate((valid)=>{
        // 如果校验通过
        if(valid){
          // alert(valid);
          // 2.提交表单
          this.saveOrUpdateCustomer(this.form)
          .then((response)=>{
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({type:"success",message:response.statusText});
          })
        } else {
          return false;
        }
      })
    },
    // fun:查看顾客详情信息
    DetailsHandler(customer){
      // 设置顾客单条信息
      this.SetCustomer(customer);
      //跳转到详情页面
      // this.$router.push("/customerDetails")
      this.$router.push({
        path:'/customer/details',
        query:{id:customer.id}
      })
    },
    // fun:修改顾客的状态
    updateCustomerStatus($event,customer){
      // 修改form表单对象
      this.form = customer;
      // 调用保存修改fun更新顾客状态
      this.saveOrUpdateCustomer(this.form)
      .then((response)=>{
        // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
        this.$message({type:"success",message:response.statusText});
      })
    }
  }
}
</script>

<style scoped>
h4{
  margin: 10px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
/* 设置搜索边框颜色 */
.el-input__inner{
    border-color: #ACC2F4 !important;
}
/* 设置表头文字颜色 */
.el-table thead {
    color: rgb(88, 88, 89) !important;
}
/* 分页按钮 */
.mypages{
    margin-top:20px;
}
/* 搜索框 */
.search .el-form-item {
    margin-bottom: 5px !important;
}
/* a标签间隔 */
span.blank_margin{
  margin:10px;
}

</style>
