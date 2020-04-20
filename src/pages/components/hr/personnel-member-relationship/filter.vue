<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c js-filter">
			<div>
				<i-input
					v-model="query.search"
					:maxlength="15"
					style="width: 220px;"
					clearable
					class="g-m-r-5"
					placeholder="请输入员工姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>
				<i-cascader
					:data="departArr"
					v-model="query.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					clearable
					transfer
					trigger="click"
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleChange"/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch">
					搜索
				</i-button>
			</div>
			<div>
				<vc-debounce-click
					v-if="$auth['1235']"
					class="g-m-l-5 g-red-btn-line"
					@click="handleAdd"
				>
					新增师傅
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>

import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem, initTreeData } from '@utils/utils';
import { services, staffByMutiTerm } from '@stores/services/hr';
import { Button, Cascader, Input } from 'iview';
import { AddModal } from './popup/add';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			departArr: [],
			query: {
				...query,
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false
		};
	},
	mounted() {
		this.loadDepart(this.$global.staff.depart_id);
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		loadDepart(depart_id) {
			this.$request({
				url: "_HR_EMPLOYEE_CI_DEPART_SON_GET",
				type: "GET",
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.departArr = initTreeData(
					res.data,
					"depart_id",
					"depart_name"
				);
			}).catch(err => {});
		},
		// 选中部门发生变化时
		handleChange(value, selected) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/personnel/member/relationship',
				{
					...this.query,
					depart_id: this.query.depart_id.length ? this.query.depart_id[this.query.depart_id.length - 1] : '',
				}
			));
			this.$store.commit('HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 新增员工补贴
		handleAdd() {
			AddModal.popup({
				data: {
					action: 'add'
				}
			}).then(res => {
			}).catch(() => {});
		}
	}
};

</script>

<style lang="scss" >
.ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
		height:32px !important;
	}
</style>
