<template>
	<div class="v-sale-main-circle-content">
		<oa-block title="发圈素材" @getDetail="handleMore">
			<div class="g-pd-t-20 g-pd-lr-20" style="min-height:200px">
				<div v-if="circleList.length==0" class="g-tc">
					<img 
						
						:src="OSS_SEARCH_EMPTY"
					>
				</div>
				<div 
					v-for="(item,index) in circleList" 
					:key="item.circle_id" 
					:style="'border-bottom: '+(index==circleList.length-1?'none':'1px solid rgb(235, 235, 235);')" 
					class="g-m-b-15 g-pd-b-20 g-pointer "
					@click="handleDetail(item)"
				>
					<div class="g-flex g-m-b-10 g-jc-sb">
						<span class="g-fs-16 g-c-black1">{{ item.title }}</span>
						<span class="g-c-black7">{{ item.staff_name }} {{ item.create_time }}</span>
					</div>
					<div v-if="item.type==2" class="g-flex">
						<img v-if="item.image" :src="item.image+'!1-2'" class="g-m-r-10" style="width:160px;height:90px">
						<div class="g-col _circle-content-text">
							{{ item.text }}
						</div>
					</div>
					<div v-else-if="item.type==1">
						<div class="g-oneline">
							{{ item.content }}
						</div>
						<oa-upload
							v-if="item.attachment_list.length"
							v-model="item.attachment_list"
							:max="5"
							:show-title="false"
							style="width: 520px"
							class="g-m-t-5"
							disabled
							placeholder=""
						/>

					</div>
				</div>
			</div>
		</oa-block>
	</div>
</template>
<script>
import Upload from '@common/upload/upload';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Block from '../_common/block';
import { getPlainText, getImgUrl } from '../../_common/util';

export default {
	name: 'oa-',
	components: {
		'oa-block': Block,
		'oa-upload': Upload
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			circleList: []
		};
	},
	created() {
		this.loadData();

	},
	methods: {
		loadData() {
			this.$request({
				url: "SALE_MAIN_CIRCLE_LIST_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				res.data.list.length = 2;
				res.data.list = res.data.list.filter(Boolean);
				res.data.list.forEach(i => {
					if (i.type == 2) {
						i.text = getPlainText(i.content);
						if (!i.image) {
							i.image = getImgUrl(i.content)[0] || '';
						}
					} else if (i.type == 1) {
						i.attachment_list.length = 6;
						i.attachment_list = i.attachment_list.filter(Boolean);
					}
				});
				this.circleList = res.data.list;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleMore() {
			this.$router.push({
				path: '/sale/main/circle'
			});
		},
		handleDetail(item) {
			if (item.type == 1) {
				this.handleMore();
			} else {
				this.$router.push({
					path: '/sale/main/circle/detail',
					query: { circle_id: item.circle_id }
				});
			}
		}
	}
};
</script>
<style lang="scss">
.v-sale-main-circle-content {
	._circle-content-text {
		-webkit-line-clamp: 5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;
	}
}
</style>