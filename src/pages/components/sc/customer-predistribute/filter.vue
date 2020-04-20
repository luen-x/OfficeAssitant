<template>
	<div>
		<div>
			<i-input
				v-model="search"
				:maxlength="50"
				clearable
				placeholder="请输入客户公司名称或手机号进行搜索" 
				style="width: 300px; height: 32px;" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''),
			show: false
		};
	},
	watch: {
		'$route.query.search': function (value) {
			this.search = value;
			this.handleSearch();
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sc/customer/predistribute', 
				{ 
					...this.$route.query, 
					search: this.search,
					fixPosition: true,
				}
			));

			this.$store.commit('SC_CUSTOMER_PREDISTRIBUTE_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>