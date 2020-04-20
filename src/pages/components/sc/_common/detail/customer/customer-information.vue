<template>
	<div class="v-sc-customer-customer-information g-relative">
		<div v-if="spin" class="g-m-t-30">
			<div>
				<div 
					class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					基本信息
				</div>
				<div class="g-m-l-15">
					<template v-for="(item,index) in customer_data.customer_info">
						<oa-detail-item
							:key="index"
							:label="item.component_label"
							:content="item.component_value"
							:component_type="item.component_type"
							class="g-m-t-15"
						/>
					</template>
				</div>
			</div>

			<!--没有更改对接人记录则不显示更改记录,并且只显示最后更改的记录-->
			<div
				v-if="buff_customer_data.status"
				class="g-m-t-30"
			>
				<div 
					class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					添加记录
				</div>
				<div class="g-fw-w g-m-l-15 g-m-t-20">
					<oa-detail-item 
						:content="buff_customer_data.new_person"
						label="对接人姓名"
					/>
					<oa-detail-item 
						:content="buff_customer_data.new_phone"
						label="对接人电话"
					/>
					<oa-detail-item 
						:content="buff_customer_data.remark"
						label="备注"
					/>
					<oa-detail-item
						:content="buff_customer_data.operation_person_name"
						class="g-m-t-15"
						label="添加人"
					/>
					<oa-detail-item
						:content="buff_customer_data.create_time"
						class="g-m-t-15"
						label="添加时间"
					/>
				</div>
			</div>

			<div>
				<div
					class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10 g-m-t-30 g-m-b-30"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					电子合同
				</div>

				<div v-if="show">
					<div class="g-m-t-30 g-m-l-15">
						<div class="g-fw-w">
							<oa-upload
								v-model="resume" 
								disabled
								style="width: 300px"
							/>
						</div>
					</div>

					<div class="g-m-l-15 g-m-t-20">
						<oa-detail-item 
							:content="customer_data.electronic.audit_info.status_name"
							label="审核状态"
						/>
						<oa-detail-item 
							:content="customer_data.electronic.audit_info.audit_staff_name"
							label="审核人"
						/>
						<oa-detail-item
							:content="customer_data.electronic.audit_info.audit_time"
							class="g-m-t-15"
							label="审核时间"
						/>
						<oa-detail-item
							v-if="customer_data.electronic.audit_info.status != 1"
							:content="customer_data.electronic.audit_info.audit_remark"
							:label="label"
							class="g-m-t-15"
						/>
					</div>
				</div>

				<div v-else class="g-tc g-m-t-20">
					<img :src="OSS_NO" style="width: 160px;height: 160px;">
					<p>暂无电子合同</p>
				</div>
			</div>

			<div>
				<div class="g-flex g-m-t-30 g-m-b-30">
					<div
						class="g-fs-14 g-c-black3 g-lh-16 g-pd-l-10"
						style="border-left: 2px solid #e84854;height: 16px;"
					>
						打折申请凭证
					</div>

					<div v-if="contract_type != 1">
						<div
							v-if="editShow"
							class="g-lh-16 g-m-l-10 g-operation" 
							style="height: 16px;"
							@click="flag = !flag"
						>
							编辑
						</div>
						<div
							v-if="!flag"
							class="g-lh-16 g-m-l-10" 
							style="height: 16px;"
						>
							<span class="g-operation" @click="handleSave">保存</span>
							<span class="g-operation" @click="flag = !flag">取消</span>
						</div>
					</div>
				</div>

				<div v-if="contract_type != 1">
					<div class="g-m-t-30 g-m-l-15">
						<div class="g-fw-w">
							<oa-imgs-picker
								v-model="discountImages"
								:disabled="flag"
								:max="10"
								reactive
								@change="handleImgChange"
								@error="handleError"
							/>
						</div>
					</div>

					<div class="g-m-l-15 g-m-t-20">
						<oa-detail-item 
							:content="discountShow ? customer_data.discount.audit_info.status_name : '--'"
							label="审核状态"
						/>
						<oa-detail-item 
							:content="discountShow ? customer_data.discount.audit_info.audit_staff_name : '--'"
							label="审核人"
						/>
						<oa-detail-item
							:content="discountShow ? customer_data.discount.audit_info.audit_time : '--'"
							class="g-m-t-15"
							label="审核时间"
						/>
						<oa-detail-item
							v-if="discountShow && customer_data.discount.audit_info.status != 1"
							:content="customer_data.discount.audit_info.audit_remark"
							:label="discountLabel"
							class="g-m-t-15"
						/>
					</div>
				</div>

				<div v-else class="g-tc g-m-t-20">
					<img :src="OSS_NO_MESSAGE05" style="width: 160px;height: 160px;">
					<p>该合同没有上传打折凭证~</p>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { OSS_NO, OSS_NO_MESSAGE05 } from "@constants/constants";
