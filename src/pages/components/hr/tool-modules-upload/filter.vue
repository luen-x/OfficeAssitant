<template>
	<div v-if="0">
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
			placeholder="请选择修改日期"
			@on-change="handleSearch({'update_time': $event})"
		/>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>

		<div v-if="$auth[293]" class="g-red-btn-line g-fr" @click="handleAdd">
			新增模板
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import lodash from 'lodash';
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
				update_time: ''
			},
			show: false,
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (value) {
			this.$router.replace(getHashUrl(
				'/hr/tool/modules/upload',
				{
					...this.$route.query,
					...this.keywords,
					...value
				}
			));
			this.$store.commit('HR_TOOL_MODULES_UPLOAD_INIT');
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
				title: '新增模板',
				parent: { $store: this.$store }
			}).then((res) => {

			}).catch((error) => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
