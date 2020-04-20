import { Input, Tooltip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import API from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import FileIcon from "@components/_common/file-icon/file-icon";
import { PreviewFolder } from "../_common/study-manage/popup/preview-folder";
import { AddMaterial } from './popup/add-material';

export default {
	data() {
		return {
			isSame: false,
			categoryList: [],
			columns: [
				{
					type: 'selection',
					width: 50,
					align: 'center'
				},
				{
					title: '素材',
					minWidth: 200,
					key: 'material_name',
					render: (h, params) => {
						let fileUrlArry = params.row.file_url.split('.');
						let fileType = fileUrlArry[fileUrlArry.length - 1].toLowerCase();
						return <a
							class="g-operation"
							style="display: block;"
							onClick={(e) => { e.stopPropagation(); this.handlePreview(params.row); }}
						>
							<Tooltip
								transfer
								placement="bottom-start"
								style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;
								text-overflow: ellipsis;"
								disabled={params.row.material_name.length < 11}
							>
								{params.row.type == 1 ? <FileIcon style="display: inline-block;
								vertical-align: middle;font-size:16px !important" fileUrl={params.row.file_url} />
									: <i class="g-m-r-5 iconfont icon-folder _inline-block"></i>
								}
								<span>{params.row.material_name}</span>
								<div style="white-space: normal;" slot="content">
									<span class="_inline-block">{params.row.material_name}</span>
								</div>
							</Tooltip>
						</a>;
					}
				},
				{
					title: '查看权限',
					key: 'power',
					minWidth: 150,
					tooltip: true,
				},
				{
					title: '上传人',
					key: 'staff_name',
					tooltip: true,
					minWidth: 90,
				},
				{
					title: '上传时间',
					key: 'create_time',
					minWidth: 130,
				},
				{
					title: '操作',
					minWidth: 120,
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={(e) => { e.stopPropagation(); }}>
								{this.$auth[1620] ? <span onClick={(e) => { this.handledMaterialDetail(row); }}>编辑</span> : ''}
								<span class="g-m-lr-5">|</span>
								{this.$auth[1621] ? <span onClick={(e) => { this.handleDelete(row); }}>删除</span> : ''}
							</div>
						);
					}
				}
			],
		};
	},
	created() {
		this.gitCategoryList();
	},
	methods: {
		gitCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
			}).then((res) => {
				this.categoryList = res.data || [];
			}).catch((err) => {
				console.error(err);
			});
		},
		handleError(err) {
			this.$Message.error(err);
		},
		handleFileError(err) {
			this.$Message.error(err);
		},
		handlePreview(params) {
			// eslint-disable-next-line no-constant-condition
			if (params.type == 1) {
				this.$request({
					url: '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DETAIL_GET',
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
							role: this.$auth[1196],
						}
					}).then(() => {}).catch(err => {});
				});
			} else {
				PreviewFolder.popup({
					data: {
						type: params.type,
						material_id: params.material_id,
						fileName: params.material_name,
						role: this.$auth[1196],
					},
					folder_api: '_CONTENT_LIBRARY_MATERIAL_FOLDER_PREVIEW_POST',
				}).then(() => {}).catch(err => {});
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
			this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handledMaterialDetail(row) {
			AddMaterial.popup({
				data: {
					type: 1, // 编辑
				},
				material_id: row.material_id,
				type: 1
			}).then((res) => {
				this.handleResetCur();
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleDelete(row) {
			Confirm.popup({
				title: '提示',
				msg: '你是否确认删除所选素材？',
				showBtn: true
			}).then(() => {
				this.request({
					url: '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DELETE_GET',
					type: 'POST',
					param: {
						material_ids: [row.material_id]
					}
				}).then((res) => {
					this.$Message.success('删除成功！');
					this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}).catch((err) => {
			});
		},

	}
};

