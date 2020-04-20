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
			<i-select
				ref="staff"
				:value="search.staff_id"
				:remote-method="loadStaff"
				:loading="staffLoading"
				class="g-m-r-5"
				style="width: 220px;"
				filterable
				remote
				clearable
				transfer
				label-in-value
				placeholder="请选择授课讲师"
				@on-change="handleStaffChange"
				@on-query-change="handleQueryChange"
			>
				<i-option
					v-for="(item, index) in staffData"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-input
				v-model="search.course_name"
				clearable
				placeholder="请输入课程名称"
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
import { Button, Input, Select, Option } from "iview";

export default {
	name: 'oa-filter',
	components: {
		"i-button": Button,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option
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
				staff_id: query.staff_id ? +query.staff_id : '',
				staff_name: query.staff_name || '',
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
		handleStaffChange(value) {
			this.search.staff_id = value ? value.value : '';
			this.search.staff_name = value ? value.label : '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.search.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/transfer/teacher/detail',
				{
					...this.search,
					fixPosition: true
				}
			));
			this.$store.commit('HR_ACADEMY_TRANSFER_TEACHER_DETAIL_LIST_INIT');
		}, 300),
	}
};

</script>

<style lang="scss" scoped>

</style>
