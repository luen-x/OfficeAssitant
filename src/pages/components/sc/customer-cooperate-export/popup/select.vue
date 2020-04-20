<template>
	<ul class="v-sc-customer-select-modal  g-flex g-fw-w">
		<li
			v-for="(item,index) in date"
			:key="index"
			@click="handleChange(item)"
		>
			<p :class="item.show ? '_red' : ''" class="g-pointer">
				<span>{{ item.name }}</span>

				<span v-if="item.show">{{ item.number }}</span>
			</p>
		</li>
	</ul>
</template>

<script>
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-export-select",

	props: {
		date: Array,
		arr: Array
	},

	data() {
		return {};
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleChange(item) {
			let number = -1;
            
			if (item.show) {
				item.show = false;
				number = item.number;
				item.number = 0;
			} else {
				item.show = true;
				item.number = this.arr.length + 1;
			}

			this.$emit("event", { item, number });
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-select-modal {
    li {
        width: 158px;
        margin-bottom: 20px;
        list-style-type: none;
        margin-right: 2px;

        p {
            width: 140px;
            height: 30px;
            line-height: 30px;
            background: #f0f4fd;
            padding-left: 16px;
            border-radius: 4px;
        }

        ._red {
            background: #e84854;
            color: #ffffff;
            display: flex;
            padding: 0 5px;
            justify-content: space-between;

            span:nth-of-type(2) {
                display: inline-block;
                width: 16px;
                height: 16px;
                line-height: 16px;
                color: #e84854;
                background: #ffffff;
                border-radius: 8px;
                text-align: center;
                margin-top: 7px;
            }
        }
    }
}
</style>