<template>
	<div class="c-components-common-files-preview">
		<div class="__thumbnail">
			<template>
				<img v-if="formatType(item).type === 'image'" :src="`${item.url}!4-4`">
				<i
					v-else-if="!formatType(item).type"
					style="color: #2397f9"
					class="iconfont icon-weizhi g-fs-40"
				/>
				<i
					v-else
					:class="`icon-${formatType(item).type}`"
					:style="`color: ${formatType(item).color}`"
					class="iconfont g-fs-40"
				/>
			</template>
			<div class="__mask">
				<template v-if="!item.error_time && item.retcode != 0">
					<template v-if="noPreview.indexOf(formatType(item).type) == -1 && formatType(item).type">
						<i
							class="iconfont icon-preview"
							@click="handlePreview($event, item)"
						/>
						<i class="iconfont icon-vertical-line"/>
					</template>
					<i
						class="iconfont icon-download"
						@click="handleDownload(item.url)"
					/>
				</template>
			</div>
		</div>
		<div class="g-m-t-10 _title">
			<div
				:title="item.title"
				class="g-oneline g-tc __name"
			>
				{{ item.title }}
			</div>
		</div>
	</div>
</template>
<script>
import { Upload, ImgsPreview, CreatePortal } from 'wya-vc';
import downloadFile from '@utils/download';
import FileType, { defaultType } from '../upload/file-type';
import { FilePreview } from '../file-preview/file-preview';

export default {
	name: 'oa-files-preview',
	props: {
		data: Object
	},

	data() {
		return {
			item: {
				original: "1542288773(1).png",
				size: 28597,
				state: "SUCCESS",
				title: "1542288773(1).png",
				type: ".png",
				url: "https://oss.ruishan666.com/image/oa/190723/889161157731/1542288773(1).png",
			},
			fileType: FileType,
			noPreview: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar', 'avi', 'm4a', 'rmvb', 'text/plain']
		};
	},
	mounted() {

	},
	methods: {
		formatType(item) {
			return this.fileType[item.type.toLowerCase()] || {};
		},
		handlePreview(e, item) {
			FilePreview.popup({
				data: {
					fileUrl: item.url,
					x: e.clientX,
					y: e.clientY
				}
			}).then((res) => {

			}).catch((err) => {

			}).finally(() => {
				this.$emit('preview-end');
			});
		},
		handleDownload(url) {
			downloadFile({
				fileName: url
			});
		},
	}
};
export const FilesPreview = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.c-components-common-files-preview{
	box-sizing: border-box;
	width: 75px;
	margin: 0 10px 10px 0;
	.__name {
		word-break: break-all;
	}
	.__thumbnail {
		position: relative;
		width: 72px;
		height: 72px;
		line-height: 1;
		border: 1px solid #d4d7db;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			width: 100%;
			height: 100%;
		}
		.__pc-bg {
			flex: 1;
			background-color: #cdcdcd;
			height: 8px;
			border-radius: 5px;
			overflow: hidden;
			margin: 0 4px;
			.__progress {
				display: block;
				margin: 0;
				background-color: #4fc43d;
				height: 8px;
				border-radius: 5px;
			}
		}
	}
	._title {
		line-height: 1.3;
	}
	.__btn {
		display: block;
		height: 32px;
		line-height: 32px;
		padding: 0 15px;
		background-color: #fafafa;
		color: #999999;
		border-radius: 4px;
		border: 1px solid #d4d7d8;
		font-size: 14px;
		text-align: center;
		white-space: nowrap;
		user-select: none !important;
		cursor: pointer;
		&:hover {
			border: 1px solid #e84c57;
			color: #e84c57;
		}
		&:active {
			border: 1px solid #d9444f;
			color: #d9444f;
		}
	}
	.__thumbnail:hover .__mask {
		transition: opacity 0.5s;
		opacity: 1;
	}
	.__mask {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		& > i {
			cursor: pointer;
		}
		.__close {
			position: absolute;
			top: 2px;
			right: 2px;
			font-size: 12px;
		}
	}
	._error {
		color: #e61212 !important;
		.__error {
			border: 1px solid #e61212 !important;
		}
	}
}
</style>
