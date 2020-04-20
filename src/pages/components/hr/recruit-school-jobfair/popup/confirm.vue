<template>
	<i-modal 
		v-model="visible" 
		:title="title" 
		:mask-closable="false"
		width="400" 
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-30 g-pd-t-20 ">
			<oa-content v-if="renderContent" :render="renderContent"/>
			<span v-else class="g-c-black3 g-fs-14">{{ msg }}</span>
		</div>
		<div slot="footer">
			<i-button v-if="btnName1 != ''" type="text" @click="handleCancel">{{ btnName1 }}</i-button>
			<i-button type="primary" @click="handleOk">{{ btnName2 }}</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button } from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';

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
	props: {
		data: Object,
		msg: {
			type: String,
			default: '确认？'
		},
		title: {
			type: String,
			default: '提示'
		},
		btnName1: {
			type: String,
			default: '取消'
		},
		btnName2: {
			type: String,
			default: '确认'
		},
		renderContent: {
			type: Function,
			default: undefined
		}
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: debounce(function () {
			this.visible = false;
			this.$emit('sure', 1);
		}, 200),
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		}
	}
};
export const Confirm = CreatePortal({}, module.exports.default);
</script>
