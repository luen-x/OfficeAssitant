<template>
	<div class="g-m-t-20">
		<i-input
			v-model="keyword"
			:maxlength="50"
			placeholder="请输入公司名称或电话搜索" 
			style="width: 320px"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-button 
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<div class="g-fr">  
			<oa-manul-upload :input-option="{accept:'.xls, .xlsx'}" @change="handleImport" >
				<span class="g-red-btn-line">
					导入查询
				</span>
			</oa-manul-upload>
			<vc-debounce-click
				class="g-red-btn-line g-m-l-5" 
				@click="handleFresh"
			>
				重新查询
			</vc-debounce-click>
			<i-dropdown style="position: relative;vertical-align: bottom;">
				<span class="g-red-btn-line g-m-l-5">
					<span style="position: relative;top: -2px;">更多</span>
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item>
						<div style="text-align:center" @click="handleDownload">模版下载</div>
					</i-dropdown-item>
					<i-dropdown-item>
						<div style="text-align:center" @click="stopImport(1)">停止导入</div>
					</i-dropdown-item>
					<i-dropdown-item>
						<div style="text-align:center" @click="stopImport(2)">停止重新查询</div>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
	</div>
</template>

<script>
import { Input, Button, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import API_ROOT from "@stores/apis/root";
import { Upload } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem, setItem } from '@utils/utils';
import { OSS_TEMPLATE_FILE01 } from '@constants/constants';
import ManulUpload from '../_common/manul-upload/upload';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'vc-upload': Upload,
		'oa-manul-upload': ManulUpload
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			stopUrls: {
				1: '_SALE_INTENTION_PRIVATE_STOP_IMPORT_GET',
				2: '_SALE_INTENTION_PRIVATE_STOP_REIMPORT_GET'
			}
		};
	},
	created() {
		if (this.$route.query.reload) {
			this.updateList();
			const query = { ...this.$route.query };
			delete query.reload;
			this.$router.replace({
				path: this.$route.path,
				query
			});
		}
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/intention/private', 
				{ 
					...this.$route.query, 
					keyword: this.keyword,
				}
			));
			this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_INIT');
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleDownload() {
			window.open(OSS_TEMPLATE_FILE01, '_blank');
		},
		/**
		 * 重新查询
		 */
		async handleFresh() {
			const ok = await this.checkBeforeImport(2);
			if (!ok) return;
			this.updateLoading({ tip: '', status: 1, deal_type: 2 });
			this.$request({
				url: "_SALE_INTENTION_PRIVATE_REIMPORT",
				type: "POST",
				param: {},
				loading: false,
			}).then(res => {
				this.updateLoading({ tip: res.data.return_tips || '', status: 1, deal_type: 2 });
			}).catch((res) => {
				console.error(res);
				this.updateLoading({ process: '', status: 0, deal_type: 0 });
				this.$Message.error(res.msg);

			});
			
		},
		/**
		 * 每次进入页面时自动刷新数据
		 */
		updateList() {
			this.$request({
				url: "_SALE_INTENTION_PRIVATE_UPDATE_LIST_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		/**
		 * 导入文件，直接传给后端
		 */
		async handleImport(files) {
			const ok = await this.checkBeforeImport(1);
			if (!ok) return;
			this.updateLoading({ tip: '', status: 1, deal_type: 1 });
			let data = new FormData();
			data.append('file_data', files[0]);
			fetch(API_ROOT._SALE_INTENTION_PRIVATE_IMPORT, {
				method: 'post',
				body: data,
				headers: {
					'-token': this.$global.token,
				},
				credentials: 'include'
			}).then(async (res) => {
				const { msg, status, data: { return_tips } } = await res.json();

				if (status) {
					this.$Message.success('文件上传成功，正在导入');
					this.updateLoading({ tip: return_tips, status: 1, deal_type: 0 });
				} else {
					this.$Message.error(msg || '上传失败');
					this.updateLoading({ process: '', status: 0, deal_type: 0 });
				}
			}).catch(err => {
				console.error('error', err);
				this.$Message.error('上传失败');
				this.updateLoading({ process: '', status: 0, deal_type: 0 });
			});
		},
		/**
		 * 更新loading状态
		 */
		updateLoading(status) {
			this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_PERCENT_UPDATE', status);
		},
		/**
		 * 导入/重新查询前的验证
		 * type：1 导入的验证， 2 重新查询的验证
		 */
		checkBeforeImport(type) {
			return this.$request({
				url: "_SALE_INTENTION_PRIVATE_CHECK_BEFORE_IMPORT_GET",
				type: "GET",
				param: {
					type
				},
				loading: false,
			}).then(res => {
				return 1;
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
				return 0;
			});
			
		},
		/**
		 * 停止导入查询/重新查询
		 * type：1 导入， 2 重新查询
		 */
		stopImport(type) {
			if (![1, 2].includes(type)) return console.error('stopImport type error, type=' + type);
			this.$request({
				url: this.stopUrls[type],
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				setItem('sale_customer_private_need_filter' + this.$global.version, 1);
				this.updateLoading({ process: '', status: 0, deal_type: 0 });

			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>

<style lang="scss" >

</style>