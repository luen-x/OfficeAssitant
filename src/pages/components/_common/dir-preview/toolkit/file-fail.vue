<template>
	<div class="v-sale-fail-content g-flex g-fd-c g-jc-c g-ai-c">
		<div 
			v-if="isDelete" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览已删除的文件!</span>
			</div>
		</div>
		<div
			v-else-if="isEmpty" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_NO_MESSAGE08" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>请选择文件进行预览</span>
			</div>
		</div>
		<div
			v-else-if="isFolder" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览文件夹</span>
			</div>
		</div>
		<div 
			v-else-if="fileType=='unknow'" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览{{ suffix }}格式的文件，请</span>
				<span 
					class="g-pointer" 
					style="color:#2397f9;"
					@click="$emit('download')"
				>
					下载
				</span>
			</div>
		</div>
		<div 
			v-else-if="isBig" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览大于等于10M的{{ suffix }}文件，请</span>
				<span 
					class="g-pointer" 
					style="color:#2397f9;"
					@click="$emit('download')"
				>
					下载
				</span>
			</div>
		</div>
		<div 
			v-else-if="fileType=='video'" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览{{ suffix }}格式的视频，请</span>
				<span 
					class="g-pointer" 
					style="color:#2397f9;"
					@click="$emit('download')"
				>
					下载
				</span>
				<span>进行播放</span>
			</div>
		</div>
		<div 
			v-else-if="fileType === 'audio'" 
			class="g-flex g-fd-c g-jc-c g-ai-c _box"
		>
			<img :src="OSS_SEARCH_CUSTOMER" alt="" class="__img">
			<div class="g-fs-14 g-m-t-10 g-flex">
				<span>目前暂不支持预览{{ suffix }}格式的音频，请</span>
				<span 
					class="g-pointer" 
					style="color:#2397f9;"
					@click="$emit('download')"
				>
					下载
				</span>
				<span>进行播放</span>
			</div>
		</div>
	</div>
</template>

<script>
import { getHashUrl } from '@utils/utils';
import downloadFile from '@utils/download';
import { OSS_SEARCH_CUSTOMER, OSS_NO_MESSAGE08 } from "@constants/constants";

export default {
	name: 'oa-file-fail',
	props: {
		fileType: String,
		fileUrl: String,
		isDelete: [String, Number],
		isEmpty: Boolean,
		isBig: Boolean,
		isFolder: Boolean,
		suffix: String
	},
	data() {
		return {
			OSS_NO_MESSAGE08,
			OSS_SEARCH_CUSTOMER
		};
	},
	computed: {
		
	},
	methods: {
		
	}
};

export const FileFail = module.exports.default;
</script>

<style lang="scss">
.v-sale-fail-content {
	width: 100%;
	height: 100%;
	._box {
		height: 100%;
		.__img {
			width: 230px;
		}
	}
}
</style>
