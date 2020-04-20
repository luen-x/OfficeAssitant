<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns(type)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-sale-material-upload-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-material-upload-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '已通过', value: '2' }, 
				{ label: '已驳回', value: '3' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleFractionMaterialUpload.listInfo;
		}
	},
	mounted() {
		this.$vc.on('query-change', () => {
			let { query = {} } = getParseUrl();
			this.type = String(query.type);
			this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_INIT');
		});
	},
	beforeDestroy() {
		this.$vc.off('query-change');
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_FRACTION_MATERIAL_UPLOAD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sale/fraction/material/upload');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/fraction/material/upload', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-material-upload-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
