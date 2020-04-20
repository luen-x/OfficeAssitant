<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		:class="{'_second-drawer':secondDrawer}"
		class="v-hr-side-detail"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding:15px 20px 0px 16px;font-size:14px;"
		>
			{{ paperData.paper_name || '--' }}
		</div>
		<div class="g-c-black2" style="margin-left:16px;width:700px;">
			<div class="g-m-t-20"> 
				<span class="g-c-black4  g-m-r-10 g-inline-block">本次考试满分：</span>
				<span class="g-inline-block" >{{ paperData.full_score }}</span>分，及格分数
				<span class="g-inline-block" >{{ paperData.pass_score }}</span>分
			</div>
			<div class="g-m-b-10">
				<span v-for="(val,key) in paperScoreDetail" :key="key" class="g-m-t-15 g-dp-ib" style="width:200px">
					<span class="g-c-black4">{{ questionTypeName[key+1] }}：</span>{{ val.num }} 道 共 {{ val.score * val.num }} 分
				</span>
			</div>
		</div>
		<hr style="background: lightgray;height: 1px;margin: 10px 32px 10px 16px">
		<div class="g-pd-l-5 g-pd-r-20" style="flex:1;overflow-y:auto;">
			<oa-answer-question 
				v-for="(item,index) in paperData.question"
				:index="index+1" 
				:key="item.question_id" 
				:data="item"
				disabled
			/>
		</div>
		<template v-if="showFooter && ($auth[1068]||$auth[1065]||$auth[1066]||$auth[1067])">
			<div style="height:60px"/>
			<div class="_footer">
				<i-button
					v-if="$auth[1068]"
					@click="handleEdit"
				>
					编辑试卷
				</i-button>
				<i-button
					v-if="$auth[1066]"
					@click="handleDownload"
				>
					下载空白试卷
				</i-button>
				<i-button
					v-if="$auth[1065]"
					@click="handleExport"
				>
					导出
				</i-button>
				<i-button
					v-if="$auth[1067]"
					@click="handleDelete"
				>
					删除
				</i-button>
			</div>
		</template>
	</i-drawer>
</template>

<script>
import { Drawer, Button } from "iview";
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import AnswerQuestion from '@components/_common/questions/answer-question';
import { getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import API_ROOT from '@stores/apis/root';
import '../../hr-side';

export default {
	name: "c-sale-customer-detail",
	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-answer-question': AnswerQuestion
	},
	props: {
		paperId: Number,
		paper_type: Number,
		secondDrawer: Boolean,
		showFooter: { type: Boolean, default: true }
	},
	data() {
		return {
			visible: false,
			loading: false,
			paperData: {
				paper_id: this.paperId,
				paper_type: '',
				paper_name: '',
				paper_describe: '',
				subject_id: '',
				pass_score: '',
				question: [
				],
				full_score: '',
				setting: {}
			},
			questionTypeName: {
				1: "单选题",
				2: "多选题,",
				3: "判断题",
				4: "填空题",
				5: "简答题"
			}
		};
	},
	computed: {
		paperScoreDetail() {
			return this.paper_type == 2 
				? this.handleRandomScore()
				: this.handleStatisticScore();
		}
	},
	watch: {
		paperId(newVal, oldVal) {
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
		this.$vc.on('hr-academy-chooose-paper-close', this.handleCancel);
	},
	beforeDestroy() {
		this.$vc.off('hr-academy-chooose-paper-close', this.handleCancel);
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
			this.$request({
				url: "_HR_TRAIN_LIBRARY_PAPER_INFO_GET",
				type: "GET",
				param: {
					paper_id: this.paperId
				},
				loading: false,
			}).then(res => {
				this.paperData = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleRandomScore() {
			const { setting } = this.paperData;
			return [
				{ num: setting.single_num || 0, score: setting.single_score || 0 },
				{ num: setting.multiple_num || 0, score: setting.multiple_score || 0 },
				{ num: setting.judgement_num || 0, score: setting.judgement_score || 0 },
				{ num: setting.blanks_num || 0, score: setting.blanks_score || 0 },
				{ num: setting.content_num || 0, score: setting.content_score || 0 }
			];
		},
		handleStatisticScore() {
			const init = {
				'1': { num: 0, score: 0, },
				'2': { num: 0, score: 0, },
				'3': { num: 0, score: 0, },
				'4': { num: 0, score: 0, },
				'5': { num: 0, score: 0, },
			};
			this.paperData.question.forEach(que => {
				init[que.type].num++;
				init[que.type].score += que.score;
			});
			return [
				init[1],
				init[2],
				init[3],
				init[4],
				init[5]
			]; 
		},
		handleEdit() {
			this.handleOk();
			setTimeout(() => {
				this.$router.push({ 
					path: '/hr/academy/course/paper/edit', 
					query: { paper_id: this.paperId } 
				});
			}, 200);
		},
		handleDownload() {
			window.open(getHashUrl(
				API_ROOT._HR_TRAIN_LIBRARY_PAPER_INFO_GET,
				 {
					paper_id: this.paperId,
					download: 1,
					'-token': this.$global.token

				}
			), '_blank');

		},
		handleExport() {
			window.open(getHashUrl(
				API_ROOT._HR_TRAIN_LIBRARY_PAPER_INFO_GET,
				 {
					paper_id: this.paperId,
					download: 2,
					'-token': this.$global.token
				}
			), '_blank');

		},
		handleDelete() {
			Confirm.popup({ msg: '确认删除吗？' }).then(() => {
				this.$request({
					url: "_HR_ACADEMY_COURSE_PAPER_DELETE_POST",
					type: "POST",
					param: {
						paper_ids: [this.paperId]
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleOk();
					this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_INIT');
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {});

			
		}
	}
};
export const PaperDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
</style>
