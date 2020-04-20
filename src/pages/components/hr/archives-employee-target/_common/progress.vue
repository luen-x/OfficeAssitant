<template>
	<div class="v-hr-archieves-employee-target-progress">
		<i-tooltip style="width: 100%" trigger="click">
			<div slot="content">
				<i-row>
					<span class="_circle _white"/>
					<span v-if="type === '1' && index === 1">保底目标：{{ info.min }}</span>
					<span v-if="type === '1' && index === 2">平衡目标：{{ info.middle }}</span>
					<span v-if="type === '1' && index === 3">冲刺目标：{{ info.max }}</span>
					<span v-if="type !== '1' && index === 1">保底目标：{{ info.min_target }}</span>
					<span v-if="type !== '1' && index === 2">平衡目标：{{ info.middle_target }}</span>
					<span v-if="type !== '1' && index === 3">冲刺目标：{{ info.max_target }}</span>
				</i-row>
				<i-row>
					<span class="_circle" style="background: #A0D4FF"/>
					实时业绩：{{ info.achievement }}
				</i-row>
				<i-row>
					<span class="_circle _white" style="background: #2397F9;"/>
					<span v-if="type === '1' && index === 1">目标差额：{{ info.min_diff }}</span>
					<span v-if="type === '1' && index === 2">目标差额：{{ info.middle_diff }}</span>
					<span v-if="type === '1' && index === 3">目标差额：{{ info.max_diff }}</span>
					<span v-if="type !== '1' && index === 1">目标差额：{{ info.min_target_diff }}</span>
					<span v-if="type !== '1' && index === 2">目标差额：{{ info.middle_target_diff }}</span>
					<span v-if="type !== '1' && index === 3">目标差额：{{ info.max_target_diff }}</span>
				</i-row>
			</div>
			<div v-if="type !== '1'" style="min-width: 90px">{{ name }}</div>
			<div class="g-flex g-fs-14 g-lh-21">
				<div v-if="type === '1'" style="min-width: 90px">{{ name }}</div>
				<i-progress
					:percent="percent> 100 ? 100 : percent"
					:stroke-width="14"
					:stroke-color="color"
					:class="type === '1' ? 'g-m-l-5' : ''"
					hide-info />
			</div>
		</i-tooltip>
	</div>
</template>

<script>
import { Progress, Row, Tooltip } from 'iview';

export default {
	name: 'oa-component',
	components: {
		'i-progress': Progress,
		'i-row': Row,
		'i-tooltip': Tooltip,
	},
	props: {
		name: String,
		info: Object,
		index: Number,
		color: String,
		type: String
	},
	computed: {
		percent() {
			if (this.index && this.type === '1' && +this.info.achievement) {
				switch (this.index) {
					case 1:
						if (+this.info.achievement > 0 && +this.info.min === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.min).toFixed(2) * 100;
						}
					case 2:
						if (+this.info.achievement > 0 && +this.info.middle === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.middle).toFixed(2) * 100;
						}
					case 3:
						if (+this.info.achievement > 0 && +this.info.max === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.max).toFixed(2) * 100;
						}
					default:
						return 0;
				}
			} else if (this.index && this.type === '2' && +this.info.achievement) {
				switch (this.index) {
					case 1:
						if (+this.info.achievement > 0 && +this.info.min_target === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.min_target).toFixed(2) * 100;
						}
					case 2:
						if (+this.info.achievement > 0 && +this.info.middle_target === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.middle_target).toFixed(2) * 100;
						}
					case 3:
						if (+this.info.achievement > 0 && +this.info.max_target === 0) {
							return 100;
						} else {
							return (+this.info.achievement / +this.info.max_target).toFixed(2) * 100;
						}
					default:
						return 0;
				}
			} else {
				return 0;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-archieves-employee-target-progress {
	min-width: 150px;
	._circle {
		display: inline-block;
		color: #fff;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #fff;
	}
}
</style>
