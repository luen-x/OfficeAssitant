<template>
	<div class="v-hr-archives-person-details-echarts g-flex">
		<div v-if="itemData.list.length">
			<div class="g-flex g-jc-sa">
				<div v-for="(item,index) in itemData.list" :key="index" >
					<oa-item :echarts-data="item" class="_echart"/>
				</div>
			</div>
			<div class="_footer">
				<i-page 
					v-if="itemData.list.length" 
					:total="itemData.totalPage*10" 
					class="_footpage" 
					@on-change="handlePage" />
			</div>
		</div>
		<div v-else>
			<div class="g-flex g-flex-cc g-flex-ac">
				<div class="_empty">
					<img :src="nodataUrl" class="_img g-m-b-20" alt >
					<div>暂无优劣势互荐表信息</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Page, Button } from "iview";
import { tableHeight } from '@extends/mixins/table';
// item
import { OSS_EMPTY } from '@constants/constants';
import item from './item';


export default {
	name: 'v-hr-archives-person-details-echarts',
	components: {
		'vc-paging': Paging,
		'oa-item': item,
		'i-page': Page
	},
	data() {
		const { query } = this.$route;
		return {
			echartsData: [],
			itemData: { list: [] },
			nodataUrl: OSS_EMPTY
		};
	},
	
	mounted() {
		this.loadData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: 1,
					page,
					pageSize
				},
			}).then((res) => {
				this.itemData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handlePage(val) {
			this.loadData(val);
		},
	}
};

</script>

<style lang="scss">
.v-hr-archives-person-details-echarts{
	overflow: hidden;
	width: 97.5%;
	flex-direction: column;
	margin-bottom: 40px;
	._echart{
		margin-left:40px;
		height: 400px;
		min-width: 500px;
		width: 50%;
	}
	._footer{
		overflow: hidden;
		._footpage{
			margin-top: 20px;
			margin-bottom: 0px;
			float:right;
		}
	}
	._empty {
		height: 360px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
	
</style>
