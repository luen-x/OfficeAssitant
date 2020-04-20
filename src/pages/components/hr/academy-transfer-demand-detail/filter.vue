<template>
	<div class="js-filter g-m-t-20">
		<div>
			<i-input
				v-model="search.search"
				clearable
				placeholder="请输入应聘人姓名"
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-input
				v-model="search.teacher_search"
				clearable
				placeholder="请输入直属上级/讲师"
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-button
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button } from 'iview';
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: query.search ? query.search : '',
				teacher_search: query.teacher_search ? query.teacher_search : '',
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
				'/hr/academy/transfer/demand/detail',
				{
					...this.$route.query,
					...this.search,
					fixPosition: true
				}
			));
			this.$store.commit('HR_ACADEMY_TRANSFER_DEMAND_DETAIL_LIST_INIT');
		}, 300),
	}
};

</script>

<style lang="scss" scoped>

</style>
