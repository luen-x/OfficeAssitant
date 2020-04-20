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
				all: true,
				keys: [1],
				key: 'depart_id'
			}
		};
	},
	computed: {
		list() {
			return this.$store.state.hrOrganization.listInfo.list;
		},
		isFetched() {
			return this.$store.state.hrOrganization.listInfo.isFetched;
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
			return this.request({
				url: 'HR_ORGANIZATION_LIST_GET',
				type: 'GET',
				param: {},
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