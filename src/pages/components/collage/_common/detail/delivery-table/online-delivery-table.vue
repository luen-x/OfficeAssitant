<template>
	<div class="v-collage-online-delivery-table">
		<div class="g-m-r-30 g-m-t-10 g-flex g-jc-sb">
			<div class="g-m-b-30 g-fs-14">
				<span 	
					class="g-fs-14 g-lh-16 g-pd-l-10 g-m-b-20 g-inline-block"
					style="border-left: 2px solid #e84854;height: 16px;color: #818794;"
				>
					产品名称：
				</span>
				<span>{{ online_data.product_name }}</span> 
			</div>
			<div v-if="$auth[1310] && online_data.is_upload">
				<vc-debounce-click
					class="g-red-btn-line g-m-r-5"
					@click="handleUpload"
				>
					{{ isEdit ? '编辑' : '上传' }}
				</vc-debounce-click>
			</div>
		</div>

		<div v-if="show" class="g-m-l-15">
			<oa-detail-item
				:content="online_data.staff_name" 
				label="上传人"
			/>
			<oa-detail-item 
				:content="online_data.update_time" 
				label="上传时间"
			/>
			<div class="g-flex g-m-t-20 g-pd-b-5 _delivery-table">
				<span class="g-inline-block">交付表</span>

				<div v-if="online_data.images && online_data.images.length && online_data.images.length > 0">
					<!-- @del-before="delBefore" -->
					<oa-upload
						v-model="online_data.images"
						disabled
						style="width: 200px;"
					/>
				</div>
				<div v-else>--</div>
			</div>
		</div>

		<div v-else class="g-tc g-m-t-20">
			<img :src="OSS_NO" style="width: 138px;height: 140px;">
			<p class="g-m-t-10">暂未上传交付表</p>
		</div>
	</div>
</template>

<script>
import { Button } from "iview";
import { DetailItem } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import Upload from '@components/_common/upload/upload';
import { OSS_NO } from "@constants/constants";
import { UploadDeliveryFormModal } from "./upload-delivery-form";

export default {
	name: "collage-online-delivery-table",

	components: {
		"oa-detail-item": DetailItem,
		"oa-upload": Upload
	},

	props: {
		online_data: Object,
		lesson_type: Number,
		project_id: Number
	},
    
	data() {
		return {
			OSS_NO
		};
	},

	computed: {
		show() {
			return this.online_data && this.online_data.status;
		},

		isEdit() {
			return this.online_data && this.online_data.images && this.online_data.images.length > 0;
		}
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
    
	methods: {
		handleUpload() {
			UploadDeliveryFormModal.popup({
				lesson_type: this.lesson_type,
				project_id: this.project_id,
				image: this.online_data && this.online_data.images ? this.online_data.images : []
			}).then(res => {
				res && this.$parent.loadData();
			});
		},
        
		delBefore(file_id) {
			return this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_DEL_DELIVERY_POST,
				type: "POST",
				param: {
					file_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				return true;
			}).catch(error => {
				this.$Message.warning(error.msg);
				return false;
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-online-delivery-table{
    ._delivery-table {
		border-bottom: 1px solid #e7e7e7;
		width: 370px;

        span {
            width: 100px;
			color: #818794;
        }
    }
}
</style>