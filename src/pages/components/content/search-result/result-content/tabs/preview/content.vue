<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:footer-hide="true"
			:mask-closable="false"
			class-name="v-search-result-preview-content"
			fullscreen
		>
			<div slot="header" class="g-tc">
				<span v-html="datas.material_name"/>
			</div>
			<div ref="setoolkit" class="v-setoolkit-box">
				<div class="_right">
					<div class="__content">
						<oa-file-img 
							v-if="datas.file_type == 3" 
							:file_url="datas.file_url" 
						/>

						<oa-file-pdf 
							v-else-if="datas.file_type == 6"
							:file_url="datas.file_url" 
						/>
						<div
							v-else-if="datas.file_type == 2 && datas.file_url"
							style="height:100%;"
						>
							<iframe 
								v-if="Number(datas.file_size) < 10 * 1024 * 1024"
								:src="'https://view.officeapps.live.com/op/view.aspx?src='+datas.file_url"
								scrolling="auto" 
								width="100%" 
								height="100%"
							/>
							<oa-file-fail 
								v-else
								:file_url="datas.file_url"
								:material_id="datas.material_id + ''"
							/>
						</div>
						<oa-file-video 
							v-else-if="datas.file_type == 4"
							:file_url="datas.file_url" 
						/>

						<oa-file-audio 
							v-else-if="datas.file_url.indexOf('mp3')!=-1"
							:file_url="datas.file_url" />
						<oa-file-fail 
							v-if="datas.file_type == 1 || !datas.file_type" 
							:file_url="datas.file_url"
							:material_id="datas.material_id + ''"
						/>
					</div>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { CreatePortal, ImgsPreview } from 'wya-vc';
import { Modal } from 'iview';
import API_ROOT from "@stores/apis/root";
import { FileVideo } from './file-video';
import { FileAudio } from './file-audio';
import { FilePdf } from './file-pdf';
import { FileImg } from './file-img';
import { FileFail } from './file-fail';

export default {
	name: 'oa-tpl',
	components: {
		'i-modal': Modal,
		'oa-file-video': FileVideo,
		'oa-file-audio': FileAudio,
		'oa-file-pdf': FilePdf,
		'oa-file-img': FileImg,
		'oa-file-fail': FileFail
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			material_id: '', // 文件id
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
	},
};
export const PreviewModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
	.v-setoolkit-box {
		height: 100%;
		overflow: auto;
		._right {
			width: 100%;
			height: 100%;
			.__module {
				color: #999;
			}
			.__content {
				height: 100%;
			}
		}
	}
	.v-search-result-preview-content {
		.ivu-modal-fullscreen .ivu-modal-body {
			top: 30px;
			max-height: 100%;
		}
	}
</style>
