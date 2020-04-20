import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Confirm } from '@components/_common/confirm/confirm';
import { CategoryModal } from './modal/category';

export default {
	data() {
		return {
			columns: [
				{
					title: '类目名称',
					key: 'document_name',
					className: 'g-pd-l-10',
					render: (h, params) => {
						const { row: { __level__, __expand__, document_name, children }, index } = params;

						// 点击展开事件
						const handleClick = (e) => {
							this.$refs.tableTarget[this.type].expand({ index });
						};

						return h('div', {
							style: {
								marginLeft: `${(__level__ - 2) * 20}px`,
								boxSizing: `content-box`
							},
							class: children && "g-pointer",
							on: {
								click: handleClick 
							}
						}, [
							h('i', {
								class: `iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`  // eslint-disable-line
							}),
							h('span', {}, document_name)
						]);
					}
				},
				{
					title: '操作',
					key: 'link',
					width: 160,
					fixed: "right",
					render: (h, params) => {
						return (
							<Dropdown
								class="g-pointer"
								style="width: 100%; height: 100%;"
								transfer={true}
								placement="left-start"
								onOn-click={(name) => { this.handleOperate(name, params); }}
							>
								<i 
									class="iconfont icon-point g-fs-20 g-block"
									onClick={(e) => { e.stopPropagation(); }}
								/>

								<DropdownMenu slot="list">
									<DropdownItem name="1">
										添加
									</DropdownItem>
									<DropdownItem name="2">
										编辑
									</DropdownItem>
									<DropdownItem name="3">
										删除
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleOperate(name, obj) {
			let v = {
				label: obj.row.document_name,
				value: obj.row.project_id,
				document_id: obj.row.document_id,
				parent_document_name: obj.row.parent_document_name,
				parent_id: obj.row.parent_id
			};

			if (name != 3) {
				CategoryModal.popup({
					name,
					v,
					flag: 1
				}).then(res => {
					res && this.loadData();
				});
			} else {
				Confirm.popup({
					msg: '是否确认删除？',
					showIcon: true
				 }).then(() => {
					this.$request({
						url: "_TECH_PROJECT_PUBLISH_PRODUCTMENT_DOCUMENT_DEL_POST",
						type: "POST",
						param: {
							document_id: obj.row.document_id
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.loadData();
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}).catch(res => {});
			}
		},
		handleResetFirst() {
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};