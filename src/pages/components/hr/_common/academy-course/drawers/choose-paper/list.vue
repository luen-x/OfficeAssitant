<template>
	<div class="v-hr-academy-course-choose-paper-list"> 
		<i-radio-group v-model="selected">
			<vc-paging
				ref="tableTarget"
				:show="showList"
				:columns="columns"
				:data-source="listInfo.data"
				:total="listInfo.total"
				:reset="listInfo.reset"
				:history="false"
				:load-data="loadData"
				:footer="!inLoading"
				:table-opts="{height: tableHeight, highlightRow: true,width:900}"
				mode="table"
				class="g-m-t-20 "
				@row-click="handleOpenDrawer"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
			>
				<div slot="extra" class="g-flex-ac">
					<i-button type="primary" class="g-m-l-10" @click="handleSave">
						选好了
					</i-button>
				</div>
			</vc-paging>
		</i-radio-group>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Checkbox, Button, RadioGroup } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'i-radio-group': RadioGroup
	},
	mixins: [item],
	props: {
		query: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		const { query } = this.$route;

		return {
			showList: false,
			inLoading: false,
			selected: '',
			selectedPaper: undefined,
			curPage: 0
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCoursePaper.listInfo;
		},
		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.hrAcademyCoursePaper.listInfo.data[this.curPage];

			for (let i in listInfoData) {
				listInfoData[i] && len++;
			}

			let winHeight;

			if (len > 15) {
				// 获取窗口高度
				if (window.innerHeight) {
					winHeight = window.innerHeight - 250;
				} else if (document.body && document.body.clientHeight) {
					winHeight = document.body.clientHeight - 250;
				}

				return winHeight;
			}
		}
	},
	watch: {
		selected(val) {
			if (val) {
				this.selectedPaper = this.listInfo.data[this.curPage].find(it => it.paper_id == val);
			} else {
				this.selectedPaper = undefined;
			}
		}
	},
	mounted() {
		setTimeout(() => {
			this.showList = true;// 优化弹出框卡顿
		}, 100); 
	},
	destroyed() {
		this.handleResetFirst();

	},
	methods: {
		loadData(page, pageSize) {
			this.selected = '';
			const query = { 
				...this.query, 
				subject_id: this.query.subject_ids[this.query.subject_ids.length - 1] || '' 
			};
			this.inLoading = true;
			return this.request({
				url: 'HR_ACADEMY_COURSE_PAPER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page: this.curPage ? page : 1, // 解决第一次进入不读取url里的page
					pageSize
				},
			}).then((res) => {

				
			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		handleChangePageSize() {
			this.selected = '';
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_INIT');
		},
		handleDelete(event, questionId) {
			return Confirm.popup({ msg: '删除后将无法恢复，确定要删除吗？' }).then(() => {
				return this.$request({
					url: "_HR_ACADEMY_COURSE_QUESTION_REMOVE_QUESTION_POST",
					type: "POST",
					param: {
						type: 1,
						question_id: questionId ? [questionId] : this.selected.map(que => que.question_id)
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
					return Promise.reject();
				});
			});

		},
		handlePageChange(page) {
			this.curPage = page;
			this.selected = '';
		},
		handleSave() {
			this.$emit("event");
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-course-choose-paper-list {
	.vc-paging {
		.__footer{
			width: 940px !important;
			padding-left: 10px !important;
		}
	}
}
</style>
