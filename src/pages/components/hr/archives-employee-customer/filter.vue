<template>
	<div class="g-flex g-fd-r g-jc-sb g-ai-c">
		<div class="g-lh-42">
			<i-input
				v-model="search.keyword"
				:maxlength="50"
				clearable
				placeholder="请输入客户公司名称"
				style="width: 220px"
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-date-picker
				v-model="time"
				type="daterange"
				clearable
				transfer
				placeholder="请选择筛选时间"
				style="width: 220px;"
				@on-change="handleDateChange($event, 'time')"/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>

		<vc-debounce-click
			v-if="$auth[1113]"
			class="g-red-btn-line"
			@click="handleOutput">
			导出
		</vc-debounce-click>
	</div>
</template>

<script>
import moment from 'moment';
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem, formatMoment } from '@utils/utils';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { exportModal } from './popup/export';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			time: [query.start_time, query.end_time],
			search: {
				keyword: query.keyword ? query.keyword : '',
			},
		};
	},
	computed: {
		startOption() {
			let that = this;
			return {
				disabledDate(date) {
					if (!that.search.end_time) {
						return false;
					}
					return (moment(date).isBefore(moment(that.search.end_time).subtract(3, 'month'))
							|| moment(date).isAfter(moment(that.search.end_time)));
				}
			};
		},
		endOption() {
			let that = this;
			return {
				disabledDate(date) {
					if (!that.search.start_time) {
						return false;
					}
					return (moment(date).isBefore(moment(that.search.start_time))
							|| moment(date).isAfter(moment(that.search.start_time).add(3, 'month')));
				}
			};
		}
	},
	created() {
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search.start_time = val[0];
			this.search.end_time = val[1];
			// this.search[name] = val;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/employee/customer',
				{
					...this.formatQuery(this.search)
				}
			));
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_CUSTOMER_LIST_INIT');
		}, 300),
		// 导出
		handleOutput() {

			exportModal.popup({
				query: {
					...this.$route.query,
					...this.search
				}
			}).then(res => {
			}).catch(err => {});
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.search).forEach(key => {
				if (this.search[key] instanceof Date) {
					_query[key] = formatMoment(this.search[key], "YYYY-MM");
				} else {
					_query[key] = this.search[key];
				}
			});
			return _query;
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
