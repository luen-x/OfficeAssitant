<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title"
		class="v-preiew-form"
		width="900"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div v-if="data.type ==1||data.type ==2" class="g-flex">
			<i-form>
				<div class="g-flex g-jc-sb g-fw-w">
					<oa-item
						v-for="(item,i) in config.product_component"
						:key="i"
						:config="item"
						class="g-m-r-20"/>
				</div>
			</i-form>
		</div>
		<div v-else class="g-flex">
			<div>
				<div
					v-for="(item,i) in config.product_process_step"
					:key="i"
					class="g-flex _process"
					style="width:320px;"
					@click="handlePreview(i)"
				>
					<span>{{ i+1 }}.</span>
					<span>{{ item.step_name }}</span>
				</div>
			</div>
			<div>
				<oa-form v-if="config.product_process_step" :config="config.product_process_step[num].product_component"/>
			</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';
import API from "@stores/apis/root";
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
	props: {
		data: Object,

	},
	data() {
		return {
			visible: false,
			formItem: {},
			num: '0',
			config: [],

		};
	},
	computed: {
		title() {
			if (this.data.type == 1) {
				return "项目需求预览";
			} else if (this.data.type == 2) {
				return "客户需求预览";
			} else {
				return "流程分类预览";
			}
		}
	},
	created() {
		let api = '';
		if (this.data.type == 1) {
			api = API._CONTENT_PRODUCT_SET_PROJECT_LIST_EDIT_GET;
		} else if (this.data.type == 2) {
			api = API._CONTENT_PRODUCT_SET_CUSTOMER_LIST_EDIT_GET;
		} else if (this.data.type == 3) {
			api = API._CONTENT_PRODUCT_SET_PROCESS_LIST_EDIT_GET;
		}
		this.fetch(api);
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetch(api) {
			this.$request({
				url: api,
				type: "post",
				param: {
					process_id: this.data.process,
				}
			}).then(res => {
				this.config = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
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
		.ivu-modal-body{
			max-height: 400px;
			overflow:auto;
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
