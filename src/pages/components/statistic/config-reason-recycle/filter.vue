<template>
	<div>
		<div>
			<i-input
				v-model="search.reason_name" 
				:maxlength="50"
				clearable
				placeholder="请输入退款具体原因" 
				style="width: 220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-select
				v-model="search.category_id"
				clearable
				transfer
				style="width:220px;"
				class="g-m-r-10"
				placeholder="请选择原因大类"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in category"
					:value="item.value"
					:key="index"
				>
					{{ item.label }}
				</i-option>
			</i-select>
		</div>
	</div>
</template>

<script>
import { Input, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				reason_name: String(query.reason_name || ''),
				category_id: String(query.category_id || '')
			},
			category: []
		};
	},
	created() {
		this.loadReasonData();
	},
	methods: {
		loadReasonData() {
			this.$request({
				url: '_STATISTIC_CONFIG_REASON_CATEGORY_LIST_GET',
				type: "GET",
				param: {}
			}).then(res => {
				this.category = [];
				res.data.forEach(item => {
					this.category.push({
						label: item.category_name,
						value: String(item.category_id)
					});
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/config/reason/recycle', 
				{ 
					...this.$route.query, 
					...this.search
				}
			));
			this.$store.commit('STATISTIC_CONFIG_REASON_RECYCLE_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>