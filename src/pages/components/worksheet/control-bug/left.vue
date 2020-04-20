<template>
	<div class="v-worksheet-control-bug-left">
		<div class="_search">
			<i-input
				v-model="key" 
				placeholder="搜索" 
				style="width: 220px" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			>
				<i 
					slot="suffix" 
					class="iconfont icon-search g-pointer" 
					@click="handleSearch"
				/>
			</i-input>
		</div>
		<div class="_list g-m-t-10">
			<div 
				v-for="(item, index) in systemList" 
				:key="index"
				:class="item.active ? '__active' : ''"
				class="g-pd-10 g-pointer"
				@click="handleSelect(item)"
			>
				{{ item.system_name }}
			</div>
		</div>
	</div>
</template>
<script>
import lodash from 'lodash';
import { Input } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'v-worksheet-control-bug-left',
	components: {
		'i-input': Input,
	},
	data() {
		return {
			system_id: this.$route.query.system_id || 0,
			key: '',
			systemList: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		loadData() {
			this.$request({
				url: '_WORKSHEET_CONTROL_BUG_SYSTEM_GET',
				type: "GET",
				param: {
					search: this.key
				},
				loading: false
			}).then((res) => {
				res.data.unshift({
					system_name: '所有',
					system_id: 0,
					active: false
				});
				res.data.forEach(v => {
					if (v.system_id == this.system_id) {
						v.active = true;
					} else {
						v.active = false;
					}
				});
				this.systemList = res.data;
				this.$emit('handleIsRender', true);
			}).then((res) => {
				let arr = this.systemList.filter(v => v.system_id == +this.$route.query.system_id);
				if (!arr.length) {
					this.systemList.forEach(v => {
						v.system_id == 0 ? v.active = true : '';
					});
					this.handleSelect({ system_id: 0 });
				}
			}).catch((error) => {
			});
		},
		handleSearch: lodash.debounce(function (event) {
			this.loadData();
		}, 300),
		handleSelect(item) {
			this.system_id = item.system_id;
			this.systemList.forEach(v => {
				if (v.system_id == item.system_id) {
					v.active = true;
				} else {
					v.active = false;
				}
			});
			this.$router.replace(getHashUrl(
				'/worksheet/control/bug', 
				{ 
					...this.$route.query,
					system_id: item.system_id,
					fixPosition: true,
				}
			));
			this.$emit('handleClickItem', item.system_id);
		}
	}
};
</script>
<style lang="scss">
.v-worksheet-control-bug-left {
    ._search {
        .ivu-input {
            border-top: none;
            border-right: none;
            border-left: none;
            border-bottom: 1px solid #F2F2F2;
            border-radius: 0;
        }
        .ivu-input:hover {
            border-color: none;
        }
        .ivu-input:focus {
                border-color: #F2F2F2;
                outline: 0;
                -webkit-box-shadow: none;
                box-shadow: none;
        }
    }
    ._list {
        .__active {
            background-color: #F2F2F2;
            border-radius: 3px;
        }
    }
}
</style>