<template>
	<div v-if="offerList.length" class="v-hr-tool-modules-upload g-flex-ac g-fw-w">
		<div
			v-for="(item, index) in list"
			:key="index"
			:class="index < list.length - 1 ? 'g-m-r-20' : ''"
			class="_item g-flex-ac g-pd-lr-20 g-pd-tb-10 g-m-b-20"
			@click="hanldeEdit(item,offerList[index])">
			<i
				:class="item.type == 1 ? 'icon-interview g-c-blue-mid' : 'icon-enter-date g-c-orange-mid' "
				class="iconfont g-fs-30"
			/>
			<div class="g-m-l-10 g-col">
				<p
					:title="item.name"
					class="g-c-black3 g-twoline g-fs-14"
				>
					{{ item.name }}
				</p>
				<p class="g-c-black4 g-m-t-5" >{{ item.description }}</p>
			</div>
			<div class="__divider"/>
			<div class="g-flex-cc g-fd-c g-jc-sa g-c-black4" @click.stop >
				<i-switch v-model="offerList[index].is_open" @on-change="handleChange(offerList[index],$event)"/>
			</div>
		</div>
	</div>
</template>

<script>
import { Poptip, Switch } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import downloadFile from '@utils/download';
import API_ROOT from '@stores/apis/root';
import { AddModal } from './popup/add';

export default {
	name: 'hr-tool-modules-upload',
	components: {
		'i-poptip': Poptip,
		'i-switch': Switch,
	},
	data() {
		return {
			offerList: [],
			list: [
				{
					name: '社招Offer正文模板',
					description: '此模版会影响OA发送社招Offer的邮件正文内容。',
					type: '1'
				},
				{
					name: '校招Offer正文模板',
					description: '此模版会影响OA发送校招Offer的邮件正文内容。',
					type: '2'
				}
			]
		};
	},
	computed: {
	},
	watch: {

	},
	created() {
		this.loadData();
	},
	methods: {
		hanldeEdit(item, config) {
			this.$router.push({
				name: 'hr-tool-modules-edit',
				query: { recruitType: item.type == 2 ? 'school' : 'society', },
				params: { ...config }
			 });
		},
		handleChange(item, e) {
			this.$request({
				url: 'HR_TOOL_MODULES_OFFER_THEME_IS_OPEN_GET',
				type: "POST",
				param: {
					offer_conf_id: item.offer_conf_id,
					is_open: Number(e)
				},
			}).then((res) => {
				this.$Message.success(res.msg);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadData() {
			let { query = {} } = getParseUrl();
			this.$request({
				url: "HR_TOOL_MODULES_OFFER_THEME_LIST_GET",
				type: "get",
			}).then((res) => {
				res.data.forEach(ele => {
					ele.is_open = !!ele.is_open;
				});
				this.offerList = res.data;

			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handlePopup(info) {
			AddModal.popup({
				title: '编辑模板',
				info,
				parent: { $store: this.$store }
			}).then((res) => {

			}).catch((error) => {

			});
		},
		handleDownload(url) {
			downloadFile({
				fileName: url
			});
		},
		handleDel(id) {
			this.$request({
				url: API_ROOT['HR_TOOL_MODULES_OFFER_THEME_IS_OPEN_GET'],
				type: "POST",
				param: {
					document_id: id,
				},
			}).then((res) => {
				this.$store.commit('HR_TOOL_MODULES_UPLOAD_INIT');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-tool-modules-upload {
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
