d<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-del-true"
		width="400"
		title="确认删除"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div calss="g-fs-14 g-c-black2">
			<div>当产品正应用与组合产品里边，删除会导致组
				<br>合产品无法下单购买。必须先删除与之相关联的组合产品才能删除改产品
			</div>
		</div>
		<div slot="footer">
			<vc-debounce-click :tag="Button" class="g-m-r-10">取消</vc-debounce-click>
			<vc-debounce-click :tag="Button" type="promi">确定</vc-debounce-click>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
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
export const ModalDelTrue = CreatePortal({}, module.exports.default);
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
