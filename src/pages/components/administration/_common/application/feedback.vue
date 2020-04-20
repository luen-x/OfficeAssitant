<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="400"
			class="v-application-mine-feedback-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120"
				class="g-m-t-20"
			>
				<i-form-item label="服务评价:" prop="service_score"> 
					<i-rate v-model="formValidate.service_score" allow-half />
				</i-form-item>
				<i-form-item label="评价:" prop="evaluate">
					<oa-limit-words
						v-model="formValidate.evaluate"
						:max="200"
						style="width: 222px"
						placeholder="请填写评价"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal, Rate, Form, FormItem 
} from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "hr-add-feedback-modal",
	components: {
		"i-modal": Modal,
		"i-rate": Rate,
		"i-form": Form,
		"i-form-item": FormItem,
		'oa-limit-words': LimitWords,
	},
	props: {
		title: String,
		eventId: Number
	},
	data() {
		return {
			visible: false,
			formValidate: {
				service_score: 0,
			},
			ruleValidate: {
				service_score: [
					{ required: true, type: 'number', message: "服务评价为必选", trigger: "change" }
				],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: lodash.debounce(function (event) {
		// handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_EVALUATE_POST,
						type: "POST",
						param: {
							...this.formValidate,
							service_score: this.formValidate.service_score * 2,
							event_id: this.eventId
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure", true);
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(error.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 0),
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		}
	}
};

export const FeedbackModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-application-mine-feedback-modal{
	.ivu-modal-content{
		.ivu-modal-body{
			padding:6px 0px !important;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
}
</style>


