<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="数据导入"
		class="v-hr-academy-transfer-statistic-input-modal"
		width="400"
	>

		<div class="g-fs-14 g-flex g-ai-c _content">
			<div class="g-absolute g-fs-12" style="top: 88px;color: #bbb">(上传文件为EXCEL文件)</div>
			<span class="g-m-r-10 g-lh-32">请选择导入文件：</span>
			<label v-if="!file.length" for="input">
				<span class="_upload">选择文件</span>
			</label>
			<input
				id="input"
				ref="input"
				type="file"
				@change="handleChange" >

			<div v-if="file.length" style="width: 240px" class="g-fs-12">
				{{ file[0].name.length > 20 ? file[0].name.slice(0, 20) + '...' : file[0].name }}
				<span class="g-fr g-pointer g-c-blue-mid" @click="handleDelete">删除</span>
			</div>
		</div>


		<div slot="footer" class="_footer">
			<div class="g-absolute g-c-blue-mid g-pointer g-lh-32 _download" @click="handleDownload">下载导入模板</div>
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" class="g-red-btn-small" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Button, Modal, DatePicker, Form, FormItem, Input } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment, getItem, getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: "hr-academy-transfer-statistic-input-modal",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-input": Input,
		"vc-copy": Copy,
	},
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			file: [],
		};
	},
	computed: {},
	// watch
	mounted() {
		this.visible = true;
	},
	methods: {
		handleChange(e) {
			const excelType = ['xls', 'xlsx'];
			const file = this.$refs.input.files['0'];
			const type = file.name.split('.').pop();
			if (!excelType.includes(type)) {
				this.$Message.error('请上传正确文件格式');
				return;
			}
			this.file.push(file);
		},
		handleDelete() {
			this.file = [];
		},
		// 下载
		handleDownload() {
			const url = getHashUrl(API_ROOT['HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_OUTPUT_GET'], {
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			let data = new FormData();
			data.append('file', this.file[0]);
			this.$refs.modal.buttonLoading = false;
			fetch(API_ROOT.HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_INPUT_GET, {
				method: 'post',
				body: data,
				headers: {
					'-token': this.$global.token,
				},
				credentials: 'include'
			}).then(async (res) => {
				this.$emit("sure");
				const { msg } = await res.json();
				this.$Message.success(msg);
			}).catch(err => {
				this.$Message.error('上传失败');
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const inputPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-statistic-input-modal {
	._content {
		margin-bottom: 65px;
		#input {
			display: none;
		}
		._upload {
			display: inline-block;
            line-height: 32px;
            width: 80px;
            text-align: center;
            height: 32px;
            background: #fafafa;
            border: 1px solid #d4d7d8 !important;
            color: #000000;
            border-radius: 4px;

            &:hover{
                color: #d9444f;
                border: 1px solid #d9444f !important;
            }
		}
	}
}
</style>

