import { Dropdown, DropdownMenu, DropdownItem, Message, Tooltip } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from "@components/_common/confirm/confirm";
import { NoteModal } from './popup/note';
import { AllocatProductModal } from "./popup/associat-product";
import { ExportSettingModal } from "./popup/export-setting";

export default {
	data() {
		return {
			columns: [{
				title: '导出模板',
				key: 'template_name',
				minWidth: 150,
				render: (h, params) => {
					return (
						<div>
							<AutoToolTip 
								content={params.row.template_name}
								width="180px"
								theme="dark"
								placement="bottom" 
								labelClass=""
							/>
						</div>
					);
				}
			},
			{
				title: '适用产品',
				key: 'product_name',
				minWidth: 220,
				render: (h, params) => {
					return (
						<div>
							<AutoToolTip 
								content={params.row.product_name}
								width="180px"
								theme="dark"
								placement="bottom" 
								labelClass=""
							/>
						</div>
					);
				}
			},
			{
				title: '创建人',
				key: 'create_person',
				minWidth: 150
			},
			{
				title: '上次更新时间',
				key: 'update_time',
				minWidth: 150
			}, {
				title: '备注',
				key: 'remark',
				minWidth: 200,
				render: (h, params) => {
					if (params.row.remark) {
						return (
							<div attrs={{ class: "_mouse-over" }} onClick={() => {
								this.handleNote(params);
							}}>
								<AutoToolTip 
									content={params.row.remark}
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass="g-pointer"
								/>
							</div>
						);
					} else {
						return (
							<div class="g-pointer" style="color: #2397F9;" onClick={() => {
								this.handleNote(params);
							}}>
								添加
							</div>
						);
					}
				}
			},
			{
				title: '操作',
				key: 'link',
				align: 'center',
				width: 100,
				render: (h, params) => {
					return (
						<Dropdown 
							class="g-pointer"
							style="cursor: pointer; width: 100%; height: 100%; text-align: center;"
							transfer={true}
							placement="left-start"
							onOn-click={(name) => this.handleOperate(name, params)}
						>
							<i 
								class="iconfont icon-point" 
								style="font-size: 20px; display: block"
								onClick={(e) => { e.stopPropagation(); }}
							/>
							<DropdownMenu slot="list">
								<DropdownItem name="1">
									关联产品
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
			}]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
				type: this.type
			});
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleNote(params) {
			NoteModal.popup({
				template_id: String(params.row.template_id),
				note: params.row.remark
			}).then(res => {
				res && 	this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
					type: this.type
				});
			});
		},

		handleOperate(name, params) {
			if (name === "1") {
				AllocatProductModal.popup({
					template_id: String(params.row.template_id)
				}).then(res => {
					res && this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
						type: this.type
					});
				});
			} else if (name === "2") {
				ExportSettingModal.popup({
					template_id: String(params.row.template_id),
					template_names: params.row.template_name
				}).then(res => {
					res && this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
						type: this.type
					});
				});
			} else {
				Confirm.popup({
					title: "删除提示",
					msg: "确认删除该导出模板？"
				}).then(() => {
					this.$request({
						url: "_SC_CUSTOMER_COOPERATE_EXPORT_DEL_TEMPLATE_POST",
						type: "POST",
						loading: false,
						param: {
							template_id: params.row.template_id
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORT_LIST_RESET', {
							type: this.type
						});
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}).catch(error => {});
			}
		}
	}
};