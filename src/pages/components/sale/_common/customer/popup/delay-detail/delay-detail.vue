<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side v-sale-customer-audit-delay-detail"
		@on-close="handleCancel"
	>
		<div
			class="_head-title"
		>
			{{ companyName|| '--' }}
		</div>
		<div class="g-pd-l-20 g-pd-b-20" >
			<div class="g-detail-title" >申请信息</div>
			<div class="g-flex g-fw-w g-m-b-30">
				<oa-info-item :content="delayInfo.applicant" label="申请人"/>
				<oa-info-item :content="delayInfo.create_time" label="申请时间"/>
				<oa-info-item content="重要客户" label="客户等级"/>
				<oa-info-item :content="delayInfo.expiration_time" label="保护截止时间"/>
				<oa-info-item :content="delayInfo.prolong_reason" label="申请原因"/>
				<oa-info-item :content="delayInfo.prolong_to_time" label="申请延长至"/>
				<div class="__long-content">
					<oa-info-item :content="delayInfo.apply_remarks" label="申请说明"/>
				</div>
				<div class="__long-content">
					<oa-info-item :content="delayInfo.image_url" label="凭证">
						<oa-upload
							v-model="delayInfo.image_url"
							:max="10"
							:upload="{multiple: true, max: 10}"
							style="width: 220px"
							disabled
						/>
					</oa-info-item>
				</div>
			</div>
			<template v-if="tabType!='1'">
				<div class="g-detail-title" >审核状态</div>
				<div class="g-flex g-fw-w">
					<oa-info-item :content="delayInfo.status_str" label="审核状态"/>
					<oa-info-item :content="delayInfo.audit_time" label="审核时间"/>
					<oa-info-item :content="delayInfo.audit_prolong_time" label="保护期延长至"/>
					<oa-info-item :content="delayInfo.audit_remarks" label="通过说明"/>
				</div>
			</template>
		</div>
		<div v-if="showAuditBtn" class="_footer">

			<i-button v-if="$auth[1719]" @click="handleOption('pass')">审核通过</i-button>
			<i-button v-if="$auth[1720]" @click="handleOption('reject')">审核驳回</i-button>
		</div>
	</i-drawer>
</template>
<script>
import { Input, Button, Drawer } from 'iview';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from "wya-vc";
import Upload from '@common/upload/upload';
import InfoItem from '../../../info-item';
import { AuditDelay } from './audit';


export default {
	name: 'oa-sale-customer-audit-delay-detail',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-info-item': InfoItem,
		'i-drawer': Drawer,
		'oa-upload': Upload,
	},
	mixins: [orderModal],

	props: {
		protectId: Number,
		companyName: String,
		tabType: String, // 1-待审核 ， 2-已通过，3-已驳回
		updateList: Function
	},
	data() {
		return {
			visible: false,

			auditConfig: {
				1: {
					name: '待审核',
					label: ''
				},
				2: {
					name: '已通过',
					label: '通过说明'
				},
				3: {
					name: '已驳回',
					label: '驳回说明'
				}
			},
			delayInfo: {
				image_url: []
			}
		};
	},
	computed: {
		audit() {
			return this.auditConfig[this.tabType] || {};
		},
		showAuditBtn() {
			return this.tabType == 1 && (this.$auth[1719] || this.$auth[1720]);
		}

	},
	watch: {
		protectId(val) {
			this.loadData(val);

		}
	},
	created() {
		this.loadData();

	},
	mounted() {
		this.visible = true;

	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_CUSTOMER_AUDIT_DELAY_DETAIL_GET",
				type: "GET",
				param: {
					protect_id: this.protectId
				},
				loading: false,
			}).then(res => {
				this.delayInfo = res.data;
			
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
			
		},
		handleOption(option) {
			AuditDelay.popup({
				protectId: this.protectId,
				action: option,
				applyTime: this.delayInfo.prolong_to_time ? this.delayInfo.prolong_to_time.split('（')[0] : '',
				originTime: this.delayInfo.expiration_time
			}).then(() => {
				this.updateList && this.updateList();
				this.handleOK();
			}).catch(e => e && console.error(e));

		},
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
	}
};
export const DelayDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-audit-delay-detail {
	.__long-content {
		.c-upload {
			display: inline-block;
			width: 530px !important;
		}
		.v-sale-customer-info-item {
			display: block;
			width: 640px;
		}
		._label {
			display: inline-block;
			width: 100px;
		}
	}
}
</style>