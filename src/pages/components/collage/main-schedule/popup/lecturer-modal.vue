<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="看谁有空"
			class="v-collage-main-lecturer-modal"
			footer-hide
		>
			<div class="_search">
				<i-datepicker
					v-model="time"
					:editable="false"
					clearable
					transfer
					type="daterange"
					split-panels
					separator=" 至 "
					format="yyyy-MM-dd"
					style="width: 220px"
					placeholder="选择日期看看谁有空"
					@on-change="handleSearch"
				/>
				<!-- <i-select
					v-if="$auth[1386] || $auth[1395]"
					v-model="depart_id"
					style="width: 220px"
					class="g-m-l-5"
					filterable
					clearable
					transfer
					multiple
					placeholder="请选择部门"
					@on-change="handleChangeDepart"
				>
					<i-option
						v-for="(item, index) in departArray"
						:key="index"
						:value="item.depart_id"
					>
						{{ item.depart_name }}
					</i-option>
				</i-select> -->
				<i-cascader 
					v-if="$auth[1386] || $auth[1395]"
					v-model="depart_id"
					:data="departArray"
					style="width: 220px;display:inline-block;"
					class="g-m-l-5"
					clearable
					transfer
					change-on-select
					placeholder="请选择部门"
					@on-change="handleChangeDepart"
				/>
				<i-select
					v-if="$auth[1387] || $auth[1396]"
					ref="lecture"
					v-model="lecture_id"
					class="g-m-tb-10"
					style="width: 220px"
					clearable
					transfer
					filterable
					multiple
					placeholder="请输入讲师名称查询"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in tearchArray"
						:key="index"
						:value="item.staff_id"
					>
						{{ item.staff_name }}
					</i-option>
				</i-select>
				<i-button
					type="primary"
					class="g-m-l-5"
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
			/>
			<div class="__btn-box g-m-b-40">
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
import { Modal, DatePicker, Message, Select, Option, Table, Page, Button, Cascader } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-table': Table,
		'i-page': Page,
		'i-button': Button,
		"i-cascader": Cascader
	},
	mixins: [
	],
	props: {
		name: Number,
		type: String, // '1'线上部门'2'线下部门
		date: String
	},
	data() {
		return {
			tableLoading: true,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
			visible: false,
			time: [],
			depart_id: [],
			lecture_id: [],
			departArray: [],
			tearchArray: [],
			data: [], // 表格数据
			columns: [
				{
					title: "讲师姓名",
					key: "staff_name",
				},
				{
					title: "手机号",
					key: "mobile",
				},
				{
					title: "部门",
					key: "depart_name",
				},
				{
					title: "操作",
					key: "options",
					render: (h, params) => {
						return (
							<div class="g-operation"
								onClick={(e) => {
									this.handleViewSchedule(params.row);
								}}
							>
								<span>查看课表</span>
							</div>
						);
					}
				}
			],
		};
	},
	mounted() {
		this.visible = true;
		this.loadArrayData();
	},
	methods: {

		handleViewSchedule(e) {
			this.visible = false;
			this.$emit('sure', e);
		},

		// 改变部门-置空讲师
		handleChangeDepart(event) {
			this.loadTeacherData(event.join(','));
			this.$refs.lecture.reset();
			this.handleSearch();
		},
        
		// 初始化筛选列表
		async loadArrayData() {
			await this.loadDepartData();
			await this.loadTeacherData();
			await this.loadTableData(this.page);
		},
        
		// 初始化部门列表
		async loadDepartData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_DEPARTS_GET',
				type: "GET",
				param: {
					type: this.type
				},
				loading: false
			}).then((res) => {
				this.departArray = this.formatDepart(res.data);
			}).catch((error) => {
			});
		},
		formatDepart(arr) {
			const target = arr.map(it => {
				const result = {
					label: it.depart_name || '',
					value: it.depart_id || null,
					children: it.child
				};
				if (result.children.length > 0) {
					result.children = this.formatDepart(result.children);
				} else {
					delete result.children;
				}
				return result;
			});
			return target;
		},
        
		// 初始化讲师列表
		async loadTeacherData(e) {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_TEACHER_GET',
				type: "GET",
				param: {
					depart_ids: e || '',
					type: this.type
				},
				loading: false
			}).then((res) => {
				this.tearchArray = res.data;
			}).catch((error) => {
			});
		},
        
		// 初始表格数据
		async loadTableData(page) {
			this.tableLoading = true;
			this.data = [];
			let obj = {
				type: this.type,
				start_date: this.time[0] ? moment(this.time[0]).format("YYYY-MM-DD") : '',
				end_date: this.time[1] ? moment(this.time[1]).format("YYYY-MM-DD") : '',
				pageSize: this.pageSize,
				page
			};
			this.depart_id.length ? obj.depart_ids = this.depart_id : '';
			this.lecture_id.length ? obj.staff_ids = this.lecture_id : '';
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_LECTURER_TABLE_GET',
				type: "GET",
				param: obj,
				loading: false
			}).then((res) => {
				this.data = res.data.list;
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
	}
};
export const LecturerModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-main-lecturer-modal {
	._search {
		.__btn-box {
		width: 100%;
		height: 70px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		padding: 0 16px;
		.__page {
			margin-top: -5px;
			padding: 0px 0px;
			float:right
		}
	}
	}
}
</style>


