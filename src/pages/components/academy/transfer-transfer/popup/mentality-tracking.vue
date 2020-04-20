<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="心态跟踪"
			class="v-academy-mentality-tracking-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div>
				<oa-record slot="content" :records="recordsList" max-height="300px">
					<div slot-scope="{data}" style="position:relative;top:4px;">
						<div>
							<span>{{ data.staff_name }}</span>
							<span class="g-m-l-10">{{ data.create_time }}</span>
						</div>
						<div class="g-pd-10 _remark">
							{{ data.content }}
						</div>
					</div>
				</oa-record>
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="心态跟踪：" prop="remarks">
					<oa-limit-words
						v-model="formData.remarks"
						:max="200"
						placeholder="请输入心态跟踪"
						style="width: 520px"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import Record from "@components/_common/record/record";

export default {
	name: 'v-academy-mentality-tracking-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-record': Record
	},
	props: {
		records: {
			required: true,
			type: Array
		},
		applicantId: {
			required: true,
			type: Number
		}
	},
	data() {
		return {
			recordsList: [],
			formData: {
				remarks: ""
			},
			formDataRule: {
				remarks: [
					{
						required: true,
						message: "请输入心态跟踪！",
						trigger: "blur"
					}
				]
			},
			visible: false
		};
	},
	mounted() {
		this.records.forEach(item => {
			this.recordsList.push({
				id: item.remark_id,
				...item
			});
		});

		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_MENTALITY_TRACKING_POST",
				type: "POST",
				param: [
					{
						applicant_id: this.applicantId,
						remarks: this.formData.remarks
					}
				]
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const MentalityTracking = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-mentality-tracking-modal{
	._remark{
		width: 520px;
		min-height: 60px;
		max-height: 60px;
		overflow-y: auto;
		background: #fafafa;
	}
}
</style>