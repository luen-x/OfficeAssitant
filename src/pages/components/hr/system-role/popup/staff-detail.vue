<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="`${role_name}角色员工一览`"
		width="680px"
		footer-hide
		class="v-hr-role-staff-list"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-30 g-m-t-10 g-fs-14 g-c-black2 g-m-b-40">
			<div>
				<i-input
					v-model="param.search"
					:maxlength="11"
					style="width: 220px"
					placeholder="请输入员工姓名/手机"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					:data="departAll"
					v-model="param.department"
					style="display: inline-block; width: 220px"
					clearable
					transfer
					trigger="click"
					change-on-select
					placeholder="请选择部门"
					class="g-m-l-5"
					@on-change="handleDepartSearch"
				/>
				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
			<div class=" __table">
				<i-table 
					:columns="columns" 
					:data="data" 
					tooltip-theme ="light"
					stripe
					class="g-m-b-20"/>
			</div>
		</div>
		<i-page 
			:total="totalCount"
			:current.sync="param.page"
			:page-size="param.pageSize"
			size="small" 
			show-elevator 
			show-sizer 
			transfer
			class="__page"
			@on-change="handleChange"
			@on-page-size-change="handlePageSizeChange"/>
	</i-modal>
</template>

<script>
import moment from 'moment';
import { Modal, Button, Page, Table, Input, Cascader } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/hr";
import CustomTooltip from '@components/hr/academy-train-detail/_common/custom-tooltip';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";

const columns = [
	{ 
		title: '姓名', 
		key: 'staff_name',
		minWidth: 100,
		render(h, { row }) {
			return (
				<AutoTooltip
					content={ row.staff_name }
					labelClass=" "
				/>
			);
		}
	},
	{ title: '手机号码', 
		width: 120, 
		key: 'mobile', 
		render(h, { row }) {
			return (
				<AutoTooltip
					content={ row.mobile }
					labelClass=" "
				/>
			);
		} },
	{ title: '部门', 
		key: 'depart_name',
		render(h, { row }) {
			return (
				<AutoTooltip
					content={ row.depart_name }
					labelClass=" "
				/>
			);
		}
	},
	{ title: '职位',
	 key: 'position_name',
	  render(h, { row }) {
			return (
				<AutoTooltip
					content={ row.position_name }
					labelClass=" "
				/>
			);
		}
	  },
	{ title: '角色类型', 
		key: 'type', 
		minWidth: 60, 
		render(h, { row }) {
			return (<div>{ row.type == 0 ? '主角色' : '兼角色'}</div>);
		} }
];

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
		'i-page': Page,
		'i-table': Table,
		'i-button': Button,
		'i-input': Input,
		'i-cascader': Cascader,
	},
	mixins: [services.departAll()],
	props: {
		role_id: {
			type: [Number, String],
			required: true
		},
		role_name: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			show: false,
			columns,
			data: [],
			totalCount: 0,
			param: {
				page: 1,
				pageSize: 10,
				search: '',
				department: []
			}
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: API_ROOT._HR_ROLE_STAFF_LIST_GET,
				type: "GET",
				param: {
					...this.param,
					depart_id: this.param.department[this.param.department.length - 1] || '',
					role_id: this.role_id
				}
			}).then(({ data }) => {
				this.data = data.list;
				this.totalCount = data.totalCount;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(page) {
			this.loadData();
		},
		handleDepartSearch(department) {
			this.param.department = department;
			this.handleSearch();
		},
		handlePageSizeChange(pageSize) {
			this.param = {
				...this.param,
				pageSize
			};
			this.loadData();
		},
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('sure', this.select);
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close');
			this.visible = false;
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			this.param = {
				...this.param,
				page: 1,
			};
			this.loadData();
		}
	}
};
export const StaffDetail = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-role-staff-list {
    .ivu-modal-body {
		position: relative;
		.__table {
			height: 280px;
			overflow: auto;
			margin-top: 20px;
		}
		.__page {
			position: absolute;
			bottom: 15px;
			right: 20px;
		}
		.__select {
			position: absolute;
			bottom: 5px;
			left: 50px;
		}
    }
}
</style>

