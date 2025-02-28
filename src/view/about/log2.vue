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
        <template #default="scope" v-if="isImageColumn(item)">
          <img :src="scope.row[item]" alt="" style="width: 200px" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import JSZip from "jszip";
import Excel from "exceljs";
import X2JS from "x2js";

const tableColumnLabel = ref([]);
const tableData = ref([]);
const tableData2 = ref([]);
const imagesss = ref([]);
const imagess = ref([]);
const show = ref(false);
const isImageColumn = (colName) => {
  const imageColumns = [
    "环保随车清单照片",
    "扫描随车清单查询截图",
    "行驶证照片",
    "车辆照片",
    "发动机照片",
	'环保随车清单扫描'
  ];
  return imageColumns.includes(colName);
};

const beforeUpload = async (file) => {
  imagesss.value = await getExcelImage(file);

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
    console.error("文件读取失败:", error);
  }
};

const readImages = async (buffer) => {
  try {
    const zip = new JSZip();
    const x2js = new X2JS();
    const result = await zip.loadAsync(buffer);

    const imagesTarget = {};
    const imagesTarResult = {};

    const template1 = result.files["xl/_rels/cellimages.xml.rels"];
    const template2 = result.files["xl/cellimages.xml"];

    if (template1 && template2) {
      const xml = await template1.async("string");
      const xml2 = await template2.async("string");

      const temp = x2js.xml2js(xml);
      const temp2 = x2js.xml2js(xml2);

      // 处理图片关系
      let Relationship = temp.Relationships.Relationship;
      if (!Array.isArray(Relationship)) {
        Relationship = [Relationship];
      }
      Relationship.forEach((cell) => {
        imagesTarget[cell._Id] = cell._Target;
      });

      // 处理单元格图片映射
      let cellImage = temp2.cellImages.cellImage;
      if (!Array.isArray(cellImage)) {
        cellImage = [cellImage];
      }
      cellImage.forEach((cell) => {
        const imageName = cell.pic.nvPicPr.cNvPr._name;
        const imagePath = imagesTarget[cell.pic.blipFill.blip["_r:embed"]];
        imagesTarResult[imageName] = imagePath;
      });
    }
    imagess.value = imagesTarResult;
    return imagesTarResult;
  } catch (error) {
    console.error("图片解析失败:", error);
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
        if (!cell.value.formula) {
          rowData[columnName] = cell.value || "";
        } else {
          rowData[columnName] =
            cell.value.formula
              .replace('_xlfn.DISPIMG("', "")
              .replace('",1)', "") || "";
        }
        //   }
      });
      // console.log(row);

      data.push(rowData);
    });

    tableData.value = data;
    setTimeout(() => {
      tableData2.value = updateVehicleImages(tableData.value);

      show.value = true;
    }, 200);
  } catch (error) {
    console.error("工作表处理失败:", error);
  }
};
async function getExcelImage(file) {
  let imageList = []; // 用来存放图片
  const zip = new JSZip(); // 创建jszip实例

  try {
    let zipLoadResult = await zip.loadAsync(file); // 将xlsx文件转zip文件
    for (const key in zipLoadResult["files"]) {
      // 遍历结果中的files对象

      if (key.indexOf("media/image") != -1 && !key.dir) {
        await zip
          .file(zipLoadResult["files"][key].name)
          .async("base64")
          .then((res) => {
            imageList.push({ id: key, url: `data:image/png;base64,` + res }); // 将解析出的图片的base64编码值 先存入imageList数组中；
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return imageList;
}
const updateVehicleImages = (arr1) => {
  // 遍历车辆数据
  let arr2 = replaceIdsWithKeys(imagess.value, imagesss.value);
  const idUrlMap = arr2.reduce((acc, curr) => {
    acc[curr.id] = curr.url; // 这里我们使用ID作为键，URL作为值来创建映射
    return acc;
  }, {});
  const idUrlEntries = Object.entries(idUrlMap);
  return arr1.map((vehicle) => {
    const newVehicle = { ...vehicle };
    for (const [key, value] of Object.entries(newVehicle)) {
      if (
        typeof value === "string" &&
        idUrlEntries.some(([id]) => id === value)
      ) {
        const [, url] = idUrlEntries.find(([id]) => id === value);
        newVehicle[key] = url;
      }
    }
    return newVehicle;
  });
};
function replaceIdsWithKeys(obj, arr1) {
  return arr1.map((item) => {
    const key = Object.keys(obj).find(
      (key) => obj[key] === item.id.replace("xl/", "")
    );
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
  overflow: auto;
}
</style>
  