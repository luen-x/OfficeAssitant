<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-add-range-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				新增范围
			</div>
			<i-form 
				ref="nameForm" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100"
				class="_content"
			>
				<i-form-item label="职位:" prop="position_id">
					<i-select
						:value="formValidate.position_id"
						style="width: 220px" 
						transfer
						clearable 
						label-in-value
						placeholder="选择职位"
						@on-change="handleSelectPosition"
					>
						<i-option 
							v-for="(item) in positionData"
							:key="item.position_id"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="角色:" prop="role_id">
					<i-select
						:value="formValidate.role_id"
						style="width: 220px" 
						transfer
						clearable 
						label-in-value
						placeholder="选择角色"
						@on-change="handleSelectRole"
					>
						<i-option 
							v-for="(item, index) in roleData"
							:key="index"
							:value="item.role_id"
						>{{ item.role_name }}</i-option>
					</i-select>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-add-range-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
	},
	props: {
		departId: String | Number
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
			positionData: [],
			roleData: [],
			formValidate: {
				position_id: null,
				role_id: null,
				position_name: '',
				role_name: ''
			},
			ruleValidate: {
				position_id: [
					{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }
				]
			}
		};
	},
	computed: {
	},
	created() {
		this.loadDepartPosition();
		this.loadRole();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadDepartPosition() {
			this.$request({
				url: API_ROOT["_HR_DEPART_POSITION_GET"], // eslint-disable-line
				type: 'GET',
				param: {
					depart_id: this.departId
				},
				loading: false
			}).then((res) => {
				this.positionData = res.data[0].positions;
			}).catch((error) => {
				// this.$Message.error(error.msg);
			});
		},
		loadRole() {
			this.$request({
				url: API_ROOT["_HR_ROLE_DATA_GET"], // eslint-disable-line
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.roleData = res.data;
			}).catch((error) => {
				// this.$Message.error(error.msg);
			});
		},
		handleOk() {
			this.$refs.nameForm.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.$emit('sure', {
						position_id: this.formValidate.position_id,
						sort_id: new Date().getTime(),
						role_id: this.formValidate.role_id,
						position_name: this.formValidate.position_name,
						role_name: this.formValidate.role_name
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSelectPosition(position) {
			this.formValidate.position_id = position.value;
			this.formValidate.position_name = position.label.trim();
		},
		handleSelectRole(role) {
			this.formValidate.role_id = role.value;
			this.formValidate.role_name = role.label.trim();
		}
	}
};
export const AddRangeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-add-range-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		margin:25px 0px -34px 0px;
		padding: 0;
		color: #333333;
		font-size: 14px;
	}
}
</style>