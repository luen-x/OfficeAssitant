<template>
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
</template>

<script>
import { Table } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-table': Table,
		'vc-paging': Paging,
	},
	mixins: [
		item, 
		tableHeight({
			extraHeight: 20
		})
	],
	data() {
		const { query } = this.$route;

		return {
			expand: {
				all: false,
				keys: [1],
				key: 'depart_id'
			}
		};
	},
	computed: {
		list() {
			return this.$store.state.hrNeedPostion.listInfo.list;
		},
		isFetched() {
			return this.$store.state.hrNeedPostion.listInfo.isFetched;
		},
	},
	watch: {
		isFetched(newVal, oldVal) {
			if (!newVal && oldVal) {
				this.loadData();
			}
		},
		$route(to, from) {
			if (to.query.create_month_start != from.query.create_month_start
			|| to.query.create_month_end != from.query.create_month_end) {
				this.loadData();
			}
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			return this.request({
				url: 'HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_GET',
				type: 'GET',
				param: {
					create_month_start: this.$route.query.create_month_start,
					create_month_end: this.$route.query.create_month_end
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleExpand({ maxLevel }) {
			this.columns[0].width = maxLevel * 10 + 200;
		}
	}
};

</script>

<style lang="scss">

</style>