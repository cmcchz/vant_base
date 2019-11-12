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
                title="网络客情采集"
                left-text="返回"
                right-text="按钮"
                left-arrow
                fixed
                @click-left="onBack"
                @click-right="onClickRight"
        >
            <van-icon name="search" slot="right"/>
        </van-nav-bar>

        <section style="height: 46px">

        </section>



        <van-loading color="#1989fa" v-show="save_loading"/>


        <van-cell-group>

            <!-- @click="showPopupOut"-->
            <van-field
                    v-model="doc.user_name"
                    required
                    clearable
                    label="客户联系人："
                    left-icon="contact"

            />
            <van-field
                    v-model="doc.user_telephone"
                    required
                    clearable
                    type="tel"
                    label="联系号码："
                    left-icon="phone-o"

            />
            <van-field
                    v-model="doc.type"
                    required
                    readonly
                    left-icon="setting-o"
                    label="问题类型： "
                    placeholder="请选择问题类型"
                    @click="showType = true"
            />
            <van-field
                    v-model="doc.address"
                    required
                    clearable
                    type="textarea"
                    label="地址："
                    left-icon="wap-home-o"

            />
            <van-field
                    v-model="doc.location"
                    disabled
                    clearable
                    label="经纬度："
                    left-icon="location-o"

            />
            <van-field
                    v-model="doc.content"
                    required
                    clearable
                    autosize
                    label="问题描述："
                    type="textarea"
                    maxlength="100"
                    placeholder="请输入问题描述"
                    left-icon="notes-o"
                    show-word-limit
            />

        </van-cell-group>

        <van-collapse v-model="activeNames">
            <van-collapse-item border  name="1">
                <div slot="title"> 上传图片 </div>
                <div class="posting_uploader_item" v-for="(item,index) in fileList" :key="index" @click="imgclose">
                    <img :src="item" alt style="width: 100%;height: 100%">
                </div>
                <van-uploader multiple accept="image/*"  :after-read="afterRead">
                    <van-icon name="plus" size="80px" style="border:1px dotted;"  alt class/>
                </van-uploader>

            </van-collapse-item>
        </van-collapse>

        <van-notice-bar wrapable :scrollable="false" left-icon="volume-o">
            （1）请同意获取定位信息。<br>
            （2）无客户联系人时，请填写上报人联系信息。
        </van-notice-bar>

        <section style="height: 10px"></section>

        <van-row>
            <van-button  size="large" type="primary"  @click="onSave">提交工单</van-button>

        </van-row>

        <section style="height: 100px">

        </section>
        <v-footer />


        <van-popup v-model="showType"
                   position="bottom"
                   :style="{ height: '50%' }">

            <van-picker show-toolbar title="选择问题类型" :columns="types" @cancel="showType=false" @confirm="onConfirmType"  />
        </van-popup>
    </div>


</template>

