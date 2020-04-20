<template>
	<div class="js-filter g-m-t-20">
		<div>
			<i-input
				v-model="search.applicant_name"
				clearable
				placeholder="请输入应聘人姓名"
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { createSearch, services } from '@stores/services/hr';
import { Button, Input } from "iview";

export default {
	name: 'oa-filter',
	components: {
		"i-button": Button,
		"i-input": Input
	},
	mixins: [
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			staff: query.staff_name || '',
			search: {
				...query,
				staff_name: query.staff_name || ''
			}
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/academy/transfer/statistics/teacher',
				{
					...this.search,
					fixPosition: true
				}
			));
			this.$store.commit('ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_INIT');
		}, 300)
	}
};
</script>

<style lang="scss" scoped>
</style>