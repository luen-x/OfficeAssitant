<template>
	<div class="g-flex-ac g-jc-sb">
		<div>
			<i-input
				v-model="search" 
				placeholder="请输入职位名称搜索" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div 
			v-if="$auth[275]"
			class="g-red-btn-line g-fr" 
			@click="handleAddPosition"
		>
			新增职位
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PositionModal } from './popup/edit-position';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''),
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (event) {
			
			this.$router.replace(getHashUrl(
				'/hr/system/position', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					search: this.search,
				}
			));
			this.$store.commit('HR_POSITION_LIST_INIT');
		}, 300),
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleAddPosition() {
			const { query } = this.$route;
			let tabs = this.$store.state.hrPosition.tabs || [];
			let departId = String(query.depart_id || (tabs[0] || {}).depart_id);

			PositionModal.popup({
				title: '新增职位',
				type: 'add',
				info: {
					depart_id: departId
				}
			}).then((res) => {

			}).catch((res) => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
