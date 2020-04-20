<template>
	<div class="v-hr-details-upgrade" >
		<div class="g-m-b-20">
			<div class="g-flex g-flex-ac">
				<oa-title title="晋升信息" />
			</div>
			<div class="g-m-l-10">
				<oa-item label="目前职位">
					<span>
						{{ dataInfo.pro_info.position_name }}
					</span>
				</oa-item>
				<oa-item label="晋升体系">
					<span class="g-operation" @click="()=>handleClick(1,dataInfo.pro_info.position_id)">
						点击查看
					</span>
				</oa-item>
				<oa-item label="晋升履历">
					<span class="g-operation" @click="()=>handleClick(2,dataInfo.pro_info.position_id)">
						点击查看
					</span>
				</oa-item>
			</div>
			<div v-if="dataInfo.is_empty===false" >
				<div class="g-flex g-flex-ac g-m-t-15">
					<oa-title title="本次晋升" />
					<div v-if="$route.query.from !== 'avatar'">
						<div v-if="status===1" class="g-operation g-m-l-10" @click="handleEdit">编辑</div>
						<div v-if="status===2">
							<span class="g-operation g-m-l-10" @click="handleSave">保存</span>
							<span class="g-operation g-m-l-10" @click="handleCancle">取消</span>
						</div>
					</div>
				</div>
				<div class="g-flex g-m-l-10">
					<oa-item label="目前职位">
						<span>
							{{ dataInfo.this_pro_info.position_name }}
						</span>
					</oa-item>
					<oa-item label="待晋升职位">
						<span>
							{{ dataInfo.this_pro_info.promotion_position_name }}
						</span>
					</oa-item>
				</div>
				<div class="g-m-l-10">
					<oa-item label="考核时间">
						{{ dataInfo.this_pro_info.cycle_month }}
					</oa-item>
					<oa-item label="生效时间">
						{{ dataInfo.this_pro_info.effect_time }}
					</oa-item>
					<oa-item label="晋升文件">
						<span v-if="dataInfo.this_pro_info.cycle_attach_doc.length===0">暂无下载</span>
						<span v-else class="g-operation" @click="handleClickDown">
							点击下载
						</span>
					</oa-item>
					<oa-item v-if="status===1" label="晋升团队" >
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
					<oa-item v-if="status===2" label="晋升团队" >
						<oa-ranks 
							:ranges-arr="dataInfo.this_pro_info.pro_team_arr" 
							:handle-add="handleAdd" 
							class="g-m-l-10 "
						/>
					</oa-item>
				</div>
				<div >
					<div class="_rule g-fs-14 g-m-t-20">固定规则</div>
					<oa-regular-table :regular-rule="dataInfo.regular_rule" :status="status" style="marginLeft:12px"/>
				</div>
				<div>
					<div class="_rule g-fs-14 g-m-t-20">自定义规则</div>
					<oa-manmade-table :manmade-rule="dataInfo.manmade_rule" :status="status" style="marginLeft:12px"/>
				</div>
			</div>
			<div v-else>
				<oa-title title="本次晋升" />
				<div class="g-flex g-flex-cc g-flex-ac">
					<div class="_empty">
						<img :src="nodataUrl" class="_img g-m-b-20" alt >
						<div>暂无晋升信息</div>
					</div>
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
	Tooltip,
	Table
} from "iview";
// utils
import { dataValidity, unCode } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { log } from 'util';
import { OSS_EMPTY } from '@constants/constants';
import Ranks from "./ranks";
import Title from "../../../_common/title";
import DetailItem from "../detail-item";
import { PromotionModal } from "./popup/promotion";
import { RankModal } from "./popup/rank";
import { AuditModal } from "./popup/audit";
import { DownModal } from "./popup/down";
import { AddProTeamModal } from "./popup/pro-team";
import ManmadeTable from "./manmade_rule/table";
import RegularTable from "./regular_rule/table";

export default {
	name: "v-hr-details-upgrade",
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
		"i-tooltip": Tooltip,
		"oa-manmade-table": ManmadeTable,
		"oa-regular-table": RegularTable,
		"oa-ranks": Ranks,
	},
	data() {
		return {
			status: 1,
			pro_team: [],
			dataInfo: {
				is_empty: false,
				pro_info: {},
				manmade_rule: [],
				regular_rule: [],
				this_pro_info: {
					pro_team_arr: [],
					cycle_attach_doc: []
				},
			},
			nodataUrl: OSS_EMPTY
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.loadData();
			}
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleClickDown() {
			DownModal.popup({
				cycle_attach_doc: this.dataInfo.this_pro_info.cycle_attach_doc
			}).then((res) => {
				
			});
		},
		handleAdd() {
			const { query = {} } = this.$route;
			AddProTeamModal.popup({
				staff_id: unCode(query.staff_id),
				proTeamStaffArr: this.dataInfo.this_pro_info.pro_team_arr.filter(item => item.staff_id),
				proTeamDepartId: this.dataInfo.this_pro_info.pro_team_arr.filter(item => item.staff_id === undefined)
			}).then((res) => {
				let newProTeamArr = res.reduce(function (a, b) { return a.concat(b); });
				this.dataInfo.this_pro_info.pro_team_arr = [];
				this.dataInfo.this_pro_info.pro_team_arr = _.uniqWith(newProTeamArr, _.isEqual);
				this.handleTeam();
			});
		},
		loadData() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_PRO_INFO_GET,
				type: "GET",
				param: {
					staff_id: unCode(query.staff_id),
				},
				loading: false
			}).then(res => {
				this.dataInfo = res.data;
				this.dataInfo.master_range = [
					{ 
						sort_id: 1,
						position_name: '3'
					}
				];
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
		handleEdit() {
			this.status = 2;
		},
		handleCancle() {
			this.status = 1;
			this.loadData();
		},
		handleSave() {
			this.$request({
				url: API_ROOT._HR_SUMMARY_STAFF_ADD_RULE_POST,
				type: "POST",
				param: {
					...this.dataInfo,
					record_id: this.dataInfo.this_pro_info.record_id
				},
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadData();
			}).catch(error => {
				this.$Message.error(error.msg);
				this.loadData();
			});
			this.status = 1;
		},
		handleClick(type, position_id) {
			const { query = {} } = this.$route;
			switch (type) {
				case 1:
					PromotionModal.popup(
						{ 
							title: "晋升体系", 
							staff_id: unCode(query.staff_id)
						}
					).then();
					break;
				case 2:
					RankModal.popup(
						{ title: "晋升履历", 
							position_id, 
							staff_id: unCode(query.staff_id)
						 }
					).then();
					break;
				default:
					break;
			}
		},
	}
};
</script>

<style lang="scss" >
.v-hr-details-upgrade {
	._empty {
		margin-top: 40px;
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
	transition: all .2s ease-in-out;
	}
	._rule{
		color: #4B4F57;
		line-height: 16px;
		height: 16px;
		padding-left: 10px;
	}
}
</style>
