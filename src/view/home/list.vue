<template>
    <demo-section>
        <van-tabs>
            <van-tab title="第一页">
                <van-pull-refresh
                        v-model="list[0].refreshing"
                        @refresh="onRefresh(0)"
                >
                    <van-list
                            v-model="list[0].loading"
                            :finished="list[0].finished"
                            finished-text="完成了"
                            @load="onLoad(0)"
                    >
                        <van-cell
                                v-for="item in list[0].items"
                                :key="item"
                                :title="item"
                        />
                    </van-list>
                </van-pull-refresh>
            </van-tab>

            <van-tab title="第二页">
                <van-pull-refresh
                        v-model="list[1].refreshing"
                        @refresh="onRefresh(1)"
                >
                    <van-list
                            v-model="list[1].loading"
                            :finished="list[1].finished"
                            :error.sync="list[1].error"
                            error-text="失败了"
                            @load="onLoad(1)"
                    >
                        <van-cell
                                v-for="item in list[1].items"
                                :key="item"
                                :title="item"
                        />
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </demo-section>
</template>

<script>
    import Vue from 'vue';
    import { Tabbar, TabbarItem } from 'vant';
    import { List } from 'vant';
    import { Collapse, CollapseItem } from 'vant';
    import { Tab, Tabs } from 'vant';

    Vue.use(Tab).use(Tabs);
    Vue.use(Collapse).use(CollapseItem);
    Vue.use(List);
    Vue.use(Tabbar).use(TabbarItem);
    export default {
        i18n: {
            'zh-CN': {
                errorInfo: '错误提示',
                finishedText: '没有更多了',
                errorText: '请求失败，点击重新加载'
            },
            'en-US': {
                errorInfo: 'Error Info',
                finishedText: 'Finished',
                errorText: 'Request failed. Click to reload'
            }
        },
        data() {
            return {
                list: [{
                    items: [],
                    refreshing: false,
                    loading: false,
                    error: false,
                    finished: false
                }, {
                    items: [],
                    refreshing: false,
                    loading: false,
                    error: false,
                    finished: false
                }]
            };
        },
        methods: {
            onLoad(index) {
                const list = this.list[index];
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        const text = list.items.length + 1;
                        list.items.push(text < 10 ? '0' + text : text);
                    }
                    list.loading = false;
                    // show error info in second demo
                    if (index === 1 && list.items.length === 10 && !list.error) {
                        list.error = true;
                    } else {
                        list.error = false;
                    }
                    if (list.items.length >= 40) {
                        list.finished = true;
                    }
                }, 500);
            },
            onRefresh(index) {
                const list = this.list[index];
                setTimeout(() => {
                    list.items = [];
                    list.error = false;
                    list.finished = false;
                    list.refreshing = false;
                    window.scrollTo(0, 10);
                }, 1000);
            }
        }
    };
</script>

<style lang="less">

    .demo-list {
        .van-cell {
            text-align: center;
        }

    }
</style>