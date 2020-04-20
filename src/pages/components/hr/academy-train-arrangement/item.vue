<template>
	<div :key="id" class="v-hr-academy-train-arrangement-item">
		<div :class="$attrs.type == 1 ? '_orange' : $attrs.type == 2 ? '_green' : '_blue'" class="_flag _flag-left">{{ $attrs.type_name }}</div>
		<div class="_title">
			<span class="__title-name g-pointer" @click="handleBasic($attrs.project_id)">{{ $attrs.project_topic }}</span>
			<span class="__title-num">{{ $attrs.course.length }}节课程</span>
			<span class="__title-time">{{ $attrs.start_time }} 至 {{ $attrs.end_time }}</span>
		</div>
		<div class="_content">
			<div 
				v-for="(item, index) in $attrs.course.filter((v, index) => index < 3 )"
				:key="index"
				class="__item-content"
			>
				<i-row>
					<i-col span="4">
						<span class="__item-left">课程{{ index + 1 }}：</span>
						<span v-if="item.course_name.length < 13" class="__item-right">{{ item.course_name }}</span>
						<i-tool-tip 
							v-else 
							:transfer="true" 
							:content="item.course_name" 
							:max-width="300" 
							class="__item-right">
							{{ item.course_name.slice(0, 13) + '...' }}
						</i-tool-tip>
					</i-col>
					<i-col span="1">
						<i-divider type="vertical"/>
					</i-col>
					<i-col span="4">
						<span class="__item-left">关联课题：</span>
						<span v-if="item.subject.map(v => v.subject_name).join(',').length < 13" class="__item-right">
							{{ item.subject.map(v => v.subject_name ? v.subject_name : '课题已删除').join(',') }}
						</span>
						<i-tool-tip 
							v-else 
							:transfer="true" 
							:content="item.subject.map(v => v.subject_name).join(',')" 
							:max-width="300" 
							class="__item-right">
							{{ item.subject.map(v => v.subject_name).join(',').slice(0, 13) + '...' }}
						</i-tool-tip>
					</i-col>
					<i-col span="1">
						<i-divider type="vertical"/>
					</i-col>
					<i-col span="3">
						<span class="__item-left">讲师：</span>
						<span v-if="item.lecture.map(v => v.staff_name).join(',').length < 13" class="__item-right">
							{{ item.lecture.map(v => v.staff_name).join(',') }}
						</span>
						<i-tool-tip 
							v-else 
							:transfer="true" 
							:content="item.lecture.map(v => v.staff_name).join(',')" 
							:max-width="300" 
							class="__item-right">
							{{ item.lecture.map(v => v.staff_name).join(',').slice(0, 13) + '...' }}
						</i-tool-tip>
					</i-col>
					<i-col span="1">
						<i-divider type="vertical"/>
					</i-col>
					<i-col span="6">
						<span class="__item-left">授课时间：</span>
						{{ item.start_time + ' 至 ' + item.end_time }}
					</i-col>
					<i-col span="1">
						<i-divider type="vertical"/>
					</i-col>
					<i-col span="3">
						<span class="__item-left">参与人员：</span>
						<span class="__item-right">
							{{ item.participator_count }}
						</span>
					</i-col>
				</i-row>
			</div>
		</div>
		<div 
			v-if="$attrs.course.length > 2"
			class="g-pointer g-c-blue-light g-m-l-10 g-m-b-20" 
			style="width: 75px;"
			@click="handleBasic($attrs.project_id)"
		>
			点击查看更多
		</div>
		<div class="_bottom">
			<div v-if="$auth[999]" class="__bottom-item">
				<i class="iconfont icon-qiandao" style="color: #2397F9;"/>
				<span class="g-pointer" @click="handleDetailList(2, $attrs.project_id)">签到({{ $attrs.sign.count }})</span>
			</div>
			<div v-if="$auth[1009]" class="__bottom-item">
				<i class="iconfont icon-kaoshi" style="color: #4FC43D;"/>
				<span class="g-pointer" @click="handleDetailList(3, $attrs.project_id)">考试({{ $attrs.exam.count }})</span>
			</div>
			<div v-if="$auth[1019]" class="__bottom-item">
				<i class="iconfont icon-toupiao" style="color: #ED8F4A;"/>
				<span class="g-pointer" @click="handleDetailList(4, $attrs.project_id)">投票({{ $attrs.vote.count }})</span>
			</div>
			<div v-if="$auth[1024]" class="__bottom-item">
				<i class="iconfont icon-baoming" style="color: #ED8F4A;"/>
				<span class="g-pointer" @click="handleDetailList(5, $attrs.project_id)">报名({{ $attrs.apply.count }})</span>
			</div>
		</div>
		<div class="_buttom">
			<i-button v-if="$auth[977]" class="g-m-r-5" @click="handleDelete($attrs)">
				删除
			</i-button>
			<i-drop-down :transfer="true" @on-click="handleDetail($event, $attrs.project_id)">
				<i-button v-if="$auth[978]" type="primary">
					创建活动
					<i class="iconfont icon-triangle-down g-fs-12"/>
				</i-button>
				<i-drop-down-menu slot="list">
					<i-drop-down-item 
						v-for="(item, index) in menuList.filter(v => v.show)" 
						:key="index"
						:name="index + 1"
					>
						{{ item.name }}
					</i-drop-down-item>
				</i-drop-down-menu>
			</i-drop-down>
		</div>
	</div>
</template>

<script>
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { Divider, Button, Dropdown, DropdownItem, DropdownMenu, Tooltip, Row, Col } from 'iview';

