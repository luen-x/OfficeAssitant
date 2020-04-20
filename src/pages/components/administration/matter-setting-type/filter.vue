<template>
	<div>
		<div class="g-flex g-ai-c g-jc-sb">
			<div>
				<i-input
					v-model="form.event_type_name" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					placeholder="请填写事项类型" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="form.staff_search" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					placeholder="请填写负责人姓名或手机号" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					v-model="form.depart_id"
					:data="firstDepart"
					:change-on-select="true"
					placeholder="请选择负责部门"
					clearable
					trigger="click"
					style="width: 220px" 
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
				<i-button 
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
			<span v-if="$auth['799']" class="g-red-btn-line" @click="handleAdd">新增类型</span>
		</div>
	</div>
</template>

<script>
import { Input, Button, Cascader } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/administration';
import { TypeModal } from './popup/modal';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
	},
	mixins: [services.firstDepart()],
	data() {
		const { query = {} } = this.$route;
		return {
			form: {
				...query,
				event_type_name: (query.event_type_name),
				staff_search: (query.staff_search),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
			},
			show: false
		};
	},
	methods: {
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartChange(value, selected) {

			if (value.length === 0) {
				this.form.depart_id = [];
			} else {
				this.form.depart_id = value;
			}
			this.handleSearch();
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/administration/matter/setting/type', 
				{ 
					...this.form, 
					depart_id: this.form.depart_id.length ? this.form.depart_id : null
				}
			));
			this.$store.commit('ADMINISTRATION_MATTER_SETTING_TYPE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			TypeModal.popup({
				type: 1
			}).then(res => {

			}).catch(err => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
