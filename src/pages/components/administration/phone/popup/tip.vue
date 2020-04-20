<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="回收话机"
		width="400" 
	>
		<div style="height:100px" class="g-flex g-flex-ac g-flex-cc g-fs-14">
			回收话机后，该员工将被移出话机管理列表，确认回收？
		</div>
		<div slot="footer" class="_footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" class="g-red-btn-small" @click="handleSave">确定</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		staff_id: String | Number // customer_id
	},
	data() {
		return {
			visible: false,
			rules: {
				prop: []
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$request({
				url: '_ADMINISTRATION_PHONE_DEL_POST',
				type: "POST",
				param: {
					staff_id: this.staff_id
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit('sure');
				this.$store.commit('ADMINISTRATION_PHONE_LIST_INIT');
			}).catch((res) => {
				this.$Message.error(res.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const TipModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>