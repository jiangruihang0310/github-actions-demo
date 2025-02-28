<!--
<template>
  <div class="container">
    &lt;!&ndash; 长传组件 &ndash;&gt;
    <el-upload action="" :before-upload="beforeUpload" :http-request="() => { }">
      <el-button type="primary">导入excel</el-button>
    </el-upload>

    &lt;!&ndash; 表格组件 &ndash;&gt;
    <el-table :data="tableData" border style="width: auto; margin-top: 10px" ref="e_TABLE">
      <el-table-column :prop="item" :label="item" align="center" v-for="(item, index) in tableColumnLabel"
                       :key="index">
        <template #default="scope"
                  v-if="item == '环保随车清单照片' || item == '环保随车清单扫描' || item == '行驶证照片' || item == '车辆照片' || item == '发动机照片'">
          <img v-if="item == '环保随车清单照片'" :src="scope.row.环保随车清单照片" alt="" style="width: 200px"/>
          <img v-if="item == '环保随车清单扫描'" :src="scope.row.环保随车清单扫描" alt="" style="width: 200px"/>
          <img v-if="item == '行驶证照片'" :src="scope.row.行驶证照片" alt="" style="width: 200px"/>
          <img v-if="item == '车辆照片'" :src="scope.row.车辆照片" alt="" style="width: 200px"/>
          <img v-if="item == '发动机照片'" :src="scope.row.发动机照片" alt="" style="width: 200px"/>

        </template>
      </el-table-column>
    </el-table>
    <img src="" alt="" id="imgSc">
  </div>
</template>
<script setup>
import {ref, nextTick} from "vue";

import JSZip from "jszip"; // 引入jszip
import * as XLSX from "xlsx";
import axios from "axios"; // 引入xlsx

const tableColumnLabel = ref([]); // 获取表头内容
const tableData = ref([]); // 表格数据
const imageList = ref([]); // 表格图片
const e_TABLE = ref(null)

// 加载按钮的回调
async function beforeUpload(file) {
  // 解析图片
  imageList.value = await getExcelImage(file);
  // console.log(imageList.value)

  // 解析数据
  getExcelData(file);
}

// 解析数据
function getExcelData(file) {
  let fileReader = new FileReader(); // 构建fileReader对象

  fileReader.readAsArrayBuffer(file); // 读取指定文件内容

  // 读取操作完成时
  fileReader.onload = function (e) {
    try {
      let data = e.target.result; // 取得数据data
      // console.log(data);

      let workbook = XLSX.read(data, {type: "binary"}); // 将data转换成excel工作表数据
      // console.log("Excel工作簿", workbook);

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // 获取第一个工作表
      // console.log("第一张工作表", worksheet);

      /*
       * XLSX.utils.sheet_to_json 输出JSON格式数据
       * 获取指定工作表中的数据sheetlist[],整个表中的数据存放在一个数组sheetlist中；
       * sheetlist数组中的每个元素均为一个数组rowlist，是每一行的数据；
       */
      const sheetlist = XLSX.utils.sheet_to_json(worksheet, {header: 1});
      //console.log('sheetlist', sheetlist);

      // 封装数据
      // console.log(sheetlist);
      formatDate(sheetlist);
    } catch (e) {
      console.log("文件类型不正确");
      return;
    }
  };
}

