<template>
	<div class="g-flex v-period-range">
		<button 
			type="button" 
			class="g-red-btn-line"
			style="line-height: 1; margin-right: 25px"
			@click="handleAddRange"
		>
			新增范围
		</button>
		<div style="paddingTop:5px" class="g-flex-ac g-fw-w g-col">
			<div 
				v-for="range in rangesArr"
				:key="range.sort_id"
				class="_range-item g-flex-ac g-m-r-10 g-m-b-10"
			>
				<span>职位：{{ range.position_name }}</span>
				<template v-if="range.role_id">
					<i class="iconfont icon-vertical-line g-c-white" />
					<span>角色：{{ range.role_name }}</span>
				</template>
				<i 
					class="iconfont icon-close2 g-fs-12"
					@click="handleDel(range.sort_id)"
				/>
			</div>
		</div>
	</div> 
</template>

<script>
import emitter from '@extends/mixins/emitter';
import { Message } from 'iview';
import { AddRangeModal } from '../popup/add-range';
import { DelTipModal } from '../../_common/delete-tip';

export default {
	name: 'c-hr-range-form',
	mixins: [emitter],
	model: {
		prop: 'ranges',
		event: 'change'
	},
	props: {
		ranges: {
			type: Array,
			default() {
				return [];
			}
		},
		departId: String | Number
	},
	data() {
		return {
			rangesArr: this.ranges,
		};
	},
	watch: {
		ranges(val) {
			this.setCurrentValue(val);
		}
	},
	methods: {
		setCurrentValue(ranges) {
			if (ranges === this.rangesArr) return;
			
			this.rangesArr = ranges;
			this.dispatch('FormItem', 'on-form-change', ranges);
		},
		handleAddRange() {
			AddRangeModal.popup({
				departId: this.departId
			}).then((res) => {
				let ranges = [...this.rangesArr, res];
				this.$emit('change', ranges);
				this.setCurrentValue(ranges);
			}).catch((error) => {

			});
		},
		handleDel(sortId) {
			let ranges = this.rangesArr.filter((item) => item.sort_id != sortId);
			this.$emit('change', ranges);
			this.setCurrentValue(ranges);
		}
	}
};
</script>

<style lang="scss">
.v-period-range {
	._range-item {
		background-color: #e84c57;
		color: #ffffff;
		padding: 4px 6px;
		display: inline-block;
		border-radius: 4px;
		line-height: 1;
		font-size: 12px;
	}
}

</style>