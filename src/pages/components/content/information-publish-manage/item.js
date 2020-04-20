import { Poptip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Confirm } from "@components/_common/confirm/confirm";
import { CategoryModal } from './popup/add.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '类目名称',
					key: 'title',
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
									marginLeft: `${(__level__ - 1) * 20 + 20}px`,
									boxSizing: `content-box`,
									cursor: "pointer", 
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
					title: '操作',
					key: 'link',
					width: 100,
					render: (h, params) => {
						return (
							<Dropdown 
								trigger="hover" 
								placement="left" 
								width="112" 
								transfer
							>
								<div style="width: 100%;height: 100%;">
									<i class="iconfont icon-point" style="font-size: 18px;" />
								</div>
								<DropdownMenu slot="list" class="_handle" style="text-align: left;">
									{this.$auth[1653] ? (
										<div onClick={() => this.handleCategory(params.row)}>
											<DropdownItem class="g-pointer">添加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[1547] ? (
										<div onClick={() => this.handleCategory(params.row, true)}>
											<DropdownItem class="g-pointer">编辑</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[1548] ? (
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
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_RESET', { type: this.type });
		},
		handleCategory(info, edit, isRoot) {
			CategoryModal.popup({
				edit,
				isRoot,
				info
			}).then(res => {
				this.$store.commit('CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_INIT');
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleDelateCategory(category_id) {
			Confirm.popup({
				msg: '是否确认删除？',
				showIcon: true
			 }).then(() => {
				this.$request({
					url: "_CONTENT_CATEFORY_TREE_DEL_POST",
					type: "POST",
					param: {
						category_ids: [category_id]
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}).catch(res => {});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

