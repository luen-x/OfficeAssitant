<template>
	<div class="v-hr-details-promotion" >
		<div v-if="data.length">
			<div v-for="(item,index) in data" :key="index">
				<div>
					<div style="marginBottom:-15px">
						<oa-title :title="item.system_name" />
					</div>
					<span v-for="(i,index) in item.rank_info_click" :key="index+'ui'" class="g-m-b-10 g-m-t-10 g-m-l-10">
						<oa-item :label="i.label">
							<span class="g-operation" @click="handleClick(i.type,item.rank_system_id,item.period_id)">
								{{ i.value }}
							</span>
						</oa-item>
					</span>
					<span v-for="(i,index) in item.rank_record_click" :key="index+'id'" class="g-m-b-10 g-m-l-10">
						<oa-item :label="i.label">
							<span class="g-operation" @click="handleClick(i.type,item.rank_system_id,item.period_id)">
								{{ i.value }}
							</span>
						</oa-item>
					</span>
					<div class="g-m-l-10">
						<div class="g-fs-14 g-c-black g-m-t-15">本次晋级</div>
						<div v-if="item.type==1" class="g-flex g-m-t-10">
							<oa-item label="目前级称">
								{{ item.this_rank_name }}
							</oa-item>
							<oa-item label="待晋级级称" class="g-m-l-10">
								{{ item.next_rank_name }}
							</oa-item>
						</div>
					</div>
					<oa-item :label="item.effect_date.label" class="g-m-l-10">
						<span slot="explain">
							<oa-explain 
								style="transform: translateY(1px);"
								content="有效期为可以获得相关级称额外补贴的日期"
							/>
						</span>
						{{ item.effect_date.value }}
					</oa-item>
					<oa-item :label="item.check_date.label" class="g-m-l-10">
						{{ item.check_date.value }}
					</oa-item>
					<i-table 
						:columns="columns" 
						:data="item.rank" 
						class="g-m-t-20 g-m-l-10" 
						stripe 
						border />
				</div>
			</div>
		</div>
		<div v-else class="g-flex g-flex-cc g-flex-ac">
			<div class="_empty">
				<img :src="nodataUrl" class="_img g-m-b-20" alt >
				<div>暂无晋级信息</div>
			</div>
		
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Cascader,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Table
} from "iview";
// utils
import { dataValidity, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { log } from 'util';
import { OSS_EMPTY } from '@constants/constants';
import Explain from '@components/_common/explain/explain';
import Title from "../../../_common/title";
import DetailItem from "../detail-item";
import { PromotionModal } from "./popup/promotion";
import { RankModal } from "./popup/rank";
import { AuditModal } from "./popup/audit";
import { CourseModal } from "./popup/course";
import item from "./item";

export default {
	name: "v-hr-details-promotion",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"i-row": Row,
		"i-col": Col,
		"i-table": Table,
		"vc-imgs-picker": ImgsPicker,
		"oa-title": Title,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"oa-item": DetailItem,
		'oa-explain': Explain
	},
	mixins: [item],
	data() {
		return {
			status: false,
			data: [],
			nodataUrl: OSS_EMPTY
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.fetchData();
			}
		}
	},
	mounted() {
		this.fetchData();
	},
	methods: {
		handleCourse(id) {
			const { query = {} } = this.$route;
			CourseModal.popup({ course_num: id, staff_id: unCode(query.staff_id) }).then(res => {
				this.fetchData();
			});
		},
		fetchData() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_GET_MY_RATE_GET,
				type: "GET",
				param: {
					staff_id: unCode(query.staff_id)
				}
			}).then(res => {
				this.data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleClick(type, rankId, periodId) {
			const { query = {} } = this.$route;
			switch (type) {
				case 1:
					PromotionModal.popup({ title: "晋级体系", rank_system_id: rankId, period_id: periodId, }).then();
					break;
				case 2:
					RankModal.popup({ title: "晋级履历", rank_system_id: rankId, staff_id: unCode(query.staff_id) }).then();
					break;
				case 3:
					AuditModal.popup({
						title: "称号履历",
						rank_system_id: rankId,
						period_id: periodId,
						staff_id: unCode(query.staff_id)
					}).then();
					break;
				default:
					break;
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.v-hr-details-promotion {
	border:1px solid #fff;
	._empty {
		margin-top: 180px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
