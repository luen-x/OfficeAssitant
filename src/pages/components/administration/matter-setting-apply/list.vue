<template>
	<div class="g-flex g-fw-w g-pd-20">
		<oa-item
			v-for="(item, index) of listInfo"
			:key="index"
			:data="item"
			:load-data="loadData"
		/>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import Item from './item';

export default {
	name: 'oa-tpl',
	components: {
		'oa-item': Item
	},
	data() {
		return {
			listInfo: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_MATTER_APPLY_LIST_GET,
				type: 'GET',
				loading: false
			}).then(res => {
				this.listInfo = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
