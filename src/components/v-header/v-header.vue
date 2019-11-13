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
    </div>
</template>

<script>
    import {
        NavBar,
        Icon
    } from 'vant';
export default {
    components: {
        [NavBar.name]: NavBar,
        [Icon.name]: Icon
    },
    name: 'v-footer',
    data () {
        return {

            title:'',

        }
    },
    created(){
        this.title=this.$route.meta.title;
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            localStorage.removeItem('ms_user');
            this.$router.push('/login');
        },
    }
}
</script>

<style>

</style>
