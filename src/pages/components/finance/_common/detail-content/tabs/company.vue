<template>
	<div class="g-relative v-finance-detail-customer-info">
		<oa-loading v-if="loading"/>
		<oa-customer-base-info
			:read-only="true"
			:basic-info="basicInfo.basic_info"
			:contacts="basicInfo.link_tel_list"
			:show-contacts="true"/>
	</div>
</template>

<script>
import { Input, Cascader, Select, Option, Form, FormItem, InputNumber, Table } from "iview";
import { objRegex } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import LimitWords from '@components/_common/limit-words/limit-words';
import { services } from '@stores/services/sale';
import Loading from '@components/_common/loading/loading';
import { Confirm } from "@common/confirm/confirm";
import Steps from '@components/_common/steps/steps';
import CustomerBaseInfo from "../../../../sale/_common/customer-base-info";
import Title from '../../title';

export default {
	name: "oa-sea-customer-info",
	components: {
		"i-input": Input,
		'i-input-number': InputNumber,
		"i-cascader": Cascader,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-table': Table,
		'oa-loading': Loading,
		'oa-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-customer-base-info': CustomerBaseInfo,
		'oa-title': Title,
		'oa-steps': Steps
	},
	mixins: [
		services.industryList(),
		services.scaleList(),
		services.region3()
	],
	props: {
		customerId: [String, Number]
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			record: [],
			isEdit: false,
			loading: false,
			basicInfo: {}, // 基本信息
			company_name: '', // 公司名称
			tel: '', // 公司电话
			beforeInfo: {}, // 编辑之前的数据
			basicForm: {// 表单
				customer_name: '',
				industry_id: '',
				scale_id: '',
				region: [],
				capital: '',
				address: '',
				url: '',
				remarks: ''
			},
			system: {
				staff_name: '',
				create_time: '',
				update_time: '',
				change_times: ''
			},
			ruleValidate: {
				customer_name: [
					{ required: true, message: '客户姓名不能为空', trigger: 'blur' }
				],
				capital: [
					{ required: true, type: 'number', message: '注册资金不能为空', trigger: 'blur' }
				],
				region: [
					{ required: true, type: 'array', message: '地区不能为空', trigger: 'change' }
				],
				industry_id: [
					{ required: true, type: 'number', message: '行业不能为空', trigger: 'change' }
				]
			},
			sign_info: [
				{
					title: '标记原因',
					key: 'type_str',
					minWidth: 120
				},
				{
					title: '备注',
					key: 'remark',
					minWidth: 140,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.remark ? <AutoTooltip
										content={params.row.remark}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}

							</div>
						);
					}
				},
				{
					title: '标记人',
					key: 'staff_name',
					minWidth: 150,
					render: (h, params) => {
						const staff_name = `${params.row.staff_name}（${params.row.depart_name}）`;
						return (
							<div>
								{
									staff_name ? <AutoTooltip
										content={staff_name}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				},
				{
					title: '标记时间',
					key: 'create_time',
					minWidth: 220,
					render: (h, prams) => {
						return (
							<div>
								<span>{prams.row.create_time}</span>
								<span class="g-m-l-10 g-c-red-mid">{prams.row.delete_str}</span>
							</div>
						);
					}
				}
			]
		};
	},
	watch: {
		customerId() {
			this.isEdit = false;
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		renderTitle(h, param = {}) {
			const { create_time, staff_name, index } = param.rows;
			return (
				<p class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					<span>{ staff_name }</span>
					<span class="g-m-l-20" style="color: #4B4F57">{ create_time }</span>
				</p>
			);
		},
		renderContent(h, param = {}) {
			const { remark, type } = param.rows;
			return (
				<p 
					class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak"
				>
					{ remark }
				</p>
			);
		},
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.basicInfo = {};
			this.beforeInfo = {};
			this.company_name = '';
			this.tel = '';
			this.basicForm = {// 表单
				customer_name: '',
				industry_id: '',
				scale_id: '',
				region: [],
				capital: '',
				address: '',
				url: '',
				remarks: ''
			};
			this.$request({
				url: '_SALE_CUSTOMER_CUSTOMER_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false,
			}).then(res => {
				this.loading = false;
				this.basicInfo = res.data;
				this.system = res.data.system;
				this.company_name = res.data.company_name;
				this.tel = res.data.tel;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击编辑
		 */
		handleEdit() {
			this.isEdit = true;
		},
		/**
		 * 点击取消
		 */
		handleReset() {
			Confirm.popup({ msg: '确认取消修改吗？' }).then(() => {
				this.isEdit = false;
				this.basicForm = JSON.parse(JSON.stringify(this.beforeInfo));
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 打开客户网址
		 */
		toUrl(url) {
			let customer_url = objRegex.validURLScheme.regex.test(url) ? url : `http://${url}`;
			window.open(customer_url);
		}
	}
};
</script>

<style lang="scss">
.v-finance-detail-customer-info {
	width: 100%;
	.__left {
		width: 45%;
	}
	.__right {
		width: 45%;
	}
	._title {
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
		.__btn {
			color: #2397f9;
		}
	}
	.__item {
		padding: 12px 0;
		color: #333;
		border-bottom: 1px solid #e8eaec;
		.__label {
			color: #818794;
			width: 150px;
		}
		.__info {
			width: 100%;
			color: #333;
			word-break: break-all;
		}
	}
	.ivu-form-item {
		display: flex;
	}
	.ivu-form-item-content {
		display: flex;
		margin-left: 0;
		width: 80%;
	}
	.ivu-form .ivu-form-item-label {
		width: 100px;
		color: #333;
	}
	.ivu-input-number {
		width: 100%;
	}
	.ivu-cascader {
		width: 100%;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
