<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-preiew-form"
		width="900"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<p slot="header" class="g-tc">
			<span>步骤流程预览</span>
		</p>
		<div class="g-flex">
			<i-form>
				<div class="g-flex g-fw-w">
					<oa-item v-for="(item,i) in process" :key="i" :config="item"/>
				</div>
			</i-form>
		</div>
		<div slot="footer">
			<div/>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';
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
		...mapState({ process: state => state.contentProductNewcustomer.product_component }),
	},
	created() { },
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
		}
	}
};
export const PreviewForm = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-preiew-form {
        .ivu-modal-body {
            max-height:400px;
            overflow: auto;
        }
        ._process {
            height: 40px;
            line-height: 40px;
            width: 320px;
            border-bottom: 1px solid #d4d7db;
            cursor: pointer;
        }
        ._process:hover {
            background: #f0f4fc;
        }
    }
</style>
