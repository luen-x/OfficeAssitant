<template>
	<div class="v-sale-customer-audit-info g-relative g-pd-tb-20" style="min-height:260px;width:680px" >
		<oa-loading v-if="loading"/>
		
		<oa-across-table :data="auditSchedule">
			<div 
				slot-scope="{item:data}" 
				class="g-flex g-flex-cc g-fd-c"
			>
				<div class="g-m-t-10">{{ data.title }}</div>
				<div 
					v-if="data.status !== 4" 
					class="g-c-black5"
				>
					{{ data.create_time }}
				</div>
				<div 
					v-else 
					class="g-c-orange-mid g-pointer"
					@click="handleRemind"
				>
					催一下
				</div>
			</div>
		</oa-across-table>
		<oa-expand-panel v-for="pro in projects" :key="pro.project_id" :border="false" class="g-relative">
			<div slot="header" class="g-pointer">{{ pro.product_name }}</div>
			<div class="g-flex g-pd-b-25 g-pd-l-30 g-pd-t-15" style="flex-wrap:wrap">
				<img v-if="showAudit(data.type, pro.status)" :src="auditIcon[pro.status]" class="_audit-img">
				<oa-info-item :content="pro.audit_staff_name" label="审核人"/>
				<oa-info-item :content="pro.audit_time" label="审核时间"/>
				<oa-info-item v-if="pro.status!=1" :content="pro.audit_remark" :label="pro.remark_explain" tooltip/>
			</div>
		</oa-expand-panel>
		<oa-expand-panel :border="false" class="g-relative g-m-t-5">
			<div slot="header" class="g-pointer">财务审核</div>
			<div class="g-flex g-pd-b-25 g-pd-l-30 g-pd-t-15" style="flex-wrap:wrap">
				<img :src="financeAuditIcon[financeAudit.status]" class="_audit-img">
				<oa-info-item :content="financeAudit.audit_staff_name" label="审核人"/>
				<oa-info-item :content="financeAudit.audit_time" label="审核时间"/>
				<oa-info-item 
					v-if="financeAudit.status!=0" 
					:content="financeAudit.audit_remark" 
					:label="financeAudit.status==1?'通过说明':'驳回说明'" 
					tooltip
				/>
			</div>
		</oa-expand-panel>

	</div>
</template>
<script>
import { Input, Button } from 'iview';
import ExpandPanel from '@common/expand-panel/expand-panel';
import AcrossTable from '@common/across-table/across-table';
import { OSS_REJECT, OSS_PASS, OSS_WAIT_CONFIRM, OSS_ACTIVE } from "@constants/constants";
import InfoItem from '../../../../info-item';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-expand-panel': ExpandPanel,
		'oa-info-item': InfoItem,
		'oa-across-table': AcrossTable
	},
	props: {
		data: Object,
	},

	data() {
		return {
			loading: false,
			auditIcon: {
				1: OSS_WAIT_CONFIRM,
				2: OSS_PASS,
				3: OSS_PASS,
				4: OSS_PASS,
				5: OSS_REJECT,
				6: OSS_PASS
			},
			financeAuditIcon: {
				0: OSS_WAIT_CONFIRM,
				1: OSS_PASS,
				2: OSS_REJECT,
				3: OSS_PASS
			},
			auditSchedule: [],
			projects: [],
			financeAudit: {
				audit_staff_name: '',
				audit_remark: '',
				audit_time: '',
				status: ''
			}
		};
	},
	computed: {
		

	},
	watch: {
		'data.contract_id': function () {
			this.loadData();

		}

	},
	created() { 
		this.loadData();

	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: "_SALE_CONTRACT_AUDIT_INFO_GET",
				type: "GET",
				param: { contract_id: this.data.contract_id },
				loading: false,
			}).then(res => {
				this.auditSchedule = res.data.audit_schedule.map(it => ({ ...it, status: +it.status + 1 }));
				this.projects = res.data.project;
				this.financeAudit = {
					audit_staff_name: res.data.audit_staff_name,
					audit_remark: res.data.audit_remark,
					audit_time: res.data.audit_time,
					status: res.data.status
				};
			}).catch((res) => {
				console.error(res);

				this.$Message.error(res.msg);
			}).finally(() => this.loading = false);
		},
		handleRemind() {
			this.$request({
				url: "_SALE_URGE_CONTRACT_POST",
				type: "POST",
				param: {
					relation_id: this.data.contract_id
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// // 审核状态，1待审核 2待确认（通过就是待确认）3 待分配 4 已分配 5未通过 6已失效
		// getRemarkLabel(status) {
		// 	if (status == 1) {
		// 		return '';
		// 	} else if (status == 5) {
		// 		return '驳回说明';
		// 	} else return '通过说明';

		// },
		showAudit(type, status) {
			type += ''; 
			switch (type) {
				case "1": return true;
				case "2": return true;
				case "3": return true;
				case "4": return true;
				case "5":
					if (status == 5) return true;
					else return false;
				default: return false;
			}
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-audit-info {
	._audit-img {
		width: 80px;
		height: 80px;
		position: absolute;
		left: 590px;
		top: 35px;
	}
	

}
</style>