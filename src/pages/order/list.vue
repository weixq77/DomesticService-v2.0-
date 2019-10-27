<template>
   <div id="order">
        <h4>{{ title }}</h4>
        <!-- 按钮和搜索栏 gutter=20栅格间隔-->
        <el-row :gutter="20" justify="end">
        <!-- 添加 删除按钮 -->
        <el-col :span="6">
            <div>
            <el-button type="primary" size="small" plain @click="addOrder">派单</el-button>
            <el-button type="primary" size="small" plain @click="addtakeOrder">接单</el-button>
            <el-button type="danger" size="small" plain @click.prevent="deleteOrder()">批量删除</el-button>
            </div>
        </el-col>
        <!-- 搜索 -->
        <!-- {{name}} -->
        <el-col :span="8" :offset="10">
            <el-form :inline="true" size="small" >
            <!-- <el-form-item style="width:80px;">
                <el-select placeholder="类型">
                <el-option label="姓名" value="" />
                <el-option label="号码" value="" />
                </el-select>
            </el-form-item> -->
            <el-form-item style="width:180px;">
                <el-input
                placeholder="请输入内容"
                >
                <i slot="prefix" class="el-input__icon el-icon-search" />
                </el-input>
                <!-- <el-input
                v-else
                v-model="tel"
                placeholder="请输入内容"
                >
                <i slot="prefix" class="el-input__icon el-icon-search" />
                </el-input> -->
            </el-form-item>
            <el-form-item>
                <el-button>搜索</el-button>
            </el-form-item>
            </el-form>
        </el-col>
        </el-row>
        <!-- 按钮和搜索栏结束 -->
        <div>
            <el-table
                ref="multipleTable"
                height="384px"
                tooltip-effect="dark"
                style="width: 100%"
                :data="orders.list"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderTime" label="下单时间" align="center" />
                <el-table-column prop="total" label="总数" align="center" />
                <el-table-column prop="status" label="状态" align="center" />
                <el-table-column label="操作" align="center">
                <!-- 通过默认的插槽获取该行的对象值scope.row -->
                <template v-slot:default="scope">
                    <!-- 删除 -->
                    <a href="" class="el-icon-delete" @click.prevent="deleteOrder(scope.row.id)"/>
                    <span class="blank_margin" />
                    <!-- 详情 -->
                    <a href="" class="el-icon-tickets"/>
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
             :page-size="orders.pageSize"
             :total="orders.total"
            layout="total, prev, pager, next, jumper"
            @current-change="CurrentPageChangeHandle"
        />
        </div>
        <!-- 分页按钮 -->
        <!-- 派单对话框 -->
        <el-dialog title="添加派单信息" :visible="visible" width="40%" @close="closeModal">
            <el-form :model="form">
                <el-form-item style="width:300px;" label="员工" label-width="100px">
                    <el-select v-model="form.waiterId" placeholder="请选择员工">
                        <el-option :label="c.realname" v-for="c in waiters" :value="c.id" :key="c.id"/>
                    </el-select>
                </el-form-item> 
                <el-form-item style="width:300px;" label="订单id" label-width="100px">
                    <el-select v-model="form.orderId" placeholder="请选择订单id">
                        <el-option label="" v-for="c in orders.list" :value="c.id" :key="c.id"/>
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="submitHandler">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 对话框结束 -->
        <!-- 接单对话框 -->
        <el-dialog title="添加接单信息" :visible="visible_takeorder" width="40%" @close="closeModal_takeorder">
                {{form}}
            <el-form :model="form">
                <el-form-item style="width:300px;" label="员工" label-width="100px">
                    <el-select v-model="form.waiterId" placeholder="请选择员工">
                        <el-option :label="c.realname" v-for="c in waiters" :value="c.id" :key="c.id"/>
                    </el-select>
                </el-form-item> 
                <el-form-item style="width:300px;" label="订单id" label-width="100px">
                    <el-select v-model="form.orderId" placeholder="请选择订单id">
                        <el-option label="" v-for="c in orders.list" :value="c.id" :key="c.id"/>
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal_takeorder">取 消</el-button>
                <el-button type="primary" @click="submit_takeOrderHandler">确 定</el-button>
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
    name: 'Order',
    data(){
        return{
            title: '订单管理',
            selectedDelete: [],// 存放批量删除的id的数组
            form:{}// 存放派单接单信息
        }
    },
    computed:{
        // 计算属性
        // 映射在vuex中管理的data
        // 第一个customer是绑定store中customer的模块
         ...mapState('order', ['orders','waiters','params','visible','visible_takeorder']),
         // 计算订单信息总数，根据订单状态过滤信息
         ...mapGetters('order',['conuntOrders','orderStatusFilter'])
         
    },
    created(){
        this.loadOrderData();
        // this.findAllOrders()
        this.findAllWaiter();
    },
    methods:{
        ...mapMutations('order', ['showModal', 'closeModal','showModal_takeorder','closeModal_takeorder']),
        ...mapActions('order', ['findAllOrders','findAllWaiter',
        'loadOrderData','deleteOrderById','batchDeleteOrders','takeOrder','sendOrder']),
        // fun:当分页的当前页发生了改变
        CurrentPageChangeHandle(currentPage) {
        // 将存放分页查询所需的参数值改变(后台分页从0开始，所以查询时比实际页数少1)
        this.params.page = currentPage - 1
        // 再次刷新获取数据
        this.loadOrderData()
        },
        // 控制打开派单模态框
        addOrder(){
            this.form = {}
            this.showModal() // 显示派单模态框
        },
          // 控制打开接单模态框
        addtakeOrder(){
            this.form = {}
            this.showModal_takeorder() //显示接单模态框
        },
         // fun:筛选代派单/接单数据
        loadData(){
            
        },
        //fun：删除信息(有id为单个删除，无id为批量删除)
        deleteOrder(id) {
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
            p = this.deleteOrderById(id)// 映射action里的
            } else {
            // 无id,批量删除
            // console.log("无");
            p = this.batchDeleteOrders(this.selectedDelete)// 映射action里的
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
        //   fun:当多选的checkbox发生变化时将选中的当前行id添加到数组中
        SelectChangeHandle(val) {
        //    每一次checkbox发生变化都先将这个变量值清空
        this.selectedDelete = val.map(item => item.id)
        },
        // fun:修改派单数据
        submitHandler() {
        // 2.提交表单
        this.sendOrder(this.form)
            .then((response) => {
            this.$message({ type: 'success', message: response.statusText })
            })
        },
        // fun:修改接单数据
        submit_takeOrderHandler(){
        // 2.提交表单
        this.takeOrder(this.form)
            .then((response) => {
            this.$message({ type: 'success', message: response.statusText })
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
        color: rgb(88, 88, 89) !important
    }
    /* 分页按钮 */
    .mypages{
        margin-top:20px;
    }
    /* 搜索框 */
    .el-form-item {
        margin-bottom: 5px !important
    }
    /* a标签间隔 */
    span.blank_margin{
    margin:10px;
    }
</style>