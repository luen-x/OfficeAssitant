<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		width="680"
		footer-hide
		title="互动搜索"
		class="v-sale-collect"
		@on-cancel="handleCancel">
		<div>
			<div class="g-tc g-m-b-20">
				<i-date-picker
					v-model="time"
					placeholder="请选择日期"
					style="width: 220px;cursor: pointer"
				/>
				<i-input
					v-model="keyword"
					type="text"
					clearable
					style="width: 220px; margin-left: 6px"
					placeholder="在此输入关键字"
					@on-enter="handleSearch"
				/>
				<vc-debounce-click
					:tag="Button"
					class="g-red-btn-small"
					type="primary"
					style="margin-left: 8px"
					@click="handleSearch">搜索</vc-debounce-click>
			</div>
			<div class="_content">
				<div v-if="collectList.length">
					<oa-message-item
						v-for="(message, i) in collectList"
						:key="i"
						:handle-praise="handlePraise"
						:handle-collect-on="handleCollectOn"
						:message="message"/>
				</div>
				<div v-if="!collectList.length && hasRequest" class="g-tc">
					<img :src="OSS_EMPTY" alt="">
					<div>抱歉,未查找到相关的消息哦</div>
				</div>
			</div>

	</div></i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Input, Button, DatePicker } from 'iview';
import moment from 'moment';
import { OSS_EMPTY } from "@constants/constants";
import { CreatePortal } from 'wya-vc';
import ROOT_API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import messageItem from './message-item';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-date-picker": DatePicker,
		'oa-message-item': messageItem,
	},
	mixins: [orderModal],
	props: {
		module: {
			type: String,
			default: 'any'
		}
	},
	data() {
		return {
			OSS_EMPTY,
			visible: false,
			keyword: '',
			collectList: [],
			hasRequest: false,
			is_sale_page: '',
			time: '',
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handlePraise(message) {
			this.$request({
				url: ROOT_API._SALE_MAIN_SCREEN_PRAISE_POST,
				type: "POST",
				param: {
					interact_id: message.interact_id,
					status: message.is_praise ? -1 : 1
				}
			}).then(res => {
				this.$Message.success(res.msg);
				app.$store.commit("SALE_MAIN_SCENE_PRAISE", message);
				message.is_praise = message.is_praise ? 0 : 1;
				message.is_praise ? ++message.praise_num : --message.praise_num;
			}).catch(err => {
				console.error(err);
			});
		},
		handleCollectOn(message) {
			this.$request({
				url: ROOT_API._SALE_MAIN_SCREEN_COLLECT_POST,
				type: "POST",
				param: {
					interact_id: message.interact_id,
					status: message.is_collect ? -1 : 1
				}
			}).then(res => {
				this.$Message.success(res.msg);
				app.$store.commit("SALE_MAIN_SCREEN_COLLECT", message);
				message.is_collect = message.is_collect ? 0 : 1;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSearch() {
			if (!this.keyword && !this.time) {
				this.$Message.warning('至少填写一项');
				return;
			}
			if (this.module == 'sale') {
				this.is_sale_page = 1;
			}
			this.hasRequest = 0;
			this.$request({
				url: ROOT_API._SALE_MAIN_SCENE_GET,
				type: "GET",
				param: {
					content: this.keyword,
					is_sale_page: this.is_sale_page,
					date: (this.time && moment(this.time).format('YYYY-MM-DD'))
				}
			}).then(res => {
				this.hasRequest = 1;
				// this.$Message.success(res.msg);
				this.collectList = res.data.list;
			}).catch(err => {
				console.error(err);
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
export const ModalSelect = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
	.v-sale-collect {
	    margin: 20px 20px 10px 20px;
	    background: #fafafa;
	    min-height: 68px;
	    padding: 15px;
			._content {
				min-height: 300px;
				max-height: 420px;
				overflow-y: auto;
			}
			.v-screen-message:first-of-type {
				margin-top: -15px;
			}
	}
</style>
