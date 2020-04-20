<template>
	<div v-show="showitem" class="g-fw-w v-content-search-result">
		<div class="_tip g-m-b-10" v-html="listInfo.result_str_top"/>
		<oa-no-data v-if="!listInfo.data[1].length"/>
		<div v-else class="_wrapper">
			<vc-paging
				:data-source="listInfo.data"
				:columns="customerTitle" 
				:total="listInfo.total"
				:reset="listInfo.reset"
				:page-opts="commonPage"
				:table-opts="commonTable"
				:history="true"
				:load-data="loadData"
				:show="show"
			/>
			<div v-html="listInfo.result"/>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import item from './item';
import noData from './no-data';

export default {
	name: 'content-search-tabs-customer',
	components: {
		'vc-paging': Paging,
		'oa-no-data': noData
	},
	mixins: [item],
	props: {
		showitem: Boolean,
		loadData: Function
	},
	data() {
		// const { query = {} } = this.$route;
		return {
		// 	keyword: String(query.keyword || ''),
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo[5];
		},
		keyword() {
			const { query = {} } = this.$route;
			return String(query.keyword || '');
		}
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.v-content-search-result {
	._tip {
		color: #000;
		font-size: 14px;
		padding-left: 120px;
	}
	._wrapper {
		padding-left: 120px;
	}
	/deep/ .ivu-table:before {
		height: 0px;
	}
	/deep/ .ivu-table-wrapper {
		border: none;
	}
	/deep/ .ivu-table:after {
		width: 0px;
	}
}
</style>


