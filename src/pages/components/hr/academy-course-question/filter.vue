<template>
	<oa-sale-expand :bar="false" class="js-filter v-hr-academy-course-question-filter" style="margin-top:0px">
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
		<span slot="extra" class="g-fr" >
			<vc-debounce-click
				v-if="$auth[1052]" 
				class="g-red-btn-line g-dp-ib" 
				@click="handleAddQuestion"
			>
				新建题目
			</vc-debounce-click>
			<vc-debounce-click
				v-if="$auth[1053]" 
				class=" g-red-btn-line g-dp-ib g-m-l-5"
				@click="handleAudit">
				题目审核
			</vc-debounce-click>
			<i-dropdown v-if="$auth[1058] || $auth[1059]" style="position: relative;top: 1px;">
				<span class="g-red-btn-line g-m-l-5" >
					更多
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item v-if="$auth[1058]" >
						<vc-upload
							accept=".xlsx, .xls"
							@error="handleError"
							@file-before="handleFileBefore"
							@file-error="handleError"
							@file-success="handleFileSuccess"
						>
							<div
								class="g-tc"
								style="padding:7px 16px"
								@click="handleClickImport"
								@dbclick="event=>event.stopPropagation()"
							>
								导入 
								<i-icon v-if="importStatus.status==1" type="ios-loading" class="ivu-load-loop g-c-blue-mid"/>
							</div>
						</vc-upload>
						<!-- <div style="text-align:center" @click="handleImport">导入</div> -->
					</i-dropdown-item>
					<i-dropdown-item v-if="$auth[1059]">
						<div style="text-align:center" @click="handleExport">导出</div>
					</i-dropdown-item>
					<i-dropdown-item v-if="$auth[1058]">
						<div style="text-align:center" @click="handleDownloadTemplate">下载导入模板</div>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</span>
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
import { Input, Button, Icon, Select, Option, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { Upload } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import SaleExpand from '@components/sale/_common/expand';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { OSS_TEMPLATE_FILE04 } from '@constants/constants';


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
		'oa-sale-expand': SaleExpand,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'vc-upload': Upload

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
	computed: {
		importStatus() {
			return this.$store.state.hrAcademyCourseQuestion.importStatus;
		}
	},
	watch: {
		'query.subject_ids': function (val) {
			this.query.subject_id = val[val.length - 1] || '';
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/course/question',
				{
					...this.$route.query,
					...this.query
				}
			));
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_INIT');
		}, 300),
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
		},
		handleImport(url) {
			this.$request({
				url: "_HR_ACADEMY_COURSE_QUESTION_IMPORT_POST",
				type: "POST",
				param: {
					oss_file_name: url
				},
				loading: false,
			}).then(res => {}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDownloadTemplate() {
			window.open(OSS_TEMPLATE_FILE04, '_blank');


		},
		handleExport() {
			const { query = {} } = getParseUrl();
			window.open(getHashUrl(
				API_ROOT._HR_ACADEMY_COURSE_QUESTION_EXPORT_GET,
				{
					search: this.query.search,
					question_type: this.query.question_type,
					subject_id: this.query.subject_id,
					'-token': this.$global.token
				}
			), '_blank');
			
		},
		handleFileBefore() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_PERCENT_UPDATE', { status: 1, percent: 0 });
			return true;
		},
		handleFileSuccess(res) {
			this.handleImport(res.data.url);
		},
		handleError(err) {
			if (err.msg) {
				this.$Message.error(err.msg);
			}
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_PERCENT_UPDATE', { status: 3, percent: 0 });
		},
		handleClickImport() {
			if (this.importStatus.status == 1) {
				this.$Message.warning('正在导入中，请稍后...');
				window.event.stopPropagation();
			}
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-course-question-filter {
	.ivu-dropdown-item {
		padding: 0;
	& > div {
		padding: 7px 16px;
	}
}

}

</style>