export default {
	name: "oa-hr-academy-train-arrangement-item",
	components: {
		'i-divider': Divider,
		'i-button': Button,
		'i-drop-down': Dropdown,
		'i-drop-down-item': DropdownItem,
		'i-drop-down-menu': DropdownMenu,
		'i-tool-tip': Tooltip,
		'i-row': Row,
		'i-col': Col
	},
	props: {
		id: [String, Number],
		name: String
	},
	data() {
		return {
			dataList: [
				{
					name: '签到',
					num: '1',
					show: this.$auth[980]
				},
				{
					name: '考试',
					num: '1',
					show: this.$auth[981]
				},
				{
					name: '投票',
					num: '1',
					show: this.$auth[982]
				},
				{
					name: '报名',
					num: '1',
					show: this.$auth[983]
				}
			],
			menuList: [
				{
					name: '分组',
					id: 1,
					show: this.$auth[997]
				},
				{
					name: '签到',
					id: 2,
					show: this.$auth[999]
				},
				{
					name: '考试',
					id: 3,
					show: this.$auth[1009]
				},
				{
					name: '投票',
					id: 4,
					show: this.$auth[1019]
				},
				{
					name: '链接报名',
					id: 5,
					show: this.$auth[1024]
				},
				{
					name: '抽奖',
					id: 6,
					show: this.$auth[1030]
				}
			]
		};
	},
	methods: {
		handleDelete(item) {
			ModalTip.popup({
				title: '删除项目',
				content: '删除项目，所有包含的课程也会被删除，确认删除吗？（删除的课程会放入到“课程回收站”中！）'
			}).then(res => {
				this.request({
					url: '_HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_DELETE_GET',
					type: "POST",
					param: {
						project_ids: [item.project_id]
					},
					loading: false
				}).then((re) => {
					this.$Message.success(`删除成功`);
					this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_INIT');
				}).catch((error) => {
				});
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_RESET', { type: this.type });
		},
		handleDetail(name, project_id) {
			switch (name) {
				case 1:
					this.$router.push(`/hr/academy/train/detail/group/0/group?project_id=${project_id}`);
					break;
				case 2:
					this.$router.push(`/hr/academy/train/detail/sign/0/manage?project_id=${project_id}`);
					break;
				case 3:
					this.$router.push(`/hr/academy/train/detail/paper/0/pass?project_id=${project_id}`);
					break;
				case 4:
					this.$router.push(`/hr/academy/train/detail/vote/1/add?project_id=${project_id}`);
					break;
				case 5:
					this.$router.push(`/hr/academy/train/detail/enroll/1/add?project_id=${project_id}`);
					break;
				case 6:
					this.$router.push(`/hr/academy/train/detail/draw/1/edit?project_id=${project_id}`);
					break;
				default:
			}
		},
		handleDetailList(name, project_id) {
			switch (name) {
				case 2:
					this.$router.push(`/hr/academy/train/detail/sign/0/manage?project_id=${project_id}`);
					break;
				case 3:
					this.$router.push(`/hr/academy/train/detail/paper/0/pass?project_id=${project_id}`);
					break;
				case 4:
					this.$router.push(`/hr/academy/train/detail/vote/0/manage?project_id=${project_id}`);
					break;
				case 5:
					this.$router.push(`/hr/academy/train/detail/enroll/0/manage?project_id=${project_id}`);
					break;
				default:
			}
		},
		handleBasic(project_id) {
			this.$router.push(`/hr/academy/train/detail/basic/0/info?project_id=${project_id}`);
		}
	}
};
</script>
<style lang="scss">
.v-hr-academy-train-arrangement-item {
	position: relative;
	overflow: hidden;
	._flag {
		position: absolute;    /*绝对定位*/
		height: 20px;
		line-height: 20px;
		text-align: center;
		width: 78px;
		background-color: #FF5722;
		color: #fff;
	}
	._flag-left {
		-moz-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-o-transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		left: -18px;
		top: 9px;
	}
	._orange {
		background-color: #ED8F4A;
	}
	._green {
		background-color: #56C545;
	}
	._blue {
		background-color: #2E9DFA;
	}
	._title {
		margin-left: 35px;
		.__title-name {
			margin-right: 10px;
			font-size:16px;
			font-weight:400;
			color:#000;
		}
		.__title-name:hover {
			color: #2e9dfa;
		}
		.__title-num {
			margin-right: 15px;
			padding: 2px 3px 2px 3px;
			background-color:#FADBDD;
			color: #E74854;
			border-radius:3px;
			line-height: 12px;
			font-size: 12px;
			text-align: center;
		}
		.__title-time {
			color: #818794;
		}
	}
	._content {
		margin: 20px 10px 20px 10px;
		.__item-content {
			margin: 10px 0 10px 0;
			.ivu-divider, .ivu-divider-vertical {
				background-color: #D4D7DB !important;
				margin: 0 5px;
			}
			.__item-left {
				color: #818794;
				display: inline;
			}
			.__item-right {
				display: inline;
				color: #4B4F57;
				word-break: break-all;
			}
			.ivu-tooltip-rel {
				display: inline;
				word-break: break-all;
			}
		}
	}
	._bottom {
		margin-left: 10px;
		.__bottom-item {
			display: inline-block;
			margin-right: 35px;
		}
	}
	._buttom {
		position: absolute;
		bottom: 15px;
		right: 20px;
		.ivu-btn-primary {
			height: 32px;
			width: 88px;
			line-height: 17px;
		}
	}
}
</style>