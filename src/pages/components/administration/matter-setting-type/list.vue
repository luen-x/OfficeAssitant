<template>
	<vc-paging
		ref="tableTarget"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="piece"
		class="g-m-t-20 v-administration-matter-setting-type-list"
		@page-size-change="handleChangePageSize"
	>
		<oa-item 
			slot-scope="it"
			v-bind="it"
			class="_item"
		/> 
	</vc-paging>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import Item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-item': Item,
	},
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.administrationMatterSettingType.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'ADMINISTRATION_MATTER_SETTING_TYPE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('ADMINISTRATION_MATTER_SETTING_TYPE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-administration-matter-setting-type-list {
	display: flex;
	flex-wrap: wrap;
	margin: 20px 0;
	._item {
		padding: 10px 15px;
		margin-bottom: 20px;
		width: 220px;
		height: 150px;
		border-radius: 4px;
		transition: all .2s ease-in-out;
		position: relative;
		background: #f7f7f7;
		margin-right: 20px;
	}
	._item:hover {
		background: #f0f4fd;
		border-color: #eee;
	}
}

</style>
