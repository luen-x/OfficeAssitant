<template>
	<div class="g-relative">
		<oa-loading v-if="loading"/>
		<div class="v-sale-black-customer-info">
			<div>
				<oa-customer-base-info
					:customer-id="customerId"
					:basic-info="basicInfo.basic_info"
					:read-only="readOnly"
					class="g-m-t-20"
					@change="handleChangeData"
				/>
				<div class="_title g-m-b-20 g-m-t-30">
					<span class="__title-bar"/>
					<span class="g-pd-l-5 g-fs-14">系统记录</span>
				</div>
				<div class="_content g-flex g-jc-sb">
					<div class="__left g-m-l-15">
						<div class="__item g-flex">
							<div class="__label">创建人</div>
							<div class="__info">{{ system.staff_name || '--' }}</div>
						</div>
						<div class="__item g-flex">
							<div class="__label">创建时间</div>
							<div class="__info">{{ system.create_time || '--' }}</div>
						</div>
						<div
							v-if="system.confirm_time"
							class="__item g-flex"
						>
							<div class="__label">确认时间</div>
							<div class="__info">{{ system.confirm_time }}</div>
						</div>
					</div>
					<div class="__right">
						<div class="__item g-flex">
							<div class="__label">最近更新</div>
							<div class="__info">{{ system.update_time || '--' }}</div>
						</div>
						<div class="__item g-flex">
							<div class="__label">转手次数</div>
							<div class="__info">{{ system.change_times || '--' }}</div>
						</div>
						<div
							v-if="system.confirm_staff"
							class="__item g-flex"
						>
							<div class="__label">确认人</div>
							<div class="__info">{{ system.confirm_staff }}</div>
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
						<span class="g-pd-l-5 g-fs-14">标记记录</span>
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
import { Table } from 'iview';
import { objRegex } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import Loading from '@components/_common/loading/loading';
import { CheckVoucher } from './check-voucher';
import CustomerBaseInfo from "../../_common/customer-base-info";

export default {
	name: "oa-black-customer-info",
	components: {
		'i-table': Table,
		'oa-loading': Loading,
		'oa-imgs-picker': ImgsPicker,
		'oa-customer-base-info': CustomerBaseInfo
	},
	props: {
		customerId: [String, Number],
		readOnly: Boolean
	},
	data() {
		return {
			loading: false,
			basicInfo: {
				basicInfo: {}
			}, // 基本信息
			system: {},
			level_list: [],
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
		handleChangeData() {
			this.$emit('reset');
			this.loadData();
			this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.$route.query.type || 2 });
		},
		 handleCheckVoucher(row) {
			CheckVoucher.popup({
				recycle_staff_id: row.recycle_staff_id
			}).then(() => {}).catch(() => {});
		 },
		loadData() {
			this.loading = true;
			this.basicInfo = {};
			this.$request({
				url: '_SALE_SEA_CUSTOMER_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.basicInfo = res.data;
				this.system = res.data.system;
				this.level_list = res.data.level_list;
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
		}
	}
};

export const BlackCustomerInfo = module.exports.default;
</script>

<style lang="scss">
.v-sale-black-customer-info {
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
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