// 封装数据
const formatDate = (sheetlist) => {
  try {
    if (sheetlist.length < 1) return
    // console.log(sheetlist);
    tableColumnLabel.value = sheetlist[0]
    tableData.value = [] // 每次上传新文件时重置数据
    let temp = 0
    for (let i = 1; i < sheetlist.length; i++) {
      let obj = {}
      for (let j = 0; j < sheetlist[0].length; j++) {
        const columnName = sheetlist[0][j]
        if ((columnName === '环保随车清单照片' || columnName === '环保随车清单扫描' || columnName === '行驶证照片' || columnName === '车辆照片' || columnName === '发动机照片') && sheetlist[i][j] != '1' && imageList.value[temp]) {
          obj[columnName] = `data:image/png;base64,${imageList.value[temp++]}`
        } else {
          obj[columnName] = sheetlist[i][j] ?? ''
        }
      }
      tableData.value.push(obj)
    }
    let totalData = JSON.parse(JSON.stringify(tableData.value))
    let data = []
    let imgList = null
    // console.log(tableColumnLabel)
    // console.log(totalData)

    return
    totalData.forEach(item => {
      let obj = {
        "TRANS_NO": item["车牌号"],
        "TRANS_COLOR": item["车牌颜色"],
        "EMISSION_STD": item["排放标准"],
        "VIN": item["车辆识别代码"],
        "ENGINE_NO": item["发动机号"],
        "PLATETYPE": item["车辆类型"],
        "UNLOADINGTYPE": item["装卸方式"],
        "LOAD_WEIGHT": item["荷载重量"],
        "FUEL_TYPE": item["燃油类型（重型柴油机）"],
        "TRANS_PERMIT": item["道路运输许可证"],
        "STANDBY8": item["车队名称"],
        "QUALITY": item["使用性质"],
        "VERSION": item["车辆品牌型号"],
        "EPV_LISTIMG": "",
        "STD_QUERY_IMG": "",
        "VINIMG": "",
        "PLATEIMG": "",
        "STANDBY2": "",
        "VIN_DUE_DATE": item["行驶证过期时间"],
        "ROUTE": item["路线"],
        "ACCESSNETWORK": item["联网状态"]
      }
      // 车辆照片
      /*axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          filePath:base64ImgtoFile(item["车辆照片"], item["车牌号"] + (new Date()).getTime()),
          name: "Car",
          formData: ""
        },
        success: res => {
          console.log(111, res);
          if (res.data && res.data.filePath) {
            // obj.PLATEIMG = res.data.filePathNameUrl + res.data.filePathUrl
            obj.PLATEIMG = res.data.filePathUrl
            // console.log(obj.PLATEIMG)
          }
        }
      })*/





      axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          Car:base64ImgtoFile(item["车辆照片"], item["车牌号"] + (new Date()).getTime()),
          name: "Car",
          formData: ""
        },
      }).then(res => {
        // console.log(111, res);
        if (res.data && res.data.filePath) {
          // obj.PLATEIMG = res.data.filePathNameUrl + res.data.filePathUrl
          console.log(11111, res.data);
          obj.PLATEIMG = res.data.filePathUrl
          console.log(obj.PLATEIMG,"899999")
        }
      }).catch(err => {
        console.log(err,1111);
      })
      // 发动机照片
      axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          FDJ:base64ImgtoFile(item["发动机照片"], item["车牌号"] + (new Date()).getTime()),
          name: "FDJ",
          formData: ""
        },
      }).then(res => {
        console.log(222, res.data);
        if (res.data && res.data.filePath) {
          // obj.STANDBY2 = res.data.filePathNameUrl + res.data.filePathUrl
          obj.STANDBY2 = res.data.filePathUrl
        }
      }).catch(err => {
        console.log(err,1111);
      })
      /*axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          filePath:base64ImgtoFile(item["发动机照片"], item["车牌号"] + (new Date()).getTime()),
          name: "FDJ",
          formData: ""
        },
        success: res => {
          console.log(222, res);
          if (res.data && res.data.filePath) {
            // obj.STANDBY2 = res.data.filePathNameUrl + res.data.filePathUrl
            obj.STANDBY2 = res.data.filePathUrl
          }
        }
      })*/
      //环保随车清单照片
      axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          HB:base64ImgtoFile(item["环保随车清单照片"], item["车牌号"] + (new Date()).getTime()),
          name: "HB",
          formData: ""
        },
      }).then(res => {
        console.log(333, res.data);
        if (res.data && res.data.filePath) {
          // console.log(res.data);
          // obj.EPV_LISTIMG = res.data.filePathNameUrl + res.data.filePathUrl
          obj.EPV_LISTIMG = res.data.filePathUrl
        }
      }).catch(err => {
        console.log(err,1111);
      })
      /*axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          filePath:base64ImgtoFile(item["环保随车清单照片"], item["车牌号"] + (new Date()).getTime()),
          name: "HB",
          formData: ""
        },
        success: res => {
          console.log(333, res);
          if (res.data && res.data.filePath) {
            console.log(res.data);
            // obj.EPV_LISTIMG = res.data.filePathNameUrl + res.data.filePathUrl
            obj.EPV_LISTIMG = res.data.filePathUrl
          }
        }
      })*/
      //环保随车清单扫描
      axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          JT:base64ImgtoFile(item["环保随车清单扫描"], item["车牌号"] + (new Date()).getTime()),
          name: "JT",
          formData: ""
        },
      }).then(res => {
        console.log(444, res.data);
        if (res.data && res.data.filePath) {
          // obj.STD_QUERY_IMG = res.data.filePathNameUrl + res.data.filePathUrl
          obj.STD_QUERY_IMG = res.data.filePathUrl
        }
      }).catch(err => {
        console.log(err,1111);
      })
      /*axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          filePath:base64ImgtoFile(item["环保随车清单扫描"], item["车牌号"] + (new Date()).getTime()),
          name: "JT",
          formData: ""
        },
        success: res => {
          console.log(444, res);
          if (res.data && res.data.filePath) {
            // obj.STD_QUERY_IMG = res.data.filePathNameUrl + res.data.filePathUrl
            obj.STD_QUERY_IMG = res.data.filePathUrl
          }
        }
      })*/
      //行驶证照片
      axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          XSZ:base64ImgtoFile(item["行驶证照片"], item["车牌号"] + (new Date()).getTime()),
          name: "XSZ",
          formData: ""
        },
      }).then(res => {
        console.log(555, res.data);
        console.log(res.data.filePath ,"8899")
        if (res.data && res.data.filePath ) {
          // obj.VINIMG = res.data.filePathNameUrl + res.data.filePathUrl
          obj.VINIMG = res.data.filePathUrl

          console.log('obj77777', obj)

          setTimeout(()=>{

            axios({
              url: "https://www.ysahz.cn:5083/api/LES_COMMON_CAR_ENVIRON/async",
              headers: {'Content-Type': 'application/json',},
              method:"POST",
              data: [JSON.parse(JSON.stringify(obj))]
            }).then(res => {
              console.log(res);
            })
          },1000)

          console.log('obj', obj)
          data.push(obj)
        }
      }).catch(err => {
        console.log(err,1111);
      })
      /*axios({
        url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
        headers: {'Content-Type': 'multipart/form-data',},
        method:"POST",
        data:{
          filePath:base64ImgtoFile(item["行驶证照片"], item["车牌号"] + (new Date()).getTime()),
          name: "XSZ",
          formData: ""
        },
        success: res => {
          console.log(555, res);
          if (res.data && res.data.filePath) {
            // obj.VINIMG = res.data.filePathNameUrl + res.data.filePathUrl
            obj.VINIMG = res.data.filePathUrl
            console.log(obj)
            data.push(obj)
          }
        }
      })*/
    })
    // console.log(data);
    // console.log(data);
    // // const formData = new FormData();
    // data.forEach(item => {
    //   for (const key in item) {
    //     if (item.hasOwnProperty(key)) {
    //       // 检查是否为文件对象
    //       if (item[key] instanceof File) {
    //         // console.log(111)
    //         formData.append(key, item[key]); // 直接添加文件对象
    //       } else {
    //         formData.append(key, item[key]); // 添加其他字段
    //       }
    //     }
    //   }
    // });-


    // console.log(data);
    // console.log(data[0].EPV_LISTIMG)
    // const formData = new FormData();
    // formData.append(data[0].EPV_LISTIMG)

   /* axios({
      url:'https://www.ysahz.cn:5083/api/login_Go/FileSave',
      headers: {'Content-Type': 'multipart/form-data',},
      method:"POST",
      data:{
        filePath:data[0].EPV_LISTIMG,
        name: "XSZ",
        formData: ""
      },
    }).then(res => {
      console.log('成功响应:', res);
    }).catch(err => {
      console.log(err,1111);
    })*/

    //
    //
   /* axios.post('https://www.ysahz.cn:5083/api/login_Go/FileSave', {filePath:formData, name: "XSZ", formData: "",}, {
    }).then(res => {
      console.log('成功响应:', res);
    }).catch(err => {
      console.log(err);
    })*/
  } catch (error) {
    console.log(error)
  }
}

