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
			<span class="g-m-r-10 g-lh-32 g-m-l-20">导入文件：</span>
			<label v-if="!file.length" for="input">
				<span class="_upload">
					<i class="iconfont icon-folder"/>
					<span>请添加文件</span>
				</span>
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
		
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			let data = new FormData();
			data.append('file', this.file[0]);
			this.$refs.modal.buttonLoading = false;
			fetch(API_ROOT._HR_MENTOR_RELATION_IMPORT_POST, {
				method: 'post',
				body: data,
				headers: {
					'-token': this.$global.token,
					type: this.type
				},
				credentials: 'include'
			}).then(async (res) => {
				this.visible = false;
				const { msg, status } = await res.json();
				this.$Message[status ? 'success' : 'error'](msg);
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
			padding:4px 8px;
            text-align: center;
            background: #fafafa;
            border: 1px solid #d4d7d8 !important;
            color: #4B4F57;
            border-radius: 4px;
            &:hover{
                color: #d9444f;
                border: 1px solid #d9444f !important;
            }
		}
	}
	._download{
		left:40px;
	}
}
</style>

