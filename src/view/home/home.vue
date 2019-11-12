<template>
    <div>
        <!--
        <van-tabbar v-model="active" active-color="#07c160"
                    inactive-color="#000">
            <van-tabbar-item icon="home-o" @click="Shop()">标签</van-tabbar-item>
            <van-tabbar-item icon="search" dot>标签</van-tabbar-item>
            <van-tabbar-item icon="friends-o" info="5">标签</van-tabbar-item>
            <van-tabbar-item icon="setting-o" v-bind:info="value1">标签</van-tabbar-item>
        </van-tabbar>
        -->
        <van-nav-bar
                title="我的主页"
                left-text="返回"
                right-text="按钮"
                left-arrow
                fixed
                @click-left="onClickLeft"
                @click-right="onClickRight"
        >
        <van-icon name="search" slot="right" />
        </van-nav-bar>

        <section style="height: 46px">

        </section>

        <van-collapse v-model="activeNames">
            <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
            <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
            <van-collapse-item title="标题3" name="3" disabled>内容</van-collapse-item>
        </van-collapse>

        <van-swipe-cell :right-width="65" :left-width="65" :on-close="onClose">
            <span slot="left">选择</span>
            <van-cell-group>
                <van-cell title="单元格" value="内容" />
            </van-cell-group>
            <span slot="right">删除</span>
        </van-swipe-cell>

        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <van-swipe-cell  v-for="item in list" :key="item">

                <van-cell-group>
                    <van-cell :title="item" :value="item" label="描述信息"  icon="location-o" @click="onClickList(item)"/>
                </van-cell-group>

            </van-swipe-cell>

        </van-list>


        <section style="height: 100px">

        </section>
        <v-footer></v-footer>
        <van-tabbar v-model="active" class="active_tab">

            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index"
                    :icon="item.icon"
                    :info="item.value"
                    @click="tab(index,item.name)"
            >
                <span :class="currIndex == index ? active:''">{{item.title}}</span>

            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>

    import {
        Tag,
        Col,
        Icon,
        Cell,
        CellGroup,
        Swipe,
        Toast,
        SwipeItem,
        GoodsAction,
        GoodsActionButton,
        GoodsActionIcon,
        List,
        Tabbar,
        Collapse,
        TabbarItem,
        CollapseItem,
        NavBar,
        SwipeCell,
        Notify

    } from 'vant';

    import {
        getDocByDocid
    } from '../../api/room_in';
    export default {

        components: {
            [Tag.name]: Tag,
            [Col.name]: Col,
            [Icon.name]: Icon,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [GoodsAction.name]: GoodsAction,
            [GoodsActionButton.name]: GoodsActionButton,
            [GoodsActionIcon.name]: GoodsActionIcon,
            [List.name]: List,
            [Tabbar.name]: Tabbar,
            [Collapse.name]: Collapse,
            [TabbarItem .name]:TabbarItem,
            [CollapseItem .name]:CollapseItem,
            [NavBar.name]:NavBar,
            [SwipeCell.name]:SwipeCell,
            [Notify.name]:Notify
        },

        data() {
            return {
                activeNames: ['1'],
                list: [],
                doc_list:[],
                loading: false,
                finished: false,
                value1: 30,
                //active: 'home',
                currIndex: 2,
                active: 2,
                tabbars: [
                    {
                        name: "home",
                        title: "首页",
                        icon:"home-o",
                        value:6
                    },
                    {
                        name: "Goods",
                        title: "分类",
                        icon:"search",
                        value:7
                    },
                    {
                        name: "list",
                        title: "消息",
                        icon:"friends-o",
                        value:8
                    },
                    {
                        name: "cart",
                        title: "购物车",
                        icon:"setting-o",
                        value:10
                    }
                ]
            }
        },
        computed: {

        },
        mounted() {
            let test=this.$route.query.test;
            Toast(test);

        },
        methods: {
            onClickList(item){
                Notify(item);
            },
            onClickLeft() {
               // Toast('返回');
                let para={};
                getDocByDocid(para).then((res) => {
                    this.doc_list = res.data;
                    Toast(this.doc_list[0].group_name);
                });
            },
            onClickRight() {
                Toast('按钮');
            },
            Shop(){
                //this.cls2='van-tabbar-item van-tabbar-item--active'
                //this.cls1='van-tabbar-item'
                this.$router.push("/Goods")
            },
            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val);
            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }
                    // 加载状态结束
                    this.loading = false;

                    // 数据全部加载完成
                    if (this.list.length >= 40) {
                        this.finished = true;
                    }
                }, 500);
            },
            onClose(){
                let para={};
                getDocByDocid(para).then((res) => {
                    this.doc_list = res.data;
                    Toast(this.doc_list[0].group_name);
                });
            }
        }
    }

</script>

<style lang="less">
    @import '../../style/var';
    .demo-list {
        .van-cell {
            text-align: center;
        }
        .page-desc {
            padding: 5px 0;
            margin: 0;
            font-size: 14px;
            text-align: center;
            color: @gray-darker;
            &--text {
                margin: 0;
            }
            &--option {
                margin: 12px;
            }
        }
        .van-checkbox__label {
            color: @gray-darker;
        }
    }

    .active_tab img {
        width: 26px;
        height: 26px;
    }

    .van-tabbar-item--active {
        color: #e10f02;
    }

    .van-swipe-cell__left,
    .van-swipe-cell__right {
        display: inline-block;
        width: 65px;
        height: 44px;
        font-size: 15px;
        line-height: 44px;
        color: #fff;
        text-align: center;
        background-color: #f44;
    }

</style>
