<template>
	<div class="v-personnel-info-demand-filter js-filter g-m-t-15 g-flex g-jc-sb">
		<div>
			<i-date-picker
				v-model="keywords.month"
				type="month"
				format="yyyy-MM"
				placeholder="请选择月份"
				class="g-m-r-5"
				style="width: 300px"
				@input="keywords.month = $event"
				@on-change="handleMonthChange"
			/>
			<i-button
				type="primary"
				class="g-m-r-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div>
			<i-button v-if="$auth['1229']" class="_btn" @click="handleAdd">添加需求职位</i-button>
		</div>
	</div>
</template>

<script>
import { Button, DatePicker } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { EmployeeDemandAdd } from './popup/demand-add';

export default {
	name: 'oa-filter',
	components: {
		'i-button': Button,
		'i-date-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: {
				month: moment().format('YYYY-MM'), // 选择月份
				...query
			},
		};
	},
	methods: {
		/**
		 * 监听开始月份、结束月份的on-change事件
		 */
		handleMonthChange(val) {
			this.keywords.month = val;
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/hr/personnel/info/demand',
				this.keywords
			));
			this.$store.commit('HR_PERSONNEL_INFO_DEMAND_LIST_INIT');
		}),
		/**
		 * 添加需求职位
		 */
		handleAdd() {
			EmployeeDemandAdd.popup().then(() => {
				this.$store.commit('HR_PERSONNEL_INFO_DEMAND_LIST_INIT');
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-personnel-info-demand-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}
</style>
