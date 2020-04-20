<template>
	<div class="v-hr-recruit-school-assigndetails-list">
		<div>
			<i-date-picker
				v-model="assign_time"
				type="daterange"
				transfer
				clearable
				split-panels
				placeholder="请选择分配日期"
				style="width: 220px; "
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'assign_time')"/>
			<i-date-picker
				v-model="reply_time"
				type="daterange"
				transfer
				clearable
				split-panels
				placeholder="请选择回复报到日期"
				style="width: 220px; "
				@on-change="handleDateChange($event, 'reply_time')"/>

			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>

		<vc-paging
			ref="table"
			:columns="columns"
			:data-source="{1: list}"
			:total="1"
			:history="true"
			:footer="false"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			:expand-opts="expand"
			class="g-m-t-20"
			@expand="handleExpand"
		/>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Button, DatePicker, Table } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-table': Table,
		"i-date-picker": DatePicker,
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			extraHeight: 75
		})
	],
	data() {
		const { query } = this.$route;

		return {
			expand: {
				all: true,
				keys: [1],
				key: 'depart_id'
			},
			obj: {},
			assign_time: [query.assign_time_start, query.assign_time_end],
			reply_time: [query.reply_time_start, query.reply_time_end]
		};
	},
	computed: {
		list() {
			return this.$store.state.hrRecruitSchoolAssigndetails.listInfo.list;
		},
		isFetched() {
			return this.$store.state.hrRecruitSchoolAssigndetails.listInfo.isFetched;
		}
	},
	watch: {
		isFetched(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.loadData();
			}
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_GET',
				type: 'GET',
				param: {
					...query
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleExpand({ maxLevel }) {
			this.columns[0].width = maxLevel * 10 + 200;
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/assigndetails',
				{
					...this.$route.query,
					...this.obj
				}
			));
			// this.$store.commit('HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_INIT');
			this.loadData();
		}, 300)
	}
};

</script>

<style lang="scss">

</style>
