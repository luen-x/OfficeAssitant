<template>
	<div class="c-custom-tooltip">
		<slot name="title"/>
		<div v-if="options.content.length <= length">{{ options.content }}</div>
		<div v-else>
			<i-tooltip 
				v-bind="options"
				theme="light"
				transfer
			>{{ options.content.slice(0, length) }}...</i-tooltip>
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';

export default {
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		options: {
			required: true,
			type: Object,
			default: () => {

			}
		},
		length: {
			type: Number,
			default: 20
		}
	},
	data() {
		return {
            
		};
	}
};
</script>

