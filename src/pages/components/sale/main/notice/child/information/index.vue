<template>
	<div class="page-information">
		<ul v-if="newList.length>0">
			<li
				v-for="(item,i) in newList"
				v-if="i<5"
				:key="i"
				class="_newlist"
				@click="handleDetail(item)"
			>
				<span class="g-c-blue-light g-m-r-5 _circle"/>
				<span class="_inline">{{ item.title }}</span>
				<span class="g-fr">{{ item.create_date }}</span>
			</li>
		</ul>
		<div
			v-if="newList.length>0"
			class="page-information-bottom g-operation"
			@click="handleMore"
		>查看更多</div>
		<div v-else style="margin-top:40px">
			<img
				:src="OSS_ACTIVE"
				alt
			>
			<div class="m-g-t-20 _title">暂无资讯信息</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import API from '@stores/apis/root';
import { OSS_ACTIVE } from '@constants/constants';

export default {
	components: {

	},
	data() {
		return {
			newList: '',
			OSS_ACTIVE
		};
	},
	created() {
		this.loadList();
	},
	methods: {
		handleMore() {
			this.$router.push({
				path: '/sale/full/information',
				query: {
					is_control_role: 1,
					status: 3
				}
			});
		},
		handleDetail(val) {
			this.$router.push({ path: "/sale/full/preview",
			 query: { information_id: val.information_id, keyword: val.keyword, status: 5 }
			});
		},
		loadList() {
			this.$request({
				url: API._SALE_MAIN_MATERIAL_NEW_LIST_GET,
				type: "get",
				loading: false,
				param: {
					material_type: 2,
				}
			}).then(res => {
				this.newList = res.data;
			});
		},

	}
};
</script>

<style scoped lang="scss">
    .page-information {
		._circle{
			display: inline-block;
			vertical-align: middle;
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background: #2e9dfa;
		}
		._newlist:hover{
            color:#2296f9 ;
		}
		._inline{
			display: inline-block;
			vertical-align: middle;
		}
        ul {
            margin: 0 20px 20px 20px;
            list-style-type: none;
            li {
                text-align: left;
                height: 40px;
                // width: 850px;
                padding: 0 20px;
                line-height: 40px;
                cursor: pointer;
            }
            li:nth-child(2n + 1) {
                background: #f8f8f8;
            }
        }
        ._title {
            font-size: 16px;
            color: #bbb;
        }
		.page-information-bottom{
			width: 100%;
			position: absolute;
			bottom: 20px;
		}
    }
</style>
