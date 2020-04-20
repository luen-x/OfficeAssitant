<template>
	<vc-paging
		:columns="columns"
		:show="true"
		:type="1"
		:data-source="listInfo[1].data"
		:total="listInfo[1].total"
		:table-opts="{height: tableHeight,}"
		:reset="listInfo[1].reset"
		:current.sync="current[1]"
		:history="true"
		:load-data="loadData"
		class="v-sale-train-study-list g-m-t-20"
		mode="table"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { TableTitle } from '@components/_common/table-title/table-title';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Tooltip, Tabs, TabPane } from 'iview';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({ extra: 150 }), autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || '1'), // 同tabs下的value
			current: {},
			count: {},
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTrainStudy.listInfo;
		},
		tabs() {
			const tabs = [{ label: `课程记录${this.count.total_count || 0}`, value: '0' }];
			if (this.$auth[506]) tabs.push({ label: `必修${this.count.compulsory_count || 0}`, value: '1' });
			if (this.$auth[507]) tabs.push({ label: `选修${this.count.elective_count || 0}`, value: '2' });
			if (this.$auth[509]) tabs.push({ label: `内训${this.count.internal_count || 0}`, value: '3' });
			return tabs;
		},
		columnsShow() {
			let columnsShow = this.$store.state.saleTrainStudy.title[0].title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key：" + cloShow.key);
				return result;
			}).filter(Boolean);
			let ope2 = {
				title: '操作',
				key: 'title',
				minWidth: 120,
				fixed: 'right',
				render: (h, { row }) => {
					return (
						<Dropdown trigger="hover" placement="left" width="112" transfer>
							<div style="width: 100%;height: 100%;">
								<i class="iconfont icon-point" style="font-size: 18px;" />
							</div>
							<DropdownMenu slot="list" class="_handle" style="text-align: left;">
								{
									row.show_study_online == 1 ? <span onClick={(e) => { e.stopPropagation; this.handleGoStudy(row); }}>
										<DropdownItem class="g-pointer">线上学习</DropdownItem>
									</span> : ('')
								}
								{
									row.exam_audit.is_show ? <span onClick={() => { this.handleUploadProof(row); }}>
										<DropdownItem class="g-pointer">{row.exam_audit.status == 2 ? '查看申请'
										 : row.exam_audit.audit_id ? '重新编辑' : '上传凭证'}</DropdownItem>
									</span>
									 : ('')
								}
								{
									row.exam.is_show ? <span>
										{
											row.exam.status == 1 ? <span onClick={() => { this.handleGoExam(row.exam.exam_id, row.exam); }}
											>
												<DropdownItem class="g-pointer">{
													row.exam.result_id ? ' 查看考试结果' : ' 首考'
												}</DropdownItem>
											</span> : ('')
										}
										{row.exam.status == 0
											? (row.exam.result_id
												? <span onClick={() => { this.handleGoExam(row.exam.exam_id, row.exam); }}
												>
													<DropdownItem class="g-pointer">
															查看考试结果
													</DropdownItem>
												</span>
												: <DropdownItem class="g-pointer">
													<span style={{ color: '#bfbfbf' }}>
													首考
													</span>
												 </DropdownItem>
												 ) : ''
										}
										{
											row.exam.again.length > 0 && row.exam.again.map(ele => {
												return <span>
													{ ele.status == 1 || ele.result_id > 0
														? <span onClick={() => { this.handleGoExam(ele.exam_id, ele); }}>
															<DropdownItem class="g-pointer">
																{'补考' + ele.sort}
															</DropdownItem>
														</span>
														: ('') }
												</span>;

											})
										}
									</span> : ('')
								}
								{
									!row.exam_audit.is_show && row.show_study_online != 1 && !row.exam.is_show ? <span >
										<DropdownItem style={{ color: '#bfbfbf' }} class="g-pointer">暂无操作</DropdownItem>
									</span>
									 : ('')
								}
								{
									row.source == 2 && row.exam_status != 1 ? <span onClick={() => { this.handleDel(row.course_id); }}>
										<DropdownItem class="g-pointer">
										删除
										</DropdownItem>
									</span>
									 : ('')
								}
							</DropdownMenu>
						</Dropdown>
					);
				}
			};
			const col = [...columnsShow];
			if (this.type != 0)col.push(ope2);
			return col;
		},
	},
	created() {
		// this.loadTableTitle();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TRAIN_STUDY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data;
				const count = [this.count.total_count, this.count.compulsory_count, this.count.elective_count, this.count.internal_count];
				this.resetType('0', count, '/sale/train/study');
			}).catch((error) => {
				console.error(error);
			});
		},
		loadTableTitle() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					table_type: '6',
				},
				loading: false,
			}).then(res => {
				this.$store.commit('SALE_TRAIN_STUDY_TITLE_CHANGE', { ...res.data, type: '0' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleChangeTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleTrainStudy.title['0'];
			TableTitle.popup({
				dataShow: dataShow || [],
				dataHide: dataHide || [],
				saveUrl: '_SALE_TRAIN_STUDY_INDIVIDUAL_LIST_POST',
				mutation: 'SALE_TRAIN_STUDY_TITLE_CHANGE',
				type: '0',
				params: {
					table_type: Number('6'),
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$store.commit("SALE_TRAIN_STUDY_LIST_RESET", {
					type: '0'
				});
				this.loadDataSummary();
			}).catch(() => { });

		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/train/study', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_TRAIN_STUDY_LIST_INIT');
		}
	}
};

</script>

<style scoped lang="scss">
        ._split-bar {
            position: relative;
            display: inline-block;
            margin: 0 10px;
            width: 1px;
            height: 12px;
            background: rgba(232, 232, 232, 1);
            top: 2px;
        }
</style>
