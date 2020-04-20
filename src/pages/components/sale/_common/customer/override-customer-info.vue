<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="覆盖信息提示"
		width="400"
		class="v-sale-customer-common-override-customer"
		ok-text="确认并更新"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-10 g-m-b-10">
			检测到以下可编辑的信息和本次添加资料识别出的数据不同，请勾选需要覆盖的信息
		</div>
		<i-checkbox-group v-model="selects" class="g-m-l-10">
			<i-checkbox 
				v-for="(field,index) in data" 
				:label="field.key" 
				:key="index"
				style="width:340px"
			> 
				<span class="g-m-l-10">
					<span class="g-dp-ib" style="width:84px;vertical-align:top">{{ field.label }}：</span>
					<span class="g-dp-ib" style="width:220px;vertical-align:top">{{ field.oldDataStr || field.oldData }}</span>

				</span>
			</i-checkbox>
		</i-checkbox-group>
	</i-modal>
</template>
<script>
import { Modal, Checkbox, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-sale-override-customer-info",
	components: {
		'i-modal': Modal,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox
		
	},
	props: {
		data: Array
	},
	data() {
		// 如果是系统里有的数据，抓取到的数据没有则筛选出来
		return {
			visible: false,
			selects: []
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure', this.selects);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		
	}
};
export const OverrideCustomerInfo = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-common-override-customer {
	.ivu-checkbox {
		vertical-align: top;
	}

}

</style>