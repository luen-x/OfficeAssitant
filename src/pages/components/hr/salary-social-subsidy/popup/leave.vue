<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-v-salary-social-subsidy-leave"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			提示
		</div>
		<div class="g-fs-14">
			<div class="g-m-l-20">
				信息尚未保存，是否离开此页面？
			</div>
		</div>
	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, Input, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";


export default {
	name: "v-salary-social-subsidy-leave",
	components: {
		"i-modal": Modal,
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit("sure");	
		},
		handleCancel() {
			this.$emit("close");
			this.visible = false;
		}
	}
};
export const LeaveModal = CreatePortal({}, module.exports.default);
</script>
