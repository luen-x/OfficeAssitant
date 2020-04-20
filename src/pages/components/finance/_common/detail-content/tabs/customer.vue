<template>
	<div class="v-finance-tab">
		<div v-if="spin">
			<oa-title>
				<template slot="title">基本信息</template>
				<div slot="content" class="g-fw-w">
					<oa-detail-item 
						v-for="(item, index) of data.customer_info" 
						:key="index" 
						:label="item.component_label"
						:content="item.component_value"
						class="g-m-t-15" 
					>
						<span v-if="item.component_type === 8">
							<span v-for="(info, index) of item.component_value" :key="index">
								{{ info }} 
								<span v-if="index < item.component_value.length - 1">-</span>
							</span>
						</span>
						<span v-else-if="item.component_type === 6">
							<oa-upload 
								:data-source="item.component_value.map(item => ({ type: '.png', url: item }))"
								:show-title="false"
								disabled 
							/>
						</span>
						<span v-else>{{ item.component_value }}</span>
					</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<template slot="title">
					电子合同
					<template v-if="name === 'elec' && contractType !== 1">
						<span 
							v-if="!edit" 
							class="g-operation g-m-l-5" 
							@click="handleEdit">编辑</span>
						<template v-else>
							<span class="g-operation g-m-l-5" @click="handleSave">保存</span>
							<span class="g-operation g-m-l-5" @click="edit = false">取消</span>
						</template>
					</template>
				</template>
				<div slot="content">
					<div v-if="data.electronic.contract_image && data.electronic.contract_image.length">
						<template v-if="spin">
							<div v-if="!edit" class="g-m-t-20">
								<oa-upload 
									:data-source="data.electronic.contract_image && 
									data.electronic.contract_image.map(item => ({ type: '.png', url: item }))"
									:disabled="!edit"
									:show-title="false"

								/>
							</div>
							<div v-else class="g-m-t-20">
								<imgs-picker 
									v-model="elec_image"
									:max="10"
									@error="handleError"
								/>
							</div>
						</template>
						<div 
							v-if="data.electronic.audit_info"
							class="g-fw-w g-m-t-20">
							<oa-detail-item 
								:content="data.electronic.audit_info.status_name" 
								label="审核状态">{{ data.electronic.audit_info.status_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.electronic.audit_info.audit_staff_name" 
								label="审核人">{{ data.electronic.audit_info.audit_staff_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.electronic.audit_info.audit_time" 
								class="g-m-t-15" 
								label="审核时间">{{ data.electronic.audit_info.audit_time }}</oa-detail-item>
							<oa-detail-item 
								v-if="data.electronic.audit_info.status !== 1"
								:content="data.electronic.audit_info.audit_remark"
								:label="data.electronic.audit_info.status === 2 ? '通过说明' : '驳回原因'" 
								class="g-m-t-15">{{ data.electronic.audit_info.audit_remark }}</oa-detail-item>
						</div>
					</div>
					<div v-else class="g-tc g-m-t-20">
						<img :src="OSS_NO_MESSAGE05" style="width: 160px;height: 160px;">
						<p>该合同没有上传电子合同~</p>
					</div>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<template slot="title">
					打折信息
					<template v-if="name === 'discount' && contractType !== 1" >
						<span 
							v-if="!discountEdit" 
							class="g-operation g-m-l-5" 
							@click="handleDiscountEdit">编辑</span>
						<template v-else>
							<span class="g-operation g-m-l-5" @click="handleDiscountSave">保存</span>
							<span class="g-operation g-m-l-5" @click="discountEdit = false">取消</span>
						</template>
					</template>
					<template v-if="name=='contract' && $auth[1775]">
						<span class="g-operation g-m-l-5" @click="handleSign">
							标记折扣
						</span>
						<span v-if="data.discount.is_sign==1" class="g-operation g-m-l-5" @click="handleCancelSign">
							取消标记
						</span>
					</template>
				</template>
				<i-button 
					v-if=" $auth[1776]" 
					slot="extra" 
					type="primary" 
					class="g-fr" 
					@click="handleSignRecord">标记记录</i-button>

				<div slot="content">

					<div v-if="(data.discount.contract_image && data.discount.contract_image.length) || data.discount.is_sign==1">
						<template v-if="spin && data.discount.contract_image && data.discount.contract_image.length">
							<div v-if="!discountEdit" class="g-m-t-20">
								<oa-upload 
									:data-source="data.discount.contract_image && 
									data.discount.contract_image.map(item => ({ type: '.png', url: item }))"
									:disabled="!discountEdit"
									:show-title="false"

								/>
							</div>
							<div v-else class="g-m-t-20">
								<imgs-picker 
									v-model="discount_image"
									:max="10"
									@error="handleError"
								/>
							</div>
						</template>
						<div class="g-fw-w g-m-t-20">
							<oa-detail-item 
								v-if="data.discount.is_sign==1"
								:content="data.discount.rate+''" 
								label="折扣">{{ data.discount.rate+'' }}
							</oa-detail-item>
							<template v-if="data.discount.audit_info">
								<oa-detail-item 
									:content="data.discount.audit_info.status_name" 
									label="审核状态">{{ data.discount.audit_info.status_name }}
								</oa-detail-item>
								<oa-detail-item 
									:content="data.discount.audit_info.audit_staff_name" 
									label="审核人">{{ data.discount.audit_info.audit_staff_name }}
								</oa-detail-item>
								<oa-detail-item 
									:content="data.discount.audit_info.audit_time" 
									class="g-m-t-15" 
									label="审核时间">{{ data.discount.audit_info.audit_time }}
								</oa-detail-item>
								<oa-detail-item 
									v-if="data.discount.audit_info.status !== 1"
									:content="data.discount.audit_info.audit_remark"
									:label="data.discount.audit_info.status === 2 ? '通过说明' : '驳回原因'" 
									class="g-m-t-15">{{ data.discount.audit_info.audit_remark }}
								</oa-detail-item>
							</template>
						</div>
					</div>
					<div v-else class="g-tc g-m-t-20">
						<img :src="OSS_NO_MESSAGE05" style="width: 160px;height: 160px;">
						<p>该合同没有上传打折凭证~</p>
					</div>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
	</div>
</template>

<script>
import { Spin, Button } from 'iview';
import Loading from '@components/_common/loading/loading';
import { ImgsPreview, ImgsPicker } from 'wya-vc';
import { OSS_NO, OSS_NO_MESSAGE05 } from "@constants/constants";
import Upload from '@components/_common/upload/upload';
import { Confirm } from '@common/confirm/confirm';
import API_ROOT from '@stores/apis/root';
import DetailItem from '../../detail-item';
import Title from '../../title';
import { DiscountSign } from '../../popup/discount-sign';
import { SignRecord } from '../../popup/discount-sign-record';


export default {
	name: 'finance-detail-tabs-customer',
	components: {
		'oa-detail-item': DetailItem,
		'oa-imgs-preview': ImgsPreview,
		'oa-loading': Loading,
		'oa-title': Title,
		'oa-upload': Upload,
		'imgs-picker': ImgsPicker,
		'i-button': Button
	},
	props: {
		contractId: Number,
		electronicId: Number,
		discountId: Number,
		show: Boolean,
		name: String,
		contractType: Number,
	},
	data() {
		return {
			data: {
				customer_info: [],
				electronic: {
					audit_info: {},
					contract_image: []
				},
				discount: {
					audit_info: {},
					contract_image: []
				}
			},
			spin: true,
			OSS_NO_MESSAGE05,
			elec_image: [],
			discount_image: [],
			edit: false,
			discountEdit: false,
			isfetching: 0,
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		},
		electronicId() {
			this.loadData();
		},
		discountId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleEdit() {
			this.edit = true;
			this.elec_image = [...(this.data.electronic.contract_image || [])];
		},
		handleDiscountEdit() {
			this.discountEdit = true;
			this.discount_image = [...(this.data.discount.contract_image || [])];
		},
		handleSave() {
			this.$request({
				url: API_ROOT._FINANCE_ELEC_CONTRACT_CUSTOMER_SAVE_POST,
				type: 'POST',
				param: {
					contract_id: this.contractId,
					contract_image: this.elec_image
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.edit = false;
				this.loadData();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDiscountSave() {
			this.$request({
				url: API_ROOT._FINANCE_DISCOUNT_CONTRACT_CUSTOMER_SAVE_POST,
				type: 'POST',
				param: {
					contract_id: this.contractId,
					contract_image: this.discount_image
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.discountEdit = false;
				this.loadData();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSign() {
			DiscountSign.popup({
				rate: this.data.discount.is_sign === 1 ? this.data.discount.rate : null,
				contractId: this.contractId,
			}).then(this.loadData).catch(e => e && console.error(e));
		},
		handleCancelSign() {
			Confirm.popup({
				title: '取消折扣',
				msg: '确定取消折扣吗？'
			}).then(() => {
				this.$request({
					url: "_FINANCE_CUSTOMER_DISCOUNT_SIGN_POST",
					type: "GET",
					param: {
						is_sign: 2,
						contract_id: this.contractId
					},
					loading: false,
				}).then(res => {
					this.loadData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(e => e && console.error(e));
		},
		handleSignRecord() {
			SignRecord.popup({
				contractId: this.contractId
			}).catch(e => e && console.error(e));

		},
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_INFO_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId,
					electronic_id: this.electronicId,
					discount_id: this.discountId
				},
				loading: false
			}).then(res => {
				this.data = { ...this.data, ...res.data };
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">

</style>


