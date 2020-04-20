<template>
	<div class="v-hr-academy-transfer-statistic-demand">
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
			@expand="handleExpand"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import { Button, DatePicker, Table } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import item from '../item';

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
			tabs: true,
			extraHeight: 70
		})
	],
	data() {
		return {
			expand: {
				all: true,
				keys: [1],
				key: 'depart_id'
			},
			columns: []
		};
	},
	computed: {
		list() {
			return this.$store.state.hrAcademyTransferStatistic.demandList;
		},
		isFetched() {
			return this.$store.state.hrAcademyTransferStatistic.isFetched;
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
		this.columns = this.getColumns('demand') ? this.getColumns('demand') : [];
	},
	methods: {
		loadData() {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_LIST_GET',
				type: 'GET',
				param: {
					month: query.try_month ? query.try_month : moment().format("YYYY-MM")
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleExpand({ maxLevel }) {
			this.columns[0].width = maxLevel * 10 + 200;
		},
	}
};
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-statistic-demand {
	.vc-paging {
		// 处理滚动条问题
		margin-bottom: 0px !important;
	}
}
</style>
