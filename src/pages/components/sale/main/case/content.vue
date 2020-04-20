<template>
	<div class="v-sale-main-case-content">
		<oa-block title="客户案例" @getDetail="handleMore">
			<div class="g-pd-t-20 g-pd-lr-20" style="min-height:200px">
				<div v-if="caseList.length==0" class="g-tc">
					<img 
						
						:src="OSS_SEARCH_EMPTY"
					>
				</div>
				<div 
					v-for="(item,index) in caseList" 
					:key="item.case_id" 
					:style="'border-bottom: '+(index==caseList.length-1?'none':'1px solid rgb(235, 235, 235);')" 
					class="g-m-b-15 g-pd-b-20 g-pointer "
					@click="handleDetail(item)"
				>
					<div class="g-flex g-m-b-10 g-jc-sb">
						<span class="g-fs-16 g-c-black1">{{ item.title }}</span>
						<span class="g-c-black7">
							<span class="g-m-l-20">{{ item.region }}</span>
							<span class="g-m-l-20">{{ item.industry_name }}</span>
							<span class="g-m-l-20">{{ item.customer_type_name }}</span>
							<span class="g-m-l-20">{{ item.product_type_name }}</span>
						</span>
						<!-- <span class="g-c-black7">{{ item.create_time }}</span> -->
					</div>
					<div class="g-flex">
						<img v-if="item.image" :src="item.image+'!1-2'" class="g-m-r-10" style="width:160px;height:90px">
						<div class="g-col">
							<div class=" _case-content-text">
								{{ item.text }}
							</div>
							<div class="g-c-black7 g-pd-t-5" style="line-height:12px">{{ item.create_time }}</div>
						</div>
					</div>
				</div>
			</div>
		</oa-block>
	</div>
</template>
<script>
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Block from '../_common/block';
import { getPlainText, getImgUrl } from '../../_common/util';

export default {
	name: 'oa-',
	components: {
		'oa-block': Block
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			caseList: []
		};
	},
	created() {
		this.loadData();

	},
	methods: {
		loadData() {
			this.$request({
				url: "SALE_MAIN_CASE_LIST_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				res.data.list.length = 2;
				res.data.list = res.data.list.filter(Boolean);
				res.data.list.forEach(i => {
					i.text = getPlainText(i.content);
					if (!i.image) {
						i.image = getImgUrl(i.content)[0] || '';
					}
				});
				this.caseList = res.data.list;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleMore() {
			this.$router.push({
				path: '/sale/main/case'
			});
		},
		handleDetail(item) {
			this.$router.push({
				path: '/sale/main/case/detail',
				query: { case_id: item.case_id }
			});

		}
	}
};
</script>
<style lang="scss">
.v-sale-main-case-content {
	._case-content-text {
		-webkit-line-clamp: 4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;
	}
}
</style>