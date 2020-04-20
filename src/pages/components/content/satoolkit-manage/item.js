import { Input, Tooltip } from "iview";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "../_common/confirm";
import { AddMaterial } from "./popup/add-material";
import { PreviewAdjunct } from "../_common/tookit-manage/preview-adjunct";

export default {
	data() {
		return {
			isSame: false,
			columns: [
				{
					type: 'selection',
					width: 50,
					fixed: 'left',
					align: 'center',
				},
				{
					title: '素材',
					key: 'material_name',
					fixed: 'left',
					width: 200,
					tooltip: true,
					render: (h, params) => {
						let fileUrlArry = params.row.file_url.split('.');
						let fileType = fileUrlArry[fileUrlArry.length - 1].toLowerCase();
						switch (fileType) {
							case 'pdf':
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
										<i class="iconfont  icon-pdf _inline-block" ></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span>{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'mp4':
							case 'mp3':
								return <a
									class="g-operation"
									style="display: block;"
								>
									<Tooltip
										transfer
										placement="bottom"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-mp4 _inline-block"></i>
										<span>{params.row.material_name}</span>
										<div style="white-space: normal;" slot="content">
											<span style="white-space: normal;" class="_inline-block">{params.row.material_name}</span>
										</div>
									</Tooltip>
								</a>;
							case 'doc':
							case 'docx':
								return <a
									class="g-operation"
									style="display: block;"
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
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
								>
									<Tooltip
										transfer
										placement="bottom"
										disabled={params.row.material_name.length < 11}
										style="white-space: nowrap;max-width: 100%;display: block;overflow: hidden;text-overflow: ellipsis;"
									>
										<i class="iconfont  icon-question _inline-block"></i>
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
							<span onClick={event => { event.stopPropagation(); }}>
								<Input
									onOn-blur={(e) => this.handleSort(params.row.material_id, params.row.sort_value, e)}
									onOn-change = {() => { this.isSame = true; }}
									value={params.row.sort_value}
									style="width: 50px"
									size="small"
								>
								</Input>
							</span>
						);
					}
				},
				{
					title: '副类目',
					key: 'category_list',
					minWidth: 200,
					tooltip: true
				},
				{
					title: '查看权限',
					key: 'role_list',
					minWidth: 200,
					render: (h, params) => {
						let isShowTooltip = !params.row.role_list;
						return h('Tooltip', {
							props: {
								placement: 'bottom',
								theme: 'light',
								disabled: isShowTooltip
							},
							style: {
								width: '100%',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis'
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
					title: '发布人',
					key: 'staff_name',
					minWidth: 100,
				},
				{
					title: '发布时间',
					key: 'create_date',
					minWidth: 200
				},
				{
					title: '操作',
					key: 'link',
					width: 130,
					render: (h, params) => {
						return h('div', {}, [
							h('span', {
								style: {
									color: '#2397f9',
									display: `${this.$auth[625] ? "inline-block" : "none"}`,
									padding: '2px 8px 2px 0px',
									cursor: 'pointer'
								},
								on: {
									click: (event) => {
										event.stopPropagation();
										this.$request({
											url: API_ROOT._CONTENT_TOOLKIT_MATERIAL_DETAIL_GET,
											type: 'GET',
											param: {
												kit_type: '2',
												material_id: +params.row.material_id,
												is_control_role: 0
											}
										}).then((res) => {
											AddMaterial.popup({
												data: res.data,
												store: this.$store
											}).then(() => {
											}).catch(() => {
											});
										});
									}
								}
							}, '编辑'),
							h('span', {
								style: {
									background: '#2397f9',
									display: 'inline-block',
									width: '1px',
									height: '10px'
								}
							}),
							h('span', {
								style: {
									color: '#2397f9',
									display: `${this.$auth[626] ? "inline-block" : "none"}`,
									padding: '2px 8px',
									cursor: 'pointer'
								},
								on: {
									click: (event) => {
										event.stopPropagation();
										Confirm.popup({ title: '提示', msg: '你是否确认删除该素材？', showBtn: true })
											.then(() => {
												// 进行指派
												let material_id = params.row.material_id;
												this.delateMaterial(material_id);
											})
											.catch(() => {
												console.error('cancel');
											});
									}
								}
							}, '删除')
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_SATOOLKIT_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_SATOOLKIT_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		delateMaterial(id) {
			this.$request({
				url: API_ROOT._CONTENT_SERVICE_MATERIAL_DEL_GET,
				type: 'GET',
				param: {
					kit_material_id: id
				},
			}).then((res) => {
				this.handleResetFirst();

			}).catch((error) => {
				console.error(error);
			});
		},
		handlePreview(params) {
			let hrefUrlArry = params.file_url.split('.');
			let fileType = hrefUrlArry[hrefUrlArry.length - 1].toLowerCase();
			if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {
				fileType = 'img';
			}
			PreviewAdjunct.popup({
				hrefUrl: params.file_url,
				fileType,
				fileName: params.material_name,
				fileSize: params.file_size
			}).then(() => {

			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
		handleSort(id, value, e) {
			if (this.isSame) {
				this.$request({
					url: API_ROOT._CONTENT_SORT_EDIT_POST,
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
		}
	}
};
