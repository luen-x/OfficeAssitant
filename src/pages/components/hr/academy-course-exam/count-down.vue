<template>
	<div class="v-exam-answer-countdown">
		<div class="g-fs-12 g-c-black3 g-lh-20">
			<div>距离交卷还有</div>
			<div :class="{'g-c-red-mid': isWarning}">{{ count_down }}</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'oa-countdown',
	props: {
		time: [String, Number] // 秒
	},
	data() {
		return {
			count_down: "00 : 00 : 00",
			timer: '',
			isWarning: false
		};
	},
	computed: {
		times() {
			return this.time || 9600;
		}
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	mounted() {
		this.time > 0 && this.countDown(this.times);
	},
	methods: {
		countDown(times) {
			 this.timer = null;
			 this.timer = setInterval(() => {
				// let day = 0;
				let hour = 0;
				let minute = 0;
				let second = 0;// 时间默认值
				if (times > 0) {
					// day = Math.floor(times / (60 * 60 * 24));
					hour = Math.floor(times / (60 * 60));
					minute = Math.floor(times / 60) - (hour * 60);
					second = Math.floor(times) - (hour * 60 * 60) - (minute * 60);
				}
				// if (day <= 9) day = '0' + day;
				if (hour <= 9) hour = '0' + hour;
				if (minute <= 9) minute = '0' + minute;
				if (second <= 9) second = '0' + second;
				//
				this.count_down = hour + "：" + minute + "：" + second;
				times--;
				if (times <= 60) {
					this.isWarning = true;
				}
				if (times <= 0) {
					clearInterval(this.timer);
					this.$emit('autoSubmit', true);
				}
			}, 1000);
		}
	}
};

export const CountDown = module.exports.default;
</script>

<style lang="scss">
 
</style>
