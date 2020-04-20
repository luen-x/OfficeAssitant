<template>
	<div class="js-filter g-m-t-20">
		<div>
			<i-cascader
				:data="departAll"
				v-model="try_depart_id"
				:change-on-select="true"
				placeholder="请选择组织/部门"
				trigger="click"
				clearable
				transfer
				style="width: 220px;display:inline-block"
				class="g-m-r-5"
				@on-change="handleSearch"/>
			<i-select
				v-model="talent_resource"
				placeholder="请选择人才来源"
				style="width: 220px"
				clearable
				transfer
				class="g-m-r-5"
				@on-change="handleSearch">
				<i-option
					v-for="item in talentResource"
					:key="item.label"
					:value="item.value">
					{{ item.label }}
				</i-option>
			</i-select>
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
import { services, staffByMutiTerm } from '@stores/services/hr';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
	},
	mixins: [
		services.departAll(),
		services.talentResource()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			talent_resource: Number(query.talent_resource),
			try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : []
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/hr/academy/transfer/try/detail',
				{
					...query,
					fixPosition: true,
					try_depart_id: this.try_depart_id,
					talent_resource: this.talent_resource,
				}
			));
			this.$store.commit('HR_ACADEMY_TRANSFER_TRY_DETAIL_LIST_INIT');
		}, 300),
	}
};

</script>

<style lang="scss" scoped>

</style>
