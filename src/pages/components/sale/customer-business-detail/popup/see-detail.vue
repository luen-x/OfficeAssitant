
<template>
	<i-drawer
		v-model="visible"
		:mask="false"
		:mask-closable="false"
		class-name="v-sale-receive-drawer"
		@on-close="handleCancel"
	>
		<div slot="header">
			<span class="_header">约见详情</span>
			<div class="g-m-t-20 g-flex g-jc-sb">
				<span>邀约人：{{ basicInfo.staff_name }}</span>
				<span>部门：{{ basicInfo.depart_name }}</span>
				<span>谈判时间：{{ basicInfo.current_date }}</span>
				<span/>
			</div>
		</div>
		<div class="_border"/>
		<div style=" padding-buttom: 14px;" class="v-ticketed-detail">
			<div class="g-flex">
				<div class="__detail-body page-detail-body">
					<oa-info-block
						title=""
						notitle
						style="max-width: 670px;" >
						<oa-info-item :content="basicInfo.company_name" label="公司名称"/>
						<oa-info-item :content="basicInfo.customer_name" label="客户名称"/>
						<oa-info-item :content="basicInfo.customer_tel" label="联系方式"/>
						<oa-info-item :content="basicInfo.position" label="客户职务"/>
						<oa-info-item :content="basicInfo.legal_person_ratio" label="法人占比"/>
						<oa-info-item :content="basicInfo.establishment_time" label="成立时间"/>
						<oa-info-item :content="basicInfo.capital" label="注册资金"/>
						<oa-info-item :content="basicInfo.visit_time" label="跟进时间"/>
						<oa-info-item :content="basicInfo.product" label="产品"/>
						<oa-info-item :content="basicInfo.industry" label="所属行业"/>
						<oa-info-item :content="basicInfo.distribution_channel" label="目前销售渠道"/>
						<oa-info-item :content="basicInfo.is_website?'是':'否'" label="是否有官网"/>
						<oa-info-item :content="basicInfo.is_deal?'是':'否'" label="是否签单"/>
						<oa-info-item :content="basicInfo.payment" label="签单金额"/>
						<oa-info-item :content="basicInfo.cooperation_project" label="合作项目"/>
						<oa-info-item :content="basicInfo.is_commerce?'是':'否'" label="是否做过电商/微商"/>
						<oa-info-item :content="basicInfo.is_water?'是':'否'" label="是否倒水"/>
						<oa-info-item :content="basicInfo.is_meal?'是':'否'" label="是否点餐"/>
						<oa-info-item :content="basicInfo.is_photo?'是':'否'" label="是否拍照"/>
						<oa-info-item :content="basicInfo.is_video?'是':'否'" label="是否拍小视频"/>
						<oa-info-item :content="basicInfo.is_sound_record?'是':'否'" label="是否录音"/>
						<!-- <oa-info-item :content="basicInfo.contract_list" label="是否续费"/> -->
						<oa-info-item :content="basicInfo.communicate" label="谈判前沟通内容"/>
						<oa-info-item :content="basicInfo.explain" label="讲解文化走廊客户态度"/>
						<oa-info-item :content="basicInfo.diagnosis" label="谈判后客户诊断"/>
						<oa-info-item :content="basicInfo.negotiation" label="谈判内容"/>
					</oa-info-block>
				</div>
			</div>
		</div>
		<oa-loading v-if="loading"/>
	</i-drawer>
</template>

<script type="text/ecmascript-6">
import API from "@stores/apis/root";
import { Drawer, Tabs, TabPane, Input, Button } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import InfoItem from "../../_common/info-item";
import InfoBlock from '../../_common/info-block';
import { setData } from '../../_common/util';

export default {
	name: "to-ticket",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		'oa-info-item': InfoItem,
		'oa-info-block': InfoBlock,
		"vc-imgs-preview": ImgsPreview,
	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			loading: true,
			result: {},
			basicInfo: {
				staff_name: '',
				depart_name: '',
				current_date: '',
				company_name: "",
				customer_name: "",
				customer_tel: "",
				position: "",
				legal_person_ratio: "",
				establishment_time: "",
				capital: "",
				visit_time: "",
				product: "",
				industry: "",
				distribution_channel: "",
				is_website: "",
				is_deal: "",
				payment: "",
				cooperation_project: "",
				is_commerce: "",
				is_water: "",
				is_meal: "",
				is_photo: "",
				is_video: "",
				is_sound_record: "",
				communicate: "",
				explain: "",
				diagnosis: "",
				negotiation: "",
			},
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		renderRow(h, params) {
			const { src, index } = params;
			return h('img', {
				attrs: {
					src: src + '!4-4',
					width: 70,
					height: 70,
				}
			});
		},
		handleSave() {
			this.visible = false;
		},
		loadData() {
			this.loading = true;
			this.$request({
				url: API._SALE_CUSTOMER_BUSINESS_DETAIL_INFO_GET,
				type: "post",
				loading: false,
				param: {
					...this.data
				}
			}).then(res => {
				this.loading = false;
				this.result = res.data;
				setData(this.basicInfo, this.result);
			}).catch(error => {
				console.error(error, "error");
			});
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleEidt() {
			this.$router.push({ name: "sale-ticket-apply", query: { invoice_id: this.data.invoice_id } });
		},

	}
};
export const SeeDetail = CreatePortal({ alive: true }, module.exports.default);
</script>

<style  lang="scss">
      .v-sale-receive-drawer {
        position: relative;
        .ivu-drawer.ivu-drawer-right {
            width:720px !important;
        }
        .ivu-drawer-body {
            border-top: 1px solid #d4d7db;

        }
        ._header {
            font-weight: normal;
            font-size: 16px;
            color: #000;
        }
		.__detail-body{
			margin-bottom:60px;
		}
        ._footer-button {
			background: #fff;
            position: fixed;
            width: 720px;
            bottom: 0;
            right: 0;
            height: 60px;
            line-height: 60px;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
        .ivu-drawer-header {
            border-bottom: none;
        }
        ._title {
            margin-top: 0px;
        }
        ._value {
            img {
                border: 1px solid #d4d7db;
            }
        }
    }
</style>
