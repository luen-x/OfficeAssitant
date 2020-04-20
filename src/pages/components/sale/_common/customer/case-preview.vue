<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="案例预览"
		width="850"
		class="v-sale-customer-case-preview"
		footer-hide
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i v-if="position>0" class="icon iconfont icon-left _preview-btn _left g-c-white" @click="handlePre" />
		<oa-case-info :data="caseList[position]" :show-collect="showCollect" class="g-m-l-10"/>
		<i v-if="position<caseList.length-1" class="icon iconfont icon-right _preview-btn _right g-c-white" @click="handleNext"/>
	</i-modal>
</template>
<script>
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';
import CaseInfo from '@components/academy/support-case-detail/info';

export default {
	name: "oa-sale-customer-case-preview",
	components: {
		'i-modal': Modal,
		'oa-case-info': CaseInfo
	},
	props: {
		caseList: {
			type: Array,
			default: () => []
		},
		index: {
			type: Number,
			default: 0
		},
		showCollect: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			position: this.index,
			visible: false,
			
		};
	},
	created() {

	},
	beforeDestroy() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleNext() {
			if (this.position < this.caseList.length - 1) this.position += 1;
		},
		handlePre() {
			if (this.position > 0) this.position -= 1;
		}
		
		
	}
};
export const CasePreview = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-case-preview {
	// // .ivu-modal {
	// // 	background: rgba(0,0,0,0);
	// // }
	// .ivu-modal-close .ivu-icon-ios-close {
	// 	display: none;
    //     // font-size: 42px;
    //     // color: #fff;
    // }
    // .ivu-modal-close .ivu-icon-ios-close:hover {
	// 	display: none;
    //     // color: #fff;
    // }
    .ivu-modal-body {
        min-height: 500px;
    }
    // .ivu-modal-content {
	// 	border-radius: 22px;
	// 	background: inherit;
	// 	box-shadow: none;
    // }
    // .ivu-modal-header {
    //     display: none;
	// }
	
	._preview-btn {
		font-size: 72px;
		position: absolute;
		top: 180px;
		cursor: pointer;
		&._left {
			left: -60px;
		}
		&._right {
			right: -60px;	
		}
	} 

}
</style>