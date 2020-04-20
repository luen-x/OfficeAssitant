<template>
	<div class="c-upload">
		<vc-upload
			v-show="!disabled && (data.length < max || max === 0)"
			v-bind="uploadOpts"
			:disabled="disabled"
			mode="files"
			@error="handleError"
			@file-start="handleFileStart"
			@file-progress="handleFileProgress"
			@file-success="handleFileSuccess"
			@file-error="handleFileError"
			@complete="handleFileComplete"
		>
			<slot name="trigger" >
				<div
					class="g-m-b-15 __btn"
					style="display: inline-block;"
				>
					<div class="g-flex-ac">
						<i class="iconfont icon-upload g-fs-18 g-m-r-5" />
						<span class="g-fs-12">上传</span>
					</div>
				</div>
			</slot>
		</vc-upload>
		<div v-if="placeholder && data.length==0" class="g-c-black4 g-fs-12">{{ placeholder }}</div>
		<slot :files="data">
			<div class="g-flex g-fw-w">
				<div
					v-for="(item, index) in data"
					:key="index"
					:class="`${item.error_time || item.retcode == 0 ? '_error' : ''}`"
					class="_item g-c-black4 g-flex-cc g-fd-c"
				>
					<div
						:class="`${item.error_time || item.retcode == 0 ? '__error' : ''}`"
						class="__thumbnail"
					>
						<p v-if="item.error_time || item.retcode == 0">
							上传失败
						</p>
						<template v-else>
							<div v-if="item.percent && item.percent != 100" class="__pc-bg">
								<div :style="{width: item.percent + '%'}" class="__progress"/>
							</div>
							<p v-else-if="!item.url && item.percent == 100" class="g-pd-10">服务器正在接收...</p>
							<template v-else>
								<!-- 具体内容 -->
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
						</template>
						<div v-if="item.url || item.error_time || item.retcode == 0" class="__mask">
							<i
								v-if="!disabled || canDel"
								class="iconfont icon-close __close"
								@click="handleDel(item)"
							/>
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
			</div>
		</slot>
	</div>
</template>

<script>
import { Upload, ImgsPreview } from 'wya-vc';
import { getHashUrl } from '@utils/utils';
import downloadFile from '@utils/download';
import API_ROOT from '@stores/apis/root';
import FileType, { defaultType } from './file-type';
import { FilePreview } from '../file-preview/file-preview';

export default {
	name: "oa-upload",
	components: {
		'vc-upload': Upload
	},
	model: {
		prop: 'dataSource',
		event: 'change'
	},
	props: {
		dataSource: {
			type: Array, // url
			default() {
				return [];
			},
		},
		max: {
			type: Number,
			default: 0
		},
		disabled: {
			type: Boolean,
			default: false
		},
		canDel: Boolean,
		upload: {
			type: Object,
			default() {
				return {
					accept: '.doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .png, .jpg, .jpeg, .gif, .zip, .rar, .avi, .mp3, .mp4,.m4a, .mpeg, .rmvb, text/plain',   // eslint-disable-line
					multiple: true,
					max: 10,
					size: 200
				};
			}
		},
		placeholder: String
	},
	data() {
		return {
			data: this.dataSource, // url数组(必须是字符串数组)
			files: this.getFiles(this.dataSource),
			fileType: FileType,
			defaultType,
			uploadOpts: this.upload,
			noPreview: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar', 'avi', 'm4a', 'rmvb', 'text/plain']
		};
	},
	computed: {
	},
	watch: {
		dataSource(val) {
			this.data = val;
			this.files = this.getFiles(val);
		},
		inProgeress() {
			files;

		}
	},
	methods: {
		getFiles(urls) {
			const result = urls.map(url => {
				if (typeof url === 'string') {
					let arr = url.split('/');
					const name = arr[arr.length - 1] || '';
					arr = name.split('.');
					let suffix = arr[arr.length - 1] || '';
					suffix && (suffix = '.' + suffix);
					return {
						url,
						name,
						suffix,
						type: FileType[suffix].type,
						color: FileType[suffix].color,
						state: 1, // 0-上传中，1-上传成功，2-上传失败，
						percent: 100
					};
				} else {
					return undefined;
				}
			});
		 return result.filter(Boolean);
		},
		formatType(item) {
			return this.fileType[(item.type || '').toLowerCase()] || {};
		},
		handleError(error) {
			this.$Message.error(error.msg);
		},
		setData(dataSource) {
			if (dataSource === this.data) return;
			this.data = dataSource;
			this.dispatch('FormItem', 'on-form-change', dataSource);
		},
		handleFileStart(res) {
			res.title = res.name;
			this.data = [...this.data, res];
			if (this.uploadOpts.multiple) {
				let max = this.uploadOpts.max - 1;
				this.uploadOpts.max = max >= 0 ? max : 0;
			}
		},
		handleFileProgress(e, file) {
			if (parseInt(e.percent, 10) <= 100) {
				this.data = this.data.map((item) => {
					if (file.uid === item.uid) {
						return {
							...item,
							percent: e.percent
						};
					}
					return item;
				});
			}
		},
		handleFileSuccess(res, file) {
			let { max, data, getParse } = this;
			// let value = [...data, getParse ? getParse(res) : res.data];
			let dataSource;
			dataSource = data.map((item) => {
				if (item.uid === file.uid) {
					return {
						...item,
						...res.data
					};
				}
				return item;
			});
			this.$emit('change', dataSource);
		},
		handleFileError(res, file) {
			this.$Message.warning(res.msg);
			let { max, data, getParse } = this;
			// let value = [...data, getParse ? getParse(res) : res.data];
			let dataSource;
			dataSource = data.map((item) => {
				if (item.uid === file.uid) {
					return {
						...item,
						...res,
						error_time: new Date().getTime()
					};
				}
				return item;
			});
			this.$emit('change', dataSource);
			this.$emit('error', res);
		},
		handleFileComplete(res) {
			this.$emit('complete', res);
		},
		handleDownload(url) {
			downloadFile({
				fileName: url
			});
		},
		handlePreview(e, item) {
			let type = this.formatType(item).type;
			if (type === 'image') {
				let pos = {};
				try {
					const target = e.target; // 先得到pos, 否则getThumbBoundsFn再计划，target已变化
					const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
					const rect = target.getBoundingClientRect();
					pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
				} catch (error) {
					console.error(error);
				}
				this.$emit('preview-start');
				ImgsPreview.popup({
					visible: true,
					dataSource: [item.url],
					opts: {
						index: 0,
						history: false,
						getThumbBoundsFn: (index) => pos
					}
				}).then(() => {

				}).catch(() => {
				}).finally(() => {
					this.$emit('preview-end');
				});
			} else {
				this.$emit('preview-start');
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
			}

		},
		async handleDel(item) {
			let { data, max, getParse, $listeners: { "del-before": delBefore } } = this;
			let before = delBefore && await delBefore(item.file_id);

			if (delBefore && !before) return;

			// if (max !== 0 && data.length > max) {
			// 	this.$emit('error', {
			// 		status: 0,
			// 		msg: '超出上传限制'
			// 	});
			// 	return;
			// }
			let dataSource = data.filter(_item => {
				return _item.uid !== item.uid || _item.error_time != item.error_time;
			});
			this.$emit('change', dataSource);
			if (this.uploadOpts.multiple) {
				this.uploadOpts.max = this.uploadOpts.max + 1;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.c-upload {
	box-sizing: border-box;
	._item {
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
