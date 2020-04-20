<template>
	<div class="v-sc-customer-delivery-table g-relative">
		<div v-if="spin">
			<oa-title class="g-m-b-25 g-m-t-20" title="交接表"/>

			<div v-if="delivery_data.delivery && !delivery_data.delivery.no_handover">
				<div v-if="delivery_data.delivery.status">
					<oa-detail-item 
						:content="delivery_data.delivery.staff_name"
						label="上传人"
					/>

					<oa-detail-item 
						:content="delivery_data.delivery.upload_time"
						label="上传时间"
					/>

					<div class="g-flex">
						<oa-detail-item 
							:content="delivery_data.delivery.complete_time"
							class="g-pd-t-20"
							label="交接完成时间"
						/>

						<div 
							class="g-flex g-m-t-20 g-pd-b-5 g-m-l-5" 
							style="border-bottom: 1px solid #e7e7e7;width: 370px"
						>
							<span class="g-inline-block" style=" width: 120px;color: #818794;">
								交接表
							</span>
							<oa-upload
								v-model="resumes"
								disabled
								style="width: 300px"
							/>
						</div>
					</div>

					<div class="g-m-b-25 g-m-t-20 g-fs-14 g-c-black2">审核信息</div>

					<oa-detail-item 
						:content="['待审核','已通过','被驳回'][delivery_data.delivery.status * 1 - 1]"
						label="审核状态"
					/>
				
					<oa-detail-item
						:content="delivery_data.delivery.audit_staff_name"
						label="审核人"
					/>
					<oa-detail-item
						:content="delivery_data.delivery.audit_time"
						class="g-m-t-15"
						label="审核时间"
					/>
	
					<oa-detail-item
						:content="delivery_data.delivery.remark"
						:label="delivery_data.delivery.status != 3 ? '通过说明': '驳回原因'"
						class="g-m-t-15"
					/>
				</div>

				<div v-else class="g-tc g-m-t-30 _empty">
					<img :src="OSS_NO_MESSAGE04" style="width: 200px;height: 200px;">
					<p class="g-m-t-10">暂未上传交接表</p>
				</div>
			</div>

			<div v-else class="g-tc g-m-t-30 _empty">
				<img :src="OSS_NO" style="width: 200px;height: 200px;">
				<p class="g-m-t-10">该项目不需要交接表</p>
			</div>

			<oa-title class="g-m-b-25 g-m-t-30" title="项目完成表"/>

			<div v-if="delivery_data.complete && delivery_data.complete.status">
				<oa-detail-item 
					:content="delivery_data.complete.staff_name"
					label="上传人"
				/>
				
				<oa-detail-item 
					:content="delivery_data.complete.upload_time"
					label="上传时间"
				/>

				<div class="g-flex">
					<oa-detail-item 
						:content="delivery_data.complete.complete_time"
						class="g-m-t-20"
						label="完成时间"
					/>

					<div 
						class="g-flex g-m-t-20 g-pd-b-5 g-m-l-5" 
						style="border-bottom: 1px solid #e7e7e7;width: 370px"
					>
						<span class="g-inline-block" style=" width: 120px;color: #818794;">
							图片
						</span>
						<oa-upload
							v-model="resume"
							disabled
							style="width: 300px"
						/>
					</div>
				</div>
			</div>

			<div v-else class="g-tc g-m-t-30 _empty">
				<img :src="OSS_NO" style="width: 160px;height: 160px;">
				<p class="g-m-t-10">暂未上传项目完成表</p>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import Upload from '@components/_common/upload/upload';
import { OSS_NO, OSS_NO_MESSAGE04 } from '@constants/constants';

export default {
	name: "sc-cooperate-delivery-table",

	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-upload": Upload
	},

	props: {
		project_id: Number
	},

	data() {
		return {
			OSS_NO,
			OSS_NO_MESSAGE04,
			delivery_data: {},
			resume: [],
			resumes: [],
			spin: false
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;
			this.resume = [];

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_DELIVERY_GET",
				type: "GET",
				param: {
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.delivery_data = res.data;
				this.resume = res.data.complete.status && this.handleGetImage(res.data.complete.images);
				this.resumes = !res.data.delivery.no_handover && res.data.delivery.status && this.handleGetImage(res.data.delivery.images);
				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		},

		handleGetImage(image) {
			let arr = [];

			image.forEach(item => {
				arr.push({
					url: item,
					title: item.substring(item.lastIndexOf("/") + 1, item.length),
					type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
					uid: item,
					file_id: item
				});
			});

			return arr;
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-delivery-table {
    padding: 30px 0 50px 32px;
	min-height: 100%;

	.__btn{
		display: none !important;
	}

	._title{
		display: none;
	}
}
</style>