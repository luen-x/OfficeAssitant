import { Poptip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import { AddCategory } from "./popup/add-category";

export default {
	data() {
		const columns = [
			{
				type: "selection",
				width: 50,
				align: "center"
			},
			{
				title: "类目名称",
				key: "category_name",
				minWidth: 300,
				render: (h, params) => {
					const {
						row: { __level__, __expand__, children },
						index
					} = params;
					// 点击展开事件
					const handleClick = e => {
						this.$refs.tableTarget.expand({ index });
					};
					return h(
						"div",
						{
							style: {
								marginLeft: `${(__level__ - 1) * 20}px`,
								boxSizing: `content-box`,
								cursor: "pointer"
							},
							on: {
								click: handleClick
							}
						},
						[
							h("i", {
								style: {
									marginRight: `5px`,
									marginLeft: `-18px`
								},
								class: `iconfont g-c-black2 g-fs-12 ${
									children
										? !__expand__
											? this.loading === index
												? "ivu-load-loop ivu-icon icon-loading"
												: "icon-triangle-right "
											: "icon-triangle-down"
										: ""
								}` // eslint-disable-line
							}),
							h(
								"span",
								{
									style: {
										marginLeft: `${children ? 0 : 10}px`
									}
								},
								params.row.category_name
							)
						]
					);
				}
			},
			{
				title: '查看权限',
				key: 'power',
				minWidth: 150,
				tooltip: true,
			},
			{
				title: "创建时间",
				key: "create_time",
				minWidth: 160
			},
			{
				title: "创建人",
				key: "staff_name",
				minWidth: 160
			}
		];
		if (this.$auth[1612] || this.$auth[1613] || this.$auth[1614]) {
			columns.push({
				title: "操作",
				key: "link",
				minWidth: 100,
				align: "center",
				render: (h, { row }) => {
					return (
						<Dropdown trigger="hover" placement="left" width="112" transfer>
							<div style="width: 100%;height: 100%;">
								<i class="iconfont icon-point" style="font-size: 18px;" />
							</div>
							<DropdownMenu slot="list" class="_handle" style="text-align: left;">
								{this.$auth[1612] && (
									<div onClick={() => this.handleCategory(row, 1)}>
										<DropdownItem class="g-pointer">添加</DropdownItem>
									</div>
								)}
								{this.$auth[1613] && (
									<div onClick={() => this.handleCategory(row, 2)}>
										<DropdownItem class="g-pointer">编辑</DropdownItem>
									</div>
								)}
								{this.$auth[1614] && (
									<div onClick={() => this.handleDelateCategory(row.category_id)}>
										<DropdownItem class="g-pointer">删除</DropdownItem>
									</div>
								)}
							</DropdownMenu>
						</Dropdown>
					);
				}
			});

		}

		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_TOOL_SET_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleCategory(row, type) {
			AddCategory.popup({
				title: type == 2 ? '编辑类目' : '添加类目',
				type,
				category_id: row.category_id
			}).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		},
		handleDelateCategory(id) {
			Confirm.popup({
				title: "提示",
				msg: "你是否确认删除类目？",
			}).then(() => {
				this.request({
					url: "_ACADEMY_SUPPORT_TOOL_CATEGORY_DELETE_GET",
					type: "GET",
					param: {
						category_ids: [id]
					}
				}).then(() => {
					this.$Message.success("删除成功！");
					this.handleResetFirst();
				}).catch(res => {
					Confirm.popup({ title: "提示", msg: res.msg, });
				});
			}).catch(() => {
				console.error("cancel");
			});
		}
	}
};