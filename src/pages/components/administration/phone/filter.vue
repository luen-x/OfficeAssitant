<template>
	<div>
		<div>
			<i-input
				v-model="query.search" 
				placeholder="请输入姓名/手机/工号" 
				style="width: 320px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<div class="g-fr">
				<vc-debounce-click
					v-if="$auth['1025']"
					class="g-red-btn-line g-m-r-5"
					@click="handleAdd"
				>
					新增
				</vc-debounce-click>
				<i-dropdown v-if="$auth[1026]||$auth[1027]" @on-click="handleClick">
					<span 
						class="g-red-btn-line"
					>
						更多
						<i class="icon iconfont icon-triangle-down g-fs-12"/>
					</span>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth[1026]" name="1">导入</i-dropdown-item>
						<i-dropdown-item v-if="$auth[1027]" name="2">导出</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
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
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-cascader
					:data="departAll"
					v-model="query.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"/>

				<i-select
					v-model="query.position_id"
					transfer
					clearable
					placeholder="请选择职位"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>
				<i-input
					v-model="query.seat_number" 
					placeholder="请输入坐席号" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="query.pstn_number" 
					placeholder="请输入外线号码" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="query.tel" 
					placeholder="请输入座机号" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import lodash from 'lodash';
import { services } from '@stores/services/administration';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { inputPModal } from './popup/input';
import { AuditModal } from './popup/audit';
import { TipModal } from './popup/tip';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-cascader': Cascader,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...query,
				pstn_number: query.pstn_number,
				seat_number: query.seat_number,
				tel: query.tel,
				search: query.search,
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			positionList: [],
			show: false
		};
	},
	mounted() {
		if (this.query.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id === this.query.depart_id[0])[0].positions;
			}).catch((error) => {});
		}
	},
	methods: {
		handleDepartChange(value, selected) {
			this.handleSearch();
			if (value.length === 0) {
				this.query.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
			
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/administration/phone', 
				{ 
					...this.$route.query, 
					...this.query,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null,
				}
			));
			this.$store.commit('ADMINISTRATION_PHONE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleClick(name) {
			switch (name) {
				case '1':
					this.handleInputFile(); 
					break;
				case '2':
					this.handleExport();
					break;
				default:
					break;
			}
		},
		handleInputFile() {
			inputPModal.popup({
				type: this.$route.query.type || "1"
			}).then(res => {}).catch(err => {});
		},
		handleAdd() {
			AuditModal.popup({
				addType: true
			}).then(res => {}).catch(err => {});
		},
		handleExport() {
			window.open(getHashUrl(API_ROOT.ADMINISTRATION_PHONE_LIST_GET, {
				...this.$route.query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
