<template>

    <div>
        <van-nav-bar
                :title="title"
                left-text="返回"
                right-text="按钮"
                left-arrow
                fixed
                @click-left="onClickLeft"
                @click-right="onClickRight"
        >
            <van-icon name="cross" slot="right" />
        </van-nav-bar>
        <section style="height: 46px"></section>
        <van-cell-group  v-if="isLogin==true">
            <van-panel :title="doc.故障发生时间.slice(0,16)"  :status="doc.预警类别">
                <div style="margin: 16px;">
                    {{doc.预警主题}}
                </div>
                <div slot="footer">
                    <form action="/">
                        <van-search
                                v-model="handle_content"
                                placeholder="请输入反馈内容"
                                show-action
                                shape="round"
                                left-icon="chat-o"
                                @search="onHandle"

                                type="text"
                        >
                        <div slot="action" @click="onHandle">发送</div>
                        </van-search>
                    </form>
                </div>
            </van-panel>
        </van-cell-group>

        <section style="height: 5px;"></section>



        <van-row  v-if="isLogin==true">
            <van-col span="5">
                <van-sidebar v-model="tab" @change="onTabClick">
                    <van-sidebar-item v-for="(item,i) in tab_data" :key="item.center" :title="item.label" :info="item.list.length<=0?'':item.list.length" />

                </van-sidebar>
            </van-col>
            <van-col span="19">
                <div>

                    <van-list
                            class="mylist"
                            v-model="loading"
                            :finished="finished"
                            finished-text="没有更多了"
                            @load="onLoad"
                    >
                        <van-panel v-for="(item,i) in show_list" :key="item.docId" :title="item.处理时间.slice(0,16)" desc="" :status="item.处理人姓名+item.联系方式" >
                            <div class="mylist-content">
                                {{item.处理内容}}<br>
                            </div>
                        </van-panel>

                    </van-list>


                </div>
            </van-col>

        </van-row>


        <van-popup v-model="show" position="center" :close-on-click-overlay=false
                   :style="{ width: '100%',height:'300px'}">
            <div class="login-wrap">
                <div class="ms-login">


                    <van-cell-group  class="ms-content">
                        <van-field
                                type="number"
                                v-model="param.username"
                                required
                                clearable
                                label="手机号码"
                                right-icon="phone-o"
                                placeholder="请输入手机号码"
                                :error-message="telephone_error"
                        />

                        <van-field
                                type="number"
                                v-model="param.code"
                                center
                                clearable
                                required
                                label="短信验证码"
                                placeholder="请输入短信验证码"
                        >
                            <van-button slot="button" size="small" type="primary" @click="sendCode()"  :disabled="isdisabledFn">{{button_text}}</van-button>
                        </van-field>
                        <div class="login-btn">
                            <van-button type="info" size="large"  @click="submitForm()">登录</van-button>
                        </div>
                        <p class="login-tips">Tips : 手机号码无登录权限请联系管理员添加。</p>
                    </van-cell-group>

                </div>

            </div>


        </van-popup>
    </div>



</template>

<script>
    import header from '../../components/v-header/v-header.vue'
    import {
        smsCode,
        getDocsByFormname,
        getDocByDocid,
        createDocument
    } from '../../api/net_guest.js';
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
        Tab, Tabs,
        CollapseItem,
        NavBar,
        SwipeCell,
        Notify,
        Field,
        Panel,
        Button,
        DatetimePicker,
        Popup,
        Picker,
        NoticeBar,
        Search,
        Loading,
        Uploader,
        Sidebar,
        SidebarItem
    } from 'vant';
