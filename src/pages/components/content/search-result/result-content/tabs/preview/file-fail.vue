<template>
	<div class="v-file-content">
		<div 
			class="g-flex-cc g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-18 g-m-t-10 g-flex">
				<span>此文件过大或类型不支持预览，请</span>
				<span 
					class="g-pointer" 
					style="color: #2397f9;"
					@click="handleDownload"
				>
					下载
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import { OSS_SEARCH_CUSTOMER } from "@constants/constants";

export default {
	name: 'oa-file-fail',
	components: {
	},
	props: {
		file_url: String,
		material_id: String
	},
	data() {
		return {
			OSS_SEARCH_CUSTOMER
		};
	},
	computed: {
		// file_format: {
		// 	set(value) {
		// 		this.file_url = value;
		// 	},
		// 	get() {
		// 		let arr = this.file_url.split('.');
		// 		const len = arr.length;
		// 		return arr[len - 1];
		// 	}
		// }
	},
	created() {
	},
	methods: {
		/**
		 * 文件下载
		 */
		handleDownload() {
			this.$request({
				url: "_TOOLKIT_DOWNLOAD_RECORD_LIMIT_POST",
				type: "GET",
				param: {
					download_num: 1,
					material_type: 4
				},
				loading: false,
			}).then(res => {
				downloadFile({
					fileName: this.file_url,
					downRecordParams: {
						material_ids: [this.material_id],
						type: 4
					}
				});
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	},
};

export const FileFail = module.exports.default;
</script>

<style lang="scss" scoped>
	.v-file-content {
		width: 100%;
		height: 100%;
		._box {
		height: 100%;
		.__img {
			width: 200px;
			height: 200px;
		}
	}
	}
</style>
