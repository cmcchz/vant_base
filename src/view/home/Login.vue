<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">"五位一体"网络客情上报</div>

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
</template>

<script>
    import {
        smsCode,
        getDocsByFormname
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
        Loading,
        Uploader

    } from 'vant';
export default {
    components: {
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
        [Collapse.name]: Collapse,
        [TabbarItem.name]: TabbarItem,
        [CollapseItem.name]: CollapseItem,
        [NavBar.name]: NavBar,
        [SwipeCell.name]: SwipeCell,
        [Toast.name]: Toast,
        [Notify.name]: Notify
    },
    data: function() {
        return {
            param: {
                username: '',
                code: '',
            },
            user:{},
            second:0,
            smsCode:'',
            smsTelephone:'',
            isdisabledFn:false,
            button_text:'发送验证码',
            telephone_error:'',
        };
    },
    created(){
        let ms_username = localStorage.getItem('ms_user');
        if(ms_username!=null && ms_username!=undefined && ms_username.trim().length>0){
            let ms_user=JSON.parse(ms_username);
            if(ms_user.角色.indexOf('调度')>=0 || ms_user.角色.indexOf('处理中心')>=0 )
                this.$router.push("/net-guest-pending");
            else
                this.$router.push("/net-guest-order");
        }



    },
    methods: {
        submitForm() {
            if(this.param.username.trim().length!=11){
                this.telephone_error="请输入正确的手机号码!";
                return;
            }

            /*let ms_user={name:"黄祚",telephone:this.param.username,dept:'基础网维护中心',role:'调度;处理中心'};
            localStorage.setItem('ms_user', JSON.stringify(ms_user));
            this.$router.push("/net-guest-order")
            */

            if (this.smsCode==this.param.code && this.smsTelephone==this.param.username) {

                localStorage.setItem('ms_user', JSON.stringify(this.user));
                //this.$cookieStore.setCookie('name', JSON.stringify(this.user));
                if(this.user.角色.indexOf('调度')>=0 || this.user.角色.indexOf('处理中心')>=0 )
                    this.$router.push("/net-guest-pending");
                else
                    this.$router.push("/net-guest-order");
            } else {
                localStorage.removeItem('ms_user');
                this.$router.push('/login');
                //console.log('error submit!!');
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
                    this.user = res.data[0];
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
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/reg-bg.jpg);
    background-size: 100%;
}
.ms-title {

    width: 100%;
    line-height: 60px;
    font-weight:bold;
    text-align: center;
    font-size: 24px;
    color: #ffef10;
    border-bottom: 1px solid #ddd;
    background-image: url(../../assets/img/head.png);
    background-size: 100%;
}
.ms-login {
    position: absolute;
    left: 0%;
    top: 20%;
    width: 100%;
    margin: 0px 0 0 0px;
    border-radius: 5px;
    background: rgb(255, 255, 255);
    overflow: hidden;
}
.ms-content {

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
</style>
