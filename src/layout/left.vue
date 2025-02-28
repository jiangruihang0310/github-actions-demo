<template>
	<div class="layout-left">
		<div class="title">@JiangRuiHang</div>
		<div class="menu">
			<div class="menu-item" v-for="(item, index) in routeList">
				<div class="name">{{ item.name }}</div>
				<ul class="menu-item-children">
					<li v-for="(items, indexs) in item.children"
						:class="id == items.id ? 'children-item active' : 'children-item'" :key='item.sid'
						:title="items.description" @click="() => onClickHandler(items)">{{ items.name }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { toRefs, ref, onMounted, watch, reactive } from 'vue'
// import { useRouter } from 'vue-router'
export default {
	setup() {
		// const router=useRouter()
		const state = reactive({
			routeList: [
				{
					name: "DEMO",
					children: [
						{
							name: "MUSIC",
							id: 1,
							description: "音乐",
							path: "/"
						},
						{
							name: "Chart",
							id: 3453212,
							description: "图表",
							path: "/echart"
						},
						// {
						// 	name: "Face Recognition",
						// 	id: 44654,
						// 	description: "人脸识别",
						// 	path: "/face"
						// },
						{
							name:"GLTF Model",
							id:13545351,
							description: "GLTF模型",
							path:'/scene'
						},
						{
							name:'Scene Graph',
							id:45345321,
							description:'场景图',
							path:'/SceneGraph'
						},
						{
							name:'Calendar',
							description:"日历",
							id:545,
							path:"/canvas"
						},
						{
							name:"Pulsating Emoji",
							description:"跳动的表情包",
							id:6132122345615,
							path:'/emoji'
						},
						{
							name:"Shader",
							description:"着色器",
							id:7121,
							path:"/iframe"
						},
						{
							name:"Cross Windows",
							description:"跨窗口",
							id:81212,
							path:"/crossWindows"
						},
						{
							name:'Date-Calculation',
							description:'日期计算',
							id:4541213131,
							path:"/DateCalculation"

						},
						{
							name:'Map',
							description:'地图',
							id:4541213131123,
							path:"/map"

						},
						{
							name:"Flight-Diagram",
							description:"飞线图",
							id:12314556686,
							path:'/FlightDiagram'
						},
						{
							name:"Particle",
							description:"粒子",
							id:98453132321541212,
							path:"/Particle"
						}
					]
				},
				{
					name: "ABOUT",
					children: [
						{
							id: 91212,
							name: "log",
							description: 'log',
							path: "/log"
						},
						{
							id: 912123,
							name: "upload",
							description: 'log2',
							path: "/log2"
						}
						
					]
				},
				

			],
			id:  localStorage.getItem('id') || 1 
		})
		const methods = {
			onClickHandler(item) {
				state.id = item.id
				localStorage.setItem('id',state.id)
				this.$router.push({ path: item.path })
			}
		}
		onMounted(() => {
			// console.log(state.routeList);
		})
		return { ...toRefs(state), ...methods }
	}
}
</script>

<style lang="scss" scoped>
.layout-left {
	width: 280px;
	height: 100%;
	color: var(--color);
	padding: 20px;
	border-right: 1px solid var(--border);
	padding: 30px;
}

.title {
	height: 30px;
	font-size: 22px;
	font-weight: 600;

}

.menu {
	margin-top: 24px;

	&-item {
		margin-bottom: 30px;

		.name {
			line-height: 30px;
			font-size: 20px;
			letter-spacing: 0.07em;
			font-weight: 600;
		}

		&-children {
			font-size: 18px;
			line-height: 30px;
			padding-left: 12px;
		}
		.children-item{
			cursor: pointer;
		}
	}

	.active {
		transition: all 0.5s;
		transform: translate(1.1);
		color: var(--active);
	}
}
</style>