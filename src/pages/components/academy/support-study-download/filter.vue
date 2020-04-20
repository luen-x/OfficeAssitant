<template>
	<div class="v-academy-support-study-download-filter js-filter">
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="material_name	"
				clearable
				placeholder="请输入关键字搜索"
				style="width: 300px"
				@on-change="handleclear" />
			<i-button type="primary" class="g-m-l-5" @click="handleSearch">搜索</i-button>
			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10" @keyup.enter="handleSearch">
				<i-input
					v-model="staff_name"
					placeholder="请输入下载人"
					class="g-m-r-5"
					clearable
					style="width: 220px"
					@on-change="handleclear" />
				<oa-input-tree
					:title="category_name"
					v-model="category_id"
					:data-source="categoryList"
					style="display: inline-block;"
					@input="handleSearch"
					@on-change="handleclear"
				/>
				<i-date-picker
					v-model="create_time_start"
					:options="{disabledDate:startTimeDisable}"
					placeholder="请选择下载时间（开始）"
					class="g-m-r-5"
					type="date"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="create_time_end"
					:options="{disabledDate:endTimeDisable}"
					placeholder="请选择下载时间（结束）"
					type="date"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Tree, Poptip } from 'iview';
import { Expand } from 'wya-vc';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import inputTree from '../_common/study-manage/input-tree';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'vc-expand': Expand,
		'i-poptip': Poptip,
		'i-tree': Tree,
		'oa-input-tree': inputTree
	},
	data() {
		const { query = {} } = this.$route;
		return {
			material_name: String(query.material_name || ''),
			category_name: String(query.category_name || ''),
			category_id: String(query.category_id || ''),
			staff_name: String(query.staff_name || ''),
			create_time_start: String(query.create_time_start || ''),
			create_time_end: String(query.create_time_end || ''),
			material_use: String(query.material_use || ''),
			provider_name: String(query.provider_name || ''),
			show: false,
			classListArray: [],
			popVisible: '',
			poptipShow: false,
			categoryList: []
		};
	},
	created() {
		this.loadCategoryList();
	},
	methods: {
		handleclear(v) {
			if (!v.target.value) {
				this.category_id = '';
				this.handleSearch();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/support/study/download',
				{
					...this.$route.query,
					material_name: this.material_name,
					category_id: this.category_id,
					staff_name: this.staff_name,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					material_use: this.material_use,
					provider_name: this.provider_name,
					category_name: this.category_name,
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_INIT');
		},
		handleCheckedClassNode(v) {
			this.classListArray = [];
			let treeArray = this.$refs.classTree.getSelectedNodes();
			this.classListArray.push(treeArray[0]);
			this.popVisible = false;
			this.category_id = treeArray[0].nodeKey != 0 ? treeArray[0].category_id : '';
			this.handleSearch();
		},
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
				param: {
					need_top: 1,
				}
			}).then((res) => {
				let listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleStartTime(t) {
			this.create_time_start = t;
			this.handleSearch();
		},
		handleEndTime(t) {
			this.create_time_end = t;
			this.handleSearch();
		},
		startTimeDisable(date) {
			if (!this.end_time) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.end_time).subtract(1, 'month')) && moment(date).isBefore(moment(this.end_time)));
		},
		endTimeDisable(date) {
			if (!this.start_time) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.start_time).add(1, 'month')) && moment(date).isAfter(moment(this.start_time)));
		},
	}
};

</script>

<style lang="scss">
.v-academy-support-study-download-filter{
	._select-class {
        display: inline-block;
        box-sizing: border-box;
        vertical-align: middle;
        color: #515a6e;
        font-size: 12px;
        line-height: 32px;
        outline: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        position: relative;
        padding: 0 10px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdee2;
        transition: all 0.2s ease-in-out;
        ._tag {
            height: 24px;
            line-height: 22px;
            margin: 3px 4px 3px 0;
            display: inline-block;
            padding: 0 8px;
            border: 1px solid #e8eaec;
            border-radius: 3px;
            background: #f7f7f7;
            font-size: 12px;
            vertical-align: middle;
            opacity: 1;
            overflow: hidden;
            cursor: pointer;
        }
    }
    ._poptip-content {
        height: 200px;
        overflow-y: hidden;
        &:hover {
            overflow-y: auto;
        }
    }
}
</style>







