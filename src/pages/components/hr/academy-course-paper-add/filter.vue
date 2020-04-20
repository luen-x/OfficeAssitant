<template>
	<div class="js-filter">
		<i-input
			v-model="query.search" 
			placeholder="请输入关键字搜索" 
			style="width: 220px" 
			class="g-m-r-5"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-select 
			v-model="query.question_type"
			placeholder="选择题型"
			style="width: 220px" 
			class="g-m-r-5"
			clearable
			@on-change="handleSearch"
		>
			<i-option value="1">单选题</i-option>
			<i-option value="2">多选题</i-option>
			<i-option value="3">判断题</i-option>
			<i-option value="4">填空题</i-option>
			<i-option value="5">问答题</i-option>
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
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
		

	</div>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader
	},
	mixins: [services.subjectTree()],
	data() {
		const { query = {} } = this.$route;
		const subject_ids = this.$route.query.subject_ids ? this.$route.query.subject_ids.split(',') : [];

		return {
			query: {
				search: '',
				question_type: '',
				subject_id: subject_ids[subject_ids.length - 1] || '',
				...query,
				subject_ids

			},
		};
	},
	watch: {
		'questionStatic.allScore': function (val) {
			if (val < this.formData.pass_score) {
				this.formData.pass_score = val;
			}
		},
		'query.subject_ids': function (val) {
			this.query.subject_id = val[val.length - 1] || '';
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/course/paper/add',
				{
					...this.$route.query,
					...this.query,
					subject_ids: ''
				}
			));
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_INIT');
		}, 100),
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
