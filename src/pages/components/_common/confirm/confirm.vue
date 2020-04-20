<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:title="title" 
		:mask-closable="false"
		:footer-hide="footerHide"
		width="400"
		class="c-confirm"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div class="g-flex">
			<i
				v-if="showIcon"
				:class="'iconfont g-m-r-10 _icon '+iconClass_"
			/>
			<oa-content v-if="renderContent" :render="renderContent"/>
			<span v-else class="g-c-black2 g-fs-14">{{ msg || content }}</span>
		</div>
		<div v-if="!footerHide" slot="footer">
			<i-button v-if="cancelText != ''" size="large" type="text" @click="handleCancel">{{ cancelText }}</i-button>
			<i-button :loading="okLoading" type="primary" size="large" @click="handleOk">{{ okText }}</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button } from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';
import orderModal from '@extends/mixins/orderModal';

const Content = CreateCustomer({
});
export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'oa-content': Content
	},
	mixins: [orderModal],
	props: {
		msg: {
			type: String,
			default: '确定？'
		},
		content: {
			type: String,
			default: '确定？'
		},
		title: {
			type: String,
			default: '提示'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		okText: {
			type: String,
			default: '确定'
		},
		footerHide: Boolean,
		renderContent: {
			type: Function,
			default: undefined
		},
		showIcon: Boolean,
		iconClass: {
			type: String,
			default: 'icon-question  g-c-orange-mid'
		},
		status: {
			type: String,
			validator: (val) => {
				return ['success', 'error', 'question', 'info', ''].includes(val);

			},
			default: ''
		},
		okCallback: Function
		
	},
	data() {
		return {
			visible: false,
			statusClass: {
				success: "icon-selected g-c-green-mid",
				error: 'g-c-red-mid icon-close2',
				question: 'icon-question  g-c-orange-mid',
				info: 'icon-tishi g-c-yellow',
				warn: 'icon-attention g-c-orange-mid'
			},
			okLoading: false
		};
	},
	computed: {
		iconClass_() {
			if (this.status) {
				return this.statusClass[this.status];
			} else {
				return this.iconClass; 
			}
		}

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.okCallback) {
				const promise = this.okCallback();
				if (promise && promise.then) {
					this.okLoading = true;
					promise.then(() => {
						this.visible = false;
						this.$emit('sure', 1);
					}).catch((err) => {
						err && console.error(err);
						this.okLoading = false;
					});

				} else if (promise) {
					this.visible = false;
					this.$emit('sure', 1);
				}
			} else {
				this.visible = false;
				this.$emit('sure', 1);

			}
			
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		}
	}
};
export const Confirm = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.c-confirm {
	._icon {
		font-size: 18px;
		height: 20px;
		position: relative;
		top: -3px;
	}
	.ivu-modal-body {	
		padding: 30px 20px 10px 40px;
	}
}
    
</style>
