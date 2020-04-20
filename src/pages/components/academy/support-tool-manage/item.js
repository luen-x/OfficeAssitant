import { Input, Tooltip } from "iview";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import FileIcon from "@components/_common/file-icon/file-icon";
import { AddMaterial } from "./popup/add-material";
import { PreviewFolder } from "../_common/study-manage/popup/preview-folder";

export default {
	data() {
		return {
			isSame: false,
			columns: [
				{
					type: 'selection',
					width: 50,
					align: 'center',
				},
				{
					title: '素材',
					key: 'material_name',
					width: 200,
					tooltip: true,
					render: (h, params) => {
						let fileUrlArry = params.row.file_url.split('.');
						let fileType = fileUrlArry[fileUrlArry.length - 1].toLowerCase();
						return <a
							class="g-operation"
							style="display: block;"
						>
							<Tooltip
								transfer
								placement="bottom"
								style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
								disabled={params.row.material_name.length < 11}
							>
								{params.row.type == 1 ? <FileIcon style="display: inline-block;
								vertical-align: middle;font-size:16px !important" fileUrl={params.row.file_url} />
									: <i class="g-m-r-5 iconfont icon-folder _inline-block"></i>
								}
								<span>{params.row.material_name}</span>
								<div style="white-space: normal;" slot="content">
									<span>{params.row.material_name}</span>
								</div>
							</Tooltip>
						</a>;
					}

				},
				{
					title: '查看权限',
					key: 'power',
					minWidth: 200,
					tooltip: true

				},
				{
					title: '发布人',
					key: 'staff_name',
					minWidth: 100,
				},
				{
					title: '发布时间',
					key: 'create_time',
					minWidth: 200
				},
				{
					title: '操作',
					key: 'link',
					fixed: 'right',
					width: 120,
					render: (h, { row }) => {
						return <div class="g-operation">
							{this.$auth[1606]
								? <span onClick={(e) => { e.stopPropagation(); this.handleEdit(row); }}>编辑</span>
								: ''
							}
							<span class="g-m-lr-5">|</span>
							{this.$auth[1607]
								? <span onClick={(e) => { e.stopPropagation(); this.handleDelete(row); }}>删除</span>
								: ''
							}
						</div>;
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		// handlePreview(params) {
		// 	let hrefUrlArry = params.file_url.split('.');
		// 	let fileType = hrefUrlArry[hrefUrlArry.length - 1].toLowerCase();
		// 	if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {
		// 		fileType = 'img';
		// 	}
		// 	PreviewAdjunct.popup({
		// 		hrefUrl: params.file_url,
		// 		fileType,
		// 		fileName: params.material_name,
		// 		fileSize: params.file_size
		// 	}).then(() => {

		// 	}).catch(err => {
		// 		this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
		// 	});
		// },
		handlePreview(params) {
			// eslint-disable-next-line no-constant-condition
			if (params.type == 1) {
				this.$request({
					url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_DETAIL_GET',
					type: "get",
					param: {
						material_id: params.material_id,
						type: params.type
					},
				}).then((res) => {
					let hrefUrlArry = res.data.file_url.split('.');
					let fileType = hrefUrlArry[hrefUrlArry.length - 1].toLowerCase();
					const typeList = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'img', 'jpg', 'mp4', 'mp3'];
					const imgList = ['jpg', 'png', 'gif'];
					if (imgList.includes(fileType)) { fileType = 'img'; }
					if (!typeList.includes(fileType)) { this.$Message.error('暂时不能预览这个文件'); return; }
					PreviewFolder.popup({
						data: {
							type: params.type,
							hrefUrl: res.data.file_url,
							fileType,
							material_id: params.material_id,
							fileName: res.data.material_name,
							fileSize: res.data.file_size,
							// role: this.$auth[1196],
						}
					}).then(() => {}).catch(err => {});
				});
			} else {
				PreviewFolder.popup({
					data: {
						type: params.type,
						material_id: params.material_id,
						fileName: params.material_name,
						// role: this.$auth[1196],
					},
					folder_api: '_ACADEMY_SUPPORT_TOOL_FOLDER_PREVIEW_GET',
				}).then(() => {}).catch(err => {});
			}
		},



		handleEdit(row) {
			AddMaterial.popup({
				material_id: row.material_id
			}).then(
				this.handleResetCur()
			).catch(err => {
				err && console.error(err);
			});
		},
		handleDelete(row) {
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
			}).then(() => {
				this.$request({
					url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_DELETE_GET',
					type: 'GET',
					param: {
						material_ids: [row.material_id]
					},
				}).then((res) => {
					this.handleResetCur();
					this.$Message.success(res.msg);
				}).catch((error) => {
					console.error(error);
				});
			 });

		}
	}
};








