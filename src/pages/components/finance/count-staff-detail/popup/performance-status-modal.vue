<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400"
		class="v-finance-performance-status-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>修改记录</div>
		<div
			v-if="obj.length"
			class="_content"
		>
			<oa-steps
				:data-source="obj"
				:type="1"
				:render-title="renderTitle"
				:render-content="renderContent"
				class="g-m-t-15 g-m-l-15"
			/>
		</div>
		<div
			v-else
			class="g-flex g-flex-ac g-flex-cc g-m-t-30"
		>
			暂无数据，请稍后再试。
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
	name: "v-finance-performance-status-modal",
	components: {
		"i-modal": Modal,
		"i-progress": Progress,
		"oa-steps": Steps
	},
	props: {
		staff_id: String | Number,
		month: String,
		scenario: Number
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
				url: API._FINANCE_BS_PERFORMANCE_CHANGE_RECORD_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id,
					month: this.month,
					scenario: this.scenario,
					change_type: 7
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
			const { create_time, operate_staff_name } = params.rows;
			return (
				<div style="margin:0 10px 0 10px;">
					<span>{create_time}</span>
					<span> {operate_staff_name} </span>
				</div>
			);
		},
		renderContent(h, params) {
			const {
				amount_diff,
				amount_after,
				content,
				calculate_type_name
			} = params.rows;
			return (
				<div style="margin:10px 10px 10px 10px;color:#333">
					<span class="g-flex g-m-b-10">
						<span> 提成业绩：{amount_after}</span>
						<span class="g-m-l-20">
							{" "}
							{calculate_type_name}
							{amount_diff}
						</span>
					</span>
					<div style="color:#bbb">{content}</div>
				</div>
			);
		}
	}
};

export const PerformanceStatusModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-finance-performance-status-modal {
  .ivu-modal-content {
	.ivu-modal-body {
	  padding: 20px !important;
	}
	.ivu-modal-footer {
	  padding: 0px 20px 20px 18px !important;
	}
	._content {
	  max-height: 600px;
	  overflow-y: auto;
	  padding-left: 10px;
	}
  }
}
</style>


