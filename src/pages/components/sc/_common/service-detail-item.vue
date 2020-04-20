<template>
	<div class="c-sc-service-detail-item">
		<span class="_label">{{ label }}</span>
		<span :class="color ? '_content-e' : '_content-b'" span="20" >
			<slot />
		</span>
	</div>
</template>

<script>
import { Col, Row } from 'iview';

export default {
	name: "sc-service-detail-item",
	components: {
		'i-row': Row,
		'i-col': Col,
	},
	props: {
		label: String,
		color: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
		};
	},
	mounted() {
	}
};
</script>

<style lang="scss">
.c-sc-service-detail-item {
	display: inline-block;
	width: 400px;
	padding-bottom: 12px;
	margin-right: 50px;
	._label {
		display: inline-block;
		color: #818794;
	}
	._content-b {
		display: inline-block;
			color: #000;
			white-space: normal;
			word-wrap: break-word;
			word-break: break-all;
	}
	._content-e {
		display: inline-block;
		color: #39a2f9;
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>


