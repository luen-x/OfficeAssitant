<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-academy-statistic-study-detail"
		@on-close="handleCancel"
	>
		<oa-detail-header :data="memberData"/>
		<i-tabs
			v-if="detailShow" 
			:value="type"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item, i) in tabs"
				:key="i"
				:label="item.label"
				:name="item.value"
			>
				<div v-if="item.value == '1'">
					<oa-tab-train :staff="staff" :applicant="applicant" :show-item="type === item.value"/>
				</div>
				<div v-if="item.value == '2'">
					<oa-tab-project :staff="staff" :applicant="applicant" :show-item="type === item.value"/>
				</div>
				<div v-if="item.value == '3'">
					<oa-tab-item :staff="staff" :applicant="applicant" :show-item="type === item.value"/>
				</div>
				<div v-if="item.value == '4'">
					<oa-tab-course :staff="staff" :applicant="applicant" :show-item="type === item.value"/>
				</div>
			</i-tab-pane>
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Button, Tabs, TabPane } from "iview";
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import DetailHeader from './detail-header';
import TabTrain from './tab-train';
import TabProject from './tab-project';
import TabItem from './tab-item';
import TabCourse from './tab-course';

export default {
	name: "v-hr-academy-statistic-study-detail",
	components: {
		"i-drawer": Drawer,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-detail-header': DetailHeader,
		'oa-tab-train': TabTrain,
		'oa-tab-project': TabProject,
		'oa-tab-item': TabItem,
		'oa-tab-course': TabCourse,
	},
	props: {
		data: {
			type: Object,
			default: () => {
				return { 
					paper_id: 1,
				};
			}
		},
		staff: Number,
		applicant: Number,
	},
	data() {
		return {
			visible: false,
			type: '1',
			tabs: [
				{
					label: '岗前培训',
					value: '1'
				}, {
					label: '人才计划',
					value: '2'
				}, {
					label: '其他项目',
					value: '3'
				}, {
					label: '自学课程',
					value: '4'
				}
			],
			memberData: {},
			detailShow: true,
			firstIn: 0
		};
	},
	computed: {

	},
	watch: {

	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		loadData() {
			this.firstIn += 1;
			if (this.firstIn > 1) {
				this.detailShow = false;
				this.type = '1';
				this.$nextTick(() => {
					this.detailShow = true;
				});
			}
			return this.$request({
				url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_DETAIL_GET,
				type: 'GET',
				param: {
					staff_id: this.staff,
					applicant_id: this.applicant
				},
			}).then((res) => {
				this.memberData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(name) {
			this.type = name;
		}
	}
};
export const StudentDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
.v-hr-academy-statistic-study-detail {
    .ivu-tabs{
		height: calc(100% - 190px);

		.ivu-tabs-tabpane{
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 100%;
		}

		.ivu-tabs-content{
			height: calc(100% - 34px);
			padding-bottom: 20px;
		}
	}
    .ivu-drawer-body {
			padding: 0px;
		.ivu-tabs-bar {
			margin-bottom: 20px;
		}
		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		.ivu-tabs-tab:hover {
			color: #e84854;
		}
		.ivu-tabs-ink-bar {
			background: #e84854;
			bottom: 0;
		}
		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}
		.ivu-tabs-ink-bar {
			width: 58px !important;
			left: 15px !important;
		}
	}
}
</style>
