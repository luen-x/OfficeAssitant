<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-preiew-form"
		width="900"
		title="步骤流程预览"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex">
			<div style="width:400px,text-align:right" >
				<div
					v-for="(item,i) in process.product_process_step"
					:key="i"
					:style="{ background:i==num ? '#f0f4fc':'',}"
					class="g-flex _process"
					@click="handlePreview(i)"
				>
					<span>{{ i+1 }}.</span>
					<span>{{ item.step_name }}</span>
				</div>
			</div>
			<div style="max-width:450px;">
				<oa-form :config="process.product_process_step[num].product_component"/>
			</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';
import { AddElement } from './add-element';
import { EditElement } from './_common/edit-element';
import preform from '../../_common/preview-form/pre-form-item';
import pform from '../../_common/preview-form/pre-form';


export default {
	name: "preview-form",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"oa-item": preform,
		"oa-form": pform,
	},
	data() {
		return {
			visible: false,
			formItem: {},
			num: 0,
		};
	},
	computed: {
		...mapState({ process: state => state.contentProductNewprocess.process })
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure', {});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handlePreview(i) {
			this.num = i;
		},
	}
};
export const PreviewForm = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
	.v-preiew-form {
		.ivu-modal-body{
			max-height: 400px;
			overflow:auto;
		}
	    ._process {
	        height: 40px;
	        line-height: 40px;
	        width: 350px;
	        border-bottom: 1px solid #f5f5f6;
	        cursor: pointer;
	    }
	    ._process:hover {
	        background: #f0f4fc;
	    }
	}
</style>
