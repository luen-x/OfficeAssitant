<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入题目关键词搜索"
			style="width: 300px"
			clearable
			@on-change="handleClear"
			@on-enter="handleSearch"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn g-m-l-10"
			@click="handleSearch"
		>搜索</i-button>
		<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
		<div 
			class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
			style="padding-top: 3px;padding-bottom: 7px;"
		>
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
		</div>
	</oa-sale-expand>
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
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				search: '',
				question_type: '',
				subject_id: '', 
				...query,
				subject_ids: query.subject_ids ? query.subject_ids.split(',').map(it => +it) : [],
			},
		};
	},
	watch: {
		'query.subject_ids': function (val) {
			this.query.subject_id = val[val.length - 1] || '';
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/course/question/audit',
				{
					...this.$route.query,
					...this.formatQuery(this.query)
				}
			));
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_INIT');
		}, 200),
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleAddQuestion() {
			this.$router.push('/hr/academy/course/question/add');

		},
		handleAudit() {
			this.$router.push('/hr/academy/course/question/audit');
			
		}
	}
};

</script>

<style lang="scss" scoped>
</style>
