<template>
    <div>
        <van-tabbar v-model="selectedLabelDefault" >
            <!-- :info="item.value"-->
            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index"
                    :name="item.name"
                    :icon="item.icon"
                    :info="item.value"
                    v-if="item.show==true"
                    @click="tab(item.name)"
            >
                <span >{{item.title}}</span>

            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import {
        Tabbar,
        TabbarItem
    } from 'vant';
    import {
        Users,
        DispatchUsers,
        CenterUsers
    } from '../../api/users.js';
    import {
        getDocByDocid,
        getHanlesByParentid,
        createDocument,
        createDocumentAndStartFlow,
        getDocsByFormname,
        updateANDsubmit,
        updateDocument
    } from '../../api/net_guest.js';
export default {
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
    },
    name: 'v-footer',
    data () {
        return {
            selectedLabelDefault: 'net-guest-order',
            my_user:{},
            tabbars: [
                {
                    name: "net-guest-order",
                    title: "下单",
                    icon: "home-o",
                    show:true,
                    value: ''
                },
                {
                    name: "net-guest-pending",
                    title: "待办",
                    icon: "friends-o",
                    show:false,
                    value: ''
                },
                {
                    name: "net-guest-my",
                    title: "历史记录",
                    icon: "friends-o",
                    show:true,
                    value: ''
                },
                {
                    name: "net-guest-my",
                    title: "待审核",
                    icon: "friends-o",
                    show:false,
                    value: ''
                }
            ]
        }
    },
    created(){
        this.selectedLabelDefault =this.$route.name;

        let ms_user = localStorage.getItem('ms_user');
        if(ms_user==null || ms_user==undefined){
            this.$router.push('/login');

        }else{
            //let ms_username1=this.$route.params.ms_username;
            this.my_user=JSON.parse(ms_user);

        }
        this.getOrder();
    },
    methods: {
        tab(val){
            this.$router.push(val);
        },
        getOrder(){
            //获取本人处理的工单
            let temp = {
                'item_上报人号码': this.my_user.手机号码
            };
            let para = {formname:'网络客情_主表单',parameters: JSON.stringify(temp)};
            getDocsByFormname(para).then((res) => {
                this.tabbars[2].value = res.data.length;
            });

            let temp1={};
            if(this.my_user.角色.indexOf("调度")>=0){
                temp1 = {
                    'statelabel': '工单处理'
                };
                this.tabbars[1].show=true;
            }
            else if(this.my_user.角色.indexOf("处理中心")>=0){
                temp1 = {
                    'statelabel': '工单处理',
                    'item_处理中心':this.my_user.部门
                };
                this.tabbars[1].show=true;
            }

            let para1 = {formname:'网络客情_主表单',parameters: JSON.stringify(temp1)};
            getDocsByFormname(para1).then((res) => {
                this.tabbars[1].value = res.data.length;
            });
        }

    }
}
</script>

<style>
.app-footer {
    max-width: 750px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    font-size: 12px;
    box-sizing: border-box;
    box-shadow: 0 -1px 10px #ccc;
    background: #fff;
}
.van-tabbar-item--active {
    color: #e10f02;
}
</style>
