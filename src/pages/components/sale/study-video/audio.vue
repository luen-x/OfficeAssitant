<template>
	<div class="v-sale-audio">
		<div class="_audio g-flex">
			<i
				:class="{'icon-pause':!pause,'icon-play1':pause}"
				class="iconfont g-pointer"
				@click="handleToggle"
			/>
			<span v-if="mode == 'default'" class="g-m-lr-5">
				{{ handleFormat(curTime) }}
			</span>
			<i-slider
				v-model="curTime"
				:tip-format="handleFormat"
				:max="totalTime"
				:show-tip="showTip"
				:class="mode"
				:disabled="!totalTime"
				class="g-m-lr-10"
				@on-change="handleChangeCurTime"
			/>
			<div class="g-m-lr-5" style="white-space: nowrap">
				<span v-if="mode == 'mid'">{{ handleFormat(curTime) }}/</span>
				<span>{{ handleFormat(totalTime) }}</span>
			</div>
		</div>
		<audio ref="audio" :controls="false">
			<source :src="src" type="audio/mpeg">
		</audio>
	</div>
</template>
<script>
import { Slider } from 'iview';
import moment from 'moment';

let playingAudio;
const audios = [];
export default {
	name: 'oa-audio',
	components: {
		'i-slider': Slider
	},
	props: {
		src: {
			type: String,
			default: ''
		},
		autoplay: Boolean,
		mode: {
			type: String,
			default: 'default' // mid
		},
		showTip: {
			type: String,
			default: 'hover'
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
			curTime: 0,
			totalTime: 0,
			pause: true,
			firstPlay: true,
			volume: 100
		};
	},
	watch: {
		src(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.pause = true;
				this.handleReload(newVal, this.autoplay);
			}
		}
	},
	created() {
		audios.push(this);
	},
	mounted() {
		if (this.$refs.audio) {
			this.$refs.audio.addEventListener("timeupdate", this.handleTimeUpdate);

			this.$refs.audio.addEventListener("ended", data => {
				this.pause = true;
				playingAudio = undefined;
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
	},
	beforeDestroy() {
		this.$refs.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
		const index = audios.findIndex(item => item == this);
		index > -1 && audios.splice(index, 1);
		if (playingAudio == this) {
			playingAudio = undefined;
		}

	},
	methods: {
		handleTimeUpdate(data) {
			this.curTime = this.$refs.audio && this.$refs.audio.currentTime;
		},
		handleChangeCurTime(val) {
			if (isNaN(val)) return;
			this.curTime = val;
			this.$refs.audio.currentTime = val;
		},
		handleToggle() {
			if (isNaN(this.$refs.audio.duration)) return;
			if (this.pause) {
				this.pause = false;
				this.$refs.audio.play();
				if (playingAudio && playingAudio != this && playingAudio.pause == false) {
					playingAudio.handleToggle();
					playingAudio = this;
				}
				if (!playingAudio) {
					playingAudio = this;
				}
			} else {
				this.pause = true;
				this.$refs.audio.pause();
				playingAudio = undefined;
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

export const Audio = module.exports.default;
</script>

<style lang="scss">
.v-sale-audio {
    width: 100%;
    ._audio {
        justify-content: flex-start;
        align-items: center;
        color: #999;
        i {
            color: #2397f9;
        }
    }
    .ivu-slider {
        width: 100%;
    }
    .mid {
        .ivu-slider-button {
            width: 0px;
			border-radius: 0px;
			border: 1px solid #57a3f3;
		}
		.ivu-slider-button-wrap {
			top: -4px;

		}
    }
}
</style>
