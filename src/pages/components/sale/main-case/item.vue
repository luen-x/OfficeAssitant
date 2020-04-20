<template>
	<div 
		:key="data.case_id" 
		class="g-pd-b-20 v-sale-mian-case-item" 
		style="width:100%;border-bottom: 1px solid rgb(235, 235, 235);" 
		@click="handleClickCase"
	>
		<div class="g-m-b-10 g-m-t-10">
			<span class="g-fs-16 g-c-black1" style="font-weight:600" v-html="data.title"/>
			<span class="g-fr g-c-black7 g-pd-t-5">
				<span class="g-m-l-40">{{ data.region }}</span>
				<span class="g-m-l-40">{{ data.industry_name }}</span>
				<span class="g-m-l-40">{{ data.customer_type_name }}</span>
				<span class="g-m-l-40">{{ data.product_type_name }}</span>
			</span>
		</div>
		<div class="g-flex" >
			<div v-if="data.image" class="g-m-r-10">
				<img :src="data.image+'!1-2'" style="width:256px;height:144px">
			</div>
			<div class="g-col" >
				<div style="height: 125px;" class="_case-text" v-html="data.text"/>
				<div style="padding-top:7px">
					<span class="g-c-black7 g-m-r-20"> {{ data.staff_name }}</span><span class="g-c-black7"> {{ data.create_time }}</span>
					<span class="g-c-black7 g-fs-12 g-fr">
						<i class="icon iconfont icon-preview g-c-black7 g-fs-12 "/> {{ data.browse_num }}
						<oa-star 
							:source-id="data.case_id" 
							:source-type="1" 
							:collection-id="data.collection_id" 
							:disabled="!$auth[1765]"
							class="g-m-l-30"
							@change="handleStarChange"
						/>
						{{ data.collection_num }}
						<i class="icon iconfont icon-lianjie g-c-black7 g-fs-12 g-m-l-30"/> {{ data.attachment_num }}
					</span>
				</div>
			</div>

		</div>

		
	</div>
</template>

<script>
import Star from '@components/collect/_common/comp/star';

export default {
	name: "oa-item",
	components: {
		'oa-star': Star

	},
	props: {
		data: Object
		
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_CASE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_CASE_LIST_RESET', { type: this.type });
		},
		handleClickCase() {
			this.$router.push({
				path: "/sale/main/case/detail",
				query: { case_id: this.data.case_id }
			});

		},
		handleStarChange(res) {
			this.handleResetCur();
		}
	}
};
</script>
<style lang="scss">
.v-sale-mian-case-item {
	._case-text {
		-webkit-line-clamp: 7;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;

	}

}

</style>
