<template>
	<div>
		<oa-step-tree :ata="data" :block-size="120" line-color="red" >
			<div slot="inner" slot-scope="{data}" >
				
				{{ data }}
			</div>
		</oa-step-tree>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import StepTree from './step-tree';


export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-step-tree': StepTree
	},
	data() {
		return {
			data: [
				[1, 1, 1, 1, 1], 
				[1],
				[1, 1, 1],
				[1],
				[1, 1, 1, 1, 1]
			]
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
</style>