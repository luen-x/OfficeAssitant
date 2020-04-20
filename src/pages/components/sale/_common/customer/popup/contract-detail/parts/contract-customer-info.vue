<template>
	<div class="v-sale-contract-customer-info g-relative g-pd-b-20" style="min-height:260px">
		<oa-loading v-if="loading"/>
		<div class="g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">基本信息</span>
		</div>
		<div class="g-flex g-fw-w g-pd-l-10" style="width:910px;">
			<oa-info-item
				v-for="(item,index) in customerInfo"
				:key="index"
				:label="item.component_label"
				:content="item.component_value"
				:type="item.component_type"
			/>
		</div>
		<oa-imgs-audit
			ref="electronic"
			:imgs="electronic.contract_image" 
			:audit-info="electronic.audit_info" 
			:save-fn="handleSaveElectronic"
			:disabled="contractType==1"
			title="电子合同"
		/>
		<oa-imgs-audit 
			ref="discount"
			:imgs="discount.contract_image"
			:audit-info="discount.audit_info" 
			:save-fn="handleSaveDiscount" 
			:disabled="contractType==1"
			title="打折申请凭证"
		/>
		
		<!-- <div class="g-pd-b-10 g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">电子合同</span>
			<span v-if="electronic.audit_info.length == 0 ||electronic.audit_info && electronic.audit_info.status!=2" class="g-m-l-20">
				<span v-if="imgChanged" class="g-operation" @click="handleSave">保存</span>
				<span v-if="imgChanged" class="g-m-l-10" style="color:gray;cursor:pointer" @click="handleCancelEdit">取消</span>
			</span>
		</div>
		<div style="min-height:80px" class="g-m-l-10">
			<oa-imgs-picker
				ref="imgPicker"
				v-model="electronic.contract_image"
				:disabled="(electronic.audit_info && electronic.audit_info.status==2)"
				:max="10"
				@change="handleImgChange"
				@error="handleError"
			/>
		</div>
		<div v-if="electronic.audit_info" class="g-flex g-fw-w g-m-l-10" style="width:910px">
			<oa-info-item :content="electronic.audit_info.status_name" label="审核状态"/>
			<oa-info-item :content="electronic.audit_info.audit_time" label="审核时间" />
			<oa-info-item :content="electronic.audit_info.audit_staff_name" label="审核人" />
			<oa-info-item 
				v-if="electronic.audit_info.status!=1" 
				:content="electronic.audit_info.audit_remark" 
				:label="(electronic.audit_info.status==2?'通过':'驳回')+'说明'" 
				tooltip
			/>
		</div>
		<div class="g-pd-b-10 g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">打折申请凭证</span>
			<span v-if="electronic.audit_info.length == 0 ||electronic.audit_info && electronic.audit_info.status!=2" class="g-m-l-20">
				<span v-if="imgChanged" class="g-operation" @click="handleSave">保存</span>
				<span v-if="imgChanged" class="g-m-l-10" style="color:gray;cursor:pointer" @click="handleCancelEdit">取消</span>
			</span>
		</div>
		<div style="min-height:80px" class="g-m-l-10">
			<oa-imgs-picker
				ref="imgPicker"
				v-model="electronic.contract_image"
				:disabled="(electronic.audit_info && electronic.audit_info.status==2)"
				:max="10"
				@change="handleImgChange"
				@error="handleError"
			/>
		</div>
		<div v-if="electronic.audit_info" class="g-flex g-fw-w g-m-l-10" style="width:910px">
			<oa-info-item :content="electronic.audit_info.status_name" label="审核状态"/>
			<oa-info-item :content="electronic.audit_info.audit_time" label="审核时间" />
			<oa-info-item :content="electronic.audit_info.audit_staff_name" label="审核人" />
			<oa-info-item 
				v-if="electronic.audit_info.status!=1" 
				:content="electronic.audit_info.audit_remark" 
				:label="(electronic.audit_info.status==2?'通过':'驳回')+'说明'" 
				tooltip
			/>
		</div> -->
	</div>
</template>
<script >
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import Upload from '@common/upload/upload';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import downloadFile from '@utils/download';
import InfoItem from '../../../../info-item';
import ImgsAudit from '../../components/imgs-audit';

