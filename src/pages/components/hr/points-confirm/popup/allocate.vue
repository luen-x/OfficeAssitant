<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				分配
			</div>
			<div class="v-allocate_modal_top g-flex-cc">
				<i-input 
					v-model="search" 
					clearable
					placeholder="请输入员工姓名" 
					style="width: 250px" 
					@on-enter="handleSearch" 
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</vc-debounce-click>
			</div>
			<i-table :columns="memberListTitle" :data="memberList" :height="tableHeight" :loading="tableLoading"/>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Input, Button, Table, Message } from 'iview';
import { CreatePortal } from 'wya-vc';
import { getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import allocateData from './allocate-data';

export default {
	name: 'sc-service-allocate-modal',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-button': Button,
		'i-table': Table,
	},
	mixins: [allocateData],
	props: {
		name: String,
		customerId: String,
		customer_info: Array
	},
	data() {
		return {
			search: '',
			visible: false,
			staff: '',
			tableHeight: 400,
			tableLoading: true
		};
	},
	computed: {
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.staff = getItem(`staff_${this.$global.version}`);
		if (window.innerHeight <= 768) {
			this.tableHeight = 250;
		}
		this.getMemberList();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			this.getMemberList();
		},
		handleOk() {
			if (this.currentId) {
				this.$request({
					url: API_ROOT['_HR_POINTS_CONFIRM_ALLOCATE_POST'], // eslint-disable-line
					type: "POST",
					param: {
						assign_id: this.staff.staff.staff_id,
						check_staff_id: this.currentId,
						check_staff_name: this.currentName,
						customer_info: this.customer_info
					}
				}).then((res) => {
					Message.success('分配成功');
					this.visible = false;
					this.$emit('sure');
				}).catch((error) => {
					Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('请选择要分配的员工');
				return;
			}
		},
		handleCancel() {
			this.$emit('close');
		},
		getMemberList() {
			this.tableLoading = true;
			this.$request({
				url: API_ROOT['_HR_POINTS_CONFIRM_ALLOCATE_LIST_GET'], // eslint-disable-line
				type: "GET",
				param: {
					staff_name: this.search
				},
				loading: false
			}).then((res) => {
				if (JSON.stringify(res.data) == "{}") {
					this.memberList = [];
				} else {
					this.memberList = res.data;
				}
				this.tableLoading = false;
			}).catch((error) => {
				Message.error(error.msg);
				this.tableLoading = false;
			});
		}
	}
};
export const AllocateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-allocate_modal_top {
	margin: 5px 0 20px 0;
}
</style>

