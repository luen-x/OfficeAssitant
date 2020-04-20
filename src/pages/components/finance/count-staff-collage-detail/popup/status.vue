<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400"
		class="v-finance-status-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>修改记录</div>
		<oa-steps
			v-if="obj.length"
			:data-source="obj"
			:type="1"
			:render-title="renderTitle"
			:render-content="renderContent"
			class="g-m-t-15 g-m-l-15"
		/>
		<div v-else class="g-flex g-flex-ac g-flex-cc g-m-t-20">
			暂无数据，请稍后再查。
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Progress } from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";

export default {
	name: "finance-count-staff-modal",
	components: {
		"i-modal": Modal,
		"i-progress": Progress,
		"oa-steps": Steps
	},
	props: {
		payment_id: Number
	},
	data() {
		return {
			visible: false,
			obj: []
		};
	},
	computed: {},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.$request({
				url: API._FINANCE_COUNT_STAFF_PAYMENT_RECORD_GET,
				type: "GET",
				param: {
					payment_id: this.payment_id 
				}
			})
				.then(res => {
					this.obj = res.data;
				})
				.catch(err => {});
		},
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		},
		renderTitle(h, params) {
			const { create_time, operate_staff } = params.rows;
			return (
				<div style="margin:0 10px 0 10px;">
					<span>{create_time}</span>
					<span> {operate_staff} </span>
				</div>
			);
		},
		renderContent(h, params) {
			const { shares, edit_reason } = params.rows;
			return (
				<div style="margin:10px 10px 10px 10px;color:#333">
					{shares.map(item => (
						<span class="g-flex g-m-b-10">
							<span>{item.name}：</span>
							<span class="g-m-r-20">{item.share_percent}</span>
						</span>
					))}
					<div style="color:#bbb">{edit_reason}</div>
				</div>
			);
		}
	}
};

export const StatusModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-application-mine-status-modal {
	.ivu-modal-content {
		.ivu-modal-body {
			padding: 6px 0px !important;
		}
		.ivu-modal-footer {
			padding: 0px 20px 20px 18px !important;
		}
	}
}
</style>


