<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-allocate-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				分配
			</div>

			<div class="g-flex-cc g-m-tb-20">
				<i-input
					v-model="search"
					placeholder="请输入姓名或手机号"
					clearable
					style="width: 300px"
					class="g-m-r-10"
				/>
				<i-button
					type="primary"
					@click="loadData"
				>
					搜索
				</i-button>
			</div>
			<i-table
				ref="selection"
				:loading="loading"
				:columns="columns"
				:data="persons"
				:height="315"
				style="margin: 0 60px 20px 60px"
			/>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Table, Input, Button, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-social-allocate-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-table': Table,
		'i-input': Input,
		'i-button': Button
	},
	props: {
		applicantIds: Array,
	},
	data() {
		return {
			visible: false,
			formValidate: {
			},
			ruleValidate: {

			},
			search: '',
			operate_id: '',
			loading: false,
			persons: [],
			columns: [
				{
					title: '　',
					width: 60,
					render: (h, params) => {
						return (
							<Checkbox
								value={this.operate_id === params.row.staff_id}
								onOn-change={(check) => {
									this.handleSelected(check, params.row.staff_id);
								}}
							/>
						);
					}
				},
				{
					title: '头像',
					key: 'avatar',
					render: (h, params) => {
						const { staff_name } = params.row;
						return (
							<div
								class="g-flex-cc"
								style={{
									width: '40px',
									height: '40px',
									borderRadius: '20px',
									backgroundColor: '#e84854',
									color: '#ffffff',
									margin: '4px 0 4px -10px'
								}}
							>
								{staff_name.slice(-2)}
							</div>
						);
					}
				},
				{
					title: '姓名',
					key: 'staff_name',
					tooltip: true
				},
				{
					title: '手机号',
					key: 'mobile',
					tooltip: true
				},
				{
					title: '职位',
					key: 'position_name',
					tooltip: true
				}
			]
		};
	},
	computed: {
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: API_ROOT['HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_LIST_GET'],
				type: 'GET',
				param: {
					search: this.search,
					type: 1
				},
				loading: false
			}).then((res) => {
				this.loading = false;
				this.persons = res.data;
			}).catch((err) => {
				this.loading = false;
			});
		},
		handleOk() {
			if (!this.operate_id) {
				this.$Message.warning('请选择分配对象');
				this.$refs.modal.buttonLoading = false;
				return;
			}
			this.handleSave();
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSelected(check, id) {
			if (check) {
				this.operate_id = id;
			} else {
				this.operate_id = '';
			}
		},
		handleSave() {
			this.$request({
				url: API_ROOT["HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_POST"],
				type: 'POST',
				param: {
					applicant_id: this.applicantIds,
					operate_id: this.operate_id
				}
			}).then((res) => {
				res.msg && this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const AllocateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-allocate-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 680px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 !important;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
	// .ivu-table {
	// 	overflow-y: auto !important
	// }
}
</style>
