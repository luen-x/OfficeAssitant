<template>
	<div>
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="search"
				placeholder="请输入素材名称或素材提供人"
				clearable
				style="width: 300px"
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
			<i-dropdown v-if="this.$auth[1197]" class="g-fr" >
				<div class="g-red-btn-line">
					上传素材
				</div>
				<i-dropdown-menu slot="list">
					<i-dropdown-item :name="1" >
						<oa-keep-upload
							:before-upload="(files)=>handleFileBefore(files,1)"
							:all-success="handleAllSuccess"
							:error="(name)=>handleUploadFile(name)"
						>
							上传文件
						</oa-keep-upload>
					</i-dropdown-item>
					<i-dropdown-item :name="2">
						<oa-keep-upload
							:directory="true"
							:before-upload="(files)=>handleFileBefore(files,2)"
							:all-success="handleAllSuccess"
							:error="(name)=>handleUploadFile(name)"
						>
							上传文件夹
						</oa-keep-upload>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
		<div v-if="$route.query.test">
			<oa-keep-upload
				:directory="true"
				:before-upload="(files)=>handleFileBefore(files,2)"
			>
				<i-button> 测试上传文件</i-button>
			</oa-keep-upload>
			<oa-keep-upload
				:all-success="handleAllSuccess"
				:error="(name)=>handleUploadFile(name)"
			>
				<i-button> 上传文件</i-button>
			</oa-keep-upload>
			<oa-keep-upload
				:directory="true"
				:before-upload="(files)=>handleFileBefore(files,2)"
				:all-success="handleAllSuccess"
			>
				<i-button> 上传文件夹</i-button>
			</oa-keep-upload>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10">
				<i-select
					v-model="material_type"
					style="width: 220px"
					clearable
					placeholder="请选择素材类型"
					@on-change="handleSearch">
					<i-option v-for="item in materialType" :key="item.value" :value="item.value+''">{{ item.name }}</i-option>
				</i-select>
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
import { UploadFiles } from './popup/upload-files';
import { ServiceMaterial } from './popup/service-material';
import util from '../_common/util';
import { uploadBefore } from '../_common/upload.config';

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
	mixins: [
		 util
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: query.search || '',
			name: query.name || '',
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
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/material/bank',
				{
					...this.$route.query,
					is_control_role: 0,
					search: this.search,
					material_type: this.material_type,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end
				}
			));
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleUploadFile({ name }) {
			this.$request({
				url: '_CONTENT_LIBRARY_MATERIAL_UPLOAD_FAIL_POST',
				type: 'post',
				param: {
					material_name: name
				},
			}).then((data) => {
			}).catch((err) => {
				console.error(err, 'err');
			});
		},
		handleFileBefore(file, fileType) {
			return uploadBefore(file).then(data => {
				return UploadFiles.popup({
					data: {
						file,
						check: false,
						fileType,
						category_id: this.$route.query.category_id || '',
						category_name: this.$route.query.category_name || ''
					}
				}).then((res) => {
					return { material_id: res.data.material_ids[0], fileType };
				}).catch(res => {
					return false;
				});
			}).catch(err => {
				this.$Message.error(err.msg);
				return false;
			});
		},
		handleAllSuccess(fileList) {
			if (fileList.length == 0) return;
			let material_list = fileList.map(item => ({
				material_name: item.title,
				file_url: item.url,
				file_size: item.size,
				path: item.webkitRelativePath,
			}));
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_UPLOAD_SUCCESS_POST',
				type: 'post',
				param: {
					is_control_role: 0,
					material_id: fileList[0].material_id,
					type: fileList[0].fileType,
					material_list
				},
			}).then((data) => {
				this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
				this.$Message.success(data.msg);
			}).catch((err) => {
				this.$Message.error(err.msg);
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
