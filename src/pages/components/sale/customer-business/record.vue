<template>
	<div class="g-flex _piece">
		<div v-for="(item,i) in dataSource" :key="i">
			<div class="g-fs-24 g-c-black1 _number">{{ item.value }}</div>
			<div class="g-c-black4 g-fs-12">
				{{ item.label }}
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	components: {
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {

		};
	},
};
</script>

<style scoped lang="scss">
    ._piece {
        margin-top: 20px;
        background: #f5f5f6;
        height: 130px;
        padding: 20px 0;
        & > div {
            flex: 1;
            border-right: 1px solid #d4d7db;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: center;
            & > div:last-child {
                font-size: 14px;
                color: #818794;
            }
        }
        & > div:last-child {
            border: none;
        }
    }
    ._number {
        padding-top: 10px;
    }
</style>
