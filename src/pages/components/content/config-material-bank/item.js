import { Input, Tooltip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import API from "@stores/apis/root";
import { Upload } from 'wya-vc';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { PreviewFolder } from "../config-material-check/popup/preview-folder";
import { ServiceMaterial } from './popup/service-material';
import { TalksTape } from './popup/talks-tape';
import { TrainedTape } from './popup/trained-tape';
import { InformTape } from "./popup/inform-tape";
import { Confirm } from "../_common/confirm";
import { UploadFiles } from './popup/upload-files';
import { uploadBefore } from '../_common/upload.config';

export default {
	data() {
		return {
			isSame: false,
			columns: [
				{
					type: 'selection',
					width: 50,
					fixed: 'left',
					align: 'center'
				},
				{
					title: '素材',
					fixed: 'left',
					minWidth: 200,
					key: 'material_name',
					render: (h, params) => {
						let fileUrlArry = params.row.file_url.split('.');
						let fileType = fileUrlArry[fileUrlArry.length - 1].toLowerCase();
						switch (fileType) {
							case 'pdf':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
										disabled={params.row.material_name.length < 11}
									>
										<i class="iconfont  icon-pdf _inline-block" ></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'mp4':
							case 'mp3':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-mp4 _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'doc':
							case 'docx':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-word _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'xlsx':
							case 'xls':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-xls _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'ppt':
							case 'pptx':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-ppt _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'jpg':
							case 'png':
							case 'gif':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-tupian-copy _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'psd':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-psd _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'zip':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-zip _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'txt':
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-txt _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							default:
								return <a
									class="g-operation"
									style="display: block;"
									onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
								>
									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display:
											block;overflow: hidden;text-overflow: ellipsis;"
									>
										{params.row.type == 1 ? <i class="iconfont  icon-question _inline-block"></i>
											: <i class="iconfont icon-folder _inline-block"></i>}
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
						}
					}
				},
				{
					title: '排序',
					key: 'sort_value',
					minWidth: 100,
					sortable: true,
					render: (h, params) => {
						return (
							<span onClick={event => { event.stopPropagation(); }}>{this.$auth[1202]
								? <Input
									onOn-blur={(e) => this.handleSort(params.row.material_id, params.row.sort_value, e)}
									onOn-change={() => { this.isSame = true; }}
									value={params.row.sort_value}
									style="width: 50px"
									size="small"
								>
								</Input> : params.row.sort_value}
							</span>);
					}
				},
				{
					title: '素材类型',
					key: 'material_type_name',
					minWidth: 150,
				},
				{
					title: '素材用途',
					key: 'material_use_name',
					minWidth: 160,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.material_use > 3 && row.material_use < 8
										? <span onClick={(e) => { e.stopPropagation(); this.handleTapeDetail(row); }}
											class="g-operation">{row.material_use_name}
										</span>
										: <span>{row.material_use_name}</span>
								}
							</div>
						);
					}
				},
				{
					title: '素材提供人',
					key: 'provider_name',
					minWidth: 180,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.provider_list.length > 2
										? <Tooltip
											transfer
											placement="bottom-start"
										>
											<span class="_left-border">{row.provider_list[0].staff_name}</span>
											<span class="_left-border">{row.provider_list[1].staff_name}</span>
											<div style="white-space: normal;" slot="content">
												{
													row.provider_list.map(ele => {
														return <span class="_left-border">{ele.staff_name} </span>;
													})
												}
											</div>
										</Tooltip> : row.provider_list.map(ele => {
											return <span class="_left-border">{ele.staff_name}</span>;
										})
								}
							</div>
						);
					}
				},
				{
					title: '是否加学分',
					key: 'is_add_credit_name',
					minWidth: 150,
				},
				{
					title: '主要分享者',
					key: 'sharer_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.sharer_list.length > 2
										? <Tooltip
											transfer
											placement="bottom-start"
										>
											<span class="_left-border">{row.sharer_list[0].staff_name}</span>
											<span class="_left-border">{row.sharer_list[1].staff_name}</span>
											<div style="white-space: normal;" slot="content">
												{
													row.sharer_list.map(ele => {
														return <span class="_left-border">{ele.staff_name} </span>;
													})
												}
											</div>
										</Tooltip> : row.sharer_list.map(ele => {
											return <span>{ele.staff_name} </span>;
										})
								}
							</div>
						);
					}
				},
				{
					title: '查看权限',
					key: 'role_list',
					minWidth: 200,
					render: (h, params) => {
						let isShowTooltip = !params.row.role_list;
						return h('Tooltip', {
							props: {
								placement: 'bottom-start',
								theme: 'light',
								disabled: isShowTooltip
							},
							style: {
								maxWidth: '100%',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								display: 'block',
							}
						}, [
							params.row.role_list.split(',').map((res, index) => {
								return index === 0 ? <span>{res}</span> : <span><i style="margin: 0 10px">|</i>{res}</span>;
							}),
							h('div', {
								slot: 'content',
								style: { whiteSpace: 'normal', wordBreak: 'break-all' }
							}, params.row.role_list.split(',').map((res, index) => {
								return index === 0 ? <span>{res}</span> : <span><i style="margin: 0 10px">|</i>{res}</span>;
							}))
						]);
					}
				},
				{
					title: '上传人',
					key: 'staff_name',
					tooltip: true,
					minWidth: 150,
				},
				{
					title: '上传时间',
					key: 'create_date',
					minWidth: 160,
				},
				{
					title: '操作',
					minWidth: 80,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div onClick={(e) => { e.stopPropagation(); }}>
								<Dropdown trigger="hover" placement="left-start" width="112" transfer>
									<div style="width: 100%;height: 100%;">
										<i class="iconfont icon-point" style="font-size: 18px;" />
									</div>
									<DropdownMenu slot="list" class="_handle" style="text-align: left;">
										{ params.row.material_id && this.$auth[1198] ? (<div onClick={(e) => {
											e.stopPropagation();
											this.handleDetail(params.row);
										}}>
											<DropdownItem class="g-pointer">编辑</DropdownItem>
										</div>
										) : (
											""
										)}
										{params.row.material_id && this.$auth[1199] ? (
											<div onClick={(e) => { e.stopPropagation(); this.handleDelete(params.row.material_id); }}>
												<DropdownItem class="g-pointer">删除</DropdownItem>
											</div>
										) : ("")}
										{params.row.is_upload == 0 && this.$auth[1197] ? (
											<KeepUpload
												beforeUpload={(files) => this.handleFileBefore(files, 1, params.row.material_id)}
												allSuccess={this.handleAllSuccess}
												error={(name) => this.handleUploadFile(name)}
											 >
												<DropdownItem class="g-pointer">上传文件</DropdownItem>
											</KeepUpload>
										) : (
											""
										)}
										{params.row.is_upload == 0 && this.$auth[1197] ? (
											<div onClick={() => { }}>
												<KeepUpload
													directory={true}
													beforeUpload={(files) => this.handleFileBefore(files, 2, params.row.material_id)}
													allSuccess={this.handleAllSuccess}
													error={(name) => this.handleUploadFile(name)}>
													<DropdownItem class="g-pointer">上传文件夹</DropdownItem>
												</KeepUpload>
											</div>
										) : (
											""
										)}
									</DropdownMenu>
								</Dropdown>
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleError(err) {
			this.$Message.error(err);
		},
		handleFileError(err) {
			this.$Message.error(err);
		},
		handSuccess(res, v, imgs, id) {
			const com = {
				material_name: "",
				file_url: "",
				file_size: "",
				path: "",
			};
			if (imgs.success > 0) {
				let com1 = { ...com };
				com1.file_size = res.data.size;
				com1.material_name = res.data.title;
				com1.file_url = res.data.url;
				com1.path = v.total;
				this.material_list.push(com1);
			}
			if (this.amount == this.material_list.length) {
				this.$request({
					url: '_CONTENT_CONFIG_MATERIAL_UPLOAD_SUCCESS_POST',
					type: 'post',
					param: {
						is_control_role: 0,
						material_id: id,
						type: 2,
						material_list: this.material_list
					},
				}).then((data) => {
					this.$Message.success(data.msg);
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}
		},
		handlePreview(params) {
			// eslint-disable-next-line no-constant-condition
			if (!this.$auth[1195]) return;
			if (params.type == 1) {
				this.$request({
					url: API._CONTENT_CONFIG_MATERIAL_MATERIAL_DETAIL_GET,
					type: "get",
					param: {
						material_id: params.material_id,
						type: params.type
					},
				}).then((res) => {
					let hrefUrlArry = res.data.file_url.split('.');
					let fileType = hrefUrlArry[hrefUrlArry.length - 1].toLowerCase();
					if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {
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
							type: params.type,
							hrefUrl: res.data.file_url,
							fileType,
							material_id: params.material_id,
							fileName: res.data.material_name,
							fileSize: res.data.file_size,
							role: this.$auth[1196],
						}
					}).then(() => {
					}).catch(err => {
						// this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
					});
				});
			} else {
				PreviewFolder.popup({
					data: {
						type: params.type,
						material_id: params.material_id,
						fileName: params.material_name,
						role: this.$auth[1196],
					}
				});
			}
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

			});
		},
		handleFileComplete(res, id) {

			const com = {
				material_name: "",
				file_url: "",
				file_size: ""
			};
			let material_list = [];
			if (res.success > 0) {
				res.imgs.forEach(ele => {
					let com1 = { ...com };
					com1.file_size = ele.data.size;
					com1.material_name = ele.data.title;
					com1.file_url = ele.data.url;
					material_list.push(com1);
				});
			}
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_UPLOAD_SUCCESS_POST',
				type: 'post',
				param: {
					is_control_role: 0,
					material_id: id,
					type: 1,
					material_list
				},
			}).then((data) => {
				this.$Message.success(data.msg);
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleTapeDetail(params) {
			if (!this.$auth[1201]) return;
			const models = {
				4: TalksTape,
				5: TrainedTape,
				6: InformTape,
				7: ServiceMaterial,
			};
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_TYPE_DETAIL_GET',
				type: 'GET',
				param: {
					material_id: params.material_id
				},
			}).then((res) => {
				models[params.material_use].popup({
					data: {
						content: {
							...res.data,
							material_id: params.material_id,
						}
					}
				}).then((fromData) => {
					this.saveTape(fromData);
				});
			}).catch((error) => {
			});
		},
		saveTape(params) {
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_TYPE_SAVE_POST',
				type: 'post',
				param: {
					tape: {
						...params,
					}
				},
			}).then((data) => {
				this.$Message.success(data.msg);
				this.handleResetCur();
			}).catch((err) => {
				this.$Message.error(err.msg);
				this.handleResetCur();
			});
		},
		handleDetail(v) {
			UploadFiles.popup({
				data: {
					params: v,
					check: true,
					type: 1, // 编辑
				}
			}).then((res) => {
				this.handleResetCur();
			});
		},
		handleSort(id, value, e) {

			if (this.isSame) {
				this.$request({
					url: API._CONTENT_CONFIG_MATERIAL_SET_SORT_VAlUE_GET,
					type: 'GET',
					param: {
						material_id: id,
						sort_value: e.target.value
					}
				}).then(() => {
					this.$Message.success('排序修改成功！');
					this.handleResetCur();
				});
				this.isSame = false;
			}
		},
		handleDelete(id) {
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
				showBtn: true
			}).then(() => {
				this.request({
					url: '_CONTENT_CONFIG_MATERIAL_DEL_POST',
					type: 'POST',
					param: {
						material_ids: [id]
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
			});
		},
		handleFileBefore(file, fileType, material_id) {
			return uploadBefore(file).then(data => {
				return { material_id, fileType };
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
				this.$Message.success(data.msg + '请刷新页面');
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},

	}
};

