<template>
	<div :style="{right: toggle ? '0px' : '-360px'}" class="v-finance-main-side">
		<div class="_title g-flex g-ai-c g-jc-sb">
			<oa-title title="最新资讯"/>
			<span class="g-pointer g-c-blue-mid g-fs-12">
				<div
					class="g-pointer g-c-blue-mid"
					@click="handleClickMore"
				>
					查看更多
				</div>
			</span>
		</div>
		<div class="_news">
			<div v-if="list.length">
				<div
					v-for="(item, index) of list.slice(0, 5)"
					:key="index"
					class="g-fs-12 g-lh-32 g-m-b-10 _news-item"
				>
					<div class="g-pointer" @click="handleConsultation(item)">
						<i-row class="g-c-black3">
							<span v-if="item.title.length > 20">{{ item.title.slice(0, 20) + '...' }}</span>
							<span v-else>{{ item.title }}</span>
						</i-row>
						<i-row class="g-c-black4 g-m-b-5">
							<span class="g-m-r-20">{{ item.staff_name }}</span>
							{{ item.create_date }}
						</i-row>
					</div>
				</div>
			</div>
			<div v-else class="g-m-t-15 g-tc">
				<img :src="OSS_NO_MESSAGE" class="g-m-t-30" style="width: 140px;height: 94px;">
				<div class="g-fs-14 g-m-t-10">暂时没有资讯信息~</div>
			</div>
			<oa-bookmark :toggle="toggle" @toggle="handleToggle" />
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import Bookmark from '@components/_common/bookmark/bookmark';
import { OSS_ACTIVE, OSS_NO_MESSAGE, OSS_NOTICE_EMPTY, OSS_SEARCH_EMPTY } from '@constants/constants';
import { Row, Col } from 'iview';
import Title from "./title";

export default {
	name: "finance-main-side",
	components: {
		'i-row': Row,
		'i-col': Col,
		"oa-title": Title,
		'oa-bookmark': Bookmark
	},
	props: {
		compare: {
			type: Object,
			require: true,
			default() {
				return {
					pay_performance: { today: {}, month: {} },
					received_performance: { today: {}, month: {} },
					refund_amount: { today: {}, month: {} },
					real_performance: { today: {}, month: {} }
				};
			}
		}
	},
	data() {
		return {
			OSS_NO_MESSAGE,
			toggle: false,
			list: []
		};
	},
	created() {
		this.getNewdata();
	},
	methods: {
		handleClickMore() {
			this.$router.push({
				path: '/finance/main/information',
				query: {
					is_control_role: 1
				}
			});
		},
		handleToggle() {
			this.toggle = !this.toggle;
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
					name: "finance-consultation", 
					query: {
						material_type: 2, 
						keyword: v.keyword, 
						status: '9',
						information_id: v.information_id
					} 
				}
			);
		}
	}
};
</script>

<style lang="scss">
.v-finance-main-side {
    min-width: 360px;
	max-width: 360px;
	padding: 20px 15px;
	overflow: auto;
    background-color: #f5f5f7;
	font-size: 14px;
	top: 56px;
    ._title {
        margin-bottom: 15px;
    }
    ._survey-container {
        height: 130px;
        padding: 0 15px;
        color: #333333;
    }
    ._record-container {
        max-height: 300px;
        padding: 36px 15px 14px;
        .__item {
            display: inline-block;
            width: 76px;
		}
    }
    ._interview-container {
        height: 130px;
        padding: 0 15px;
        color: #333333;
    }
    ._performance-container {
        max-height: 300px;
        padding: 15px;
    }
    ._shadow-box {
        margin-bottom: 25px;
        // box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        background-color: #ffffff;
        .__avatar {
            width: 32px;
            height: 32px;
            line-height: 32px;
            border-radius: 16px;
            border: 1px solid #333333;
            text-align: center;
        }
        .__item {
            padding: 0 15px;
            height: 42px;
			color: #333333;
		}
		.__up {
			color: #f00;
			}
		.__down {
			color: #07da11;
		}
    }
	._news {
		padding: 10px 20px 0px;
		// height: 240px;
		background-color: #fff;
		._news-item {
			border-bottom: 1px solid #D4D7DB;
		}
		._news-item:last-of-type {
			border-bottom: none;
		}
	}
}
</style>
