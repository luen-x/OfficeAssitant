import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tag, Tooltip } from "iview";
import { getHashUrl } from "wya-utils";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@common/confirm/confirm";

export default {
	data() {
		const columns = [
			{
				type: "selection",
				fixed: "left",
				minWidth: 50
			},
			{
				title: '内容标题',
				key: 'title',
				fixed: "left",
				minWidth: 250
			},
			// {
			// 	title: '归属项目',
			// 	key: 'project_name',
			// 	minWidth: 100
			// },
			{
				title: '置顶顺序',
				key: 'sort',
				minWidth: 100
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 150
			},
			{
				title: '更新人',
				key: 'staff_name',
				minWidth: 100
			}
		];
		const $auth = _global.auth;
		return {
			columns1: [
				...columns,
				{
					title: "操作",
					fixed: "right",
					align: "center",
					width: 100,
					render: (h, { row }) => {
						return (
							<div class="g-tc" onClick={() => window.event.stopPropagation()}>
								<Dropdown 
									trigger="hover" 
									placement="left-start" 
									width="112" 
									transfer
									onOn-click={(name) => this[name]([row.read_id])}
								>
									<div style="width: 100%;height: 100%;">
										<i class="iconfont icon-point" style="font-size: 18px;" />
									</div>
									<DropdownMenu slot="list" style="text-align: left;">
										{$auth[1432] && (
											<DropdownItem name="handleEdit">
														编辑
											</DropdownItem>
										)}
										{$auth[1433] && (
											<DropdownItem name="handleDown">
														下架
											</DropdownItem>
										)
										}
										{ $auth[1434] && (
											<DropdownItem name="handleDelete">
														删除
											</DropdownItem>
										)}
									</DropdownMenu>
								</Dropdown>
							</div>
						);
					}
				}
			],
			columns2: [
				...columns,
				{
					title: "操作",
					fixed: "right",
					align: "center",
					minWidth: 100,
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{$auth[1435] && <span
									class="g-operation "
									onClick={() => this.handleUp(row.read_id)}
								>
										上架
								</span>
								}
								{$auth[1435] && (
									<span class="g-m-lr-5 g-operation " >|</span>
								)}
								{$auth[1434] && <span 
									class="g-operation "
									onClick={() => this.handleDelete([row.read_id])}
								>
									删除
								</span>
								}
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		getColumns(type) {
			return this['columns' + type];
		},
		handleEdit(item) {
			this.$router.push({
				path: '/tech/project/publish/document/add',
				query: {
					read_id: item.join(','),
					edit: 1
				}
			});
		},
		handleUp(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认上架？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: API_ROOT._TECH_PROJECT_PUBLISH_DOCUMENT_UP_POST,
					type: "POST",
					param: {
						read_id: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleDown(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认下架？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: API_ROOT._TECH_PROJECT_PUBLISH_DOCUMENT_DOWN_POST,
					type: "POST",
					param: {
						read_ids: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.isAll = false;
					this.selected = [];
					this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleDelete(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认删除？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: API_ROOT._TECH_PROJECT_PUBLISH_DOCUMENT_DELETE_POST,
					type: "POST",
					param: {
						read_ids: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.isAll = false;
					this.selected = [];
					this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		}
	}
};

