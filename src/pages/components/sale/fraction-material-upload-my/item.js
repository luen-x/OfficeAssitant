import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { PreviewFolder } from "@components/content/config-material-check/popup/preview-folder";
import { FractionMaterialUploadInfo } from "../_common/material/upload-info";

export default {
	data() {
		return {
			columns: this.getColumns()
		};
	},
	methods: {
		handleOpenDrawer(row) {
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
						this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
					}).catch(error => {
						this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
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
					this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				}).catch(error => {
					this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				});
			}
		},
		getColumns() {
			return [
				{
					title: '素材名称',
					key: 'material_name',
					fixed: 'left',
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
					title: '素材类型',
					key: 'material_type_name',
					minWidth: 120
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
					title: '素材范围',
					key: 'range_name',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.range_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
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
					title: '上传人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '上传时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					width: 100,
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								<span 
									onClick={(e) => {
										e.stopPropagation();
										this.handleView(row);
									}}
								>
									查看
								</span>
							</div>
						);
					}
				}
			];
		},
		/**
		 * 查看
		 */
		handleView(row) {
			FractionMaterialUploadInfo.popup({
				title: '查看',
				materialId: row.material_id
			}).catch((error) => {});
		}
	}
};

