<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:width="400"
			:mask-closable="false"
			class="v-hr-assess-integration-relation"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				关联规则
			</div>
			<div class="g-flex g-ai-c g-jc-c">
				<div class="g-flex g-fd-c">
					<span>选择已有关联组。</span>
					<i-select
						v-model="relate_number"
						style="width: 220px"
						class="g-m-t-20"
					>
						<i-option 
							v-for="(item, index) of arr"
							:key="index"
							:value="index + 1">{{ type_name }}关联组{{ index + 1 }}</i-option>
					</i-select>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-system-integration-relation',
	components: {
		'i-modal': Modal,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		cycle_id: Number,
		rule_info_id: Number,
		type_id: Number,
		type_name: String,
		cate: String
	},
	data() {
		return {
			relate_number: '',
			visible: false,
			arr: Array.from({ length: 5 })
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$request({
				url: '_HR_SYSTEM_ASSESS_CREDITINTE_RELATE_SET_POST',
				type: 'GET',
				loading: false,
				param: {
					relate_number: this.relate_number,
					rule_info_id: this.rule_info_id,
					cycle_id: this.cycle_id,
					type_id: this.type_id,
					cate: this.cate
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const RelationModal = CreatePortal({ }, module.exports.default);
</script>

<style lang="scss" scoped>
</style>


