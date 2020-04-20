<template>
	<div class="v-sale-material-upload-filter js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="keywords.material_name"
					placeholder="请输入素材名称" 
					clearable
					style="width:300px;height:32px;" 
					@on-enter="handleSearch"
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
			</div>
			<div>
				<i-button class="_btn g-m-r-10" @click="handleUploadMy">我的素材</i-button>
				<i-dropdown class="g-fr">
					<i-button class="g-c-red-mid" style="border: 1px solid #e84854;">
						上传素材
						<i class="iconfont icon-triangle-down g-fs-12" />
					</i-button>
					<i-dropdown-menu slot="list">
						<i-dropdown-item name="1" >
							<oa-keep-upload 
								:before-upload="(files)=>handleFileBefore(files, 1, '上传文件')"
								:all-success="(files) => handleAllSuccess(files, 1)"
							>
								<span>上传文件</span>
							</oa-keep-upload>
						</i-dropdown-item>
						<i-dropdown-item name="2">
							<oa-keep-upload 
								:directory="true" 
								:before-upload="(files)=>handleFileBefore(files, 2, '上传文件夹')"
								:all-success="(files) => handleAllSuccess(files, 2)"
							>
								<span>上传文件夹</span>
							</oa-keep-upload>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="keywords.material_use"
					clearable
					transfer
					placeholder="请选择素材用途"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in material_uses"
						:value="item.value + ''"
						:key="item.value"
					>
						{{ item.name }}
					</i-option>
				</i-select>
				<i-date-picker
					v-model="keywords.upload_time"
					format="yyyy-MM-dd"
					type="daterange"
					clearable
					split-panels
					placeholder="请选择上传日期"
					class="g-m-r-5"
					@on-change="handleDateChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { uploadBefore } from '@components/content/_common/upload.config';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { FractionMaterialUpload } from './popup/index';

export default {
	name: 'oa-material-upload-filter',
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
		'oa-keep-upload': KeepUpload
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			material_uses: [],
			material_id: '', // 素材id
			keywords: {
				material_name: '', // 素材名称
				material_use: '', // 素材用途
				create_time_start: '', // 上传开始日期
				create_time_end: '', // 上传结束日期
				...query,
				upload_time: [query.create_time_start, query.create_time_end]
			}
		};
	},
	mounted() {
		this.loadMaterialUse();
		this.$vc.on('query-change', () => {
			let { query = {} } = getParseUrl();
			this.keywords = {
				material_name: '', // 素材名称
				material_use: '', // 素材用途
				create_time_start: '', // 上传开始日期
				create_time_end: '', // 上传结束日期
				...query
			};
		});
	},
	beforeDestroy() {
		this.$vc.off('query-change');
	},
	methods: {
		/**
		 * 获取素材用途
		 */
		loadMaterialUse() {
			this.$request({
				url: '_SALE_LIBRARY_MATERIAL_USE_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				this.material_uses = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 监听申请时间（时间段）的on-change事件
		 */
		handleDateChange(arr) {
			this.keywords.create_time_start = arr[0];
			this.keywords.create_time_end = arr[1];
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/fraction/material/upload',
				{
					...this.keywords,
					fixPosition: true,
					upload_time: undefined
				}
			));
			this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 我的素材
		 */
		handleUploadMy() {
			this.$router.push({
				name: 'sale-fraction-material-upload-my'
			});
		},
		handleFileBefore(files, fileType, title) {
			let fileList = [];
			return uploadBefore(files).then(data => {
				if (fileType === 1) {
					fileList = files.map(it => ({
						type: 1,
						material_name: it.name,
						file_url: '',
						file_size: it.size,
					}));
				} else {
					fileList = files.map(it => {
						return {
							path: it.webkitRelativePath,
							type: 2,
							material_name: it.name,
							file_url: '',
							file_size: it.size,
						};
					});
				}
				return FractionMaterialUpload.popup({
					title,
					type: fileType,
					fileList,
					isFolder: fileType === 2,
					isRepeat: false
				}).then((res) => {
					return { material_id: res.material_id, fileType };
				}).catch(res => {
					return false;
				});
			}).catch(err => {
				this.$Message.error(err.msg);
				return false;
			});
		},
		handleAllSuccess(fileList, fileType) {
			let material_list = [];
			if (!fileList.length) return;

			if (fileType === 1) {
				material_list = fileList.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
				}));
			} else {
				material_list = fileList.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
					path: it.webkitRelativePath,
				}));
			}
			this.$request({
				url: '_SALE_LIBRARY_DOWNLOAD_SUCCESS_POST',
				type: 'post',
				param: {
					is_control_role: 1,
					material_id: fileList[0].material_id,
					type: fileType,
					material_list
				},
				autoTip: true
			}).then((res) => {
				setTimeout(() => {
					this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_INIT');
				}, 300);
			}).catch((err) => {});
		}
	}
};

</script>

<style lang="scss">
.v-sale-material-upload-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	._upload {
		border-color: #e84854;
		color: #e84854;
	}
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
