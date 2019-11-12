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
                title="填写进入机房"
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
                    v-model="room_name"
                    required
                    readonly
                    left-icon="wap-home"
                    label="机房名称： "
                    placeholder="请输入机房名称"
                    @click="showPopupRoom"
            />
            <van-field
                    v-model="currentDateIn1"
                    required
                    readonly
                    label="进入时间："
                    left-icon="clock-o"

            />

            <van-field
                    v-model="team_name"
                    required
                    clearable
                    label="施工队："
                    left-icon="friends-o"

            />
            <van-field
                    v-model="user_name"
                    required
                    clearable
                    label="维护人员："
                    left-icon="contact"

            />
            <van-field
                    v-model="jl_name"
                    clearable
                    label="监理人员："
                    left-icon="contact"

            />

        </van-cell-group>
        <van-notice-bar wrapable :scrollable="false" left-icon="volume-o">
            出入机房时间请务必与机房门禁刷卡时间基本一致！
        </van-notice-bar>

        <section style="height: 20px"></section>

        <van-button type="primary" size="large" @click="onSave">保存</van-button>
        <section style="height: 10px"></section>
        <van-button type="default" size="large" @click="onBack">取消</van-button>


        <van-popup v-model="showIn"
                   position="bottom"
                   :style="{ height: '50%' }">
            <van-datetime-picker
                    title="进入机房时间"
                    v-model="currentDateIn"
                    type="datetime"

                    @cancel="onCancel" @confirm="onConfirmIn"
            />

        </van-popup>


        <van-popup v-model="showRoom"
                   position="bottom"
                   :style="{ height: '50%' }">

            <van-picker show-toolbar title="选择机房" :columns="room_list" @cancel="onCancel" @confirm="onConfirmRoom"  />
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
        Loading

    } from 'vant';
    //import Vue from 'vue';
    //Vue.use(Divider);
    import {
        insertRoomHandle,
        updateDocument
    } from '../../api/room_in';

    export default {

        components: {
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
                team_name: '',
                user_name: '',
                jl_name: '',
                //minDate: new Date(),
                maxDate: new Date(2030, 10, 1),
                currentDateIn: new Date(),

                currentDateIn1: this.dateFormat(new Date()),

                showIn: false,
                showOut: false,
                showRoom:false,
                docid: '',
                sub_docid:'',
                room_name: '',
                room_name_picker:'',
                gc_name: '工程1',
                begin_time: '',
                end_time: '',
                activeNames: ['1'],
                list: [],
                doc_list: [],
                room_list:[],
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
            let temp_room=this.$route.params.roomname.split(';');
            this.room_list=[];
            for(let x in temp_room){
                if(temp_room[x]!='')
                    this.room_list.push(temp_room[x]);
            }
            if(this.mode=='edit'){
                this.room_name=this.$route.params.room_name_value;
                this.team_name=this.$route.params.team_name;
                this.user_name=this.$route.params.user_name;
                this.jl_name=this.$route.params.jl_name;
                this.currentDateIn1=this.$route.params.currentDateIn1;
                this.currentDateOut1=this.$route.params.currentDateOut1;
                this.currentDateIn= new Date(this.currentDateIn1);
                this.currentDateOut= new Date(this.currentDateOut1);
                this.sub_docid=this.$route.params.sub_docid;

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
            onCancel() {
                this.showIn = false;
                this.showOut = false;
                this.showRoom = false;
            },
            onConfirmIn() {

                this.currentDateIn1 = this.dateFormat(this.currentDateIn);
                this.showIn = false;
            },
            onConfirmOut() {

                this.currentDateOut1 = this.dateFormat(this.currentDateOut);
                this.showOut = false;
            },
            onConfirmRoom(value, index) {
                this.room_name = value;

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
                if (this.team_name == '')
                    rtn += "请输入施工队；";
                if (this.room_name == '')
                    rtn += "请输入机房名称；";
                if (this.user_name == '')
                    rtn += "请输入维护人员信息；";
                if (this.currentDateIn1 == '')
                    rtn += "请输入进入机房时间；";
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
                            '施工队': this.team_name,
                            '监理人员': this.jl_name,

                            '进入机房时间': this.currentDateIn1,
                            '机房名称': this.room_name,
                            '维护人员': this.user_name,
                            'isRelate': 'true',
                            'parentid': this.docid
                        };
                        let para = {parameters: JSON.stringify(temp)};
                        insertRoomHandle(para).then((res) => {

                            let temp = {
                                '进机房时间': this.currentDateIn1,

                            };
                            let para = { 'docid': this.docid,parameters: JSON.stringify(temp)};
                            updateDocument(para).then((res) => {
                                toast.clear();
                                this.$router.go(-1);

                            });
                        });
                    }else if(this.mode=='edit'){
                        let temp = {
                            '施工队': this.team_name,
                            '监理人员': this.jl_name,

                            '进入机房时间': this.currentDateIn1,
                            '机房名称': this.room_name,
                            '维护人员': this.user_name
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

    .van-field__label_1 span {
        background-color: #007afa;
    }
</style>
