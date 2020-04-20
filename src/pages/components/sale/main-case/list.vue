<template>
	<div style="width:1000px" class="g-flex g-m-t-20"> 
		<div style="width:725px">
			<oa-filter ref="filter" />
			<div v-if="!listInfo.data ||!listInfo.data[curPage] || !listInfo.data[curPage].length" class="g-tc" style="margin-top: 60px;">
				<img :src="OSS_NO_MESSAGE02" style="width:180px" >
				<div>暂无数据</div>
			</div>
			<vc-paging
				ref="tableTarget"
				:data-source="listInfo.data" 
				:total="listInfo.total"
				:reset="listInfo.reset"
				:history="true"
				:load-data="loadData"
				mode="piece"
				class="g-m-t-20 v-sale-main-case-list"
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"

			>
				<oa-item 
					slot-scope="it"
					:data="it"
					class="_item"
				/> 
			</vc-paging>
		</div>
		<div class="g-m-l-20">
			<oa-hot-case v-if="recommendCase.length" :case-list="recommendCase" title="推荐案例" @click-case="handleClickCase"/>
			<oa-hot-search 
				v-if="labelList.length" 
				:label-list="labelList" 
				:class="{'g-m-t-20':!!recommendCase.length}" 
				title="热门搜索" 
				@click-label="handleClickSearch"/>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { OSS_NO_MESSAGE02 } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import HotCase from '@components/academy/support-case-detail/hot-case';
import HotSearch from '@components/academy/support-case-detail/hot-search';
import Filter from '@components/sale/main-case/filter';
import Item from './item';
import { getPlainText, getImgUrl, getHeighLightHtml } from '../_common/util';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-item': Item,
		'oa-hot-case': HotCase,
		'oa-filter': Filter,
		'oa-hot-search': HotSearch,
	},
	
	data() {
		const { query } = this.$route;

		return {
			OSS_NO_MESSAGE02,
			recommendCase: [],
			labelList: [],
			curPage: query.page || 1


		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleMainCase.listInfo;
		}
	},
	created() {
		this.loadRecomandCase();
		this.loadHotSeachLabel();

	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_MAIN_CASE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
				initList: (list) => {
					list.forEach(i => {
						i.text = getPlainText(i.content);
						if (i.image == '-') i.image = '';
						if (!i.image) {
							const urls = getImgUrl(i.content);
							urls && urls[0] && (i.image = urls[0]);	
						}
						if (query.keyword) {
							i.title = getHeighLightHtml(i.title, query.keyword);
							i.text = getHeighLightHtml(i.text, query.keyword);
						}
					});
					return list; 
				}
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_MAIN_CASE_LIST_INIT');
		},
		loadRecomandCase() {
			this.$request({
				url: "_SALE_MAIN_CASE_RECOMEND_CASE_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				res.data.forEach(i => {
					i.hot = i.collection_num > 10;
				});
				this.recommendCase = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		loadHotSeachLabel() {
			this.$request({
				url: "_SALE_MAIN_CASE_POPULAR_CASE_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.labelList = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleClickCase(ca) {
			this.$router.push({
				path: "/sale/main/case/detail",
				query: { case_id: ca.case_id }
			});

		},
		handleClickSearch(label) {
			this.$refs.filter.query.keyword = label;
			this.$refs.filter.handleSearch();
		},
		handlePageChange(page) {
			this.curPage = page;

		},
	}
};

</script>

<style lang="scss">
.v-sale-main-case-list {
	display: flex;
	flex-wrap: wrap;
	margin-top:0px;
	margin-bottom: 20px;
	
}

</style>
