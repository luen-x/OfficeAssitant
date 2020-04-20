import { Confirm } from "@common/confirm/confirm";
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Tooltip, Message } from "iview";
import { OSS_PROP_BG_L01, OSS_PROP_BG_L02, OSS_PROP_BG_L03, OSS_PROP_BG_L04,
	OSS_PROP_BG_L05, OSS_PROP_BG_L06, OSS_PROP_BG_L07, OSS_PROP_ICON3 } from '@constants/constants';

export default {
	data() {
		return {
			imageData: [OSS_PROP_BG_L01, OSS_PROP_BG_L03, OSS_PROP_BG_L07, OSS_PROP_BG_L02, OSS_PROP_BG_L06,
				OSS_PROP_BG_L04, OSS_PROP_BG_L05],
			columns: [
				{
					type: 'selection',
					width: 50
				},
				{
					title: '道具',
					minWidth: 350,
					key: 'customer_name',
					render: (h, { row }) => {
						let prop_name = row.prop_name;
						let title = row.title;
						let image_url = this.imageData[row.type_id - 1];
						let price = row.price;
						return (
							<div class="g-flex">
								<img src={image_url} class="g-block " style="width: 75px; height: 75px;" class="g-m-r-10 g-m-tb-10"/>
								<div style="width: 80%;">
									<AutoTooltip 
										content={prop_name} 
										theme="dark" 
										width=" 200"
										labelClass=" "
										style="margin-top: 12px;"
										placement="bottom" />
									<div class="g-m-t-5" style="color: #818794">
										<span>
											{ title.length <= 30
												? <span>{title}</span>
												: <Tooltip class="g-pointer" transfer>
													{title.slice(0, 30) + '...'}
													<div slot="content">
														{title}
													</div>
												</Tooltip>
											}
										</span>
									</div>
									<div class="g-m-t-10 g-relative" style="color: #E74854">
										<img 
											src={OSS_PROP_ICON3}
											class="g-inline-block g-absolute"
											style="width: 20px;height: 20px;left: 0px;bottom: 0px;"
										/>
										<span style="padding-left: 25px;">{price}微币</span>
									</div>
								</div>
							</div>
						);
					}
				},
				{
					title: '销量（件）',
					minWidth: 100,
					key: 'sell_num',
				},
				{
					title: '道具说明',
					minWidth: 210,
					key: 'remark',
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.remark}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '创建时间',
					minWidth: 160,
					key: 'create_time',
				},
				{
					title: '操作',
					key: 'opt',
					width: 120,
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								<span onClick={() => { this.handleEdit(row); }}>编辑</span>
								<span class="g-pd-lr-10">|</span>
								<span onClick={() => { this.handleDelete([row.prop_id]); }}>{this.type == '1' ? '下架' : '删除'}</span>
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_PROPERTY_CONTROL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_PROPERTY_CONTROL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(row) {
			this.$router.push({
				path: '/sale/property/control/add',
				query: {
					edit: '1',
					prop_id: row.prop_id
				}
			});
		},
		handleDelete(val) {
			Confirm.popup({
				title: "提醒",
				msg: `是否${this.type == '1' ? '下架' : '删除'}道具？`,
				showIcon: true
			}).then(() => {
				let api = this.type == '1' ? '_SALE_PROPERTY_CONTROL_PROPERTY_DOWN_POST' : '_SALE_PROPERTY_CONTROL_PROPERTY_DELETE_POST';
				this.$request({
					url: api,
					type: "POST",
					param: {
						prop_ids: val
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('SALE_PROPERTY_CONTROL_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
	}
};

