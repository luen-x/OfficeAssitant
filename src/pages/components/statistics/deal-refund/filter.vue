<template>
	<div 
		class="g-pd-r-10 g-lh-42"
		style="margin-top: -7px;padding-bottom: 7px;"
	>
		<i-input
			v-model="query.keyword"
			placeholder="请输入员工姓名或手机号"
			style="width: 220px"
			class="g-m-r-5"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-cascader
			v-if="departAll.length>0"
			v-model="query.depart_ids"
			:data="departAll"
			clearable
			change-on-select
			placeholder="请选择组织"
			style="width: 220px"
			class="g-m-r-5"
			@on-change="handleSearchDepart"
		/>
		<i-date-picker
			v-model="query.start_month"
			type="month"
			placeholder="时间（起始）"
			clearable
			style="width: 220px"
			@on-change="handleStartTimeChange"
		/>
		至
		<i-date-picker
			v-model="query.end_month"
			type="month"
			placeholder="时间（结束）"
			clearable
			style="width: 220px"
			class="g-m-r-5"
			@on-change="handleEndTimeChange"
		/>
		<i-button
			type="primary"
			class="g-red-btn"
			@click="handleSearch"
		>搜索</i-button>
	</div>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import moment from 'moment';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';

export default {
	name: 'oa-statistic-deal-switch-filter',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader
	},
	mixins: [services.departAll({ autoLoad: false })],
	data() {
		return {
			query: {
				keyword: '',
				depart_id: '',
				depart_ids: [],
				start_month: moment().subtract(11, 'months').toDate(),
				end_month: new Date()
			}
		};
	},
	created() {
		this.loadDepartAll({ depart_id: _global.staff.depart_id });
		this.handleSearch();
	},
	methods: {
		handleSearch: debounce(function (event) {
			const _query = {
				...this.$route.query,
				...this.formatQuery(this.query)
			};
			this.$router.replace(getHashUrl('/statistics/deal/refund', _query));
			this.$emit('query',	_query);

		}, 300),
		handleSearchDepart: debounce(function (departs) {
			this.query.depart_id = departs[departs.length - 1];
			const _query = {
				...this.$route.query,
				depart_id: departs[departs.length - 1],
				depart_ids: departs.join(',')
			};
			this.$router.replace(getHashUrl('/statistics/deal/refund', _query));
			this.$emit('query',	_query);

		}, 300),
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM");
				} else {
					_query[key] = this.query[key];
				}

			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleStartTimeChange() {
			if (!this.query.start_month) {
				this.query.start_month = moment().subtract(11, 'months').toDate();

			}

			this.query.end_month = moment(this.query.start_month).add(11, 'months').toDate();
			this.handleSearch();

		},
		handleEndTimeChange() {

			if (!this.query.end_month) {
				this.query.end_month = new Date();

			}
			this.query.start_month = moment(this.query.end_month).subtract(11, 'months').toDate();
			this.handleSearch();

		}

	},
};
</script>

<style lang="scss">
</style>
