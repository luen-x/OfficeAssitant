<template>
	<set-title 
		title="客户服务" 
		class="g-tabs-card v-sale-service-customer-container" 
		style="padding: 20px"
	>
		<oa-filter />
		<oa-tabs-list />
		<transition name="fade">
			<oa-service-slogan 
				v-if="visible"
				:msg="msg" 
				@close="visible = false"
			/>
		</transition>
	</set-title>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import TabsList from '@components/sale/service-customer/tabs-list';
import Filter from '@components/sale/service-customer/filter';
import navigator from '@extends/mixins/navigator';
import { ServiceSlogan } from '@components/sale/_common/service/slogan';

export default {
	name: 'oa-sale-service-customer',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
		'oa-service-slogan': ServiceSlogan
	},
	mixins: [navigator('SALE_SERVICE_CUSTOMER')],
	data() {
		return {
			visible: false,
			msg: '',
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: API_ROOT._SALE_SERVICE_DAILY_REMIND_GET,
				type: "GET",
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				if (res.data.status == 1) {
					this.visible = true;
					this.msg = res.data.msg;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-sale-service-customer-container {
	.fade-enter-active, .fade-leave-active {
	transition: opacity .5s
	}
	.fade-enter, .fade-leave-active {
	opacity: 0
	}
}
</style>
