import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '*',
        redirect: '/home'
    },
    {
        name: 'user',
        component: () => import('./view/user'),
        meta: {
            title: '会员中心'
        }
    },
    {
        name: 'cart',
        component: () => import('./view/cart'),
        meta: {
            title: '购物车'
        }
    },
    {
        name: 'goods',
        component: () => import('./view/goods'),
        meta: {
            title: '商品详情'
        }
    },
    {
        name: 'home',
        component: () => import('./view/home/home.vue'),
        meta: {
            title: '我的主页'
        }
    },
    {
        name: 'room_in',
        component: () => import('./view/home/room_in.vue'),
        meta: {
            title: '机房进出入登记'
        }
    },
    {
        name: 'room_in_edit',
        component: () => import('./view/home/room_in_edit.vue'),
        meta: {
            title: '进入机房'
        }
    },
    {
        name: 'room_out_edit',
        component: () => import('./view/home/room_out_edit.vue'),
        meta: {
            title: '离开机房'
        }
    },
    {
        name: 'pon_alarm',
        component: () => import('./view/home/pon_alarm.vue'),
        meta: {
            title: '本地预警'
        }
    },
    {
        name: 'pon_alarm_handle',
        component: () => import('./view/home/pon_alarm_handle.vue'),
        meta: {
            title: '预警处理过程'
        }
    },
    {
        name: 'pon_alarm_finish',
        component: () => import('./view/home/pon_alarm_finish.vue'),
        meta: {
            title: '申请结束预警'
        }
    },
    {
        name: 'pon_alarm_start',
        component: () => import('./view/home/pon_alarm_start.vue'),
        meta: {
            title: '出发时间'
        }
    },
    {
        name: 'pon_alarm_arrive',
        component: () => import('./view/home/pon_alarm_arrive.vue'),
        meta: {
            title: '到达时间'
        }
    },
    {
        name: 'room_in_today',
        component: () => import('./view/home/room_in_today.vue'),
        meta: {
            title: '当天记录'
        }
    },
    {
        name: 'login',
        component: () => import('./view/home/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        name: 'big_alarm',
        component: () => import('./view/home/big-alarm.vue'),
        meta: {
            title: '重大故障共享平台'
        }
    },
    {
        name: 'net-guest-home',
        components: { // key => value
            header: () => import('./components/v-header/v-header.vue'),
            default: () => import('./view/home/net-guest-order.vue'), //默认省略不写name的情况
            footer: () => import('./components/v-footer/v-footer.vue')
        },
        meta: {
            title: '网络客情首页',
            permission: true
        }
    },
    {
        name: 'net-guest-order',
        component: () => import('./view/home/net-guest-order.vue'),
        meta: {
            title: '网络客情上报',
            permission: true
        }
    },
    {
        name: 'net-guest-my',
        component: () => import('./view/home/net-guest-my.vue'),
        meta: {
            title: '我的客情工单',
            permission: true
        }
    },
    {
        name: 'net-guest-pending',
        component: () => import('./view/home/net-guest-pending.vue'),
        meta: {
            title: '待办',
            permission: true
        }
    },
    {
        name: 'net-guest-info',
        component: () => import('./view/home/net-guest-info.vue'),
        meta: {
            title: '客情工单处理',
            permission: true
        }
    }
];

// add route path
routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({routes});

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

export {
    router
};
