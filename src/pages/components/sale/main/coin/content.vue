<template>
	<div class="v-sale-main-coin-content">
		<oa-block title="我的微币" @getDetail="handleMore">
			<div class="g-flex g-jc-sb g-pd-lr-20 g-pd-tb-10" >
				<div class="g-flex g-col _coin-item" >
					<img :src="OSS_PROP_ICON1" class="_coin-img" >
					<div class="g-col g-pd-t-5">
						<div class="g-tc">微币余额</div>
						<div class="g-c-red-mid g-tc g-fs-14 g-pd-t-5">{{ coins.settled_coins }}</div>
					</div>
				</div>
				<div class="g-flex g-col  g-m-l-10 _coin-item">
					<img :src="OSS_PROP_ICON1" class="_coin-img" >
					<div class="g-col">
						<div class="g-tc g-pd-t-5">待结算</div>
						<div class="g-tc g-fs-14 g-pd-t-5">{{ coins.settling_coins }}</div>
					</div>
				</div>
				<div class="g-flex g-col g-m-l-10 _coin-item">
					<img :src="OSS_PROP_ICON1" class="_coin-img" >
					<div class="g-col">
						<div class="g-tc g-pd-t-5">微币惩罚</div>
						<div class="g-c-green-mid g-tc g-fs-14  g-pd-t-5">
							{{ coins.deduct_total_coins>0?'-':'' }}{{ coins.deduct_total_coins }}
						</div>
					</div>
				</div>
				<div class="g-flex g-col g-m-l-10 _coin-item">
					<img :src="OSS_PROP_ICON7" class="_coin-img">
					<div class="g-col">
						<div class="g-tc g-pd-t-5">本月排名</div>
						<div 
							:class="coins.sort=='暂无排名'?'g-c-black7 g-fs-12':'g-c-red-mid  g-fs-14 '" 
							class=" g-tc g-pd-t-5"
						>
							{{ coins.sort }}
						</div>
					</div>
				</div>
			</div>
			<div v-if="waitCoinList.length" class="g-pd-lr-20 g-pd-b-10 ">
				<div class="g-fs-14 g-pd-b-10 g-m-t-5">
					待结算任务
				</div>
				<div 
					v-for="(item,index) in waitCoinList" 
					:key="index" 
					class="g-flex g-pd-tb-5 g-pd-lr-15 g-m-b-10" 
					style="background:rgba(250,250,250,1);border-radius:3px;"
				>
					<div class="g-col">
						<span class="g-fs-14 g-pd-r-10">{{ item.scene_name }}</span> 
						<span class="g-c-black7">{{ item.content }}</span>
					</div>
					<div>
						<img :src="OSS_PROP_ICON3" style="width:14px;height:14px">
						<span class="g-c-balck7">完成可得{{ +item.income }}微币</span>
					</div>

				</div>
			</div>
		
		</oa-block>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { OSS_PROP_ICON1, OSS_PROP_ICON3, OSS_PROP_ICON7 } from '@constants/constants';
import { setItem } from '@utils/utils';
import Block from '../_common/block';

export default {
	name: 'oa-sale-main-coin',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-block': Block
	},
	data() {
		return {
			OSS_PROP_ICON1,
			OSS_PROP_ICON3,
			OSS_PROP_ICON7,
			"coins": {
				"settled_coins": 0, // 可用的
				"settling_coins": 0, // 待领取的
				"consumed_total_coins": 0, // 消耗的总微币
				"sort": 0// 名次
			},
			waitCoinList: [
				// { scene_name: '旧资料更新', content: "完成旧资料更新4/5条", income: '+5' },
				// { scene_name: '旧资料更新', content: "完成旧资料更新4/5条", income: '+5' }
			]

		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_MAIN_MY_COIN_OWN_COIN_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(({ data }) => {
				this.coins = data.coins;
				this.waitCoinList = data.wait_coins_list;
			
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handleMore() {
			if (this.$auth[1709] && !this.$global.staff.is_charge) {
				const leftMenus = window.app.$children[0].leftMenus;
				setItem('avatarLeftMenus_' + this.$global.version, leftMenus);
				this.$router.push({
					path: '/hr/personnel/currency',
					query: {
						from: "avatar",
						staff_id: this.$global.staff.staff_id,
						staff_name: this.$global.staff.staff_name
					}
				});
			} else {
				this.$Message.warning('暂无菜单权限');
			}
			
			
		}
	}
};
</script>
<style lang="scss">
.v-sale-main-coin-content {
	._coin-item {
		background:rgb(248, 248, 248);
		border:1px solid rgba(232,232,232,1);
		padding: 10px;	
		._coin-img {
			width: 45px;
			height: 45px;
			margin-right: 5px
		}
	}

}

</style>