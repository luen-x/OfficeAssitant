<template>
	<div class="v-sale-expand">
		<div class="g-fs-14 g-pointer">
			<span v-if="bar" class="_exp-title-bar g-bg-red-mid"/>
			<slot name="prefix"/>
			<span @click="toggle">
				<slot name="toggle" @click="toggle"/>
				<i
					:class="show ? ' '+icon : '_rotate-180 '+icon"
					class="g-fs-12 iconfont g-dp-ib _icon"
				/>
			</span>
			<slot name="extra"/>
		</div>
		<vc-expand ref="expand" v-model="show" class="vc-expand">
			<slot/>
		</vc-expand>
	</div>
</template>

<script >
import { Expand } from 'wya-vc';

export default {
	name: "oa-sale-expand",
	components: {
		'vc-expand': Expand
	},
	props: {
		bar: {
			type: Boolean,
			default: true,
		},
		icon: {
			type: String,
			default: "icon-triangle-up"
		},
		expand: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			show: this.expand
		};
	},
	methods: {
		toggle() {
			this.$refs.expand.toggle();
			this.$emit('toggle', this.show);
		}
	},
};
</script>

<style  lang="scss">
.v-sale-expand {
	margin-top: 20px;
    ._exp-title-bar {
        display: inline-block;
        width: 2px;
        height: 14px;
        position: relative;
        top: 1px;
    }
    ._rotate-180 {
        transform: rotate(180deg);
    }
    ._icon {
        // transition: transform 0.2s ease;
        position: relative;
        bottom: 1px;
    }
}
</style>
