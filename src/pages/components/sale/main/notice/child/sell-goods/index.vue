<template>
	<div class="v-sale-notice-sell-goods">
		<div v-for="(item,i) in list" :key="i" class="_sell-title g-c-black3 g-fl">
			<div class="__border g-bg-red-dark"/>
			<span>{{ item.category_name }}</span>
			<ul class="_sell-body g-m-b-10">
				<li v-for="(tep,x) in item.product" :key="x" @click="handleCase(tep.product_id)">
					<span>{{ tep.product_name }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import API from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		return {
			list: '',
		};
	},
	created() {
		this.loadingData();
	},
	methods: {
		handleCase(productId) {
			this.$router.push(getHashUrl(
				'/sale/full/goods',
				{
					...this.$route.query,
					product_id: productId,
					status: 6,
					flags: 1,
				}
			));
		},
		loadingData() {
			this.$request({
				url: API._SALE_MAIN_GET_SALE_CATEGORY_GET,
				type: "get",
				loading: false,
				param: {
					material_type: 3,
				}
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
	}
};
</script>

<style scoped lang="scss">
    .v-sale-notice-sell-goods {
        margin: 0 20px 20px 20px;
        text-align: left;
        max-height: 250px;
		overflow: hidden;
        padding-right: 17px;
        ._sell-title {
            font-size: 14px;
            margin-bottom: 10px;
            width: 100%;
            .__border {
                display: inline-block;
                width: 2px;
                height: 14px;
                margin-right: 9px;
                position: relative;
                bottom: -1px;
            }
        }
        ._sell-title {
            width: 100%;
            li {
                float: left;
                min-width: 86px;
                height: 34px;
                line-height: 34px;
                margin: 10px 10px 0 0;
                color: #4b4f57;
                background: #f5f5f6;
                border-radius: 3px;
                cursor: pointer;
                span {
                    margin: 0 20px;
                }
            }
        }
    }
    .v-sale-notice-sell-goods:hover {
        overflow-y: scroll;
        padding-right: 0px;
    }
</style>
