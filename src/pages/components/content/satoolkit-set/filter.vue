<template>
	<div>
		<div v-if="this.$auth[628]" style="height: 36px;">
			<div class="g-red-btn-line g-fr" @click="handleCategory">添加类目</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-20">
				<i-input
					v-model="name"
					:maxlength="50"
					size="large"
					placeholder="请输入公司名称"
					style="width: 220px"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddCategory } from './popup/add-category';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/satoolkit/set',
				{
					...this.$route.query,
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_SATOOLKIT_SET_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
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