function base64ImgtoFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n&#45;&#45;) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

// 获取图片
async function getExcelImage(file) {
  let imageList = []; // 用来存放图片
  const zip = new JSZip(); // 创建jszip实例

  try {
    let zipLoadResult = await zip.loadAsync(file); // 将xlsx文件转zip文件
    // console.log("zipLoadResult", zipLoadResult);

    for (const key in zipLoadResult["files"]) {
      // 遍历结果中的files对象

      if (key.indexOf("media/image") != -1 && !key.dir) {
        zip.file(zipLoadResult["files"][key].name).async("base64").then((res) => {
          imageList.push(res); // 将解析出的图片的base64编码值 先存入imageList数组中；
          console.log(imageList);
        });
      }
    }
    console.log(imageList);
  } catch (error) {
    console.log(error);
  }
  // console.log('imageList', imageList);
  return imageList;
}
</script>
<style lang="scss" scoped></style>-->
<template>
	<div class="container">
	  <el-upload action="" :before-upload="beforeUpload" :http-request="() => {}">
		<el-button type="primary">导入excel</el-button>
	  </el-upload>
  
	  <el-table :data="tableData2" border style="width: auto; margin-top: 10px">
		<el-table-column
			v-for="(item, index) in tableColumnLabel"
			:key="index"
			:prop="item"
			:label="item"
			align="center"
		>
		  <template #default="scope" v-if="(item=='环保随车清单照片' || item=='扫描随车清单查询截图' || item=='行驶证照片'||item=='车辆照片'||item=='发动机照片')">
			<img :src="scope.row[item]" alt="" style="width: 200px" />
		  </template>
		</el-table-column>
	  </el-table>
	</div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import JSZip from "jszip";
  import Excel from 'exceljs'
  import X2JS from 'x2js'
  
  const tableColumnLabel = ref([]);
  const tableData = ref([]);
  const tableData2 = ref([]);
  const imagesss = ref([]);
  const imagess=ref([])
  const show=ref(false)
  const isImageColumn = (colName) => {
	const imageColumns = [
	  '环保随车清单照片',
	  '扫描随车清单查询截图',
	  '行驶证照片',
	  '车辆照片',
	  '发动机照片'
	];
	return imageColumns.includes(colName);
  };
  
  const beforeUpload = async (file) => {
	imagesss.value=await getExcelImage(file)
	console.log(imagesss.value,'----------------------');
  
	await readFile(file);
  };
  
  const readFileToBuffer = (file) => {
	return new Promise((resolve) => {
	  const reader = new FileReader();
	  reader.onloadend = function () {
		resolve(this.result);
	  };
	  reader.readAsArrayBuffer(file);
	});
  };
  
  const readFile = async (file) => {
	try {
	  const buffer = await readFileToBuffer(file);
	  const workbook = new Excel.Workbook();
	  await workbook.xlsx.load(buffer);
  
	  // 读取图片信息
	  const images = await readImages(buffer);
  
	  // 处理工作表数据
	  await processWorksheet(workbook, images);
  
	} catch (error) {
	  console.error('文件读取失败:', error);
	}
  };
  
  const readImages = async (buffer) => {
	try {
	  const zip = new JSZip();
	  const x2js = new X2JS();
	  const result = await zip.loadAsync(buffer);
  
	  const imagesTarget = {};
	  const imagesTarResult = {};
  
	  const template1 = result.files['xl/_rels/cellimages.xml.rels'];
	  const template2 = result.files['xl/cellimages.xml'];
  
	  if (template1 && template2) {
		const xml = await template1.async("string");
		const xml2 = await template2.async('string');
  
		const temp = x2js.xml2js(xml);
		const temp2 = x2js.xml2js(xml2);
  
		// 处理图片关系
		let Relationship = temp.Relationships.Relationship;
		if (!Array.isArray(Relationship)) {
		  Relationship = [Relationship];
		}
		Relationship.forEach(cell => {
		  imagesTarget[cell._Id] = cell._Target;
		});
  
		// 处理单元格图片映射
		let cellImage = temp2.cellImages.cellImage;
		if (!Array.isArray(cellImage)) {
		  cellImage = [cellImage];
		}
		cellImage.forEach(cell => {
		  const imageName = cell.pic.nvPicPr.cNvPr._name;
		  const imagePath = imagesTarget[cell.pic.blipFill.blip['_r:embed']];
		  imagesTarResult[imageName] = imagePath;
  
		});
	  }
	  console.log(imagesTarResult,'imagesTarResult-------------');
	  imagess.value=imagesTarResult
	  return imagesTarResult;
	} catch (error) {
	  console.error('图片解析失败:', error);
	  return {};
	}
  };
  
  const processWorksheet = async (workbook, images) => {
	try {
	  const worksheet = workbook.getWorksheet(1);
	  const data = [];
  
	  // 处理表头
	  tableColumnLabel.value = [];
	  worksheet.getRow(1).eachCell((cell) => {
		tableColumnLabel.value.push(cell.value);
	  });
  
	  // 处理数据行
	  worksheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return; // 跳过表头
  
		const rowData = {};
		row.eachCell((cell, colNumber) => {
		  const columnName = tableColumnLabel.value[colNumber - 1];
		  // console.log(columnName);
  
		  // 处理图片列
		  //   if (isImageColumn(columnName)) {
		  // 	rowData[columnName] = images[cell.value] || '';
		  //   } else {
		  // console.log(cell.value);
		  if(typeof cell.value === 'string'){
			rowData[columnName] = cell.value || ''
		  }else{
			rowData[columnName] = cell.value.formula.replace('_xlfn.DISPIMG(\"','').replace('\",1)','') || '';
  
		  }
		  //   }
		});
		// console.log(row);
  
		data.push(rowData);
	  });
	  console.log(tableData);
  
	  tableData.value = data;
	  setTimeout(()=>{
		tableData2.value =updateVehicleImages(tableData.value )
		console.log(tableData2.value,'最终结果');
  
		show.value=true
	  },200)
  
	} catch (error) {
	  console.error('工作表处理失败:', error);
	}
  };
  async function getExcelImage(file) {
	// console.log(file);
  
	let imageList = []; // 用来存放图片
	const zip = new JSZip(); // 创建jszip实例
  
	try {
	  let zipLoadResult = await zip.loadAsync(file); // 将xlsx文件转zip文件
	  // console.log("zipLoadResult", zipLoadResult);
  
	  for (const key in zipLoadResult["files"]) {
		// 遍历结果中的files对象
  
		if (key.indexOf("media/image") != -1 && !key.dir) {
		  await zip
			  .file(zipLoadResult["files"][key].name)
			  .async("base64")
			  .then((res) => {
				console.log(res,'res....');
  
				imageList.push({id:key,url:`data:image/png;base64,`+res}); // 将解析出的图片的base64编码值 先存入imageList数组中；
			  });
		}
	  }
	} catch (error) {
	  console.log(error);
	}
	console.log('imageList', imageList);
	return imageList;
  }
  const updateVehicleImages=(arr1)=> {
	// 遍历车辆数据
	let arr2=replaceIdsWithKeys(imagess.value,imagesss.value)
	const idUrlMap = arr2.reduce((acc, curr) => {
	  acc[curr.id] = curr.url; // 这里我们使用ID作为键，URL作为值来创建映射
	  return acc;
	}, {});
	const idUrlEntries=Object.entries(idUrlMap)
	return arr1.map(vehicle => {
	  const newVehicle = { ...vehicle };
	  for (const [key, value] of Object.entries(newVehicle)) {
		if (typeof value === 'string' && idUrlEntries.some(([id]) => id === value)) {
		  const [, url] = idUrlEntries.find(([id]) => id === value);
		  newVehicle[key] = url;
		}
	  }
	  return newVehicle;
	});
  }
  function replaceIdsWithKeys(obj,arr1) {
	// console.log(arr1,obj);
  
	return arr1.map(item => {
	  const key = Object.keys(obj).find(key => obj[key] === item.id.replace('xl/',''));
	  if (key) {
		return { ...item, id: key };
	  } else {
		// 如果在 object 中找不到匹配的 id，则原样返回或进行其他处理
		return item;
	  }
	});
  }
  
  </script>
  
  <style lang="scss" scoped>
  .container {
	padding: 20px;
  }
  </style>
  