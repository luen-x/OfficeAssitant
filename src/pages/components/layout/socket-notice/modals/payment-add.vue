<template>
	<oa-base-modal 
		ref="modal" 
		:index="index"
		:alert-id="data.alert_id"
		:title="data.title || '录入到账提醒'"
		cancel-text=""
		ok-text="我知道了"
	>
		<div>
			<template v-if="data.type==4">
				<div>你的以下客户需要尽快进行下单或补交尾款，不然会影响工资的发放，若客户购买的是伍技视频则不需要下单！</div>
				<template v-if="companyNames.length>2">
					<i-tooltip trigger="hover" placement="top" >
						<div class="g-c-red-mid">
							{{ companyNames[0] }}
						</div>
						<div class="g-c-red-mid">
							{{ companyNames[1] }} ...
						</div>
						<div slot="content">
							<div v-for="(name,index) in companyNames" :key="index">
								{{ name }}
							</div>
						</div>

					</i-tooltip>
				</template>
				<template v-else>
					<div v-for="(name,index) in companyNames" :key="index" class="g-c-red-mid">
						{{ name }}
					</div>
				</template>
			</template>
			<template v-else-if="data.type==8">
				{{ caseContent[0] }}<br>{{ caseContent[1] }}
			</template>
			<div v-else>{{ data.content }}</div>
			<div v-if="data.type==1" class="g-c-red-mid">如需详细了解客户资料信息，请咨询超管（勇哥）</div>
			
		</div> 
	</oa-base-modal>
</template>
<script >
import { CreatePortal } from 'wya-vc';
import { Tooltip } from 'iview';
import BaseModal from './base-modal';

export default {
	name: "oa-sale-main-archieve-expire-tip",
	components: {
		'oa-base-modal': BaseModal,
		'i-tooltip': Tooltip
	},
	props: {
		data: Object, 
		// data.type： 1-录入到账 ，2-开票，3-素材下载，4-财务催下单，5-删除pk关系通知，6-立客户-系统使用通知，7-销售首页设置事项通知
		// 8-案例申请通知
		index: Number
	},
	data() {
		return {
		};
	},
	computed: {
		companyNames() {
			if (this.data.type != 4) return [];
			return this.data.content.split(',');

		},
		caseContent() {
			if (this.data.type != 8) return [];
			const index = this.data.content.indexOf('|');
			return [this.data.content.substring(0, index), this.data.content.substring(index + 1)];
		}

	},
	
	methods: {
		
	}
};
export const PaymentAdd = CreatePortal({ autoDestory: false }, module.exports.default);
</script>