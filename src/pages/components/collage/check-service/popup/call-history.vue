<template>
	<div class="v-sc-call-history g-m-t-30">
		<div v-if="spin">
			<oa-title title="通话记录" class="g-m-b-20"/>
			<div v-if="data.length">
				<div 
					v-for="(item, index) in data" 
					:key="index" 
					class="g-pd-20 g-m-b-20 g-m-l-20 _item"
				>
					<div class="g-m-b-10">
						<div class="g-m-r-30 g-inline-block" style="width: 350px">拨打人：{{ item.staff_name }}</div>
						<span class="g-m-r-30">拨打时间：{{ item.start_time }}</span>
						<span>通话状态：{{ item.status_str }}</span>
					</div>
					<oa-cus-audio
						:src="item.tape_link" 
						:disabled="false" 
						mode="mid" 
						show-tip="never"
						style="width: 300px;display: inline-block;"
					/>
					<span v-if="$auth[1357] && item.status !== 3" class="g-c-blue-mid g-pointer" @click="handleDownload(item)">下载</span>
					<span v-else class="g-c-black-5">下载</span>
				</div>
				<div class="_btn-box">
					<i-page 
						:total="totalCount"
						:current="currentPage"
						:page-size="pageSize"
						show-total 
						show-elevator 
						show-sizer
						class="__page g-fr"
						@on-change="handleChange"
						@on-page-size-change="handlePageSizeChange"
					/>
				</div>
			</div>
			<div v-else class="_empty">
				<img :src="OSS_NO_MESSAGE07">
				<p class="g-fs-14">暂无通话记录</p>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { OSS_NO_MESSAGE07 } from "@constants/constants";
import { Tooltip, Table, Message, Page } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import CusAudio from '@components/sale/_common/audio/audio';
import { Confirm } from '@common/confirm/confirm';
import { ContractModal } from "./contract-modal";

export default {
	name: "collage-service-manage-call-history",
    
	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip,
		"i-table": Table,
		'oa-cus-audio': CusAudio,
		'i-page': Page
	},
	
	props: {
		contract_company_id: Number
	},
    
	data() {
		return {
			OSS_NO_MESSAGE07,
			contract: [],
			spin: false,
			data: [],
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
		};
	},

	mounted() {
		this.loadData(1);
	},

	methods: {
		handleChange(page) {
			this.loadData({ page });
		},
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.loadData({ page: 1 });
		},
		loadData(item) {
			this.spin = false;

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_CALL_HISTORY_GET,
				type: "GET",
				param: {
					relation_id: this.contract_company_id,
					list_type: 3,
					page: item
				},
				loading: false
			}).then(res => {
				this.data = res.data.list;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.spin = true;
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},
		handleDownload(item) {
			this.downloadFile(item.download);
		},
		downloadFile(url) {
			let iframe = document.createElement('iframe');
			iframe.id = (new Date()).getTime();
			iframe.addEventListener('load', function () {
				document.body.removeChild(iframe);
			}); 
			// hack 因为预览类型的文件，onload不会执行，所以在iframe内在创建一个下载的iframe
			iframe.srcdoc = `<iframe src='${url}'></iframe>`;
			document.body.appendChild(iframe);
		}
	}
};
</script>

<style lang="scss">
.v-sc-call-history {
    padding-left: 32px;
    padding-bottom: 50px;
	width: 100%;
	min-height: 90%;
	max-height: 100%;
	overflow-y: auto;
    position: relative;
	._btn-box {
		width: 100%;
		height: 70px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		padding: 0 70px;
		// border-top: 1px solid #e8e8e8;
		// -webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		// box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		.__page {
			margin-top: -5px;
			padding: 0px 0px;
			float:right
		}
	}
    ._item {
        width: 95%;
        background-color: #F5F5F6;
        border-radius: 4px;
    }
    ._empty{
		text-align: center;
		height: 200px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-80%);
		-webkit-transform: translate(-50%,-80%);

		img{
			width: 200px;
			height: 160px;
		}
	}
}
</style>