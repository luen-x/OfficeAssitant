import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import API from "@stores/apis/root";
import { Upload } from 'wya-vc';
import KeepUpload from '@components/sale/_common/manul-upload/keep-upload';
import { PreviewFolder } from "./popup/preview-folder";
import { Check } from './popup/check';
import { UploadFiles } from '../config-material-bank/popup/upload-files';
import { InformTape } from '../config-material-bank/popup/inform-tape';
import { RejectApply } from '../config-material-bank/popup/reject-apply';
import { ServiceMaterial } from '../config-material-bank/popup/service-material';
import { TalksTape } from '../config-material-bank/popup/talks-tape';
import { TrainedTape } from '../config-material-bank/popup/trained-tape';
import { uploadBefore } from '../_common/upload.config';


export default {
	data() {
		return {
			folderList: [],
			columns1: [
				{
					type: 'selection',
					width: 50,
					fixed: 'left',
					align: 'center',
				},
				{
					title: '素材名称',
					key: 'material_name',
					width: 220,
					fixed: 'left',
					render: (h, { row }) => {
						return (
							<Tooltip
								transfer
								placement="bottom-start"
								disabled={row.material_name.length < 16}
								style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
							>
								<span onClick={(e) => { e.stopPropagation(); this.handlePreview(row); }}
									class="g-operation">{row.material_name}
								</span>
								<div style="white-space: normal;" slot="content">
									<span>
										{row.material_name}
									</span>
								</div>
							</Tooltip>
						);
					}
				},
				{
					title: '素材用途',
					key: 'material_use_name',
					minWidth: 160,
					tooltip: true,
					render: (h, { row }) => {
						return (
							<div>
								{
									this.type != 3 && row.material_use > 3 && row.material_use < 8
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
					title: '素材简介',
					key: 'describe',
					minWidth: 200,
					render: (h, { row }) => {
						return (
							<Tooltip
								transfer
								placement="bottom-start"
								disabled={row.describe.length < 16}
								style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
							>
								<span >{row.describe}
								</span>
								<div style="white-space: normal;max-height:500px" slot="content">
									<span>
										{row.describe}
									</span>
								</div>
							</Tooltip>
						);
					}
				},
				{
					title: '素材提供人',
					key: 'provider_name',
					tooltip: true,
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
					title: '上传人',
					key: 'staff_name',
					tooltip: true,
					minWidth: 100,
				},
				{
					title: '上传时间',
					key: 'create_time',
					tooltip: true,
					minWidth: 200,
				},
				{
					title: '操作',
					key: 'title',
					fixed: 'right',
					width: 100,
					render: (h, params) => {
						return (
							<div>
								{
									this.type == 1
										? <div>{
											this.$auth[1206] ? <span>
												<span onClick={(e) => { e.stopPropagation(); this.handleCheckPass(params.row); }}
													class="g-operation">通过</span>
												<span class="g-c-blue-mid" style="display:inline-block;margin:0 5px">|</span>
											</span> : ""}
										{	this.$auth[1207] ? <span onClick={(e) => { e.stopPropagation(); this.handleCheckReject(params.row); }}
											class="g-operation">驳回</span> : ""
										}
										</div>
										: <span>
											{ this.$auth[1212]
												? < span class ="g-operation" onClick={(e) => {
													e.stopPropagation();
													this.handleCheckDetail(params.row);
												}}>查看</span> : ''
											}
										</span>
								}
							</div>
						);
					}
				}
			],
			columns2: [
				{
					type: 'selection',
					width: 50,
					fixed: 'left',
					align: 'center'
				},
				{
					title: '素材名称',
					fixed: 'left',
					key: 'material_name',
					width: 220,
					render: (h, { row }) => {
						return (
							<div class="g-flex-ac">
								<Tooltip
									transfer
									placement="bottom-start"
									disabled={row.material_name.length < 16}
									style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
								>
									<span onClick={(e) => { e.stopPropagation(); this.handlePreview(row); }}
										class="g-operation">{row.material_name}
									</span>
									<div style="white-space: normal;" slot="content">
										<span>
											{row.material_name}

										</span>
									</div>
								</Tooltip>
								<span>
									{
										row.is_upload == 1 && <i style={{ color: '#17BB84' }} class="g-m-l-5 iconfont icon-shangchuan"/>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: '素材类型',
					key: 'material_type_name',
					tooltip: true,
					minWidth: 100,
				},
				{
					title: '素材用途',
					key: 'material_use_name',
					tooltip: true,
					minWidth: 160,
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
				// {
				// 	title: '提供时级别',
				// 	key: 'position_name',
				// 	tooltip: true,
				// 	minWidth: 100,
				// },
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
					title: '上传人',
					key: 'staff_name',
					tooltip: true,
					minWidth: 100,
				},
				{
					title: '上传时间',
					key: 'create_time',
					tooltip: true,
					minWidth: 200,
				},
				{
					title: '操作',
					key: 'title',
					fixed: 'right',
					width: '100',

					render: (h, params) => {
						return (
							<div onClick={(e) => { e.stopPropagation(); }}>
								<Dropdown trigger="hover" placement="left" width="112" transfer >
									<div style="width: 100%;height: 100%;">
										<i class="iconfont icon-point" style="font-size: 18px;" />
									</div>
									<DropdownMenu slot="list" class="_handle" style="text-align: left;">
										{this.$auth[1209] ? (
											<div onClick={(e) => { e.stopPropagation; this.handleSaveUpload(1, params.row.material_id); }}>
												<DropdownItem class="g-pointer">上传原素材</DropdownItem>
											</div>
										) : (
											""
										)}

										{this.$auth[1210] ? (
											<DropdownItem class="g-pointer">
												<div onClick={(e) => { e.stopPropagation; }}>
													<KeepUpload
														beforeUpload={(files) => this.handleFileBefore(files, 2, params.row.material_id)}
														error={(name) => this.handleUploadFile(name)}
														allSuccess={this.handleAllSuccess} >上传编辑后的文件</KeepUpload>
												</div>
											</DropdownItem>
										) : (
											""
										)}
										{this.$auth[1211] ? (
											<DropdownItem class="g-pointer">
												<KeepUpload
													directory={true}
													beforeUpload={(files) => this.handleFileBefore(files, 3, params.row.material_id)}
													error={(name) => this.handleUploadFile(name)}
													allSuccess={this.handleAllSuccess} >上传编辑后的文件夹</KeepUpload>
											</DropdownItem>
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
	computed: {
		columns() {
			return this.type == 2 ? this.columns2 : this.columns1;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_CHECK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_CHECK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
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
		handleCheckReject(params) {

			RejectApply.popup({
				data: {
					material_id: params.material_id,
				}
			}).then((res) => {
				this.$request({
					url: '_CONTENT_CONFIG_MATERIAL_CHECK_REFUSE_POST',
					type: 'post',
					param: {
						...res,
					},
				}).then(
					(data) => {
						this.$Message.success(data.msg);
						this.handleResetCur();
					}
				);
			});
		},
		handleCheckPass(params) {
			UploadFiles.popup({
				data: {
					params,
					check: true
				}
			}).then((res) => {
				this.handleResetCur();
			});
		},
		handleTapeDetail(params) {
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
							material_id: params.material_id
						},
					}
				}).then((fromData) => {
					this.saveTape(fromData);
				});
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handlePreview(params) {
			if (!this.$auth[1204]) return;
			if (this.type == 2) {
				params.type = params.type;
			}
			// eslint-disable-next-line no-constant-condition
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
						this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
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
		saveTape(params) {
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_TYPE_SAVE_POST',
				type: 'post',
				param: {
					tape: { ...params },
				},
			}).then((data) => {
				this.$Message.success(data.msg);
				this.handleResetCur();
			}).catch((err) => {
				this.$Message.error(err.msg);
				this.handleResetCur();
			});
		},

		handleSaveUpload(type, material_id, material_list) {
			this.$request({
				url: '_CONTENT_CONFIG_MATERIAL_CHECK_MATERIAL_POST',
				type: 'post',
				param: {
					type,
					material_id,
					material_list,
				},
			}).then((data) => {
				this.folderList = [];
				this.$Message.success(data.msg);
				this.handleResetCur();
			}).catch((err) => {
				this.folderList = [];
				this.$Message.error(err.msg);
				this.handleResetCur();
			});
		},
		handleUploadOk(res, v, id) {
			const com = {
				material_name: "",
				file_url: "",
				file_size: "",
			};
			let list = [];
			res.imgs.forEach(ele => {
				let com1 = { ...com };
				com1.file_size = ele.data.size;
				com1.material_name = ele.data.title;
				com1.file_url = ele.data.url;
				list.push(com1);
			});
			this.handleSaveUpload(v, id, list);
		},
		handleSuccess(res, v, imgs, id) {
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
				com1.path = v.webkitRelativePath;
				this.folderList.push(com1);
			}
			if (this.folderList.length == v.total) { this.handleSaveUpload(3, id, this.folderList); }
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
				url: '_CONTENT_CONFIG_MATERIAL_CHECK_MATERIAL_POST',
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
		handleFileBefore(file, fileType, material_id) {
			return uploadBefore(file).then(data => {
				return { material_id, fileType };
			}).catch(err => {
				this.$Message.error(err.msg);
				return false;
			});
		},
		handleCheckDetail(v) {
			Check.popup({
				data: {
					material_id: v.material_id
				}
			});
		}
	}
};

