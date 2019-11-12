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
                title="机房进出入登记"
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



        <van-cell-group>
            <van-field
                    v-model="gc_name"
                    label="工程名称"
                    left-icon="notes-o"
                    disabled
            />
            <van-field
                    v-model="begin_time"
                    label="工程开始时间"
                    left-icon="clock-o"
                    disabled
            />
            <van-field
                    v-model="end_time"
                    label="工程结束时间"
                    left-icon="clock-o"
                    disabled
            />
            <van-field
                    v-model="yd_name"
                    label="移动方联系人"
                    left-icon="contact"
                    disabled
            />
            <van-field
                    v-model="xc_name"
                    label="现场联系人"
                    left-icon="contact"
                    disabled
            />
        </van-cell-group>

        <van-row>

            <van-col span="12"><van-button v-if="isFinished=='否'" type="primary" size="large"  @click="onIn" style="width: 100%;margin-right: 5px">进入机房</van-button></van-col>
            <van-col span="12"><van-button v-if="isFinished=='否'" type="warning" size="large"  @click="onOut" style="width: 100%;margin-left: 5px">离开机房</van-button></van-col>

        </van-row>



        <div>
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
            >
                <van-swipe-cell  v-for="item in doc_list" :key="item.docId">

                    <van-cell-group>
                        <van-cell :title="item.机房名称" :value="item.维护人员" :label="'进入时间：' +item.进入机房时间.slice(5,16)+'\n离开时间：'+item.离开机房时间.slice(5,16)"  icon="wap-home" @click="onClickList(item)"/>
                    </van-cell-group>

                </van-swipe-cell>

            </van-list>
        </div>




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
        Row,
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
        Field,
        Panel,
        Button,
        DatetimePicker,
        Popup,
        Picker

    } from 'vant';
    //import Vue from 'vue';
    //Vue.use(Divider);
    import {
        getRoomByDocid,
        getRoomHanleByDocid
    } from '../../api/room_in';
    export default {

        components: {
            [Picker.name]: Picker,
            [Popup.name]: Popup,
            [DatetimePicker.name]: DatetimePicker,
            [Button.name]: Button,
            [Panel.name]: Panel,
            [Field.name]: Field,
            [Tag.name]: Tag,
            [Col.name]: Col,
            [Row.name]: Row,
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
                isFinished:'否',
                docid:'',
                room_name:'',
                gc_name:'',
                yd_name:'',
                xc_name:'',
                begin_time:'',
                end_time:'',
                activeNames: ['1'],
                list: [],
                doc_list:[],
                loading: false,
                finished: false,
                value1: 30,
                //active: 'home',
                currIndex: 2,
                active: 0,//当前页面在下部导航中的位置编号
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
            //Toast(this.docid);

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
            onCancel(){
                this.show = false;
            },
            //新增进机房记录
            onIn(){
                this.$router.push({
                    name: "room_in_edit",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        roomname:this.room_name
                    }
                })
            },
            //新增出机房记录
            onOut(){
                this.$router.push({
                    name: "room_out_edit",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        roomname:this.room_name
                    }
                })
            },
            //编辑记录
            onClickList(item){
                //Notify(item);
                //this.$router.push("/room_in_edit?docid="+item.docid)

                /*this.$router.push({
                    name: "room_in_edit",
                    params: {
                        mode:'edit',
                        docid: this.docid,
                        sub_docid: item.docId,
                        roomname:this.room_name,
                        room_name_value:item.机房名称,
                        team_name:item.施工队,
                        jl_name:item.监理人员,
                        user_name:item.维护人员,
                        currentDateIn1:item.进入机房时间.slice(0,16),
                        currentDateOut1:item.离开机房时间.slice(0,16)
                    }
                })*/



            },
            onClickLeft() {
               //Toast('返回');

            },
            onClickRight() {
                //Toast('按钮');
            },
            Shop(){
                //this.cls2='van-tabbar-item van-tabbar-item--active'
                //this.cls1='van-tabbar-item'
                this.$router.push("/Goods")
            },

            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val+"?docid="+this.docid);
                /*if(index==0){
                    this.$router.push(val+"?docid="+this.docid);
                }else
                    this.$router.push(val);*/
            },
            onLoad() {

                setTimeout(() => {
                    let para={docid:this.docid};
                    getRoomByDocid(para).then((res) => {
                        //this.doc_list = res.data;
                        //Toast(this.doc_list[0].group_name);

                        this.gc_name= res.data.工程事件名称;
                        this.yd_name= res.data.维护人员;
                        this.xc_name= res.data.监理人员;
                        this.room_name=res.data.机房名称;

                        this.begin_time= res.data.工程开始时间.slice(0,16);
                        this.end_time= res.data.工程结束时间.slice(0,16);

                        let today=this.dateFormat(new Date());
                        if(today>this.end_time)
                            this.isFinished="是";

                    });

                    getRoomHanleByDocid(para).then((res) => {
                        this.doc_list = res.data;
                        this.finished = true;
                        this.loading= false;

                        //Toast(this.doc_list[0].group_name);
                    });

                }, 500);

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
    .van-field__label_1 span  {
        background-color: #007afa;
    }

    .van-cell__label{
        white-space:pre-line;
    }


</style>
