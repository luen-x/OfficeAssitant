<template>
	<div class="v-collage-setting-subsidy">
		<div v-for="(item, index) in data" :key="index" class="g-m-b-20">
			<div 
				class="_top g-pointer" 
				@click="handleToggle(item, index)"
			>
				<div :class="item.is_set ? '_set' : '_unset'" class="_flag _flag-left">
					{{ item.is_set ? '已设置' : '未设置' }}
				</div>
				<i-row class="__top-wrapper">
					<i-col span="6" style="color:#4B4F57;" class="g-fs-15">{{ item.name }}</i-col>
					<i-col span="6" class="g-c-black4">修改人：{{ item.staff_name || '--' }}</i-col>
					<i-col span="9" class="g-c-black4">修改时间：{{ item.update_time || '--' }}</i-col>
					<i-col v-if="$auth[1320]" span="1" class="g-c-black4">
						<i class="iconfont g-fs-14 icon-bianji __icon" @click.stop="handleEdit(item)"/>
					</i-col>
					<span class="g-fr g-m-r-10">
						<i
							:class="item.show ? 'icon-triangle-up' : 'icon-triangle-down'"
							class="iconfont g-fs-14 g-c-black3"
						/>
					</span>
				</i-row>
			</div>

			<vc-expand
				ref="expand"
				v-model="item.show"
			>
				<div class="_content">
					<div v-if="item.allowance_id == 1 && item.allowance_data">
						<span class="g-c-black4">补贴金额：</span>
						<span class="g-c-black2">{{ item.allowance_data.money }}元/天</span>
					</div>
					<div v-if="item.allowance_id == 2 && item.allowance_data">
						<!-- <div class="g-c-black4">补贴金额</div> -->
						<div v-for="(e, index1) in item.allowance_data.money" :key="index1" class="g-m-b-20">
							<span class="g-c-black4">补贴金额：</span>
							<span class="g-c-black2">{{ e.price }}元/{{ e.day }}天，{{ e.person_number }}人</span>
							<span class="g-c-black4 g-m-l-30">关联课程：</span>
							<span class="g-c-black2">
								{{ e.lecture_set_name_items.map(v => v.name).join(',') }}
							</span>
							<!-- <span class="g-c-black4 g-m-l-30">关联唱单：</span>
							<span class="g-c-black2">{{ e.is_relate_sing ? '是' : '否' }}</span> -->
						</div>
					</div>
					<div v-if="item.allowance_id == 3 && item.allowance_data">
						<div v-for="(e, index1) in item.allowance_data" :key="index1">
							<div class="g-c-black4 g-m-b-30">{{ e.type == 1 ? '线上课程' : '线下课程' }}</div>
							<div class="g-m-b-20">
								<span class="g-c-black4">流程费比例：</span>
								<span v-for="(v, index2) in e.process_fee_ratio" :key="index2" class="g-c-black2 g-m-b-20">
									{{ v.study_num_begin }} - {{ v.study_end_num }}次，{{ v.ratio }}% ;
								</span>
							</div>
							<div class="g-flex">
								<div class="g-c-black4">流程费金额：</div>
								<div class="g-m-b-30">
									<div v-for="(v, index2) in e.process_fee" :key="index2">
										<span class="g-c-black2 g-inline-block g-m-r-30" style="width: 100px;">
											{{ v.price }}/{{ e.type == '1' ? '套' : '客户' }}
										</span>
										<span class="g-c-black4">
											关联课程：
										</span>
										<span class="g-c-black2">
											{{ v.lecture_set_name_items.map(k => k.name).join(',') }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="item.allowance_id == 4 && item.allowance_data">
						<div v-for="(e, index1) in item.allowance_data.money" :key="index1" class="g-m-t-5">
							<span class="g-c-black4">补贴金额：</span>
							<span class="g-c-black2">{{ e.price }}元/场次</span>
							<span class="g-c-black4 g-m-l-30">关联课程：</span>
							<span class="g-c-black2">
								{{ e.lecture_set_name_items.map(v => v.name).join(',') }}
							</span>
						</div>
					</div>
					<div v-if="item.allowance_id == 5 && item.allowance_data">
						<div v-for="(e, index1) in item.allowance_data.money" :key="index1" class="g-m-t-5">
							<span class="g-c-black4">补贴金额：</span>
							<span class="g-c-black2">{{ e.price }}元/期</span>
							<span class="g-c-black4 g-m-l-30">关联课程：</span>
							<span class="g-c-black2">
								{{ e.lecture_set_name_items.map(v => v.name).join(',') }}
							</span>
						</div>
					</div>
					<div v-if="!item.allowance_data" style="text-align: center;">
						<span>还没有设置补贴哦，快点击
							<span class="g-pointer g-c-blue-mid" @click="handleEdit(item)">
								设置
							</span>
							吧
						</span>
					</div>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Row, Col } from 'iview';
