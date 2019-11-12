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
                title="申请结束预警"
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
            <van-field
                    v-model="doc.center_name"
                    required
                    readonly
                    left-icon="wap-home"
                    label="处理中心： "
                    placeholder="请选择处理中心"
                    @click="showPopupRoom"
            />

            <van-field
                    v-model="doc.user_name"
                    required
                    clearable
                    label="处理人："
                    left-icon="contact"

            />
            <van-field
                    v-model="doc.user_telephone"
                    required
                    clearable
                    label="联系电话："
                    left-icon="phone-o"

            />
            <van-field
                    v-model="doc.content"
                    required
                    clearable
                    label="故障原因及处理结果："
                    left-icon="description"

            />

        </van-cell-group>

        <van-collapse v-model="activeNames">
            <van-collapse-item border  name="1">
                <div slot="title"> 上传图片 </div>
                <div class="posting_uploader_item" v-for="(item,index) in fileList" :key="index" @click="imgclose">
                    <img :src="item" alt style="width: 100%;height: 100%">
                </div>
                <van-uploader multiple accept="image/jpg, image/jpeg" :after-read="afterRead">
                    <van-icon name="plus" size="80px" style="border:1px dotted;"  alt class/>
                </van-uploader>

            </van-collapse-item>
        </van-collapse>




        <van-notice-bar wrapable :scrollable="false" left-icon="volume-o">
           请认真填写故障原因及处理结果！
        </van-notice-bar>

        <section style="height: 20px"></section>

        <section style="height: 10px"></section>
        <van-button type="primary" size="large" @click="onSave">保存</van-button>
        <section style="height: 10px"></section>
        <van-button type="default" size="large" @click="onBack">取消</van-button>


        <van-popup v-model="showIn"
                   position="bottom"
                   :style="{ height: '50%' }">
            <van-datetime-picker
                    title="队伍出发时间"
                    v-model="currentDateStart"
                    type="datetime"

                    @cancel="onCancel" @confirm="onConfirmIn"
            />

        </van-popup>

        <van-popup v-model="showOut"
                   position="bottom"
                   :style="{ height: '50%' }">
            <van-datetime-picker
                    title="到达现场时间"
                    v-model="currentDateArrive"
                    type="datetime"
                    @cancel="onCancel" @confirm="onConfirmOut"
            />

        </van-popup>

        <van-popup v-model="showRoom"
                   position="bottom"
                   :style="{ height: '50%' }">

            <van-picker show-toolbar title="选择处理中心" :columns="center_list" @cancel="onCancel" @confirm="onConfirmRoom"  />
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
        Picker,
        NoticeBar,
        Loading,
        Uploader

    } from 'vant';
    //import Vue from 'vue';
    //Vue.use(Uploader);
    import {
        insertHandle,
        updateDocument
    } from '../../api/room_in';

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
            [Notify.name]: Notify
        },

        data() {
            return {
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
                    center_name: '',
                    currentDateStart1: '',
                    currentDateArrive1: ''

                },

                fileList:[],//文件名清单
                files:[],//保存上传的文件
                showIn: false,
                showOut: false,
                showRoom:false,
                docid: '',
                sub_docid:'',

                center_name_picker:'',
                gc_name: '工程1',

                activeNames: ['1'],
                list: [],
                doc_list: [],
                center_list:[],
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
                        icon: "home-o",
                        value: 6
                    },

                    {
                        name: "room_in_today",
                        title: "当天记录",
                        icon: "friends-o",
                        value: 8
                    }
                ]
            }
        },
        computed: {},
        mounted() {
            //this.docid = this.$route.query.docid;
            this.docid=this.$route.params.docid;
            this.mode=this.$route.params.mode;
            let temp_room=this.$route.params.center_name.split(';');
            this.center_list=[];
            for(let x in temp_room){
                if(temp_room[x]!='')
                    this.center_list.push(temp_room[x]);
            }
            if(this.mode=='edit'){
                this.doc.center_name=this.$route.params.处理中心;
                this.doc.content=this.$route.params.处理内容;
                this.doc.user_name=this.$route.params.实际处理人;
                this.doc.user_telephone=this.$route.params.联系方式;
                this.doc.currentDateStart1=this.$route.params.出发时间;
                this.doc.currentDateArrive1=this.$route.params.到达时间;
                if(this.doc.currentDateStart1!=null && this.doc.currentDateStart1!=undefined && this.doc.currentDateStart1!='')
                    this.currentDateStart= new Date(this.doc.currentDateStart1);
                else
                    this.currentDateStart= new Date();
                if(this.doc.currentDateArrive1!=null && this.doc.currentDateArrive1!=undefined && this.doc.currentDateArrive1!='')
                    this.currentDateArrive= new Date(this.doc.currentDateArrive1);
                else
                    this.currentDateArrive= new Date();

                this.sub_docid=this.$route.params.sub_docid;

            }else{
                if(this.center_list.length==1)
                    this.doc.center_name=this.center_list[0];
                this.last_handle_time=this.$route.params.last_handle_time;
                this.last_handle_docid=this.$route.params.last_handle_docid;
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
                let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
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
            onConfirmRoom(value, index) {
                this.doc.center_name = value;

                this.showRoom = false;
            },

            showPopupIn() {
                this.showIn = true;
            },
            showPopupOut() {
                this.showOut = true;
            },
            showPopupRoom() {
                this.showRoom = true;
            },
            onBack() {
                this.$router.go(-1);
            },
            onSave() {



                let rtn = '';
                if (this.doc.center_name == '')
                    rtn += "请选择处理中心；";
                if (this.doc.user_name == '')
                    rtn += "请输入现场处理人；";
                if (this.doc.user_telephone == '')
                    rtn += "请输入现场处理人联系方式；";

                if (this.doc.content == '')
                    rtn += "请输入故障原因及处理结果；";
                /*
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


                    if(this.mode=='new'){
                        let temp = {
                            '处理中心': this.doc.center_name,
                            '处理内容': '申请结束预警：'+this.doc.content,
                            '处理人姓名':this.doc.user_name,
                            '实际处理人': this.doc.user_name,
                            '联系方式': this.doc.user_telephone,
                            '处理时间':this.dateFormat(new Date()),
                            'isRelate': 'true',
                            'parentid': this.docid
                        };
                        let para = {formname:'本地预警_处理过程',parameters: JSON.stringify(temp)};

                        let fd = new FormData()
                        if (this.files.length>0) { // 判断是否是多图上传 多图则循环添加进去
                            this.files.forEach(item => {
                                fd.append("attachment[]", item)
                            })

                        }
                        fd.append("formname","本地预警_处理过程");
                        fd.append("parameters",JSON.stringify(temp));


                        insertHandle(fd).then((res) => {
                            if(this.last_handle_docid!='' && this.last_handle_docid!=undefined){
                                let dateBegin = new Date(this.last_handle_time);
                                let time_temp=((new Date()).getTime() - dateBegin.getTime())/1000/60;
                                let temp = {
                                    '处理时长': time_temp.toFixed(0),

                                };

                                let para = { 'docid': this.last_handle_docid,parameters: JSON.stringify(temp)};
                                updateDocument(para).then((res) => {
                                    toast.clear();
                                    this.$router.go(-1);

                                });
                            }

                        });
                    }else if(this.mode=='edit'){
                        let temp = {
                            '处理中心': this.doc.center_name,
                            '处理内容': this.doc.content,
                            '到达时间': this.doc.currentDateArrive1,
                            '出发时间': this.doc.currentDateStart1,
                            '实际处理人': this.doc.user_name,
                            '联系方式': this.doc.user_telephone
                        };
                        let para = { 'docid': this.sub_docid,parameters: JSON.stringify(temp)};
                        updateDocument(para).then((res) => {
                            toast.clear();
                            this.$router.go(-1);

                        });
                    }

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
                Toast('按钮');
            },
            Shop() {
                //this.cls2='van-tabbar-item van-tabbar-item--active'
                //this.cls1='van-tabbar-item'
                this.$router.push("/Goods")
            },
            tab(index, val) {
                this.currIndex = index;
                this.$router.push(val + "?docid=" + this.docid);
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

    .icon-close {
        position: absolute;
        right: -8px;
        top: -8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: red;
        color: #fff;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

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
