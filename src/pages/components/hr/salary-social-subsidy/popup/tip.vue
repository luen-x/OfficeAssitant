<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-try-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			提示
		</div>
		<div class="g-fs-14">
			<div v-if="type==='2'">
				转到社保后将无法转回，是否转到补贴？
			</div>
			<div v-if="type==='1'">
				<div >
					<div style="marginLeft:44px">
						转到补贴后将无法转回，是否转到补贴？
					</div>
				</div>
				<i-form
					ref="form"
					:model="formData"
					:rules="rule"
					:label-width="100"
					class="g-m-lr-20 g-m-t-20">
					<i-form-item label="补贴金额：" prop="subsidy_money">
						<i-input
							v-model="formData.subsidy_money"
							:maxlength="7"
							placeholder="请输入补贴金额"
							width="220px"/>
					</i-form-item>
				</i-form>
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
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-input': Input
	},
	props: {
		staffArr: Array,
		type: String,
		staffId: [String, Number],
		loadData: Function
	},
	data() {
		return {
			visible: false,
			formData: {},
			rule: {
				subsidy_money: [
					{ 
						// required: true, 
						message: "请输入补贴金额", 
						trigger: "blur" 
					}
				],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT._HR_SALARY_SOCIAL_SUBSIDY_CONVERSION_POST,
				type: "POST",
				param: {
					staff_id: this.staffId ? [this.staffId] : this.staffArr,
					type: this.type,
					subsidy_money: this.formData.subsidy_money
				},
				loading: false
			}).then(res => {
				this.$emit("sure");	
				this.loadData();
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.warning(err.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
export const TipModal = CreatePortal({}, module.exports.default);
</script>