export default {
    components: {
        [Sidebar.name]: Sidebar,
        [SidebarItem.name]: SidebarItem,
        [Search.name]: Search,
        [Uploader.name]: Uploader,
        [Loading.name]: Loading,
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
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Collapse.name]: Collapse,
        [TabbarItem.name]: TabbarItem,
        [CollapseItem.name]: CollapseItem,
        [NavBar.name]: NavBar,
        [SwipeCell.name]: SwipeCell,
        [Toast.name]: Toast,
        [Notify.name]: Notify,
        'v-header':header
    },
    data: function() {
        return {
            title:'重大故障共享平台',
            param: {
                username: '',
                code: '',
            },
            handle_list: [],
            show_list: [],
            tab:0,
            tab_data:[
                {
                    label:'全部',center:'全部',list:[]
                },
                {
                    label:'无优',center:'无线优化中心',list:[]
                },
                {
                    label:'传动',center:'传输动力中心',list:[]
                },
                {
                    label:'基础',center:'基础网维护中心',list:[]
                },
                {
                    label:'家客',center:'家客支撑中心',list:[]
                },
                {
                    label:'政企',center:'政企支撑中心',list:[]
                },
                {
                    label:'综合',center:'资源室',list:[]
                },

            ],
            doc:{故障发生时间:'',预警类别:'',预警主题:''},
            loading: false,
            finished: false,
            docid:'',
            my_user:{},
            second:0,
            smsCode:'',
            smsTelephone:'',
            isdisabledFn:false,
            button_text:'发送验证码',
            telephone_error:'',
            show:true,
            isLogin:false,
            handle_content:'',
        };
    },
    created(){
        this.docid =this.$route.query.docid;
        let ms_username = localStorage.getItem('ms_user');
        if(ms_username!=null && ms_username!=undefined && ms_username.trim().length>0){
            this.isLogin=true;
            this.my_user=JSON.parse(ms_username);
            this.show=false;
        }else{
            this.isLogin=false;
            this.show=true;
        }
    },
    mounted(){

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
        onTabClick(index){
           this.show_list=this.tab_data[index].list;
        },
        submitForm() {
            if(this.param.username.trim().length!=11){
                this.telephone_error="请输入正确的手机号码!";
                return;
            }

            if (this.smsCode==this.param.code && this.smsTelephone==this.param.username) {

                localStorage.setItem('ms_user', JSON.stringify(this.my_user));
                this.isLogin=true;
                this.show=false;
            } else {
                localStorage.removeItem('ms_user');
                this.isLogin=false;
                this.show=true;
                Toast.fail("验证码错误。");
                return false;
            }
        },
        sendCode(){
            //Notify({ type: 'danger', message: '通知内容' });
            if(this.param.username.trim().length!=11){
                // Notify({ type: 'danger', message: '请输入正确的手机号码！' });
                this.telephone_error="请输入正确的手机号码!";
                return;
            }
            this.second = 60;
            const timer = setInterval(() => {
                this.second--;
                if (this.second) {
                    this.isdisabledFn=true;
                    this.button_text=this.second+"s";
                } else {
                    clearInterval(timer);
                    // 手动清除 Toast
                    this.isdisabledFn=false;
                    this.button_text="发送验证码";
                }
            }, 1000);


            let temp = {
                'item_手机号码': this.param.username.trim()
            };
            let params = {formname:'网络客情_用户',parameters: JSON.stringify(temp)};
            getDocsByFormname(params).then((res) => {
                if(res.data.length<=0){
                    this.telephone_error="该号码无登录权限，请联系管理员!";
                    this.second=1;
                }else{
                    this.my_user = res.data[0];
                    this.telephone_error="";
                    let para = {"telephone": this.param.username.trim()};
                    this.smsTelephone=this.param.username.trim();
                    smsCode(para).then((res) => {
                        this.smsCode=res.data.code;
                        //console.log('验证码：', this.smsCode)
                        if(this.smsCode!="-1"){
                            console.log('验证码：', this.smsCode)
                        }

                    });
                }
            });
        },
        onHandle(){
            if(this.handle_content==''){
                Notify("请填写反馈内容！");
                return;
            }
            Toast.loading({
                message: '处理中...',
                duration:10000,
                forbidClick: true,
                loadingType: 'spinner'
            });

            let temp = {
                '处理中心': this.my_user.部门,
                '处理内容': this.handle_content,
                '处理时间': this.getTodayStr(),
                '处理人姓名':this.my_user.姓名,
                '联系方式': this.my_user.手机号码,
                'isRelate': 'true',
                'parentid': this.docid
            };

            let fd = new FormData();
            fd.append("formname","本地预警_处理过程");
            fd.append("parameters",JSON.stringify(temp));
            createDocument(fd).then((res) => {
                this.onLoad();
                Toast.clear();
                this.handle_content='';
            });

        },
        onCancel(){

        },
        onLoad() {

            this. loadHandle();
        },
        loadHandle(){
            setTimeout(() => {
                let para={docid:this.docid};
                getDocByDocid(para).then((res) => {
                    this.doc= res.data;
                });
                let temp = {
                    'parent': this.docid
                };
                let paraHandle = {formname:'本地预警_处理过程',parameters: JSON.stringify(temp)};
                getDocsByFormname(paraHandle).then((res) => {
                    this.handle_list = res.data;

                    this.finished = true;
                    this.loading= false;
                    if(this.handle_list.length>0){
                        this.handle_list.sort(function(a,b){
                            return b['处理时间'] > a['处理时间'] ? 1 : -1;
                        });
                        //this.last_handle_time=this.doc_list[this.doc_list.length-1].处理时间;
                        //this.last_handle_docid=this.doc_list[this.doc_list.length-1].docId;

                        //Notify(this.last_handle_docid+'==='+this.last_handle_time);
                    }

                    if(this.tab==0)
                        this.show_list=this.handle_list;

                    for (let x=0;x<this.tab_data.length;x++){
                        this.tab_data[x].list=[];
                    }
                    this.tab_data[0].list=this.handle_list;
                    for(let i=0;i<this.handle_list.length;i++){
                        for (let j=1;j<this.tab_data.length;j++){
                            if(this.tab_data[j].center==this.handle_list[i].处理中心)
                                this.tab_data[j].list.push(this.handle_list[i])
                        }
                    }
                });
            }, 500);

        },
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            localStorage.removeItem('ms_user');
            this.smsCode='';
            this.param.username='';
            this.param.code='';
            this.isLogin=false;
            this.show=true;
        },
    },
};
</script>

<style  lang="less">
    @import '../../style/var';
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}
    .van-tab__pane{
        margin-top: 10px;
        margin-left: 16px;
    }
.ms-login {
    position: absolute;
    height: 100%;
    width: 100%;
    margin: 0px 0 0 0px;

    background: rgb(255, 255, 255);
    overflow: hidden;
}
.ms-content {
    height: 100%;
    padding: 20px 20px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 12px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #AAAAAA;
}
    .van-panel__header-value{
        color: #000000;
        font-size: 12px;
        text-align:right;
    }
    .mylist .van-cell{
        padding: 2px;
        font-size: 12px;
    }
    .mylist-content{
        border-bottom:1px solid #ffffff;
        border-left:1px solid #ffffff;
        background-color: #e6fcff;
        color:black;
        font-size: 14px;
        padding: 5px;
    }
    .mylist  .van-panel__header{
        background-color: #09c9ff;
        border-left:1px solid #ffffff;
    }
    .van-notice-bar__content{
        font-size: 14px;
        background-color: #969799;
    }
    .grey{
        background-color: #969799;
    }
</style>
