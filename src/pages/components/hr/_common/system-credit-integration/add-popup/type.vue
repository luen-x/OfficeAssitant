<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:width="400"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ id ? `编辑${name}类型` : `新增${name}类型` }}
			</div>
			<i-form 
				ref="form"
				:model="formdata" 
				:rules="validator"
				:label-width="100" 
				class="g-m-t-20">
				<i-formitem :label="`${name}类型名称:`" prop="type_name" >
					<i-input
						v-model="formdata.type_name"
						:placeholder="`请输入${name}类型名称`"
						:maxlength="15"
						style="width: 220px"
					/>
				</i-formitem>
				<i-formitem :label="`${name}上限:`" prop="year_maximum" >
					<i-input-number
						v-model="formdata.year_maximum"
						:max="999"
						:min="type=='1'?0:undefined"
						:placeholder="`请输入${name}上限`"
						style="width: 220px"
					/>
				</i-formitem>
				<i-formitem v-if="type === '2'" :label="`每月上限:`" prop="month_maximum" >
					<i-input-number
						v-model="formdata.month_maximum"
						:max="999"
						:placeholder="`请输入每月上限`"
						style="width: 220px"
					/>
				</i-formitem>
				<i-formitem :label="`${name}简介`">
					<i-textarea 
						v-model="formdata.description"
						:placeholder="`请输入${name}简介`"
						:max="50"
						clearable
						style="width: 220px"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-system-integration-type',
	components: {
		'i-modal': Modal,
		'i-textarea': TextArea,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	props: {
		id: Number,
		type: String,
		item: Object
	},
	data() {
		const name = this.type === '1' ? '积分' : '学分';
		return {
			visible: false,
			formdata: {
				year_maximum: null,
				month_maximum: null,
				...this.item
			},
			name,
			validator: {
				type_name: [{ required: true, message: `请输入${name}类型名称`, trigger: 'blur' }],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs['form'].validate((item) => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$emit('sure', { data: { ...this.formdata, index: this.id } });
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
	}
};
export const TypeModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


