<template>
	<div class="v-hr-details-promote">
		<div class="g-m-b-20">
			<div>
				<oa-title title="晋升信息" class="_title"/>
				<div class="_con">
					<div class="g-flex" style="width:60%;marginTop:-15px;">
						<oa-item label="目前职位">{{ dataInfo.pro_info.position_name }}</oa-item>
						<oa-item label="待晋升职位">{{ dataInfo.this_pro_info.promotion_position_name }}</oa-item>
					</div>
					<div style="width:72%">
						<oa-item label="考核时间">{{ dataInfo.this_pro_info.cycle_month }}</oa-item>
						<oa-item label="生效时间">{{ dataInfo.this_pro_info.effect_time }}</oa-item>
						<oa-item v-if="status===1" label="晋升团队">
							<div v-if="pro_team&&pro_team.length" >
								<i-tooltip 
									v-if="pro_team.join('').length>20"
									transfer
									placement="bottom-start"
								>
									<span>
										{{ pro_team.join(' '+'|'+' ').substr(0, 20) + '...' }}
									</span>
									<div slot="content">
										<p style="whiteSpace: normal">
											{{ pro_team.join(' '+'|'+' ') }}
										</p>
									</div>
								</i-tooltip>
								<div v-else>{{ pro_team.join(' '+'|'+' ') }}</div>
							</div>
							<div v-else>--</div>
						</oa-item>
						<oa-item label="晋升履历">
							<span
								class="g-operation"
								@click="()=>handleClick(2,dataInfo.pro_info.position_id)"
							>点击查看</span>
						</oa-item>
					</div>
					
					<div >
						<oa-title title="固定规则" class="_title" style="marginLeft:-10px"/>
						<oa-regular-table :regular-rule="dataInfo.regular_rule" :status="status"/>
					</div>
					<div>
						<oa-title title="自定义规则" class="_title" style="marginLeft:-10px"/>
						<oa-manmade-table :manmade-rule="dataInfo.manmade_rule" :status="status"/>
					</div>
				</div>
			</div>
			<div v-for="(i,index) in data" :key="index+index">
				<div class="g-m-b-20">
					<oa-title :title="i.system_name" class="_title" style="marginBottom:25px;"/>
					<div v-if="i.type==1" class="g-flex  g-m-l-10" >
						<oa-item label="目前职位">{{ i.this_rank_name }}</oa-item>
						<oa-item label="待晋级职位">{{ i.next_rank_name }}</oa-item>
					</div>
					<div class="g-flex g-m-l-10" >
						<oa-item :label="i.effect_date.label">{{ i.effect_date.value }}</oa-item>
						<oa-item :label="i.check_date.label">{{ i.check_date.value }}</oa-item>
					</div>
					<i-table 
						:columns="columns" 
						:data="i.rank" 
						class="g-m-t-15 g-m-l-10" 
						stripe 
						border/>
				</div>
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
	Table,
	Tooltip
} from "iview";
// utils
import { dataValidity } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { log } from "util";
import { OSS_EMPTY } from "@constants/constants";
import ManmadeTable from "@components/hr/employee-summary-details/details/upgrade/manmade_rule/table";
import RegularTable from "@components/hr/employee-summary-details/details/upgrade/regular_rule/table";
import item from "./item";
import Title from "../../_common/title";
import DetailItem from "./detail-item";
import { RankModal } from "./popup/rank";


export default {
	name: "v-hr-details-promote",
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
		"oa-manmade-table": ManmadeTable,
		"oa-regular-table": RegularTable,
		"i-tooltip": Tooltip,
	},
	mixins: [item],
	data() {
		return {
			status: 1,
			data: [],
			pro_team: [],
			dataInfo: {
				pro_info: {},
				manmade_rule: [],
				regular_rule: [],
				this_pro_info: {
					pro_team_staff_id: [],
					pro_team_depart_id: []
				}
			},
			nodataUrl: OSS_EMPTY
		};
	},
	watch: {
		$route(to, from) {
			if (to.query.staff_id != from.query.staff_id) {
				this.loadData();
			}
		}
	},
	mounted() {
		this.loadData();
		this.loadTableData();
	},
	methods: {
		loadTableData() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_GET_MY_RATE_GET,
				type: "GET",
				param: {
					staff_id: query.staff_id
				}
			})
				.then(res => {
					this.data = res.data;
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		loadData() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_PRO_INFO_GET,
				type: "GET",
				param: {
					staff_id: query.staff_id
				}
			}).then(res => {
				this.dataInfo = res.data;
				this.handleTeam();
			});
		},
		handleTeam() {
			this.pro_team = [];
			if (this.dataInfo.this_pro_info.pro_team_arr && this.dataInfo.this_pro_info.pro_team_arr.length) {
				for (let i = 0; i < this.dataInfo.this_pro_info.pro_team_arr.length; i++) {
					if (this.dataInfo.this_pro_info.pro_team_arr[i].staff_name) {
						this.pro_team.push(this.dataInfo.this_pro_info.pro_team_arr[i].staff_name);
					} else if (this.dataInfo.this_pro_info.pro_team_arr[i].depart_name) {
						this.pro_team.push(this.dataInfo.this_pro_info.pro_team_arr[i].depart_name);
					}
				}
			}
		},
		handleClick(type, position_id) {
			const { query = {} } = this.$route;
			RankModal.popup({
				title: "晋升履历",
				position_id,
				staff_id: query.staff_id
			}).then();
		}
	}
};
</script>

<style lang="scss" >
.v-hr-details-promote {
    ._title {
        margin-top: 40px;
        margin-bottom: 35px;
    }
    ._con {
        padding-left: 10px;
    }
    ._empty {
        margin-top: 180px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .ivu-select-selection {
        display: block;
        box-sizing: border-box;
        outline: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdee2;
        transition: all 0.2s ease-in-out;
    }
}
</style>
