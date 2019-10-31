<template>
    <div id="prodct_details">
        <!-- {{product}}}
        <el-button type="text" size="small" @click="backHandler">返回</el-button>
        <h3>商品详情</h3>
        <p><strong>产品名称：</strong>{{product.name}}</p>
        <p><strong>产品单价：</strong>{{product.price}}</p>
        <p><strong>产品介绍：</strong>{{product.description}}</p>
        <p><strong>产品主图：</strong></p>
        <img :src="product.photo" alt=""> -->
        <el-button type="text" size="small" @click="backHandler">返回</el-button>
        <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
            <el-row>
                <el-col :span="12">
                    <el-card :body-style="{ padding: '0px' }">
                        <div style="float:left;padding: 14px;">
                            <el-form label-width="100px">
                                <el-form-item label="产品名称:">
                                    <span>{{product.name}}</span>
                                </el-form-item>
                                <el-form-item label="产品价格:">
                                    <span>{{product.price}}</span>
                                </el-form-item>
                                <el-form-item label="产品描述:">
                                    <span>{{product.description}}</span>
                                </el-form-item>
                                <el-form-item label="产品主图:">
                                    <img :src="product.photo" alt="">
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="所属栏目信息" name="second">
                <el-row>
                    <el-col :span="12">
                        <el-card :body-style="{ padding: '0px' }">
                            <div style="float:left;padding: 14px;">
                                <el-form label-width="100px">
                                    <el-form-item label="栏目名称:">
                                        <span>{{product.category.name}}</span>
                                    </el-form-item>
                                    <el-form-item label="数量:">
                                        <span>{{product.category.num}}</span>
                                    </el-form-item>
                                    <el-form-item label="栏目图标:">
                                    <img :src="product.category.icon" alt="">
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </el-col>
            </el-row>
        </el-tab-pane>
         </el-tabs>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return {
             activeName:'first'
        }
    },
    computed:{
        ...mapState('product',['product'])
    },
    created(){
        let id = this.$route.query.id;
        // 通过id查询商品的详细信息
        this.findProductById(id);

    },
    methods:{
        ...mapActions('product',["findProductById"]),
        backHandler(){
            this.$router.go(-1);
        }
    }
}
</script>