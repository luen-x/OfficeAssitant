<template>
	<oa-sale-expand :bar="false" class="js-filter v-hr-academy-course-paper-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入试卷名称搜索"
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
		<span v-if="$auth[1074] || $auth[1075]" slot="extra" class="g-fr" >
			<i-dropdown style="position: relative;top: 1px;">
				<span class="g-red-btn-line g-m-r-5" >
					新建
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item v-if="$auth[1074]" >
						<div style="text-align:center" @click="handleAddPaper('default')">新建试卷</div>
					</i-dropdown-item>
					<i-dropdown-item v-if="$auth[1075]" >
						<div style="text-align:center" @click="handleAddPaper('random')">随机试卷</div>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
			<i-dropdown v-if="$auth[1073]" style="position: relative;top: 1px;">
				<span class="g-red-btn-line g-m-r-5">
					更多
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item >
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
							>
								导入
								<i-icon v-if="importStatus.status==1" type="ios-loading" class="ivu-load-loop g-c-blue-mid"/>
							</div>
						</vc-upload>
					</i-dropdown-item>
					<i-dropdown-item >
						<div style="text-align:center" @click="handleDownload">下载导入模版</div>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</span>
		<div 
			class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
			style="padding-top: 3px;padding-bottom: 7px;"
		>
			<i-select 
				v-model="query.paper_type"
				placeholder="请选择试卷类型"
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			>
				<i-option :value="1">题目固定</i-option>
				<i-option :value="2">随机试卷</i-option>
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
import { OSS_TEMPLATE_FILE03 } from '@constants/constants';
import downloadFile from '@utils/download';
import API_ROOT from '@stores/apis/root';


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
				search: query.search || '',
				paper_type: Number(query.paper_type) || '',
				subject_id: '',
				...query,				
				subject_ids: query.subject_ids ? query.subject_ids.split(',').map(it => +it) : [],
			},
		};
	},
	computed: {
		importStatus() {
			return this.$store.state.hrAcademyCoursePaper.importStatus;
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
				'/hr/academy/course/paper',
				{
					...this.$route.query,
					...this.formatQuery(this.query)
				}
			));
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_INIT');
		}, 300),
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
		handleAddPaper(type) {
			this.$router.push('/hr/academy/course/paper/add?paper_type=' + type);
		},
		handleImport(url) {
			this.$request({
				url: "_HR_ACADEMY_COURSE_PAPER_IMPORT_POST",
				type: "POST",
				param: {
					oss_file_name: url
				},
				loading: false,
			}).then(res => {}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDownload() {
			window.open(OSS_TEMPLATE_FILE03, '_blank');
		},
		handleFileBefore() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_PERCENT_UPDATE', { status: 1, percent: 0 });
			return true;
		},
		handleFileSuccess(res) {
			this.handleImport(res.data.url);
		},
		handleError(res) {
			if (res.msg) {
				this.$Message.error(res.msg);
			} else {
				this.$Message.error("上传失败");
			}
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_PERCENT_UPDATE', { status: 3, percent: 0 });
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
.v-hr-academy-course-paper-filter {
	.ivu-dropdown-item {
		padding: 0;
		& > div {
			padding: 7px 16px;
		}
	}
}
</style>
