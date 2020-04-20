<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-rank-up-add-modal"
		width="680">

		<div slot="header" class="g-tc">
			添加候选
		</div>

		<div class="_content">
			<div class="g-m-b-20">
				<i-input
					v-model="search"
					clearable
					class="g-m-r-5"
					style="width: 220px"
					placeholder="请输入姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange" />

				<i-cascader
					:data="departAll"
					v-model="depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch"/>

				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch">
					搜索
				</i-button>
			</div>
			<i-table
				:height="list.length ? (list.length > 10 ? 440 : '') : 0"
				:data="list"
				:columns="columns"
				@on-selection-change="handleSelectionChange" />
		</div>

		<div slot="footer" class="_footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" class="g-red-btn-small" @click="handleOk">保存</i-button>
		</div>
	</i-modal>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { services } from '@stores/services/hr';
import { Modal, Button, Select, Option, Input, Table, Cascader } from "iview";

export default {
	name: "hr-employee-rank-up-add-modal",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-table": Table,
		"i-button": Button,
		"i-cascader": Cascader,
		"vc-copy": Copy
	},
	mixins: [
		services.departAll()
	],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			search: '',
			depart_id: [],
			list: [],
			sedList: [],
			columns: [
				{
					type: 'selection',
					minWidth: 60
				},
				{
					title: '员工姓名',
					key: 'staff_name',
					minWidth: 110
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 100
				}
			]
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_ALERT_LIST_GET',
				type: "GET",
				param: {
					...this.data,
					search: this.search,
					depart_id: this.depart_id
				},
				loading: false
			}).then(res => {
				this.list = Array.isArray(res.data) ? res.data : [];
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.loadData();
		}, 300),
		handleSelectionChange(sed) {
			this.sedList = sed;
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			if (this.sedList.length) {
				this.$request({
					url: '_HR_EMPLOYEE_UP_ADD_ALERT_POST',
					type: "POST",
					param: {
						system_id: this.data.system_id,
						cycle_id: this.data.cycle_id,
						staff_id: this.sedList.map(item => item.staff_id)
					},
					loading: false
				}).then(res => {
					this.$Message.success('操作成功');
					this.$emit('sure');
				}).catch(error => {
					this.$Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			} else {
				this.$Message.warning('请至少选择一项进行操作');
				this.$refs.modal.buttonLoading = false;
			}
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const addPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-add-modal {
	._content {
		margin-top: 4px;
		margin-left: 60px;
		margin-right: 60px;
	}
}
</style>
