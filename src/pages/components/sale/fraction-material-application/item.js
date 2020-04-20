import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { PreviewFolder } from "@components/content/config-material-check/popup/preview-folder";
import { FractionMaterialApplicationEdit } from './popup/edit';
import { FractionMaterialApplicationInfo } from './popup/info';
import { FractionMaterialApplicationReject } from './popup/reject';
import { FractionMaterialApplication } from "../fraction-material-bank/popup/material-application";

export default {
	data() {
		const baseColumns = [
			{
				title: '姓名',
				key: 'staff_name',
				fixed: 'left',
				width: 120
			},
			{
				title: '手机号码',
				key: 'mobile',
				fixed: 'left',
				width: 120
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 150
			},
			{
				title: '职位',
				key: 'position_name',
				minWidth: 120
			},
			{
				title: '申请查看素材',
				key: 'material_name',
				minWidth: 250,
				render: (h, { row }) => {
					return this.handleMaterial(row);
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
			},
			{
				title: '申请时间',
				key: 'create_time',
				minWidth: 160
			},
			{
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 135,
				render: (h, { row }) => {
					return this.handleOpts(row);
				}
			}
		];
		return {
			baseColumns,
			showColumns: [...baseColumns]
		};
	},
	methods: {
		/**
		 * 重新编辑
		*/
		handleEdit(row) {
			FractionMaterialApplicationEdit.popup({
				applyId: row.apply_id
			}).then(() => {
				this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET', { type: this.type });
			}).catch((error) => {});
		},
		/**
		 * 重新提交
		*/
		handleRepeat(row) {
			FractionMaterialApplication.popup({
				title: '重新提交',
				applyId: row.apply_id,
				materialId: row.material_id,
				fileName: row.material_name
			}).then(() => {
				this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET', { type: this.type });
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 查看
		 */
		handleView(row) {
			FractionMaterialApplicationInfo.popup({
				applyId: row.apply_id
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 处理素材名称
		 */
		handleMaterial(row) {
			const { query } = this.$route;
			const material_name = row.material_name;

			if ((query.tab === '0' || !query.tab) && this.type === '3') {
				return (
					<div>
						{
							this.$auth[530] ? <div onClick={() => { this.handleViewMaterial(row); }}>
								<AutoTooltip 
									content={material_name}
									theme="dark"
									placement="bottom"
									labelClass="g-operation"
								/>
							</div> : <AutoTooltip 
								content={material_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						}
					</div>
				);
			} else if ((query.tab === '0' || !query.tab) && this.type !== '3') {
				return (
					<AutoTooltip 
						content={material_name}
						theme="dark"
						placement="bottom"
						labelClass="g-c-black3"
					/>
				);
			} else {
				return (
					<div>
						{
							this.$auth[530] ? <div onClick={() => { this.handleViewMaterial(row); }}>
								<AutoTooltip 
									content={material_name}
									theme="dark"
									placement="bottom"
									labelClass="g-operation"
								/> 
							</div> : <AutoTooltip 
								content={material_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						}
					</div>
				);
			}
		},
		/**
		 * 查看素材
		 */
		handleViewMaterial(row) {
			let temp = {};
			const { query } = this.$route;

			if ((query.tab === '0' || !query.tab) && this.type === '3') {
				this.$request({
					url: '_SALE_LIBRARY_MATERIAL_CAN_LOOK_GET',
					type: "GET",
					loading: false,
					param: {
						material_id: row.material_id
					},
					autoTip: false
				}).then(res => {
					if (res.data.can_look === 1) {
						temp = {
							type: +res.data.material_detail.type,
							hrefUrl: res.data.material_detail.file_url,
							material_id: res.data.material_detail.material_id,
							fileName: res.data.material_detail.material_name,
							fileSize: +res.data.material_detail.file_size
						};
						this.handlePreview(temp);
					}
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else if (query.tab === '1') {
				temp = {
					type: +row.type,
					hrefUrl: row.file_url,
					material_id: row.material_id,
					fileName: row.material_name,
					fileSize: +row.file_size
				};
				this.handlePreview(temp);
			}
		},
		handlePreview(row) {
			if (row.type === 1) {
				let hrefUrlArry = row.hrefUrl.split('.');
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
						...row,
						fileType,
						role: true
					}
				}).catch(error => {});
			} else {
				PreviewFolder.popup({
					data: {
						type: row.type,
						material_id: row.material_id,
						role: true
					}
				}).catch(error => {
					error && console.error(error);
				});
			}
		},
		/**
		 * 通过
		 */
		handlePass(row) {
			Confirm.popup({
				title: '提示',
				msg: '是否通过该员工的申请？'
			}).then(() => {
				this.$request({
					url: '_SALE_LIBRARY_APPLY_AUDIT_POST',
					type: "POST",
					loading: false,
					param: {
						apply_id: row.apply_id,
						status: 2
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 驳回
		 */
		handleReject(row) {
			FractionMaterialApplicationReject.popup({
				applyId: row.apply_id
			}).then(() => {
				this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET', { type: this.type });
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 撤回
		 */
		handleReset(row) {
			Confirm.popup({
				title: '提示',
				msg: '是否要撤回申请？撤回申请后该条内容将消失。'
			}).then(() => {
				this.$request({
					url: '_SALE_LIBRARY_APPLY_CANCEL_POST',
					type: "POST",
					loading: false,
					param: {
						apply_id: row.apply_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleOpts(row) {
			const { query = {} } = this.$route;
			const tab = this.tab || query.tab;
			const type = this.type || query.type;

			if ((tab === '0' || !tab) && (type === '1' || type === '2')) {
				return (
					<div class="g-operation"> 
						{
							this.$auth[532] && <span>
								<span 
									onClick={() => {
										this.handleReset(row);
									}}
								>
						撤回
								</span>
								<span class="g-pd-lr-10">|</span>
							</span>
						}
						{
							this.$auth[533] && <span 
								onClick={() => {
									this.handleEdit(row);
								}}
							>
							重新编辑
							</span>
						}
					</div>
				);
			} else if ((tab === '0' || !tab) && type === '4') {
				return (
					<div class="g-operation">
						{
							(row.is_again === '0' && this.$auth[535]) && <span 
								onClick={() => {
									this.handleRepeat(row);
								}}
							>
							重新提交
							</span>
						}
						{
							(row.is_again !== '0' && this.$auth[534]) && <span 
								onClick={() => {
									this.handleView(row);
								}}
							>
						查看
							</span>
						}
					</div>
				);
			} else if (tab === '1' && type === '1') {
				return (
					<div class="g-operation"> 
						{
							this.$auth[536] && <span>
								<span 
									onClick={() => {
										this.handlePass(row);
									}}
								>
							通过
								</span>
								<span class="g-pd-lr-10">|</span>
							</span>
						}
						{
							this.$auth[537] && <span 
								onClick={() => {
									this.handleReject(row);
								}}
							>
							驳回
							</span>
						}
					</div>
				);
			} else {
				return (
					<div>
						{
							this.$auth[534] && type === '3' && row.is_delete 
								? <span class="g-c-black7">失效</span> : this.$auth[534] && <span 
									onClick={() => {
										this.handleView(row);
									}}
									class="g-operation"
								>
									查看
								</span>
						}
					</div>
				);
			}
		}
	}
};

