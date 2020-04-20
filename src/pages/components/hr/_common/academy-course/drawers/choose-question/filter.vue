<template>
	<div>
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入课程名称搜索"
			style="width: 220px"
			class="g-m-r-5"
			clearable
			@on-change="handleClear"
			@on-enter="handleSearch"
		/>
		<i-select 
			v-model="query.question_type"
			placeholder="选择题型"
			style="width: 220px" 
			class="g-m-r-5"
			clearable
			@on-change="handleSearch"
		>
			<i-option :value="1">单选题</i-option>
			<i-option :value="2">多选题</i-option>
			<i-option :value="3">判断题</i-option>
			<i-option :value="4">填空题</i-option>
			<i-option :value="5">问答题</i-option>
		</i-select>
		<i-cascader
			v-model="query.subject_ids"
			:data="subjectTree"
			clearable
			class="g-m-r-5"
			placeholder="请选择课题"
			style="width: 220px"
			@on-change="handleSearch"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn"
			@click="handleSearch"
		>搜索</i-button>
	</div>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import SaleExpand from '@components/sale/_common/expand';
import { services } from '@stores/services/hr';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'oa-sale-expand': SaleExpand
	},
	mixins: [services.subjectTree()],
	props: {
		value: Object
	},
	data() {
		return {
			query: { ...this.value },
		};
	},
	watch: {
		value(val) {
			this.query = { ...val, };
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$emit('search', this.query);
			this.$emit('input', this.query);
		}, 200),
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
