import { PModal } from "./popup/preview-image.vue";
import { PModalDetail } from "./popup/detail.vue";
import { PModalDelete } from "./popup/delete.vue";
import textInput from "./text-input.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: "分类名称",
					key: "category_name",
					minWidth: 220,
					render: (h, params) => {
						return h(textInput, {
							props: {
								data: params.row
							},
							style: {
								minWidth: '220px'
							}
						});
					}
				},
				{
					title: "创建时间",
					key: "create_time",
					minWidth: 120,
				},
				{
					title: "活动数量",
					key: "activity_num",
					minWidth: 110,
				},
				{
					title: "展示封面",
					key: "image",
					minWidth: 120,
					render: (h, params) => {
						return h("img", {
							style: {
								marginRight: "5px",
								height: "72px",
								width: '72px',
								marginTop: '10px',
								marginBottom: '10px',
								cursor: "pointer",
								borderWidth: '1px',
								borderStyle: 'solid',
								borderColor: '#d4d7db'
							},
							domProps: {
								src: params.row.image_url + '!4-4'
							},
							on: {
								click() {
									PModal.popup({
										data: params.row
									}).catch(() => {});
								}
							}
						});
					}
				},
				{
					title: "操作",
					key: "image",
					minWidth: 110,
					render: (h, params) => {
						return h(
							"div",
							{
								class: ['g-relative'],
								style: {
									marginRight: "5px"
								}
							},
							[
								h(
									"span",
									{
										class: ["g-c-blue-mid"],
										style: {
											paddingRight: "10px",
											cursor: "pointer"
										},
										on: {
											click() {
												PModalDetail.popup({
													category_id: params.row.category_id
												}).catch(() => {});
											}
										}
									},
									"查看"
								),
								h('i', {
									'class': ['g-bg-blue-mid', 'g-absolute'],
									style: {
										width: '1px',
										height: '12px',
										display: 'inline-block',
										marginTop: '4px',
									}
								}, ''),
								h(
									"span",
									{
										class: ["g-c-blue-mid"],
										style: {
											cursor: "pointer",
											paddingLeft: "10px"
										},
										on: {
											click() {
												PModalDelete.popup({
													data: params.row
												}).catch(() => {});
											}
										}
									},
									"删除"
								)
							]
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("CONTENT_ACTIVITY_CLASSIFY_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("CONTENT_ACTIVITY_CLASSIFY_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		}
	}
};



