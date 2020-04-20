<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:mask="false"
		:class-name="'sale-main-archieve-expired-tip-'+index"
		footer-hide
		draggable
		title="保护到期提示"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-l-30" >
			<div class="g-c-blue-mid g-fs-14 g-pointer" @click="handleLink">{{ customer.company_name }}</div>
			<div class="g-c-black2  g-m-t-20"> {{ customer.msg }}</div>

		</div>
	</i-modal>
</template>
<script >
import { Modal, Message } from 'iview';
import moment from 'moment';
import { getItem, setItem, delItem } from 'wya-utils';
import { CreatePortal } from 'wya-vc';
import { getHashUrl } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';
import net from "@utils/net";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-sale-main-archieve-expire-tip",
	components: {
		'i-modal': Modal
	},
	mixins: [orderModal],
	props: {
		customer: {
			type: Object,
			default: () => {}
		},
		index: Number
	},
	data() {
		return {
			visible: false
		};
	},
	computed: {
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure', 1);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		},
		handleLink() {
			this.$router.push(getHashUrl('/sale/customer/intention', { sort: 1, customer_id: this.customer.customer_id }));
			this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_INIT");
			this.handleOk();
		}
	}
};
const ExpireTip = CreatePortal({ autoDestory: false }, module.exports.default);
export const expireTipService = {
	max_time: 3 * 24 * 3600, // 秒
	timer: undefined,
	index: 0,
	init() {
		this.update();
		this.timer = setInterval(() => {
			this.update();
		}, 10 * 60 * 1000);
	},
	update() {
		if (!_global.staff.staff_id) {
			return;
		}
		net.ajax({
			url: API_ROOT._SALE_INTENTION_EXPIR_CUSTOMER,
			type: "GET",
			loading: false,
			param: {
				last_day: 3
			}
		}).then(res => {
			const target = [];
			const customers = this.getCustomers();
			res.data.forEach(item => {
				const exist = customers.find(it => {
					return it.customer_id == item.customer_id;
				});
				if (exist) {
					item.viewed = exist.viewed;
				}
				target.push(item);
			});
			this.setCustomers(target);
			target.filter(item => !item.viewed).filter((item, index) => index < 5).forEach(item => {
				if (item.help_time <= this.max_time) {
					this.popTip(item, this.index);
					this.index++;
				}
			});
		}).catch(res => {
			console.error(res);
			this.$Message.error("网络异常");
		});
	},
	getCustomers() {
		return getItem("expireCustomer" + _global.version, 'localStorage') || [];
	},
	setCustomers(obj) {
		setItem("expireCustomer" + _global.version, obj, 'localStorage');
	},
	delCustomers() {
		delItem("expireCustomer" + _global.version, 'localStorage');
	},
	setViewed(customerId) {
		const arr = this.getCustomers();
		const curCustomer = arr.find(it => {
			return it.customer_id == customerId;
		});
		if (curCustomer) {
			curCustomer.viewed = true;
		} else {
			console.error('SaleExpireTipError: set viewed faild,can not find customre with customer_id: ' + customerId);
		}
		this.setCustomers(arr);

	},
	popTip(customer, index = 0) {
		ExpireTip.popup({ customer, cName: 'oa-sale-main-archieve-expire-tip' + customer.customer_id, index }).then(() => {
			this.index--;
			this.setViewed(customer.customer_id);
		}).catch(() => {
			this.index--;
			this.setViewed(customer.customer_id);
		});

	},
	close() {
		this.timer && clearInterval(this.timer);
		this.timer = undefined;
		this.delCustomers();
	},
};
</script>
<style lang="scss">
.sale-main-archieve-expired-tip{
	&-0,&-1,&-2,&-3,&-4{
		.ivu-modal{
		position: fixed;
		bottom: 0px;
		right: 0px;
		.ivu-modal-content{
			position:fixed;
			height: 160px;
		}
		}
	}
	&-0{
		.ivu-modal-content{
			bottom: 20px;
			right: 20px;
		}
	}
	&-1{
		.ivu-modal-content{
			bottom: 40px;
			right: 40px;
		}
	}
	&-2{
		.ivu-modal-content{
			bottom: 60px;
			right: 60px;
		}
	}
	&-3{
		.ivu-modal-content{
			bottom: 80px;
			right: 80px;
		}
	}
	&-4{
		.ivu-modal-content{
			bottom: 100px;
			right: 100px;
		}
	}

}

</style>