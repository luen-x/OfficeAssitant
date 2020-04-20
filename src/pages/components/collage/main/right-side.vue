<template>
	<div
		:style="{ right: toggle ? '0px' : '-708px', height }"
		class="v-collage-main-side">
		<div class="_news">
			<div class="_news-header g-fs-14">最新资讯</div>
			<div class="_news-body g-relative">
				<div v-if="list.length" class="_list">
					<i-row
						v-for="(item, index) in list.slice(0, 5)"
						:key="index"
						class="g-lh-40 g-c-black4 g-pd-lr-20"
					>
						<div class="g-pointer" @click="handleDetail(item)">
							<i-col span="12" class="g-tl">
								<span class="_circle g-m-r-5" />
								<span v-if="item.title.length > 20">{{ item.title.slice(0, 20) + '...' }}</span>
								<span v-else>{{ item.title }}</span>
							</i-col>
							<i-col span="4">
								<span>{{ item.staff_name }}</span>
							</i-col>
							<i-col span="8" class="g-tr">{{ item.create_date }}</i-col>
						</div>
					</i-row>
				</div>
				<div v-else class="g-tc g-pd-t-10">
					<img :src="OSS_SEARCH_EMPTY" style="width: 400px;height: 160px;">
					<div class="g-fs-12 g-m-t-10">您暂时没有资讯通知~</div>
				</div>

				<span
					class="g-pointer g-c-blue-mid g-absolute"
					style="bottom: 60px;left: 315px"
					@click="handleClickMore">
					查看更多
				</span>
			</div>
		</div>
		<div class="g-flex g-m-t-20">
			<div class="_contract g-m-r-20">
				<oa-title title="合同动态" />
				<div v-if="contractList.length" class="_contract-content g-m-t-15">
					<div class="_scroll">
						<ul ref="ul" :class="{ isAnimate: animate === true }">
							<li
								v-for="(item, index) in contractList"
								:key="index"
								class="g-lh-32 g-pd-t-10">
								<div class="g-pointer" @click="handleClickContract(item)">
									<i-row class="g-fs-12 g-c-black3">
										<span v-if="item.content.length > 20">{{ item.content.slice(0, 20) + '...' }}</span>
										<span v-else>{{ item.content }}</span>
									</i-row>
									<i-row class="g-fs-12 g-c-black4">{{ item.create_time }}</i-row>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div v-if="!contractList.length" class="_contract-content g-tc g-m-t-15">
					<img :src="OSS_ACTIVE" class="g-m-t-30" style="width: 200px;height: 100px;">
					<p class="g-fs-12">当前没有新的合同动态哦~</p>
				</div>
			</div>
			<div class="_info">
				<oa-title title="审核信息" />
				<div v-if="auditFlag" class="_info-content g-m-t-15">
					<i-row
						v-if="auditData.contract_wait_audit"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(1)">
							您有{{ auditData.contract_wait_audit }}条客户合同待审核
						</span>
					</i-row>
					<i-row
						v-if="auditData.refund_wait_audit"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(2)">
							您有{{ auditData.refund_wait_audit }}条退款申请待审核
						</span>
					</i-row>
					<i-row
						v-if="auditData.customer_wait_quality"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(3)">
							您有{{ auditData.customer_wait_quality }}位客户需要回访质检
						</span>
					</i-row>
					<i-row
						v-if="auditData.online_wait_audit"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(4)">
							您有{{ auditData.online_wait_audit }}条线上录单申请待审核
						</span>
					</i-row>
					<i-row
						v-if="auditData.outline_wait_audit"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(5)">
							您有{{ auditData.outline_wait_audit }}条线下录单申请待审核
						</span>
					</i-row>
					<i-row
						v-if="auditData.open_lesson_wait_audit"
						class="g-pd-tb-10 g-lh-32 g-fs-12 g-c-black4 g-pointer"
						style="border-bottom: 1px solid #D4D7DB">
						<span @click="handleDetailAudit(6)">
							您有{{ auditData.open_lesson_wait_audit }}条大课录单申请待审核
						</span>
					</i-row>
				</div>
				<div v-if="!auditFlag" class="_info-content g-m-t-15 g-tc">
					<img :src="OSS_NOTICE_EMPTY" class="g-m-t-30" style="width: 140px;height: 94px;">
					<div class="g-fs-14 g-m-t-10">您暂时没有审核信息~</div>
				</div>
			</div>
		</div>
		<oa-bookmark :toggle="toggle" @toggle="handleToggle" />
	</div>
</template>

<script>
import Bookmark from '@components/collage/_common/bookmark';
import { Row, Col } from 'iview';
import API_ROOT from '@stores/apis/root';
import { OSS_ACTIVE, OSS_NO_MESSAGE, OSS_NOTICE_EMPTY, OSS_SEARCH_EMPTY } from '@constants/constants';
import Title from './title';

