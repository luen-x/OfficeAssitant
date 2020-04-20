<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		:loading="true"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>修改提成业绩</div>
		<div class="g-m-l-10 g-m-t-30">
			<span class="g-m-l-20">提成业绩：</span><span class="g-m-l-10">{{ minus_performance }}</span>
		</div>
		<i-form
			ref="formValidate"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="100"
			class="g-m-t-20"
		>
			<i-form-item
				label="修改类型："
				prop="calculate_type"
			>
				<i-radio-group v-model="formValidate.calculate_type">
					<i-radio label="2">减少</i-radio>
					<i-radio label="1">增加</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item
				label="变化金额："
				prop="amount_diff"
			>
				<i-input-number
					v-model="formValidate.amount_diff"
					:min="1"
					style="width: 220px"
					placeholder="请输入变化金额"
				/>
			</i-form-item>
			<i-form-item
				label="修改原因："
				prop="content"
			>
				<oa-limit-words
					v-model="formValidate.content"
					:max="200"
					width="220px"
					placeholder="请输入修改原因"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import {
	Divider,
	Modal,
	Form,
	FormItem,
	Input,
	Radio,
	RadioGroup,
	InputNumber 
} from "iview";
import { CreatePortal } from "wya-vc";
import lodash from "lodash";
import LimitWords from "@components/_common/limit-words/limit-words";
import API_ROOT from "@stores/apis/root";

export default {
	name: "finance-edit-minus-modal",
	components: {
		"i-modal": Modal,
		"i-radio-group": RadioGroup,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio": Radio,
		"oa-limit-words": LimitWords
	},
	props: {
		staff_id: Number,
		month: String,
		minus_performance: String,
	},
	data() {
		const validateMobile = (rule, value, callback) => {
			if (this.formValidate.calculate_type === '2') {
				if (this.formValidate.amount_diff > this.minus_performance) {
					callback(new Error('变化金额应该小于提成金额'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};
		return {
			visible: false,
			formValidate: {
				calculate_type: "2",
				amount_diff: 0,
				content: ""
			},
			ruleValidate: {
				calculate_type: {
					required: true,
					message: "请选择修改类型",
					trigger: "change"
				},
				amount_diff: [
					{
						required: true,
						type: 'number',
						message: "请输入变化金额",
						trigger: "blur"
					},
					{ validator: validateMobile, trigger: "blur" }
				],
				content: [
					{
						required: true,
						message: "请输入修改原因",
						trigger: "blur"
					}
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._FINANCE_COUNT_STAFF_EDIT_MINUS_PERFORMANCE_GET,
						type: "GET",
						param: {
							...this.formValidate,
							staff_id: this.staff_id,
							month: this.month, 
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure");
					}).catch(err => {
						this.$Message.error(err.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
			this.$refs.modal.buttonLoading = false;
		},
		handleCancel() {
			this.$emit("close");
		},
	}
};
export const EditModal = CreatePortal(
	{ store: app.$store },
	module.exports.default
);
</script>

<style lang="scss" scoped>
</style>


