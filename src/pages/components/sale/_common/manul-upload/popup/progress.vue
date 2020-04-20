<template>
	<div :style="style" class="v-manul-upload-progress" >
		<div
			class="g-tc g-relative"
			style="height: 40px;
					line-height: 40px;
					background: rgb(245,245,246);" >
			<span class="g-tc g-bold g-fs-14 g-c-black2"> 上传进度</span>
			<i class="icon iconfont icon-close g-absolute g-pointer" style="right: 10px;" @click="handleCancel"/>
		</div>
		<div class="g-relative g-m-t-10" style="height:18px;padding-left:45px" >
			<span class="g-c-red-mid"> 上传过程中关闭浏览器会终止上传哦 </span>
		</div>
		<div class="g-m-tb-10" style="align-items:center;height:30px;padding-left:45px">
			<span class="g-dp-ib" style="width:85px">
				上传中:
				<span class="g-c-black2 g-m-l-10">{{ fileList.filter(file=>!file.uploadStatus).length }}个</span>
			</span>
			<span class="g-dp-ib" style="width:95px">
				上传成功:<span class="g-c-black2 g-m-l-10">{{ fileList.filter(file=>file.uploadStatus==1).length }}个</span>
			</span>
			<span class="g-dp-ib" style="width:95px">
				上传失败:<span class="g-c-black2 g-m-l-10">{{ fileList.filter(file=>file.uploadStatus==2).length }}个</span>
			</span>
			<i-button @click="handlClear">清除已完成</i-button>
		</div>
		<div class="g-col" style="overflow-y: auto;padding-left:45px">
			<oa-tips
				v-for=" (item) in fileList"
				:file="item"
				:key="item.fileId"
			/>
		</div>
		<span :class="tagClass" @click="handleToggle">
			<i class="iconfont icon-left"/>
		</span>
	</div>
</template>
<script >
import { CreatePortal } from 'wya-vc';
import { Progress, Button } from 'iview';
import Fileicon from '@components/_common/file-icon/file-icon';
import { setInterval } from 'timers';

import tips from './tips';

let potal;
export default {
	name: "upload-progress",
	components: {
		'i-progress': Progress,
		'i-button': Button,
		'oa-Fileicon': Fileicon,
		'oa-tips': tips
	},
	props: {

	},
	data() {
		return {
			show: false,
			time: 0,
			speedTest: '', // 网速
			surplus: '', // 剩余
		};
	},
	computed: {
		style() {
			return {
				right: (this.show ? 0 : -450) + 'px'
			};
		},
		fileList() {
			return this.$store.state.contentConfigMaterialBank.fileList;
		},
		tagClass() {
			return {
				_open: this.show,
				'_close-tag': true
			};
		},

	},
	mounted() {
		setTimeout(() => {
			this.show = true;
		}, 10);
	},
	beforeDestroy() {
		potal = undefined;
	},
	methods: {
		handleCancel() {
			this.show = false;
			this.$emit('close');
		},
		handleToggle() {
			this.show = !this.show;
		},
		handlClear() {
			app.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_DELETE_COMPLETE');
		}
	}
};
const modal = CreatePortal({ autoDestory: false }, module.exports.default);
export const UploadProgress = { popup(data) {
	if (potal) {
		return potal;
	} else {
		potal = modal.popup(data);
		return potal;
	}

} };

</script>
<style lang="scss">
.v-manul-upload-progress{
	display: flex;
	flex-direction: column;
	border-radius: 5px 0 0 5px;
    border: 1px solid #eee;
	pointer-events: all;
    background: #fff;
	transition: all 0.3s ease;
	position: fixed;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    right: 0;
    bottom: 20px;
    width: 450px;
	height: 300px;
	padding:0 ;
    z-index: 6666;
	._close-tag {
		position: absolute;
		display: block;
		bottom:130px;
		width:20px;
		height: 36px;
		left:-20px;
		background: #E84C57;
		color: white;
		padding: 6px 5px;
		border-radius: 4px 0px 0px 4px;
		transition: all 0.3s ease;
		&._open{
			transform: rotateY(180deg);
			transform-origin: right;
		}
	}
	._ecllips {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

}

</style>