<template>
	<div class="v-sc-manage-inspection-record g-pd-b-20 ">
		<div v-if="spin" class="g-flex g-pd-r-20 g-pd-t-10 g-jc-sb">
			<div class="g-flex g-flex-ac g-relative">
				<div style="width: 750px;">
					<template 
						v-for="item in quality_record.resolve_info.service_score_items" 
						class="g-flex g-fw-w"
					>
						<div 
							:key="item.id" 
							class="g-m-r-30 g-inline-block g-m-b-10" 
							style="width: 141px;"
						>
							<span class="g-c-black3">{{ item.name }}：</span>
							<span class="g-c-black3">
								{{ item.score }}
							</span>
						</div>
					</template>
					<div class="g-flex g-flex-ac g-m-t-5">
						<div class="g-pd-r-30" style="height: 12px;line-height:12px;">
							<span>是否启动招商会：</span>
							<span class="g-c-black">
								{{ ["--","是","否","不知道"][quality_record.resolve_info.attract_meet * 1] }}
							</span>
						</div>
						<div class="g-pd-l-30 g-pd-r-30 g-m-l-5" style="height: 12px;line-height:12px;margin-right: 18px;">
							<span>是否启动内训：</span>
							<span class="g-c-black">
								{{ ["--","是","否","不知道"][quality_record.resolve_info.inner_training * 1] }}
							</span>
						</div>
						<div class="g-m-l-30 g-m-r-30" style="height: 12px;line-height:12px;">
							<span>销售是否同步跟进：</span>
							<span class="g-c-black">
								{{ quality_record.resolve_info.is_sale_follow === 0
									? "否" : quality_record.resolve_info.is_sale_follow === 1
								? "是" : "已解决" }}
							</span>
						</div>
					</div>

					<div class="g-m-t-20 g-flex g-pd-r-20">
						<span style="width: 40px;">备注：</span>
						<span class="g-c-black g-inline-block" style="width: 80%;">{{ quality_record.resolve_info.memo }}</span>
					</div>

					<div class="g-m-t-20 g-flex g-pd-r-20">
						<span style="width: 60px;">回访凭证：</span>
						<oa-upload
							:data-source="quality_record.resolve_info.fileImage.map(it => ({
								type: it.img_url.substr(it.img_url.lastIndexOf('.')),
								url: it.img_url
							}))"
							:max="5"
							:upload="{multiple: true, max: 5}"
							disabled
							class="g-m-l-10"
							style="width: 250px"
						/>
					</div>

					<div v-if="quality_record.resolve_info.is_follow == 2" class="g-m-t-20 g-flex">
						<div class="g-flex" style="margin-right: 40px;width: 200px;">
							<span class="g-inline-block" style="width: 60px;">解决时间：</span>
							<span class="g-c-black">{{ quality_record.resolve_info.resolve_time }}</span>
						</div>

						<div 
							class="g-flex g-fw-wr" 
							style="margin-right: 40px;width: 320px;"
						>
							<span>解决备注：</span>
							<span class="g-c-black g-inline-block" style=" width: 250px;word-wrap:break-word;">
								<i-tooltip 
									v-if="quality_record.resolve_info.resolve_mark.length > 30"
									:content="quality_record.resolve_info.resolve_mark"
									:max-width="280"
									transfer
								>
									{{ quality_record.resolve_info.resolve_mark.slice(0, 30) + "..." }}
								</i-tooltip>
								<span v-else>
									{{ quality_record.resolve_info.resolve_mark }}
								</span>
							</span>
						</div>

						<div>
							<span>操作人：</span>
							<span class="g-c-black">{{ quality_record.resolve_info.resolve_staff_name }}</span>
						</div>
					</div>
				</div>

				<div 
					v-if="+quality_record.resolve_info.is_follow === 1 && option" 
					class="g-absolute"
					style="top: 10px;right: -80px;"
				>
					<i-button type="primary" @click="handleMarkSolve">
						标记解决
					</i-button>
				</div>
			</div>
		</div>

		<div 
			v-if="quality_record.resolve_info && quality_record.resolve_info.is_follow != 0" 
			class="g-m-r-20 g-m-t-20 g-pd-l-20 g-pd-r-20 g-pd-b-10 _content"
		>
			<div v-if="quality_record.follow_list && quality_record.follow_list.length != 0">
				<div v-for="(item,index) in quality_record.follow_list" :key="index">
					<div class="g-pd-t-20">
						<span>跟进情况：</span>
						<span class="g-c-black">{{ item.mark }}</span>
					</div>
					<div class="g-flex g-m-t-20">
						<span>跟进凭证：</span>
						<oa-upload 
							:data-source="item.file_image.map(it => ({
								type: it.img_url.substr(it.img_url.lastIndexOf('.')),
								url: it.img_url
							}))"
							disabled
							style="width: 300px"
						/>
					</div>
					<div class="g-m-t-20 g-tr" style="text-align: right;">
						<span>回复人：{{ item.staff_name }}({{ item.depart_name }})</span>
						<span>回复时间：{{ item.create_time }}</span>
					</div>
				</div>
			</div>

			<div 
				v-else-if="quality_record.resolve_info && quality_record.resolve_info.is_follow != 0" 
				class="g-pd-t-15 g-tc" 
			>
				<img :src="OSS_NO_MESSAGE01">
				<div 
					v-if="quality_record.resolve_info && quality_record.resolve_info.is_sale_follow == 0" 
					class="g-fs-12"
				>
					此次回访不需要销售同事跟进~
				</div>
				<div v-else-if="quality_record.follow_list && quality_record.follow_list.length == 0">
					销售暂未提交跟进信息~
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, Tooltip } from "iview";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";
import { OSS_NO_MESSAGE01 } from "@constants/constants";
import { MarkSolveModal } from "./mark-solve";

export default {
	name: "sc-manage-inspection-record",
	
	components: {
		"i-button": Button,
		"i-tooltip": Tooltip,
		"oa-upload": Upload
	},

	props: {
		quality_record_id: Number,
		name: String,
		refesh: Function,
		option: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			OSS_NO_MESSAGE01,
			quality_record: {},
			spin: false
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_RECORD_DETAIL_GET,
				type: "GET",
				param: {
					quality_record_id: this.quality_record_id
				}
			}).then(res => {
				this.quality_record = res.data;
				this.spin = true;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 标记解决
		handleMarkSolve() {
			MarkSolveModal.popup({
				quality_record_id: this.quality_record_id
			}).then(res => {
				res && this.refesh();
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-manage-inspection-record{
    width: 100%;
    background: #ffffff;
    padding-left: 30px;
    border: 1px solid #E8E8E8;

    ._content{
        background: #fafafa;
    }
}
</style>