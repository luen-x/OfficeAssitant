<template>
	<div class="v-academy-train-plan-detail-sign">
		<i-tab
			v-model="type"
			:value="type"
			:animated="false"
			type="card"
			@on-click="handleChange"
		>

			<i-tab-pane label="签到设置" name="1">
				<oa-setting v-if="type == '1'" />
			</i-tab-pane>

			<i-tab-pane label="签到结果" name="2">
				<oa-result v-if="type == '2'" />
			</i-tab-pane>
		</i-tab>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane } from 'iview';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { isArray } from 'util';
import Setting from './setting.vue';
import Result from './result.vue';


export default {
	name: 'v-academy-train-plan-detail-sign',
	components: {
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-setting': Setting,
		'oa-result': Result
	},
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
		};
	},
	computed: {
	},
	created() {
		
	},
	methods: {
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
			};
			this.$router.replace(getHashUrl('/academy/train/plan/detail/sign', { ...query }));
		}
	},
};
</script>

<style lang="scss">
.v-academy-train-plan-detail-sign {
}
</style>
