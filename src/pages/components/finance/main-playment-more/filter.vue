<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c g-m-t-20">
			<div>
				<i-input
					v-model="query.search" 
					size="large" 
					clearable
					placeholder="请输入管理人或员工姓名" 
					style="width: 320px" 
					@on-change="handleSearchInput"
				/>
				<i-button 
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
			
				<span 
					class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
					@click="handleToggle" 
				>
					更多搜索条件
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<div 
				class="g-red-btn-line g-fr" 
				@click="handleExport"
			>导出</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-20">
				<i-datepicker
					ref="formDate"
					v-model="query.month"
					type="month"
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请选择月份"
					transfer
					clearable
					@on-change="handleMonthDatepicker"
					@on-clear="handleClear"
				/>
				<i-cascader
					:data="departAll"
					v-model="query.depart_id"
					:change-on-select="true"
					placeholder="请选择组织"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
				
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import { getParseUrl, getHashUrl, getItem, initTreeData } from '@utils/utils';
import { services } from "@stores/services/hr";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
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
		return {
			departList: [],
			query: {
				search: String(query.search || ''),
				type: String(query.type || '1'),
				month: String(query.month || ''),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
			},
			show: false
		};
	},
	methods: {
		handleClear() {
			this.$refs.formDate.focusedDate = new Date();
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/finance/main/playment/more', 
				{ 
					...this.$route.query, 
					...this.query,
					month: this.query.month ? moment(this.query.month).format("YYYY-MM") : '',
				}
			));
			this.$store.commit('FINANCE_MAIN_PLAYMENT_MORE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSearchInput(e) {
			if (e.target.value) {
				this.query.search = e.target.value;
			} else {
				this.query.search = '';
			}
			this.handleSearch();
		},
		handleMonthDatepicker(val) {
			this.query.month = val;
			this.handleSearch();
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1",
				
			};
			let depart_id = query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : '';
			window.open(getHashUrl(API_ROOT.FINANCE_MAIN_PLAYMENT_MORE_LIST_GET, {
				...this.$route.query,
				...query,
				depart_id: depart_id && depart_id[depart_id.length - 1],
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
