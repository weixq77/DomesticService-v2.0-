<template>
    <div class="category">
         <!-- 表格 -->
		<div>
      <el-table :data="categories" size="mini"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="栏目名"></el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="parentId" label="父栏目"></el-table-column>
        <el-table-column prop="icon" label="图标">
                <template v-slot:default="record">
                    <img :src="record.row.icon" alt=""> 
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

import {mapState,mapGetters,mapMutations,mapActions} from "vuex"

export default {
    data(){
      return{

      }
    },
     created(){
    this.findAllCategories();
    },
    computed:{
      ...mapState("category",["categories"]),
      ...mapGetters("category",[])
    },
    methods:{
      ...mapMutations("category",[]),
      ...mapActions("category",["findAllCategories"])
    }
}
</script>

<style scoped>

</style>