<template>
	<div v-if="!loading || isFetched" class="v-hr-recruit-school-summary-detail">
		<div class="_content">
			<div class="_left">
				<!-- 基本信息 -->
				<div v-if="action === 'watch'" class="_basic">
					<div class="g-flex g-jc-sb g-ai-c g-m-b-20">
						<div class="g-fs-16">
							<span class="g-m-r-20 g-c-black">{{ info.details.applicant_name }}</span>
							<i v-if="info.details.sex === 1" class="iconfont icon-sex _sex"/>
							<i v-else class="iconfont icon-sexm _emsex"/>
							<span class="g-m-l-20">{{ info.details.mobile }}</span>
						</div>
					</div>
					<div class="g-pd-t-10">
						<span class="g-m-r-20">{{ info.details.college }}</span>
						<span class="g-m-r-20">{{ info.details.profession }}</span>
						<span class="g-m-r-20">{{ info.details.education_name }}</span>
					</div>
				</div>
				<!-- 主要内容 -->
				<div class="main">
					<oa-info v-if="action === 'watch'" :data="info.details"/>
				</div>
			</div>
			<div class="_right">
				<oa-remarks
					:data-source="info.content"
					:on-refresh="loadData"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { DebounceClick } from "wya-vc";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Button, Breadcrumb, BreadcrumbItem, Spin } from 'iview';
import Info from './info';
import Remarks from './remarks';

export default {
	name: 'oa-tpl',
	components: {
		'i-button': Button,
		'i-breadcrumb': Breadcrumb,
		'i-breadcrumb-item': BreadcrumbItem,
		'i-spin': Spin,
		"oa-info": Info,
		'oa-remarks': Remarks
	},
	data() {
		const { query } = getParseUrl();
		return {
			action: 'watch',
			prevPerson: '',
			nextPerson: '',
			info: {
				content: [],
				details: {}
			},
			loading: false,
			isFetched: false,
			noedit: true,
			type: +query.tabType
		};
	},
	computed: {
	},
	created() {
		this.loadData(true);
		const { query } = getParseUrl();
		this.noedit = !!(query.type && query.type === 'no-edit');
	},
	methods: {
		// 加载数据
		loadData(reLoad) {
			this.loading = true;
			this.isFetched = !reLoad;

			this.$request({
				url: API_ROOT['_HR_EMPLOYEE_SCHOOL_ASSIGN_APPLICANT_RESUME_GET'],
				type: 'GET',
				param: {
					applicant_id: this.$route.query.applicant_id,
				},
				loading: false
			}).then((res) => {
				this.loading = false;
				this.isFetched = true;
				this.info.content = res.data.contents;
				this.info.details = res.data;
			}).catch((error) => {
				this.isFetched = true;
				this.$Message.error(error.msg);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-loading {
	background: #ffffff22;
	width: 100%;
	height: 450px;
}

.v-hr-recruit-school-summary-detail {
	height: inherit;
	overflow: auto;
	._content {
		display: flex;
		height: inherit;
		padding-top: 40px;
		._left {
			flex: 6;
			padding-left: 40px;
			padding-right: 40px;
			padding-top: 5px;
			position: relative;
			border-right: 1px solid #e6e6e6;
			overflow-y: auto;
			._basic {
				min-height: 120px;
				padding: 20px;
				box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
				._sex {
					color: rgb(240, 144, 181);
				}
				._emsex {
					color: #2296f9;
				}
			}
			._switch {
				position: fixed;
				bottom: 40px;
				left: 50%;
				z-index: 999;
				border-radius: 50px;
				background-color: #fff;
				box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
				div {
					height: 40px;
					width: 100px;
					cursor: pointer;
					span {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
		._right {
			flex: 4;
		}
	}
}
</style>
