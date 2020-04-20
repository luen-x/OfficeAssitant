import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Tooltip, Message } from "iview";
import { OSS_PROP_BG_L01, OSS_PROP_BG_L02, OSS_PROP_BG_L03, OSS_PROP_BG_L04,
	OSS_PROP_BG_L05, OSS_PROP_BG_L06, OSS_PROP_BG_L07 } from '@constants/constants';
import { PropertyModal } from './popup/property-modal';
import { PropertyCard } from '../_common/property/property-card';
import { PropModal } from '../_common/property/prop-modal';
import { DetailModal } from "../property-center/popup/detail-modal";

export default {
	data() {
		return {
			imageData: [OSS_PROP_BG_L01, OSS_PROP_BG_L03, OSS_PROP_BG_L07, OSS_PROP_BG_L02, OSS_PROP_BG_L06,
				OSS_PROP_BG_L04, OSS_PROP_BG_L05],
			columnsFirst: [
				{
					title: '道具',
					minWidth: 350,
					key: 'customer_name',
					render: (h, params) => {
						let prop_name = params.row.prop_name;
						let title = params.row.title;
						let image_url = this.imageData[params.row.type_id - 1];
						return (
							<div class="g-flex">
								<img 
									src={image_url}
									style="width: 75px; height: 75px;" 
									class="g-m-r-10 g-m-tb-10 g-block g-pointer"
									onClick={() => this.handleDetail(params.row)}
								/>
								<div style="width: 80%;">
									<AutoTooltip 
										content={prop_name} 
										theme="dark" 
										width=" 200"
										labelClass=" "
										class="g-m-t-15"
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
								</div>
							</div>
						);
					}
				},
				{
					title: '累计购买数量（件）',
					minWidth: 130,
					key: 'total_num',
				},
				{
					title: '累计使用数量（件）',
					minWidth: 130,
					key: 'use_num',
				},
				{
					title: '剩余可用数量（件）',
					minWidth: 130,
					key: 'remain_num',
				},
				{
					title: '最近购买时间',
					minWidth: 160,
					key: 'purchase_time',
				}
			],
			columnsSecond: [
				{
					title: '道具',
					minWidth: 350,
					key: 'customer_name',
					render: (h, params) => {
						let prop_name = params.row.prop_name;
						let title = params.row.title;
						let image_url = this.imageData[params.row.prop_type - 1];
						return (
							<div class="g-flex">
								<img 
									src={image_url}
									style="width: 75px; height: 75px;" 
									class="g-m-r-10 g-m-tb-10 g-block g-pointer"
									onClick={() => this.handleDetail(params.row)}
								/>
								<div style="width: 80%;">
									<AutoTooltip 
										content={prop_name} 
										theme="dark" 
										width=" 200"
										labelClass=" "
										class="g-m-t-15"
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
								</div>
							</div>
						);
					}
				},
				{
					title: '应用对象',
					minWidth: 200,
					key: 'object_name',
					render: (h, params) => {
						return (
							<span>{params.row.company_name || params.row.staff_name}</span>
						);
					}
				},
				{
					title: '状态',
					minWidth: 200,
					key: 'status',
				},
				{
					title: '操作时间',
					minWidth: 160,
					key: 'create_time',
				}
			],
		};
	},
	computed: {
		getColumns() {
			let columns = this.type == '2' ? [] : [{
				title: '操作',
				minWidth: 100,
				key: 'options',
				align: 'center',
				render: (h, params) => {
					return (
						<div>
							{
								params.row.remain_num ? <span 
									onClick={() => this.handleUse(params.row)} 
									class="g-operation"
								>
									去使用
								</span>
									: <span>
									去使用
									</span>
							}
						</div>
					);
				}
			}];
			this.type == 1 ? columns.unshift(...this.columnsFirst) : columns.unshift(...this.columnsSecond);
			return columns;
		},
	},
	methods: {
		handleDetail(row) {
			DetailModal.popup({
				datas: row
			}).catch(err => err && console.error(err));
		},
		handleUse(row) {
			if (row.type_id !== 4 && row.type_id !== 5) {
				this.$request({
					url: `_SALE_SEA_CUSTOMER_SURPLUS_PROP_GET`,
					type: 'GET',
					param: {
						prop_type: row.type_id
					},
					loading: false
				}).then((res) => {
					PropertyModal.popup({
						datas: row,
						number: res.data.surplus + ''
					});
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				PropertyCard.popup({
					typeId: row.type_id
				}).then(res => {
					this.$request({
						url: "_SALE_CUSTOMER_USE_PROP_POST",
						type: "GET",
						param: {
							prop_type: row.type_id
						},
						loading: false,
					}).then(resq => {
						this.$Message.success('使用成功');
						this.$store.commit('SALE_PROPERTY_MINE_LIST_INIT');
					}).catch((resq) => {
						this.$Message.error(resq.msg);
					});
				}).catch(err => err && console.log(err));
			}
		},
		handleResetFirst() {
			this.$store.commit('SALE_PROPERTY_MINE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_PROPERTY_MINE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

