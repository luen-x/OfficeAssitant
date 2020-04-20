<template>
	<div class="v-sc-product-drop-down">
		<div
			v-if="complete_names.length === 0"
			class="_drop-down"
		>
			{{ progress }}
		</div>

		<div v-else>
			<i-drop-down placement="right" transfer>
				<div class="_drop-down">{{ progress }}</div>

				<i-drop-down-menu slot="list">
					<i-drop-down-item
						v-for="(item,index) in column"
						:key="index"
					>
						{{ item }}
					</i-drop-down-item>
				</i-drop-down-menu>
			</i-drop-down>
		</div>
	</div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem } from "iview";

export default {
	name: "content-material-drop-down",
	components: {
		"i-drop-down": Dropdown,
		"i-drop-down-menu": DropdownMenu,
		"i-drop-down-item": DropdownItem
	},
	props: {
		progress: String,
		complete_names: Array
	},
	data() {
		return {
			column: []
		};
	},

	mounted() {
		this.column = [...this.complete_names];

		this.column.length != 0 && this.column.unshift("已完成步骤：");
	}
};
</script>

<style lang="scss">
.v-sc-product-drop-down {
    ._drop-down {
        color: #2397f9;
        margin-right: 10px;
    }

    .ivu-select-dropdown {
        max-height: 235px;
        overflow: auto;
        padding-top: 20px;
        padding-bottom: 20px;
    }

	.ivu-dropdown-item{
		cursor: auto;
	}
}
</style>