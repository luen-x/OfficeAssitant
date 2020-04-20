<template>
	<div class="c-draw-animate">
		<div v-if="list.length" style="margin-top: 180px">
			<div style="font-weight: bold; ">{{ list[nowIndex].staff_name }}</div>
			<div style="font-size: 30px">{{ list[nowIndex].mobile }}</div>
		</div>
	</div>
</template>
<script>
import API_ROOT from '@stores/apis/root';

export default {
	data() {
		return {
			list: [],
			nowIndex: 0
		};
	},
	async created() {
		await this.loadData();
		this.handleDrawAnimate();
	},
	methods: {
		handleDrawAnimate() {
			this.timer = setInterval(() => {
				if (this.nowIndex >= this.list.length - 1) {
					this.nowIndex = 0;
				} else {
					this.nowIndex = this.nowIndex + 1;
				}
			}, 80);
			this.$once('hook:beforeDestroy', () => {
				clearInterval(this.timer); 
				clearInterval(this.timer._id); 
			});
		},
		async loadData() {
			try {
				const { data } = await this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_PARTICIPATOR_GET,
					param: { lottery_id: this.$route.query.lottery_id },
					type: "GET",
					loading: false
				});
				this.list = [
					...data
				];
			} catch (err) {
				this.$Message.error(err.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.c-draw-animate {
    width: 100%;
    height: 100%;
    text-align: center;
    // line-height: 580px;
	font-size: 66px;
	color: rgba(227,31,77,1);
	position: relative;
	z-index: 999
}
</style>


