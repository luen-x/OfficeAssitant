<template>
	<div>
		<oa-line :years="years" style="marginTop:-18px"/>
		<i-table :columns="getColumns('entry-trend')" :data="years.year_month" :loading="loading"/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox, Table } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import line from './line';
import item from '../../item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'oa-line': line,
		'i-table': Table
	},
	mixins: [item],
	data() {
		return {
			loading: true,
			years: {}
		};
	},
	watch: {
		$route(to, from) {
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: 'HR_RECRUIT_SOCIAL_ENTRY_TENDENCY_LIST_GET',
				type: 'GET',
				param: {
					...query,
				},
				loading: false
			}).then((res) => {
				this.years = res.data;
				this.loading = false;
			}).catch((error) => {
				
			});
		},
	}
};

</script>


