<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-service-strategy"
		@on-close="handleCancel" >

		<h2 class="_detail-header g-fs-16 g-m-b-20">
			{{ serviceName }}-攻略
		</h2>

		<div class="_detail-content">
			<i-table
				ref="tableTarget"
				:loading="loading"
				:columns="serviceStrategy"
				:data="list"
				stripe
				@on-selection-change="handleSelectionChange"
			/>
		</div>
		<div class="_btn-box g-flex g-ai-c">
			<div style="margin-left:450px;">
				<i-checkbox
					v-model="checkAll"
					@on-change="handleSelectAll"
				>
					&nbsp;&nbsp;全选
				</i-checkbox>
				<vc-debounce-click
					:tag="Button"
					@click="handleDownload('many',{})"
				>
					下载
				</vc-debounce-click>
			</div>
			<i-page
				:total="totalCount"
				:current="currentPage"
				:page-size="pageSize"
				show-total
				show-elevator
				show-sizer
				class="g-m-l-10"
				@on-change="handleChange"
				@on-page-size-change="handlePageSizeChange"
			/>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Table, Button, Page, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import { FilePreview } from '@common/file-preview/file-preview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import orderModal from '@extends/mixins/orderModal';
import downloadFile from '@utils/download';
import { getHashUrl } from '@utils/utils';

