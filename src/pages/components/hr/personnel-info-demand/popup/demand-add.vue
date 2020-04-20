<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-employee-demand-add" 
		width="400"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			
			<span>添加需求职位</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div style="height:15px;"/>
			<i-form-item label="用人部门：" prop="depart_id">
				<i-cascader
					v-if="level == 2 && departMy.length"
					:data="departMy"
					v-model="formData.depart_id"
					change-on-select
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width:220px"
					@on-change="handlePosition({depart_id: $event})"
				/>
				<span v-if="level == 3">{{ $global.staff.depart_name }}</span>
			</i-form-item>
			<i-form-item label="职位名称：" prop="position_id">
				<i-select
					v-model="formData.position_id"
					placeholder="请选择职位"
					clearable
					transfer
					style="width: 220px"
				>
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="急需人数：" prop="need_number">
				<i-input-number
					v-model="formData.need_number"
					:min="1"
					placeholder="请输入急需人数"
					style="width:220px;"
				/>
			</i-form-item>
			<i-form-item label="人员标准：" prop="staff_standard">
				<oa-limit-words 
					v-model="formData.staff_standard"
					:max="500"
					placeholder="请输入人员标准"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Cascader, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from '@stores/services/hr';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';
import { getLevel } from '@components/sale/_common/util';

export default {
	name: "oa-service-add-attention",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords,
		'i-cascader': Cascader,
		'i-input-number': InputNumber,
	},
	mixins: [
		orderModal,
		services.departMy()
	],
	data() {
		return {
			visible: false,
			positionList: [],
			formData: {
				depart_id: [],
				position_id: '',
				need_number: null,
				staff_standard: ''
			},
			rules: {
				depart_id: [
					{ required: true, type: 'array', message: "请选择用人部门", trigger: "change" }
				],
				position_id: [
					{ required: true, type: 'number', message: "请选择职位", trigger: "change" }
				],
				need_number: [
					{ required: true, type: 'number', message: "请输入急需人数", trigger: "blur" }
				]
			}
		};
	},
	computed: {
		level() {
			return getLevel();
		}
	},
	mounted() {
		this.visible = true;
		if (this.level == 3) {
			this.loadDepartData();
		}
	},
	methods: {
		loadDepartData() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DEPART_IDS_GET',
				type: 'GET',
				loading: false,
				param: {
					depart_id: this.$global.staff.depart_id
				}
			}).then((res) => {
				this.formData.depart_id = res.data;
				this.getPositionList(res.data[0]);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handlePosition(obj) {
			if (obj.depart_id.length) {
				this.$request({
					url: '_HR_EMPLOYEE_SUMMARY_DEPART_IDS_GET',
					type: 'GET',
					param: {
						depart_id: obj.depart_id[obj.depart_id.length - 1]
					},
					loading: false
				}).then((res) => {
					this.getPositionList(res.data[0]);
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			} 
		},
		getPositionList(depart_id) {
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				loading: false
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id === depart_id)[0].positions;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_HR_EMPLOYEE_SUMMARY_NEED_ADD_POST',
						type: "POST",
						loading: false,
						param: { ...this.formData },
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const EmployeeDemandAdd = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">

</style>

