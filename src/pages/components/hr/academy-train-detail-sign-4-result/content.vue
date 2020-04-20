<template>
	<div class="v-hr-academy-train-detail-sign-result g-m-l-20">
		<oa-title class="g-m-b-20">
			统计出勤情况
		</oa-title>
		<div
			v-for="(item, index) in sign_list"
			:key="index"
			class="_top-wrapper g-m-r-20 g-m-t-20"
		>
			<div class="__top-tile">
				<span class="g-m-l-10 g-m-r-10 g-fs-14 g-c-black1">{{ item.sign_topic }}</span>
				<span class="g-c-black3">时间：{{ item.in_start_time }} 至 {{ item.in_end_time }}</span>
				<i-divider type="vertical"/>
				<span class="g-c-black4">请假：
					<span class="g-c-black2">{{ item.statistics.off_work || 0 }}人</span>
				</span>

				<i-divider type="vertical"/>
				<span class="g-c-black4">关联事项：
					<span v-if="item.relation_type == 1" class="g-c-black2">整个项目</span>
					<span v-if="item.relation_type == 2" class="g-c-black2">{{ item.relation_id.map(res => res.course_name).join(',') }}</span>
				</span>
			</div>
			<div class="__content g-flex g-jc-sa">
				<span class="__icon-item">
					<i class="iconfont icon-chuqinrenshu g-fs-36" style="color: #2397F9;"/>
					<span class="g-m-l-10 g-block">出勤<span class="g-fs-20 g-m-l-10">{{ item.statistics.attendance || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-qiandao1 g-fs-36" style="color: #3EBF2B;"/>
					<span class="g-m-l-10 g-block">正常签到<span class="g-fs-20 g-m-l-10">{{ item.statistics.sign_in || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-qiantui1 g-fs-36" style="color: #ED8F4A;"/>
					<span class="g-m-l-10 g-block">正常签退<span class="g-fs-20 g-m-l-10">{{ item.statistics.sign_back || 0 }}</span>人</span>
				</span>
				<span class="__icon-item">
					<i class="iconfont icon-queqin1 g-fs-36" style="color: #E74854;"/>
					<span class="g-m-l-10 g-block">缺勤<span class="g-fs-20 g-m-l-10">{{ item.statistics.absence || 0 }}</span>人</span>
				</span>

				<span 
					class="__icon-item"
				>
					<i class="iconfont icon-chidao g-fs-36" style="color: #11CBED;"/>
					<span class="g-m-l-10 g-block">迟到<span class="g-fs-20 g-m-l-10">{{ item.statistics.arrive_late || 0 }}</span>人</span>
				</span>
				<span 
					class="__icon-item"
				>
					<i class="iconfont icon-iconzaotui g-fs-36" style="color: #FCB51C;"/>
					<span class="g-m-l-10 g-block">早退<span class="g-fs-20 g-m-l-10">{{ item.statistics.leave_early || 0 }}</span>人</span>
				</span>
			</div>
		</div>
		<oa-title class="g-m-b-20 g-m-t-20">
			管理出勤情况
		</oa-title>
		<div class="_search-wrapper g-m-tb-20">
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
			<span
				class="g-m-l-10 g-fr g-red-btn-line"
				@click="handleExport"
			>
				导出出勤表
			</span>
		</div>
		<i-tabs 
			v-if="sign_list.length"
			:value="sign_id" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<div slot="extra" class="g-tr g-pd-lr-10 g-pd-t-5 g-pd-b-5" style="margin-bottom: -15px;"> 
				<span class="_split-bar"/>
				<span class="g-operation-hover" @click="handleSelectTitle" >选择表头</span> 
			</div>
			<i-tab-pane 
				v-for="(item) in sign_list"
				:key="item.sign_id"
				:label="item.sign_topic" 
				:name="item.sign_id + ''"
			>
				<div class="_time-wrapper g-m-b-20">
					<span class="g-m-r-30">开场时间：{{ item.in_start_time }} 至 {{ item.in_end_time }}</span>
					<span class="g-m-l-20 g-m-r-30">离场时间：{{ item.back_start_time }} 至 {{ item.back_end_time }}</span>
					<span class="g-m-l-20">关联事项：
						<span v-if="item.relation_type == 1">整个项目</span>
						<span v-if="item.relation_type == 2">{{ item.relation_id.map(res => res.course_name).join(',') }}</span>
					</span>
				</div>
				<div class="_total g-m-b-20">
					<span class="g-m-r-30">总计</span>
					<span class="g-c-black4 __item">请假：<span class="g-c-black1">{{ item.statistics.off_work || 0 }}人</span></span>
					<span class="g-c-black4 __item">签到：<span class="g-c-black1">{{ item.statistics.sign_in || 0 }}人</span></span>
					<span class="g-c-black4 __item">签退：<span class="g-c-black1">{{ item.statistics.sign_back || 0 }}人</span></span>
					<span class="g-c-black4 __item">缺勤：<span class="g-c-black1">{{ item.statistics.absence || 0 }}人</span></span>
					<span class="g-c-black4 __item">迟到：<span class="g-c-black1">{{ item.statistics.arrive_late || 0 }}人</span></span>
					<span class="g-c-black4 __item">早退：<span class="g-c-black1">{{ item.statistics.leave_early || 0 }}人</span></span>
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
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Divider, Table, Tabs, TabPane, Page, Input, Button, Message } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { TableTitle } from "@components/_common/table-title/table-title";
import Title from '@components/hr/academy-train-detail/_common/title';
import item from './item';

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
		'i-button': Button
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			sign_id: query.sign_id || '',
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
			const columnsShow = this.$store.state.hrAcademyTrainDetailSign0Manage.title.title_show.map(cloShow => {
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
		handleChange(sign_id) {
			this.sign_id = sign_id + '';
			let { query = {} } = getParseUrl(); 
			query = {
				...query,
				sign_id: this.sign_id,
			};
			this.$router.replace(getHashUrl('/hr/academy/train/detail/sign/4/result', { ...query }));
			this.loadData();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/sign/4/result', 
				{ 
					...this.$route.query, 
					sign_id: this.sign_id,
					search: this.search,
					pageSize: this.pageSize
				}
			));
			this.loadData();
		}, 300),
		handlePageChange(e) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/sign/4/result', 
				{ 
					...this.$route.query, 
					sign_id: this.sign_id,
					search: this.search,
					page: e,
					pageSize: this.pageSize
				}
			));
			this.loadData();
		},
		handleExport: lodash.debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._HR_ACADEMY_TRAIN_SIGN_RESULT_EXPORT_GET, {
				...query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300),
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyTrainDetailSign0Manage.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_TITLE_CHANGE',
				type: '1',
				params: {
					table_type: 8
				}

			}).then(() => {
				
			}).catch(() => {});
		},
		loadTableTitle() {
			this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					table_type: 8
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_TITLE_CHANGE', { ...res.data, type: '1' });
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	},
};
</script>

<style lang="scss">
.v-hr-academy-train-detail-sign-result {
	margin-right: 20px;
	margin-bottom: 100px;
	._top-wrapper {
		width: 100%;
		// min-width: 1200px;
		// height: 167px;
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
