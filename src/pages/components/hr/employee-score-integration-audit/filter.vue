<template>
	<div class="g-m-t-20">
		<div>
			<i-input
				v-model="query.search"
				placeholder="请输入员工姓名/手机"
				style="width: 300px"
				clearable
				@on-enter="handleSearch"
				@on-change="handleSearch"
			/>
			<i-button
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle"
			>
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
			class="js-filter"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-cascader
					v-model="query.depart_id"
					:data="stairArr"
					change-on-select
					placeholder="请选择服务人部门"
					clearable
					style="width: 220px"
					@on-change="handleChange"
				/>
				<i-select
					v-model="position_id"
					placeholder="请选择职位"
					style="width: 220px"
					clearable
					class="g-m-l-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item of positionArr"
						:key="item.position_id"
						:value="item.position_id">{{ item.position_name }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, initTreeData } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...query,
				depart_id: query.depart_id && query.depart_id.split(',').map(Number)
			},
			position_id: null,
			show: false,
			stairArr: [],
			positionArr: []
		};
	},
	mounted() {
		const { query = {} } = this.$route;
		this.loadStairDepart();
		query.depart_id && this.loadPosition(query.depart_id);
	},
	methods: {
		handleSearch: debounce(function (e) {
			this.$router.replace(getHashUrl(
				'/hr/employee/score/integration/audit',
				{
					...this.query,
					position_id: this.position_id,
					depart_id: this.query.depart_id && this.query.depart_id.join()
				}
			));
			this.$store.commit('HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(depart_id) {
			this.positionArr = [];
			this.position_id = null;
			this.query.depart_id = depart_id;
			depart_id[0] && this.loadPosition(depart_id[0]);
			this.handleSearch();
		},
		loadStairDepart() {
			this.$request({
				url: '_HR_DEPART_ALL_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.stairArr = initTreeData(res.data, 'depart_id', 'depart_name');
			}).catch(err => {

			});
		},
		loadPosition(depart_id) {
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data[0].positions;
			}).catch(err => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
