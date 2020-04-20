<template>
	<div class="g-relative">
		<oa-loading v-if="loading"/>
		<oa-customer-base-info
			:customer-id="customerId"
			:basic-info="basicInfo.basic_info"
			:update-info="basicInfo.update_info"
			:read-only="readOnly"
			class="g-m-t-20"
			@change="handleChangeData"
		/>
		<div class="v-sale-sea-customer-info">
			<div ref="content">
				<div class="_title g-m-tb-20">
					<span class="__title-bar"/>
					<span class=" g-pd-l-5 g-fs-14">系统记录</span>
				</div>
				<div class="_content g-flex g-jc-sb">
					<div class="__left g-m-l-15">
						<div class="__item g-flex g-pd-tb-10">
							<div class="__label">创建人</div>
							<div class="__info">{{ system.staff_name || '--' }}</div>
						</div>
						<div class="__item g-flex g-pd-tb-10">
							<div class="__label">创建时间</div>
							<div class="__info">{{ system.create_time || '--' }}</div>
						</div>
					</div>
					<div class="__right">
						<div class="__item g-flex g-pd-tb-10">
							<div class="__label">最近更新</div>
							<div class="__info">{{ system.update_time || '--' }}</div>
						</div>
						<div class="__item g-flex g-pd-tb-10">
							<div class="__label">转手次数</div>
							<div class="__info">{{ system.change_times || '--' }}</div>
						</div>
					</div>
				</div>
				<template v-if="level_list.length">
					<div class="_title g-m-tb-20">
						<span class="__title-bar"/>
						<span class=" g-pd-l-5 g-fs-14">客户等级记录</span>
					</div>
					<div class="g-m-l-20 g-fs-14 g-c-black3">
						<div
							v-for="(level,index) in level_list || []"
							:key="index"
							class="g-pd-tb-10 g-pd-l-20 g-m-b-10"
							style="background:#f5f5f6"
						>
							<span >{{ level.level_name }}</span>
							<span class="g-m-l-30">{{ level.level_num }} 次</span>
						</div>
					</div>
				</template>
				<template v-if="basicInfo.sign_list && basicInfo.sign_list.length">
					<div class="_title g-m-tb-20">
						<span class="__title-bar"/>
						<span class=" g-pd-l-5 g-fs-14">标记记录</span>
					</div>
					<div class="g-m-l-20 g-m-b-20 g-fs-14 g-c-black3">
						<i-table
							:columns="sign_info"
							:data="basicInfo.sign_list"
							stripe
						/>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Cascader, Select, Option, Form, FormItem, InputNumber, Table } from "iview";
import { objRegex } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import LimitWords from '@components/_common/limit-words/limit-words';
import { services } from '@stores/services/sale';
import Loading from '@components/_common/loading/loading';
import { Confirm } from "@common/confirm/confirm";
import { CheckVoucher } from '../../sea-black/popup/check-voucher';
import CustomerBaseInfo from "../../_common/customer-base-info";

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
		'oa-customer-base-info': CustomerBaseInfo
	},
	mixins: [
		services.industryList(),
		services.scaleList(),
		services.region3()
	],
	props: {
		customerId: [String, Number],
		readOnly: Boolean
	},
	data() {
		return {
			isEdit: false,
			loading: false,
			basicInfo: {}, // 基本信息
			company_name: '', // 公司名称
			tel: '', // 公司电话
			beforeInfo: {}, // 编辑之前的数据
			system: {}, // 系统记录
			level_list: [],
			sign_list: [],
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
					title: '凭证',
					key: 'remark',
					minWidth: 140,
					render: (h, params) => {
						return (
							<div onClick={() => { this.handleCheckVoucher(params.row); }} class="g-operation">查看凭证</div>
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
		/**
		 * 初始化加载
		 */
		 handleCheckVoucher(row) {
			CheckVoucher.popup({
				recycle_staff_id: row.recycle_staff_id
			}).then(() => {}).catch(() => {});
		 },
		handleChangeData() {
			this.loadData();
			this.$store.commit('SALE_SEA_ARCHIVE_LIST_RESET', { type: '1' });
		},
		loadData() {
			this.$emit("reset");
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
				url: '_SALE_SEA_CUSTOMER_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false,
			}).then(res => {
				this.loading = false;
				this.basicInfo = res.data;
				this.company_name = res.data.company_name;
				this.system = res.data.system;
				this.level_list = res.data.level_list;
				this.sign_list = res.data.sign_list;
				this.tel = res.data.tel;
				this.basicForm = {
					customer_name: res.data.customer_name,
					industry_id: res.data.industry_id,
					scale_id: res.data.scale_id,
					region: [res.data.province, res.data.city, res.data.area],
					capital: Number(res.data.capital),
					address: res.data.address,
					url: res.data.url,
					remarks: res.data.remarks
				};
				this.beforeInfo = JSON.parse(JSON.stringify(this.basicForm));
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
		 * 点击保存
		 */
		handleSave(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_SEA_SAVE_INFO_POST',
						type: 'POST',
						loading: false,
						param: {
							customer_id: this.customerId,
							customer_name: this.basicForm.customer_name,
							industry_id: this.basicForm.industry_id,
							scale_id: this.basicForm.scale_id,
							province: this.basicForm.region[0],
							city: this.basicForm.region[1],
							area: this.basicForm.region[2],
							capital: this.basicForm.capital,
							address: this.basicForm.address,
							url: this.basicForm.url,
							remarks: this.basicForm.remarks
						},
						autoTip: true,
					}).then(res => {
						this.loadData();
						this.isEdit = false;
						this.$store.commit('SALE_SEA_ARCHIVE_LIST_RESET', { type: '1' });
					}).catch(error => {});
				}
			});
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
.v-sale-sea-customer-info {
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
