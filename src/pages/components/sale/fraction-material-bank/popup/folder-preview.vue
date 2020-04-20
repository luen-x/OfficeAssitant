<template>
	<div class="v-sale-material-folder-preview g-relative">
		<oa-loading v-if="loading"/>
		<div v-else style="height: 100%;">
			<oa-file-fail 
				v-if="fileType === 1 || !fileType" 
				:file-type="fileType || 0"
				:file-url="fileUrl"
				:can-look="1"
				:is-folder-empty="isFolderEmpty"
				:material-id="materialId"
			/>
			<div
				v-else-if="fileType === 2 && fileUrl"
				style="height:100%;"
			>
				<iframe 
					v-if="+fileSize < 10 * 1024 * 1024"
					:src="'https://view.officeapps.live.com/op/view.aspx?src='+fileUrl"
					scrolling="auto" 
					width="100%" 
					height="100%"
				/>
				<oa-file-fail 
					v-else
					:file-type="fileType"
					:file-url="fileUrl"
					:can-look="1"
					:material-id="materialId"
					:is-big="true"
				/>
			</div>
			<oa-file-img 
				v-else-if="fileType === 3" 
				:file-url="fileUrl" 
				:img-data="[fileUrl]"
			/>
			<oa-file-video 
				v-else-if="fileType === 4"
				:file-url="fileUrl" 
			/>
			<oa-file-audio 
				v-else-if="fileType === 5"
				:file-url="fileUrl"
			/>
			<oa-file-pdf 
				v-else-if="fileType === 6"
				:file-url="fileUrl" 
			/>
		</div>
	</div>
</template>
<script>
import { FileVideo } from '../../_common/fraction/_common/file-video';
import { FileAudio } from '../../_common/fraction/_common/file-audio';
import { FilePdf } from '../../_common/fraction/_common/file-pdf';
import { FileImg } from '../../_common/fraction/_common/file-img';
import { FileFail } from '../../_common/fraction/_common/file-fail';

export default {
	name: 'oa-material-folder-preview',
	components: {
		'oa-file-video': FileVideo,
		'oa-file-audio': FileAudio,
		'oa-file-pdf': FilePdf,
		'oa-file-img': FileImg,
		'oa-file-fail': FileFail,
	},
	props: {
		loading: Boolean,
		isFolderEmpty: Boolean,
		fileType: [String, Number],
		materialId: [String, Number],
		fileSize: [String, Number],
		fileUrl: String,
	},
	data() {
		return {

		};
	},
	methods: {

	}
};

export const FractionMaterialFolderPreview = module.exports.default;
</script>
<style lang="scss">
.v-sale-material-folder-preview {
	height: 100%;
}
</style>
