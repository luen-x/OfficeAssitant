<template>
	<div class="v-hr-em-data-basic">
		<div class="_count">
			<div class="_count-title g-flex g-ai-c g-pd-l-15 g-bg-gray-mid">
				<i-cascader
					:data="departAll"
					v-model="depart_id"
					:change-on-select="true"
					clearable
					placeholder="请选择部门"
					trigger="click"
					style="width: 220px;"
					@on-change="handleChange"/>

				<vc-debounce-click
					class="g-red-btn-small g-m-l-10"
					@click="loadData">
					搜索
				</vc-debounce-click>
			</div>
			<div class="_count-content g-flex g-jc-sa">
				<div
					v-for="item in [1, 2, 3]"
					:key="item"
					class="_count-item g-flex g-fd-c g-jc-c g-ai-c">
					<span class="g-c-red-light g-fs-24 g-flex">
						{{ item === 1 ? in_count : '' }}
						{{ item === 2 ? current_entry : '' }}
						{{ item === 3 ? current_leave : '' }}
						<!-- {{ item === 4 ? current_birth : '' }} -->
						<div class="g-fs-14 g-c-black-mid g-lh-36 g-m-l-5">人</div>
					</span>
					<span class="_line g-bg-gray-dark g-m-t-10 g-m-b-15" />
					<span>
						{{ item === 1 ? '在职员工人数' : '' }}
						{{ item === 2 ? '本月入职员工人数' : '' }}
						{{ item === 3 ? '本月离职员工人数' : '' }}
						<!-- {{ item === 4 ? '本月生日员工人数' : '' }} -->
					</span>
				</div>

				<div v-if="number" class="_count-item g-flex g-fd-c g-jc-c g-ai-c">
					<span class="g-c-red-light g-fs-24 g-flex">
						{{ number.slice(0, 2) }}
						<div class="g-fs-14 g-c-black-mid g-lh-36 g-m-lr-5">万</div>
						{{ number.slice(2) }}
						<div class="g-fs-14 g-c-black-mid g-lh-36 g-m-l-5">元</div>
					</span>
					<span class="_line g-bg-gray-dark g-m-t-10 g-m-b-15" />
					<span>已发工资合计</span>
				</div>
			</div>
		</div>
		<div class="_distribute g-m-t-20 g-flex g-jc-sb">

			<div
				v-for="item in [1, 2, 3, 4]"
				:key="item"
				:class="[
					'_distribute-item',
					item === 1 ? '_distribute-sex' : '',
					item === 2 ? '_distribute-work_age' : '',
					item === 3 ? '_distribute-age' : '',
					item === 4 ? '_distribute-type' : ''
			]">
				<div class="_distribute-item-title g-pd-lr-15 g-bg-gray-mid">
					<span v-if="item === 1">性别分布</span>
					<span v-if="item === 2">工龄分布</span>
					<span v-if="item === 3">年龄分布</span>
					<span v-if="item === 4">员工类型分布</span>
				</div>
				<oa-echarts v-if="item === 1" :value="data1" :charts_id="item" />
				<oa-echarts v-if="item === 2" :value="data2" :charts_id="item" />
				<oa-echarts v-if="item === 3" :value="data3" :charts_id="item" />
				<oa-echarts v-if="item === 4" :value="data4" :charts_id="item" />
			</div>

		</div>
		<div class="_charts g-m-t-20">
			<div class="_charts-title g-pd-lr-15 g-bg-gray-mid">
				<span>籍贯统计图</span>
			</div>
			<oa-echarts :address-label="addressLabel" :value="data5" :charts_id="5" />
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { DebounceClick } from "wya-vc";
import { Button, Cascader, Select, Option } from "iview";
import echarts from './oa-charts.vue';

export default {
	name: "oa-tpl",
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		'oa-echarts': echarts,
	},
	mixins: [
		services.departAll()
	],
	data() {
		return {
			// close: true,
			timer: null,
			in_count: 0,
			current_entry: 0,
			current_leave: 0,
			current_birth: 0,
			number: "",
			depart_id: [],	// 选中部门
			// 性别分布
			data1: [
				{ value: 0, name: '男' },
				{ value: 0, name: '女' }
			],
			// 工龄分布
			data2: [
				{ value: 0, name: '三个月内' },
				{ value: 0, name: '1年' },
				{ value: 0, name: '1-3年' },
				{ value: 0, name: '3-5年' },
				{ value: 0, name: '5-10年' },
				{ value: 0, name: '10年以上' }
			],
			// 年龄分布
			data3: [
				{ value: 0, name: '00后' },
				{ value: 0, name: '90后' },
				{ value: 0, name: '80后' },
				{ value: 0, name: '70后' },
				{ value: 0, name: '60后' }
			],
			// 员工类型分布
			data4: [
				{ value: 0, name: '高中及以下' },
				{ value: 0, name: '专科' },
				{ value: 0, name: '本科' },
				{ value: 0, name: '硕士' },
				{ value: 0, name: '博士及以上' }
			],
			// 省份统计
			data5: [],
			addressLabel: []
		};
	},
	created() {
		// 初始化图表数据
		this.loadData();
	},
	mounted() {
	},
	methods: {
		loadData() {
			this.addressLabel = [];
			this.data5 = [];

			this.$request({
				url: API_ROOT.HR_EMPLOYEE_DATA_BASIC_GET,
				type: "GET",
				param: {
					depart_id: this.depart_id.length ? this.depart_id[this.depart_id.length - 1] : ''
				},
				loading: false
			}).then(res => {
				this.in_count = res.data.in_count;
				this.current_entry = res.data.current_entry;
				this.current_leave = res.data.current_leave;
				this.current_birth = res.data.current_birth;

				// 性别分布
				this.data1 = res.data.sex_num;

				// 工龄分布
				this.data2 = res.data.work_age;

				// 年龄分布
				this.data3 = res.data.age.reverse();

				// 员工类型分布
				this.data4 = res.data.education;

				// 省份统计
				this.data5 = res.data.data;
				this.addressLabel = res.data.label;
				this.$forceUpdate();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(val) {
			this.depart_id = val;
			this.loadData();
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-em-data-basic {
	min-width: 804px;
    ._count {
        height: 240px;
        box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        ._count-title {
            height: 50px;
        }
        ._count-content {
            height: 194px;
            ._count-item {
                ._line {
                    display: block;
                    width: 40px;
                    height: 2px;
                }
            }
        }
    }
    ._distribute {
        ._distribute-item {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
            ._distribute-item-title {
                height: 46px;
                line-height: 46px;
            }
        }
        ._distribute-sex {
			margin-right: 20px;
        }
    }
    ._charts {
        height: 400px;
        box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        ._charts-title {
            height: 46px;
            line-height: 46px;
        }
	}
}
// 三个一行
@media screen and (max-width: 1280px) {
	._distribute {
		flex-wrap: wrap;
		._distribute-item {
			flex: 1;
			min-width: 260px;
		}
		._distribute-sex {
			min-width: 240px;
		}
		._distribute-work_age {
			margin-right: 20px;
		}
		._distribute-type {
			margin-top: 20px;
			max-width: 334px;
		}
	}
}
// 四个一行
@media screen and (min-width: 1281px) {
	._distribute {
		._distribute-item {
			flex: 1;
			min-width: 260px;
		}
		._distribute-sex {
			min-width: 200px;
		}
		._distribute-age {
			min-width: 220px;
		}
		._distribute-work_age, ._distribute-age {
			margin-right: 20px;
		}
	}
}
</style>
