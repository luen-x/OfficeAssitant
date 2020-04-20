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
						<span
							v-if="$auth[154] && noedit === false && info.details.status !== 6 && info.details.status !== 7
							&& info.details.status !== 11 && info.details.status !== 5"
							class="g-c-blue-mid g-pointer"
							@click="handleEdit">
							编辑
						</span>
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
					<oa-edit v-if="action === 'edit'" ref="editform" :data="info.details"/>
				</div>
				<!-- 编辑的操作 -->
				<div v-if="action === 'edit'" class="g-m-tb-30" style="marginLeft: 120px;">
					<vc-debounce-click
						style="display: inline-block"
						class="g-gray-btn-line g-m-r-10"
						@click="handleCancel">
						取消
					</vc-debounce-click>
					<vc-debounce-click
						style="display: inline-block"
						class="g-red-btn-small g-m-r-10"
						@click="handleSave">
						保存
					</vc-debounce-click>
				</div>
				<!-- 查看的切换 -->
				<div v-if="action === 'watch' && showSwitch" class="_switch g-flex">

					<div
						:class="prevClickable ? 'g-c-red-light' : 'g-c-black-light'"
						:style="{cursor: prevClickable ? 'pointer' : 'not-allowed'}"
						class="g-flex g-ai-c g-br g-pd-l-20"
						@click="handleSwitchPrev">
						<i class="iconfont icon-left"/>
						<span class="g-m-r-5">{{ prevClickable ? info.details.prev.applicant_name : '到头了' }}</span>
					</div>

					<div
						:class="nextClickable ? 'g-c-red-light' : 'g-c-black-light'"
						:style="{cursor: nextClickable ? 'pointer' : 'not-allowed'}"
						class="g-flex g-jc-fe g-ai-c g-pd-r-20"
						@click="handleSwitchNext">
						<span class="g-m-l-5">{{ nextClickable ? info.details.next.applicant_name : '到头了' }}</span>
						<i class="iconfont icon-right"/>
					</div>

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
	<div v-else class="g-flex-cc v-loading">
		<i-spin fix/>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { DebounceClick } from "wya-vc";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Button, Breadcrumb, BreadcrumbItem, Spin } from 'iview';
import Edit from './edit';
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
		"oa-edit": Edit,
		'oa-remarks': Remarks
	},
	props: {
		showSwitch: {
			type: Boolean,
			default: true
		}

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
		prevClickable() {
			return this.info.details.prev && this.info.details.prev.is_click;
		},
		nextClickable() {
			return this.info.details.next && this.info.details.next.is_click;
		}
	},
	created() {
		this.loadData(true);
		let obj = getParseUrl();
		this.noedit = !!(obj.query.type && obj.query.type === 'no-edit');
	},
	methods: {
		// 加载数据
		loadData(reLoad) {
			this.loading = true;
			this.isFetched = !reLoad;

			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_SUMMARY_GET_INFO_GET'],
				type: 'GET',
				param: {
					...this.$route.query,
					applicant_id: this.$route.params.id,
					type: this.$route.query.tabType,
					list_type: this.$route.query.list_type
				},
				loading: false
			}).then((res) => {
				const { content, ...rest } = res.data;
				this.loading = false;
				this.isFetched = true;
				this.info.content = content;
				this.info.details = rest;
			}).catch((error) => {
				this.isFetched = true;
				this.$Message.error(error.msg);
			});
		},
		// 上一条信息
		handleSwitchPrev() {
			if (!this.prevClickable) return;
			let { prev } = this.info.details;

			let isRecruit = this.$route.path.split('/')[2] === 'recruit';
			if (isRecruit) {
				this.$router.replace(getHashUrl(
					`/hr/recruit/school/${this.$route.params.type}/${prev.applicant_id}`,
					{
						...this.$route.query,
					}
				));

				this.loadData(true);
			} else if (prev.add_type === 2) {
				this.$router.push(getHashUrl(
					`/academy/transfer/transfer/social/${prev.applicant_id}`,
					{
						...this.$route.query,
						type: this.$route.query.tabType
					}
				));
			} else if (prev.add_type === 3) {
				this.$router.replace(getHashUrl(
					`/academy/transfer/transfer/school/${prev.applicant_id}`,
					{
						...this.$route.query,
					}
				));

				this.loadData(true);
			}
		},
		// 下一条信息
		handleSwitchNext() {
			if (!this.nextClickable) return;
			let { next } = this.info.details;

			let isRecruit = this.$route.path.split('/')[2] === 'recruit';
			if (isRecruit) {
				this.$router.replace(getHashUrl(
					`/hr/recruit/school/${this.$route.params.type}/${next.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.loadData(true);
			} else if (next.add_type === 2) {
				this.$router.push(getHashUrl(
					`/academy/transfer/transfer/social/${next.applicant_id}`,
					{
						...this.$route.query,
						type: this.$route.query.tabType
					}
				));
			} else if (next.add_type === 3) {
				this.$router.replace(getHashUrl(
					`/academy/transfer/transfer/school/${next.applicant_id}`,
					{
						...this.$route.query,
					}
				));
				this.loadData(true);
			}

		},
		// 编辑
		handleEdit() {
			this.action = 'edit';
			this.$emit('handleActionChange');
		},
		// 取消
		handleCancel() {
			this.action = 'watch';
			this.$emit('handleActionChange');
		},
		// 保存信息
		handleSave() {
			// 获取表单
			let info = this.$refs.editform.infoForm;
			this.$refs.editform.$refs['infoForm'].validateAndScroll(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_ADD_INFO_POST,
						type: 'POST',
						param: {
							...info,
							depart_id: info.position_id[0],
							position_id: info.position_id[1],
							alternative_depart_id: info.alternative_position_id[0],
							alternative_position_id: info.alternative_position_id[1],
							try_depart_array: info.try_depart_id.length ? info.try_depart_id[info.try_depart_id.length - 1] : [],
							try_depart_id: info.try_depart_id.length ? info.try_depart_id[info.try_depart_id.length - 1] : [],
							interview_time: formatMoment(info.interview_time, 'YYYY-MM-DD HH:mm:ss'),
							send_offer_time: formatMoment(info.send_offer_time, 'YYYY-MM-DD HH:mm:ss'),
							reply_time: formatMoment(info.reply_time, 'YYYY-MM-DD HH:mm:ss'),
							register_time: formatMoment(info.register_time, 'YYYY-MM-DD HH:mm:ss'),
							try_start_time: formatMoment(info.try_start_time[0]),
							try_end_time: formatMoment(info.try_start_time[1]),
							departure_time: formatMoment(info.departure_time),
							ticket_departure_time: formatMoment(info.ticket_time[0], 'YYYY-MM-DD HH:mm:ss'),
							ticket_arrive_time: formatMoment(info.ticket_time[1], 'YYYY-MM-DD HH:mm:ss'),
							predict_entry_time: formatMoment(info.predict_entry_time, 'YYYY-MM-DD HH:mm:ss'),
						},
						loading: false
					}).then(res => {
						this.action = 'watch';
						this.$emit('handleActionChange');
						this.loadData(true);
						this.$Message.success('编辑成功');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.warning('请按照提示完善表单信息！');
				}
			});
		}
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
