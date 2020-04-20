<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search"
				clearable
				placeholder="请输入素材名称进行搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 btn-red"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
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
			<i-dropdown v-if="$auth[1605]" class="g-fr" >
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
			<vc-expand
				ref="expand"
				v-model="show"
			>
				<div
					class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
					style="padding-top: 3px;padding-bottom: 7px;"
				>
					<i-input
						v-model="staff_name"
						clearable
						placeholder="请输入发布人姓名"
						style="width: 220px"
						class="g-m-r-5"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<i-date-picker
						v-model="create_time_start"
						type="date"
						clearable
						placeholder="发布开始时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleStartTime"
					/>
					<i-date-picker
						v-model="create_time_end"
						type="date"
						placeholder="发布结束时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleEndTime"
					/>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { AddMaterial } from './popup/add-material';
import UploadPlan from '../_common/tookit-manage/upload-plan';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'oa-upload': UploadPlan,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'oa-keep-upload': KeepUpload
	},
	props: {
		classList: Array
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''),
			staff_name: String(query.staff_name || ''),
			create_time_start: String(query.create_time_start || ''),
			create_time_end: String(query.create_time_end || ''),
			show: false,
			categoryList: [],
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadCategoryList();
	},
	methods: {
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_ALL_GET',
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
				'/academy/support/tool/manage',
				{
					...this.$route.query,
					search: this.search,
					staff_name: this.staff_name,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					category_id: this.$route.query.category_id || this.categoryList[0].category_id,
					category_name: this.$route.query.category_name || this.categoryList[0].category_name,
					kit_type: this.$route.query.kit_type || this.categoryList[0].kit_type,
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
		},
		handleStartTime(data) {
			this.create_time_start = data;
			this.handleSearch();
		},
		handleEndTime(data) {
			this.create_time_end = data;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) { this.handleSearch();	}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		convertKey(arr, key) {
			let newArr = [];
			arr.forEach((item, index) => {
				let newObj = {};
				for (let i = 0; i < key.length; i++) {
					newObj[key[i]] = item[Object.keys(item)[i]];
				}
				newArr.push(newObj);
			});
			return newArr;
		},
		handleAllSuccess(fileList) {
			if (fileList.length == 0) return;
			let type = fileList[0].webkitRelativePath ? 2 : 1;
			let material_list = fileList.map(item => ({
				material_name: item.title,
				file_url: item.url,
				file_size: item.size,
				path: item.webkitRelativePath,
				type }));
			AddMaterial.popup({
				material_list,
				classList: this.classList,
				type,
			}).then(() => {
			}).catch((err) => {
				err && console.error(err);
			});
		},
		handleUploadFile(res) {
			console.error(res);
		},
		handleUpload(fileList) {
			if (fileList.length == 0) return;
			let type = fileList[0].webkitRelativePath ? 2 : 1;
			let material_list = fileList.map(item => ({
				material_name: item.title,
				file_url: item.url,
				file_size: item.size,
				path: item.webkitRelativePath,
				type }));
			AddMaterial.popup({
				material_list,
				type,
				// classList: this.classList,
			}).then(() => {
			}).catch((err) => {
				err && console.error(err);
			});
		}
	}
};

</script>

