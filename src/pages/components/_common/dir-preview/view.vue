<template>
	<div class="c-dir-preview-view g-pd-lr-20">
		<slot>
			<div  
				class="g-flex g-jc-sb"
				style="padding: 18px 20px;"
			>
				<div class="g-pd-l-20">
					<h4 class="g-fs-14">{{ file.file_name }}</h4>
					<div v-if="file.is_tree" class="__module g-fs-12">
						<i class="iconfont icon-folder" />
						<span>{{ file.file_position }}</span>
					</div>
				</div>
				<div
					v-if="!isFolder && !file.is_empty && !file.is_category" 
					class=" g-flex g-ai-c g-pointer g-fs-14 g-c-blue-mid"
				>
					<vc-debounce-click
						tag="i"
						class="iconfont icon-download"
						@click="$emit('download')"
					/>
				</div>
			</div>
		</slot>
		<div class="g-relative g-col" style="overflow:auto">
			<oa-loading v-if="loading"/>
			<oa-file-fail 
				v-if="!isSupport"
				:file-type="fileType"
				:file-url="file.file_url"
				:is-delete="isDelete"
				:is-empty="isEmpty"
				:is-folder="isFolder"
				:is-big="isBig"
				:suffix="suffix"
				@download="$emit('download')"
			/>
			<oa-file-img 
				v-else-if="fileType === 'img'" 
				:file-url="file.file_url" 
				:img-data="imgList"
			/>
			<oa-file-video 
				v-else-if="fileType === 'video'"
				:file-url="file.file_url" 
			/>
			<oa-file-audio 
				v-else-if="fileType === 'audio'"
				:file-url="file.file_url"
			/>
			<oa-file-pdf 
				v-else-if="fileType === 'iframe' && suffix==='pdf'"
				:file-url="file.file_url" 
			/>
			<div
				v-else-if="fileType === 'iframe'"
				style="height:100%;"
			>
				<iframe
					:src="'https://view.officeapps.live.com/op/view.aspx?src='+file.file_url"
					scrolling="auto" 
					width="100%" 
					height="100%"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import Loading from '@components/_common/loading/loading';
import FilePreview from '@common/file-preview/file-preview';

import { FileVideo } from './toolkit/file-video';
import { FileAudio } from './toolkit/file-audio';
import { FilePdf } from './toolkit/file-pdf';
import { FileImg } from './toolkit/file-img';
import { FileFail } from './toolkit/file-fail';
import { FileIcon } from './toolkit/file-icon';

const supportFileType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pdf', 'mp4', 'mp3'];
export const imgTypes = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
const iframeTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pdf'];
const videoTypes = ['mp4'];
const audioTypes = ['mp3'];

export default {
	name: 'oa-toolkit-view',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-file-preview': FilePreview,
		'oa-file-video': FileVideo,
		'oa-file-audio': FileAudio,
		'oa-file-pdf': FilePdf,
		'oa-file-img': FileImg,
		'oa-file-fail': FileFail,
		'oa-file-icon': FileIcon,
		'oa-loading': Loading
	},
	props: {
		data: {
			type: [Object, Array],
			default: () => ({
				id: 1,
				material_id: 1,
				is_folder: false,
				file_name: 'file name',
				file_url: '',
				file_type: '',
				file_size: '10kb',
				is_delete: '',
				is_empty: '',
				file_position: '',
				is_tree: ''
			})
		},
		formater: Function,
		imgList: Array
	},
	data() {
		return {
			loading: false
		};
	},
	computed: {
		file() {
			if (!this.data) {
				return { is_empty: true }; 
			}
			if (this.formater) {
				return this.formater(this.data);
			}
			return this.data;
		},
		suffix() {
			if (!this.file.file_url) return '';
			const strs = this.file.file_url.split('.');
			return strs[strs.length - 1].toLowerCase();
		},
		fileType() {
			if (imgTypes.includes(this.suffix)) {
				return 'img';
			} else if (iframeTypes.includes(this.suffix)) {
				return 'iframe';
			} else if (videoTypes.includes(this.suffix)) {
				return 'video';
			} else if (audioTypes.includes(this.suffix)) {
				return 'audio';
			} else return 'unknow';
		},
		isEmpty() {
			return !this.file.file_url;
		},
		isFolder() {
			return this.file.is_folder;
		},
		isDelete() {
			return this.file.is_delete;
		},
		isBig() {
			return this.fileType == 'iframe' && this.suffix !== 'pdf' && this.file.original_file_size > 10 * 1024 * 1024;
		},
		isSupport() {
			return supportFileType.includes(this.suffix) && !this.isEmpty && !this.isFolder && !this.isDelete && !this.isBig;
		},
	}
};
</script>
<style lang="scss">
.c-dir-preview-view {
	background-color: #fff;
	display: flex;
	flex-direction: column;
}
</style>