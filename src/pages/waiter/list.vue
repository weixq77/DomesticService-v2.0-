<template>
  <div id="waiter">
    <!-- <h4>{{title}}</h4> -->
    <!-- 搜索框、添加按钮-->
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
      <!-- 按钮 -->
      <el-col :span="12" style="text-align:right;line-height:40px;height:40px;">
        <!-- <el-button size="small" type="primary">添加</el-button> -->
        <el-button type="danger" size="small">批量禁封</el-button>
      </el-col>
    <!-- / 按钮 -->
    </el-row>
    
    <!-- /搜索 -->
    <!-- {{waiters}} -->
    <!-- 表单数据 -->
    <el-table ref="multipleTable" :data="waiters" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" width="55" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="realname" label="真实名字" align="center" />
      <el-table-column prop="telephone" label="手机号" align="center" />
      <el-table-column prop="idCard" label="身份证号" align="center" />
      <el-table-column prop="bankCard" label="银行卡号" align="center" />
      <el-table-column prop="registerTime" label="注册时间" align="center" />
      <el-table-column prop="enabled" label="审批" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column label="详情" width="55" align="center">
        <template v-slot:default="scope">
          <!-- 详情 -->
          <a href="" class="el-icon-tickets" @click.prevent="DetailsHandler(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <!-- 通过默认的插槽获取该行的对象值scope.row -->
        <template v-slot:default="scope">
          <el-button type="danger" plain round size="small" @click="forbiddenWaiter(scope.row)">禁封</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表单数据 -->
    <!-- 对话框 -->
    <el-dialog title="禁封" :visible="visible" width="40%" @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="waiterForm">
        <el-form-item label="禁封原因" label-width="80px" prop="forbiddenReason">
          <el-input v-model="form.forbiddenReason" auto-complete="off" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="forbidden">确定禁封</el-button>
      </div>
    </el-dialog>
    <!-- 对话框结束 -->
  </div>
</template>

<script> 
  // 导入封装好的指定json请求函数
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  export default {
    name:'Waiter',
    data() {
      return {
        title:'员工管理',
        form:{
          forbiddenReason: ''
        },  //存放禁封原因
        rules:{ //表单验证
          forbiddenReason:[
            {required:true,message:'请输入禁封理由',trigger: 'blur'},
            {min:2,max:200,message:'长度在 1 到 200个字符',trigger: 'blur'}
          ]
        },

      }
    },
    //计算属性
    computed:{
      // 映射在vuex中管理的data
      // 查询所有员工信息，控制模态框的显示与关闭
      ...mapState("waiter",["waiters","visible"]),
      //显示模态框，关闭模态框，
      //禁封员工
      // ...mapActions("waiter",[])
    },
    created(){
      this.findAllWaiters(true);
    },
    methods:{
      //  映射store中的突变函数和异步请求的动作
      ...mapMutations("waiter",["showModal","closeModal"]),
      //查询所有员工信息
      ...mapActions("waiter",["findAllWaiters","saveOrUpdateWaiter"]),
  
      //查看员工详情信息
      DetailsHandler(waiter){
        //跳转详情页面
        this.$router.push({
          path:'/waiter/details',
          query:{id:waiter.id}
        })
      },
      //绑定禁封员工按钮,点击禁封打开模态框
      forbiddenWaiter(row){
        console.log(row)
        this.form = row;
        this.showModal(); // 显示模态框
      },
      //fun:关闭模态框的回调函数
      closeDialog(){
        this.form = {};
        this.closeModal();
      },
      // fun:修改员工的状态
      // updateWaiterStatus($event,waiter){
      // },
      //确定禁封员工，提交禁封理由
      forbidden(){
        // 1.校验表单
        this.$refs.waiterForm.validate((valid)=>{
          // 如果校验通过
          if(valid){
            // alert(valid);
            // 2.提交表单
            this.saveOrUpdateWaiter({
              waiter: Object.assign(
                this.form
              ,{enabled: false}),
              isFilter: true
            })
            .then((response)=>{
              // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
              this.$message({type:"success",message:response.statusText});
            })
          } else {
            return false;
          }
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
