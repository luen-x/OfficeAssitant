<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="{1: list}" 
		:total="1"
		:history="true"
		:footer="false"
		:load-data="loadData"
		:expand-opts="expand"
		:table-opts="{height: tableHeight }"
		style="margin-top: 20px;margin-bottom: 0"
		@expand="handleExpand"
	/>
</template>

<script>
import { Table } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
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
			nav1: false,
			nav2: false,
			tab: false,
			footer: false,
			extra: 50
		})
	],
	data() {
		const { query } = this.$route;

		return {
			expand: {
				all: false,
				keys: [],
				key: 'menus_id'
			},
			list: [],
		};
	},
	computed: {
	},
	created() {
		
		
	},
	mounted() {
		this.$vc.on("SETTING_ROUTER_LIST_INIT", this.loadData);
		this.loadData();
	},
	beforeDestroy() {
		this.$vc.off('SETTING_ROUTER_LIST_INIT');
	},
	methods: {
		loadData() {
			this.$refs.tableTarget.loading = true;
			let { query = {} } = getParseUrl();

			return this.$request({
				url: 'SETTINGS_ROUTER_SET_LIST_GET',
				type: 'GET',
				param: { ...query },
			}).then((res) => {
				this.list = res.data;
				this.$refs.tableTarget.loading = false;
			}).catch((error) => {
			});
		},
		handleExpand({ maxLevel }) {
			this.columns[1].width = maxLevel * 10 + 200;
		},
	}
};

</script>

<style lang="scss">

</style>
