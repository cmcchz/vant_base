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
        <v-header />
        <section style="height: 46px"></section>


        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <van-swipe-cell  v-for="item in doc_list" :key="item.docId">

                <van-cell-group>
                    <van-cell :title="item.问题类型+'-'+item.客户联系人+'-'+item.客户联系方式" :value="item.紧急程度" :label="'上报时间：' +item.派单时间.slice(5,16)"  icon="thumb-circle-o" @click="onClickList(item)"/>
                </van-cell-group>

            </van-swipe-cell>

        </van-list>


        <section style="height: 100px">

        </section>

        <v-footer></v-footer>

        <van-popup v-model="show" position="bottom" closeable
                   :style="{ width: '100%',height:'80%'}">
            <van-collapse  v-model="activeNames" style="padding-top: 40px">
                <van-collapse-item :title="sub_doc_title" name="1" icon="todo-list-o">{{sub_doc_info}}</van-collapse-item>
            </van-collapse>


            <van-divider>处理进展</van-divider>
            <van-steps direction="vertical" :active="0">
                <van-step v-for="item in sub_doc_list" :key="item.docId">
                    <div>【{{item.处理时间.slice(5,16)}}】  {{item.发布内容}}</div>
                </van-step>
            </van-steps>
        </van-popup>

    </div>

</template>

<script>
    import {
        getDocByDocid,
        getHanlesByParentid,
        createDocument,
        createDocumentAndStartFlow,
        getDocsByFormname,
        updateANDsubmit,
        updateDocument
    } from '../../api/net_guest.js';
    import {
        Users
    } from '../../api/users.js';
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
        Notify,
        Popup,
        NoticeBar,
        Divider,
        Step,
        Steps

    } from 'vant';
    import footer from '../../components/v-footer/v-footer.vue'
    import VFooter from "../../components/v-footer/v-footer";
    import header from '../../components/v-header/v-header.vue'
    export default {

        components: {
            VFooter,
            [Tag.name]: Tag,
            [Divider.name]: Divider,
            [NoticeBar.name]: NoticeBar,
            [Col.name]: Col,
            [Icon.name]: Icon,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Swipe.name]: Swipe,
            [Popup.name]: Popup,
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
            [Step.name]:Step,
            [Steps.name]:Steps,
            [Notify.name]:Notify,
            'v-header':header,
            'v-footer':footer
        },

        data() {
            return {
                show:false,
                my_user:{},
                my_telephone:'',
                docid:'',
                activeNames: ['1'],
                list: [],
                doc_list:[],
                sub_doc_list:[],
                sub_doc_title:'',
                sub_doc_info:'',
                loading: false,
                finished: false,
                value1: 30,
                currIndex: 1,
                active: 1,//当前页面在下部导航中的位置编号
                tabbars: [
                    {
                        name: "net-guest-home",
                        title: "网情上报",
                        icon: "home-o",
                        value: 6
                    },

                    {
                        name: "net-guest-my",
                        title: "历史记录",
                        icon: "friends-o",
                        value: 8
                    }
                ]
            }
        },
        computed: {

        },
        mounted() {
            let ms_user = localStorage.getItem('ms_user');
            if(ms_user==null || ms_user==undefined){
                this.$router.push('/login');
            }else{
                //let ms_username1=this.$route.params.ms_username;
                this.my_user=JSON.parse(ms_user);

            }

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
                //let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                // 拼接
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
            },
            onClickList(item){
                //Notify(item.docId);
                this.sub_doc_list=[];
                this.sub_doc_title=item.问题类型+"-"+item.上报人;
                this.sub_doc_info=item.问题描述;
                let temp = {
                    'parent': item.docId,
                    'item_内容审核':'已通过'
                };
                let para = {formname:'网络客情_阶段回复',parameters: JSON.stringify(temp)};
                getDocsByFormname(para).then((res) => {
                    this.sub_doc_list = [];
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].发布内容!=null && res.data[i].发布内容!=undefined && res.data[i].发布内容.trim().length>0)
                            this.sub_doc_list.push(res.data[i]);
                    }

                    this.sub_doc_list.sort(function(a,b){
                        return b['处理时间'] > a['处理时间'] ? 1 : -1;
                    });

                });
                this.show=true;


            },
            onClickLeft() {
                this.$router.go(-1);
            },
            onClickRight() {

            },

            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val);
            },
            onLoad() {
                // 异步更新数据
                setTimeout(() => {

                    let temp = {
                        'item_上报人号码': this.my_user.手机号码
                    };
                    let para = {formname:'网络客情_主表单',parameters: JSON.stringify(temp)};
                    getDocsByFormname(para).then((res) => {
                        this.doc_list = res.data;

                        this.doc_list.sort(function(a,b){
                            return b['派单时间'] > a['派单时间'] ? 1 : -1;
                        });

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
