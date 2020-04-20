import API_ROOT from "@stores/apis/root";
import { Divider, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import { debounce } from 'lodash';
import { PreviewModal } from './preview/content.vue';


const initPage = {
	total: 0,
	reset: false,
	data: {}
};
export default {
	data() {
		return {
			checked_list: [],
			show: true,
			// common
			commonPage: {
				showTotal: true,
				showSizer: false,
				showElevator: false,
				placement: 'top',
				pageSizeOpts: [10, 20, 30]
			},
			commonTable: {
				"show-header": false,
				"stripe": true
			},
			// 客户
			customerListInfo: {
				...initPage
			},
			allList: {
				customerList: [],
				saleList: [],
				cardList: []
			},
			customerTitle: [
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						let company_name = params.row.company_name.length
							> 15 ? `${params.row.company_name.substring(0, 15)}...` : params.row.company_name;
						return params.row.company_name.length
						> 15 ? h('span', {
							}, [
								h(Tooltip, {
									props: {
										content: params.row.company_name,
										transfer: true,
										maxWidth: '220'
									}
								}, "公司名称：" + company_name)
							]) : h('span', {
							}, "公司名称：" + company_name);
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>姓名：" + params.row.customer_name + "</div>"
							}
						});
					}
				},
				{
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>状态：" + params.row.status_str + "</div>"
							}
						});
					}
				},
				{
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>负责人：" + params.row.staff_name + "</div>"
							}
						});
					}
				},
				{
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>剩余保护时间：" + params.row.expiration_time + "</div>"
							}
						});
					}
				}
			],
			// 员工
			staffListInfo: {
				...initPage
			},
			staffTitle: [
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: params.row.staff_name ? {
								innerHTML: "<div>员工姓名：" + params.row.staff_name + "</div>"
							} : {
								innerHTML: "<div>员工姓名：--</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: params.row.staff_number ? {
								innerHTML: "<div>员工工号：" + params.row.staff_number + "</div>"
							} : {
								innerHTML: "<div>员工工号：--</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							
							domProps: params.row.depart_name ? {
								innerHTML: "<div>所属部门：" + params.row.depart_name + "</div>"
							} : {
								innerHTML: "<div>所属部门：--</div>"
							}
						});
					}
				},
				{
					key: 'name',
					minWidth: 100,
					render: (h, params) => {
						return h('span', {
							domProps: params.row.position_name ? {
								innerHTML: "<div>职位：" + params.row.position_name + "</div>"
							} : {
								innerHTML: "<div>职位：--</div>"
							}
						});
					}
				},
				{
					key: 'name',
					minWidth: 100,
					render: (h, params) => {
						return h('span', {
							domProps: params.row.create_time ? {
								innerHTML: "<div>入职时间：" + params.row.create_time + "</div>"
							} : {
								innerHTML: "<div>入职时间：--</div>"
							}
						});
					}
				}
			],
			// 服务工具包
			serviceListInfo: {
				...initPage
			},
			serviceTitle: [
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						let iconColor = '';
						if (params.row.doc_type == 'iconfont icon-pdf') {
							iconColor = '#f54437';
						} else if (params.row.doc_type == 'iconfont icon-tupian-copy') {
							iconColor = '#65bb31';
						} else if (params.row.doc_type == 'iconfont icon-mp4'
						|| params.row.doc_type == 'iconfont icon-avi') {
							iconColor = '#9e63b6';
						} else if (params.row.doc_type == 'iconfont icon-word') {
							iconColor = '#589cff';
						} else if (params.row.doc_type == 'iconfont icon-xls') {
							iconColor = '#229e58';
						}
						return h('div', {
							style: {
								display: 'inline-block',
								width: '100%',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
							}
						}, [
							h('i', {
								style: {
									color: iconColor || '#000',
									marginRight: '5px',
								},
								class: params.row.doc_type
							}, ''),
							h('div', {
								style: {
									paddingLeft: '5px',
									display: 'inline-block',
									width: '100%',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
								},
								domProps: {
									innerHTML: '' + params.row.material_name
								},
							})
						]);
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>所属类目：" + params.row.catalog + "</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>上传时间：" + params.row.create_time + "</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
						}, '下载量：' + params.row.down);
					}
				},
				{
					key: 'name',
					render: (h, params) => {
						return h('div', {}, [
							h('span', {
								style: {
									color: params.row.type == 1 ? '#2e9dfa' : '#bbb',
									cursor: params.row.type == 1 ? 'pointer' : '',
								},
								on: {
									click: () => {
										params.row.type == 1 ? PreviewModal.popup({ datas: params.row }).then(res => {}) : '';
									}
								}
							}, '预览'),
							h(Divider, {
								props: {
									type: 'vertical'
								}
							}),
							h('span', {
								style: {
									color: '#2e9dfa',
									cursor: 'pointer',
								},
								on: {
									click: () => {
										this.handleDownload(params.row);
									}
								}
							}, '下载')
						]);
					}
				}
			],
			saleTitle: [
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						let iconColor = '';
						if (params.row.doc_type == 'iconfont icon-pdf') {
							iconColor = '#f54437';
						} else if (params.row.doc_type == 'iconfont icon-tupian-copy') {
							iconColor = '#65bb31';
						} else if (params.row.doc_type == 'iconfont icon-mp4'
						|| params.row.doc_type == 'iconfont icon-avi') {
							iconColor = '#9e63b6';
						} else if (params.row.doc_type == 'iconfont icon-word') {
							iconColor = '#589cff';
						} else if (params.row.doc_type == 'iconfont icon-xls') {
							iconColor = '#229e58';
						}
						return h('div', {
							style: {
								display: 'inline-block',
								width: '100%',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
							}
						}, [
							h('i', {
								style: {
									color: iconColor || '#000',
									marginRight: '5px',
								},
								class: params.row.doc_type
							}, ''),
							h('div', {
								style: {
									paddingLeft: '5px',
									display: 'inline-block',
									width: '100%',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
								},
								domProps: {
									innerHTML: '' + params.row.material_name
								},
							})
						]);
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>所属类目：" + params.row.catalog + "</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
							domProps: {
								innerHTML: "<div>上传时间：" + params.row.create_time + "</div>"
							}
						});
					}
				},
				{
					title: 'Name',
					key: 'name',
					render: (h, params) => {
						return h('span', {
						}, '下载量：' + params.row.down);
					}
				},
				{
					key: 'name',
					render: (h, params) => {
						return h('div', {}, [
							h('span', {
								style: {
									color: params.row.type == 1 ? '#2e9dfa' : '#bbb',
									cursor: params.row.type == 1 ? 'pointer' : '',
								},
								on: {
									click: () => {
										params.row.type == 1 ? PreviewModal.popup({ datas: params.row }).then(res => {}) : '';
									}
								}
							}, '预览'),
							h(Divider, {
								props: {
									type: 'vertical'
								}
							}),
							h('span', {
								style: {
									color: '#2e9dfa',
									cursor: 'pointer',
								},
								on: {
									click: () => {
										this.handleDownload(params.row);
									}
								}
							}, '下载')
						]);
					}
				}
			],
			// 销售工具包
			saleListInfo: {
				...initPage
			},
		};
	},
	methods: {
		// 下载
		handleDownload: debounce(async function (e) {
			if (e.type == 1) {
				const can_download = await this.downloadWarning();
				if (can_download) {
					downloadFile({
						fileName: e.file_url,
						downRecordParams: {
							material_ids: [e.material_id],
							type: 4
						}
					});
				}
			} else {
				this.checked_list = await this.getAllFile(e);
				if (this.checked_list.length) {
					const can_download = await this.downloadWarning(this.checked_list.length);
					if (can_download) {
						this.checked_list.forEach(element => {
							downloadFile({
								fileName: element.file_url,
								downRecordParams: {
									type: 4,
									material_ids: [element.material_id]
								}
							});
						});
					}
				}
			}
		}, 300),
		getAllFile(e) {
			return this.$request({
				url: "_ACADEMY_SUPPORT_TOOL_FOLDER_ALL_GET",
				type: "GET",
				param: {
					material_id: e.material_id
				},
				loading: false,
			}).then(res => {
				res.data.forEach(v => {
					v.file_url = v.path;
				});
				return res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		downloadWarning(download_num) {
			return this.$request({
				url: "_TOOLKIT_DOWNLOAD_RECORD_LIMIT_POST",
				type: "GET",
				param: {
					download_num: download_num || 1,
					material_type: 4
				},
				loading: false,
			}).then(res => {
				if (res.status) {
					return true;
				} else {
					return false;
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleReplace(str) {
			// if (!str) return;
			// let values = str.toString().split(this.keyword);
			// return values.join('<span style="color: red;">' + this.keyword + '</span>');
			return str;
		},
		handleResetFirst() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

