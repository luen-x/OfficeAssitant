<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="addType?'新增话机信息':'编辑话机信息'"
		width="400"
		class="v-administration-phone-audit"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div v-if="!addType">
			<div class="_content">
				<span>员工姓名:</span>
				<span class="g-m-l-10">{{ EditData.staff_name }}</span>
			</div>
			<div class="_content">
				<span>手机号码:</span>
				<span class="g-m-l-10">{{ EditData.mobile }}</span>
			</div>
			<div class="_content">
				<span>所属部门:</span>
				<span class="g-m-l-10">{{ EditData.list_depart_name }}</span>
			</div>
		</div>
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="80" 
			class="g-pd-l-20">
			<i-form-item v-if="addType" label="新增员工:" prop="staff_name">
				<i-select
					v-model="formData.staff_name"
					:remote-method="loadStaffNew"
					:loading="staffLoading"
					:placeholder="'请输入员工姓名/手机号'"
					:style="{ width: '80%' }"
					filterable
					remote
					clearable
					transfer
					@on-change="handleStaffChange"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.label"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="坐席号:" prop="seat_number">
				<i-input
					v-model="formData.seat_number"
					:maxlength="4"
					placeholder="请输入坐席号"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="外线号码:" prop="pstn_number">
				<i-input
					v-model="formData.pstn_number"
					:maxlength="6"
					placeholder="请输入外线号码"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="座机号码:" prop="tel">
				<i-input
					v-model="formData.tel"
					:maxlength="11"
					placeholder="请输入座机号码"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Input, Form, FormItem, Select, Option, Button } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { dataValidity, objRegex, initTreeData } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		addType: Boolean,
		EditData: Object,
	},
	data() {
		return {
			visible: false,
			staffLoading: false,
			staffData: [],
			formData: {
				staff_id: (this.EditData && this.EditData.staff_id) || '',
				staff_name: (this.EditData && this.EditData.staff_name) || '',
				pstn_number: (this.EditData && this.EditData.pstn_number) || '',
				seat_number: (this.EditData && this.EditData.seat_number) || '',
				tel: (this.EditData && this.EditData.tel) || '',
			},
			rules: {
				pstn_number: [
					{
						required: true,
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				tel: [
					{
						required: true,
						type: "validMobile",
						message: "请输入座机号码",
						validator: dataValidity
					}
				],
				seat_number: [
					{
						required: true,
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				staff_name: [
					{ required: true, message: "转介绍人为必选", trigger: "change" }
				]
			}
		};
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
		loadStaffNew(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._ADMINISTRATION_PHONE_STAFF_NEW_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_ADMINISTRATION_PHONE_ADD_OR_EDIT_STAFF_POST',
						type: "POST",
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$store.commit('ADMINISTRATION_PHONE_LIST_INIT');
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleStaffChange(value) {
			for (let i = 0; i < this.staffData.length; i++) {
				if (this.staffData[i].label === value) {
					this.formData.staff_id = this.staffData[i].value;
					this.formData.pstn_number = this.staffData[i].pstn_number;
					this.formData.seat_number = this.staffData[i].seat_number;
					this.formData.tel = this.staffData[i].tel;
				}
			}
		},
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-administration-phone-audit {
    ._content {
        font-size: 12px;
        color: #515a6e;
        height: 32px;
        line-height: 32px;
        margin-left: 37px;
        margin-bottom: 5px;
    }
}
</style>