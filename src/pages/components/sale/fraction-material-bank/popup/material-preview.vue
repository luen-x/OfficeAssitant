<template>
	<div class="v-sale-material-preview g-relative">
		<oa-loading v-if="loading"/>
		<div v-else style="height: 100%">
			<oa-file-fail 
				v-if="fileType === 1 || !fileType || isDelete === 1 || isEmpty || isFolderEmpty || !canLook || previewSubMenu" 
				:file-type="fileType || 0"
				:file-url="fileUrl"
				:is-delete="isDelete"
				:is-empty="isEmpty"
				:is-folder-empty="isFolderEmpty"
				:preview-sub-menu="previewSubMenu"
				:material-id="materialId"
				:can-look="canLook"
				:file-name="fileName"
			/>
			<div
				v-else-if="fileType === 2 && fileUrl && isDelete !== 1 && canLook"
				style="height:100%;"
			>
				<iframe 
					v-if="+fileSize < 10 * 1024 * 1024"
					:src="'https://view.officeapps.live.com/op/view.aspx?src=' + fileUrl"
					scrolling="auto" 
					width="100%" 
					height="100%"
				/>
				<oa-file-fail 
					v-else 
					:file-type="fileType"
					:file-url="fileUrl"
					:is-delete="isDelete"
					:is-big="true"
					:material-id="materialId"
				/>
			</div>
			<oa-file-img 
				v-if="canLook && fileType === 3 && isDelete !== 1"
				:file-url="fileUrl"
				:img-data="[fileUrl]"
			/>
			<oa-file-video 
				v-else-if="canLook && fileType === 4 && isDelete !== 1"
				:file-url="fileUrl" 
			/>
			<oa-file-audio 
				v-else-if="canLook && fileType === 5 && isDelete !== 1 && fileUrl"
				:file-url="fileUrl"
			/>
			<oa-file-pdf 
				v-else-if="canLook && fileType === 6 && isDelete !== 1"
				:file-url="fileUrl" 
			/>
		</div>
	</div>
</template>
<script>
import Loading from '@components/_common/loading/loading';
import { FileVideo } from '../../_common/fraction/_common/file-video';
import { FileAudio } from '../../_common/fraction/_common/file-audio';
import { FilePdf } from '../../_common/fraction/_common/file-pdf';
import { FileImg } from '../../_common/fraction/_common/file-img';
import { FileFail } from '../../_common/fraction/_common/file-fail';

export default {
	name: 'oa-material-preview',
	components: {
		'oa-loading': Loading,
		'oa-file-video': FileVideo,
		'oa-file-audio': FileAudio,
		'oa-file-pdf': FilePdf,
		'oa-file-img': FileImg,
		'oa-file-fail': FileFail,
	},
	props: {
		loading: Boolean,
		canLook: [String, Number],
		fileType: [String, Number],
		isDelete: [String, Number],
		materialId: [String, Number],
		fileSize: [String, Number],
		fileUrl: String,
		fileName: String,
		isEmpty: Boolean,
		isFolderEmpty: Boolean,
		previewSubMenu: Boolean
	},
	data() {
		return {

		};
	},
	methods: {

	}
};

export const FractionMaterialPreview = module.exports.default;
</script>
<style lang="scss">
.v-sale-material-preview {
	height: 100%;
}
</style>