<script>
    import uuid from 'uuid';
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
    //import Vue from 'vue';
    //Vue.use(Uploader);
    import {
        getDocByDocid,
        getHanlesByParentid,
        createDocument,
        createDocumentAndStartFlow,
        getDocsByFormname,
        updateDocument
    } from '../../api/net_guest.js';
    import {
        Users
    } from '../../api/users.js';

    import footer from '../../components/v-footer/v-footer.vue'

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
            [Notify.name]: Notify,
            'v-footer':footer
        },

        data() {
            return {
                my_user:'',
                my_telephone:'',
                mode:'',
                save_loading:false,
                last_handle_time:'',
                last_handle_docid:'',
                //minDate: new Date(),
                maxDate: new Date(2030, 10, 1),
                currentDateStart: new Date(),
                currentDateArrive: new Date(),
                doc:{
                    user_name:'',
                    user_telephone:'',
                    content:'',
                    type: '',
                    location: '',
                    lat:'',
                    lng:'',
                    address:'',
                    create_time: this.getTodayStr()
                },
                fileList:[],
                files:[],//保存上传的文件
                showIn: false,
                showOut: false,
                showType:false,
                docid: '',
                sub_docid:'',

                center_name_picker:'',
                gc_name: '工程1',

                activeNames: ['1'],
                list: [],
                doc_list: [],
                types: ['家客', '政企', '传动', '无优', '其他'],
                loading: false,
                finished: false,
                value1: 30,
                //active: 'home',
                currIndex: 2,
                active: 0,//当前页面在下部导航中的位置编号
                tabbars: [
                    {
                        name: "net-guest-home",
                        title: "网情上报",
                        icon: "home-o",
                        value: ''
                    },
                    {
                        name: "net-guest-pending",
                        title: "待办",
                        icon: "friends-o",
                        value: 8
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
        computed: {},
        mounted() {

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

            this.getLocation();
        },
        methods: {
            getLocation() {
                const self = this;
                AMap.plugin('AMap.Geolocation', function () {
                    var geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000,
                    })

                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', onComplete)
                    AMap.event.addListener(geolocation, 'error', onError)

                    function onComplete(data) {
                        // data是具体的定位信息
                        console.log('定位成功信息：', data)
                        self.doc.location="经度:"+data.position.lng+"  纬度:"+data.position.lat;
                        self.doc.lng=data.position.lng;
                        self.doc.lat=data.position.lat;
                        self.doc.address=data.formattedAddress;
                    }

                    function onError(data) {
                        // 定位出错
                        console.log('定位失败错误：', data)
                    }
                })
            },
            uuid: function ()  {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                let uuid = s.join("");
               return uuid;
            },
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
                //let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                // 拼接
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
            },
            afterRead(file) {
                // 保存上传的文件信息
                if (file && file.length) { // 判断是否是多图上传 多图则循环添加进去
                    file.forEach(item => {
                        this.fileList.push(item.content);
                        this.files.push(item.file);
                    })
                } else {
                    this.fileList.push(file.content);
                    this.files.push(file.file);
                }
                /*axios.post('/file/multiUpload', fd) //url是服务器的提交地址
                //成功回调
                    .then(res => {
                        this.uploadImages = [...this.uploadImages, ...res.Result]
                    }) //将服务器返回的图片链接添加进img数组，进行预览展示*/


            },
            //删除预览图片按钮
            imgclose (e) {
                this.fileList.splice(e, 1)
                this.files.splice(e, 1)

            },
            onCancel() {
                this.showIn = false;
                this.showOut = false;
                this.showRoom = false;
            },
            onConfirmIn() {

                this.doc.currentDateStart1 = this.dateFormat(this.currentDateStart);
                this.showIn = false;
            },
            onConfirmOut() {

                this.doc.currentDateArrive1 = this.dateFormat(this.currentDateArrive);
                this.showOut = false;
            },
            onConfirmType(value, index) {
                this.doc.type = value;
                this.showType = false;
            },

            showPopupIn() {
                this.showIn = true;
            },
            showPopupOut() {
                this.showOut = true;
            },
            showPopupType() {
                this.showType = true;
            },
            onBack() {
                this.$router.go(-1);
            },
            onHistory() {
                this.$router.push("/net-guest-my");
            },
            onSave() {
                let rtn = '';
                if (this.doc.user_name == '')
                    rtn += "请填写客户联系人；\n";
                if (this.doc.user_telephone == '')
                    rtn += "请填写客户联系号码；\n";
                if (this.doc.type == '')
                    rtn += "请选择问题类型；\n";
                if (this.doc.address == '')
                    rtn += "请填写详细地址；\n";
                if (this.doc.content == '')
                    rtn += "请填写问题描述；\n";
                /*if (this.files.length<=0){
                   rtn += "请上传到达现场照片；";
               }
                if (this.currentDateOut1 == '')
                   rtn += "请输入离开机房时间；";
               */
                if (rtn == '') {

                    const toast = Toast.loading({
                        duration: 0,       // 持续展示 toast
                        forbidClick: true, // 禁用背景点击
                        loadingType: 'spinner',
                        message: 'loading'
                    });

                    let temp = {
                        '工单编号':this.uuid(),
                        '上报人': this.my_user,
                        '上报人号码': this.my_telephone,
                        '问题类型': this.doc.type,
                        '客户联系方式':this.doc.user_telephone,
                        '地址': this.doc.address,
                        '经度': this.doc.lng,
                        '纬度': this.doc.lat,
                        '问题描述': this.doc.content,
                        '派单时间':this.dateFormat(new Date())

                    };

                    let fd = new FormData();
                    if (this.files.length>0) { // 判断是否是多图上传 多图则循环添加进去
                        this.files.forEach(item => {
                            fd.append("attachment[]", item)
                        })
                    }
                    fd.append("formname","网络客情_主表单");
                    fd.append("userid","11e9-6a1f-6c0f19ca-b39f-97d415a76d79");
                    fd.append("submit","1");
                    fd.append("parameters",JSON.stringify(temp));

                    createDocumentAndStartFlow(fd).then((res) => {
                        if(res.data.msg.result=="success"){
                            toast.clear();
                            this.$router.go(-1);
                        }else{
                            Toast.fail('提交失败，请重试');
                        }
                    });

                } else {
                   Notify(rtn);
                }

            },
            onClickList(item) {
                Notify(item);
            },
            onClickLeft() {
                // Toast('返回');
               /* let para = {};
                getDocById(para).then((res) => {
                    this.doc_list = res.data;
                    Toast(this.doc_list[0].group_name);
                });*/
            },
            onClickRight() {
                //Toast('按钮');
            },
            Shop() {
                //this.cls2='van-tabbar-item van-tabbar-item--active'
                //this.cls1='van-tabbar-item'
                this.$router.push("/Goods")
            },
            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val);
                /*if(index==0){
                    this.$router.push(val+"?docid="+this.docid);
                }else
                    this.$router.push(val);*/
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
            onClose() {

            }
        }
    }

</script>

<style lang="less">
    @import '../../style/var';



    .uploader_box{
        width:100%;
        height: auto;
        overflow: hidden;
        position: relative;
    }
    #logimg{
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        opacity:0;
    }
    .camera-icon{
        width:100%;
        height:auto;
    }

    .demo-uploader .van-uploader {
        margin-left: 15px;
    }
    .van-uploader {
        position: relative;
        display: inline-block;
    }
    .van-uploader__upload {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        box-sizing: border-box;
        width: 80px;
        height: 80px;
        margin: 0 10px 10px 0;
        background-color: #fff;
        border: 1px dashed #e5e5e5;
    }
    .van-uploader__upload-icon {
        color: #969799;
        font-size: 24px;
    }

    .van-icon {
        position: relative;
        display: inline-block;
        font: normal normal normal 14px/1 "vant-icon";
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
    }
    .posting_uploader_item {
        float: left;
        top: 0;
        left: 0;
        width: 80px;
        height: 80px;
        margin-right: 5px;
        margin-bottom: 5px;
    }

</style>
