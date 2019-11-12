<template>
    <div class="app-footer">
        <van-tabbar v-model="selectedLabelDefault" >
            <!-- :info="item.value"-->
            <van-tabbar-item
                    v-for="(item,index) in tabbars"
                    :key="index"
                    :name="item.name"
                    :icon="item.icon"
                    :info="item.value"
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
            selectedLabelDefault: 'net-guest-home',
            my_telephone:'',
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
                    value: ''
                },
                {
                    name: "net-guest-my",
                    title: "历史记录",
                    icon: "friends-o",
                    value: ''
                }
            ]
        }
    },
    created(){
        this.selectedLabelDefault =this.$route.name;

        let ms_username = localStorage.getItem('ms_username');
        let ms_username1=this.$route.params.ms_username;
        if(ms_username!=null && ms_username!=undefined && ms_username.trim().length>0)
            this.my_telephone=ms_username;
        else if(ms_username1!=null && ms_username1!=undefined && ms_username1.trim().length>0)
            this.my_telephone=ms_username1;
        else
            this.$router.push('/login');



        let temp = {
            'item_上报人号码': this.my_telephone
        };
        let para = {formname:'网络客情_主表单',parameters: JSON.stringify(temp)};
        getDocsByFormname(para).then((res) => {
            this.tabbars[2].value = res.data.length;
        });

        let temp1 = {
            'statelabel': '工单调度'
        };
        let para1 = {formname:'网络客情_主表单',parameters: JSON.stringify(temp1)};
        getDocsByFormname(para1).then((res) => {
            this.tabbars[1].value = res.data.length;
        });
    },
    methods: {
        tab(val){
            this.$router.push(val);
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
