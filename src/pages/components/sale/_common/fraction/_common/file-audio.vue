<template>
	<div class="v-sale-file-content">
		<div v-if="fileUrl" style="height: 100%;">
			<div 
				v-show="fileUrl.indexOf('.mp3') > -1"
				class="_audio-box g-pd-20"
			>
				<div class="__audio g-flex g-ai-c g-pd-10">
					<i
						:class="{'icon-pause':!pause,'icon-play1':pause}"
						class="iconfont g-pointer g-fs-24"
						@click="handleToggle"
					/>
					<span class="g-m-lr-10">{{ handleFormat(curTime) }}</span>
					<i-slider
						v-model="curTime"
						:tip-format="handleFormat"
						:max="totalTime"
						@on-change="handleChangeCurTime"
					/>
					<span class="g-m-l-10">{{ handleFormat(totalTime) }}</span>
				</div>
				<audio ref="audio" :controls="false">
					<source
						:src="fileUrl"
						type="audio/mpeg"
					>
				</audio>
			</div>
			<oa-file-fail 
				v-show="fileUrl.indexOf('.mp3') == -1"
				:file-type="5"
				:file-url="fileUrl"
			/>
		</div>
	</div>
</template>
<script>
import { Slider } from 'iview';
import { FileFail } from './file-fail';

export default {
	name: 'oa-file-audio',
	components: {
		'i-slider': Slider,
		'oa-file-fail': FileFail
	},
	props: {
		fileUrl: String,
		autoplay: Boolean
	},
	data() {
		return {
			curTime: 0,
			totalTime: 0,
			pause: true,
			firstPlay: true,
			volume: 100
		};
	},
	watch: {
		fileUrl(newVal, oldVal) {
			this.$nextTick(() => {
				this.pause = true;
				this.handleReload(newVal, this.autoplay);
			});
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.$refs.audio) {
				this.$refs.audio.addEventListener("timeupdate", this.handleTimeUpdate);

				this.$refs.audio.addEventListener("ended", data => {
					this.pause = true;
				});
				
				this.$refs.audio.addEventListener("canplay", data => {
					const duration = this.$refs.audio.duration;
					this.totalTime = parseInt(duration, 10);
					if (this.autoplay && this.firstPlay) {
						this.handleToggle();
						this.firstPlay = false;
					}
				});
			}
		});
	},
	beforedestroy() {
		if (this.$refs.audio) {
			this.$refs.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
		}
	},
	methods: {
		handleTimeUpdate(data) {
			this.curTime = this.$refs.audio && this.$refs.audio.currentTime;
		},
		handleChangeCurTime(val) {
			this.curTime = val;
			this.$refs.audio.currentTime = val;
		},
		handleToggle() {
			if (isNaN(this.$refs.audio.duration)) return;
			if (this.pause) {
				this.pause = false;
				this.$refs.audio.play();
			} else {
				this.pause = true;
				this.$refs.audio.pause();
			}
		},
		handleReload(src, autoplay) {
			if (this.$refs.audio) {
				this.$refs.audio.src = src;
				this.$refs.audio.load();
				if (autoplay) {
					this.pause = false;
					this.$refs.audio.play();
				}
			}
		},
		handleSecond(s) {
			if (s === 0) return "00";
			if (s <= 9) return "0" + s;
			return s;
		},
		handleFormat(num) {
			num = parseInt(num, 10);
			const s = num % 60;
			const m = parseInt(num / 60, 10) % 60;
			const h = parseInt(num / 3600, 10);
			return `${this.handleSecond(h)}:${this.handleSecond(m)}:${this.handleSecond(s)}`;
		}
	}
};

export const FileAudio = module.exports.default;
</script>

<style lang="scss">
.v-sale-file-content {
	width: 100%;
	height: calc(100% - 86px);
	overflow-y: auto;
	._audio-box {
		.__audio {
			width: 100%;
			height: 90px;
			border: 1px solid #d4d7db;
			color: #818794;
			i {
				color: #2397f9;
			}
		}
		.ivu-slider {
			width: 100%;
		}
	}
}
</style>
