<template>
	<div 
		:style="!list.length ? 'height:100%;' : 'height:auto;'"
		class="g-relative v-sale-black-contact"
	>
		<oa-loading v-if="loading"/>
		<div 
			v-if="!list.length" 
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无联系人</div>
			</div>
		</div>
		<div v-else class="g-flex g-fw-w g-m-t-20">
			<div 
				v-for="item in list" 
				:key="item.contact_id"
				class="_info g-m-15"
			>
				<span 
					v-if="item.is_decision" 
					class="__bar g-inline-block g-tc"
				>
					主要决策
				</span>
				<div>姓名：{{ item.customer_name }}</div>
				<div>职位：{{ item.position }}</div>
				<div>电话：{{ item.tel }}</div>
				<div>
					<span>Email:{{ item.email }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: "oa-black-contact",
	components: {
		'oa-loading': Loading,
		'i-button': Button
	},
	props: {
		customerId: [String, Number]
	},
	data() {
		return {
			loading: false,
			list: [],
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		customerId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.list = [];
			this.$request({
				url: '_SALE_SEA_CONTACT_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.list = res.data;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		}
	}
};

export const BlackContact = module.exports.default;

</script>

<style lang="scss">
.v-sale-black-contact {
	._info {
		border: 1px #e84854 solid;
		border-radius: 5px;
		padding: 25px;
		font-size: 13px;
		width: 300px;
		position: relative;
		box-shadow: 0px 0px 0px 10px #faacac;
		overflow: hidden;
		&>div {
			margin-bottom: 14px;
			&:last-child {
				margin-bottom: 0px;
			}
		}
		.__bar {
			color: white;
			background: #e84854;
			position: absolute;
			width: 200px;
			transform: rotateZ(45deg);
			right: -74px;
			top: 16px;
		}
	}
}
</style>
