<template>
	<div class="v-sc-customer-handover-delivery-table g-relative">
		<div v-if="spin">
			<div v-if="delivery_data.staff_name">
				<div 
					class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10 g-m-t-30 g-m-b-20"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					交接表
				</div>

				<div class="g-m-l-10">
					<oa-detail-item 
						:content="delivery_data.staff_name"
						label="上传人"
					/>

					<oa-detail-item 
						:content="delivery_data.upload_time"
						label="上传时间"
					/>

					<div class="g-flex">
						<oa-detail-item 
							:content="delivery_data.complete_time"
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
								v-model="resume"
								disabled
								style="width: 300px"
							/>
						</div>
					</div>

					<div class="g-m-b-25 g-m-t-20 g-fs-14 g-c-black2">审核信息</div>

					<oa-detail-item 
						:content="['待审核','已通过','被驳回'][delivery_data.status * 1 - 1]"
						label="审核状态"
					/>
				
					<oa-detail-item
						:content="delivery_data.audit_staff_name"
						label="审核人"
					/>
					<oa-detail-item
						:content="delivery_data.audit_time"
						class="g-m-t-15"
						label="审核时间"
					/>
	
					<oa-detail-item
						:content="delivery_data.remark"
						:label="delivery_data.status != 3 ? '通过说明': '驳回原因'"
						class="g-m-t-15"
					/>
				</div>
			</div>

			<div v-else class="g-tc g-m-t-30 _empty">
				<img :src="OSS_NO" style="width: 200px;height: 200px;">
				<p class="g-m-t-10">暂无交接表</p>
			</div>
		</div>

		<oa-loading v-else/>
	</div>
</template>

<script>
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import Upload from '@components/_common/upload/upload';
import { OSS_NO } from '@constants/constants';

export default {
	name: "sc-customer-handover-delivery-table",

	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-upload": Upload
	},

	props: {
		project_id: Number,
		project_delivery_id: Number
	},

	data() {
		return {
			OSS_NO,
			delivery_data: {},
			resume: [],
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
				url: "_SC_CUSTOMER_HANDOVER_DELIVERY_DETAIL_GET",
				type: "GET",
				param: {
					project_id: this.project_id,
					project_delivery_id: this.project_delivery_id
				},
				loading: false
			}).then(res => {
				this.delivery_data = res.data;

				res.data.images.forEach(item => {
					this.resume.push({
						url: item,
						title: item.substring(item.lastIndexOf("/") + 1, item.length),
						type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
						uid: item,
						file_id: item
					});
				});

				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-handover-delivery-table {
    padding: 0 0 0 22px;
	min-height: 100%;

	.__btn{
		display: none !important;
	}

	._title{
		display: none;
	}
}
</style>