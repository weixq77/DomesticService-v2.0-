<template>
    <div class="waiterCheck">
        
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
        <el-button type="danger" size="small">批量审核</el-button>
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
      <el-table-column prop="forbiddenReason" label="禁封原因" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column label="详情"  width="55" align="center" @click="waiterDetail">
        <template v-slot:default="scope">
          <!-- 详情 -->
          <a href="" class="el-icon-tickets"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <!-- 通过默认的插槽获取该行的对象值scope.row -->
        <template v-slot:default="scope">
          <el-button type="success" plain round size="small">通过</el-button>
          <el-button type="danger" plain round size="small">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表单数据 -->
    <!-- 对话框 -->
    <el-dialog title="员工详情" :visible="visible" @close="closeDialog">
      <el-table :data="gridData">
        <el-table-row property="realname" label="真实姓名"></el-table-row>
        <el-table-row property="username" label="用户名" ></el-table-row>
        <el-table-row property="telephone" label="手机号"></el-table-row>
      </el-table>
    </el-dialog>
    <!-- 对话框结束 -->
  </div>
</template>
<script>

import {mapState,mapGetters,mapMutations,mapActions} from "vuex"

export default {
  name:"waiterCheck",
  data(){
      return {
          title:"员工审核",
          waiter:{},
          gridData:{}//存放员工详情
          
      }
  },
  //计算属性
  computed:{
    // 映射在vuex中管理的data
    // 查询所有员工信息，控制模态框的显示与关闭
    ...mapState("waiter",["waiters","visible"]),
     //显示模态框，关闭模态框，
      ...mapMutations("waiter",["showModal","closeModal"]),
  },
  created(){
    this.findAllWaiters();
  },
  methods:{
    //  映射store中的突变函数和异步请求的动作
    //查询所有员工信息
    ...mapActions("waiter",["findAllWaiters"]),
  
  // fun:关闭模态框的回调函数
  closeDialog() {
    this.gridData = {}
    this.closeModal(); //关闭模态框
  },
  //绑定详情按钮，点击详情打开详情模态框
  waiterDetail(row){
    this.gridData = row;
    this.showModal(); // 显示模态框
  },
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
