<template>
	<div>
		<i-modal 
			ref="modal" 
			v-model="visible" 
			:loading="true" 
			:mask-closable="false" 
			width="400" 
			class="v-application-mine-status-modal" 
			@on-ok="handleOk" 
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="g-flex g-m-l-30 g-m-t-20 g-m-b-10 g-fs-14 g-fd-c _item">
				<i-progress :percent="obj.completion_rate" />
				<oa-steps 
					v-if="obj.detail.length" 
					:data-source="obj.detail" 
					:type="1" 
					:render-title="renderTitle" 
					:render-content="renderContent" 
					style="width:93%"
					class="g-m-t-15" 
				/>
			</div>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal,
	Button,
	Progress
} from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
		'i-progress': Progress,
		"oa-steps": Steps
	},
	props: {
		title: String,
		eventId: Number
	},
	data() {
		return {
			visible: false,
			obj: {
				completion_rate: 0,
				detail: []
			}
		};
	},
	computed: {},
	created() {
		this.eventId && this.fetchData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetchData() {
			this.$request({
				url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_RATE_DETAIL_GET,
				type: "GET",
				param: {
					event_id: this.eventId
				}
			}).then(res => {
				this.obj = res.data;
			}).catch(err => {});
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
			const { create_time, operate_name } = params.rows;
			return (
				<div style = "margin:0 0 0 10px;" >
					<span > { operate_name } </span>
					<span class="g-pd-l-10">{create_time}</span >
				</div>
			);
		},
		renderContent(h, params) {
			const { event_rate_detail } = params.rows;
			return (
				<div style = "margin:0 10px 20px 10px;color:#000" >
					<div > { event_rate_detail } </div>
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
	._item {
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>


