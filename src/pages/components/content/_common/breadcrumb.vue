<template>
	<div class="v-content-breadcrumb">
		<i-breadcrumb>
			<span class="_back" @click="goBack">返回</span>
			<span style="margin-left:10px">
				{{ module_name }}
			</span>
			<i-breadcrumb-item 
				v-for="item in config" 
				:key="item.path" 
				:to="item.path"
			>
				/{{ item.name }}
			</i-breadcrumb-item>
		</i-breadcrumb>
	</div>
</template>
<script>
import { Breadcrumb, BreadcrumbItem } from "iview";

export default {
	name: 'oa-bread-crumb',
	components: {
		"i-breadcrumb": Breadcrumb,
		"i-breadcrumb-item": BreadcrumbItem
	},
	props: {
		config: Array,
		module_name: String
	},
	mounted() {
	},

	methods: {
		to(path) {
			this.$router.push(path);

		},
		goBack() {
			this.$router.go(-1);
		}
	},
};
</script>
<style lang="scss">
.v-content-breadcrumb {
    border-bottom: 1px #e6e6e6 solid;
	height: 45px;
	line-height: 45px;
    margin-right: -20px;
    padding-left: 20px;

    ._back {
        cursor: pointer;
		display: inline-block;
		height: 16px;
        line-height: 16px;
        padding: 0 10px;
		border-right: 1px solid #e6e6e6;
    }
}
</style>


