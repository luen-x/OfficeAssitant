<template>
	<div>
		<div v-if="dataSource.length">
			<i-tooltip 
				v-if="dataSource.length > max" 
				transfer 
				max-width="300"
			>
				<span>{{ dataSource.slice(0, max).map(it => it[name]).join('、') + '...' }}</span>
				<div slot="content">
					<div 
						v-for="(item, index) in dataSource"
						:key="index"
					>
						<span>{{ item[name] }}</span>
						<span v-if="num">：{{ item[num] }}</span>
					</div>
				</div>
			</i-tooltip>
			<div v-else>
				<span v-if="max === 2">
					<i-tooltip 
						transfer 
						max-width="300"
					>
						<span>{{ dataSource.map(it => it[name]).join('、') }}</span>
						<div slot="content">
							<div 
								v-for="(item, index) in dataSource"
								:key="index"
							>
								<span>{{ item[name] }}</span>
								<span v-if="num">：{{ item[num] }}</span>
							</div>
						</div>
					</i-tooltip>
				</span>
				<span v-else-if="dataSource[0]">{{ dataSource[0][name] }}</span>
			</div>
		</div>
	</div>
</template>
<script>
import { Tooltip } from 'iview';

export default {
	name: 'oa-train-tooltip',
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		name: String,
		num: [String, Number],
		max: [String, Number],
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {

		};
	},
	methods: {
		
	}
};

export const TrainTooltip = module.exports.default;
</script>
<style lang="scss">

</style>
