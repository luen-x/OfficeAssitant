<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="loading"
			:mask-closable="false"
			class="c-tool-workflow-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div class="g-c-black2 g-flex">
				<div class="g-br g-col _content">
					<p class="__title g-m-b-20">事业部</p>
					<div style="height: 305px; overflow: auto" >
						<div 
							v-for="(item, index) in departs"
							:key="item.depart_id"
							:class="{
								'g-m-b-20': index < departs.length - 1,
								'__selected': selected === index
							}"
							class="__radio-btn"
							@click="handleClick(index)"
						>
							{{ item.depart_name }}
						</div>
					</div>
				</div>
				<div class="g-col _content" style="padding-left: 40px">
					<p class="__title">表单配置</p>
					<div class="g-pd-tb-10 g-bb" />
					<div class="g-pd-t-10 g-pd-l-15" style="height: 305px; overflow: auto">
						<oa-config 
							v-for="(item, index) in departs[selected].receipts"
							:key="index"
							:info="item"
							:scenario="$options.propsData.scenario"
							class="g-m-b-15"
							@change="handleChange(arguments[0], index)"
						/>
					</div>
					
					<!-- <div class="__footer g-flex-ac">
						<div class="g-red-btn-text g-m-r-10">取消</div>
						<div class="g-red-btn-small">确定</div>
					</div> -->
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Message } from 'iview';
import { CreatePortal } from 'wya-vc';
import net from '@utils/net';
import API_ROOT from '@stores/apis/root';
import Config from './config';

export default {
	name: 'hr-tool-workflow-modal',
	components: {
		'i-modal': Modal,
		'oa-config': Config
	},
	props: {
		title: String,
	},
	data() {
		let depart = this.$options.propsData.data[0];
		return {
			visible: false,
			loading: false,
			selected: 0,
			departs: this.$options.propsData.data,
		};
	},
	created() {
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			app.$store.dispatch("request", {
				url: "HR_TOOL_WORKFLOW_SAVE_POST",
				type: 'POST',
				param: {
					inset_arr: this.departs
				},
				loading: false
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleClick(index) {
			if (this.selected === index) return;
			this.selected = index;
		},
		handleChange(value, index) {
			this.departs[this.selected].receipts[index] = {
				...this.departs[this.selected].receipts[index],
				template_id: value
			};
		}
	}
};
export const WorkflowSettingModal = CreatePortal({
	onBefore({ scenario }) {
		return net.ajax({
			url: API_ROOT["_HR_TOOL_WORKFLOW_INFO_GET"], // eslint-disable-line
			type: 'GET',
			param: {
				scenario
			}
		});
	}
}, module.exports.default);
</script>

<style lang="scss">
.c-tool-workflow-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 680px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 30px 20px 0 20px !important;
	}
	._content {
		position: relative;
		padding-bottom: 20px;
		.__title {
			padding-left: 10px;
			border-left: 2px solid #ec505b;
			color: #333333;
			line-height: 12px;
		}
		.__radio-btn {
			width: 220px;
			border: 1px solid #d4d8db;
			color: #808893;
			padding: 5px 10px;
			border-radius: 4px;
			cursor: pointer;
		}
		.__selected {
			border: 1px solid #ec505b;
			color: #ec505b;
		}
		// .__footer {
		// 	position: absolute;
		// 	bottom: 45px;
		// 	right: 0;
		// }
	}
}
</style>