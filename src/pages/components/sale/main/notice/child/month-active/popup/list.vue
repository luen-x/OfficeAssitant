<template>
	<div class="v-achievement-filter">
		<div class="g-m-l-20">
			<i-input
				v-model="keyword"
				:maxlength="50"
				style="width:300px"
				clearable
				placeholder="请输入公司名称、活动名称搜索"
				@on-change="handleInputChange"
				@on-enter="handleSearch"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>搜索</vc-debounce-click>
			<span class="g-m-l-20 g-c-black3 g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-20 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="active"
					clearable
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择活动类型"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in ActiveType"
						:key="item.category_id"
						:value="item.category_id"
					>{{ item.category_name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="month"
					format="yyyy-MM-dd"
					type="daterange"
					split-panels
					style="width: 220px"
					class="g-m-r-5"
					transfer
					placeholder="请选择报名时间"
					@on-change="handleMonth"
				/>
				<i-select
					v-model="status"
					clearable
					style="width:200px"
					class="g-m-r-5"
					placeholder="请选择报名状态"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,i) in statusType"
						:value="item.id"
						:key="i"
					>{{ item.value }}</i-option>
				</i-select>
			</div>
		</vc-expand>
		<i-tbale
			:columns="columns"
			:data="applyList"
			:height="tableHeight"
			stripe
			class="_activeList g-m-l-20 g-m-t-20"
		/>
		<div class="_page">
			<i-page
				:total="total"
				:current="page"
				:page-size="pageNum"
				show-sizer
				show-elevator
				@on-change="handleChangePage"
				@on-page-size-change="handlePage"
			/>
		</div>
	</div>
</template>
<script>
import { Paging, Expand } from 'wya-vc';
import API from '@stores/apis/root';
import { Input, Button, DatePicker, Select, Option, Table, Page, Tooltip, Poptip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModal } from "./detail";
import { Confirm } from "./confirm";
import { PSignUp } from "./sign-up";

export default {
	name: "vc-paging-basic",
	components: {
		'vc-paging': Paging,
		'i-input': Input,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-tbale': Table,
		"i-page": Page,
	},
	props: {
		activity_id: {
			type: [String, Number],
			default: () => {
				return '';
			}
		},
		type: {
			type: String,
			default: () => {
				return '';
			}
		},
		search: {
			type: String,
			default: '',

		}
	},
	data() {
		const { query } = this.$route;
		return {
			keyword: String(this.search || ''), // 关键字
			show: false,
			pageNum: 10, // 每页显示多少条
			ActiveType: [],
			tableHeight: '',
			month: [],
			active: '',
			status: '',
			activeDetail: { category_name: 1111 }, // 活动详情
			statusType: [
				{ id: "1", value: '待审核' },
				{ id: "2", value: '已通过' },
				{ id: "3", value: '已拒绝' }
			],
			total: null,
			page: null,
			applyList: [], // 申请列表
			listInfo: {
				// ...initPage
			},
			table: undefined,
			columns: [
				{
					title: '公司名称',
					key: 'customer_company',
					width: 200,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div class="g-operation">
								<span onClick={
									() => this.handleDetail(params.row.apply_id)
								}>	{params.row.customer_company.length <= 10
                                    && params.row.customer_company}
									{params.row.customer_company.length > 10 && (
										<Tooltip
											transfer
											content={params.row.customer_company}
											maxWidth={250}>
											{params.row.customer_company.substr(0, 10) + '...'}
										</Tooltip>
									)}</span>
							</div>
						);
					}
				},
				{
					title: '活动类型',
					key: 'category_name',
					minWidth: 130,
				},
				{
					title: '活动名称',
					key: 'activity_name',
					minWidth: 170,
					render: (h, params) => {
						return (
							<div >
								<Poptip trigger="hover" transfer onOn-popper-show={() => this.handleHover(params.row)}
									title="活动详情" placement="bottom-start">
									<div class="api" slot="content" style="max-height:400px;overflow-y: auto;">
										<div slot="content" style="width:350px">
											<div class="g-flex g-m-b-5" syele="width: 350px;white-space: normal;">
												<div class="g-m-r-5">活动分类:</div>
												<div class="_fontbold">
													<span>{this.activeDetail.category_name}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5">
												<div class="g-m-r-5">活动名称:</div>
												<div class="_fontbold">
													<span>{this.activeDetail.activity_name}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5">
												<div class="g-m-r-5">活动时间:</div>
												<div class="_fontbold">
													<span >{this.activeDetail.start_time}</span>
                                                    至
													<span>{this.activeDetail.end_time}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5">
												<div class="g-m-r-5">报名时间:</div>
												<div class="_fontbold">
													<span>{this.activeDetail.apply_start_time}</span>
                                                    至
													<span>{this.activeDetail.apply_end_time}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5" style="width: 350px;white-space: normal;">
												<div class="g-m-r-5" style="min-width:53px;">活动地址:</div>
												<div class="_fontbold">
													<span>{this.activeDetail.address}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5">
												<div class="g-flex " >
													<div class="g-m-r-5">限制人数:</div>
													<div class="_fontbold">{this.activeDetail.apply_limit}</div>
												</div>
												<div class=" g-flex" style="padding-left: 40px">
													<div class="g-m-r-5">已报名人数:</div>
													<span class="_fontbold">{this.activeDetail.apply_count}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5">
												<div class="g-m-r-5">可超人数:</div>
												<div class="_fontbold">
													<span>{this.activeDetail.extra_apply}</span>
												</div>
											</div>
											<div class="g-flex g-m-b-5 " style="width: 350px;white-space: normal;">
												<div class="g-m-r-5" style="min-width:53px;">活动说明:</div>
												<div class="_fontbold">{this.activeDetail.describe}</div>
											</div>
										</div>
									</div>
									<span class="g-operation">{params.row.activity_name.length <= 10
                                    && params.row.activity_name}
									{params.row.activity_name.length > 10 && params.row.activity_name.substr(0, 10) + '...'}
									</span>
								</Poptip>
							</div>
						);
					}
				},
				{
					title: '报名时间',
					key: 'create_time',
					minWidth: 150,
				},
				{
					title: '参加人数',
					key: 'apply_num',
					minWidth: 90,
				},
				{
					title: '对接人',
					key: 'staff_name',
					minWidth: 100,
				},
				{
					title: '报名状态',
					key: 'status_name',
					minWidth: 100,
				},
				{
					title: '操作',
					key: 'status_name',
					minWidth: 150,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div class="g-operation g-flex">
								{params.row.is_self == 1 && params.row.status == 1 && params.row.activity_status == 2
								 ? (<span class="g-m-r-20" onClick={(e) => {
										e.stopPropagation();
										this.handleEditor(params.row);
									}}> 重新编辑</span>) : (<span class="g-m-r-20" style={{ color: "#bbb" }} > 重新编辑</span>)}
								{ params.row.is_self == 1 && params.row.status == 1 ? (<span onClick={(e) => {
									e.stopPropagation();
									this.handleWithdraw(params.row);
								}} >撤回</span>) : (<span class="g-m-r-20" style={{ color: "#bbb" }} > 撤回</span>)}
							</div>
						);
					}
				}
			],
		};
	},
	computed: {

	},
	watch: {
		activity_id(v) {
			setTimeout(() => {
				this.handleFetch(v);
			}, 0);
			this.activity_id = v;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.activity_id ? this.handleFetch(this.activity_id) : this.handleFetch();
		this.getCategory();
	},
	methods: {
		handleIsSelf(v) {
			this.$request({
				url: API._SALE_MAIN_ACTIVITY_IS_SELF_GET,
				type: "GET",
				loading: false,
				param: {
					company_name: v.customer_company,
					source: v.source,
					customer_type: v.customer_type,
				}
			}).then(res => {
				if (res.data.is_other == 1) {
					this.$Message.error(res.data.message);
				} else {
					PSignUp.popup({ data: { activeId: v.activity_id, apply_id: v.apply_id, apply_type: this.type } });
				}
			});
		},
		handlePage(val) {
			this.pageNum = val;
			this.handleFetch();
		},
		handleChangePage(val) {
			this.pageSize = val;
			this.handleFetch();
		},
		handleSearch(event) {
			this.pageSize = 1;
			this.pageNum = 10;
			this.handleFetch();

		},
		handleEditor(v) {
			if (v.source == 2) {
				this.handleIsSelf(v);
			} else {
				PSignUp.popup({ data: { activeId: v.activity_id, apply_id: v.apply_id, apply_type: this.type } });

			}
		},
		handleHover(i) {
			this.GetActiveDetail(i.activity_id);
		},
		handleWithdraw(v) {
			Confirm.popup({}).then((data) => {
				this.$request({
					url: API._SALE_MAIN_ACTIVEITY_RECALL_APPLY_GET,
					type: "get",
					param: {
						apply_id: v.apply_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleFetch();
				}).catch(error => {
					this.$Message.error(error.msg);
					console.error(error);
				});
			}).catch();

		},
		GetActiveDetail(i) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_DETAIL_GET,
				type: "get",
				param: {
					id: i
				}
			}).then(res => {
				this.activeDetail = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		handleFetch(v) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_LIST_GET,
				type: "GET",
				loading: false,
				param: {
					label: this.label,
					page: this.pageSize,
					keyword: this.keyword,
					category_id: this.active,
					create_time_start: this.month[0],
					create_time_end: this.month[1],
					type: this.status,
					pageSize: this.pageNum,
					is_sale_page: 1,
					activity_id: v || this.activity_id
				}
			}).then((res) => {
				this.applyList = res.data.list;
				this.total = res.data.totalCount;
				this.page = res.data.currentPage;
				this.$nextTick(() => {
					this.tableHeight = this.applyList.length > 10 && this.pageNum > 10 ? 500 : '';
				});
			}).catch((err) => {
				console.error(err);
			});
		},
		getCategory() {
			this.$request({
				url: API._SALE_MAIN_ACTIVITY_CATEGORY_GET,
				type: "GET",
			}).then((res) => {
				this.ActiveType = res.data;
			}).catch((err) => {
				console.error(err);
			});
		},
		handleMonth(v) {
			this.month = v;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 详情
		handleDetail(v) {
			PModal.popup({
				data: {
					id: v,
				}
			});

		}
	}
};
</script>
<style lang="scss">
    .v-achievement-filter {
        height: calc(100vh - 178px);
        ._fontbold {
		color: #333
        }
        ._activeList {
            .ivu-table-header {
                th {
                    font-weight: normal;
                }
            }
            .ivu-table-body {
                max-height: 500px;
                overflow-y: auto;
            }
        }
        ._page {
			height: 60px;
			background: #fff;
            padding-top: 13px;
            position: fixed;
            bottom: 13px;
            padding-right: 40px;
            text-align: right;
            width: 100%;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }


    }
</style>