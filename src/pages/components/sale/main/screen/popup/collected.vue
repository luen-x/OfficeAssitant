<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		width="680"
		title="我的收藏"
		class="v-collect-item"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div v-if="collectList.length" class="_scroll">
			<oa-message-item
				v-for="(message, i) in collectList"
				:key="i"
				:handle-praise="handlePraise"
				:handle-collect-on="handleCollectOn"
				:message="message"/>
		</div>
		<div v-if="!collectList.length && isLoaded" class="g-tc">
			<img :src="OSS_EMPTY" alt="">
			<div>您还未收藏任何消息哦</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, DatePicker } from 'iview';
import { debounce } from 'lodash';
import { CreatePortal } from 'wya-vc';
import ROOT_API from '@stores/apis/root';
import { OSS_EMPTY } from '@constants/constants';
import orderModal from '@extends/mixins/orderModal';
import messageItem from './message-item';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		'oa-message-item': messageItem
	},
	mixins: [orderModal],
	data() {
		return {
			visible: false,
			collectList: [],
			isLoaded: false, // 是否加载完成
			OSS_EMPTY,
		};
	},
	created() {
		this.$request({
			url: ROOT_API._SALE_MAIN_SCREEN_COLLECT_LIST_GET,
			type: 'GET'
		}).then(res => {
			// this.$Message.success(res.msg);
			this.collectList = res.data.list;
			this.isLoaded = true; // 加载完成
		}).catch(err => {
			this.$Message.error(err.msg);
		});
	},
	mounted() {
		this.visible = true;
	},
	methods: {

		handlePraise: debounce(function (message) {
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
			}).catch(console.error);
		}, 300),
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
				message.is_collect = message.is_collect ? 0 : 1;
				app.$store.commit("SALE_MAIN_SCREEN_COLLECT", message);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
	}
};
export const ModalColletcd = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
	.v-collect-item {
	  margin: 20px 20px 10px 20px;
	  background: #fafafa;
	  min-height: 550px;
	  padding: 15px;
	    ._scroll {
			max-height: 385px;
			overflow-y: scroll;
		}
	}
</style>
