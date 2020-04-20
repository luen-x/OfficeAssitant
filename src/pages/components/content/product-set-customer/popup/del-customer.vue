<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-del-process"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<p slot="header" class="g-tc">
			<span>确定删除</span>
		</p>
		<div>
			<div>请问是否确定删除吗？</div>
		</div>
		<div slot="footer">
			<i-button class="g-m-r-10" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "del-process",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-button": Button,
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
export const DelCus = CreatePortal({}, module.exports.default);
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
