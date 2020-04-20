<template>
	<div class="v-sale-mian-month-active">
		<div v-if="loading">
			<div class="_active-box">
				<div class="g-flex-ac">
					<div
						v-for="(item,index) in acthveList"
						v-if="index<6"
						:key="index"
						class="_body"
					>
						<img
							:src="item.cover_image+'!4-4'?item.cover_image+'!4-4':item.cover_image+'!4-4'"
							alt
						>
						<div class="__cover g-flex-cc  g-flex-ac ">
							<div v-if="item.status==2" @click="handleSignUp(item.activity_id)">
								<span>给客户报名</span>
								<i class="iconfont">&#xeb93;</i>
								<div>{{ item.start_time }}-{{ item.end_time }}</div>
							</div>
							<div v-if="item.status==1" style="flex-flow: wrap; ">
								<div>报名待开始 </div>
								<div>{{ item.start_time }}-{{ item.end_time }}</div>
							</div>
						</div>
						<div class="__name g-m-t-10 g-c-black2">{{ item.activity_name }}</div>
						<div
							class="__month g-c-black4"
						>{{ item.start_date }}-{{ item.end_date }}</div>
						<div class="__time g-c-red-dark">倒计时：{{ item.future_day }}天</div>
					</div>
				</div>
				<div v-if="acthveList.length==0" class="g-flex-cc">
					<img
						:src="OSS_SEARCH_EMPTY"
						alt
					>
				</div>
			</div>
			<div class="_bottom g-operation" style="font-size:14px" @click="handleMore">查看更多</div>
		</div>
		<oa-loading v-else/>
	</div>
</template>

<script type="text/ecmascript-6">
import { OSS_FLOW, OSS_SEARCH_EMPTY, OSS_PK } from "@constants/constants";
import API from "@stores/apis/root";
import { PModal } from "./popup/index";
import { PSignUp } from "./popup/sign-up";

export default {
	components: {

	},
	data() {
		return {
			acthveList: [],
			OSS_PK,
			OSS_FLOW,
			OSS_SEARCH_EMPTY,
			loading: false,
		};
	},
	mounted() {
		this.loadLatestActive();
		const { query } = this.$route;
		query.apply_record_list && PModal.popup({
			data: { name: 1 }
		});
	},
	methods: {
		handleMore() {
			PModal.popup({
				data: {

				}
			});
		},
		handleSignUp(i) {
			PSignUp.popup({ data: { activeId: i }, });
		},
		loadLatestActive() {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_DAY_LIST_GET,
				type: "post",
				loading: false,
				param: {
				}
			}).then(res => {
				this.loading = true;
				this.acthveList = res.data;
				if (window.innerWidth <= 1366 && this.acthveList.length > 4) {
					this.acthveList.length = 4;
				} else if (window.innerWidth <= 1600 && this.acthveList.length > 5) {
					this.acthveList.length = 5;
				}
			}).catch(error => {
				console.error(error);
			});
		}
	}
};
</script>

<style scoped lang="scss">
    .v-sale-mian-month-active {
        // min-width:890px ;
        ._active-box {
            width: 100%;
            padding-bottom: 15px;
            overflow: hidden;
            &:hover {
                overflow: auto;
            }
        }
        ._body {
            position: relative;
            text-align: left;
            img {
                width: 128px;
                height: 128px;
                min-width: 128px;
                min-height: 128px;
                margin-right: 15px;
                border: 1px solid #d4d7db;
                img:last-child {
                    margin-right: 24px;
                }
            }
            .__name {
                max-width: 135px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 14px;
            }
            .__month {
                font-size: 12px;
            }
            .__time {
                font-size: 14px;
            }
            .__cover {
                background: #000;
                opacity: 0;
                width: 128px;
                height: 128px;
                text-align: center;
                position: absolute;
                top: 0;
                z-index: 2;
                cursor: pointer;
                &:hover {
                    opacity: 0.7;
                }
                div {
                    opacity: 1;
                    color: #fff;
                }
            }
        }
        ._body:first-child {
            margin-left: 24px;
        }
        ._body:last-child {
            img {
                margin-right: 24px;
            }
        }
        ._bottom {
            clear: both;
            position: absolute;
            width: 100%;
            bottom: 20px;
        }
    }
</style>
