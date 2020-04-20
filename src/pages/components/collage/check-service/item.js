import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import callService from '@components/sale/call-manage/call/service';
import { Tooltip } from 'iview';
import { AllocateModal } from './popup/allocate-modal';
import { DetailDrawer } from "./popup/detail.vue";



export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-check-service-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-check-service-title-change');
	},
	methods: {
		handleCall(row) {
			let cus = {
				...row,
				tel: row.phone
			};
			callService.prepareToCallOut(row.phone, { customer: cus });
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: '公司名称',
					key: 'contract_company_name',
					fixed: 'left',
					minWidth: 240,
					render: (h, params) => {
						let contract_company_name = params.row.contract_company_name;
						return (
							<div class="g-flex-ac g-pointer" >
								<span>
									{ contract_company_name.length <= 10
										? <span class="g-c-blue-mid g-oneline">
											{contract_company_name}
										</span>
										: <Tooltip class="g-c-blue-mid" transfer>
											{contract_company_name.slice(0, 10) + '...'}
											<div slot="content">
												<p style="whiteSpace: normal">
													{contract_company_name}
												</p>

											</div>
										</Tooltip>
									}
								</span>
								{ params.row.is_appeal ? <span class="_tag g-m-l-20">质检申诉</span> : '' }
							</div>
						);
					}
				},
				{
					title: '客户姓名',
					minWidth: 150,
					key: 'customer_name',
				},
				{
					title: '客户手机号',
					minWidth: 150,
					key: 'phone',
					render: (h, { row }) => {
						if (!_global.staff.seat_number) {
							return (
								<span>{row.phone}</span>
							);
						} else {
							return (
								<span
									class="_value g-operation"
									onClick={
										() => {
											window.event.stopPropagation();
											this.handleCall(row);
										}
									}
								>
									{row.phone}
									<i class="icon iconfont icon-call2 g-m-l-5" />
								</span>
							);
						}
					}
				},
				{
					title: '客户职位',
					minWidth: 150,
					key: 'customer_position',
				},
				{
					title: '品牌名称',
					minWidth: 150,
					key: 'brand_name',
					render: (h, params) => {
						let brand_name = params.row.brand_name;
						return (
							<AutoToolTip 
								content={brand_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '下单产品',
					minWidth: 150,
					key: 'product_items',
					render: (h, params) => {
						let product_items = params.row.product_items.join(',');
						return (
							<AutoToolTip 
								content={product_items}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '最新课程结束时间',
					minWidth: 180,
					key: 'lesson_complete_time',
				},
				{
					title: '待质检套系',
					minWidth: 150,
					key: 'need_quality_lesson',
				},
				{
					title: '质检方式',
					minWidth: 150,
					key: 'quality_type',
				},
				{
					title: '最近质检人',
					minWidth: 150,
					key: 'quality_staff_name',
				},
				{
					title: '最近质检时间',
					minWidth: 180,
					key: 'quality_date',
				},
				{
					title: '最近总体评分',
					minWidth: 160,
					key: 'quality_lesson_items',
					render: (h, params) => {
						let quality_lesson_items = params.row.quality_lesson_items.map(v => {
							return v.lecture_set_name + v.whole_score + '分';
						}).join(',');
						return (
							<AutoToolTip 
								content={quality_lesson_items || '-'}
								width="140px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '邀约人',
					minWidth: 150,
					key: 'invitor_name',
				},
				{
					title: '邀约人部门',
					minWidth: 150,
					key: 'invitor_depart_name',
				},
				{
					title: '下单时间',
					minWidth: 150,
					key: 'place_order_time',
				},
				{
					title: '分配人',
					minWidth: 120,
					key: 'assign_person_name',
				},
				{
					title: '分配时间',
					minWidth: 170,
					key: 'assign_time',
				},
				{
					title: '待质检人',
					minWidth: 120,
					key: 'assign_staff_name',
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			columnsShow.unshift({
				type: "selection",
				fixed: "left",
				minWidth: 50
			});
			columnsShow.push({
				title: '操作',
				minWidth: 180,
				key: 'options',
				fixed: 'right',
				render: (h, params) => {
					let self_type = this.type;
					return (
						<div>
							{
								self_type == '4' ? ''
									: this.$auth[1345] ? <span class="g-operation" onClick={(e) => {
										e.stopPropagation();
										this.handleAllocate([params.row.quality_id]);
									}}>分配</span> : ''
							}
							{
								self_type == '4' ? ''
									: this.$auth[1345]
										? <span style={{ color: "#2397f9", width: "1px", height: "10px", margin: "0 10px 0 10px" }}>
									|
										</span> : ''
							}
							{
								this.$auth[1346] ? <span class="g-operation" onClick={(e) => {
									e.stopPropagation(); 
									this.handleOpenDrawer(params.row, 'courseRecords');
								}}>添加质检记录</span> : ''
							}
						</div>
							
					);
				}
			});
			

			return columnsShow;
		},
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleOpenDrawer(row, tab) {
			if (!this.$auth[1347]) {
				return;
			}
			DetailDrawer.popup({
				type: this.type,
				quality_id: Number(row.quality_id),
				contract_company_id: Number(row.contract_company_id),
				data: row,
				name: tab == 'courseRecords' ? tab : ''
			}).then(res => {
				// res && this.$store.commit("COLLAGE_CHECK_SERVICE_LIST_RESET", {
				// 	type: this.type
				// });
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleAllocate(item) {
			AllocateModal.popup({
				type: this.type,
				quality_ids: item
			}).then(res => {
				this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_INIT');
			});
		},
		handleEdit() {

		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

