<template>
	<div class="hr-leadin-step g-flex">
		<div 
			v-for="(item, index) of dataSource"
			:key="index"
			:class="{'_success': current >= index, '_default': current < index}"
		>
			<div class="g-tc g-relative g-flex g-ai-c">
				<div v-if="index > 0" class="_line"/>
				<div style="fontSize: 40px;" class="g-relative _item">
					0{{ index + 1 }}
					<div>{{ item }}</div>
				</div>
				<!-- <div>{{ item }}</div> -->
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'hr-leadin-step',
	props: {
		current: Number,
		dataSource: Array
	},
};
</script>

<style lang="scss">
.hr-leadin-step {
	
	._success {
		color: #E74854;
		._line {
			background: #E74854;
		}
	}
	._line {
		width: 120px;
		height: 1px;
		margin: 0 30px;
	}
	._default {
		color: #c1c1c1;

		._line {
			background: #e1e1e1;
		}
		.item {

			div {
				color: #818794;
			}
		}
	}
	._item {
		height: 60px;
		width: 45px;
		display: flex;
		align-items: center;
		flex-direction: column;

		div {
			color: #4b4f57;
			font-size: 12px;
			width: 120px;
		}
	}
}
</style>


