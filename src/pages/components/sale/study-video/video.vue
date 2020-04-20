<template>
	<div
		v-if="isVideo"
		ref="fullVideo"
		tabindex="1"
		class="v-sale-study-video-video"
		@keyup.enter="handleSpace()" >
		<div class="g-flex-cc g-flex-ac" style="height:100%">
			<video
				ref="video"
				:src="fileUrl"
				class="_video"
				style="width:100%;height:100%;max-height: 85vh;padding-bottom:120px "
				@click="handleSpace"
			/>
		</div>
		<div class="_control" style="width100%;">
			<i-slider v-model="vcProgress" :step="0.1" show-tip="never" @on-change="handleProgress" />
			<div class="g-flex __button">
				<div style="padding:0 40px">
					<i v-if="playing" class=" _pointer g-fs-40 iconfont icon-pause" @click="handlePause"/>
					<i v-else class="_pointer g-fs-40 iconfont icon-play1" @click="handleStart"/>
				</div>
				<div class="g-m-t-10 g-fs-20">
					{{ vcCurrentTime }}
					<span style="color:#666666">
						/{{ vcTotalTime }}
					</span>
				</div>
				<div class="__voice" >
					<i class="iconfont icon-voice"/>
				</div>
				<div style="margin-top: 7px;" class="g-col">
					<i-slider
						ref="slider"
						v-model="vcVolume"
						style="display:inline-block; width:200px"
						@on-input="handleChangeVolume"
					/>
				</div>
				<div class="g-pd-lr-25" @click="handelFull">
					<i class="g-fs-40 _pointer iconfont icon-quanpingguankan" />
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { Slider } from 'iview';

export default {
	components: {
		'i-slider': Slider,
	},
	props: {
		fileUrl: {
			type: String,
			default() {
				return '';
			}
		},
		isVideo: {
			type: Boolean,
			default() {
				return false;
			}
		},
		video_method: {
			type: Number,
			default() {
				return null;
			}
		},
		method: {
			type: Number,
			default() {
				return null;
			}
		},
	},
	data() {
		return {
			value1: 12,
			playing: false,
			fullScreen: false, // 是否全屏
			vcCurrentTime: '00:00', // 当前进度
			vcTotalTime: '00:00', // 总时长
			vcIsPlay: false, // video是否播放
			vcProgress: 0, // video进度
			vcIsFull: false, // 是否全屏
			vcVolume: 50, // 音量
			timer: '', // 计时器
			vcTime: "",
			recordTime: 0,
		};
	},
	computed: {


	},
	watch: {
		fileUrl() {
			this.handlePause();
			clearInterval(this.timer);
			this.playing = false;
			this.vcProgress = 0;
			this.vcCurrentTime = '00:00';
		}
	},
	mounted() {
		if (this.fileUrl) {
			this.vcTotalTime = this.$refs.video.duration;
			this.$refs.video.addEventListener("loadedmetadata", () => {
				let v = this.$refs.video.duration;
				let m = parseInt(v / 60, 10);
				let s = parseInt(v - m * 60, 10);
				m = m < 10 ? "0" + m : m;
				s = s < 10 ? "0" + s : s;
				this.vcTotalTime = m + ":" + s;
			}, false);
			window.addEventListener("keyup", (e) => {
				if (e.keyCode == 32) {
					this.handleSpace();
				}
			});
			this.$refs.video.addEventListener("ended", data => {
				this.handlePause();
				this.playing = false;
			});
		}
	},
	beforeDestroy() {
		this.handlePause();
		clearInterval(this.timer);
		window.removeEventListener('keyup', () => {});
		this.$refs.video.removeEventListener('loadedmetadata', () => {});
	},
	methods: {
		handleSpace() {
			this.playing ? this.handlePause() : this.handleStart();
		},
		handleStart() {
			this.playing = !this.playing;
			this.$refs.video.play();
			if (this.vcProgress && this.recordTime > this.vcProgress) {
				this.$refs.video.currentTime = this.vcProgress * this.$refs.video.duration / 100;
			}
			this.timer = setInterval(() => {
				const t = this.$refs.video.currentTime;
				this.vcTime = t;
				let m = parseInt(t / 60, 10);
				let s = parseInt(t - m * 60, 10);
				m = m < 10 ? "0" + m : m;
				s = s < 10 ? "0" + s : s;
				this.vcCurrentTime = m + ":" + s;
				this.vcProgress = (t / this.$refs.video.duration * 100);
				this.vcProgress = Number(this.vcProgress);
				if (this.vcProgress > this.recordTime) {
					this.recordTime = this.vcProgress;
				}
			}, 100);
		},
		handlePause() {
			this.playing = !this.playing;
			this.$refs.video.pause();
			clearInterval(this.timer);
		},
		handleProgress(v) {
			if (this.method == 6 && this.video_method == 1) {
				if (this.recordTime > v) {
					this.$refs.video.currentTime = v * this.$refs.video.duration / 100;
				}
				// 能否拖动
				// else {
				// 	this.$refs.slider.onPointerDrag = function (event) {
				// 		this.dragging = true;
				// 		this.$refs[`${this.pointerDown}Tooltip`].visible = true;
				// 		this.currentX = this.getPointerX(event);
				// 		const diff = (this.currentX - this.startX) / this.sliderWidth * this.valueRange;

				// 		if (diff < 0) this.changeButtonPosition(this.startPos + diff);

				// 	}.bind(this.$refs.slider);
				// }
			} else if (this.method == 6 && this.video_method == 2) {
				this.$refs.video.currentTime = v * this.$refs.video.duration / 100;
			} else if (this.method == 0) {
				if (this.recordTime > v) {
					this.$refs.video.currentTime = v * this.$refs.video.duration / 100;
				}
			} else {
				this.$refs.video.currentTime = v * this.$refs.video.duration / 100;
			}
		},
		handleChangeVolume(v) {
			this.$refs.video.volume = (v / 100);
		},
		handelFull() {
			const videoFull = this.$refs.fullVideo;
			const isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
			this.isFullScreen = isFullscreen;
			if (!isFullscreen) {
				(videoFull.requestFullscreen && videoFull.requestFullscreen())
					|| (videoFull.mozRequestFullScreen && videoFull.mozRequestFullScreen())
					|| (videoFull.webkitRequestFullscreen && videoFull.webkitRequestFullscreen())
					|| (videoFull.msRequestFullscreen && videoFull.msRequestFullscreen());
			} else {
				document.exitFullscreen
					? document.exitFullscreen()
					: document.mozCancelFullScreen
						? document.mozCancelFullScreen()
						: document.webkitExitFullscreen
							? document.webkitExitFullscreen()
							: '';
			}
		}
	},
};
</script>

<style  lang="scss">
    .v-sale-study-video-video {
		height: 86vh;
		max-height: 86vh;
		position: relative;
		// ._video{
		// 	max-height: calc(100%-274px);
		// 	height: calc(100%-274px);
		// }
        ._control {
			position:absolute;
			bottom: 0;
            height: 120px;
			background: rgba(51, 51, 51, 1);
			width: 100%;
			.__button{
				color: #fff;
			}
			.__voice{
				margin-top: 15px;
				padding-left:80px;
			}
		}
		._pointer{
			cursor: pointer;
		}
		.ivu-slider-wrap {
            background: rgba(255, 255, 255, 1);
		}
		.ivu-slider-bar{
			background: #e84854;
		}
    }
</style>