import Upload from "@components/_common/upload/upload";
import ImgsPicker from '@common/imgs-picker/imgs-picker';

export default {
	name: "sc-cooperate-customer-information",

	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-upload": Upload,
		'oa-imgs-picker': ImgsPicker
	},

	props: {
		contract_id: Number,
		project_id: Number,
		contract_type: Number
	},

	data() {
		return {
			customer_data: {},
			resume: [],
			buff_customer_data: {},
			OSS_NO,
			OSS_NO_MESSAGE05,
			discountImages: [],
			spin: false,
			flag: true,
			image: []
		};
	},

	computed: {
		show() {
			return this.customer_data.electronic 
			&& this.customer_data.electronic.contract_image 
			&& this.customer_data.electronic.contract_image.length > 0;
		},

		label() {
			if (this.customer_data.electronic.audit_info.status == 2) {
				return '通过说明';
			} else if (this.customer_data.electronic.audit_info.status == 3) {
				return '驳回原因';
			}
		},

		// 是否展示编辑
		editShow() {
			return (!this.customer_data.discount.audit_info 
			|| (this.customer_data.discount.audit_info && this.customer_data.discount.audit_info.status != 2))
			&& this.flag;
		},

		discountShow() {
			return this.customer_data.discount 
			&& this.customer_data.discount.audit_info;
		},

		discountLabel() {
			if (this.customer_data.discount.audit_info.status == 2) {
				return '通过说明';
			} else if (this.customer_data.discount.audit_info.status == 3) {
				return '驳回原因';
			}
		}
	},

	mounted() {
		this.loadData();
		this.loadBuffCustomer();
	},

	methods: {
		loadData() {
			this.spin = false;
			this.resume = [];

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_CUSTOMER_INFO_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.customer_data = res.data;
				
				this.customer_data.electronic 
				&& this.customer_data.electronic.contract_image 
				&& this.customer_data.electronic.contract_image.forEach(item => {
					this.resume.push({
						url: item,
						title: item.substring(item.lastIndexOf("/") + 1, item.length),
						type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
						uid: item,
						file_id: item
					});
				});
				this.discountImages = this.customer_data.discount.contract_image || [];
				this.image = this.discountImages;
				this.spin = true;
			}).catch(error => {
				this.$Message.error(error.msg);
				this.spin = true;
			});
		},

		loadBuffCustomer() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_BUFF_CUSTOMER_GET",
				type: "GET",
				param: {
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.buff_customer_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleImgChange(val) {
			this.image = val;
		},

		// 打折申请后编辑
		handleSave() {
			if (this.image.find(item => item.uid)) {
				this.$Message.error("请在折扣凭证上传完成后保存");
				return Promise.resolve(0);
			}

			if (this.image.length === 0) {
				this.$Message.error("至少上传一张打折申请凭证");
				return Promise.resolve(0);
			}

			this.$request({
				url: "_SALE_CONTRACT_DISCOUNT_SAVE_POST",
				type: "POST",
				param: { 
					contract_id: this.contract_id, 
					contract_image: this.image
				},
				loading: true
			}).then((res) => {
				this.flag = true;
				this.$Message.success(res.msg);
				this.loadData();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-customer-information {
    min-height: 300px;
	padding-bottom: 100px;
	padding-left: 20px;

	._title{
		display: none;
	}
}
</style>