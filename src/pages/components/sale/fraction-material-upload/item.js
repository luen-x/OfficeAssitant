import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { uploadBefore } from '@components/content/_common/upload.config';
import { PreviewFolder } from "@components/content/config-material-check/popup/preview-folder";
import { FractionMaterialUpload } from './popup/index';
import { FractionMaterialUploadEdit } from './popup/edit';
import { FractionMaterialUploadInfo } from "../_common/material/upload-info";

let columnsStore = {};
export default {
	data() {
		const baseColumns = [
			{
				title: '素材名称',
				key: 'material_name',
				width: 250,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.material_name}
								theme="dark"
								placement="bottom"
								labelClass="g-operation"
							/>
						</div>
					);
				}
			},
			{
				title: '素材用途',
				key: 'material_use_name',
				minWidth: 120,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.material_use_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '上传素材简介',
				key: 'describe',
				minWidth: 250,
				render: (h, { row }) => {
					return (
						<div>
							{
								row.describe ? <AutoTooltip 
									content={row.describe}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/> : '--'
							}
						</div>
					);
				}
			},
			{
				title: '素材提供人',
				key: 'provider_list',
				minWidth: 120,
				render: (h, { row }) => {
					const provider_list = row.provider_list;
					return (
						<div>
							{
								provider_list.length ? <AutoTooltip 
									content={provider_list.map(it => it.staff_name).join(' | ')}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/> : <span class="g-c-black3">--</span>
							}
						</div>
					);
				}
			},
			{
				title: '上传人',
				key: 'staff_name',
				minWidth: 120,
			},
			{
				title: '上传时间',
				key: 'create_time',
				minWidth: 160,
			}
		];
		const extraOptColumns = {
			'1': {
				title: '操作',
				key: 'opt',
				align: 'center',
				width: 100,
				render: (h, { row }) => {
					return (
						<div 
							class="g-pointer" 
							onClick={(e) => e.stopPropagation()}
						>
							<Dropdown
								transfer 
								trigger="hover" 
								placement="left-start"
							>
								<i class="iconfont icon-point g-fs-20"/>
								<DropdownMenu slot="list">
									<div>
										{
											!row.file_url && <div>
												<DropdownItem>
													<KeepUpload 
														beforeUpload={(files) => { 
															return uploadBefore(files).then(() => ({})).catch(err => {
																this.$Message.error(err.msg);
																return false;
															}); 
														}}
														allSuccess={(files) => { 
															this.handleFileUpload(files, 1, row.material_id); 
														}}
													>
														<span>上传文件</span>
													</KeepUpload>
												</DropdownItem>
												<DropdownItem>
													<KeepUpload 
														directory={true}
														beforeUpload={(files) => { 
															return uploadBefore(files).then(() => ({})).catch(err => {
																this.$Message.error(err.msg);
																return false;
															}); 
														}}
														allSuccess={(files) => { 
															this.handleFileUpload(files, 2, row.material_id); 
														}}
													>
														<span>上传文件夹</span>
													</KeepUpload>
												</DropdownItem>
											</div>
										}
										{
											this.$auth[262] && <div onClick={() => { this.handleEdit(row); }}>
												<DropdownItem name="3">重新编辑</DropdownItem>
											</div>
										}
										{
											this.$auth[263] && <div onClick={() => { this.handleReset(row); }}>
												<DropdownItem name="4">撤回</DropdownItem>
											</div>
										}
									</div>
								</DropdownMenu>
							</Dropdown>
						</div>
					);
				}
			},
			'2': {
				title: '操作',
				key: 'opt',
				width: 100,
				render: (h, { row }) => {
					return (
						<div 
							class="g-operation" 
							onClick={(e) => e.stopPropagation()}
						>
							{
								this.$auth[264] && <span 
									onClick={() => {
										this.handleView(row);
									}}
								>
										查看
								</span>
							}
						</div>
					);
				}
			},
			'3': {
				title: '操作',
				key: 'opt',
				width: 100,
				render: (h, { row }) => {
					return (
						<div 
							class="g-operation" 
							onClick={(e) => e.stopPropagation()}
						>
							<div>
								{
									(row.type === 1 && this.$auth[265]) && <KeepUpload 
										beforeUpload={(files) => { 
											return this.handleFileBefore(files, 1, '重新申请', row.material_id); 
										}}
										allSuccess={(files) => { 
											this.handleAllSuccess(files, 1); 
										}}
									>
										<span>重新提交</span>
									</KeepUpload>
								}
								{
									(row.type === 2 && this.$auth[265]) && <KeepUpload 
										directory={true}
										beforeUpload={(files) => { 
											return this.handleFileBefore(files, 2, '重新申请', row.material_id); 
										}}
										allSuccess={(files) => {
											this.handleAllSuccess(files, 2); 
										}}
									>
										<span>重新提交</span>
									</KeepUpload>
								}
							</div>
						</div>
					);
				}
			}
		};
		return {
			material_id: '',
			indexMap: { '1': 0, '2': 1, '3': 2 },
			baseColumns,
			extraOptColumns
		};
	},
	methods: {
		getColumns(type) {
			if (columnsStore[type]) {
				return columnsStore[type];
			} else {
				let showColumns = [];
				let temp1 = [...this.baseColumns];
				let temp2 = [...this.baseColumns];
				if (type === '2') {
					temp1.splice(2, 1);
					temp1.splice(1, 0, {
						title: '素材类型',
						key: 'material_type_name',
						minWidth: 120
					});
					temp1.splice(4, 0, {
						title: '主要分享者',
						key: 'sharer_list',
						minWidth: 120,
						render: (h, { row }) => {
							const sharer_list = row.sharer_list;
							return (
								<div>
									{
										sharer_list.length ? <AutoTooltip 
											content={sharer_list.map(it => it.staff_name).join(' | ')}
											theme="dark"
											placement="bottom"
											labelClass="g-c-black3"
										/> : <span class="g-c-black3">--</span>
									}
								</div>
							);
						}
					});
					showColumns = [...temp1];
				} else {
					showColumns = [...temp2];
				}
				showColumns = [
					...showColumns,
					this.extraOptColumns[type]
				];
				columnsStore[type] = showColumns;
				return showColumns;
			}
		},
		handleOpenDrawer(row) {
			if (this.$auth[260]) {
				if (row.type === 1) {
					this.$request({
						url: '_CONTENT_CONFIG_MATERIAL_MATERIAL_DETAIL_GET',
						type: "GET",
						param: {
							material_id: row.material_id,
							type: row.type
						},
					}).then((res) => {
						let hrefUrlArry = res.data.file_url.split('.');
						let fileType = hrefUrlArry[hrefUrlArry.length - 1].toLowerCase();
						if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
							fileType = 'img';
						}
						switch (fileType) {
							case 'doc':
							case 'docx':
							case 'ppt':
							case 'pptx':
							case 'xls':
							case 'xlsx':
							case 'pdf':
							case 'img':
							case 'jpg':
							case 'mp4':
							case 'mp3':
								break;
							default:
								this.$Message.error('暂时不能预览这个文件');
								return;
						}
						PreviewFolder.popup({
							data: {
								type: row.type,
								hrefUrl: res.data.file_url,
								fileType,
								material_id: row.material_id,
								fileName: res.data.material_name,
								fileSize: res.data.file_size,
								role: true
							}
						}).then(() => {
							this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
						}).catch(error => {
							this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
						});
					});
				} else {
					PreviewFolder.popup({
						data: {
							type: row.type,
							material_id: row.material_id,
							role: true
						}
					}).then(() => {
						this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
					}).catch(error => {
						this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
					});
				}
			} else {
				this.$Message.warning('您没有权限查看素材');
			}
		},
		/**
		 * 重新编辑 
		 */
		handleEdit(row) {
			FractionMaterialUploadEdit.popup({
				title: '重新编辑',
				type: row.type,
				materialId: row.material_id
			}).then(() => {
				this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_RESET', { type: this.type });
			}).catch((error) => {});
		},
		/**
		 * 撤回
		 */
		handleReset(row) {
			Confirm.popup({
				title: '提示',
				msg: '是否撤回该素材上传申请？撤回将不再保留数据。'
			}).then(() => {
				this.$request({
					url: '_SALE_LIBRARY_MATERIAL_CANCEL_POST',
					type: "POST",
					loading: false,
					param: {
						material_id: row.material_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {});
		},
		/**
		 * 查看
		 */
		handleView(row) {
			FractionMaterialUploadInfo.popup({
				title: '查看',
				materialId: row.material_id
			}).catch((error) => {});
		},
		/**
		 * 重新提交文件或文件夹
		 */
		handleFileBefore(files, type, title, material_id) {
			let fileList = [];
			return uploadBefore(files).then(data => {
				if (type === 1) {
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
					type,
					fileList,
					isFolder: type === 2,
					isRepeat: true,
					materialId: material_id
				}).then((res) => {
					return { material_id: res.material_id, fileType: type };
				}).catch(res => {
					return false;
				});
			}).catch(err => {
				this.$Message.error(err.msg);
				return false;
			});
		},
		handleAllSuccess(files, type) {
			let material_list = [];
			if (!files.length) return;

			if (type === 1) {
				material_list = files.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
				}));
			} else {
				material_list = files.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
					path: it.webkitRelativePath,
				}));
			}
			this.handleUploadOk(type, material_list, files[0].material_id, true);
		},
		/**
		 * 上传文件或文件夹  无表单
		 */
		handleUploadOk(type, material_list, material_id, is_init) {
			this.$request({
				url: '_SALE_LIBRARY_DOWNLOAD_SUCCESS_POST',
				type: 'post',
				param: {
					is_control_role: 1,
					material_id,
					type,
					material_list
				},
				autoTip: true
			}).then((res) => {
				setTimeout(() => {
					if (is_init) {
						this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_INIT');
					} else {
						this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_LIST_RESET', { type: this.type });
					}
				}, 300);
			}).catch((err) => {});
		},
		handleFileUpload(files, type, material_id) {
			let material_list = [];
			if (type === 1) {
				material_list = files.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
				}));
			} else {
				material_list = files.map(it => ({
					material_name: it.title,
					file_url: it.url,
					file_size: it.size,
					path: it.webkitRelativePath,
				}));
			}
			this.handleUploadOk(type, material_list, material_id);
		}
	}
};