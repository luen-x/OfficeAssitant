<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-edit-enclo"
		width="400"
		title="编辑附件信息"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="max-height:350px;overflow-y: auto">
			<vc-files-picker
				ref="filesPicker"
				v-model="attachments"
				:upload="{multiple: true,max: 10, size: 20}"
				class="_files"
				@error="handleError"
			>
				<template slot-scope="slotProps">
					<div v-for="(item, index) in slotProps.files" :key="index">
						<div :style="{color:item.error_time?'red':''}">
							<i class="iconfont icon-accessory"/>
							<span>{{ item.title }}</span>
							<span class="g-fr g-operation" @click="handleDel(item,index)">
								<i class="iconfont icon-delete1"/>
							</span>
						</div>
						<i-progress :percent="parseInt(item.percent)"/>
					</div>
				</template>
				<div slot="trigger" class="g-tc g-operation _uplodad">
					<i class="iconfont icon-add1"/>添加附件
				</div>
			</vc-files-picker>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Progress } from 'iview';
import { CreatePortal, FilesPicker } from 'wya-vc';
import { mapState } from 'vuex';

export default {
	name: "edit-enclo",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-progress": Progress,
		"i-input-number": InputNumber,
		'vc-files-picker': FilesPicker
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			attachments: [],
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		if (this.data.attachment.length > 0) {
			let v = this.data.attachment.filter(item => item).map(item => {
				return {
					percent: "100.00",
					title: item && item.attachment_name,
					url: item && item.attachment_url
				};
			});
			this.attachments = v || [];
		} else {
			this.attachments = [];
		}
	},
	methods: {
		handleError(err) {
			// this.slotProps.files.pop();
			console.error(err);
			this.$Message.warning(err.msg);
		},
		handleOk() {
			this.visible = false;
			const temp = this.attachments.map(item => ({ attachment_name: item.title, attachment_url: item.url }));
			this.$emit('sure', { attachments: temp });
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleDel(item, index) {
			this.$refs.filesPicker && this.$refs.filesPicker.handleDel(item, index);
		}
	}
};
export const EditEncloModal = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-edit-enclo {
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
        ._uplodad {
            position: absolute;
            bottom: 50px;
            left: 155px;
        }
        .ivu-progress-show-info .ivu-progress-outer {
            padding-right: 25px !important;
            margin-right: -26px !important;
        }
		._files{
			margin: 0;
		}
    }
</style>
