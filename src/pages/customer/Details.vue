<template>
  <div id="customerDetails">
    <!-- 返回顾客管理页面 -->
    <el-row>
      <el-col :span="6">
        <h4>{{ title }}</h4>
      </el-col>
       <el-col :span="2" :offset="16">
        <el-button size="medium" type="text" @click="backHandler">返回</el-button>
      </el-col>
    </el-row>
    <!-- 详情 -->
    <el-tabs v-model="activeName">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="first">
        <el-row>
          <el-col :span="12">
            <el-card :body-style="{ padding: '0px' }">
              <div style="float:left;height:100%;">
                <!-- <img :src="customer.photo" class="image"> -->
                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
              </div>
              <div style="float:left;padding: 14px;">
                <el-form label-width="50px">
                   <el-form-item label="用户名:">
                    <span>{{customer.username}}</span>
                  </el-form-item>
                  <el-form-item label="真实姓名:">
                    <span>{{customer.realname}}</span>
                  </el-form-item>
                  <el-form-item label="号码:">
                    <span>{{customer.telephone}}</span>
                  </el-form-item>
                  <el-form-item label="状态:">
                    <span>{{customer.status}}</span>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- /基本信息 -->
      <!-- 订单信息 -->
      <el-tab-pane label="订单信息" name="second">
        <!-- {{customersOrders}} -->
        <el-table  :data="customersOrders" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="顾客姓名" prop="customerName" align="center"></el-table-column>
          <el-table-column label="员工姓名" prop="waiterName" align="center"></el-table-column>
          <el-table-column label="服务地址" prop="address" align="center"></el-table-column>
          <el-table-column label="订单数量" prop="total" align="center"></el-table-column>
          <el-table-column label="下单时间" :formatter="timestampToTime" prop="orderTime" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- /订单信息 -->
      <!-- 服务地址 -->
      <el-tab-pane label="服务地址" name="third">
        <el-table  :data="address" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="省" prop="province" align="center"></el-table-column>
          <el-table-column label="市" prop="city" align="center"></el-table-column>
          <el-table-column label="区" prop="area" align="center"></el-table-column>
          <el-table-column label="街道" prop="address" align="center"></el-table-column>
          <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- /服务地址 -->
    </el-tabs>
  </div>
</template>

<script>
  //导入封装好的指定的json请求函数
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  // import customer from '../../store/modules/customer';

  export default {
    name:'customerDetails',
    data() {
      return{
        title:'顾客详情',
        activeName:"first", //标签页激活
        CustomerId:'',
      }
      
    },
    //计算属性
    computed: {
      // 映射在vuex中管理的data
      // 顾客的详细信息
      ...mapState('customer',['customer']),
      //顾客的所有订单
      ...mapState('order',["customersOrders"]),
      //顾客的所有服务地址
      ...mapState('address',['address'])

    },
    created() {
      //vue实例初始化完成，可以通过vue访问data和methods
      //获取实现路由跳转时传递的顾客id值
      this.CustomerId = this.$route.query.id;
      this.loadData();
    },
    methods:{
      // 映射store中的突变函数和异步请求的动作
      // 根据顾客id查询顾客所有订单信息
      ...mapActions("order",["loadCustomerOrderData"]),
      //根据顾客id查询地址信息
      ...mapActions("address",["findCustomerAddressById"]),
      
      //普通方法
      // 返回上一页顾客顾客管理页面
      backHandler(){
        this.$router.go(-1);
      },
      //数据加载
      loadData(){
        //根据顾客id查询顾客所有订单信息
        this.loadCustomerOrderData(this.CustomerId);
        //通过id查询顾客地址
        this.findCustomerAddressById(this.CustomerId);
      },
      // 时间转换函数(elementui自动获取行数据row)
      timestampToTime(row, column){
        let datetime = row.orderTime;
        if(datetime){
          datetime = new Date(datetime);
          let y = datetime.getFullYear() + '-';
          let mon = datetime.getMonth()+1 + '-';
          let d = datetime.getDate() + ' ';
          let h = datetime.getHours() + ':'
          let m = datetime.getMinutes() + ':'
          let s = datetime.getSeconds()
          return y + mon + d + h + m + s;
        }
        return ''
      }
    },
  }

</script>

<style scoped>



</style>
