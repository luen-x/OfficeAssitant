<template>
	<div :class="anchorLinkClasses">
		<a 
			:class="linkTitleClasses" 
			:href="href" 
			:data-scroll-offset="scrollOffset" 
			:data-href="href" 
			:title="title" 
			@click.prevent="goAnchor">{{ title }}</a>
		<slot/>
	</div>
</template>
<script>
export default {
	name: 'anchor-link',
	inject: ['anchorCom'],
	props: {
		href: String,
		title: String,
		scrollOffset: {
			type: Number,
			default() {
				return this.anchorCom.scrollOffset;
			}
		}
	},
	data() {
		return {
			prefix: 'ivu-anchor-link'
		};
	},
	computed: {
		anchorLinkClasses() {
			return [
				this.prefix,
				this.anchorCom.currentLink === this.href ? `${this.prefix}-active` : ''
			];
		},
		linkTitleClasses() {
			return [
				`${this.prefix}-title`
			];
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.anchorCom.init();
		});
	},
	methods: {
		goAnchor() {
			window.event.preventDefault();
			this.currentLink = this.href;
			this.$router.replace({
				path: this.$route.path,
				query: { ...(this.$route.query || {}), [this.anchorCom.queryName]: this.href }
			});
			// this.anchorCom.handleHashChange();
			// this.anchorCom.handleScrollTo();
			this.anchorCom.$emit('on-select', this.href);
			// const isRoute = this.$router;
			// if (isRoute) {
			// 	this.$router.push(this.href);
			// } else {
			// 	window.location.href = this.href;
			// }
		}
	},
};
</script>
