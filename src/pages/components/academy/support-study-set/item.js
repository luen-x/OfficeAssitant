import { Poptip, Tooltip, Icon, Dropdown, DropdownMenu, DropdownItem } from "iview";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import { AddCategory } from "./popup/add-category";

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
					title: "类目名称",
					key: "category_name",
					minWidth: 500,
					render: (h, params) => {
						const {
							row: { __level__, __expand__, children },
							index
						} = params;
						// 点击展开事件
						const handleClick = e => {
							this.$refs.tableTarget.expand({ index });
						};
						return (
							<div style={{ marginLeft: `${(__level__ - 1) * 20}px`,
								boxSizing: `content-box`,
								cursor: "pointer"
							}}
							onClick={() => { handleClick(); }}
							>
								<i style={{ marginRight: `5px`, marginLeft: `-18px` }}
									class={`iconfont g-c-black2 g-fs-12 ${
										children
											? !__expand__
												? this.loading === index
													? "ivu-load-loop ivu-icon icon-loading"
													: "icon-triangle-right "
												: "icon-triangle-down"
											: ""
									}`}
								/>
								<span style={{ marginLeft: `${children ? 0 : 10}px` }}>

									<Tooltip
										transfer
										placement="bottom-start"
										disabled={params.row.category_name.length < 15}
										style="white-space: nowrap;max-width: 100%;
										overflow: hidden;text-overflow:
										ellipsis;vertical-align: text-bottom;"
									>
										<span>{params.row.category_name.length > 15
											? params.row.category_name.substring(0, 14) + '...'
											: params.row.category_name}</span>
										<div style="white-space: normal;" slot="content">
											<span class="_inline-block">{params.row.category_name}</span>
										</div>
									</Tooltip>
								</span>
							</div>
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
					minWidth: 260
				},
				{
					title: "创建人",
					key: "staff_name",
					minWidth: 260
				},
				{
					title: "操作",
					key: "link",
					minWidth: 100,
					align: "center",
					render: (h, params) => {
						return (
							<Dropdown trigger="hover" placement="left" width="112" transfer>
								<div style="width: 100%;height: 100%;">
									<i class="iconfont icon-point" style="font-size: 18px;" />
								</div>
								<DropdownMenu slot="list" class="_handle" style="text-align: left;">
									{this.$auth[1626] ? (
										<div onClick={() => this.handleCategory(params.row, 1)}>
											<DropdownItem class="g-pointer">添加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[1627]
										? <div onClick={() => this.handleCategory(params.row, 2)}>
											<DropdownItem class="g-pointer">编辑</DropdownItem>
										</div> : ""
									}
									{this.$auth[1628]
										? <div onClick={() => this.handleDelateCategory(params.row.category_id)}>
											<DropdownItem class="g-pointer">删除</DropdownItem>
										</div> : ""}
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_SET_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_SET_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},

		handleCategory(row, type) {
			AddCategory.popup({
				title: type == 2 ? '编辑类目' : '添加类目',
				type,
				category_id: row.category_id,
				study_type: row.study_type
			}).then(() => {}).catch(() => {});
		},
		handleDelateCategory(id) {
			Confirm.popup({
				title: "提示",
				msg: "你是否确认删除该目录？",
			}).then(() => {
				// 进行指派
				this.$request({
					url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DELETE_GET',
					type: "post",
					param: {
						category_ids: [id]
					}
				}).then(() => {
					this.$Message.success("删除成功！");
					this.handleResetCur();
				}).catch(res => {
					Confirm.popup({ title: "提示", msg: res.msg, btnName2: "知道了" });
				});
			}).catch((error) => {
				console.error(error);
			});
		}
	}
};