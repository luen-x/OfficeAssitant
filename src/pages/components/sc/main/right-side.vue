<template>
	<div :style="{right: toggle ? '0px' : '-360px'}" class="v-sc-main-side">
		<div>
			<oa-title class="g-m-tb-20" title="审核信息"/>

			<div class="g-pd-tb-10 g-bg-white _audit">
				<div v-if="audit_information.flag">
					<ul class="g-pd-lr-15 g-m-b-10">
						<li 
							v-if="audit_information.wait_auditing_count != 0"
							class="g-pd-tb-10 g-pointer g-m-b-10"
							@click="$router.push({path:'/sc/customer/cooperate'})"
						>
							你有{{ audit_information.wait_auditing_count }}条客户合同待审核
						</li>
						<li 
							v-if="audit_information.need_back_count != 0"
							class="g-pd-tb-10 g-pointer g-m-b-10"
							@click="$router.push({path:'/sc/service/inspection'})"
						>
							你有{{ audit_information.need_back_count }}位客户需要回访质检
						</li>
						<li 
							v-if="audit_information.follow_count != 0"
							class="g-pd-tb-10 g-pointer g-m-b-10"
							@click="$router.push({path:'/sc/manage/inspection',query: {
								is_follow : '1'
							}})"
						>
							你有{{ audit_information.follow_count }}个公司需要跟进
						</li>
						<li 
							v-if="audit_information.refund_count != 0"
							class="g-pd-tb-10 g-pointer g-m-b-10"
							@click="$router.push({path:'/sc/customer/refund'})"
						>
							你有{{ audit_information.refund_count }}条退款申请待审核
						</li>
					</ul>
				</div>

				<div v-else class="g-tc g-pd-t-10">
					<img :src="OSS_NO_MESSAGE" style="width: 150px;height: 100px;">
					<p class="g-fs-14">您暂时没有待审核的信息~</p>
				</div>
			</div>
		</div>

		<div>
			<div class="g-flex g-jc-sb g-flex-ac" style="width: 330px;">
				<oa-title class="g-m-t-20 g-m-b-20" title="工作概况"/>
	
				<span 
					v-if="auth"
					class="g-pointer"
					style="color: #2397f9;" 
					@click="$router.push({
						path: '/sc/customer/cooperate/distribute',
						query: {
							flag: 1
						}
					})"
				>
					查看更多
				</span>
			</div>

			<div class="g-pd-tb-10 g-bg-white _work">
				<ul v-if="job_description && job_description.length != 0" class="g-m-b-10 g-pd-l-10">
					<li
						v-for="(item,index) in job_description"
						:key="index"
						class="g-flex g-jc-sb g-m-lr-5 g-pd-tb-10 g-pointer g-m-b-10"
					>
						<span>
							<img 
								v-if="job_description.head_img"
								:src="job_description.head_img"
							>
							<span v-else class="g-tc g-inline-block __staff">
								{{ item.staff_name.slice(item.staff_name.length-2,item.staff_name.length) }}
							</span>
						</span>
						<div>
							<p class="g-tc">{{ item.wait_complete_count }}</p>
							<p>待完成单量</p>
						</div>
						<div>
							<p class="g-tc">{{ item.month_complete_count }}</p>
							<p>本月单量</p>
						</div>
						<div>
							<p class="g-tc">
								{{ item.year_complete_count ? item.year_complete_count : 0 }}
							</p>
							<p>今年单量</p>
						</div>
						<div>
							<p class="g-tc">{{ item.total_count }}</p>
							<p>累计单量</p>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<oa-lastest-news/>

		<div>
			<oa-title class="g-m-tb-20" title="合同动态"/>

			<div class="g-pd-tb-10 g-bg-white _dynamic">
				<ul
					v-if="dynamic_contract && dynamic_contract.length != 0"
					class="g-m-b-10 g-pd-l-10"
				>
					<li
						v-for="(item,index) in dynamic_contract"
						:key="index"
						:class="item.dump_flag ? '__hover' : ''"
						class="g-pointer g-m-b-10"
						@click="handleClick(item.type,item.relation_id,item.status,item.dump_flag)"
					>
						<p>
							<span class="g-fs-12">{{ item.content }}</span>
							<span class="g-fs-12 g-block g-m-tb-10" style="color:#818794;">
								{{ item.create_time }}
							</span>
						</p>
					</li>
				</ul>
				
				<div v-else class="g-tc g-pd-t-10">
					<img :src="OSS_ACTIVE" style="width: 200px;height: 100px;">
					<p class="g-fs-12">当前没有新的合同动态！</p>
				</div>
			</div>
		</div>

		<oa-bookmark :toggle="toggle" spread="360px" @toggle="handleToggle" />
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import Bookmark from '@components/_common/bookmark/bookmark';
import { getItem } from '@utils/utils';
import { OSS_ACTIVE, OSS_NO_MESSAGE } from '@constants/constants';
import Title from "./title";
import LastestNews from "./latest-news";

