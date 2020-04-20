<template>
	<div class="hr-score-leadin">
		<div class="g-relative">
			<div class="_display">
				<div class="g-flex g-jc-c g-ai-c g-fd-c">
					<div class="_img g-m-b-10">
						<img :src="OSS_UPLOAD01" style="height: 80px; width: 80px;">
					</div>
					<span style="fontSize: 16px; color: #000;">
						<span style="color: #E74854;">点击上传</span>
						或拖拽文件至此处上传</span>
					<div style="color: #999; fontSize: 12px" class="g-m-t-10">
						支持文件扩展名：xls,xlsx,请使用Excle2003以上版本编辑
					</div>
				</div>
			</div>
			<input
				ref="input"
				type="file"
				style="opacity: 0; height: 400px; width: 800px; position: absolute; left: 0; top: 0;"
				@change="handleChange">
		</div>
		<div class="g-m-t-10">
			点击此处
			<span class="g-operation" @click="handleExport">下载模板</span>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { OSS_UPLOAD01 } from '@constants/constants';
import { formatMoment, getItem, getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: '',
	components: {
	},
	props: {
		cate: String,
	},
	data() {
		return {
			file: [],
			OSS_UPLOAD01
		};
	},
	methods: {
		handleChange() {
			const excelType = ['xls', 'xlsx'];
			const file = this.$refs.input.files[0];
			const type = file.name.split('.').pop();
			if (!excelType.includes(type)) {
				this.$Message.error('请上传正确文件格式');
				return;
			}
			this.handleLead(file);
		},
		handleLead(file) {
			const data = new FormData();
			data.append('file', file);
			data.append('cate', this.cate);
			fetch(API_ROOT._HR_EMPLOYEE_SCORE_INTEGRATION_MAIN_POST, {
				method: 'post',
				body: data,
				headers: {
					'-token': getItem(`staff_${this.$global.version}`).token
				},
				credentials: 'include'
			}).then(async (res) => {
				const { data: { has_error, ...rest }, status, msg } = await res.json();
				if (status) {
					this.handleJump(has_error, rest, msg);
				} else {
					this.$Message.error(msg);
				}
			}).catch(err => {
				this.$Message.error('上传失败');
			});
		},
		handleJump(error, rest, msg) {
			this.$emit('jump', {
				target: error ? 1 : 2,
				...rest,
				msg
			});
		},
		handleExport() {
			let url = this.cate === '1' 
				? 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190618/1560845820801/积分导入模板.xlsx'
				: 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190619/1560910221023/学分导入模板.xlsx';
			window.open(getHashUrl(url, {
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};
</script>

<style lang="scss">
.hr-score-leadin {
	width: 800px;

	._display {
		height: 400px;
		// border-radius: 4px;
		// border: 1px solid #D9DCE0;
		padding: 20px;
		background: #f5f5f6;
		display: flex;

		._img {
			width: 180px;
			height: 180px;
			border-radius: 50%;
			background: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		& > div {
			flex: 1;
			// border: 1px dashed #D9DCE0;
		}
	}
}
</style>


