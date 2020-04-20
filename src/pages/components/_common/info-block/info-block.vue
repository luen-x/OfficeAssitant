<template>
	<div class="c-info-block">
		<slot v-if="showTitle" name="head">
			<div v-if="expandable" @click="toggle" >
				<oa-title v-if="title" :title="title" class="g-pointer" />
				<i
					:class="show ? ' '+icon : '_rotate-180 '+icon"
					class="g-fs-12 iconfont g-dp-ib _icon g-pointer"
				/>
			</div>
			<oa-title v-else :title="title" />
		</slot>
		<slot name="extra"/>
		<vc-expand
			v-if="expandable"
			v-model="show"
		>
			<div class="g-flex g-fw-w g-pd-l-10" style="margin-right:-30px">
				<slot/>
			</div>
		</vc-expand>
		<div v-else class="g-flex g-fw-w g-pd-l-10" style="margin-right:-30px">
			<slot/>
		</div>
		
	</div>
</template>

<script >
import { Expand } from 'wya-vc';
import Title from '../title/title';

export default {
	components: {
		'vc-expand': Expand,
		'oa-title': Title
	},
	props: {
		title: [String],
		showTitle: {
			type: Boolean,
			default: true
		},
		expandable: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: "icon-triangle-up"
		},
		expand: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			show: this.expand
		};
	},
	methods: {
		toggle() {
			this.show = !this.show;
		}

	},
};
</script>

<style  lang="scss">
.c-info-block {
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
