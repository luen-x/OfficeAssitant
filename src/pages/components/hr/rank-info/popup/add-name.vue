<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-add-name-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				{{ type === 'edit' ? '修改级称' : '新增级称' }}
			</div>
			<i-form 
				ref="nameForm" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100"
				class="_content"
			>
				<i-form-item label="级称名称:" prop="rank_name">
					<i-input
						v-model="formValidate.rank_name"
						:maxlength="10"
						clearable
						style="width: 220px"
						placeholder="请输入级称名称，10字以内"
					/>
				</i-form-item>
				<i-form-item label="设置上级级称:" prop="up_level">
					<i-select 
						v-model="formValidate.up_level"
						clearable 
						transfer
						style="width: 220px"
						placeholder="无，默认为最高等级"
					>
						<i-option 
							v-for="(item, index) in ranks"
							:key="index"
							:value="item.sort_id"
						>
							{{ item.rank_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="级称固定补贴:" prop="regular_subsidy" class="g-relative">
					<i-input-number
						v-model="formValidate.regular_subsidy"
						:max="1000000"
						:min="0"
						:precision="2"
						:active-change="false" 
						style="width: 220px"
						placeholder="0"
					/>
					<span class="g-absolute" style="left: 168px; top: 2px">
						元/月
					</span>
				</i-form-item>
				<i-form-item label="级称业绩提成:" prop="commission_rate">
					<i-input-number
						v-model="formValidate.commission_rate"
						:max="100"
						:precision="2"
						:min="0"
						:active-change="false" 
						style="width: 220px"
						placeholder="0"
					/>
					<span class="g-absolute" style="left: 188px; top: 2px">
						%
					</span>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';

export default {
	name: 'hr-add-rank-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
	},
	props: {
		type: String,
		info: Object,
		ranks: Array
	},
	data() {
		const validateName = debounce((rule, value, callback) => {
			let arr = this.ranks.findIndex((item) => item.rank_name === value);
			if (arr > -1 && this.type === 'add') {
				callback(new Error('该级称已存在，请检查后重新添加'));
			} else {
				callback();
			}
		}, 300);

		return {
			visible: false,
			formValidate: {
				rank_name: this.info.rank_name,
				regular_subsidy: Number(this.info.regular_subsidy) || null,
				commission_rate: Number(this.info.commission_rate) || null,
				up_level: (this.ranks[this.info.level] || []).sort_id || null
			},
			ruleValidate: {
				rank_name: [
					{ required: true, message: '请输入级称名称', trigger: 'blur' },
					{ validator: validateName, trigger: 'input' }
				],
				regular_subsidy: [
					{ required: true, message: '级称固定补贴' }
				],
				commission_rate: [
					{ required: true, message: '级称业绩提成' }
				],
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.nameForm.validate((valid) => {
				if (valid) {
					let level = this.ranks.findIndex((item) => {
						return item.sort_id == this.formValidate.up_level;
					});
					this.visible = false;
					this.$emit('sure', {
						rank_name: this.formValidate.rank_name,
						sort_id: this.info.sort_id || new Date().getTime(),
						regular_subsidy: this.formValidate.regular_subsidy || '0.00',
						commission_rate: this.formValidate.commission_rate || '0.00',
						level: level === -1 ? this.ranks.length : level
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddNameModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-add-name-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		padding: 0;
		color: #333333;
		font-size: 14px;
	}
}
</style>