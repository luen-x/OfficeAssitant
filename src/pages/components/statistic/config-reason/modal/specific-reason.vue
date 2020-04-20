<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		:title="`${category_id ?'编辑' : '添加'}具体原因`"
	>
		<i-form
			ref="form"
			:label-width="100"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item 
				label="退款原因："
				prop="reason_name"
			>
				<i-input
					v-model="formData.reason_name"
					:maxlength="8"
					clearable
					placeholder="请输入具体的退款原因"
					style="width: 220px;"
				/>
			</i-form-item>

			<i-form-item
				label="所属大类："
				prop="category_id"
			>
				<i-select
					v-model="formData.category_id"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择所属大类"
				>
					<i-option
						v-for="item in category"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
		</i-form>

		<template #footer>
			<i-button 
				size="large" 
				type="text"
				@click="handleOk(true)"
			>
				保存
			</i-button>
			<i-button 
				type="primary" 
				size="large"
				@click="handleOk(false)"
			>
				保存并继续
			</i-button>
		</template>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Button } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";

export default {
	name: 'v-statistic-config-reason-specific-reason-modal',
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-button": Button
	},
	props: {
		category: {
			type: Array,
			required: true
		},
		category_id: {
			type: [String, Number]
		},
		reason_name: {
			type: String
		},
		reason_id: {
			type: Number
		},
		url: {
			type: String
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				reason_name: '',
				category_id: ''
			},
			rule: {
				reason_name: [{ required: true, message: "请输入退款原因", trigger: "blur" }],
				category_id: [{ required: true, message: "请选择所属大类", trigger: "change" }]
			},
			deleteList: []
		};
	},
	mounted() {
		if (this.category_id) {
			this.formData.reason_name = this.reason_name;
			this.formData.category_id = '' + this.category_id;
		}

		this.visible = true;
	},
	methods: {
		handleOk(isClose) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave(isClose);
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		handleSave(isClose) {
			this.$request({
				url: '_STATISTIC_CONFIG_REASON_REFUND_SAVE_POST',
				type: "POST",
				param: {
					...this.formData,
					reason_id: this.reason_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				
				if (!isClose) {
					this.$refs.form.resetFields();
					this.$store.commit(this.url);
					this.visible = true;
				} else {
					this.visible = false;
					this.$emit("sure", true);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};

export const SpecificReason = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>