<template>
	<div class="js-filter">
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="search"
				placeholder="请输入素材名称进行搜索"
				clearable
				style="width: 300px"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>

			<span
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle"
			>
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<i-dropdown v-if="this.$auth[1619]" class="g-fr" >
				<div class="g-red-btn-line">
					上传素材
				</div>
				<i-dropdown-menu slot="list">
					<i-dropdown-item :name="1" >
						<!-- :before-upload="(files)=>handleFileBefore(files,1)" -->
						<oa-keep-upload
							:all-success="handleAllSuccess"
							:multiple="true"
							:error="(name)=>handleUploadFile(name)"
						>
							上传文件
						</oa-keep-upload>
					</i-dropdown-item>
					<i-dropdown-item :name="2">
						<oa-keep-upload
							:directory="true"
							:all-success="handleAllSuccess"
							:error="(name)=>handleUploadFile(name)"
						>
							上传文件夹
						</oa-keep-upload>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10" @keyup.enter="handleSearch">
				<i-input
					v-model="staff_name"
					placeholder="请输入上传人姓名"
					class="g-m-l-5"
					clearable
					style="width: 220px"
				/>
				<i-date-picker
					v-model="create_time_start"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-l-5"
					type="date"
					placeholder="请选择上传时间（开始时间）"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="create_time_end"
					:options="{disabledDate:endTimeDisable}"
					class="g-m-l-5"
					type="date"
					placeholder="请选择上传时间（结束时间）"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Dropdown, DropdownMenu, DropdownItem, Affix } from 'iview';
import { Expand, FilesPicker, Upload } from 'wya-vc';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_FILE_URL } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import net from '@utils/net';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { AddMaterial } from './popup/add-material';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'vc-expand': Expand,
		'vc-upload': Upload,
		'vc-files-picker': FilesPicker,
		'oa-keep-upload': KeepUpload
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: query.search || '',
			staff_name: query.staff_name || '',
			show: false,
			filesList: [], // 上传文件
			create_time_start: '', // 开始时间
			create_time_end: '', // 结束时间
			Folder: [], // 文件夹列表
			material_type: '',
			material_list: [],
			amount: '', // 文件夹上传数量
		};
	},
	mounted() {
		this.loadCategoryList();
	},
	methods: {
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
			}).then((res) => {
				this.categoryList = res.data || [];
				this.handleSearch();
			}).catch((err) => {
				console.error(err);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/support/study/manage',
				{
					...this.$route.query,
					search: this.search,
					staff_name: this.staff_name,
					material_type: this.material_type,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					category_id: this.$route.query.category_id || this.categoryList[0].category_id,
					category_name: this.$route.query.category_name || this.categoryList[0].category_name
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleUploadFile(res) {
			console.error(res);
		},
		handleInputChange(e) {
			if (!e.target.value) { this.handleSearch();	}
		},
		handleAllSuccess(fileList) {
			if (fileList.length == 0) return;
			let type = fileList[0].webkitRelativePath ? 2 : 1;
			let material_list = fileList.map(item => ({
				material_name: item.title,
				file_url: item.url,
				file_size: item.size,
				path: item.webkitRelativePath,
				type: item.webkitRelativePath ? 2 : 1 }));
			AddMaterial.popup({
				material_list,
				type
			}).then(() => {
			}).catch((err) => {
				err && console.error(err);
			});
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
			if (!this.create_time_end) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.create_time_end).subtract(1, 'year'))
			 && moment(date).isBefore(moment(this.create_time_end).add(1, 'day')));
		},
		endTimeDisable(date) {
			if (!this.create_time_start) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.create_time_start).add(1, 'year'))
			&& moment(date).isAfter(moment(this.create_time_start).subtract(1, 'day')));
		}
	}
};

</script>

<style lang="scss" scoped>

</style>





