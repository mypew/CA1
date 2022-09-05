let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
preloadSettingsCanvas();

let listValues; // Массив различных значений.
let listNameValues; // Массив названий различных значений.
let xMax = 10000; // Максимальное количество по x
let yMax = 0.12; // Максимальное количество по y
let xControl = canvas.width/xMax; // Контрольные множители для значений по x
let yControl = canvas.height/yMax; // Контрольные множители для значений по y
createCoordinateSystem();

function downloadGraph(input) {
  let file = input.files[0];
  let read = new FileReader();
  let data;
  read.readAsText(file);
  read.onload = function() {
    generationGraph(read.result);
  };
}

function generationGraph(data) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(0,0,200,0.7)";
  context.strokeStyle = "red";
  context.font = "15px Tahoma";
  context.lineWidth = 1;
  listValues = [];
  listNameValues = [];
  context.beginPath();
  context.moveTo(0,720);
  data = data.split('\n');
  data.splice(data.length-1,1);
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[0] = Number(str[0]);
    str[1] = Number(str[1]);
    context.lineTo(str[0]*xControl,(yMax-str[1])*yControl);
    context.stroke();
    context.fillRect(str[0]*xControl,(yMax-str[1])*yControl,5,5);
  }
  context.closePath();

  MinGraph(data); // Запуск поиска минимального значения в графе и вывод его
  MaxGraph(data); // Запуск поиска максимального значения в графе и вывод его
  AverageValue(data); // Ищет среднее значение графика
  VarianceValues(data); // Ищет дисперсию графика
  CKO(data); // Ищет среднеквадратическое отклонение графика
  drawListValues(); // Вывод на экран листа значений и их название
  createCoordinateSystem(); // Создание системы координат
}

function drawListValues(){
  context.fillStyle = "rgba(0,0,0,1)";
  context.font = "15px Tahoma";
  for(let i = 0; i < listValues.length; i++) {
    context.fillText(listNameValues[i],950,20+i*20);
    context.fillText(listValues[i],1200,20+i*20);
  }
}

function MinGraph(data){
  context.strokeStyle = "green";
  context.fillStyle = "rgba(0,200,0,1)";
  context.font = "15px Tahoma";
  context.lineWidth = 3;
  let minX = null, minY = null;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[0] = Number(str[0]);
    str[1] = Number(str[1]);
    if (minY === null || minY > str[1]) {
      minX = str[0];
      minY = str[1];
    }
  }
  listValues[listValues.length] = minY.toFixed(6);
  listNameValues[listNameValues.length] = 'Минимальное значение графика: ';

  context.beginPath();
  context.moveTo(minX*xControl, (yMax-minY)*yControl);
  context.lineTo(minX*xControl+30, (yMax-minY)*yControl-50);
  context.lineTo(minX*xControl+100, (yMax-minY)*yControl-50);
  context.stroke();
  context.fillText('MIN: ',minX*xControl+30, (yMax-minY)*yControl-53);
  context.fillText(minY,minX*xControl+66, (yMax-minY)*yControl-53);
  context.closePath();
}

function MaxGraph(data){
  context.strokeStyle = "green";
  context.fillStyle = "rgba(0,200,0,1)";
  context.lineWidth = 3;
  let maxX = null, maxY = null;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[0] = Number(str[0]);
    str[1] = Number(str[1]);
    if (maxY === null || maxY < str[1]) {
      maxX = str[0];
      maxY = str[1];
    }
  }
  listValues[listValues.length] = maxY.toFixed(6);
  listNameValues[listNameValues.length] = 'Максимальное значение графика: ';

  context.beginPath();
  context.moveTo(maxX*xControl, (yMax-maxY)*yControl);
  context.lineTo(maxX*xControl+30, (yMax-maxY)*yControl-50);
  context.lineTo(maxX*xControl+100, (yMax-maxY)*yControl-50);
  context.stroke();
  context.fillText('MAX: ',maxX*xControl+30, (yMax-maxY)*yControl-53);
  context.fillText(maxY,maxX*xControl+66, (yMax-maxY)*yControl-53);
  context.closePath();
}

function AverageValue(data) {
  let sum = 0;
  let count = 0;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[1] = Number(str[1]);
    sum += str[1];
    count++;
  }
  listValues[listValues.length] = sum.toFixed(6);
  listNameValues[listNameValues.length] = 'Сумма: ';
  listValues[listValues.length] = count;
  listNameValues[listNameValues.length] = 'Количество точек: ';
  listValues[listValues.length] = (sum/count).toFixed(6);
  listNameValues[listNameValues.length] = 'Cреднее значение графика: ';
}

function VarianceValues(data) {
  let sum = 0;
  let count = 0;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[1] = Number(str[1]);
    sum += str[1];
    count++;
  }
  let average = sum/count;
  sum = 0;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[1] = Number(str[1]);
    sum += (str[1]-average)*(str[1]-average);
  }
  listValues[listValues.length] = (sum/count).toFixed(6);
  listNameValues[listNameValues.length] = 'Дисперсия графика: ';
}

function CKO(data) {
  let sum = 0;
  let count = 0;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[1] = Number(str[1]);
    sum += str[1];
    count++;
  }
  let average = sum/count;
  sum = 0;
  for(let i = 0; i < data.length; i++) {
    str = data[i].split('|');
    str[1] = Number(str[1]);
    sum += (str[1]-average)*(str[1]-average);
  }
  listValues[listValues.length] = (Math.sqrt(sum/count)).toFixed(6);
  listNameValues[listNameValues.length] = 'СОК графика: ';
}

function createCoordinateSystem() {
  context.fillStyle = "rgb(0,0,0)";
  context.font = "12px Tahoma";
  let count = 0; // Счётчик
  context.fillRect(0,710,10,10);
  context.fillText(0,13,720);
  for (let x = 64; x <= 1216; x+=64) {
    count++;
    context.fillRect(x-2,710,4,10);
    context.fillText(count/20*xMax,x-15,707);
  }
  count = 0;
  for (let y = 684; y >= 36; y-=36) {
    count++;
    context.fillRect(0,y-2,10,4);
    context.fillText((count/20*yMax).toFixed(4),13,y+5);
  }
}

function preloadSettingsCanvas() {
  /* Размер холста canvas */
  canvas.width = 1280;
  canvas.height = 720;
  //context.fillStyle = "rgba(0,0,200,0.5)"; // Задает синий полупрозрачный цвет fill команд
  //context.strokeStyle = "red"; // Задает красный цвет линий
  //context.font = "15px Tahoma"; // Задаём размер и стиль шрифта
}