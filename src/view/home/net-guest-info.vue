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

        <van-collapse v-model="activeNames">

            <van-collapse-item border  name="1">
                <div slot="title"> 主题 </div>
                {{'【'+doc.问题类型+'】'+doc.上报人+'    '+doc.派单时间.slice(0,16)}}
            </van-collapse-item>
            <van-collapse-item  name="2">
                <div slot="title">详情 <van-icon name="question-o" /></div>
                {{'处理中心：'+doc.处理中心}}<br>
                {{'当前处理人：'+doc.当前处理人}}<br>
                {{'处理中心：'+doc.处理中心}}<br>
                {{'流程状态：'+doc.statelabel}}<br>
                {{'客户联系方式：'+doc.客户联系方式}}<br>
                {{'问题描述：'+doc.问题描述}}<br>
            </van-collapse-item>

            <van-row>
                <van-col span="24"><van-button type="primary" size="normal" v-if="doc.statelabel=='工单处理' && my_user.角色.indexOf('调度')>=0" @click="showDispatch=true" style="width: 100%;margin-top: 5px">工单调度</van-button></van-col>
                <van-col span="24"><van-button type="info" size="normal" v-if="doc.statelabel=='工单处理'" @click="showChuli=true" style="width: 100%;margin-top: 5px">工单处理</van-button></van-col>
            </van-row>


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
                        <span style="color:#09c9ff">回复时间：</span>{{item.处理时间.slice(0,16)}}<br>
                        <span style="color:#09c9ff">处理内容：</span>{{item.处理内容}}<br>
                        <span style="color:#09c9ff">发布内容：</span>{{item.发布内容}}<br>
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


                    <van-cell-group>
                        <van-field
                                v-model="handleResult"
                                type="textarea"
                                label="处理内容:"
                                left-icon="chat-o"
                                disabled
                        />

                        <van-field
                                v-model="handlePublish"
                                type="textarea"
                                label="发布内容:"
                                left-icon="chat-o"
                        />
                    </van-cell-group>
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

        <van-popup v-model="showDispatch" position="center" :close-on-click-overlay=true
                   :style="{ width: '90%'}">

            <van-cell-group>

                <van-panel title="工单调度" desc="" status="">
                    <section style="height: 10px">

                    </section>
                    <div>
                        <van-checkbox-group v-model="centerResult" style="margin-left: 20px">
                            <van-checkbox shape="square" style="margin-bottom: 5px" v-for="item in center_list" :name="item" :key="item">{{item}}</van-checkbox>
                        </van-checkbox-group>
                        <section style="height: 10px">

                        </section>

                    </div>
                    <div slot="footer">
                        <van-row>
                            <van-col span="12"><van-button  size="small" type="info" @click="onDispatch"  style="width: 100%;margin-right: 5px">确定</van-button></van-col>
                            <van-col span="12"><van-button  size="small" type="default" @click="showDispatch=false" style="width: 100%;margin-left: 5px">取消</van-button></van-col>
                        </van-row>
                    </div>
                </van-panel>

            </van-cell-group>
            <section style="height: 10px">

            </section>
        </van-popup>


        <van-popup v-model="showChuli" position="center" :close-on-click-overlay=true
                   :style="{ width: '90%'}">


            <van-cell-group>

                <van-panel title="工单处理" desc="" status="">
                    <section style="height: 10px">

                    </section>
                    <div>
                        <van-field
                                v-model="orderResult"
                                rows="2"
                                autosize
                                label="处理内容："
                                type="textarea"
                                placeholder="请填写处理内容"
                                maxlength="500"
                                show-word-limit
                        />
                        <van-field
                                v-model="orderPublish"
                                rows="2"
                                autosize
                                label="发布内容："
                                type="textarea"
                                placeholder="请填写发布内容"
                                maxlength="500"
                                show-word-limit
                        />

                        <van-notice-bar :scrollable="false" wrapable left-icon="volume-o">
                            （1）处理内容仅内部人员可看<br>
                            （2）发布内容将推送给报单人，请谨慎填写
                        </van-notice-bar>
                        <section style="height: 10px">

                        </section>

                    </div>
                    <div slot="footer">
                        <van-row>

                            <van-col span="8"><van-button type="warning" size="small"  @click="onHandle" style="width: 100%;margin-right: 5px">阶段反馈</van-button></van-col>
                            <van-col span="8"><van-button type="info" size="small"  @click="onFinish"  style="width: 100%;margin-left: 5px;margin-right: 5px">申请办结</van-button></van-col>
                            <van-col span="8" style="padding-left: 5px"><van-button type="default" size="small"  plain @click="showChuli=false" style="width: 100%;margin-left: 5px">取消</van-button></van-col>

                        </van-row>
                    </div>
                </van-panel>

            </van-cell-group>
            <section style="height: 10px">

            </section>
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
    import header from '../../components/v-header/v-header.vue'
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
            [Notify.name]:Notify,
            'v-header':header
        },

        data() {
            return {
                center_list:['基础网维护中心','传输动力中心','无线优化中心','家客支撑中心','政企支撑中心','市区网络部','仙游网络部','涵江网络部','秀屿网络部'],
                centerResult:[],
                orderResult:'',
                orderPublish:'',
                handleResult:'',
                handlePublish:'',
                handle_docid:'',
                show:false,
                showDispatch:false,
                showChuli:false,
                docid:'',
                my_user:{},
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
            let ms_user = localStorage.getItem('ms_user');
            if(ms_user==null || ms_user==undefined){
                this.$router.push('/login');
            }else{
                //let ms_username1=this.$route.params.ms_username;
                this.my_user=JSON.parse(ms_user);
                console.log(JSON.stringify(this.my_user));

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
                        '流程控制':'调度'
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
                        '处理中心': this.my_user.部门,
                        '处理内容': this.orderResult,
                        '发布内容': this.orderPublish,
                        '处理时间': this.getTodayStr(),
                        '处理人姓名':this.my_user.姓名,
                        '联系方式': this.my_user.手机号码,
                        '内容审核':'待审核',
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
                if(this.orderResult==''){
                    Notify("请填写处理内容！");
                    return;
                }

                Dialog.confirm({
                    title: '确认',
                    message: '是否提交结束申请？'
                }).then(() => {
                    // on confirm
                    Toast.loading({
                        message: '处理中...',
                        duration:10000,
                        forbidClick: true,
                        loadingType: 'spinner'
                    });

                    let temp = {
                        '处理中心': this.my_user.部门,
                        '处理内容': "结束申请:"+this.orderResult,
                        '处理时间': this.getTodayStr(),
                        '处理人姓名':this.my_user.姓名,
                        '联系方式': this.my_user.手机号码,
                        '内容审核':'待审核',
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
                if(this.my_user.角色.indexOf('调度')>=0){
                    this.handleResult=item.处理内容;
                    if(item.发布内容==undefined || item.发布内容==null || item.发布内容.trim().length<=0)
                        this.handlePublish=item.处理内容;
                    else
                        this.handlePublish=item.发布内容;
                    this.handle_docid=item.docId;
                    this.show=true;
                }


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
                        '内容审核':'已通过',
                        '发布内容':this.handlePublish
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