export default {
	name: "oa-service-strategy",
	components: {
		'i-drawer': Drawer,
		'i-table': Table,
		'i-button': Button,
		'i-page': Page,
		"i-checkbox": Checkbox
	},
	mixins: [orderModal],
	props: {
		setId: [String, Number],
		serviceId: [String, Number],
		serviceName: String,
		serviceItemId: [String, Number],
		contractCompanyId: [String, Number],
	},
	data() {
		return {
			visible: false,
			loading: false,
			checkAll: false,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
			list: [], // 攻略列表
			imageArr: [], // 图片文件数组
			serviceStrategy: [// 攻略
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '文件名',
					key: 'material_name',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip
									content={params.row.material_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '上传时间',
					key: 'create_date',
					minWidth: 160
				},
				{
					title: '大小',
					key: 'file_size',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div class="g-flex g-jc-sb g-ai-c">
								<span>{params.row.file_size}</span>
								<div>
									<vc-debounce-click
										tag="i"
										class="iconfont icon-download g-m-l-10 g-pointer g-fs-18"
										style="color:#2397f9"
										onClick={() => {
											this.handleDownload('one', params.row, params.row.material_id);
										}}
									/>
									<vc-debounce-click
										tag="i"
										class="iconfont icon-preview g-m-l-10 g-pointer g-fs-18"
										style="color:#2397f9"
										onClick={(e) => {
											this.handlePreview(e, params.row.file_url);
										}}
									/>
								</div>
							</div>
						);
					}
				}
			],
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.loadData({ page: 1 });
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(initPage) {
			this.checkAll = false;
			this.loading = true;
			this.list = [];

			this.$request({
				url: '_SALE_SERVICE_STRATEGY_GET',
				type: "GET",
				loading: false,
				param: {
					set_id: this.setId,
					service_id: this.serviceId,
					service_item_id: this.serviceItemId,
					contract_company_id: this.contractCompanyId,
					...initPage,
					pageSize: this.pageSize
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.list = res.data.list;

				this.imageArr = this.list.filter((item) => {
					let url = item.file_url;
					return url.indexOf('.png') > -1 || url.indexOf('.jpg') > -1 || url.indexOf('.gif') > -1;
				}).map((item) => item.file_url);
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 监听页码的变化
		 */
		handleChange(page) {
			this.loadData({ page });
		},
		/**
		 * 监听每页显示条数的变化
		 */
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.loadData({ page: 1 });
		},
		handleSelectionChange(selection) {
			if (selection.length >= this.list.length) {
				this.checkAll = true;
			} else {
				this.checkAll = false;
			}
		},
		/**
		 * 全选
		 */
		handleSelectAll(val) {
			 this.$refs.tableTarget.selectAll(val);
		},
		/**
		 * 下载预警
		 */
		downloadWarning(download_num) {
			return this.$request({
				url: 'TOOLKIT_DOWNLOAD_WARNING_POST',
				type: 'POST',
				loading: false,
				param: {
					material_type: 4,
					download_num: download_num || 1
				},
				autoTip: false
			}).then(res => {
				if (res.status) {
					return true;
				} else {
					return false;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				return false;
			});
		},
		/**
		 * 下载
		 */
		async handleDownload(str, { file_url, type }, material_id) {
			const selectedRows = this.$refs.tableTarget.getSelection();

			if (str == 'many') { // 批量下载
				if (selectedRows.length) {
					let selectALlFile = [];
					let num = 0;
					selectedRows.forEach((ele, index) => {
						if (ele.type == 2) {
							// const file_list =
						 this.loadAllFile(ele.material_id).then(res => {
								num++;
								selectALlFile = selectALlFile.concat(res);
								if (num == selectedRows.length) {
									this.downloadWarning(selectALlFile.length).then(can_download => {
										if (can_download) {
											selectALlFile.forEach(item => {
												downloadFile({
													fileName: item.file_url,
													downRecordParams: {
														type: 4,
														material_ids: [item.material_id]
													}
												});
											});
										}
									});
								}
							});
						} else {
							num++;
							selectALlFile.push({ file_url: ele.file_url });
						}
					});
					if (num == selectedRows.length) {
						const can_download = await this.downloadWarning(selectALlFile.length);
						if (can_download) {
							selectALlFile.forEach(item => {
								downloadFile({
									fileName: item.file_url,
									downRecordParams: {
										type: 4,
										material_ids: [item.material_id]
									}
								});
							});
						}
					}
					return;
				} else {
					this.$Message.warning('请至少选择一项进行操作！');
					return;
				}
			} else if (str == 'one') { // 单个下载
				if (type == 2) {
					const file_list = await this.loadAllFile(material_id);
					const can_download = await this.downloadWarning(file_list.length);
					if (!can_download) return;
					file_list.forEach(ele => {
						downloadFile({
							fileName: ele.file_url,
							downRecordParams: {
								type: 4,
								material_ids: [material_id]
							}
						});
					});
				} else {
					const can_download = await this.downloadWarning();
					if (can_download) {
						downloadFile({
							fileName: file_url,
							downRecordParams: {
								type: 4,
								material_ids: [material_id]
							}
						});
					}
				}
			}
		},
		loadAllFile(material_id) {
			return this.$request({
				url: "_ACADEMY_SUPPORT_TOOL_FOLDER_ALL_GET",
				type: "GET",
				param: {
					material_id
				},
				loading: false,
			}).then(res => {
				return res.data.map(v => { return { file_url: v.path }; });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		/**
		 * 预览
		 */
		handlePreview(e, file_url) {
			this.$emit('preview-start');
			FilePreview.popup({
				data: {
					fileUrl: file_url,
					x: e.clientX,
					y: e.clientY
				}
			}).then((res) => {

			}).catch((err) => {

			}).finally(() => {
				this.$emit('preview-end');
			});
		}
	}
};

export const ServiceStrategy = CreatePortal({ alive: true }, module.exports.default);

</script>
<style lang="scss">
.v-sale-service-strategy {
	._detail-header {
		color: #000;
		padding: 0 16px 16px 0;
		margin-left: 16px;
		font-weight: normal;
		border-bottom: 1px solid #d4d7db;
	}
	._detail-content {
		padding-left: 16px;
	}
	._btn-box {
		width: 100%;
		height: 60px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		border-top: 1px solid #e8e8e8;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer-body {
		padding: 16px 16px 16px 0;
	}
}
</style>
