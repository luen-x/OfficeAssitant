<template>
	<div class="v-hr-archives-employee-target-employee-tab">
		<div
			v-for="(item, index) in info"
			:key="index"
			class="_item g-m-b-20">
			<div class="_header g-flex-ac g-jc-sb g-pd-lr-20">
				<span>
					<span class="g-c-black4" style="marginRight: 80px">
						部门：
						<span class="g-c-black2">{{ item.depart_name }}</span>
					</span>
					<span class="g-c-black4" style="marginRight: 80px">
						姓名：
						<span class="g-c-black2">{{ item.staff_name }}</span>
					</span>
					<span class="g-c-black4" style="marginRight: 80px">
						入职时间：
						<span class="g-c-black2">{{ item.entry_time }}</span>
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
						:info="item.month"
						:index="1"
						type="1"
						name="月度保底目标"
						color="#C2C9D8"
						class="g-m-t-15" />
					<oa-progress
						:info="item.month"
						:index="2"
						type="1"
						name="月度平衡目标"
						color="#C2C9D8"
						class="g-m-t-30" />
					<oa-progress
						:info="item.month"
						:index="3"
						type="1"
						name="月度冲刺目标"
						color="#C2C9D8"
						class="g-m-t-30" />
				</div>
				<div class="_time g-m-r-20">
					<oa-progress
						:info="item.season"
						:index="1"
						type="1"
						name="季度保底目标"
						color="#E74854"
						class="g-m-t-15" />
					<oa-progress
						:info="item.season"
						:index="2"
						type="1"
						name="季度平衡目标"
						color="#E74854"
						class="g-m-t-30" />
					<oa-progress
						:info="item.season"
						:index="3"
						type="1"
						name="季度冲刺目标"
						color="#E74854"
						class="g-m-t-30" />
				</div>
				<div class="_time">
					<oa-progress
						:info="item.half_year"
						:index="1"
						type="1"
						name="半年保底目标"
						color="#4FC43D"
						class="g-m-t-15" />
					<oa-progress
						:info="item.half_year"
						:index="2"
						type="1"
						name="半年平衡目标"
						color="#4FC43D"
						class="g-m-t-30" />
					<oa-progress
						:info="item.half_year"
						:index="3"
						type="1"
						name="半年冲刺目标"
						color="#4FC43D"
						class="g-m-t-30" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress, Row, Tooltip } from 'iview';
import Pro from '../_common/progress';
import { editPModal } from '../popup/edit';

export default {
	name: 'oa-component',
	components: {
		'i-progress': Progress,
		'i-row': Row,
		'i-tooltip': Tooltip,
		'oa-progress': Pro
	},
	props: {
		info: Array,
		showBtn: Boolean
	},
	data() {
		return {
		};
	},
	computed: {
		// isShow() {
		// 	return new Date().getDate() <= 3;
		// 	// return true;
		// }
	},
	methods: {
		handleEdit(item) {
			editPModal.popup({
				info: item,
				type: '1'
			}).then(res => {
				this.$emit('load', '1');
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-archives-employee-target-employee-tab {
	margin-bottom: 60px;
	._item {
		border:1px solid rgba(232, 232, 232, 1);
		._header {
			line-height: 47px;
			background:rgba(248,248,248,1);
		}
		._content {
			._time {
				flex: 1;
				height: 196px;
				padding: 20px;
				background:rgba(248,248,248,1);
			}
		}
	}
}
</style>

<style lang="scss">
.v-hr-archives-employee-target-employee-tab {
	._item {
		.ivu-progress {
			.ivu-progress-inner {
				background:#EDEEF1;
			}
		}
	}
}
</style>
