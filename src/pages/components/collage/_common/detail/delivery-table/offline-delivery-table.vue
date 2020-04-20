<template>
	<div class="v-collage-offline-delivery-table">
		<div>
			<div>
				<div class="g-m-l-15 g-m-r-30 g-m-t-10">
					<div class="g-fs-14">
						<span 
							class="g-fs-14 g-lh-16 g-pd-l-10 g-inline-block"
							style="border-left: 2px solid #e84854;height: 16px;color: #818794;"
						>
							产品名称：
						</span>
						<span>{{ delivery_data.product_name }}</span>
					</div>
				</div>

				<div v-if="delivery_data.has_lesson">
					<div 
						v-for="(item,index) in delivery_data.delivery" 
						:key="index"
						class="g-pd-tb-30 g-m-lr-15"
						style="border-bottom: 1px solid #f0f4fc;"
					>
						<div class="g-m-r-30 g-pointer">
							<div 
								class="g-fs-14 g-c-black g-lh-16 g-pd-l-10"
								style="border-left: 2px solid #e84854;height: 16px;"
								@click="handleToggle(`expand_${index}`)"
							>
								<span>{{ item.lecture_set_name }}</span>
								<i
									:class="item.show ? 'icon-triangle-down' : 'icon-triangle-up'"
									class="iconfont g-fs-10"
								/>
							</div>
						</div>

						<vc-expand :ref="`expand_${index}`" v-model="item.show">
							<div v-if="item.is_assign">
								<div 
									v-for="(element,id) in item.record"
									:key="id"
									class="g-m-l-15 g-m-r-30 g-m-t-20 g-relative g-pointer" 
									style="background: #fafafa;"
								>
									<div
										class="g-pd-l-20 g-flex g-jc-sb"
										style="height: 50px;line-height: 50px;border-bottom: 1px solid #eaeef1;"
										@click="handleToggle(`expands_${element.record_id}`)"
									>
										<div class="g-absolute _position"/>
										<div>
											<i
												:class="element.show ? 'icon-triangle-down' : 'icon-triangle-up'"
												class="iconfont g-fs-10"
											/> 
											<span class="g-c-black g-fs-14">{{ element.record_staff_name }}</span>
											<span>（{{ element.role_name }}）</span>
										</div>

										<div v-if="$auth[1310] && element.is_upload" class="g-m-r-20">
											<vc-debounce-click
												class="g-red-btn-line g-m-r-5"
												@click="handleUpload(element,item.lesson_status)"
											>
												{{ element.images && element.images.length && element.images.length > 0 ? '编辑' : '上传' }}
											</vc-debounce-click>
										</div>
									</div>

									<vc-expand :ref="`expands_${element.record_id}`" v-model="element.show">
										<div class="g-m-t-30 g-m-l-15 g-pd-b-30">
											<oa-detail-item
												:content="element.staff_name" 
												label="上传人"
												style="width: 354px;"
											/>
											<oa-detail-item 
												:content="element.update_time"
												label="上传时间"
												style="width: 354px;"
											/>
											<div class="g-flex g-m-t-20 g-pd-b-5 _delivery-table">
												<span class="g-inline-block">交付表</span>

												<div v-if="element.images && element.images.length && element.images.length > 0">
													<oa-upload
														v-model="element.images"
														disabled
														style="width: 200px;"
													/>
												</div>
												<div v-else>--</div>
											</div>
										</div>
									</vc-expand>
								</div>
							</div>

							<div v-else class="g-tc g-m-t-20">
								<img :src="OSS_NO" style="width: 138px;height: 140px;">
								<p class="g-m-t-10">暂未上传交付表</p>
							</div>
						</vc-expand>
					</div>
				</div>

				<div v-else class="g-tc" style="margin-top: 50px;">
					<img :src="OSS_NO" style="width: 138px;height: 140px;">
					<p class="g-m-t-10">暂未上传交付表</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button } from "iview";
import { DetailItem } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import Upload from '@components/_common/upload/upload';
import { OSS_NO } from "@constants/constants";
import { Expand } from "wya-vc";
import { UploadDeliveryFormModal } from "./upload-delivery-form";

export default {
	name: "collage-offline-delivery-table",

	components: {
		"oa-detail-item": DetailItem,
		"oa-upload": Upload,
		"vc-expand": Expand
	},
	
	props: {
		offline_data: Object,
		lesson_type: Number,
		project_id: Number
	},

	data() {
		return {
			OSS_NO,
			delivery_data: {}
		};
	},

	created() {
		this.delivery_data = JSON.parse(JSON.stringify(this.offline_data));
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
    
	methods: {
		handleUpload(v, lesson_status, $event) {
			event.stopPropagation();

			UploadDeliveryFormModal.popup({
				lesson_type: this.lesson_type,
				record_id: Number(v.record_id),
				project_id: this.project_id,
				image: v.images ? v.images : [],
				lesson_status
			}).then(res => {
				res && this.$parent.loadData();
			});
		},
        
		handleToggle(value) {
			this.$refs[value][0].toggle();
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
			}).then(() => {
				this.handleGetData();
			}).catch(error => {
				this.$Message.warning(error.msg);

				return false;
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-offline-delivery-table{
    ._delivery-table {
		border-bottom: 1px solid #e7e7e7;
		width: 354px;

        span {
            width: 100px;
			color: #818794;
        }
	}
	
	._position{
		width: 0;
		height: 0;
		border-top: 16px solid #ff5461;
		border-right: 16px solid transparent;
		top: 0;
		left: 0;
	}
}
</style>