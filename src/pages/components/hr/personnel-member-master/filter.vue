<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="query.search"
				:maxlength="11"
				style="width: 220px"
				placeholder="请输入员工姓名/手机"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<div class="g-fr" >
				<div 
					v-if="$auth['1239']"
					class="g-red-btn-line" 
					@click="handleAddBtn">推荐师傅</div>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="query.cycle_year"
					placeholder="请选择查询年份"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleCycleYear"
				>
					<i-option
						v-for="item in cycleYearArr"
						:key="item.value"
						:value="String(item.value)"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="query.cycle_id"
					placeholder="请选择评定周期"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleCycleList"
				>
					<i-option
						v-for="item in cycleListArr"
						:key="item.value"
						:value="String(item.value)"
					>{{ item.label }}</i-option>
				</i-select>
				<i-cascader
					:data="departAll"
					v-model="query.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
				<i-select
					v-model="query.position_id"
					placeholder="请选择职位"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id"
					>{{ item.position_name }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from "lodash";
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { TableTitle } from '@components/_common/table-title/table-title';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { AddModal } from "./popup/add";

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [services.departAll(), staffByMutiTerm],
	data() {
		const { query = {} } = this.$route;
		const ids = getItem(`firstDepartId_${_global.version}`).res.data;
		return {
			ids,
			query: {
				...query,
				search: (query.search),
				cycle_year: (query.cycle_year) || '',
				cycle_id: (query.cycle_id) || '',
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
			},
			show: false,
			positionList: [],
			cycleListArr: [],
			cycleYearArr: [],
		};
	},
	mounted() {
		this.loadCycleYear();
		if (this.query.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.positionList = res.data.filter(item => item.depart_id === this.query.depart_id[0])[0].positions;
			}).catch(error => {});
		}
		if (this.query.cycle_id.length) {
			
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBOR_CYCLE_LIST_GET,
				type: 'GET',
				param: {
					cycle_year: this.query.cycle_year,
					first_depart_id: this.query.first_depart_id || this.ids.sale || this.$global.staff.first_depart 
				},	
				loading: false
			}).then((res) => {
				this.cycleListArr = res.data;
			}).catch((error) => {});
		}
	},
	methods: {
		handleAddBtn() {
			AddModal.popup({}).then(res => {});
		},
		handleCycleList(value) {
			this.query.cycle_id = value;
			this.handleSearch();
		},
		loadCycleYear() {
			this.$request({
				url: API_ROOT._HR_PERSONNEL_MEMBOR_CYCLE_YEAR_GET,
				type: 'GET',
				param: {
					first_depart_id: this.query.first_depart_id || this.ids.sale || this.$global.staff.first_depart 
				},
				loading: false
			}).then((res) => {
				this.cycleYearArr = res.data;
			}).catch((error) => {});
		},
		handleCycleYear(value) {
			this.query.cycle_year = value;
			if (value === undefined) {
				this.query.cycle_id = '';
				this.cycleListArr = [];
			} else {
				this.$request({
					url: API_ROOT._HR_PERSONNEL_MEMBOR_CYCLE_LIST_GET,
					type: 'GET',
					param: {
						cycle_year: this.query.cycle_year,
						first_depart_id: this.query.first_depart_id || this.ids.sale || this.$global.staff.first_depart 
					},
					
					loading: false
				}).then((res) => {
					this.cycleListArr = res.data;
				}).catch((error) => {});
			}
			this.handleSearch();
		},
		// 选中部门发生变化时
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			if (value.length === 0) {
				this.query.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			// 搜索
			this.$router.replace(
				getHashUrl("/hr/personnel/member/master", {
					type: this.$route.query.type,
					...this.query,
					fixPosition: true,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null
				})
			);
			this.$store.commit("HR_PERSONNEL_MEMBER_MASTER_LIST_INIT");
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
	}
};
</script>

<style lang="scss" >
.ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
	height:32px !important;
}
</style>


