<template>
    <div class="category">
    <el-col :span="8">
        <div>
          <el-button type="primary" size="small" @click.prevent="addCategory" plain>添加</el-button>
          <el-button type="danger" size="small" plain @click.prevent="deleteCategory()">批量删除</el-button>
        </div>
    </el-col>
    <!-- 表格 -->
		<div>
      <el-table :data="categories" size="mini" @selection-change="SelectChangeHandle">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="栏目名"></el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="parentId" label="父栏目"></el-table-column>
        <el-table-column prop="icon" label="图标">
                <template v-slot:default="record">
                     <img style="width: 100px; height: 100px; object-fit: contain;" :src="record.row.icon" alt=""> 
                </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="record">
               <!-- 删除 -->
                <!-- @click.prevent="deleteProduct(record.row.id)" -->
              <a href="" class="el-icon-delete"  @click.prevent="deleteCategory(record.row.id)"/>
              <span class="blank_margin" />
              <!-- 修改 -->
              <!-- @click.prevent="editProduct(record.row)" -->
              <a href="" class="el-icon-edit-outline" @click.prevent="editCategory(record.row)"/>
              <span class="blank_margin" />
              <!-- 详情 -->
              <a href="" @click.prevent="toDetailsHandler()">详情</a>
          </template>
        </el-table-column>
      </el-table>
		</div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible="visible" width="40%" @close="closeDialog">
      <el-form :model="form"  ref="productForm">
        <!-- {{form}} -->
        <el-form-item label="栏目名" label-width="70px" prop="name">
          <el-input v-model="form.name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="70px" prop="num">
          <el-input v-model="form.num" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="70px" prop="icon">
          <el-upload
            class="upload-demo"
            action="http://47.94.36.193:6677/file/upload"
            :file-list="fileList"
            :on-success="uploadSuccessHandler"
            :limit=1
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>

import {mapState,mapGetters,mapMutations,mapActions} from "vuex"

export default {
    data(){
      return{
        form:{}, // 存放添加或修改的单个栏目信息
        selectedDelete:[], // 存放批量删除的id的数组
        fileList:[] //存放照片
      }
    },
     created(){
    this.findAllCategories();
    },
    computed:{
      ...mapState("category",["categories","visible","title"]),
      ...mapGetters("category",[])
    },
    methods:{
      ...mapMutations("category",["showModal","closeModal","setTitle"]),
      ...mapActions("category",["findAllCategories","deleteCategoriesById"
      ,"batchDeleteCategories","saveOrUpdateCategory"]),
      // 普通方法
      // 上传图片
      uploadSuccessHandler(response){
        if(response.status === 200){
          let id = response.data.id;
          let photo = "http://134.175.154.93:8888/group1/"+id;
          // 上传图片
          this.product.photo = photo;
          // 克隆，强制做双向渲染
          this.product.photo = Object.assign({},this.product);
        } else {
          this.$message.error("上传异常");
        }
      },
      // 显示详情信息
      toDetailsHandler(){
        this.$router.push({
          path:"/category/category_details",
        })
      },
      // fun: 添加信息
      addCategory() {
        // 添加信息
        this.form = {}    //添加信息前先清空数据
        this.setTitle("添加栏目信息") //修改标题
        this.showModal() // 显示模态框
      },
      // fun:关闭模态框的回调函数
      closeDialog() {
        this.form = {}
        this.closeModal()
      },
      // fun: 修改信息
      editCategory(row) {
        // 添加信息
        this.form = row   //修改先加载信息
        this.setTitle("修改栏目信息") //修改标题
        this.showModal() // 显示模态框
      },
      // fun:当多选的checkbox发生变化时将选中的当前行id添加到数组中
      SelectChangeHandle(val) {
      // 每一次checkbox发生变化都先将这个变量值清空
        this.selectedDelete = val.map(item => item.id)
      },
      // fun:保存与修改数据
      submitHandler() {
          //2.提交表单
          this.saveOrUpdateCategory(this.form)
          .then((response)=>{
          // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
          this.$message({type:"success",message:response.statusText});
        })
      },
      //fun：删除信息(有id为单个删除，无id为批量删除)
      deleteCategory(id) {
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
              console.log("有",id);
              p = this.deleteCategoriesById(id)// 映射action里的
            } else {
              // 无id,批量删除
              // console.log("无");
              p = this.batchDeleteCategories(this.selectedDelete)// 映射action里的
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
      }
    }
}
</script>

<style scoped>

</style>