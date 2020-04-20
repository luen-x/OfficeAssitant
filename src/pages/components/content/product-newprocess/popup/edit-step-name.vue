<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-add-class"
		width="400"
		title="编辑步骤名称"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<div >
				<i-form :model="formItem" :label-width="80">
					<i-form-item label="步骤名称:">
						<i-input v-model="formItem.input" placeholder="请输入步骤名称"/>
					</i-form-item>
				</i-form>
			</div>
		</div>
		<div slot="footer">
			<vc-debounce-click :tag="Button" class="g-m-r-10">取消</vc-debounce-click>
			<vc-debounce-click :tag="Button" type="primary" @click="handleOk()">确定</vc-debounce-click>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';

export default {
	name: "edit-name",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			formItem: {},

		};
	},

	computed: {
		...mapState({ process: state => state.contentProductNewprocess.process }),
		process_name: {
			set(val) {
				this.$store.commit('SET_PROCESS_NAME', val);
			},
			get() {
				return this.$store.state.contentProductNewprocess.process.name;
			}
		}
	},
	 beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let num = this.data.num;
		this.formItem.input = this.process.productProcessStep[num].step_name;
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
			this.formItem.num = this.data.num;
			this.$store.commit('EDIT_STEP_NAME', this.formItem);
			this.$emit('sure', {});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},


	}
};
export const EditStepName = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
	.v-add-class {
	    ._number-append {
	        display: inline-block;
	        position: absolute;
	        right: 7px;
	        vertical-align: bottom;
	        z-index: 1;
	        color: gray;
	    }
	    .ivu-input-number {
	        width: 100% !important;

	        .ivu-input-number-handler-wrap {
	            display: none !important;
	        }
	    }
	}
</style>
