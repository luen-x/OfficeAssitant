import { Tooltip } from "iview";
import API from "@stores/apis/root";
import { Confirm } from '../_common/confirm';
import { RejectApply } from '../config-material-bank/popup/reject-apply';
import { PreviewFolder } from "../config-material-check/popup/preview-folder";
import { Check } from './popup/check';

export default {
	data() {
		return {
			columns1: [
				{
					title: '申请人',
					key: 'staff_name',
					minWidth: 160,
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 160,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 160,
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 160,
				},
				{
					title: '申请查看素材',
					key: 'material_name',
					minWidth: 200,
					render: (h, params) => {
						return <a
							class="g-operation"
							style="display: block;"
							onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
						>
							<Tooltip
								transfer
								placement="bottom"
								style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
								disabled={params.row.material_name.length < 16}
							>
								<span>{params.row.material_name}</span>
								<div style="white-space: normal;" slot="content">
									<span class="_inline-block">{params.row.material_name}</span>
								</div>
							</Tooltip>
						</a>;
					},
				},
				{
					title: '素材提供人',
					key: 'provider_name',
					minWidth: 160,
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
					title: '主要分享者',
					key: 'sharer_name',
					minWidth: 160,
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
					title: '申请时间',
					key: 'create_time',
					minWidth: 160,
				},
				{
					title: '审核时间',
					key: 'audit_time',
					minWidth: 160,
				},

				{
					title: '申请理由',
					key: 'apply_reason',
					tooltip: true,
					minWidth: 200
				},
				{
					title: '操作',
					key: 'title',
					fixed: 'right',
					minWidth: 100,
					render: (h, params) => {
						if (this.type == 1) {
							return (
								<div>{
									this.$auth[1206]
										? <span>
											<span class="g-operation" onClick={() => { this.handlePass(params.row); }} >通过</span>
											<span class="g-c-blue-mid" style="display:inline-block;margin:0 5px">|</span>
										</span> : ''
								}

								{
									this.$auth[1207] ? <span class="g-operation" onClick={() => { this.handleCheckReject(params.row); }} >驳回</span>
										: ''
								}
								</div>
							);
						} else if (this.type == 2) {
							return (
								<div>{
									this.$auth[1214]
										? <span>
											<span onClick={(e) => { e.stopPropagation(); this.handleCheck(params.row); }}
												class="g-operation">查看</span>
											<span class="g-c-blue-mid" style="display:inline-block;margin:0 5px">|</span>
										</span> : ''
								}
								<span>
									{
										params.row.is_delete == 1 ? '失效' : <span>{
											this.$auth[1219] ? <span
												onClick={(e) => { e.stopPropagation(); this.handleCancel(params.row); }}
												class="g-operation">
												撤销
											</span> : ''
										}
										</span>
									}
								</span>
								</div>
							);
						} else if (this.type == 3) {
							return (
								<div>
									{
										this.$auth[1218] ? <span onClick={(e) => { e.stopPropagation(); this.handleCheck(params.row); }}
											class="g-operation">查看</span> : ''
									}
								</div>
							);
						}
					},
				}
			],
		};
	},
	computed: {
		columns() {
			let col = [...this.columns1];
			this.type != 1 ? col.splice(-2, 1) : col.splice(-3, 1);
			return col;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_ROLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_ROLE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleCheck(params) {
			Check.popup({
				data: {
					apply_id: params.apply_id
				}
			}).then();
		},
		handlePreview(params) {
			if (!this.$auth[1204]) return;
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
							fileSize: res.data.file_size
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
					}
				});
			}
		},

		handleCancel(params) {
			Confirm.popup({
				msg: '是否撤销该员工的查看权限',
			}).then(() => {
				this.$request({
					url: '_CONTENT_LIBRARY_MATERIAL_APPLY_CANCEL_POST',
					type: 'GET',
					param: {
						apply_id: params.apply_id
					}
				}).then((res) => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch();
		},


		// 通过
		handlePass({ apply_id }) {
			Confirm.popup({
				msg: '是否通过该员工的申请',
			}).then(() => {
				let param = {
					apply_id,
					audit_remark: "通过",
					status: "2"
				};
				this.fetch('_CONTENT_CONFIG_ROLE_APPLY_AUDIT_POST', param);

			}).catch(
				(err) => {
					this.$Message.error(err.msg);
				}
			);
		},
		// 撤销
		// 驳回
		handleCheckReject(params) {
			RejectApply.popup({
				data: {
					material_id: params.apply_id
				}
			}).then((res) => {
				this.$request({
					url: '_CONTENT_CONFIG_ROLE_APPLY_AUDIT_POST',
					type: 'post',
					param: {
						apply_id: res.material_id,
						audit_remark: res.refuse_reason,
						status: '3'
					},
				}).then(
					(data) => {
						this.$Message.success(data.msg);
						this.handleResetCur();
					}
				);
			});
		},
		fetch(api, params) {
			this.$request({
				url: api,
				type: 'GET',
				param: {
					...params
				},
			}).then((res) => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		}
	},
};

