<template>
	<oa-base-modal 
		ref="modal"
		:index="index"
		:alert-id="Number(data.alert_id)"
		:title="data.title"
		cancel-text="关闭"
		ok-text="去分配" 
		@on-ok="handleOk"
	>
		<div>
			<div>{{ data.content }}</div>
		</div> 
	</oa-base-modal>
</template>
<script >
import { CreatePortal } from 'wya-vc';
import BaseModal from './base-modal';

export default {
	name: "oa-sc-deallocate-tip",

	components: {
		'oa-base-modal': BaseModal
	},

	props: {
		data: Object,
		index: Number
	},

	data() {
		return {
		};
	},
	
	methods: {
		handleOk() {
			this.$router.push({
				path: "/sc/customer/predistribute",
				query: {
					search: this.data.phone,
					type: "1"
				}
			});
		}
	}
};
export const ScDeallocate = CreatePortal({ autoDestory: false }, module.exports.default);
</script>