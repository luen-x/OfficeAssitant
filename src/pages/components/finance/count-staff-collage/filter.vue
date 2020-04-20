<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search" 				 
				placeholder="请输入员工姓名或手机号搜索" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleSearch"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			
			<span 
				class="g-m-l-20 g-c-black3 g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10">
				<i-date-picker 
					v-model="month" 
					:options="pickerOptionsStart" 
					style="width: 220px"
					type="month"
					transfer
					placeholder="请选择月份"
					class="g-m-r-5"
					@on-change="handleDate" 
				/>
				<i-cascader 
					v-model="depart_id" 
					:data="filterDepart"
					change-on-select
					style="width: 220px;display:inline-block"
					class="g-m-r-5" 
					clearable
					transfer
					trigger="click"
					placeholder="请选择组织"
					@on-change="handleChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import moment from 'moment';
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand,
		 
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		let depart_id = !!query.depart_id && query.depart_id.split(',').map((item) => { return +item; });
		return {
			pickerOptionsStart: {
				disabledDate: time => {
					// 可通过箭头函数的方式访问到this
					return time.getTime() > Date.now();
				}
			},
			search: String(query.search || ''),
			month: String(query.month || ''), 
			depart_id: depart_id || [], 
			show: false
		};
	},
	computed: {
		filterDepart() {
			if (!this.departAll.length) return [];
			const collegeDepartId = getItem("firstDepartId_" + this.$global.version).res.data.bs;
			
			return this.departAll.find(item => item.value == collegeDepartId).children;
		}

	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/finance/count/staff/collage', 
				{ 
					...this.$route.query, 
					search: this.search,
					month: this.month ? moment(this.month).format("YYYY-MM") : '',
					depart_id: this.depart_id
				}
			));
			this.$store.commit('FINANCE_COUNT_STAFF_COLLAGE_LIST_INIT');
			
		},
		handleExport() {
			const url = getHashUrl(API_ROOT.FINANCE_COUNT_STAFF_LIST_GET, { // eslint-disable-line
				...this.$route.query,
				month: this.month, 
				depart_id: this.depart_id,
				search: this.search,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(value, selectedData) {
			this.$router.replace(getHashUrl(
				'/finance/count/staff/collage', 
				{ 
					...this.$route.query,
					depart_id: value,
				}
			));
			this.$store.commit('FINANCE_COUNT_STAFF_COLLAGE_LIST_INIT');
		},
		handleDate(date) {
			this.month = date;
			this.handleSearch();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
