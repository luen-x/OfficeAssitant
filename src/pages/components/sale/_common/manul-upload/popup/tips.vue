<template>
	<div class="g-m-b-10 _content">
		<div style="line-height:14px">
			<oa-file-icon :file-url="file.name" style=""/>
			<span class="g-c-black2 g-m-l-10 _ecllips" style="width:250px">{{ file.name }}</span>
		</div>
		<div>
			<i-progress 
				:percent="+(file.percent||0).toFixed(0)" 
				:status="statusMap[file.uploadStatus]" 
				stroke-color="#e74854"
				style="width:350px"
			>
				<span>
					<span v-if="!file.uploadStatus" class="g-c-black3">{{ +(file.percent||0).toFixed(0) }}%</span>
					<i v-else-if="file.uploadStatus==1" class="icon iconfont icon-completed g-c-green-mid"/>
					<i v-else-if="file.uploadStatus==2" class="icon iconfont icon-uncomplete g-c-red-mid"/>
				</span>
			</i-progress>
			<span class="g-operation" @click="handleDeleteFile">删除</span>
			<!-- <i class="icon iconfont icon-close g-pointer" @click="handleDeleteFile"/> -->
		</div>
		<div v-if="(file.percent||0) < 100">
			<span class="g-m-r-10">文件大小:<span class="g-c-black2 g-m-l-10">{{ fileSize }}</span> </span>
			<span class="g-m-r-10">上传速度:<span class="g-c-black2 g-m-l-10">{{ speed }} </span></span>
			<span>上传剩余时间:<span class="g-c-black2 g-m-l-10">{{ lastTime }}</span></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { Progress } from 'iview';
import moment from 'moment';
import Fileicon from '@components/_common/file-icon/file-icon';
import { setInterval, clearInterval, clearTimeout } from 'timers';

export default {
	components: {
		'i-progress': Progress,
		'oa-file-icon': Fileicon,
	},
	props: {
		file: Object
	},
	data() {
		return {
			lastSecondPercent: 0,
			speed: '',
			lastTime: '',
			timer: '',
			statusMap: {
				0: 'normal',
				1: 'success',
				2: 'wrong'
			}
		};
	},
	computed: {
		fileSize() {
			return this.formatSize(this.file.size);
		}
	},
	watch: {
	},
	mounted() {
		this.timer = setInterval(() => {
			this.calculateSpeed();
		}, 1000);
	},
	beforeDestroy() {
		clearTimeout(this.timer);
	},
	methods: {
		calculateSpeed() {
			let changeSize = this.file.size * (this.file.percent - this.lastSecondPercent) / 100;
			this.speed = this.formatSize(changeSize) + '/S';
			if (changeSize > 0) {
				this.lastTime = this.formatTime((100 - this.file.percent) / (this.file.percent - this.lastSecondPercent));
			} else {
				this.lastTime = '--';
			}
			this.lastSecondPercent = this.file.percent; 
		},
		formatSize(v) {
			if ((v / 1024 / 1024 / 1024) > 1) {
				return (v / 1024 / 1024 / 1024).toFixed(2) + 'G';
			} else if ((v / 1024 / 1024) > 1) {
				return (v / 1024 / 1024).toFixed(2) + 'M';
			} else if ((v / 1024) > 1) {
				return (v / 1024).toFixed(2) + 'KB';
			} else return 0;
		},
		formatTime(time) {
			time = parseInt(time, 10);
			if (time < 60) {
				return time + '秒';
			} else {
				return `${parseInt(time / 60, 10)}分${time % 60}秒`;
			}

		},
		handleDeleteFile() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_DELETE', this.file);
			this.file.cancel();
		}
	},
};
</script>

<style lang="scss">

</style>
