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
                title="本地预警处理"
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

            <van-collapse-item border  name="1">
                <div slot="title"> 预警主题 </div>
                {{'【本地'+doc.order_level+'】'+doc.title}}
            </van-collapse-item>
            <van-collapse-item  name="2">
                <div slot="title">点击查看详情 <van-icon name="question-o" /></div>
                {{'故障发生时间：'+doc.gz_time}}<br>
                {{'影响网元：'+doc.ne_names}}<br>
                {{'影响用户数：'+doc.user_count}}<br>
                {{'故障专业：'+doc.major}}<br>
                {{'处理中心：'+doc.center_name}}<br>
                {{'处理人员：'+doc.user_name}}<br>
                {{'最新处理进展：'+doc.latest_content}}<br>

            </van-collapse-item>
        </van-collapse>

        <section style="height: 10px">

        </section>

        <van-row>
            <van-col span="12"><van-button v-if="doc.isFinished=='否'" size="normal" type="warning" style="width: 100%;margin-right: 5px" @click="onStart">填写出发时间</van-button></van-col>
            <van-col span="12"><van-button  v-if="doc.isFinished=='否'" size="normal" type="danger" style="width: 100%;margin-left: 5px" @click="onArrive">填写到达时间</van-button></van-col>

        </van-row>
        <section style="height: 10px">

        </section>

        <van-row>
            <van-col span="12"><van-button type="primary" size="normal" v-if="doc.isFinished=='否'" @click="onNew" style="width: 100%;margin-right: 5px">填写阶段反馈</van-button></van-col>
            <van-col span="12"><van-button type="info" size="normal" v-if="doc.isFinished=='否'" @click="onFinish" style="width: 100%;margin-left: 5px">申请结束预警</van-button></van-col>

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
                        <van-cell :title="item.处理人姓名" :value="item.处理中心" :label="'【回复时间】：' +item.处理时间.slice(5,16)+'\n【出发时间】：' +item.出发时间.slice(5,16)+'\n【到达时间】：'+item.到达时间.slice(5,16)+'\n【处理内容】：'+item.处理内容"  icon="contact" @click="onClickList(item)"/>
                    </van-cell-group>

                </van-swipe-cell>

            </van-list>
<!--
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
            >
            <van-steps direction="vertical" :active="doc_list.length-1">

                <van-step  v-for="item in doc_list" :key="item.docId"  @click="onClickList(item)">
                    <h4>{{item.处理人姓名}}</h4>
                    <h5>{{item.处理时间}}</h5>
                </van-step>

            </van-steps>
            </van-list>
-->

        </div>




        <section style="height: 100px">

        </section>
        <!--
        <van-tabbar v-model="active" class="active_tab">

            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index"
                    :icon="item.icon"

                    @click="tab(index,item.name)"
            >
                <span :class="currIndex == index ? active:''">{{item.title}}</span>

            </van-tabbar-item>
        </van-tabbar>
-->

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
        NoticeBar,
        Picker,
        Step,
        Steps

    } from 'vant';
    //import Vue from 'vue';
    //Vue.use(Divider);
    import {
        getDocByDocid,
        getDocsByFormname
    } from '../../api/room_in';
    export default {

        components: {
            [Step.name]: Step,
            [Steps.name]: Steps,
            [NoticeBar.name]: NoticeBar,
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

                docid:'',
                doc:{
                    title:'',
                    gz_time:'',
                    order_time:'',
                    ne_names:'',
                    user_count:'',
                    major:'',
                    county:'',
                    center_name:'',
                    user_name:'',
                    order_level:'',
                    isFinished:'是',
                    latest_content:''

                },
                last_handle_time:'',
                last_handle_docid:'',
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
                        name: "pon_alarm",
                        title: "预警处理",
                        icon:"home-o",
                        value:6
                    },

                    {
                        name: "pon_alarm_today",
                        title: "当前预警",
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
            onCancel(){
                this.show = false;
            },
            //新增一条记录
            onNew(){

                this.$router.push({
                    name: "pon_alarm_handle",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        last_handle_time:this.last_handle_time,
                        last_handle_docid:this.last_handle_docid,
                        center_name:this.doc.center_name
                    }
                })
            },
            //新增一条结束预警的记录
            onFinish(){

                this.$router.push({
                    name: "pon_alarm_finish",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        last_handle_time:this.last_handle_time,
                        last_handle_docid:this.last_handle_docid,
                        center_name:this.doc.center_name
                    }
                })
            },
            //新增一条记录
            onStart(){

                this.$router.push({
                    name: "pon_alarm_start",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        last_handle_time:this.last_handle_time,
                        last_handle_docid:this.last_handle_docid,
                        center_name:this.doc.center_name
                    }
                })
            },
            //新增一条记录
            onArrive(){

                this.$router.push({
                    name: "pon_alarm_arrive",
                    params: {
                        mode:'new',
                        docid: this.docid,
                        last_handle_time:this.last_handle_time,
                        last_handle_docid:this.last_handle_docid,
                        center_name:this.doc.center_name
                    }
                })
            },
            //编辑记录
            onClickList(item){
                //Notify(item);
                //this.$router.push("/room_in_edit?docid="+item.docid)
                /*this.$router.push({
                    name: "pon_alarm_handle",
                    params: {
                        mode:'edit',
                        docid: this.docid,
                        sub_docid: item.docId,
                        center_name:this.doc.center_name,
                        处理中心:item.处理中心,
                        处理内容:item.处理内容,
                        实际处理人:item.实际处理人,
                        联系方式:item.联系方式,
                        出发时间:item.出发时间.slice(0,16),
                        到达时间:item.到达时间.slice(0,16)
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
                    getDocByDocid(para).then((res) => {
                        //this.doc_list = res.data;
                        //Toast(this.doc_list[0].group_name);

                        this.doc.order_level= res.data.预警等级;
                        this.doc.title= res.data.预警主题;
                        this.doc.gz_time= res.data.故障发生时间.slice(0,16);
                        this.doc.order_time= res.data.预警开始时间.slice(0,16);
                        this.doc.ne_names=res.data.影响网元;
                        this.doc.user_count=res.data.影响用户数;
                        this.doc.major=res.data.故障专业;
                        this.doc.county=res.data.片区;
                        this.doc.center_name=res.data.处理中心;
                        this.doc.user_name=res.data.处理人员;
                        this.doc.latest_content=res.data.最新处理进展;
                        this.doc.isFinished=res.data.是否闭环;
                        //this.doc.isFinished='否';
                    });


                    let temp = {
                        'parent': this.docid
                    };
                    let paraHandle = {formname:'本地预警_处理过程',parameters: JSON.stringify(temp)};
                    getDocsByFormname(paraHandle).then((res) => {
                        this.doc_list = res.data;
                        this.finished = true;
                        this.loading= false;
                        if(this.doc_list.length>0){
                            this.doc_list.sort(function(a,b){
                                return b['处理时间'] < a['处理时间'] ? 1 : -1;
                            });
                            this.last_handle_time=this.doc_list[this.doc_list.length-1].处理时间;
                            this.last_handle_docid=this.doc_list[this.doc_list.length-1].docId;

                            //Notify(this.last_handle_docid+'==='+this.last_handle_time);
                        }

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
