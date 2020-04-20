<template>
	<div class="v-collage-quality-record g-bt">
		<div
			v-if="flag === '1' && show"
			class="g-pointer g-m-t-20" 
			style="color: #2397F9;"
			@click="handleOperate"
		>
			申诉
		</div>
		<div 
			v-for="(item, index) in datas" 
			:key="index" 
			class="g-pd-b-30 g-pd-t-20 _record"
		>
			<div class="g-fs-14 g-pd-r-20 g-flex g-jc-sb">
				<div>
					<span 
						class="g-inline-block g-br g-c-black g-pd-r-20" 
					>
						<span v-if="item.lesson_type == 1" class="g-c-black4">
							{{ item.product_name }}：
						</span>
						<span>{{ item.lecture_set_name }}</span>
					</span>
					<span class="g-c-black4" style="margin-left: 28px;">
						总体评分：
					</span>
					<span class="g-c-black">
						{{ item.whole_score >= 0 ? item.whole_score + '分' : '--' }}
					</span>
				</div>
				<div v-if="labelFlag">
					<div v-if="item.appeal_label">
						<oa-product-label 
							:name="['申诉中','申诉完成','申诉质检'][item.appeal_label * 1 - 1]" 
							color="#E74854"
						/>
					</div>
				</div>
			</div>
			<div 
				v-for="(e, id) in item.qualityRecordLessonScore" 
				:key="id"
				class="g-m-t-30 g-inline-block g-m-r-20 g-flex g-fw-w __staff"
			>
				<div class="g-flex" style="width: 100%;">
					<div v-if="!e.staff_name" style="width: 150px;">姓名：--</div>
					<div v-else-if="e.staff_name.length < 5" style="width: 150px;">姓名：{{ e.staff_name }}</div>
					<i-tooltip v-else :content="e.staff_name" placement="top" transfer>
						<div style="width: 150px;">姓名：{{ e.staff_name.slice(0,5) + '...' }}</div>
					</i-tooltip>
					<div style="width: 120px;">角色：{{ e.role_type }}</div>
					<div>
						分数：{{ e.real_score == '-1.00' ? '--' : e.real_score }}分
					</div>
				</div>
			</div>
			<div class="g-m-t-30 g-m-r-20">
				<span v-if="item.lesson_type == 1">印象最好的老师：{{ item.good_staff_names.length ? item.good_staff_names.join(',') : '--' }}</span>
			</div>
			<div class="g-m-t-30 g-m-r-20 g-flex" style="text-align: right">
				<div class="g-inline-block" style="width: 96px;">好的反馈：</div>
				<div style="flex: 1;text-align: left;">{{ item.good_feedback || '--' }}</div>
			</div>
			<div class="g-m-t-30 g-m-r-20 g-flex" style="text-align: right">
				<div class="g-inline-block" style="width: 96px;">改善意见：</div>
				<div style="flex: 1;text-align: left;">{{ item.improve_advice || '--' }}</div>
			</div>
			<div class="g-m-t-30 g-m-r-20 g-flex" style="text-align: right">
				<div class="g-inline-block" style="width: 96px;">备注：</div>
				<div style="flex: 1;text-align: left;">{{ item.remark || '--' }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import ProductLabel from "@components/_common/product-label/product-label";
import { Tooltip } from "iview";
import Upload from "@components/_common/upload/upload";
import { SelectNestingModal } from "./modal/select-nesting";

export default {
	components: {
		"oa-product-label": ProductLabel,
		"i-tooltip": Tooltip,
		"oa-upload": Upload
	},

	props: {
		datas: {
			type: Array,
			required: true
		},
		flag: String, // 1 客户服务
		quality_record_id: Number,
		isRequest: {
			type: Boolean,
			default: true
		},
		labelFlag: {
			type: Boolean,
			default: true
		},
		loadDatas: Function
	},

	data() {
		return {
			show: false
		};
	},

	mounted() {
		this.isRequest && this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_COLLAGE_CHECK_SERVICE_APPEAL_LESSON_GET",
				type: "GET",
				param: {
					quality_record_id: this.quality_record_id
				},
				loading: false
			}).then(res => {
				res.data && res.data.length > 0 ? this.show = true : null;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 申诉
		handleOperate() {
			SelectNestingModal.popup({
				quality_record_id: Number(this.quality_record_id)
			}).then((res) => {
				this.loadDatas();
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-quality-record{
	background: #FAFAFA;
	padding-left: 20px;
		
    ._record{
			.__staff {
				padding-left: 36px;
				width: 385px;
			}
    }
}
</style>