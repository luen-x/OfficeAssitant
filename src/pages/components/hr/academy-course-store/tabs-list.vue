<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card"
		class="v-hr-academy-course-store"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div slot="extra" class="g-tr g-pd-lr-10 g-pd-t-5 g-pd-b-5" style="margin-bottom: -15px;"> 
			<span class="_split-bar"/>
			<span class="g-operation-hover" @click="handleChangeTableTitle" >选择表头</span> 
		</div>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columnsShow"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-hr-academy-course-store-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
				@page-change="handlePageChange"
				@selection-change="handleSelectionChange"
			>
				<div v-if="$auth[1044]||$auth[1045]||$auth[1046] || $auth[1047]" slot="extra" class="g-flex-ac">
					<i-checkbox v-model="isAll" @on-change="handleIsAll">全选</i-checkbox>
					<i-button v-if="type!=1 && $auth[1045]" @click="handleChangeCourseType(1)">设为必修</i-button>
					<i-button v-if="type!=2 && $auth[1046]" class="g-m-l-5" @click="handleChangeCourseType(2)">设为选修</i-button>
					<i-button v-if="type!=3 && $auth[1047]" class="g-m-l-5" @click="handleChangeCourseType(3)">设为内训</i-button>
					<i-button v-if="$auth[1044]" class="g-m-l-5" @click="handleDelete">删除</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { Confirm } from '@common/confirm/confirm';
import { TableTitle } from '@components/_common/table-title/table-title';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';
import { ChoosePaper } from '../_common/academy-course/drawers/choose-paper';


export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight(), autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' }, 
				{ label: '必修课', value: '1' }, 
				{ label: '选修课', value: '2' }, 
				{ label: '内训课', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCourseStore.listInfo;
		},
		columnsShow() {
			const columnsShow = this.$store.state.hrAcademyCourseStore.title.title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result; 
			}).filter(Boolean);
			if (this.$auth[1044] || this.$auth[1045] || this.$auth[1046] || this.$auth[1047]) {
				columnsShow.splice(0, 0, {
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10"
				});
			}
			if (this.$auth[1043]) {
				columnsShow.push({
					title: "操作",
					key: "-",
					fixed: 'right',
					width: 80,
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => this.handleEdit(row)}>
								编辑
							</div>
						);
					}
				});
			}
			return columnsShow;
		}

	},
	watch: {
		columnsShow() {
			this.$nextTick(() => {
				this.$refs.tableTarget.forEach(i => {
					i.$refs.tableTarget.handleResizeCopy && i.$refs.tableTarget.handleResizeCopy();
				});
			});

		}
	},
	created() {
		this.loadTableTitle();
		setTimeout(() => {
			this.$refs.tableTarget.forEach(i => {
				i.$refs.tableTarget.handleResizeCopy = i.$refs.tableTarget.handleResize;
				i.$refs.tableTarget.handleResize = () => {};
			});
		}, 1000);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.isAll = false;
			this.selected = [];
			return this.request({
				url: 'HR_ACADEMY_COURSE_STORE_LIST_GET',
				type: 'GET',
				initList: (list) => {
					return list.map(it => ({
						 ...it,
						  lecture: it.lecture.map(i => i.staff_name).join('、')
					}));
				},
				param: {
					...query,
					type: this.type,						
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/academy/course/store');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.handleIsAll(false);
			this.isAll = false;
			this.type = type;
			
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/course/store', { ...query }));
		},
		handleChangePageSize() {
			this.handleResetFirst();
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type].$refs.tableTarget.selectAll(val);
		},
		handleDelete() {
			if (this.selected.length == 0) {
				this.$Message.warning("请选择要删除的课程");
				return;
			}
			Confirm.popup({
				msg: "删除后将无法恢复，确定要删除吗？"
			}).then(() => {
				this.$request({
					url: "_HR_ACADEMY_COURSE_STORE_DELETE_POST",
					type: "POST",
					param: {
						course_ids: this.selected.map((course => course.course_id))
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			}).catch(() => {

			});
			

		},
		handleChangeCourseType(type) {
			if (this.selected.length == 0) {
				this.$Message.warning("请选择要操作的课程");
				return;
			}
			this.$request({
				url: "_HR_ACADEMY_COURSE_UPDATE_COURSE_TYPE_POST",
				type: "POST",
				param: {
					course_ids: this.selected.map(it => it.course_id),
					course_type: type
				},
				loading: true,
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyCourseStore.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_COURSE_STORE_TITLE_CHANGE',
				type: '1',
				params: {
					table_type: 2
				}

			}).then(() => {
				
			}).catch(() => {});

		},
		loadTableTitle() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					table_type: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_COURSE_STORE_TITLE_CHANGE', { ...res.data, type: '1' });
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},

	}
};

</script>

<style lang="scss">
.v-hr-academy-course-store {
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px

	}
}
</style>
