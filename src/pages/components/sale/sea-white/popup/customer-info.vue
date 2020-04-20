<template>
	<div class="g-relative">
		<oa-loading v-if="loading"/>
		<div class="v-sale-white-customer-info">
			<div>
				<template v-if="basicInfo.business_type==0">
					<div class="_title g-m-t-30 g-m-b-20">
						<span class="__title-bar"/>
						<span class="g-pd-l-5 g-fs-14">基本信息</span>
					</div>
					<div class="_content g-flex g-jc-sb g-fw-w">
						<div class="__item g-flex __element" >
							<div class="__label">公司名称</div>
							<div class="__info">{{ basicInfo.company_name || '--' }}</div>
						</div>
						<div class="__item g-flex __element">
							<div class="__label">客户电话</div>
							<div class="__info">{{ basicInfo.tel || '--' }}</div>
						</div>
						<div class="__item g-flex __element">
							<div class="__label">客户姓名</div>
							<div class="__info">{{ basicInfo.customer_name || '--' }}</div>
						</div>
					</div>
				</template>
				<oa-customer-base-info
					v-else
					:read-only="true"
					:basic-info="basicInfo"
					class="g-m-t-20"
				/>
				<div class="_title g-m-b-20 g-m-t-30">
					<span class="__title-bar"/>
					<span class="g-pd-l-5 g-fs-14">系统记录</span>
				</div>
				<div class="_content g-flex g-jc-sb">
					<div class="__left g-m-l-15">
						<div
							v-if="system.hasOwnProperty('staff_name')"
							class="__item g-flex"
						>
							<div class="__label">创建人</div>
							<div class="__info">{{ system.staff_name || '--' }}</div>
						</div>
						<div
							v-if="system.hasOwnProperty('create_time')"
							class="__item g-flex"
						>
							<div class="__label">创建时间</div>
							<div class="__info">{{ system.create_time || '--' }}</div>
						</div>
					</div>
					<div class="__right">
						<div
							v-if="system.hasOwnProperty('update_time')"
							class="__item g-flex"
						>
							<div class="__label">最近更新</div>
							<div class="__info">{{ system.update_time || '--' }}</div>
						</div>
						<div
							v-if="system.hasOwnProperty('change_times')"
							class="__item g-flex"
						>
							<div class="__label">转手次数</div>
							<div class="__info">{{ system.change_times || '--' }}</div>
						</div>
					</div>
				</div>
				<template v-if="sign_list && sign_list.length">
					<div class="_title g-m-tb-20">
						<span class="__title-bar"/>
						<span class=" g-pd-l-5 g-fs-14">标记记录</span>
					</div>
					<div class="g-m-l-20 g-m-b-20 g-fs-14 g-c-black3">
						<i-table
							:columns="sign_info"
							:data="sign_list"
							stripe
						/>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { Table } from 'iview';
import { objRegex } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import Loading from '@components/_common/loading/loading';
import CustomerBaseInfo from "../../_common/customer-base-info";

export default {
	name: "oa-white-customer-info",
	components: {
		'i-table': Table,
		'oa-loading': Loading,
		'oa-imgs-picker': ImgsPicker,
		'oa-customer-base-info': CustomerBaseInfo
	},
	props: {
		type: [String, Number],
		whiteId: [String, Number]
	},
	data() {
		return {
			loading: false,
			basicInfo: {}, // 基本信息
			system: {}, // 系统记录
			sign_list: [],
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
		whiteId() {
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
		loadData() {
			this.loading = true;
			let url = '';
			this.basicInfo = {};
			this.$request({
				url: "_SALE_SEA_WHITE_CUSTOMER_INFO_GET",
				type: 'GET',
				loading: false,
				param: {
					white_id: this.whiteId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.basicInfo = res.data.basic_info;
				this.sign_list = res.data.sign_list;
				this.system = res.data.system;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 打开客户网址
		 */
		toUrl(url) {
			let customer_url = objRegex.validURLScheme.regex.test(url) ? url : `http://${url}`;
			window.open(customer_url);
		},
		handleOpen() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handleClose() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const WhiteCustomerInfo = module.exports.default;
</script>

<style lang="scss">
.v-sale-white-customer-info {
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
	}
	.__element{
		width:300px;
	}
	.__item {
		padding: 12px 0;
		border-bottom: 1px solid #e8eaec;
		.__label {
			width: 150px;
			color: #818794;
		}
		.__info {
			width: 100%;
			color: #333;
			word-break: break-all;
			.__img {
				width: 60px;
				height: 60px;
				border: 1px solid #e8eaec;
			}
		}
	}
}
</style>
