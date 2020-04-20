<template>
	<div class="v-hr-employee-data-commissar g-pd-lr-20">
		<div class="g-m-tb-20 g-flex _filter">
			<i-select
				v-model="depart_id"
				placeholder="请选择部门"
				style="width: 220px"
				clearable
				transfer
				label-in-value
				@on-change="handleDepartChange">
				<i-option
					v-for="item in departList"
					:key="item.depart_id"
					:value="item.depart_id">
					{{ item.depart_name }}
				</i-option>
			</i-select>
			<vc-debounce-click
				class="g-red-btn-small g-m-l-10"
				@click="loadManageData">
				搜索
			</vc-debounce-click>
		</div>
		<div v-if="manageData.manager_data_list" class="g-flex _row">
			<div class="g-m-r-20 _item">
				<div class="g-bg-gray-mid g-tc _title">管理层数据统计表</div>
				<oa-chart
					v-if="!Array.isArray(manageData.manager_data_chart)"
					ref="_charts"
					:data="manageData.manager_data_chart.list"
					:count="manageData.manager_data_chart.total_count"
					type="manage" />

			</div>
			<div class="_item">
				<div class="g-bg-gray-mid g-tc _title">
					<span>管理层数据详情表</span>
					<span
						v-if="manageData.manager_data_list.length"
						class="g-c-blue-mid g-pointer g-fr g-m-r-20"
						@click="handleClick('manage')">查看更多</span>
				</div>
				<i-table
					:data="manageData.manager_data_list.slice(0, 5)"
					:columns="col1"
					:loading="manageLoading"
					stripe
					class="_table"/>
			</div>
		</div>
		<div class="g-m-tb-20 g-flex _filter">
			<i-select
				v-model="position_id"
				placeholder="请选择职位"
				style="width: 220px"
				clearable
				transfer
				label-in-value
				@on-change="handlePositionChange">
				<i-option
					v-for="item in positionList"
					:key="item.position_id"
					:value="item.position_id">
					{{ item.position_name }}
				</i-option>
			</i-select>
			<vc-debounce-click
				class="g-red-btn-small g-m-l-10"
				@click="loadPositionData">
				搜索
			</vc-debounce-click>
		</div>
		<div v-if="positionData.position_data_list" class="g-flex _row">
			<div class="g-m-b-20 g-m-r-20 _item">
				<div class="g-bg-gray-mid g-tc _title">{{ position_name || '' }}数据统计表</div>
				<oa-chart
					v-if="!Array.isArray(positionData.position_data_chart)"
					ref="_charts"
					:data="positionData.position_data_chart.data"
					:count="positionData.position_data_chart.total_count"
					:name="`${position_name || 0}数据统计表`"
					type="position" />
			</div>
			<div class="g-m-b-20 _item">
				<div class="g-bg-gray-mid g-tc _title">
					<span>{{ position_name || '' }}数据详情表</span>
					<span
						v-if="positionData.position_data_list.length"
						class="g-fr g-m-r-20 g-c-blue-mid g-pointer"
						@click="handleClick('position')">查看更多</span>
				</div>
				<i-table
					:data="positionData.position_data_list.slice(0, 5)"
					:columns="col2"
					:loading="positionLoading"
					stripe
					class="_table"/>
			</div>
		</div>
	</div>
</template>

<script>
import { Cascader, Table, Select, Option } from "iview";
import Chart from './chart.vue';
import { PModal } from './popup/modal';

export default {
	name: 'oa-tpl',
	components: {
		'i-cascader': Cascader,
		'i-table': Table,
		'i-select': Select,
		'i-option': Option,
		'oa-chart': Chart
	},
	data() {
		return {
			depart_id: '',
			position_id: '',
			departList: [],
			positionList: [],
			manageLoading: true,
			positionLoading: true,
			position_name: '',
			manageData: {
				// count: 0,
				// list: [],
				// tableList: []
			},
			positionData: {
				// count: 0,
				// list: [],
				// tableList: []
			},
			col1: [{
				title: '姓名',
				key: 'staff_name',
				minWidth: 120,
			},
			{
				title: '职位',
				key: 'position_name',
				minWidth: 100,
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 100,
			},
			{
				title: '任职时间',
				key: 'update_time',
				minWidth: 110,
			}],
			col2: [{
				title: '姓名',
				key: 'staff_name',
				minWidth: 120,
			},
			{
				title: '职称',
				key: 'rank_name',
				minWidth: 100,
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 100,
			},
			{
				title: '任职时间',
				key: 'update_time',
				minWidth: 110,
			}],
		};
	},
	created() {
		window.addEventListener('resize', this.handleWidthChange);
		this.loadDepart();
		this.loadPosition();
		this.loadManageData();
		this.loadPositionData();
	},
	destroyed() {
		window.removeEventListener('resize', this.handleWidthChange);
	},
	methods: {
		loadDepart() {
			this.$request({
				url: '_HR_WAR_BY_STAFF_GET',
				type: 'GET',
				param: {
					staff_id: this.$global.staff.staff_id
				},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadPosition() {
			this.$request({
				url: '_HR_SALE_POSITION_GET',
				type: 'GET',
				noLoading: true
			}).then(res => {
				this.positionList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadManageData() {
			this.$request({
				url: 'HR_EMPLOYEE_DATA_COMMISSAR_MANAGE_GET',
				type: 'GET',
				param: {
					depart_id: this.depart_id
				},
			}).then((res) => {
				this.manageLoading = false;
				this.manageData = { ...res.data };
			}).catch((error) => {
			});
		},
		loadPositionData() {
			this.$request({
				url: 'HR_EMPLOYEE_DATA_COMMISSAR_POSITION_GET',
				type: 'GET',
				param: {
					position_id: this.position_id
				},
			}).then((res) => {
				this.positionLoading = false;
				this.positionData = { ...res.data };
			}).catch((error) => {
			});
		},
		handleWidthChange() {
			this.$refs._charts.$refs.charts.resize();
		},
		handleDepartChange(val) {
			if (val) {
				this.depart_id = val.value;
			} else {
				this.depart_id = '';
			}
			this.loadManageData();
		},
		handlePositionChange(val) {
			if (val) {
				this.position_id = val.value;
				this.position_name = val.label.trim();
			} else {
				this.position_id = '';
				this.position_name = '';
			}
			this.loadPositionData();
		},
		handleClick(name) {
			if ((name === 'manage' && this.manageData.manager_data_list.length)
				|| (name === 'position' && this.positionData.position_data_list.length)) {

				PModal.popup({
					list: name === 'manage' ? this.manageData.manager_data_list : this.positionData.position_data_list,
					name
				}).then(res => {
				}).catch(err => {});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-employee-data-commissar {
	._item {
		flex: 1;
		height: 404px;
		min-width: 550px;
		background:rgba(255,255,255,0);
		border:1px solid rgba(232, 232, 232, 1);
		// box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		._title {
			height: 52px;
			line-height: 52px;
		}
		._table {
			margin-left: 60px;
			margin-right: 60px;
			margin-top: 50px;
		}
	}
}
</style>
