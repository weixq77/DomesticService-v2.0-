<template>
    <div class="category">
        
         <!-- 添加、批量删除按钮，及搜索框 -->
        <div class="btns">
            <el-row>
                <el-col :span="6"> 
                    <!-- 添加 -->
                    <el-button type="primary" size="small" plain @click="toAddHandler">添加</el-button>
                <!-- 批量删除 -->
                    <el-button type="danger" size="small" plain @click="batchDeleteHandler(ids)">批量删除</el-button>
                </el-col>
                <!-- 搜索 -->
                <el-col :span="8" :offset="10">
                    <el-form :inline="true" class="search" size="small" @submit.native.prevent>
                    <el-form-item style="width:80px;">
                        <el-select v-model="typeTag" placeholder="类型">
                        <el-option label="栏目名称" value="name" />
                        <el-option label="序号" value="num" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:180px;">
                        <el-input
                        v-if="typeTag == 'name'"
                        v-model="name"
                        placeholder="请输入栏目名称"
                        @keyup.enter.native="loadData"
                        >
                        <i slot="prefix" class="el-input__icon el-icon-search" />
                        </el-input>
                        <el-input
                        v-else
                        v-model="num"
                        placeholder="请输入序号"
                        @keyup.enter.native="loadData"
                        >
                        <i slot="prefix" class="el-input__icon el-icon-search" />
                        </el-input>
                    

                    </el-form-item>
                    <el-form-item>
                        <el-button @click.prevent="loadData">搜索</el-button>
                    </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <!-- 表格数据 -->
        <el-table :data="categories.list" @selection-change="handleSelectionChange" :default-sort="{prop:'num',order:'descending'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="栏目名称" sortable></el-table-column>
            <el-table-column prop="num" sortable label="序号"></el-table-column>
            <el-table-column prop="icon" label="图标" :formatter="formatter">
                <template v-slot:default="record">
                    <img :src="record.row.icon" alt="">
                </template>
            </el-table-column>
            <!-- <el-table-column prop="parentId" label="父ID"></el-table-column> -->
            <el-table-column #default="record" label="
            操作">
                <el-row>
                    <el-button size="mini" icon="el-icon-edit" @click.prevent="editHandler(record.row)"></el-button>
                    <el-button size="mini" icon="el-icon-delete" @click.prevent="deleteHandler(record.row.id)"></el-button>
                </el-row>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination small layout="prev, pager, next" 
            @current-change="pageChange"
            :page-size="categories.pageSize" 
            :total="categories.total"
            :current-page="params.page+1"></el-pagination>

        <!-- 模态框开始 -->
        <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
            <el-form :model="category" :rules="rules" ref="categoryForm">
                <el-form-item label="栏目名称" label-width="100px" prop="name">
                    <el-input v-model="category.name"></el-input>
                </el-form-item>
                <el-form-item label="序号" label-width="100px" prop="num">
                    <el-input v-model="category.num"></el-input>
                </el-form-item>
                <el-form-item label="图标" label-width="100px">
                    <el-input v-model="category.icon"></el-input>
                </el-form-item>
                <el-form-item label="父栏目" label-width="100px" prop="parentId">
                    <el-select v-model="category.parentId" placeholder="请选择...">
                        <el-option v-for="c in categoryFistList" :label="c.name" :value="c.id" :key="c.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogCloseHandler">取消</el-button>
                <el-button type="primary" size="small" @click="submitHandler">保存</el-button>
            </div>
        </el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>

<script>

import {mapState,mapGetters,mapMutations,mapActions} from "vuex"

export default {
    data(){
        return{
            // 存放表单
            category:{},
            // 多选id获取
            ids:[],
            // 存放搜索框内容
            name:'',
            num:'',
            typeTag:'',
            // form:{},
            // 表单验证
            rules:{
                name:[
                    {required:true,message:'请输入栏目名称',trigger:'blur'},
                    {min:2,max:10,message:'请输入2个以上字符',trigger:'blur'}
                ],
                num:[
                    {required:true,message:'请输入序号',trigger:'blur'},
                    {min:2,max:10,message:'请输入2个以上字符',trigger:'blur'}
                ]
                // parentId:[
                //     {required:true,message:'请选择父栏目',trigger:'blur'},
                // ]
            }
        }
    },
    computed:{
        ...mapState("category",["categories","visible","title","params","categoryFistList"]),
        // 存放一级栏目信息的变量
        // ...mapGetters('category', ['categoryParentIdFilter'])
    },
    created(){
        this.loadData();
        // console.log("categoryFistList--->>",this.categoryFistList)
        // this.findAllCategories();
    },
    methods:{
        ...mapMutations("category",["showModal","closeModal","searchByName","searchByNum","setTitle"]),
        ...mapActions("category",["findAllCategories","loadCategoryData","saveOrUpdateCategory","deleteCategoryById","batchDeleteCategory"]),
        // 多选
        handleSelectionChange(val){
            this.ids = val.map(item => item.id);
        },
        // 分页
        pageChange(currentPage){
        this.params.page = currentPage-1;
        this.loadData();
        },
        // 顺序调整
        formatter(row,column){
            return row.icon;
        },
        // 搜索
        loadData(){
            // 判断是否根据栏目名称或序号进行查询
            if(this.name){
                this.searchByName(this.name)
            }else if(this.num){
                this.searchByNum(this.num)
            }else{
                this.searchByName("")
                this.searchByNum("")

            }
            this.loadCategoryData();
        },
        // 添加
        toAddHandler(){
            // 重置表单
            this.category={};
            this.setTitle="添加顾客信息";
            // 显示模态框
            this.showModal();
        },
        // 关闭模态框
        dialogCloseHandler(){
            this.category = {};
            this.closeModal();
        },
        // 修改
        editHandler(row){
            this.category = row;
            this.setTitle="修改顾客信息";
            this.showModal();
        },
        // 删除
        deleteHandler(id){
            // 弹框提示是否删除
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 根据id删除
                    this.deleteCategoryById(id)

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            
        // 批量删除
        batchDeleteHandler(ids){
            // 弹框提示是否删除
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 根据ids批量删除
                    this.batchDeleteCategory(ids)

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });

        },
        // 提交
        submitHandler(){
            // 表单验证
            this.$refs.categoryForm.validate((valid)=>{
                // 如果校验通过
                if(valid){
                    let promise = this.saveOrUpdateCategory(this.category)
                    promise.then((response)=>{
                        this.$message({
                            type:"suceess",
                            message:response.statusText
                        });
                    })
                }else{
                    return false;
                }
            })
        }
    }
}
</script>

<style scoped>

</style>