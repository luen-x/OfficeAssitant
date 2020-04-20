<template>
	<div class="v-hr-contract">
		<div class="g-flex g-flex-ac">
			<oa-title title="合同信息"/>
			<span
				v-if="$auth['213'] && $route.query.from !== 'avatar'&& queryStaffStatus !=='4'"
				class="g-operation g-m-lr-10"
				style="fontSize:14px !important"
				@click="handleAddBtn(staff_name)"
			>
				添加
			</span>
		</div>
		<div v-for="(item,index) in list" :key="item.contract_id">
			<div class="g-flex g-jc-sb _border">
				<div class="g-flex g-flex-ac">
					<div class="g-fs-16 _color">合同{{ index+1 }}</div>
					<div class="g-m-l-10">
						<span v-if="item.status==0" class="_effect">待生效</span>
						<span v-if="item.status==1" class="_effect">生效中</span>
						<span v-if="item.status==2" class="g-c-blue-mid">已失效</span>
					</div>
				</div>
				<div class="g-flex g-flex-ac g-m-tb-10">
					<i-button
						v-if="item.status==1 && $auth['214']"
						class="g-c-black-light _cursor"
						@click="handleTip(item.contract_id)"
					>
						合同解除
					</i-button>
					<i
						class="iconfont icon-download1 g-c-blue-mid g-fs-16 g-m-l-20 _cursor"
						@click="handleBtn(item.img_url)"
					/>
				</div>
			</div>
			<div class="g-flex g-pd-lr-10 g-pd-tb-10">
				<div class="g-flex g-fd-c">
					<oa-item label="员工姓名">{{ item.staff_name }}</oa-item>
					<oa-item label="合同到期日">{{ item.contract_indate }}</oa-item>
					<oa-item label="社保缴纳公司">{{ item.security_company_name }}</oa-item>
				</div>
				<div :key="index" class="g-flex g-fd-c">
					<oa-item label="签订时间">{{ item.sign_time }}</oa-item>
					<oa-item label="合同公司">{{ item.contract_company_name }}</oa-item>
					<oa-item
						:style="item.img_url.length?'marginTop:10px':''"
						label="图片"
					>
						<vc-imgs-picker v-model="item.img_url" :disabled="true"/>
					</oa-item>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ImgsPicker } from "wya-vc";
import {
	Select,
	Option,
	Form,
	FormItem,
	DatePicker,
	Col,
	Row,
	Button
} from "iview";
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment, getItem, unCode } from "@utils/utils";
import downloadFile from '@utils/download';
import DetailItem from "../detail-item";
import Title from "../../../_common/title";
import { AddContract } from "./popup/add-contract";
import { TipModal } from "./popup/tip";

export default {
	name: "hr-contract",
	components: {
		"oa-item": DetailItem,
		"vc-imgs-picker": ImgsPicker,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-button": Button,
		"oa-title": Title
	},
	props: {
		label: String,
		name: String
	},
	data() {
		const { query } = this.$route;
		return {
			status: false,
			staff_name: "",
			queryStaffStatus: query.staff_status,
			list: []
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.loadEntryData();
			}
		}
	},
	mounted() {
		this.loadEntryData();
	},

	methods: {
		loadEntryData() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_CONTRACT_LIST_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id)
				},
				loading: false
			}).then(res => {
				this.staff_name = res.data.staff_name;
				this.list = res.data.list;
			}).catch(err => {});
		},
		handleBtn(arr) {
			arr.forEach(ele => {
				downloadFile({ fileName: ele });
				
			});
		},
		handleAddBtn(staff_name) {
			AddContract.popup({
				staff_id: unCode(this.$route.query.staff_id),
				staff_name,
			}).then(res => {
				this.loadEntryData();
			});
		},
		handleTip(id) {
			TipModal.popup({ contract_id: id }).then(res => {
				this.loadEntryData();
			});
		}
	}
};
</script>

<style lang="scss">
.v-hr-contract {
	._effect {
		color: #4fc43d;
	}
	._color {
		color: #000;
		margin-left: 14px;
	}
	._border {
		border-bottom: 1px solid #e7e7e7;
	}
	._cursor {
		cursor: pointer;
	}
    
}
</style>