export default {
	name: 'oa-right-side',
	components: {
		'i-row': Row,
		'i-col': Col,
		'oa-title': Title,
		'oa-bookmark': Bookmark
	},
	data() {
		return {
			OSS_ACTIVE,
			OSS_NO_MESSAGE,
			OSS_NOTICE_EMPTY,
			OSS_SEARCH_EMPTY,
			animate: false,
			toggle: false,
			height: '100%',
			timer1: '',
			timer2: '',
			contractList: [],
			auditFlag: false,
			auditData: {},
			list: []
		};
	},
	mounted() {
		this.getNewdata();
		this.loadContractData();
		this.loadAuditData();
		window.addEventListener('resize', this.setHeight, true); // 监听窗口变化
		if (this.list.length > 4) {
			this.timer1 = setInterval(this.handleScroll, 1500);
		}
	},
	destroyed() {
		window.removeEventListener('resize', this.setHeight, true);
		window.clearInterval(this.timer1);
		window.clearInterval(this.timer2);
	},
	methods: {
		handleClickContract(item) {
			if (item.type == 0) {
				this.$router.push({
					path: '/collage/customer/cooperate',
					query: {
						search: item.contract_company_name,
					}
				});
			} else if (item.type == 1) {
				this.$router.push({
					path: '/collage/customer/cooperate',
					query: {
						search: item.contract_company_name,
						type: 3
					}
				});
			} else if (item.type == 2) {
				this.$router.push({
					path: '/collage/customer/refund',
					query: {
						search: item.contract_company_name,
						type: 1
					}
				});
			} else if (item.lesson_type == 1) {
				this.$router.push({
					path: '/collage/record/online',
					query: {
						company: item.contract_company_name,
						type: 3
					}
				});
			} else {
				this.$router.push({
					path: '/collage/record/outline',
					query: {
						company: item.contract_company_name,
						type: 3
					}
				});
			}
		},
		handleDetailAudit(e) {
			if (e == 1) {
				this.$router.push({
					path: '/collage/customer/cooperate',
				});
			} else if (e == 2) {
				this.$router.push({
					path: '/collage/customer/refund',
					query: {
						type: 1
					}
				});
			} else if (e == 3) {
				this.$router.push({
					path: '/collage/check/service',
				});
			} else if (e == 4) {
				this.$router.push({
					path: '/collage/record/online',
					query: {
						type: 3
					}
				});
			} else if (e == 5) {
				this.$router.push({
					path: '/collage/record/outline',
					query: {
						type: 3
					}
				});
			} else {
				this.$router.push({
					path: '/collage/record/lesson',
				});
			}
			
		},
		handleClickMore() {
			this.$router.push({
				path: '/collage/main/information',
				query: {
					is_control_role: 1
				}
			});
		},
		handleToggle() {
			this.toggle = !this.toggle;
		},
		handleScroll() {
			this.$refs.ul.style.marginTop = '-75px';
			this.animate = !this.animate;
			this.timer2 = setTimeout((e) => {
				this.contractList.push(this.contractList[0]);
				this.contractList.shift();
				this.$refs.ul.style.marginTop = '0px';
				this.animate = !this.animate;
			}, 750);
		},
		setHeight() {
			let winWidth;
			if (window.innerWidth) winWidth = window.innerWidth;
			else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;
			if (winWidth > 1796) {
				this.height = '100%';
			} else {
				this.height = 'calc(100% - 58px)';
			}
		},
		loadContractData() {
			this.$request({
				url: API_ROOT._COLLAGE_MAIN_CONTRACT_LIST_GET,
				type: "get",
				param: {}
			}).then(res => {
				this.contractList = res.data.list;
			});
		},
		loadAuditData() {
			this.$request({
				url: API_ROOT._COLLAGE_MAIN_AUDIT_LIST_GET,
				type: "get",
				param: {}
			}).then(res => {
				this.auditData = res.data;
				let auditList = [];
				auditList = [
					res.data.contract_wait_audit, 
					res.data.customer_wait_quality, 
					res.data.refund_wait_audit, 
					res.data.online_wait_audit,
					res.data.outline_wait_audit,
					res.data.open_lesson_wait_audit
				];
				auditList.map(v => {
					if (v) {
						this.auditFlag = true;
					}
					return;
				});
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
		handleDetail(item) {
			this.$router.push(
				{ 
					name: "collage-consultation", 
					query: { 
						keyword: item.keyword, 
						status: 4,
						information_id: item.information_id
					} 
				}
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.v-collage-main-side {
	min-width: 708px;
	max-width: 708px;
	padding: 20px 20px;
	overflow: hidden;
	top: 55px;
	background: rgba(245,245,246,1);
	._news {
		background: #fff;
		box-shadow:0px 0px 7px 0px rgba(0, 0, 0, 0.1);
		._news-header {
			height: 40px;
			line-height: 40px;
			text-align: center;
			background:rgba(248,248,248,1);
		}
		._news-body {
			height: 360px;
			text-align: center;
			padding: 20px 30px;
			._list {
				._circle {
					display: inline-block;
					width: 6px;
					height: 6px;
					margin-bottom: 1px;
					border-radius: 50%;
					background-color: #2397F9;
				}
				.ivu-row:nth-of-type(odd) {
					background-color: #F8F8F8;
				}
			}
		}
	}
	._contract {
		._contract-content {
			width: 324px;
			height: 340px;
			padding-left: 20px;
			padding-right: 20px;
			overflow-y: auto;
			background-color: #fff;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
			._scroll {
				height: 300px;
				ul {
					width: 100%;
					height: 100%;
					li {
						border-bottom: 1px solid #D4D7DB;
					}
				}
			}
			.isAnimate {
				transition: all .5s ease;
			}
		}
	}
	._info {
		._info-content {
			width: 324px;
			height: 340px;
			padding-left: 20px;
			padding-right: 20px;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
		}
		._info-content:hover {
			overflow: auto;
		}
	}
}
</style>
