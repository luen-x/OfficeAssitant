<template>
	<div :style="{height}" class="c-scroll" @scroll="handleScroll">
		<slot/>
		<vc-expand ref="expand" v-model="loading">
			<slot name="bottom">
				<div class="g-tc g-c-blue-mid">
					<i-icon :type="loadingIcon" class="ivu-load-loop"/> {{ loadingText }}
				</div>
			</slot>
		</vc-expand>

	</div>
</template>
<script>
import { Icon } from 'iview';
import { Expand } from 'wya-vc';
import { debounce, throttle } from 'lodash';


export default {
	name: 'oa-scroll',
	components: {
		'i-icon': Icon,
		'vc-expand': Expand

	},
	props: {
		height: String,
		loadingIcon: {
			type: String,
			default: 'ios-loading',

		},
		loadingText: {
			type: String,
			default: '加载中'
		},
		loading: Boolean,
		bottom: {
			type: Number,
			default: 0
		},
		throttle: Boolean // 是否使用截流的方式

	},
	data() {
		return {
			delay: 500,
			canEmit: true,
			timer: '',

		};
	},
	watch: {
		loading(val) {
			if (!val) {
				this.canEmit = false;
				this.timer && clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.canEmit = true;
					this.timer = '';
				}, this.delay);
			}
			const expand = this.$refs.expand;
			if ((val && !expand.isActive) || (!val && expand.isActive)) expand.toggle();

		}
	},
	methods: {
		fn(e) {
			if (this.loading || !this.canEmit) return;
			let scrollHeight = e.target.scrollHeight - e.target.offsetHeight;// 可滚动距离
			let scrollTop = e.target.scrollTop; // 已滚动距离
			if (scrollTop == 0) {
				this.$emit('reach-top');
			} else if (scrollTop >= (scrollHeight - this.bottom)) {
				this.$emit('reach-bottom');
			}
		},
		handleScroll(e) {
			if (this.throttle) {
				this.handleThrottleScroll(e);
			} else {
				this.handleDebounceScroll(e);
			}

		},
		handleDebounceScroll: debounce(function (e) {
			this.fn(e);
		}, 100),
		handleThrottleScroll: throttle(function (e) {
			this.fn(e);
		}, 100),



	}
};
</script>
<style lang="scss">
.c-scroll {
	overflow-y: auto;
	overflow-y: overlay;
}
</style>