export default {
	name: "sc-main-side",

	components: {
		"oa-title": Title,
		'oa-bookmark': Bookmark,
		'oa-lastest-news': LastestNews
	},

	data() {
		return {
			OSS_ACTIVE,
			OSS_NO_MESSAGE,
			toggle: false,
			audit_information: {}, // 审核信息
			job_description: [], // 工作概况
			dynamic_contract: [], // 合同动态
			follow_staff_id: "",
			auth: ""
		};
	},

	mounted() {
		// 审核信息
		this.loadAuditData();
		// 工作概况
		this.loadJobData();
		// 合同动态
		this.loadDynamicData();

		this.follow_staff_id = getItem(`staff_${this.$global.version}`).staff.staff_id;
		this.auth = getItem(`staff_${this.$global.version}`).auth["777"];
	},

	updated() {
		setTimeout(() => {
			if (document.querySelector('.v-sc-main-side')) {
				document.querySelector('.v-sc-main-side').style.height = document.documentElement.clientHeight || document.body.clientHeight + "px";
			}
		}, 301);
	},

	methods: {
		// 审核信息
		loadAuditData() {
			this.$request({
				url: API_ROOT._SC_MAIN_CONTRACT_AUDIT_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.audit_information = res.data;
			}).catch(error => {});
		},

		// 工作概况
		loadJobData() {
			this.$request({
				url: API_ROOT._SC_MAIN_MAKE_PRODUCT_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.job_description = res.data.list;
			}).catch(error => {});
		},

		// 合同动态
		loadDynamicData() {
			this.$request({
				url: API_ROOT._SC_MAIN_CONTRACT_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.dynamic_contract = res.data;
			}).catch(error => {});
		},

		handleToggle() {
			this.toggle = !this.toggle;
		},

		handleClick(type, relation_id, status, dump_flag) {
			if (!dump_flag) {
				return;
			}

			if (type == 1 || type == 2) {
				this.$router.push({
					path: "/sc/customer/refund",
					query: {
						type: status,
						refund_id: relation_id,
						jump: 1
					}
				});
			} else if (type == 3 || type == 4) {
				this.$router.push({
					path: "/sc/customer/cooperate",
					query: {
						type: status,
						contract_id: relation_id,
						jump: 1
					}
				});
			} else if (type == 5) {
				this.$router.push({
					path: "/sc/product",
					query: {
						type: status,
						project_id: relation_id,
						jump: 1
					}
				});
			} else {
				this.$router.push({
					path: "/sc/customer/cooperate",
					query: {
						type: status,
						project_id: relation_id,
						jump: 1
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-side {
    width: 360px;
	padding: 0 30px 0 15px;
	overflow-x: auto;
    background-color: #f5f5f7;
	top: 56px;

	._dynamic,._audit,._work{
		width: 330px;
		height: 155px;
		
		ul{
			overflow: hidden;
			height: 135px;

			&:hover{
				overflow: auto;
			}

			li{
				width: 300px;
				border-bottom: 1px solid #D4D7DB;
			}
		}
	}

	._work{
		ul{
			li{
				&:hover{
					cursor: default;
					color: #515a6e;
				}
			}
		}

		.__staff{
			width: 32px;
			height: 32px;
			line-height: 32px;
			border-radius: 16px;
			background: #ffe5e5;
			color: #e74854;
		}
	}
}
</style>