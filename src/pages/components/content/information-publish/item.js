import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tag, Tooltip } from "iview";
import { Confirm } from "@common/confirm/confirm";

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 60,
					fixed: 'left',
					align: 'center'
				},
				{
					title: '内容标题',
					fixed: 'left',
					minWidth: 150,
					tooltip: true,
					key: 'title'
				},
				{
					title: '置顶排序',
					key: 'sort'
				},
				{
					title: '更新时间',
					key: 'update_time'
				},
				{
					title: '更新人',
					key: 'update_staff_name'
				},
				{
					title: '操作',
					key: 'title',
					align: 'left',
					render: (h, { row }) => {
						return (
							<div class="g-tl" onClick={(e) => e.stopPropagation()}>
								<Dropdown 
									trigger="hover" 
									placement="left-start" 
									width="112" 
									transfer
									onOn-click={(name) => this[name]([row.means_id])}
								>
									<div style="width: 100%;height: 100%;">
										<i class="iconfont icon-point" style="font-size: 18px;" />
									</div>
									<DropdownMenu slot="list" style="text-align: left;">
										{this.type === '1' && this.$auth[1549] && (
											<DropdownItem name="handleEdit">
														编辑
											</DropdownItem>
										)}
										{this.type === '1' && this.$auth[1550] && (
											<DropdownItem name="handleDown">
														下架
											</DropdownItem>
										)}
										{this.type === '2' && this.$auth[1654] && (
											<DropdownItem name="handleUp">
														上架
											</DropdownItem>
										)}
										{this.$auth[1551] && (
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
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_RESET', { type: this.type });
		},
		handleEdit(item) {
			this.$router.push({
				path: '/content/information/publish/content',
				query: {
					means_id: item.join(','),
					category_id: this.$route.query.category_id || this.classList[0].category_id
				}
			});
		},
		handleUp(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认上架？",
			}).then(() => {
				this.$request({
					url: '_CONTENT_INFORMATION_COTNENT_UP_POST',
					type: "POST",
					param: {
						means_id: item[0]
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleDown(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认下架？",
			}).then(() => {
				this.$request({
					url: '_CONTENT_INFORMATION_COTNENT_UNDER_POST',
					type: "POST",
					param: {
						means_ids: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.isAll = false;
					this.selected = [];
					this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleDelete(item) {
			Confirm.popup({
				title: "",
				msg: "是否确认删除？",
			}).then(() => {
				this.$request({
					url: '_CONTENT_INFORMATION_COTNENT_DELETE_POST',
					type: "POST",
					param: {
						means_ids: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.isAll = false;
					this.selected = [];
					this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

