<template>
	<div class="v-hr-archives-employee-target-manager-tab g-flex g-fw-w">
		<div
			v-for="(item, index) in info"
			:key="index"
			class="_item g-m-b-20">
			<div class="_header g-flex-ac g-jc-sb g-pd-lr-20">
				<span>
					<span class="g-c-black4" style="marginRight: 80px">
						战区：
						<span class="g-c-black2">{{ item.depart_name }}</span>
					</span>
					<span class="g-c-black4" style="marginRight: 80px">
						总监：
						<span class="g-c-black2">{{ item.staff_name }}</span>
					</span>
					<span class="g-c-black4" style="marginRight: 80px">
						人均业绩：
						<span v-if="item.achievement" class="g-c-black2">{{ item.achievement.avg_achievement }}</span>
					</span>
				</span>
				<div
					v-if="showBtn && $auth[1117]"
					class="g-pointer g-c-blue-mid"
					style="width: 30px"
					@click="handleEdit(item)">
					编辑
				</div>
			</div>
			<div class="_content g-pd-20 g-flex">
				<div class="_time g-m-r-20">
					<oa-progress
						:info="item.achievement"
						:index="1"
						type="2"
						name="月度保底目标"
						color="#C2C9D8"
						class="g-m-t-15" />
					<oa-progress
						:info="item.achievement"
						:index="2"
						type="2"
						name="月度平衡目标"
						color="#C2C9D8"
						class="g-m-t-30" />
					<oa-progress
						:info="item.achievement"
						:index="3"
						type="2"
						name="月度冲刺目标"
						color="#C2C9D8"
						class="g-m-t-30" />
				</div>
				<div class="_charts g-m-t-10">
					<div class="g-tc">在职人数{{ item.incumbency.num }}人</div>
					<oa-charts ref="_charts" :data="item.incumbency" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress, Row, Tooltip } from 'iview';
import Pro from '../_common/progress';
import { editPModal } from '../popup/edit';
import Charts from '../_common/charts';

export default {
	name: 'oa-component',
	components: {
		'i-progress': Progress,
		'i-row': Row,
		'i-tooltip': Tooltip,
		'oa-progress': Pro,
		'oa-charts': Charts,
	},
	props: {
		info: Array,
		showBtn: Boolean
	},
	data() {
		return {
		};
	},
	mounted() {
		window.addEventListener('resize', this.handleScreenChange);
	},
	destroyed() {
		window.removeEventListener('resize', this.handleScreenChange);
	},
	methods: {
		handleEdit(item) {
			editPModal.popup({
				info: item,
				type: '2'
			}).then(res => {
				this.$emit('load', '3');
			}).catch(err => {});
		},
		handleScreenChange(e) {
			if (this.$refs._charts) {
				let chartArr = this.$refs._charts;
				chartArr.forEach(item => {
					item.$refs._charts.resize();
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-archives-employee-target-manager-tab {
	margin-bottom: 60px;
	._item {
		border:1px solid rgba(232, 232, 232, 1);
		._header {
			line-height: 47px;
			background:rgba(248,248,248,1);
		}
		._content {
			height: 354px;
			._time {
				flex: 1;
				padding: 20px;
			}
			._charts {
				flex: 1;
			}
		}
	}
	@media (max-width: 1417px) {
		._item {
			min-width: 600px;
		}
		._item:nth-of-type(odd) {
			margin-right: 0px;
		}
	}
	@media (min-width: 1418px) {
		._item {
			min-width: 560px;
		}
		._item:nth-of-type(odd) {
			margin-right: 20px;
		}
	}
	@media (min-width: 1438px) {
		._item {
			min-width: 600px;
		}
		._item:nth-of-type(odd) {
			margin-right: 20px;
		}
	}
}
</style>

<style lang="scss">
.v-hr-archives-employee-target-manager-tab {
	._item {
		flex: 1;
		min-width: 600px;
		.ivu-progress {
			.ivu-progress-inner {
				background:#EDEEF1;
			}
		}
	}
}
</style>
