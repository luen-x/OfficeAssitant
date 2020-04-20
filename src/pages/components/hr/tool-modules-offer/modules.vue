<template>
	<div class="v-hr-tool-modules-offer g-flex-ac g-fw-w">
		<div 
			v-for="(item, index) in list"
			:key="item.offer_id"
			:class="index < list.length - 1 ? 'g-m-r-20' : ''"
			class="_item g-flex-ac g-pd-lr-20 g-pd-tb-10 g-m-b-20"
		>
			<i 
				:class="item.type == 2 ? 'icon-interview g-c-blue-mid' : 'icon-enter-date g-c-orange-mid' "
				class="iconfont g-fs-30" 
			/>
			<div class="g-m-l-5 g-col g-pointer" @click="handleLinkTo(item)">
				<p 
					:title="item.offer_name" 
					class="g-c-black1 g-fs-14 g-oneline"
				>
					{{ item.offer_name }}
				</p>
				<p 
					:title="item.description" 
					class="g-c-black3 g-twoline"
				>
					{{ item.description }}
				</p>
				<p class="g-c-black4 g-m-t-5">修改日期：{{ item.update_time }}</p>
			</div>
			<div class="__divider"/>
			<div class="g-flex-cc g-fd-c g-jc-sb g-c-black4">
				<i v-if="$auth[291]" class="iconfont icon-download g-pointer" @click="handleDownload(item.offer_id)" />
				<i-poptip
					confirm
					title="是否确定删除该模板？"
					@on-ok="handleDel(item.offer_id)"
				>
					<i v-if="$auth[292]" class="iconfont icon-delete g-pointer"/>
				</i-poptip>
			</div>
		</div>
	</div>
</template>

<script>
import { Poptip } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { AddModal } from './popup/add';

export default {
	name: 'hr-tool-modules-offer',
	components: {
		'i-poptip': Poptip
	},
	data() {
		return {
		};
	},
	computed: {
		list() {
			return this.$store.state.hrToolModulesOffer.list;
		},
	},
	watch: {
		'$store.state.hrToolModulesOffer.isFetched': function (newVal, oldVal) {
			if (!newVal) {
				this.loadData();
			}
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			let { query = {} } = getParseUrl();
			this.request({
				url: 'HR_TOOL_MODULES_OFFER_GET', // eslint-disable-line
				type: "GET",
				param: {
					...query
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleLinkTo(item) {
			AddModal.popup({
				title: '编辑模板',
				info: item
			}).then((res) => {

			}).catch((error) => {

			});
			
		},
		handleDownload(offer_id) {
			window.open(getHashUrl(API_ROOT['_HR_TOOL_MODULES_OFFER_DOWNLOAD_GET'], { // eslint-disable-line
				offer_id,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleDel(id) {
			this.$request({
				url: API_ROOT['_HR_TOOL_MODULES_DEL_OFFER_POST'],
				type: "POST",
				param: {
					offer_id: id,
				},
			}).then((res) => {
				this.$store.commit('HR_TOOL_MODULES_OFFER_INIT');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">

.v-hr-tool-modules-offer {
	margin-top: 20px;
	._item {
		width: 350px;
		min-height: 120px;
		margin-right: 20px;
		background-color: #fafafa;
		box-sizing: border-box;
		border-radius: 4px;
		cursor: pointer;
		.__divider {
			width: 1px; 
			height: 42px;
			background-color: #d5d4d9;
			margin: 0 20px;
		}
	}
	._item:hover {
		background-color: #f0f4fc;
	}
}
</style>
