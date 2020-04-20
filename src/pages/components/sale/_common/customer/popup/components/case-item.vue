<template>
	<div class="v-sale-customer-detail-case-item g-pd-b-10">
		<div class="_case-title g-m-b-10">
			<span class="g-fs-16 g-m-r-10" style="font-weight:600">{{ data.title }}</span>
			<span v-for="(tag,index) in data.tags||[]" :key="index" class="__case-tag g-c-red-mid">
				{{ tag }}
			</span>
		</div>
		<div class="g-flex g-jc-sb g-m-b-10">
			<span class="g-c-balck7">地区：{{ data.region }}</span>
			<span class="g-c-balck7">行业：{{ data.industry_name }}</span>
			<span class="g-c-balck7">客户产品：{{ data.product_type_name }}</span>
			<span class="g-c-balck7">客户类型：{{ data.customer_type_name }}</span>
		</div>
		<div class="g-flex">
			<div v-if="data.image" class="g-m-r-10"><img :src="data.image" style="width:240px;height:135px" ></div>
			<div class="g-col">
				<div :style="data.image?'height:110px':'height:auto'" class="g-c-black2 _case-text">
					{{ data.text }}
				</div>
				<div class="g-pd-t-10">
					<span class="g-c-black7">{{ data.create_time }}</span>
					<span class="g-c-black7 g-fs-12 g-fr">
						<i class="icon iconfont icon-preview g-c-black7 g-fs-12 "/> {{ data.browse_num }}
						<oa-star 
							:source-id="data.case_id" 
							:source-type="1" 
							:collection-id="data.collection_id"
							:disabled="!$auth[1765] || readOnly"
							class="g-m-l-30" 
							@change="handleStarChange" /> 
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
	name: 'oa-',
	components: {
		'oa-star': Star
		
	},
	props: {
		data: Object,
		readOnly: Boolean
	},
	data() {
		return {
		};
	},
	methods: {
		handleStarChange(data) {
			if (data.changed) {
				if (data.collection_id) {
					this.data.collection_id = data.collection_id;
					this.data.collection_num++;
				} else {
					this.data.collection_id = undefined;
					this.data.collection_num--;

				}
			}
		}
		
	}
};
</script>
<style lang="scss">
.v-sale-customer-detail-case-item {
	width:680px;
	border-bottom:1px solid #EBEBEB;
	._case-title {
		.__case-tag {
			background: rgba(220,75,86,0.1);
			border-radius:3px;
			font-size: 12px;
			padding:4px 8px;
			margin-right: 10px;
			// line-height: 18px;
		}
	}
	
	._case-text {
		-webkit-line-clamp: 6;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;

	}


}
</style>
