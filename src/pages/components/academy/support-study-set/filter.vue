<template>
	<div>
		<div style="height: 36px;">
			<div v-if="$auth[1625]" class="g-red-btn-line g-fr" @click="handleCategory">添加类目</div>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddCategory } from './popup/add-category';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {};
	},
	methods: {
		handleCategory() {
			AddCategory.popup({
				store: this.$store
			}).then(() => {

			}).catch(() => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>

