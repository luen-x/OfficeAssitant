<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="外出补贴"
			class="v-collage-setting-subsidy-evection-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item class="_label" label="补贴金额:" prop="money">
					<i-input-number 
						v-model="formData.money"
						:max="9999"
						:min="0"
						:precision="0"
						placeholder="金额" 
						style="width:75px;"
					/><span class="g-m-l-5">元/天</span>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Form, FormItem, Message, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'v-collage-setting-course-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
	},
	props: {
		name: Number,
		datas: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				money: null,
			},
			formdataRule: {
				money: [{ type: 'number', required: true, message: '请输入外出补贴', trigger: 'blur' }],
			},
		};
	},
	mounted() {
		this.visible = true;
		this.datas.is_set ? this.loadInfo() : '';
	},
	methods: {
		
		// 详情
		loadInfo() {
			this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_INFO_GET',
				type: "GET",
				param: {
					allowance_id: this.datas.allowance_id
				},
				loading: false
			}).then((res) => {
				this.formData.money = +res.data.money;
			}).catch((error) => {
			});
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let obj = {
				allowance_id: this.datas.allowance_id,
				money: this.formData.money,
			};
			this.$request({
				url: API_ROOT['_COLLAGE_SETTING_SUBSIDY_EDIT_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('修改成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const EvectionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-setting-subsidy-evection-modal {
	._label {
		position: relative;
		.ivu-input-number-input {
			position: absolute;
			top: -2px;
		}
	}
}
</style>


