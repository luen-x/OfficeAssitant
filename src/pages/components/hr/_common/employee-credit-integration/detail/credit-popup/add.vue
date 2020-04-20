<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ name }}添加
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="归属月份" prop="month">
				<i-datepicker
					v-model="formdata.month"
					type="month"
					placeholder="请选择月份"
					style="width: 220px"
					transfer
					@on-change="handleSearchType"
				/>
			</i-formitem>
			<i-formitem :label="`${name}类型`" prop="type_id">
				<i-select
					v-model="formdata.type_id"
					:placeholder="`请选择${name}指标`"
					style="width: 220px"
				>
					<i-option 
						v-for="item of typeArr"
						:key="item.type_id"
						:value="item.type_id + ''">{{ item.type_name }}</i-option>
				</i-select>
			</i-formitem>
			<i-formitem :label="`${name}调整`" prop="point">
				<i-input-number
					v-model="formdata.point"
					:placeholder="`请输入调整${name}（可输入负数扣分）`"
					:max="99"
					:min="-99"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem label="提示说明" prop="reason">
				<oa-textarea 
					v-model="formdata.reason"
					:max="50"
					placeholder="请填写提示说明"
					clearable
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber, Select, Option, DatePicker } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-detail-add',
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'oa-textarea': TextArea
	},
	props: {
		query: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				point: null
			},
			typeArr: [],
			validator: {
				month: [
					{ required: true, type: 'date', message: '请选择月份', trigger: 'change' }
				],
				type_id: [
					{ required: true, message: '请选择类型', trigger: 'change' }
				],
				point: [
					{ required: true, type: 'number', message: '请输入调整分数', trigger: 'blur' }
				],
				reason: [
					{ required: true, message: '请输入提示说明', trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		name() {
			return this.query.cate === '1' ? '积分' : '学分';
		}
	},
	mounted() {
		this.visible = true;
		// this.handleSearchType();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_CREDITINTE_ADD_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							...this.query,
							month: this.formdata.month && moment(this.formdata.month).format('YYYY-MM')
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSearchType(month) {
			this.typeArr = [];
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDITINTE_ADD_TYPE_GET',
				type: 'POST',
				loading: false,
				param: {
					...this.query,
					month
				}
			}).then(res => {
				this.typeArr = res.data;
			}).catch(err => {
				this.typeArr = [];
				this.$Message.error(err.msg);
			});
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>