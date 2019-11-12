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
                title="客情工单处理"
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
                <div slot="title"> 主题 </div>
                {{'【'+doc.问题类型+'】'+doc.上报人+'    '+doc.派单时间.slice(0,16)}}
            </van-collapse-item>
            <van-collapse-item  name="2">
                <div slot="title">详情 <van-icon name="question-o" /></div>
                {{'处理中心：'+doc.处理中心}}<br>
                {{'流程状态：'+doc.statelabel}}<br>
                {{'客户联系方式：'+doc.客户联系方式}}<br>
                {{'问题描述：'+doc.问题描述}}<br>
            </van-collapse-item>

            <van-collapse-item  name="3" v-if="doc.statelabel=='工单调度'">
                <div slot="title">工单调度 <van-icon name="friends" /></div>
                <van-checkbox-group v-model="centerResult" style="margin-left: 20px">
                    <van-checkbox  v-for="item in center_list" :name="item" :key="item">{{item}}</van-checkbox>
                </van-checkbox-group>
                <section style="height: 10px">

                </section>
                <van-row>
                    <van-col span="24"><van-button v-if="doc.statelabel=='工单调度'" size="large" type="warning" @click="onDispatch">事件调度</van-button></van-col>
                </van-row>
            </van-collapse-item>

            <van-collapse-item  name="4" v-if="doc.statelabel=='客情处理'">
                <div slot="title">工单处理 <van-icon name="friends" /></div>

                    <van-field
                            v-model="orderResult"
                            rows="1"
                            autosize
                            label="处理内容："
                            type="textarea"
                            placeholder="请填写处理内容"
                    />


                <van-row>
                    <van-col span="12"><van-button type="primary" size="normal" v-if="doc.statelabel=='客情处理'" @click="onHandle" style="width: 100%;margin-right: 5px">阶段反馈</van-button></van-col>
                    <van-col span="12"><van-button type="info" size="normal" v-if="doc.statelabel=='客情处理'" @click="onFinish" style="width: 100%;margin-left: 5px">申请办结</van-button></van-col>
                </van-row>
            </van-collapse-item>

        </van-collapse>



        <van-divider>处理进展</van-divider>
        <div>

            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
            >
                <van-panel v-for="item in doc_list" :key="item.docId" :title="item.处理人姓名+'--'+item.处理中心" desc="" :status="item.内容审核"  v-on:click="onClickList(item)">
                    <van-notice-bar wrapable :scrollable="false" style="background-color: white;color:black;font-size: 12px">
                        【回复时间】：{{item.处理时间.slice(0,16)}}<br>
                        【处理内容】：{{item.处理内容}}<br>
                    </van-notice-bar>
                </van-panel>

            </van-list>


        </div>




        <section style="height: 100px">

        </section>


        <van-popup v-model="show" position="bottom"
                   :style="{ width: '100%',height:'50%'}">


            <van-cell-group>


                <van-panel title="审核处理内容" desc="" status="状态">
                    <div>
                        <van-field
                                v-model="handleResult"
                                type="textarea"
                                label="修改内容:"
                                left-icon="contact"
                        />
                    </div>
                    <div slot="footer">
                        <van-row>
                            <van-col span="8"><van-button type="info" size="small" @click="onConfirm" style="width: 100%;margin-right: 5px">通过</van-button></van-col>
                            <van-col span="8"><van-button type="warning" size="small" @click="onConfirmNo" style="width: 100%;margin-left: 5px;margin-right: 5px">不通过</van-button></van-col>
                            <van-col span="8" style="padding-left: 5px"><van-button type="default" size="small"  plain @click="show=false" style="width: 100%;margin-left: 5px">取消</van-button></van-col>
                        </van-row>
                    </div>
                </van-panel>

            </van-cell-group>
        </van-popup>

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
        Steps,
        Checkbox,
        CheckboxGroup,
        Divider,
        Dialog

    } from 'vant';
    //import Vue from 'vue';
    //Vue.use(Divider);
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
    export default {

        components: {
            [Divider.name]: Divider,
            [Dialog.Component.name]: Dialog.Component,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
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
                center_list:['基础网维护中心','传输动力中心','无线优化中心'],
                centerResult:[],
                orderResult:'',
                handleResult:'',
                handle_docid:'',
                show:false,
                showDispatch:false,
                docid:'',
                my_user:'',
                my_telephone:'',
                doc:{
                    statelabel:'',
                    问题类型:'',
                    上报人:'',
                    处理中心:'',
                    内容审核:'',
                    派单时间:this.getTodayStr(),
                    客户联系方式:'',
                    问题描述:''
                },
                last_handle_time:'',
                last_handle_docid:'',
                begin_time:'',
                end_time:'',
                activeNames: ['1','2','3','4'],
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
        created(){
            let ms_username = localStorage.getItem('ms_username');
            let ms_username1=this.$route.params.ms_username;

            if(ms_username!=null && ms_username!=undefined && ms_username.trim().length>0)
                this.my_telephone=ms_username;
            else if(ms_username1!=null && ms_username1!=undefined && ms_username1.trim().length>0)
                this.my_telephone=ms_username1;
            else
                this.$router.push('/login');

            for(let i=0;i<Users.length;i++){
                if(Users[i]['手机号码']==this.my_telephone){
                    this.my_user=Users[i]['姓名'];
                }
            }
            this.docid=this.$route.params.docid;
            if(this.docid==null || this.docid==undefined ||this.docid.trim().length<=0){
                this.$router.go(-1);
            }
        },
        mounted() {

            //Toast(this.docid);

        },
        methods: {
            getTodayStr: function () {
                let date = new Date();
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
            onDispatch(){
                //this.showDispatch = true;

                if(this.centerResult.length<=0){
                    Notify("请选择处理中心！");
                    return;
                }

                Dialog.confirm({
                    title: '确认',
                    message: '是否调度到指定处理中心？'
                }).then(() => {
                    // on confirm
                    Toast.loading({
                        message: '处理中...',
                        duration:10000,
                        forbidClick: true,
                        loadingType: 'spinner'
                    });

                    let center_names='';
                    for(let i=0;i<this.centerResult.length;i++)
                        center_names+=this.centerResult[i]+';';
                    let temp = {
                        '处理中心':center_names,
                    };
                    let para = { 'docid': this.docid,parameters: JSON.stringify(temp)};
                    updateANDsubmit(para).then((res) => {
                        Toast.clear();
                        this.$router.go(-1);
                    });

                }).catch(() => {
                    // on cancel
                    Toast.fail("已取消");
                });
            },
            //新增一条记录
            onHandle(){


                if(this.orderResult==''){
                    Notify("请填写处理内容！");
                    return;
                }

                Dialog.confirm({
                    title: '确认',
                    message: '是否提交阶段反馈信息？'
                }).then(() => {
                    // on confirm
                    Toast.loading({
                        message: '处理中...',
                        duration:10000,
                        forbidClick: true,
                        loadingType: 'spinner'
                    });

                    let temp = {
                        '处理中心': "处理中心",
                        '处理内容': this.orderResult,
                        '处理时间': this.getTodayStr(),
                        '处理人姓名':this.my_user,
                        '联系方式': this.my_telephone,
                        '内容审核':'未审核',
                        'isRelate': 'true',
                        'parentid': this.docid
                    };

                    let fd = new FormData();
                    fd.append("formname","网络客情_阶段回复");
                    fd.append("parameters",JSON.stringify(temp));
                    createDocument(fd).then((res) => {
                        Toast.clear();
                        this.$router.go(-1);
                    });
                }).catch(() => {
                    // on cancel
                    Toast.fail("已取消");
                });



            },
            //新增一条结束预警的记录
            onFinish(){


            },
            //新增一条记录

            //编辑记录
            onClickList(item){
                /*
                if(item.内容审核!='通过'){
                    Dialog.confirm({
                        title: '确认',
                        message: '是否通过审核？'
                    }).then(() => {
                        // on confirm
                        Toast.loading({
                            message: '处理中...',
                            duration:10000,
                            forbidClick: true,
                            loadingType: 'spinner'
                        });


                        let temp = {
                            '内容审核':'通过',
                        };
                        let para = { 'docid': item.docId,parameters: JSON.stringify(temp)};
                        updateDocument(para).then((res) => {
                            Toast.clear();
                            this. loadHandle();
                            //this.$router.go(-1);
                        });

                    }).catch(() => {
                        // on cancel
                        Toast.fail("已取消");
                    });
                }
                */
                this.handleResult=item.处理内容;
                this.handle_docid=item.docId;
                this.show=true;

            },
            onConfirm(){
                Dialog.confirm({
                    title: '确认',
                    message: '是否通过审核？'
                }).then(() => {
                    // on confirm
                    Toast.loading({
                        message: '处理中...',
                        duration:10000,
                        forbidClick: true,
                        loadingType: 'spinner'
                    });


                    let temp = {
                        '内容审核':'通过',
                        '处理内容':this.handleResult
                    };
                    let para = { 'docid': this.handle_docid,parameters: JSON.stringify(temp)};
                    updateDocument(para).then((res) => {
                        Toast.clear();
                        this.loadHandle();
                        this.show=false;
                        //this.$router.go(-1);
                    });

                }).catch(() => {
                    // on cancel
                    Toast.fail("已取消");
                });
            },
            onConfirmNo(){
                Dialog.confirm({
                    title: '确认',
                    message: '审核不通过？'
                }).then(() => {
                    // on confirm
                    Toast.loading({
                        message: '处理中...',
                        duration:10000,
                        forbidClick: true,
                        loadingType: 'spinner'
                    });


                    let temp = {
                        '内容审核':'不通过',
                        '处理内容':this.handleResult
                    };
                    let para = { 'docid': this.handle_docid,parameters: JSON.stringify(temp)};
                    updateDocument(para).then((res) => {
                        Toast.clear();
                        this.loadHandle();
                        this.show=false;
                        //this.$router.go(-1);
                    });

                }).catch(() => {
                    // on cancel
                    Toast.fail("已取消");
                });
            },
            onClickLeft() {
               //Toast('返回');
                this.$router.go(-1);
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

                this. loadHandle();
            },
            loadHandle(){
                setTimeout(() => {
                    let para={docid:this.docid};
                    getDocByDocid(para).then((res) => {
                        //this.doc_list = res.data;
                        //Toast(this.doc_list[0].group_name);

                        this.doc= res.data;

                    });


                    let temp = {
                        'parent': this.docid
                    };
                    let paraHandle = {formname:'网络客情_阶段回复',parameters: JSON.stringify(temp)};
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

    .van-collapse-item__title{
        background-color: #11c0ff;
    }
    .van-panel__header{
        background-color: #e6fcff;
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
