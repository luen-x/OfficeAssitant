<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-add-class"
		width="400"
		title="添加流程"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form
				ref="from"
				:model="formItem"
				:rules="ruleValidate"
				:label-width="80"
				@submit.native.prevent>
				<i-form-item label="步骤名称:" prop="name">
					<i-input v-model="formItem.name" :maxlength="12" placeholder="请输入步骤名称" @on-enter="handleOk"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';
import { AddStep } from './add-step';

export default {
	name: "add-process",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	data() {
		return {
			visible: false,
			formItem: {},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入添加步骤名字', trigger: 'blur' }
				]
			}

		};
	},
	computed: {
		...mapState({ process: state => state.contentProductNewprocess.process })
	},
	beforeCreate() {
		this.Button = Button;
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
			this.$refs.from.validate((msg) => {
				if (msg) {
					this.$emit('sure');
					// this.process.productProcessStep.push({ step_name: this.formItem.input });
					this.$store.commit('ADD_PROCESS', this.formItem.name);
					AddStep.popup({
						store: this.$store
					}).then((res) => {

					}).catch((res) => {

					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.error("请输入步骤名称");
				}
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
	}
};
export const AddProcess = CreatePortal({}, module.exports.default);
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
