<template>
	<div>
		<div class="js-filter g-lh-42">
			<i-select
				v-model="query.data_type"
				placeholder="请选择业绩时间"
				style="width: 220px"
				class="g-m-r-5"
				clearable
				transfer
				@on-change="handleTime"
			>
				<i-option
					v-for="(item,index) in timeArr" 
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-input
				v-model="query.search" 
				placeholder="请输入员工姓名" 
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch" 
			/>
			<i-cascader
				v-if="departList.length>1&&query.type!='3'"
				:data="departList"
				v-model="query.depart_id"
				:change-on-select="true"
				placeholder="请选择部门"
				trigger="hover"
				clearable
				transfer
				style="width: 220px;display:inline-block"
				class="g-m-r-5"
				@on-change="handleDepartChange"
			/>
			<i-select
				v-if="departList.length>1&&query.type=='3'"
				v-model="query.depart_id"
				placeholder="请选择战区"
				style="width: 220px"
				class="g-m-r-5"
				clearable
				transfer
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in departList" 
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-datepicker
				v-if="query.data_type==1"
				v-model="query.month"
				type="month"
				style="width: 220px"
				class="g-m-r-5"
				placeholder="请选择时间"
				transfer
				@on-change="handleMonthDatepicker"
			/>
			<i-datepicker
				v-else
				v-model="query.year"
				type="year"
				style="width: 220px"
				class="g-m-r-5"
				placeholder="请选择时间"
				transfer
				@on-change="handleYearDatepicker"
			/>
			<i-button 
				type="primary"
				
				@click="handleSearch"
			>
				搜索
			</i-button>
			<div 
				v-if="$auth['1120']"
				class="g-red-btn-line g-fr" 
				@click="handleExport"
			>导出</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker, Select, Option } from 'iview';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl, getItem, initTreeData } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-datepicker": DatePicker,
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		let timeArr = [
			{
				label: '月度业绩',
				value: '1'
			},
			{
				label: '半年度业绩',
				value: '2'
			},
			{
				label: '年度业绩',
				value: '3'
			}
		];
		return {
			timeArr,
			departList: [],
			query: {
				search: String(query.search || ''),
				data_type: String(query.data_type || '1'),
				month: String(query.month || ''),
				year: String(query.year || ''),
				type: String(query.type || '1'),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
			},
			show: false
		};
	},
	watch: {
		$route(to, from) {
			if (to.query.type != from.query.type) {
				this.query.search = '';
				this.query.depart_id = to.query.type != 3 ? [] : '';
				this.query.data_type = '1';
				this.query.month = '';
				this.query.type = to.query.type;
				this.loadDepartList();
			}
			if (to.query.depart_id != from.query.depart_id) {
				this.loadDepartList();
			}
		}
	},
	created() {
		this.loadDepartList();
	},
	methods: {
		handleSearch(event) {
			let depart_id = null;
			if (this.query.type == 3 && this.query.depart_id) {
				depart_id = this.query.depart_id;
			} else if (this.query.type != 3 && this.query.depart_id.length) {
				depart_id = this.query.depart_id;
			}
			this.$router.replace(getHashUrl(
				'/hr/archives/achie/rank', 
				{ 
					...this.$route.query, 
					...this.query,
					depart_id
				}
			));
			this.$store.commit('HR_ARCHIVES_ACHIE_RANK_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(value, selectedData) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleTime(val) {
			this.query.month = '';
			this.query.year = '';
			this.query.data_type = val;
			this.handleSearch();
		},
		handleMonthDatepicker(val) {
			this.query.year = '';
			this.query.month = val;
			this.handleSearch();
		},
		handleYearDatepicker(val) {
			this.query.month = '';
			this.query.year = val;
			this.handleSearch();
		},
		loadDepartList() {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_SEARCH_DEPART_LIST_GET,
				type: "GET",
				param: {
					type: this.$route.query.type || "1",
				},
				loading: false
			}).then(res => {
				this.departList = initTreeData(res.data, 'depart_id', 'depart_name', 'child');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1",
				
			};
			window.open(getHashUrl(API_ROOT.HR_ARCHIVES_ACHIE_RANK_LIST_GET, {
				...this.$route.query,
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
