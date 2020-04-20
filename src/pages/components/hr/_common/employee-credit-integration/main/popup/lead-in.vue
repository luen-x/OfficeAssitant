<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
	>
		<div slot="header" class="g-tc">
			数据导入
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			class="g-p-l-20"
		>
			<i-formitem label="导入文件">
				<div class="g-flex g-ai-c _upload">
					<i class="icon iconfont icon-folder g-fs-14" />
					<span class="g-m-l-5">请添加文件</span>
					<input
						ref="input"
						type="file"
						style="opacity: 0; height: 32px; width: 100px; position: absolute; left: 0"
						@change="handleChange" >
				</div>
				<div v-if="file.length" style="width: 240px" class="g-fs-12">
					{{ file[0].name.length > 20 ? file[0].name.slice(0, 20) + '...' : file[0].name }}
					<span class="g-fr g-pointer g-c-blue-mid" @click="handleDelete">删除</span>
				</div>
			</i-formitem>
		</i-form>
		<div slot="footer" class="_footer">
			<div 
				class="g-absolute g-c-blue-mid g-pointer g-lh-32 _download" 
				style="padding-left: 36px"
				@click="handleExport">下载导入模板</div>
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" class="g-red-btn-small" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker, Button } from 'iview';
import { CreatePortal, Upload } from 'wya-vc';
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { formatMoment, getItem, getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: 'hr-check-lead-in',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'vc-upload': Upload,
		'i-button': Button
	},
	props: {
		isEdit: Boolean,
		cate: Number
	},
	data() {
		return {
			visible: false,
			file: [],
			formdata: {},
			show: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			const item = this.file.length;
			if (!item) {
				this.$Message.error('请先添加文件');
			} else {
				const data = new FormData();
				data.append('file', this.file[0]);
				fetch(API_ROOT._HR_EMPLOYEE_SCORE_INTEGRATION_MAIN_POST, {
					method: 'post',
					body: data,
					headers: {
						'-token': getItem(`staff_${this.$global.version}`).token
					},
					credentials: 'include'
				}).then(async (res) => {
					const { msg, status } = await res.json();
					this.$Message[status ? 'success' : 'error'](msg);
					this.$emit('sure');
				}).catch(err => {
					console.error(err);
					this.$Message.error('上传失败');
				});
			} 
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleExport() {
			let url = this.cate === 1 
				? 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190618/1560845820801/积分导入模板.xlsx'
				: 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190619/1560910221023/学分导入模板.xlsx';
			window.open(getHashUrl(url, {
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleChange() {
			const excelType = ['xls', 'xlsx'];
			const file = this.$refs.input.files[0];
			const type = file.name.split('.').pop();
			if (!excelType.includes(type)) {
				this.$Message.error('请上传正确文件格式');
				return;
			}
			this.file.push(file);
		},
		handleDelete() {
			this.file = [];
		}
	}
};
export const LeadInModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
._upload {
	display: inline-block;
    line-height: 32px;
	width: 100px;
	position: relative;
	text-align: center;
	height: 32px;
    background: #fafafa;
	border: 1px solid #d4d7d8 !important;
    color: #000000;
	border-radius: 4px;
	cursor: pointer;

    &:hover{
        color: #d9444f;
        border: 1px solid #d9444f !important;
    }
}
</style>