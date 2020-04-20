<template>
	<div>
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
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<i-button 
			v-if="$auth[1069]"
			type="primary"
			class="g-m-l-10 g-fr"
			@click="handleToChooseQuestion"
		>
			去题库选题
		</i-button>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';
import { ChooseQuestion } from '../_common/academy-course/drawers/choose-question';

export default {
	name: 'oa-filter', 
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader
	},
	mixins: [services.subjectTree()],
	props: {
		paper_type: [Number | String],
		handleCheck: Function
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				paper_id: this.$route.query.paper_id,
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
				'/hr/academy/course/paper/edit',
				{
					...this.$route.query,
					...this.query
				}
			));
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_EDIT_LIST_INIT');
		}, 300),
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		async handleToChooseQuestion() {
			const canSelect = await this.handleCheck();
			if (canSelect) {
				ChooseQuestion.popup().then((res) => {
					this.$emit('select-question', res);
				});
			}
		}
	}
};
</script>

<style lang="scss">

</style>
