<template>
	<div class="g-m-t-30 g-pd-r-20 v-sc-common-dervice-voucher">
		<div class="g-flex g-jc-sb">
			<oa-title title="服务凭证"/>
			<vc-debounce-click
				class="g-red-btn-line g-m-r-10"
				@click="handleSubmitVoucher({})"
			>
				提交服务凭证
			</vc-debounce-click>
		</div>

		<i-table
			:columns="columns"
			:data="voucherData" 
			:stripe="true"
			class="g-m-t-20"
		/>
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import { Button, Table } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { SubmitVocher } from "./submit-vocher";
import { LookServiceVocher } from "./look-service-voucher";

export default {
	name: 'sc-service-voucher',

	components: {
		'oa-title': Title,
		'i-table': Table
	},

	props: {
		project_id: {
			required: true,
			type: Number
		}
	},

	data() {
		return {
			columns: [
				{
					title: '上传人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '上传时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '服务凭证',
					key: 'img',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div 
								class="g-operation" 
								onClick={() => { this.handleLookVocher(params.row); }}
							>
								查看凭证
							</div>
						);
					}
				},
				{
					title: '备注',
					key: 'remark',
					minWidth: 170,
					render: (h, params) => {
						if (params.row.remark) {
							return (
								<AutoToolTip 
									content={params.row.remark}
									width="140px"
									theme="dark"
									placement="bottom" 
									labelClass=" "
								/>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: '操作',
					key: '',
					minWidth: 100,
					render: (h, params) => {
						if (+params.row.is_edit === 1) {
							return (
								<div class="g-operation g-flex">
									<div 
										onClick={() => { this.handleSubmitVoucher(params.row); }}
									>
										编辑
									</div>
									<div class="g-m-lr-5">|</div>
									<div 
										onClick={() => { this.handleDelete(params.row.service_ticket_id); }}
									>
										删除
									</div>
								</div>
							);
						}
					}
				}
			],
			voucherData: []
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_TICKET_GET",
				type: "GET",
				param: {
					project_id: this.project_id
				}
			}).then(res => {
				this.voucherData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleSubmitVoucher(obj) {
			SubmitVocher.popup({
				project_id: this.project_id,
				obj
			}).then(res => {
				res && this.loadData();
			});
		},

		handleLookVocher(obj) {
			LookServiceVocher.popup({
				obj
			}).then();
		},

		handleDelete(service_ticket_id) {
			Confirm.popup({
				title: "删除服务凭证",
				msg: "确认删除该条服务凭证？"
			}).then(() => {
				this.$request({
					url: "_SC_CUSTOMER_COOPERATE_TICKET_DEL_POST",
					type: "POST",
					param: {
						service_ticket_id
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					res && this.loadData();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-common-dervice-voucher{
	padding-left: 32px;
}
</style>