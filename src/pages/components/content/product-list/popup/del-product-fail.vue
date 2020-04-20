<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-del-product-fail"
		width="400"
		titie="确认删除"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<div class="g-fs-14 g-c-black2">删除失败！当前产品正在销售中</div>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "del-product-fail",
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

		};
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
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},

	}
};
export const DelProductFail = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-del-true {
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
