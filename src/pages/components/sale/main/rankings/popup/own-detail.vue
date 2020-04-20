<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class-name="v-sale-main-rankings-own-detail"
		width="800"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-flex g-jc-sb">
			<div v-if="data.type==2" class="g-tc _text-center">本部门员工业绩详情</div>
			<div v-if="data.type==1" class="g-tc _text-center">下级员工业绩详情</div>
			<div v-if="data.type==3" class="g-tc _text-center">所有员工业绩详情</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div class="g-tc" style="margin-bottom: 16px;">
			<i-date-picker
				:value="value3"
				type="month"
				placeholder="选择日期"
				style="width: 220px;margin-right: 8px;"
				@on-change="handleChange"
			/>
			<vc-debounce-click :tag="Button" type="primary" @click="getData()">搜索</vc-debounce-click>
		</div>
		<div
			:style="list.length > 8 ? 'padding-right: 20px' : ''"
			class="g-flex _heard g-c-black1 g-fs-12"
		>
			<div class="g-col">排名</div>
			<div class="g-col">员工姓名</div>
			<div class="g-col">部门</div>
			<div class="g-col">业绩</div>
			<div class="g-col">距上1名</div>
			<div class="g-col">多下1名</div>
			<div class="g-col">距第1名</div>
			<div class="g-col">距第20名</div>
		</div>
		<div class="_body">
			<div
				v-for="(item,i) in list"
				:key="i"
				class="g-flex __table g-c-black2">
				<div class="g-col">{{ item.sort_count }}</div>
				<i-tooltip
					v-if="item.staff_name.length>5"
					:content="item.staff_name"
					class="g-col"
				>
					<div class="_staff-name">{{ item.staff_name }}</div>
				</i-tooltip>
				<div v-else class="g-col">{{ item.staff_name }}</div>
				<div class="g-col">{{ item.depart_name }}</div>
				<div class="g-col">{{ item.current_money }}</div>
				<div class="g-col">{{ item.distance_less }}</div>
				<div class="g-col">{{ item.distance_more }}</div>
				<div class="g-col">{{ item.distance_first }}</div>
				<div class="g-col">{{ item.distance_twenty }}</div>
			</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, DatePicker, Tooltip } from 'iview';
import API from '@stores/apis/root';
import moment from 'moment';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		"i-button": Button,
		'i-tooltip': Tooltip

	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			open: false,
			list: '',
			value3: ''
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.getData();
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		// 时间选择限制
		MonthDisable(date) {
			return moment(date).isAfter(moment().format('YYYY-MM'));
		},
		getData() {
			this.$request({
				url: API._SALE_MAIN_ACHIEVEMENT_ORDER_TARGET_GET,
				type: "get",
				param: {
					month: this.value3
				}
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		handleNull() {
			this.visible = false;
		},
		// 日历选择
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			// this.getData();
			this.open = false;
		},
		handleClear() {
			this.open = false;
		},
		handleDateClose() {
			this.open = false;
		},
		handleDateOk() {
			this.open = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
export const ownDetail = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-own-detail{
	._heard {
		height: 40px;
		line-height: 40px;
		background: #f0f4fc;
		.g-col {
			padding: 0 10px;
		}
		& > div {
			text-align: left;
		}
	}
    ._body {
        max-height: 300px;
        overflow-y: auto;
		.__table {
            height: 38px;
            line-height: 38px;
            .g-col {
                padding: 0 10px;
            }
            & > div {
                text-align: left;
            }
        }
        .__table:nth-child(2n) {
            background: #fafafa;
        }
    }
    ._text-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    ._staff-name {
		cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 70px;
    }
}
</style>
