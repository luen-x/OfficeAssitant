<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		title="选择下载课件"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="v-sale-study-video-download">
			<div class="_title">
				<i-checkbox
					:indeterminate="indeterminate"
					:value="checkAll"
					@click.prevent.native="handleCheckAll"
				/>
				<span class="__name">课件名称</span>
			</div>
			<i-Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
				<template v-for="(item,index) in attachment" >
					<div v-if="item.is_download==1" :key="index" class="_attachment">
						<i-checkbox :label="index" >
							<oa-file-icon
								:file-url="item.attachment_url"
								style="margin-left:54px;margin-right:10px;display: inline-block"
							/>
							<span>{{ item.attachment_name }}</span>
						</i-checkbox>
					</div>
				</template>
			</i-Checkbox-group>
			<div v-if="0">{{ checkAllGroup }}</div>
		</div>
		<div slot="footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Select, Option, CheckboxGroup, Checkbox } from 'iview';
import API from '@stores/apis/root';
import fileIcon from '@components/_common/file-icon/file-icon';
import { CreatePortal } from 'wya-vc';
import { downloadFile } from '@utils/download';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		'i-button': Button,
		"i-input-number": InputNumber,
		"i-checkbox": Checkbox,
		"i-Checkbox-group": CheckboxGroup,
		'oa-file-icon': fileIcon
	},
	props: {
		data: Object,
		fruit: '',

	},
	data() {
		return {
			visible: false,
			checkAll: false,
			indeterminate: true,
			checkAllGroup: [],
			attachment: [],
		};
	},
	computed: {

	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		// this.loadLecturerData(this.data.course_id);
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		// 查看业绩设置
		handleCheckAll() {
			if (this.indeterminate) {
				this.checkAll = false;
			} else {
				this.checkAll = !this.checkAll;
			}
			this.indeterminate = false;
			if (this.checkAll) {
				this.attachment.map(ele => {
					this.checkAllGroup.push(ele.attachment_url);
					return;
				});
			} else {
				this.checkAllGroup = [];
			}
		},
		checkAllGroupChange(data) {
			if (data.length === this.attachment.length) {
				this.indeterminate = false;
				this.checkAll = true;
			} else if (data.length > 0) {
				this.indeterminate = true;
				this.checkAll = false;
			} else {
				this.indeterminate = false;
				this.checkAll = false;
			}
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			if (this.checkAllGroup.length > 0) {
				this.checkAllGroup.forEach(ele => {
					this.downloadAttachment(this.attachment[ele]);
				});
				this.visible = false;
				this.$emit('sure', 1);
			} else {
				this.$Message.error('下载前请先选择');
			}

		},
		downloadAttachment(file) {
			if (file.attachment_type == 2 || file.children.length > 0) {
				file.children.forEach(ele => {
					this.downloadAttachment(ele);
				});
			} else {
				downloadFile({ fileName: file.attachment_url });
			}
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},

	}
};
export const DownLoad = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-sale-study-video-download {
        ._title {
            height: 40px;
            background: rgb(240, 244, 252);
            line-height: 40px;
            padding-left: 60px;
            .__name {
                display: inline-block;
                margin-left: 80px;
                color: #000;
            }
        }
        ._attachment {
            height: 40px;
            background: #fff;
            line-height: 40px;
            padding-left: 60px;
        }
        ._attachment:nth-child(2n) {
            background: #fafafa;
        }
    }
</style>
