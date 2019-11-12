import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export default {
    /**
     * mock bootstrap
     */
    open() {
        let mock = new MockAdapter(axios);
        //获取 客户+小时 维度列表
        mock.onGet('/ssm/zbjk/getRoomByDocid').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = {"工程结束时间":"2019-08-31 15:00","施工队":"中通一局","auditorlist":"","出机房时间":"","statelabel":"","现场情况":"","工程事件名称":"2019年省干OTN一期","机房名称":"六城门核心;埭里局楼旧机房三楼305电池室三楼自建砖混机房;","维护人员":"郑雪霞13959560136","监理人员":"黄明13225066636","进机房时间":"2019-07-09 09:32:00.0"};
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });


        mock.onGet('/ssm/zbjk/getRoomHanleByDocid').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = [{"施工队":"移动自维","subject":"","formName":"事件登记_重要机房出入登记_进出清单","进入机房时间":"2019-07-09 15:50:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","离开机房时间":"2019-07-09 15:55:00.0","机房名称":"机房2","监理人员":"无","auditorNames":"","auditorList":"{}","formId":"11e9-a212-014dfd7a-8853-1fd0c4cf52c0","docId":"11e9-a218-acc27295-8853-1fd0c4cf52c0","维护人员":"黄祚13959500200","flowName":"","flowId":""},{"施工队":"移动自维","subject":"","formName":"事件登记_重要机房出入登记_进出清单","进入机房时间":"2019-07-09 15:08:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","离开机房时间":"2019-07-09 17:08:00.0","机房名称":"机房1","监理人员":"","auditorNames":"","auditorList":"{}","formId":"11e9-a212-014dfd7a-8853-1fd0c4cf52c0","docId":"11e9-a218-867e4e35-8853-1fd0c4cf52c0","维护人员":"黄祚13959500200","flowName":"","flowId":""}];
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });
        mock.onGet('/ssm/zbjk/insertRoomHandle').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = {};
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

        mock.onGet('/ssm/zbjk/insertHandle').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = {};
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

        mock.onGet('/ssm/zbjk/getDocsByFormname').reply(config => {
            //let {group_name,time} = config.params;
            //let listClass = [{"施工队":"中移建设","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 09:06:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","工程结束时间":"","当天":"2019-07-11","related_docid":"","工程事件名称":"黄石水南OLT3上联板跳纤","机房名称":"莆田城厢赤溪局楼四楼邮政四楼机房","监理人员":"董智凡13959580528","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a378-1c4c34d1-8dd8-0503c449fe42","维护人员":"李万力13950700659","flowName":"","flowId":"","进机房时间":"2019-07-11 09:06:00.0"},{"施工队":"","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 00:00:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","当天":"2019-07-11","工程结束时间":"2019-07-11 05:00:00.0","related_docid":"11e9-a2e2-0a6bdba8-97d3-8780da5f880c","机房名称":"","工程事件名称":"市区2台，仙游2台OLT上行板替换","监理人员":"","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a2e5-877939fc-82d3-b9c45876e7e7","维护人员":"庄海明18959500373","flowName":"","flowId":"","进机房时间":""},{"施工队":"","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 07:30:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","当天":"2019-07-11","工程结束时间":"2019-07-16 20:30:00.0","related_docid":"11e9-a1e7-0b18c2be-b58f-f9e90004fdb6","工程事件名称":"莆田超级基站例行卫星倒换测试","机房名称":"","监理人员":"","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a2dd-491ed43f-82d3-b9c45876e7e7","维护人员":"洪俊杰13959500165","flowName":"","flowId":"","进机房时间":""}];
            let listClass = [{"联系方式":"","subject":"","处理内容":"预警结束:主纤断；10;31,尾纤断,更换后恢复。","formName":"本地预警_处理过程","处理人姓名":"家集客值班","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","填写时间":"","到达时间":"","auditorNames":"","auditorList":"{}","处理中心":"驻地网","实际处理人":"","formId":"11e9-41ac-86c0bf7f-8459-37def785e85c","处理时长":58,"处理时间":"2019-05-12 10:52:58.465","所属单位":"","docId":"11e9-7461-0caa55c0-8c08-df7aac90aa5b","出发时间":"","flowName":"","flowId":""},{"联系方式":"","subject":"","处理内容":"预警补充：9:45,涵江驻地网曾海雄反馈在处理了。","formName":"本地预警_处理过程","处理人姓名":"家集客值班","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","填写时间":"","到达时间":"","auditorNames":"","auditorList":"{}","处理中心":"驻地网","处理时长":62,"formId":"11e9-41ac-86c0bf7f-8459-37def785e85c","实际处理人":"","处理时间":"2019-05-12 09:54:36.35","所属单位":"","docId":"11e9-7458-e53dfe71-8c08-df7aac90aa5b","出发时间":"","flowName":"","flowId":""},{"联系方式":"","subject":"","处理内容":"预警发布：已通知维护人员核实处理","formName":"本地预警_处理过程","处理人姓名":"家集客值班","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","到达时间":"","填写时间":"","auditorNames":"","auditorList":"{}","处理中心":"驻地网","实际处理人":"","formId":"11e9-41ac-86c0bf7f-8459-37def785e85c","处理时长":0,"处理时间":"2019-05-12 08:52:07.915","所属单位":"","docId":"11e9-7450-2b003466-8c08-df7aac90aa5b","出发时间":"","flowName":"","flowId":""}];

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

        mock.onGet('/ssm/zbjk/updateDocument').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = [{"施工队":"中移建设","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 09:06:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","工程结束时间":"","当天":"2019-07-11","related_docid":"","工程事件名称":"黄石水南OLT3上联板跳纤","机房名称":"莆田城厢赤溪局楼四楼邮政四楼机房","监理人员":"董智凡13959580528","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a378-1c4c34d1-8dd8-0503c449fe42","维护人员":"李万力13950700659","flowName":"","flowId":"","进机房时间":"2019-07-11 09:06:00.0"},{"施工队":"","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 00:00:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","当天":"2019-07-11","工程结束时间":"2019-07-11 05:00:00.0","related_docid":"11e9-a2e2-0a6bdba8-97d3-8780da5f880c","机房名称":"","工程事件名称":"市区2台，仙游2台OLT上行板替换","监理人员":"","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a2e5-877939fc-82d3-b9c45876e7e7","维护人员":"庄海明18959500373","flowName":"","flowId":"","进机房时间":""},{"施工队":"","出机房时间":"","subject":"","formName":"事件登记_重要机房出入登记","工程开始时间":"2019-07-11 07:30:00.0","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","当天":"2019-07-11","工程结束时间":"2019-07-16 20:30:00.0","related_docid":"11e9-a1e7-0b18c2be-b58f-f9e90004fdb6","工程事件名称":"莆田超级基站例行卫星倒换测试","机房名称":"","监理人员":"","auditorNames":"","auditorList":"{}","formId":"11e9-9231-0e84d572-ab90-97bfff2373ed","现场情况":"","docId":"11e9-a2dd-491ed43f-82d3-b9c45876e7e7","维护人员":"洪俊杰13959500165","flowName":"","flowId":"","进机房时间":""}];
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

        mock.onGet('/ssm/zbjk/getDocByDocid').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = {"故障专业":"全业务","故障发生时间":"2019-05-12 08:36:00.0","预警历时":123,"故障类别":"光缆故障","登记人":"家集客值班","影响范围":"","故障恢复时间":"2019-05-12 10:31:00.0","故障原因":"尾纤断","需要整改":"","预警结束时间":"2019-05-12 10:52:58.485","处理中心":"驻地网","预警流水号":"YJ190512001","处理结果":"10;31,尾纤断,更换后恢复。","处理人员":"曾海雄18359033863-涵江","故障历时":115,"专业调度长":"刘阳钊13959582209","预警等级":"预A","auditorlist":"黄祚,莆田值班,家集客值班","影响用户数":0,"预警开始时间":"2019-05-12 08:50:00.0","影响网元":"PUT鉴前-OLT003-C300,1-1-5-4,影响用户数:7;故障预定位:主纤断 ，(莆田市涵江区苍林群英社区)","预警类别":"本地预警","related_docid":"","发布对象":"市公司网络部领导、分公司领导、分公司网络部、无线优化中心、基础网维护中心、传输动力中心、全业务支撑中心、东洲罗顿一线维护人员、富通一线维护人员","片区":"涵江","是否闭环":"否","网元数量":1,"statelabel":"结束预警","最新处理进展":"9:45,涵江驻地网曾海雄反馈在处理了。","流程控制":"默认","预警主题":"PUT鉴前-OLT003-C300,1-1-5-4,影响用户数:7;故障预定位:主纤断 ，(莆田市涵江区苍林群英社区)"};
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

        mock.onGet('/ssm/net-guest/getDocsByFormname').reply(config => {
            let listClass=[];
            console.log(JSON.stringify(config.params));
            if(config.params.formname=="网络客情_主表单")
                listClass=[{"问题类型":"家客","上报人号码":"13959500200","处理人":"","上报人":"黄祚","subject":"","formName":"网络客情_主表单","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","问题描述":"问题1","经度":"119.0292","工单编号":"dc5e0e36-edc1-480d-8d3b-72e6872a29c4","客户联系方式":"13959500200","stateLabel":"工单调度","auditorNames":"黄祚,家集客值班,吴晓冰,肖秀钦","auditorList":"{\"1572512984446\":[\"11e6-d9e6-fd41c49f-8246-d96da4a042cc\",\"11e9-72c2-1e463430-8a60-63f48a9b68a1\",\"11e9-72f0-2d946c2c-8a60-63f48a9b68a1\",\"11e9-9c6d-0df8fabc-932b-d33cc1c7f017\"]}","派单时间":"2019-11-04 16:09:00.0","纬度":"25.44518","处理中心":"","formId":"11e9-fbb8-9cd77205-9ed4-e12a8dc00051","处理结果":"","办结时间":"","地址":"福建省莆田市荔城区拱辰街道莆田市通信发展管理办公室","docId":"11e9-fedb-029961f9-90c7-1b11e4c1766e","flowName":"","flowId":"11e9-fbbe-c73f19f7-9ed4-e12a8dc00051","文件上传":""},{"上报人号码":"13959500200","问题类型":"其他","处理人":"","上报人":"黄祚","subject":"","formName":"网络客情_主表单","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","问题描述":"你好","经度":"119.029179","工单编号":"92b2cc15-d79a-4bbf-a6a5-f1b5a8abfcd7","客户联系方式":"123","stateLabel":"工单调度","auditorNames":"黄祚,家集客值班,吴晓冰,肖秀钦","auditorList":"{\"1572512984446\":[\"11e6-d9e6-fd41c49f-8246-d96da4a042cc\",\"11e9-72c2-1e463430-8a60-63f48a9b68a1\",\"11e9-72f0-2d946c2c-8a60-63f48a9b68a1\",\"11e9-9c6d-0df8fabc-932b-d33cc1c7f017\"]}","派单时间":"2019-11-04 16:10:00.0","处理中心":"","纬度":"25.445151","formId":"11e9-fbb8-9cd77205-9ed4-e12a8dc00051","处理结果":"","办结时间":"","地址":"福建省莆田市荔城区拱辰街道莆田市通信发展管理办公室","docId":"11e9-feda-f0f7d537-90c7-1b11e4c1766e","flowName":"","flowId":"11e9-fbbe-c73f19f7-9ed4-e12a8dc00051","文件上传":""},{"上报人号码":"13959500200","问题类型":"家客","处理人":"","上报人":"黄祚","subject":"","formName":"网络客情_主表单","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","经度":"119.0292","问题描述":"问题1","工单编号":"99dcbca5-9690-42b9-8da6-9a8c7a8d0d10","客户联系方式":"13959500200","stateLabel":"工单调度","auditorNames":"黄祚,家集客值班,吴晓冰,肖秀钦","auditorList":"{\"1572512984446\":[\"11e6-d9e6-fd41c49f-8246-d96da4a042cc\",\"11e9-72c2-1e463430-8a60-63f48a9b68a1\",\"11e9-72f0-2d946c2c-8a60-63f48a9b68a1\",\"11e9-9c6d-0df8fabc-932b-d33cc1c7f017\"]}","处理中心":"","纬度":"25.44518","派单时间":"2019-11-04 16:05:00.0","formId":"11e9-fbb8-9cd77205-9ed4-e12a8dc00051","处理结果":"","办结时间":"","地址":"福建省莆田市荔城区拱辰街道莆田市通信发展管理办公室","docId":"11e9-feda-9017b91c-90c7-1b11e4c1766e","flowName":"","flowId":"11e9-fbbe-c73f19f7-9ed4-e12a8dc00051","文件上传":"/uploads/item/6a8eaaf1-21cd-4d83-b47a-09acd967fd24-微信图片_20171214163742.jpg"}];
            else
                listClass=[{"联系方式":"","subject":"","处理内容":"处理2","formName":"网络客情_阶段回复","处理人姓名":"黄祚","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","填写时间":"2019-11-05 09:58:00.0","auditorNames":"","auditorList":"{}","处理中心":"传输动力中心","内容审核":"","处理时长":0,"实际处理人":"","formId":"11e9-fbbc-b39413c7-9ed4-e12a8dc00051","处理时间":"2019-11-05 09:54:00.0","所属单位":"","docId":"11e9-ff6f-c892d6ff-a275-bb45c2a20d06","flowName":"","flowId":"","文件上传":""},{"联系方式":"","subject":"","处理内容":"处理1","formName":"网络客情_阶段回复","处理人姓名":"黄祚","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","填写时间":"2019-11-05 09:58:00.0","auditorNames":"","auditorList":"{}","处理中心":"基础网维护中心","内容审核":"","处理时长":0,"实际处理人":"","formId":"11e9-fbbc-b39413c7-9ed4-e12a8dc00051","处理时间":"2019-11-05 09:53:00.0","所属单位":"","docId":"11e9-ff6f-be5d028c-a275-bb45c2a20d06","flowName":"","flowId":"","文件上传":""},{"联系方式":"","subject":"","处理内容":"处理3","formName":"网络客情_阶段回复","处理人姓名":"黄祚","applicationId":"11e6-d95d-f39edf67-97b4-bf3d776c2e8c","填写时间":"2019-11-05 11:28:00.0","auditorNames":"","auditorList":"{}","处理中心":"工建部","内容审核":"","处理时长":0,"实际处理人":"","formId":"11e9-fbbc-b39413c7-9ed4-e12a8dc00051","处理时间":"2019-11-05 11:23:00.0","所属单位":"","docId":"11e9-ff7c-469e2ed9-a275-bb45c2a20d06","flowName":"","flowId":"","文件上传":""}];

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });
        mock.onGet('/ssm/net-guest/getDocByDocid').reply(config => {
            //let {group_name,time} = config.params;
            let listClass = {
                "上报人号码": "13959500200",
                "问题类型": "无优",
                "纬度": "25.445156",
                "处理中心": "",
                "派单时间": "2019-11-07 08:59:00.0",
                "上报人": "黄祚",
                "处理人": "",
                "auditorlist": "黄祚,家集客值班,吴晓冰,肖秀钦",
                "statelabel": "工单调度",
                "处理结果": "",
                "办结时间": "",
                "地址": "福建省莆田市荔城区拱辰街道莆田市通信发展管理办公室",
                "问题描述": "问题112233",
                "经度": "119.029176",
                "工单编号": "812787e6-07ac-45a3-874d-eb7359a894ab",
                "客户联系方式": "13959500201",
                "文件上传": "/uploads/item/b1387781-6f73-43ee-b4d4-b5b9a6d84abd-IMG_20191024_193312.jpg"
            };
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, listClass]);
                }, 1000);
            });
        });

    }
}
