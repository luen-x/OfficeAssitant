<template>
	<div style="width: 880px; padding: 10px 0;">
		<i-row>
			<div
				v-for="item of displayList"
				:key="item.key"
				class="g-lh-30 g-c-black3">
				<i-col span="3" class="g-tr g-pd-r-10">{{ item.label }}</i-col>
				<i-col span="21" style="padding-left: 5px">
					<div v-if="!item.showAutotip">{{ detailData[item.key] || '--' }}</div>
					<div v-else style="height: 30px">
						<oa-autotip
							:content="detailData[item.key] || '--'"
							placement="bottom" 
							label-class=" "
							style="height: 30px"
						/>
					</div>
				</i-col>
			</div>
		</i-row>
	</div>
</template>

<script>
import { Row, Col } from 'iview';
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";

export default {
	components: {
		'i-col': Col,
		'i-row': Row,
		'oa-autotip': AutoToolTip
	},
	props: {
		detailData: {
			type: Object,
		},
		displayInfo: {
			type: Array
		},
		role_type: {
			type: Number | String,
			required: true
		}
	},
	computed: {
		displayList() {
			// 驳回理由存在即展示(排除流程对接人)
			let result = this.detailData.audit_remark || this.detailData.role_type == 1
				? this.displayInfo
				: this.displayInfo.slice(1);

			let hasBusiness = result.some(v => v.key === 'is_business' 
				&& this.detailData[v.key] === '否');
			if (hasBusiness) {
				result = result.filter(v => v.key !== 'business_day');
			}
			return result;
		}
	}
};
</script>