import API_ROOT from "@stores/apis/root";
import { Expand } from "wya-vc";
import { setItem, getItem, getHashUrl } from "@utils/utils";
import { EvectionModal } from './popup/evection-modal';
import { HostModal } from './popup/host-modal';
import { SingModal } from './popup/sing-modal';
import { CoordinateModal } from './popup/coordinate-modal';
import { JoinModal } from './popup/join-modal.vue';

export default {
	name: 'oa-tpl',
	components: {
		"vc-expand": Expand,
		'i-row': Row,
		'i-col': Col
	},
	data() {
		return {
			show: true,
			data: [],
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		handleToggle(item, index) {
			this.$refs.expand[index].toggle();
			this.data[index].show = !item.show;
		},
		loadData() {
			this.$request({
				url: API_ROOT['_COLLAGE_SETTING_SUBSIDY_ALLOWANCE_LIST_GET'],
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.data = res.data;
				this.data.forEach(v => v.show = false);
			}).catch((error) => {
			});
		},
		handleEdit(item) {
			item.allowance_id == 1 ? EvectionModal.popup({
				datas: item
			}).then(res => {
				this.loadData();
			}) : '';
			item.allowance_id == 2 ? HostModal.popup({
				datas: item
			}).then(res => {
				this.loadData();
			}) : '';
			item.allowance_id == 3 ? JoinModal.popup({
				datas: item
			}).then(res => {
				this.loadData();
			}) : '';
			item.allowance_id == 5 ? CoordinateModal.popup({
				datas: item
			}).then(res => {
				this.loadData();
			}) : '';
			item.allowance_id == 4 ? SingModal.popup({
				datas: item
			}).then(res => {
				this.loadData();
			}) : '';
		}
	},
};
</script>

<style lang="scss" scoped>
.v-collage-setting-subsidy {
	margin-top: 50px;
	._set {
		color: #fff;
		background-color: #4FC43D;
	}
	._unset {
		background-color: #DFDFDF;
		color: #333333;
	}
	._flag {
		position: absolute;    /*绝对定位*/
		height: 20px;
		line-height: 20px;
		text-align: center;
		width: 78px;
	}
	._flag-left {
		-moz-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-o-transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		left: -18px;
		top: 9px;
	}
	._top {
		position: relative;
		overflow: hidden;
		width: 80%;
		height: 52px;
		line-height: 52px;
		background: rgba(249, 249, 249, 1);
		border: 1px solid rgba(232, 232, 232, 1);
		margin: 0 auto;
		.__top-wrapper {
			padding-left: 40px;
			.__icon {
				padding: 0 10px 0 10px;
				border-left: 1px solid #D4D7DB;
				border-right: 1px solid #D4D7DB;
			}
		}
	}
	._content {
		width: 80%;
		margin: 0 auto;
		border: 1px solid rgba(232, 232, 232, 1);
		border-top: none;
		padding: 30px 20px 30px 20px;
	}
}
</style>
