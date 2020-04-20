<template>
	<div class="v-hr-recruit-social-detail-switch g-bg-white g-flex">
		<div
			:class="prev.is_click ? 'g-c-red-light' : 'g-c-black-light'"
			:style="{cursor: prev.is_click ? 'pointer' : 'not-allowed'}"
			class="g-flex g-ai-c g-br g-pd-l-20"
			@click="handlePrev">
			<i class="iconfont icon-left"/>
			<span class="g-m-r-5">{{ prev.is_click ? prev.applicant_name : '到头了' }}</span>
		</div>

		<div
			:class="next.is_click ? 'g-c-red-light' : 'g-c-black-light'"
			:style="{cursor: next.is_click ? 'pointer' : 'not-allowed'}"
			class="g-flex g-jc-fe g-ai-c g-pd-r-20"
			@click="handleNext">
			<span class="g-m-l-5">{{ next.is_click ? next.applicant_name : '到头了' }}</span>
			<i class="iconfont icon-right"/>
		</div>
	</div>
</template>

<script>
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'hr-recruit-social-detail-switch',
	components: {

	},
	props: {
		prev: {
			type: Object,
			default: () => ({})
		},
		next: {
			type: Object,
			default: () => ({})
		},
		onRefresh: Function
	},
	data() {
		return {
		};
	},
	computed: {
		path() {
			let path = this.$route.path.split('/');
			path.pop();
			path = path.join('/');
			return path;
		}
	},
	methods: {
		handlePrev() {
			if (!this.prev.is_click) return;

			let isRecruit = this.$route.path.split('/')[2] === 'recruit';
			if (isRecruit) {
				this.$router.replace(getHashUrl(
					`${this.path}/${this.prev.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.onRefresh && this.onRefresh(true);
			} else if (this.prev.add_type === 2) {
				this.$router.replace(getHashUrl(
					`/academy/transfer/transfer/social/${this.prev.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.onRefresh && this.onRefresh(true);
			} else if (this.prev.add_type === 3) {
				this.$router.push(getHashUrl(
					`/academy/transfer/transfer/school/${this.prev.applicant_id}`,
					{
						...this.$route.query,
						tabType: this.$route.query.type,
						type: 'no-edit'
					}
				));
			}
		},
		handleNext() {
			if (!this.next.is_click) return;

			let isRecruit = this.$route.path.split('/')[2] === 'recruit';
			if (isRecruit) {
				this.$router.replace(getHashUrl(
					`${this.path}/${this.next.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.onRefresh && this.onRefresh(true);
			} else if (this.next.add_type === 2) {
				this.$router.replace(getHashUrl(
					`/academy/transfer/transfer/social/${this.next.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.onRefresh && this.onRefresh(true);
			} else if (this.next.add_type === 3) {
				this.$router.push(getHashUrl(
					`/academy/transfer/transfer/school/${this.next.applicant_id}`,
					{
						...this.$route.query,
						tabType: this.$route.query.type,
						type: 'no-edit'
					}
				));
			}
		},
	},
};
</script>

<style lang="scss">
.v-hr-recruit-social-detail-switch {
	position: fixed;
	bottom: 40px;
	left: 50%;
	border-radius: 50px;
	box-shadow: 0px 0px 10px #6666664f;
	div {
		height: 40px;
		width: 100px;
		cursor: pointer;
		span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
