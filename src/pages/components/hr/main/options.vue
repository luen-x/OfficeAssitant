<template>
	<div class="v-hr-main-options g-flex">
		<div class="_action g-col">
			<oa-title class="_title" title="快捷操作" />
			<div class="_options g-flex g-fw-w">
				<div
					v-for="(item, index) in options"
					v-if="item.show"
					:key="index"
					class="g-flex-cc g-fd-c g-pd-tb-30"
					style="width: 25%;margin:10px 0"
				>
					<div >
						<router-link
							:to="item.link"
							:style="{background: item.color}"
							class="__item g-flex-cc">
							<i :class="item.icon" class="iconfont g-fs-40" />
						</router-link>
						<p class="g-tc" style="margin-top: 5px">{{ item.label }}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="_news g-m-l-10 g-col">
			<div class="_title g-flex g-jc-sb">
				<oa-title title="最新资讯" />
				<div 
					class="g-pointer g-c-blue-mid"
					@click="handleClickMore"
				>
					查看更多
				</div>
			</div>
			<div class="_main">
				<div v-if="list.length" class="g-pd-lr-20 g-pd-b-10">
					<i-row
						v-for="(item, index) in list"
						:key="index"
						:class="index !== list.length - 1 ? 'g-bb' : ''"
						class="g-fs-12 g-lh-32"
					>
						<div class="g-pointer" @click="handleConsultation(item)">
							<i-col span="24" class="g-c-black3 g-m-t-10">{{ item.title }}</i-col>
							<i-col span="24" class="g-c-black4">
								{{ item.staff_name }}
								<span class="g-m-l-20">{{ item.create_date }}</span>
							</i-col>
						</div>
					</i-row>
				</div>
				<div v-else class="g-flex g-fd-c g-ai-c g-jc-c" style="height: 100%;">
					<img :src="OSS_NO_MESSAGE03" alt="">
					<span>暂无任何资讯通知</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS_NO_MESSAGE03 } from '@constants/constants';
import { Row, Col } from 'iview';
import API_ROOT from '@stores/apis/root';
import Title from './title';

export default {
	name: 'hr-main-options',
	components: {
		'i-row': Row,
		'i-col': Col,
		'oa-title': Title
	},
	data() {
		return {
			OSS_NO_MESSAGE03,
			optionsHR: [
				{
					icon: 'icon-staff-enter',
					label: '员工入职',
					color: '#00c087',
					link: '/hr/employee/summary',
					notice: '',
					show: this.$auth[194],
				},
				{
					icon: 'icon-staff-regular',
					label: '员工转正',
					color: '#2397fa',
					link: '/hr/employee/relation/try',
					notice: '',
					show: this.$auth[215],
				},
				{
					icon: 'icon-staff-promote',
					label: '晋升晋级',
					color: '#818795',
					link: '/hr/employee/rank/promo',
					notice: '',
					show: this.$auth[229],
				},
				{
					icon: 'icon-staff-editor',
					label: '员工转岗',
					color: '#fcbe59',
					link: '/hr/employee/relation/tran',
					notice: '',
					show: this.$auth[221],
				},
				{
					icon: 'icon-dimission',
					label: '员工离职',
					color: '#818795',
					link: '/hr/employee/relation/leave',
					notice: '',
					show: this.$auth[222],
				},
				{
					icon: 'icon-salary-sheet',
					label: '工资条',
					color: '#fcbe59',
					link: '/hr/salary/wage/monthly',
					notice: '',
					show: this.$auth[245],
				},
				{
					icon: 'icon-contract',
					label: '合同管理',
					color: '#00c087',
					link: '/hr/employee/relation/pact',
					notice: '',
					show: this.$auth[220],
				},
				{
					icon: 'icon-template',
					label: '模板管理',
					color: '#2397fa',
					link: '/hr/tool/modules/offer',
					notice: '',
					show: this.$auth[288],
				}
			],
			optionsRecruit: [
				{
					icon: 'icon-social-recruitment',
					label: '社会招聘',
					color: '#00c087',
					link: '/hr/recruit/social/summary',
					notice: '',
					show: this.$auth[170],
				},
				{
					icon: 'icon-trencher-cap',
					label: '校园招聘',
					color: '#2397fa',
					link: '/hr/recruit/school/summary',
					notice: '',
					show: this.$auth[137],
				},
				{
					icon: 'icon-talent-pool',
					label: '淘汰统计',
					color: '#818795',
					link: '/hr/recruit/social/talent',
					notice: '',
					show: true,
				},
				{
					icon: 'icon-statistics1',
					label: '校招统计',
					color: '#fcbe59',
					link: '/hr/recruit/school/statistics',
					notice: '',
					show: this.$auth[139],
				},

				{
					icon: 'icon-recruit',
					label: '招聘会',
					color: '#fcbe59',
					link: '/hr/recruit/school/jobfair',
					notice: '',
					show: this.$auth[138],
				},
				{
					icon: 'icon-template',
					label: '模板管理',
					color: '#2397fa',
					link: '/hr/tool/modules/offer',
					notice: '',
					show: this.$auth[288],
				},
				{
					icon: '',
					label: '',
					color: '',
					link: '',
					notice: '',
					show: true,
				},
				{
					icon: '',
					label: '',
					color: '',
					link: '',
					notice: '',
					show: true,
				}
			],
			list: [
				{ title: '最新声明，必须要有合同', name: '超管', time: '2018-09-21 10:31:33' },
				{ title: '最新声明，必须要有合同', name: '超管', time: '2018-09-21 10:31:33' },
				{ title: '最新声明，必须要有合同', name: '超管', time: '2018-09-21 10:31:33' },
				{ title: '最新声明，必须要有合同', name: '超管', time: '2018-09-21 10:31:33' },
				{ title: '最新声明，必须要有合同', name: '超管', time: '2018-09-21 10:31:33' }
			]
		};
	},
	computed: {
		options() {
			return this.$auth[126] ? this.optionsHR : this.optionsRecruit;
		}
	},
	created() {
		this.getNewdata();
	},
	methods: {
		handleClickMore() {
			this.$router.push({
				path: '/hr/main/information',
				query: {
					is_control_role: 1
				}
			});
		},
		getNewdata() {
			this.$request({
				url: API_ROOT._SALE_MAIN_MATERIAL_NEW_LIST_GET,
				type: "get",
				param: {
					material_type: 2
				}
			}).then(res => {
				this.list = res.data;
			});
		},
		handleConsultation(v) {
			this.$router.push(
				{ 
					name: "hr-consultation", 
					query: {
						keyword: v.keyword, 
						status: 6,
						information_id: v.information_id
					} 
				}
			);
		}
	}
};

</script>

<style lang="scss">
.v-hr-main-options {
	._title {
		margin-bottom: 20px;
	}
	._action {
		flex: 1;
		._options {
			min-width: 490px;
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
			.__item {
				width: 69px;
				height: 69px;
				border-radius: 50%;
				color: #ffffff;
				cursor: pointer;
			}
		}
	}
	._news {
		flex: 1;
		margin-left:40px;
		._main {
			min-width: 260px;
			height: 346px;
			overflow-y: hidden;
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
			img {
				width: 185px;
				height: 143px;
			}
		}
		._main:hover {
			overflow-y: auto;
		}
	}
}
</style>


