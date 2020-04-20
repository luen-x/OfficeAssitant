<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="累计通关案例数"
			ok-text="删除"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-check-box-group v-model="scoreRecordId">
				<div 
					v-for="(item,index) in recordList"
					:key="index"
					class="g-tc"
				>
					<i-check-box :label="item.score_record_id">
						<span class="g-m-l-10">{{ item.create_time }}</span>
						<span class="g-m-lr-10 g-inline-block" style="width: 100px;">
							{{ item.score }}分
						</span>
					</i-check-box>
				</div>
			</i-check-box-group>
		</i-modal>
	</div>
</template>

<script>
import { Modal, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-academy-train-upload-cumulative-clearance-modal',
	components: {
		'i-modal': Modal,
		'i-check-box-group': CheckboxGroup,
		'i-check-box': Checkbox
	},
	props: {
		record: {
			required: true,
			type: Array
		}
	},
	data() {
		return {
			recordList: [],
			scoreRecordId: [],
			visible: false
		};
	},
	mounted() {
		this.recordList = this.record;
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: "_ACADEMY_TRAIN_UPLOAD_SCORE_CANCEL_POST",
				type: "POST",
				param: {
					score_record_id: this.scoreRecordId
				}
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
export const CumulativeClearance = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>