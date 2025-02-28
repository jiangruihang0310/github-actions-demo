import HomeComponent from '@/view/home'
import Echats from '@/view/echarts'
import NotFound from '@/view/404'
import Table from '@/view/table'
import Map from '@/view/map'
import Canvas from '@/view/canvas'
import Swiper from '@/view/swiper'
import Iframe from '@/view/iframe'
import Gantt from '@/view/gantt'
import Scene from "@/view/scene"
import ChatRoom from '@/view/chatroom'
import Svg from '@/view/svg'
import DingTalk from '@/view/DingTalk'
import Music from '@/view/music'
import Face from '@/components/Face'
import Log from '@/view/about/log'
import Log2 from '@/view/about/log2'
import DateCalculation from '@/view/dateCalculation'
import CrossWindows from '@/view/crossWindows'
import SceneGraph from '@/view/SceneGraph'
import FlightDiagram from '@/view/FlightDiagram'
import Particle from '@/view/particle'
const routes=[
	{
		path:"/",
		name:"MUSIC",
		component:Music
	},
	{
		path:'/echart',
		name:'echarts',
		component: Echats,
		meta:{name:'启停图'}
	},
	{
		path:'/emoji',
		name:'emoji',
		component:HomeComponent	
	},
	{
		path:'/table',
		name:'table',
		component:Table	
	},
	{
		path:'/canvas',
		name:'canvas',
		component:Canvas
	},
	{
		path:'/swiper',
		name:'swiper',
		component:Swiper
	},
	{
		path:'/map',
		name:"map",
		component:Map
	},
	{
		path:"/iframe",
		name:"iframe",
		component:Iframe
	},
	{
		path:"/gantt",
		name:"gantt",
		component:Gantt
	},
	{
		path:"/scene",
		name:"Scene",
		component:Scene
	},
	{
		path:'/chatRoom',
		name:"ChatRoom",
		component:ChatRoom
	},
	{
		path:'/svg',
		name:'svg',
		component:Svg,
	},
	{
		path:"/dingTalk",
		name:'DingTalk',
		component:DingTalk
	},

	{
		path:"/face",
		name:'人脸识别',
		component:Face
	},
	{
		path:"/log",
		name:'log',
		component:Log
	},
	{
		path:"/log2",
		name:'log2',
		component:Log2
	},
	{
		path:'/DateCalculation',
		name:'DateCalculation',
		component:DateCalculation
	},
	{
		path:'/crossWindows',
		name:'CrossWiondows',
		component:CrossWindows

	},
	{
		path:'/SceneGraph',
		name:'SceneGraph',
		component:SceneGraph
	},
	{
		path:'/FlightDiagram',
		name:'FlightDiagram',
		component:FlightDiagram
	},
	{
		path:'/Particle',
		name:'Particle',
		component:Particle
	},
	{ path: '*', name: 'not-found', component: NotFound }
]
export default routes