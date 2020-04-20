<template>
	<div v-if="!expandable" class="v-sale-customer-info-block">
		<div v-if="!notitle" class="_title">
			<span v-if="bar" class="_title-bar g-bg-red-mid"/>
			<span class="g-fs-14 g-m-lr-5">{{ title }}</span>
			<slot name="extra"/>
		</div>
		<slot name="head"/>
		<div class="g-flex g-fw-w g-pd-l-10" style="margin-right:-30px">
			<slot/>
		</div>
	</div>
	<oa-sale-expand
		v-else
		:bar="bar"
		:icon="icon"
		:expand="expand"
		class="v-sale-customer-info-block">
		<slot slot="toggle" name="toggle">
			<span class="g-fs-14 g-m-lr-5">{{ title }}</span>
		</slot>
		<slot slot="extra" name="extra"/>
		<slot name="head"/>
		<div class="g-flex g-fw-w g-pd-l-10" style="margin-right:-30px">
			<slot/>
		</div>
	</oa-sale-expand>
</template>

<script >
import InfoItem from './info-item';
import Expand from './expand';

export default {
	components: {
		'oa-info-item': InfoItem,
		'oa-sale-expand': Expand
	},
	props: {
		title: String,
		expandable: {
			type: Boolean,
			default: false
		},
		bar: {
			type: Boolean,
			default: true
		},
		icon: {
			type: String,
			default: "icon-triangle-up"
		},
		notitle: {
			type: Boolean,
			default: false

		},
		expand: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
		};
	},
	methods: {

	},
};
</script>

<style  lang="scss">
.v-sale-customer-info-block {
    ._title {
        margin-top: 20px;
        &-bar {
            display: inline-block;
            width: 2px;
            height: 14px;
            position: relative;
            top: 1px;
        }
    }
}
</style>
