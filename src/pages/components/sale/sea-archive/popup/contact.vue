<template>
	<div 
		:style="!list.length ? 'height:100%;' : 'height:auto;'"
		class="g-relative v-sale-sea-contact"
	>
		<oa-loading v-if="loading"/>
		<div 
			v-if="!list.length" 
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px;">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无联系人，赶快添加一位吧~ </div>
			</div>
		</div>
		<div 
			v-else 
			class="_box g-m-t-20"
		>
			<div class="__contact g-flex g-fw-w">
				<div 
					v-for="item in list" 
					:key="item.contact_id"
					class="__info g-m-15"
				>
					<span 
						v-if="item.is_decision" 
						class="__bar g-inline-block g-tc"
					>
						主要决策
					</span>
					<div>姓名：{{ item.customer_name }}<span style="margin-left: 10px;font-size: 12px;">{{ item.sex === 0 ? '先生' : '女士' }}</span></div>
					<div>职位：{{ item.position }}</div>
					<div>电话：{{ item.tel }}</div>
					<div>
						<span>邮箱：{{ item.email }}</span>
						<span 
							class="g-fr g-c-blue-mid g-pointer" 
							@click="handleEditContact(item)"
						>
							修改
						</span>
					</div>
				</div>
			</div>
		</div>
		<i-button 
			class="_btn g-m-t-20" 
			style="position:absolute;right:20px;top:0;"
			@click="handleAddContact"
		>
			添加联系人
		</i-button>
	</div>
</template>

<script>
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Button } from 'iview';
import { SeaAddContact } from "./add-contact";
import { SeaEditContact } from "./edit-contact";

export default {
	name: "oa-sea-contact",
	components: {
		'i-button': Button,
		'oa-loading': Loading
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
				autoTip: false,
			}).then(res => {
				this.loading = false;
				this.list = res.data;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 添加联系人
		 */
		handleAddContact() {
			SeaAddContact.popup({
				customerId: this.customerId
			}).then(res => {
				if (res.status == 1) {
					this.loadData();
				}
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 编辑联系人
		 */
		handleEditContact(item) {
			SeaEditContact.popup({
				contact: item
			}).then(res => {
				if (res.status == 1) {
					this.loadData();
				}
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

export const SeaContact = module.exports.default;

</script>

<style lang="scss">
.v-sale-sea-contact {
	padding: 0 16px;
	._box {
		width: 100%;
		.__info {
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
	._btn {
		width: 92px;
		height: 30px;
		line-height: 15px;
		border-color: #e84854;
		color: #e84854;
		&:hover {
			color: #fff!important;
			background-color: #e84854;
		}
	}
}
</style>
