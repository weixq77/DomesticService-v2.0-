<template>
  <div id="product">
    <!-- 表格 -->
		<div>
      <el-table :data="products" size="mini" fit='true'>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="商品名"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="photo" label="图片">
                <template v-slot:default="record">
                    <img :src="record.row.photo" alt="">
                </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="record">
              <a href="">详情</a>
          </template>
        </el-table-column>
      </el-table>
		</div>
  </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data(){
      return{

      }
    },
     created(){
    this.findAllProducts();
    },
    computed:{
      ...mapState("product",["products"]),
      ...mapGetters("product",[])
    },
    methods:{
      ...mapMutations("product",[]),
      ...mapActions("product",["findAllProducts"])
    }
}
</script> 

<style scoped>


</style>
