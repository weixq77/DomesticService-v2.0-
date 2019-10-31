<template>
  <div id="customer">
    <!-- <h4>{{title}}</h4> -->
     <!-- 搜索框、按钮-->
    <el-row :gutter="20" justify="end">
      <!-- 搜索栏 -->
      <el-col :span="12"> 
        <el-form :inline="true">
          <el-form-item label="">
            <el-input size="small" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- /搜索栏 -->
      <!-- 按钮 -->
      <el-col :span="12" style="text-align:right;line-height:40px;height:40px;">
        <el-button size="small" type="primary">添加</el-button>
      </el-col>
    <!-- / 按钮 -->
    </el-row>
    <!-- /搜索 -->

    <!-- 表单数据 -->
    <!-- {{customers}} --><!-- {{customers.list}} //分页显示-->
    <el-table ref="multipleTable" :data="customers" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" align="center" />
      <el-table-column prop="realname" label="姓名" align="center" />
      <el-table-column prop="telephone" label="手机号" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column label="操作" align="center">
        <!-- 通过默认的插槽获取该行的对象值scope.row -->
        <template v-slot:default="scope">
          <!-- 详情 -->
          <a href="" class="el-icon-tickets"  @click.prevent="DetailsHandler(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- /表单数据 -->
  </div>
</template>

<script> 
  // 导入封装好的指定json请求函数
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  export default {
    name:'customer',
    data() {
      return {
        title:'顾客管理',

      }
    },
    //计算属性
    computed:{
      // 映射在vuex中管理的data
      // 查询所有顾客信息
      ...mapState("customer",["customers"])
    },
    created(){
      this.findAllCustomers();
    },
    methods:{
      //  映射store中的突变函数和异步请求的动作
      //查询所有顾客信息
      ...mapActions("customer",["findAllCustomers"]),
      //设置顾客单条信息
      ...mapMutations('customer', ['SetCustomer']),

      //查看顾客详情信息
      DetailsHandler(customer){
        // 设置顾客单条信息
        this.SetCustomer(customer);
        //跳转详情页面
        this.$router.push({
          path:'/customer/details',
          query:{id:customer.id}
        })
      },
      
      
     
      
    },
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
