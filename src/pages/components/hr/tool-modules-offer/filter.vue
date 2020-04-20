<template>
	<div>
		<i-input
			v-model="keywords.offer_name" 
			clearable
			placeholder="请输入模板名称" 
			style="width: 220px; margin-right: 5px" 
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
		<i-date-picker 
			:value="keywords.update_time" 
			type="date"
			style="width: 220px;" 
			transfer
			placeholder="请选择修改时间"
			@on-change="handleSearch({'update_time': $event})" 
		/>
		<div
			style="display: inline-block;"
			class="g-m-l-10 g-red-btn-small"
			@click="handleSearch">
			搜索
		</div>
		<div v-if="$auth[290]" class="g-red-btn-line g-fr" @click="handleAdd">
			新增模板
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { AddModal } from './popup/add';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: { 
				...query,
			},
			show: false,
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (value) {
			this.$router.replace(getHashUrl(
				'/hr/tool/modules/offer', 
				{ 
					...this.$route.query, 
					...this.keywords,
					...value
				}
			));
			this.$store.commit('HR_TOOL_MODULES_OFFER_INIT');
		}, 300),
		handleChange(value, type) {
			this.keywords[type] = value;
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleAdd() {
			AddModal.popup({
				title: '新增模板'
			}).then((res) => {

			}).catch((error) => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
