<template>
	<div class="c-sc-detail-info-item">
		<span class="_label">{{ label }}</span>
		<div class="_content">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: "sc-detail-item",
	components: {
	},
	props: {
		label: String
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.c-sc-detail-info-item {
    display: inline-block;
    border-bottom: 1px solid #e7e7e7;
    width: 350px;
    padding-bottom: 11px;
    margin-right: 50px;

    ._label {
      display: inline-block;
      color: #818794;
      width: 100px;
      position: relative;
    }
    ._content {
      display: inline-block;
      color: #000000;
      width: 240px;
    }
}
</style>


