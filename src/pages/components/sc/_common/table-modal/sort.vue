<template>
	<div class="v-sc-cooperate-sort-setting">
		<div class="g-c-black">请选择排序方式：</div>

		<ul class="g-flex g-flex-ac g-fw-w g-m-t-20">
			<li 
				v-for="(item,index) in sort" 
				:key="index" 
				:class="item.is_checked === 1 ? '_select' : ''"
				class="g-pointer g-m-b-15"
				@click="handleChangeSelect(index)"
			>
				{{ item.value }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "sc-sort",

	props: {
		sortData: Array
	},
    
	data() {
		return {
			sort: []
		};
	},
    
	mounted() {
		this.sort = JSON.parse(JSON.stringify(this.sortData));
	},
    
	methods: {
		handleChangeSelect(v) {
			this.sort.forEach((item, index) => {
				item.is_checked = 0;
                
				if (v === index) {
					item.is_checked = (Number(item.is_checked) === 1 ? 0 : 1);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-cooperate-sort-setting{
    ul{
        li{
            list-style: none;
            width: 114px;
            height: 32px;
            line-height:  32px;
            background: #F0F4FC;
            margin-right: 35px;
            text-align: center;
            border-radius: 4px;
        }

        ._select{
            background: #E74854;
            color: #ffffff;
        }
    }
}
</style>