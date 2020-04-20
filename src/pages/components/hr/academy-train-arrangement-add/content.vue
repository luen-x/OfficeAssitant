<template>
	<div class="v-hr-academy-train-arrangement-add">
		<div style="margin-top: 50px;">
			<oa-fitst-type v-show="type" @toNext="handleChangeNext"/>
			<oa-second-type v-show="!type" :datas="datas" @toPre="handleChangePre" />
		</div>
	</div>
</template>

<script>
import first from './first-type.vue';
import second from './second-type.vue';

export default {
	name: 'v-hr-academy-train-arrangement-add',
	components: {
		'oa-fitst-type': first,
		'oa-second-type': second,
	},
	data() {
		return {
			type: !this.$route.query.project_id,
			datas: {} // 第一步临时数据
		};
	},
	created() {
	},
	methods: {
		handleChangeNext(data) {
			this.type = false;
			this.datas = data;
		},
		handleChangePre(data) {
			this.type = true;
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
