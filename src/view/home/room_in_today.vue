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
                title="当天记录"
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



        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <van-swipe-cell  v-for="item in doc_list" :key="item.docId">

                <van-cell-group>
                    <van-cell :title="item.工程事件名称" :value="item.维护人员" :label="'进入时间：' +item.进机房时间.slice(5,16)+'\n离开时间：'+item.出机房时间.slice(5,16)"  icon="wap-home" @click="onClickList(item)"/>
                </van-cell-group>

            </van-swipe-cell>

        </van-list>


        <section style="height: 100px">

        </section>
        <van-tabbar v-model="active" class="active_tab">
            <!-- :info="item.value"-->
            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index"
                    :icon="item.icon"

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
        getDocsByFormname
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
                docid:'',
                activeNames: ['1'],
                list: [],
                doc_list:[],
                loading: false,
                finished: false,
                value1: 30,
                //active: 'home',
                currIndex: 1,
                active: 1,//当前页面在下部导航中的位置编号
                tabbars: [
                    {
                        name: "room_in",
                        title: "出入登记",
                        icon:"home-o",
                        value:6
                    },

                    {
                        name: "room_in_today",
                        title: "当天记录",
                        icon:"friends-o",
                        value:8
                    }
                ]
            }
        },
        computed: {

        },
        mounted() {
            this.docid =this.$route.query.docid;

        },
        methods: {
            dateFormat: function (time) {
                let date = new Date(time);
                let year = date.getFullYear();
                /* 在日期格式中，月份是从0开始的，因此要加0
                 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                 * */
                let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                // 拼接
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
            },
            onClickList(item){
                //Notify(item);
            },
            onClickLeft() {
                this.$router.go(-1);
            },
            onClickRight() {

            },

            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val+"?docid="+this.docid);
            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {

                    let temp = {
                        'item_当天': this.dateFormat(new Date()).slice(0,10)
                    };
                    let para = {formname:'事件登记_重要机房出入登记',parameters: JSON.stringify(temp)};
                    getDocsByFormname(para).then((res) => {
                        this.doc_list = res.data;
                        this.finished = true;
                        this.loading= false;

                    });
                }, 500);
            },
            onClose(){

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
