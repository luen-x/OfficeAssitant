import { Poptip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { AddCategory } from "./popup/add-category";
import { Confirm } from "../_common/confirm";

export default {
	data() {
		return {
			columns: [
				{
					type: "selection",
					width: 50,
					align: "center"
				},
				{
					title: "id",
					key: "category_id",
					width: 80
				},
				{
					title: "类目名称",
					key: "category_name",
					width: 300,
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
					title: "显示",
					key: "is_display",
					width: 60,
					render: (h, params) => {
						return h(
							"span",
							{
								style: {
									marginRight: "5px"
								}
							},
							params.row.is_display === 0 ? "否" : "是"
						);
					}
				},

				{
					title: "查看权限",
					key: "role_list",
					render: (h, params) => {
						let isShowTooltip = !params.row.role_list;
						return h(
							"Tooltip",
							{
								props: {
									placement: "bottom",
									theme: "light",
									disabled: isShowTooltip
								},
								style: {
									maxWidth: "100%",
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis"
								}
							},
							[
								params.row.role_list.split(",").map((res, index) => {
									return index === 0 ? (
										<span>{res}</span>
									) : (
										<span>
											<i style="margin: 0 10px">|</i>
											{res}
										</span>
									);
								}),
								h(
									"div",
									{
										slot: "content",
										style: { whiteSpace: "normal", wordBreak: "break-all" }
									},
									params.row.role_list.split(",").map((res, index) => {
										return index === 0 ? (
											<span>{res}</span>
										) : (
											<span>
												<i style="margin: 0 10px">|</i>
												{res}
											</span>
										);
									})
								)
							]
						);
					}
				},
				{
					title: "入职年限",
					key: "category_year_name",
					width: 160
				},
				{
					title: "操作",
					key: "link",
					width: 100,
					align: "center",
					render: (h, params) => {
						return (
							<Dropdown trigger="hover" placement="left" width="112" transfer>
								<div style="width: 100%;height: 100%;">
									<i class="iconfont icon-point" style="font-size: 18px;" />
								</div>
								<DropdownMenu slot="list" class="_handle" style="text-align: left;">
									{this.$auth[628] ? (
										<div onClick={() => this.handleCategory(params.row, "添加类目")}>
											<DropdownItem class="g-pointer">添加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[629] ? (
										<div onClick={() => this.handleCategory(params.row, "编辑类目")}>
											<DropdownItem class="g-pointer">编辑</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[630] ? (
										<div onClick={() => this.handleDelateCategory(params.row.category_id)}>
											<DropdownItem class="g-pointer">删除</DropdownItem>
										</div>
									) : (
										""
									)}
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("CONTENT_SATOOLKIT_SET_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_SATOOLKIT_SET_LIST_RESET", { type: this.type });
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleCategory(param, title) {
			let oCategoryInfo = {};
			oCategoryInfo.id = param.category_id;
			oCategoryInfo.categoryName = param.category_name;
			oCategoryInfo.category_year = param.category_year;
			if (title === "编辑类目") {
				oCategoryInfo.pid = param.pid;
			} else {
				oCategoryInfo.pid = "";
			}
			oCategoryInfo.headerTitle = title;
			oCategoryInfo.isDisplay = param.is_display;
			AddCategory.popup({
				categoryInfo: oCategoryInfo,
				store: this.$store
			})
				.then(() => {})
				.catch(() => {});
		},
		handleDelateCategory(id) {
			Confirm.popup({
				title: "提示",
				msg: "你是否确认删除该目录？",
				showBtn: true
			})
				.then(() => {
					// 进行指派
					this.request({
						url: "_CONTENT_SERVICE_CATEGORY_DEL_GET",
						type: "GET",
						param: {
							category_id: id
						}
					})
						.then(() => {
							this.$Message.success("删除成功！");
							this.handleResetFirst();
						})
						.catch(res => {
							Confirm.popup({ title: "提示", msg: res.msg, btnName2: "知道了" });
						});
				})
				.catch(() => {
					console.error("cancel");
				});
		}
	}
};