export default {
	name: "oa-sale-contract-customer-info",
	components: {
		'oa-info-item': InfoItem,
		'oa-loading': Loading,
		'oa-imgs-picker': ImgsPicker,
		'oa-upload': Upload,
		'oa-imgs-audit': ImgsAudit
	},
	props: {
		contractId: Number,
		contractType: Number
	},
	data() {
		return {
			loading: false,
			customerInfo: [],
			electronic: {
				status: 1,
				contract_image: [],
				audit_info: {
					status_name: '--',
					audit_time: '',
					audit_staff_name: '',
					audit_remark: '',
					status: 1,
				},
			},
			discount: {
				status: 1,
				contract_image: [],
				audit_info: {
					status_name: '--',
					audit_time: '',
					audit_staff_name: '',
					audit_remark: '',
					status: 1,
				},
			},
			showPicker: true,
			imgChanged: false,
			
			orignImages: []
		};
	},
	computed: {
	},
	watch: {
		contractId() {
			this.loadData();
			this.$refs.electronic && (this.$refs.electronic.imgChanged = false);
			this.$refs.discount && (this.$refs.discount.imgChanged = false);
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData(option) {
			this.loadCustomerInfo(option);	
		},
		loadCustomerInfo(option = { updateSection: ["all"] }) {
			const { updateSection } = option;
			this.loading = true;
			return this.$request({
				url: "_SALE_CONTRACT_CUSTOMER_INFO_GET",
				type: "GET",
				param: { contract_id: this.contractId },
				loading: false,
			}).then(res => {
				let contact_name = "";
				let contact_tel = "";
				if (updateSection.includes('all')) {
					this.customerInfo = res.data.customer_info;
					this.customerInfo.forEach(item => {
						item.component_field == 'contact_name' && (contact_name = item.component_value);
						item.component_field === 'contact_tel' && (contact_tel = item.component_value);
					});
				}
				if (updateSection.find(i => i == 'electronic' || i == 'all')) {
					if (res.data.electronic.length !== 0) {
						this.electronic = res.data.electronic;
					} else {
						this.electronic.audit_info = {
							status_name: '--',
							audit_time: '',
							audit_staff_name: '',
							status: 1
						};
						this.electronic.contract_image = [];
					}
					this.$refs.electronic.orignImgs = [...this.electronic.contract_image];
				}
				if (updateSection.find(i => i == 'discount' || i == "all")) {
					if (res.data.discount.length !== 0) {
						this.discount = res.data.discount;
					} else {
						this.discount.audit_info = {
							status_name: '--',
							audit_time: '',
							audit_staff_name: '',
							status: 1
						};
						this.discount.contract_image = [];
					}
					this.$refs.discount.orignImgs = [...this.discount.contract_image];
				}


				// this.updateShowPicker();
				this.$emit('change', { contact_name, contact_tel });
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			}).finally(() => this.loading = false);
		},
		handleImgChange() {
			this.imgChanged = true;
		},
		handleSaveElectronic(imgs) {
			if (imgs.find(item => item.uid)) {
				this.$Message.error("请在电子合同上传完成后保存");
				return Promise.resolve(0);
			}
			if (imgs.length == 0 && this.electronic.audit_info.status == 3) {
				this.$Message.error("至少上传一张电子合同");
				return Promise.resolve(0);
			}
			return this.$request({
				url: "_SALE_CONTRACT_ELECTRONIC_SAVE_POST",
				type: "POST",
				param: { contract_id: this.contractId, contract_image: imgs },
				loading: true
			}).then((res) => {
				this.loadData({ updateSection: ['electronic'] });
				return 1;
			}).catch((res) => {
				this.$Message.error(res.msg);
				return 0;
			});
		},
		handleSaveDiscount(imgs) {
			if (imgs.find(item => item.uid)) {
				this.$Message.error("请在折扣凭证上传完成后保存");
				return Promise.resolve(0);
			}
			if (imgs.length == 0 && this.discount.audit_info.status == 3) {
				this.$Message.error("至少上传一张打折申请凭证");
				return Promise.resolve(0);
			}
			return this.$request({
				url: "_SALE_CONTRACT_DISCOUNT_SAVE_POST",
				type: "POST",
				param: { contract_id: this.contractId, contract_image: imgs },
				loading: true
			}).then((res) => {
				this.loadData({ updateSection: ['discount'] });
				return 1;
			}).catch((res) => {
				this.$Message.error(res.msg);
				return 0;
			});
		},
		handleCancelEdit() {
			this.electronic.contract_image = [...this.orignImages];
			this.imgChanged = false;
			this.updateShowPicker();
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		updateShowPicker() {
			this.showPicker = false;
			this.$nextTick(() => {
				this.showPicker = true;
			});
		},
		handleDel(item, index) {
			this.$refs.imgPicker.handleDel(item, index);

		},
		handlePreview(event, index) {
			this.$refs.imgPicker.handlePreview(event, index);
		},
		handleDownload(url) {
			if (url.includes('aliyuncs')) {
				downloadFile({
					fileName: url
				});
			} else {
				window.open(url, '_blank');
			}
		},
	}
};
</script>
<style lang="scss">
</style>