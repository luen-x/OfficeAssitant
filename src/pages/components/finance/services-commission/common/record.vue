<template>
	<div class="g-relative">
		<div v-if="!isLoading" class="v-finance-services-visit-record-item">
			<template 
				v-for="item in recordData.resolve_info.service_score_items" 
				class="g-flex g-fw-w"
			>
				<div 
					:key="item.id" 
					class="g-m-r-30 g-inline-block g-m-b-10" 
					style="width: 141px;"
				>
					<span class="g-c-black3">{{ item.name }}：</span>
					<span class="g-c-black3">
						{{ item.score }}
					</span>
				</div>
			</template>
			<i-row class="g-fs-12 g-lh-32 g-c-black4">
				<span class="g-m-r-30">是否启动招商会：
					<span class="g-c-black3">
						{{ ["--","是","否","不知道"][recordData.resolve_info.attract_meet * 1] }}
					</span>
				</span>
				<i-divider type="vertical" style="background: #D4D7DB !important" />
				<span class="g-m-lr-30">是否启动内训：<span class="g-c-black3">
					{{ ["--","是","否","不知道"][recordData.resolve_info.inner_training * 1] }}
				</span></span>
				<i-divider type="vertical" style="background: #D4D7DB !important" />
				<span class="g-m-l-30">销售是否同步跟进：
					<span class="g-c-black3">
						{{ recordData.resolve_info.is_sale_follow === 0
							? "否" : recordData.resolve_info.is_sale_follow === 1
						? "是" : "已解决" }}
					</span>
				</span>
			</i-row>
			<i-row 
				style="margin-top: -10px" 
				class="g-fs-12 g-lh-32 g-c-black4">
				<span>备注：</span>
				<i-autotip
					:content="recordData.resolve_info.memo || '--'"
					theme="dark"
					placement="bottom" 
					style="width: 90%;display: inline-block;"
					label-class="g-c-black3"
				/>
			</i-row>
			<i-row class="g-fs-12 g-lh-32 g-c-black4">
				回访凭证：
				<oa-upload
					v-if="imgs.length"
					v-model="imgs"
					disabled
				/>
				<span v-else>暂无凭证</span>
			</i-row>
			<i-row v-if="recordData.follow_list.length" class="g-fs-12 g-lh-32 g-c-black4" style="margin-top: -10px">
				<span class="g-m-r-20 g-dp-ib" style="width: 250px">解决时间：
					<span class="g-c-black3">{{ recordData.resolve_info.resolve_time || '--' }}</span>
				</span>
				<span class="g-m-lr-20 g-dp-ib" style="width: 250px">解决备注：
					<i-autotip
						:content="recordData.resolve_info.resolve_mark || '--'"
						theme="dark"
						placement="bottom" 
						style="width: 50px"
						label-class="g-c-black3 "
					/>
				</span>
				<span class="g-m-l-20 g-dp-ib" style="width: 250px">
					操作人：
					<span class="g-c-black3">
						{{ recordData.resolve_info.resolve_staff_name || '--' }}
					</span>
				</span>
			</i-row>
			<div 
				v-for="(followItem, i) in recordData.follow_list"
				:key="i"
				class="g-m-t-10 _follow">
				<i-row class="g-fs-12 g-lh-32 g-c-black4">
					跟进情况：
					<span class="g-c-black3">{{ followItem.mark }}</span>
				</i-row>
				<i-row class="g-fs-12 g-lh-32 g-c-black4">
					<div class="g-inline-block">跟进凭证：</div>
					<oa-upload
						v-if="followItem.file_image.length"
						v-model="followItem.file_image"
						disabled
						class="g-inline-block"
					/>
					<span v-else>暂无凭证</span>
				</i-row>
				<div class="_remark">
					<span class="g-m-r-20">回复人：{{ followItem.staff_name || '--' }}</span>
					<i-divider type="vertical" style="background: #D4D7DB !important" />
					<span class="g-m-l-20">回复时间：{{ followItem.create_time || '--' }}</span>
				</div>
				<!-- <div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
					<img :src="OSS_NO_MESSAGE02">
					<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">该员工暂时没有服务有服务提成的客户哦~</div>
				</div> -->
			</div>
			<div v-if="!recordData.follow_list.length" class="_empty g-flex g-fd-c g-ai-c g-jc-c">
				<img :src="OSS_NO_MESSAGE02">
				<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">销售暂未提交跟进信息~</div>
			</div>
		</div>
		<div v-else>
			<i-spin size="large" fix class="__spin"/>
		</div>
	</div>
</template>

<script>
import { Row, Col, Divider, Spin } from "iview";
import { OSS_NO_MESSAGE02 } from "@constants/constants";
import Upload from '@components/_common/upload/upload';
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";

export default {
	name: 'finance-services-commission-record-item',
	components: {
		'i-row': Row,
		'i-col': Col,
		'i-divider': Divider,
		"oa-upload": Upload,
		'i-spin': Spin,
		'i-autotip': AutoToolTip
	},
	props: {
		detail: Object
	},
	data() {
		return {
			OSS_NO_MESSAGE02,
			recordData: {},
			isLoading: true
		};
	},
	computed: {
		imgs() {
			let image = [];
			this.recordData.resolve_info.fileImage.forEach(item => {
				image.push({
					url: item.img_url,
					title: item.img_url.split("/")[6],
					type: "." + item.img_url.split("/")[6].split(".")[1],
					uid: item.img_url
				});
			});
			return image;
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.isLoading = true;
			this.$request({
				url: '_FINANCE_SERVICE_DETAIL_RECORD_DERAIL_GET',
				type: 'GET',
				param: {
					quality_record_id: this.detail.quality_record_id
				},
				loading: false
			}).then(res => {
				this.recordData = res.data;
				this.recordData.follow_list.forEach(v => {
					let image = [];
					v.file_image.forEach(item => {
						image.push({
							url: item.img_url,
							title: item.img_url.split("/")[6],
							type: "." + item.img_url.split("/")[6].split(".")[1],
							uid: item.img_url
						});
					});
					v.file_image = image;
				});
				this.isLoading = false;
			}).finally(() => {
				this.isLoading = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-finance-services-visit-record-item {
	padding: 20px;
	padding-top: 10px;
	border:1px solid rgba(232, 232, 232, 1);
	._follow {
		position: relative;
		padding: 20px;
		padding-top: 10px;
		height: 175px;
		background: rgba(250,250,250,1);
		._remark {
			position: absolute;
			bottom: 10px;
			right: 20px;
		}
	}
	._empty{
		height: 156px;
		background: rgba(250,250,250,1);
		img {
			width: 100px;
			height: 100px;
		}
	}
	.__spin {
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
}
</style>
<style>
.v-finance-services-visit-record-item ._ecllips {
	/* top: 11px!important */
	vertical-align: none;
}
</style>


