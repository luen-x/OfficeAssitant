<template>
	<set-title title="PK现场">
		<div style="width: 100%; height: 100%">
			<oa-pk/>
		</div>
	</set-title>
</template>
<script>
import PK from '@components/sale/full-screen/sale-pk-scene/content';

export default {
	components: {
		'oa-pk': PK
	},
	data() {
		return { };
	},
	mounted() {
	}
};
</script>
