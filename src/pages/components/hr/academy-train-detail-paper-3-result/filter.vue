<template>
	<div class="g-m-t-20">
		<div>
			<i-input
				v-model="param.search" 
				placeholder="请输入姓名、手机号码进行搜索" 
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleTextChange"
				@on-enter="handleSearch"
			/>

			<i-select
				v-show="['3', '4', '5', '6'].includes($route.query.type || '1')"
				v-model="param.is_effective"
				clearable
				style="width:220px"
				class="g-m-r-5"
				placeholder="请选择有效性"
				@on-change="handleSearch"
			>
				<i-option :value="1">有效</i-option>
				<i-option :value="2">无效</i-option>
			</i-select>
			<i-button 
				type="primary"
				class="g-red-btn-small"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			param: {
				search: String(query.search || ''),
				is_effective: Number(query.is_effective) || ''
			},
			show: false,
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/paper/3/result', 
				{ 
					...this.$route.query, 
					...this.param,
					fixPosition: true,
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleTextChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
