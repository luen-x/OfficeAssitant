<template>
	<div
		class="hr-image-preview"
		style="display: flex; flex-wrap: wrap"
	>
		<div
			v-for="(item, index) in dataSource"
			:key="index"
			class="__item"
		>
			<img v-if="getIcon(item).type === 'image'" :src="getImage(item)" v-bind="attrs">
			<!-- <i
				v-else-if="!getIcon(item).type"
				style="color: #2397f9"
				class="iconfont icon-weizhi g-fs-40"
			/> -->
			<i
				v-else
				:class="`icon-${getIcon(item).type}`"
				:style="`color: ${getIcon(item).color}; display: inline-block;
				 width: 72px; textAlign: center; lineHeight: 72px;`"
				class="iconfont g-fs-40"
			/>
			<div class="__mask">
				<template v-if="noPreview.every(info => info !== formatType(item))">
					<i
						class="iconfont icon-preview"
						@click="handlePreview"
					/>
					<i class="iconfont icon-vertical-line"/>
				</template>
				<i
					class="iconfont icon-download"
					@click="downloadFile({ fileName: getImage(item) })"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import downloadFile from '@utils/download';
import FileType, { defaultType } from '@components/_common/upload/file-type';
import { ImagePreview } from './popup/image-modal';

export default {
	name: "hr-image-preview",
	props: {
		dataSource: Array,
		attrs: {
			type: Object,
			default: () => ({ width: 72, height: 72 })
		}
	},
	data() {
		return {
			FileType,
			noPreview: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 
				'pdf', 'zip', 'rar', 'avi', 'm4a', 'rmvb', 'text/plain', 'mp4', 'mp3']
		};
	},
	created() {
		this.downloadFile = downloadFile;
	},
	methods: {
		getImage(a) {
			return a.url || a;
		},
		getIcon(item) {
			let type = '.' + this.formatType(item);
			return this.FileType[type];
		},
		formatType(item) {
			let url = this.getImage(item);
			let type = url.split('.').reverse()[0] || '';
			return type.toLocaleLowerCase();
		},
		handlePreview(e) {
			let imgType = ['png', 'jpg', 'jpeg', 'gif'];
			let imgs = this.dataSource.filter(item => {
				let type = this.formatType(item);
				return imgType.some(info => info === type);
			});
			ImagePreview.popup({
				dataSource: imgs
			}).then(res => {

			}).catch(err => {

			});
		}
	}
};
</script>
<style lang="scss" scoped>
.hr-image-preview {
	img {
		display: block;
	}
	.__item {
		box-sizing: border-box;
		cursor: pointer;
		position: relative;
		margin-bottom: 5px;
		margin-right: 5px;
		border: 1px solid #e1e1e1;
	}
	.__item:hover .__mask {
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
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 10px;
		box-sizing: border-box;
		& > span {
			cursor: pointer;
			font-size: 18px;
		}
	}
}
</style>