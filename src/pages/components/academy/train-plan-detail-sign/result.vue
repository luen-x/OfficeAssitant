<template>
	<div class="v-academy-train-plan-detail-sign-result g-m-l-20">
		<oa-title class="g-m-b-20">
			统计出勤情况
		</oa-title>
		<!-- <div
			v-for="(item, index) in sign_list"
			:key="index"
			class="_top-wrapper g-m-r-20 g-m-t-20"
		> -->
		<div class="_top-wrapper">
			<div class="__top-tile">
				<span class="g-m-l-10 g-m-r-10 g-fs-14 g-c-black1">{{ sign_list.sign_topic }}</span>
				<span class="g-c-black3">时间：{{ sign_list.in_start_time }} 至 {{ sign_list.in_end_time }}</span>

			</div>
			<div class="__content g-flex g-jc-sa">
				<span class="__icon-item">
					<i class="iconfont icon-iconzaotui g-fs-36" style="color: #FCB51C;"/>
					<span class="g-block g-m-l-10">总计<span class="g-fs-20 g-m-l-10">{{ sign_list.total || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-qiandao1 g-fs-36" style="color: #3EBF2B;"/>
					<span class="g-block g-m-l-10">签到<span class="g-fs-20 g-m-l-10">{{ sign_list.sign_in || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-qiantui1 g-fs-36" style="color: #ED8F4A;"/>
					<span class="g-block g-m-l-10">签退<span class="g-fs-20 g-m-l-10">{{ sign_list.sign_back || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-chuqinrenshu g-fs-36" style="color: #2397F9;"/>
					<span class="g-block g-m-l-10">缺勤<span class="g-fs-20 g-m-l-10">{{ sign_list.absence || 0 }}</span>人</span>
				</span>
			</div>
		</div>
		<oa-title class="g-m-b-20 g-m-t-20">
			管理出勤情况
		</oa-title>
		<div class="g-m-tb-20">
			<i-input
				v-model="search" 
				class="g-m-r-5"
				placeholder="请输入姓名进行搜索" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<div class="g-m-l-10 g-fr g-flex">
				<span
					class="g-red-btn-line g-m-r-10"
					@click="handleExport"
				>
					导出
				</span>
				<i-dropdown>
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item>
							<div @click="handleSelectTitle">选择表头</div>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<div class="_table">
			<i-table 
				ref="tableTarget" 
				:columns="columnsShow"
				:data="tableList"
				border
			/>
		</div>
		<div class="_detail-footer">
			<div class="__content" />
			<div class="__page">
				<i-page 
					:total="totalCount" 
					:page-size="pageSize"
					show-elevator 
					show-sizer 
					show-total
					@on-change="handlePageChange"
					@on-page-size-change="handlePageSizeChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Divider, Table, Tabs, TabPane, Page, Input, Button, Message, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { TableTitle } from "@components/_common/table-title/table-title";
import Title from '@components/hr/academy-train-detail/_common/title';
import item from './result-item';

export default {
	name: 'oa-tpl',
	components: {
		'oa-title': Title,
		'i-divider': Divider,
		'i-table': Table,
		'i-page': Page,
		'i-input': Input,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			flag: true,
			course_id: query.course_id || '',
			search: query.search || '',
			sign_list: [],
			totalCount: 0,
			page: query.page || 1,
			pageSize: query.pageSize || 10,
			title: {
				title_show: [],
				title_hide: []
			},
		};
	},
	computed: {
		columnsShow() {
			const columnsShow = this.$store.state.academyTrainPlanDetailSign.title.title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result; 
			}).filter(Boolean);
			return columnsShow;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadTableTitle();
		this.loadSignData();
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handlePageSizeChange(e) {
			this.pageSize = +e;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/academy/train/plan/detail/sign', 
				{ 
					...this.$route.query, 
					course_id: this.course_id,
					search: this.search,
					pageSize: this.pageSize
				}
			));
			this.loadData();
		}, 300),
		handlePageChange(e) {
			this.$router.replace(getHashUrl(
				'/academy/train/plan/detail/sign', 
				{ 
					...this.$route.query, 
					course_id: this.course_id,
					search: this.search,
					page: e,
					pageSize: this.pageSize
				}
			));
			this.loadData();
		},
		handleExport: lodash.debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._ACADEMY_TRAIN_PLAN_DETAIL_SIGN_RESULT_EXPORT_GET, {
				...query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300),
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.academyTrainPlanDetailSign.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_ACADEMY_COMMON_TABLE_TITLE_SAVE_POST',
				mutation: 'ACADEMY_TRAIN_PLAN_DETAIL_SIGN_TITLE_CHANGE',
				type: '1',
				scenario: 2
			}).then(() => {
				
			}).catch(() => {});
		},
		loadTableTitle() {
			this.$request({
				url: "_ACADEMY_COMMON_TABLE_TITLE_GET",
				type: "GET",
				param: {
					type: "1",
					scenario: 2
				},
				loading: false,
			}).then(res => {
				this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_SIGN_TITLE_CHANGE', { ...res.data });
			}).catch((res) => {
				console.error('error');
			});
		},
	},
};
</script>

<style lang="scss">
.v-academy-train-plan-detail-sign-result {
	margin-right: 20px;
	margin-bottom: 100px;
	._btn{
		border-color: #e84854;
		color: #e84854;
		height: 32px;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	._top-wrapper {
		width: 100%;
		background:rgba(35,151,249,0);
		border: 1px solid rgba(232, 232, 232, 1);
		border-radius: 4px;
		.__top-tile {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background:rgba(248,248,248,1);
			border-radius: 4px 4px 0px 0px;
			.ivu-divider {
				background-color: #e8eaec !important;
				margin: 0 15px;
			}
		}
		.__content {
			padding: 40px 0 40px 0;

			.ivu-divider-vertical {
				background-color: #e8eaec !important;
				height: 65px !important;
				margin: 0 3%;
				top: -7px;
			}
			.__icon-item {
				width: 240px;
				border-right: 1px solid #eee;
				text-align: center;
			}
			.__icon-item:last-child {
				width: 240px;
				border-right: none;
				text-align: center;
			}
		}
	}
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px
	}
	._total {
		height: 32px;
		line-height: 32px;
		background-color: #F5F5F6;
		padding-left: 20px;
		.__item{
			margin-right: 50px;
		}
	}
	._detail-footer {
		display: flex;
		justify-content: space-between;
		position: fixed;
		height: 45px;
		bottom: 0;
		right: 0;
		width: calc(100% - 340px) !important;
		padding: 10px 10px 10px 36px;
		background: #fff;
		-webkit-box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		z-index: 900;
		align-items: center;
		.__content {
			box-sizing: border-box;
		}
	}
}
</style>
