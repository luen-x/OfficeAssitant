<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="分配"
			class="v-collage-check-service-allocate-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div class="_search">
				<i-input
					v-model="search" 
					placeholder="请输入姓名" 
					style="width: 300px" 
					clearable
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				<i-button 
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>

			<i-table
				ref="table"
				:columns="columns"
				:data="data"
				:border="false"
				:loading="tableLoading"
				stripe
				height="250"
			/>
			<div class="_btn-box g-m-b-40 g-m-t-20">
				<i-page 
					:total="totalCount"
					:current="currentPage"
					show-total 
					show-elevator
					class="__page g-fr"
					@on-change="handleChange"
				/>
			</div>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, DatePicker, Message, Select, Option, Table, Page, Input, Button, Radio } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'collage-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-table': Table,
		'i-page': Page,
		'i-input': Input,
		'i-button': Button
	},
	mixins: [
	],
	props: {
		name: Number,
		type: String, 
		quality_ids: Array
	},
	data() {
		return {
			assign_staff_id: '',
			search: '',
			tableLoading: true,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
			visible: false,
			data: [], // 表格数据
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 70,
					render: (h, params) => {
						let id = params.row.staff_id;
						let defaultS = false;

						if (this.assign_staff_id == id || (!this.assign_staff_id && params.row._checked)) {
							defaultS = true;
						} else {
							defaultS = false;
						}

						let self = this;

						return h(Radio, {
							style: {
								marginRight: "5px"
							},
							props: {
								value: defaultS
							},
							on: {
								input() {
									self.assign_staff_id = id;
								}
							}
						});
					}
				},
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 130
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 100,
					render: (h, params) => {
						let depart_name = params.row.depart_name;
						return (
							<AutoToolTip 
								content={depart_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 100,
					render: (h, params) => {
						let position_name = params.row.position_name;
						return (
							<AutoToolTip 
								content={position_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "待质检客户",
					key: "wait_quality",
					minWidth: 110
				},
				{
					title: "本月质检次数",
					key: "month_quality",
					minWidth: 120
				}
			],
		};
	},
	mounted() {
		this.visible = true;
		this.loadTableData(this.page);
	},
	methods: {
		// 初始表格数据
		async loadTableData(page) {
			this.tableLoading = true;
			this.data = [];
			let obj = {
				search: this.search,
				type: this.type,
				pageSize: this.pageSize,
				page
			};
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_ALLOCATE_LIST_GET',
				type: "GET",
				param: obj,
				loading: false
			}).then((res) => {
				this.data = res.data.list;
				this.data.forEach(item => {
					item._checked ? this.assign_staff_id = item.staff_id : "";
				});
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.tableLoading = false;
			}).catch((error) => {
			});
		},
        
		handleSearch: lodash.debounce(function (event) {
			this.loadTableData(this.page);
		}, 300),

		handleChange(page) {
			this.loadTableData(page);
		},

		handleSave() {
			this.$request({
				url: API_ROOT._COLLAGE_CHECK_SERVICE_ALLOCATE_POST,
				type: "POST",
				param: {
					quality_ids: this.quality_ids.join(','),
					assign_staff_id: this.assign_staff_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
        
		handleOk() {
			if (!this.assign_staff_id) {
				this.$Message.warning("请选择要分配的讲师");
				this.$refs.modal.buttonLoading = false;
				return;
			}

			this.handleSave();
		},
        
		handleCancel() {
			this.$emit("close");
		},
	}
};
export const AllocateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-check-service-allocate-modal {
    .ivu-table-wrapper > .ivu-spin-fix {
        border: none;
    }
    .ivu-table-wrapper {
        border: none;
    }
    .ivu-table {
		th,
		td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}
	._search {
        margin-bottom: 20px;
		._btn-box {
		width: 100%;
		height: 70px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		padding: 0 16px;
		.__page {
			padding: 0px 0px;
			float:right
		}
	}
	}
}
</style>