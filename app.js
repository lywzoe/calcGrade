// 為了避免 使用者送交表單的動作清除表單內容所以這裡讓Enter功能無法使用
window.addEventListener("keypress",(e)=>{
  if(e.key == "Enter"){
    e.preventDefault();
  }
})

/* 網頁上的所有button元素都會導致form的資料被傳送至後端並清除資料
，為了避免這個情形我們需要先將所有button的預設情形停止 */
function preventBtn(){
  let allButtons = document.querySelectorAll("button");
  // querySelectorAll回傳一個NodeList (array-like) 可以使用forEach method
  allButtons.forEach((button) => {
    button.addEventListener("click",(e)=>{
      e.preventDefault();
    })
  })
}
preventBtn();

// 針對使用者選中的成績 計算加權成績 及 轉換對應的背景顏色
let allSelector = document.querySelectorAll("select");
// querySelectorAll回傳一個NodeList (array-like) 可以使用forEach method
allSelector.forEach((select)=>{ // 針對每一個選項執行動作
  select.addEventListener("change", (e)=>{ // 執行監聽的動作，監控使用者是否改變選項
    setGPA(); // 當改變選項就執行計算加權成績的function
    changeColor(e.target); // 以及執行轉換背景顏色的function 參數為e.target就是被選中的選項
  })
})

// 當使用者點選學分數時要更新GPA的數值
let credits = document.querySelectorAll(".class-credits");
credits.forEach((credits) => {
  credits.addEventListener("change",() => {
    setGPA();
  })
})

// 製作一個換顏色的 function 每個級別對應不同的背景顏色
function changeColor(target){ // 這個target就是e.target代入的選項
  if (
    target.value == "A" ||  // 而value屬性是選項的值
    target.value == "A-"
    ) {
    target.style.backgroundColor = "lightgreen";
    target.style.color = "black";
  } else if (
    target.value == "B" || 
    target.value == "B-" ||
    target.value == "B+"
  ) {
    target.style.backgroundColor = "yellow";
    target.style.color = "black";
  } else if (
    target.value == "C" || 
    target.value == "C-" ||
    target.value == "C+"
  ) {
    target.style.backgroundColor = "orange";
    target.style.color = "black";
  } else if (
    target.value == "D" || 
    target.value == "D-" ||
    target.value == "D+"
  ) {
    target.style.backgroundColor = "red";
    target.style.color = "black";
  } else if (
    target.value == "F" 
  ) {
    target.style.backgroundColor = "grey";
    target.style.color = "white";
  } else {
    target.style.backgroundColor = "grey";
    target.style.color = "white";
  }
}

function convertor(grade){
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

function setGPA() {
  let formLength = document.querySelectorAll("form").length;
  let credits = document.querySelectorAll(".class-credits");
  let selects = document.querySelectorAll("select");
  // 加權分數的算法是 該堂課學分數(credits[i]) * 該堂課成績(selects[i]) / 所有學分數加總 
  let classSum = 0; // 該堂課學分數(credits[i]) * 該堂課成績(selects[i])
  let creditsSum = 0; // 所有學分數加總
  // 要算出GPA接下來我們要逐一檢查每一列的學分以及成績
  // 首先算出creditSum
  for(let i = 0; i < credits.length; i++) {
    // 當我們只有輸入一堂課的值時下面兩個form因為抓取不到數字會變成NaN，導致最後的sum也會變成NaN，為了避免這個問題，要多設定一個條件 → 如果學分數!== NaN我才要把這個數字算進creditsSum
    if(!isNaN(credits[i].valueAsNumber)) {
    creditsSum += credits[i].valueAsNumber 
    } // 利用console.log(credit[i])找出這個物件裡有個屬性叫做valueAsNumber 他的值就是input上使用者填寫的"數字"，接著我們用迴圈逐一抓出學分並把每個學分加進creditsSum
  // 接著算出classSum
  for(let i = 0; i < formLength; i++)
    if(!isNaN(credits[i].valueAsNumber)){
      classSum += credits[i].valueAsNumber * convertor(selects[i].value); 
      // selelct[i].value會是使用者的成績的值(A,A-,B...)，在套入convertor function去轉換成數字來做計算
    }
    let result;
    if(creditsSum == 0){
      result = (0.0).toFixed(2);
    } else {
      result = (classSum / creditsSum).toFixed(2);
    }
    document.getElementById("result-gpa").innerText = result;
  }
}

// 新增表單功能
// 1.賦予新增表單的button功能
let addBtn = document.querySelector(".plus");
addBtn.addEventListener("click",() => {
  preventBtn();
  // 這個箭頭函式裡要執行的事情就是新增所有form的內容
  // 2.新增一個form
  let newForm = document.createElement("form");
  // 3.新增form裡面的div並命名class: grader
  let newDiv = document.createElement("div");
  newDiv.classList.add("grader");
  // 4.新增五個在div.grader裡面的元素( 3 input 1 select 1 btn )
    // 4-1.新增第一個input並加上attributes & classname
  let newInput1 = document.createElement("input");
  newInput1.setAttribute("type", "text");
  newInput1.setAttribute("placeholder", "class number");
  newInput1.setAttribute("list", "opt");
  newInput1.classList.add("class-type");

    // 4-2.新增第二個input並加上attributes & classname
  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text");
  newInput2.setAttribute("placeholder", "class number");
  newInput2.classList.add("class-number");

    // 4-3.新增第三個input並加上attributes & classname & Event
  let newInput3 = document.createElement("input");
  newInput3.setAttribute("type", "number");
  newInput3.setAttribute("placeholder", "credits");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.classList.add("class-credits");
  newInput3.addEventListener("change",() => {
    setGPA();
  });
  
    // 4-4.新增select並加上class & 新增所有option & Event
  let newSelect = document.createElement("select");
  newSelect.setAttribute("name", "select");
  newSelect.classList.add("select");
      // 新增option並加上文字
  let opt1 = document.createElement("option");
  opt1.setAttribute("value", "");
  let textNode1 = document.createTextNode("")
  opt1.appendChild(textNode1);

  let opt2 = document.createElement("option");
  opt2.setAttribute("value", "A")
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);

  let opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-")
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);

  let opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+")
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);

  let opt5 = document.createElement("option");
  opt5.setAttribute("value", "B")
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);

  let opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-")
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);

  let opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+")
  opt7.appendChild(textNode7);

  let opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C")
  opt8.appendChild(textNode8);

  let opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-")
  opt9.appendChild(textNode9);

  let opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+")
  opt10.appendChild(textNode10);

  let opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D")
  opt11.appendChild(textNode11);

  let opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-")
  opt12.appendChild(textNode12);

  let opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F")
  opt13.appendChild(textNode13);

  //把以上option加進select tag
  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);

  // 新增select的Event 
  newSelect.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  })

  // 5.新增trashBtn並加上classname & i tag
  let trashBtn = document.createElement("button");
  trashBtn.classList.add("trash");
  let newItag = document.createElement("i");
  newItag.classList.add("fa-solid");
  newItag.classList.add("fa-trash");
  trashBtn.appendChild(newItag);

  // 替新的trashBtn作 取消按鈕預設動作 及 動畫
  trashBtn.addEventListener("click",(e) => {
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation = "scaleNone 0.3s ease forwards";
    e.target.parentElement.parentElement.addEventListener("animationend", (e) => {
      e.target.remove();
      setGPA();
    })
  })

  // 把所有子元素一個一個新增致父層
  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(trashBtn);
  newForm.appendChild(newDiv);
  document.querySelector(".all-inputs").appendChild(newForm);

  // 新增animation
  newForm.style.animation = "scaleUp 0.3s ease forwards";
  
})

// 替外層所有trash button做 刪除表單的功能 及 動畫
let allTrash = document.querySelectorAll(".trash");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.style.animation = "scaleNone .3s ease forwards";
  })
  let form = trash.parentElement.parentElement;
  form.addEventListener("animationend", (e) => {
    e.target.remove();
    setGPA();
  })
})


// 排序演算法 - descending & ascending

function handleSorting(direction) {
  // 替grades裡的每個Element設定變數 方便之後需要針對某個資料做取值的動作
  let graders = document.querySelectorAll(".grader");
  //製作一個裡面會放進 calss_name class_num class_credit class_grade 的值的物件陣列
  let objectArray = [];

  // 用迴圈去跑graders 比對每一個Element裡面的值,進而去比大小
  for(let i = 0; i < graders.length; i++) {
    let class_name = graders[i].children[0].value; // class-category的值
    let class_num = graders[i].children[1].value; // class-number的值
    let class_credit = graders[i].children[2].value; // class-credit的值
    let class_grade = graders[i].children[3].value; // select 的值

    if (
      !(class_name == "" && 
      class_num == "" && 
      class_credit == "" && 
      class_grade == "") // !() : 只要裡面的條件不是ture 就執行....
      ) {
      let class_object = {
      class_name, class_num, class_credit, class_grade
      };
      objectArray.push(class_object);
    }
  }

  // 利用迴圈將class_grade的英文表示成績 換成 數字成績 (運用上面的convertor function)
  for(let i = 0; i < objectArray.length; i++){
  objectArray[i].class_grade_num = convertor(objectArray[i].class_grade)
  }
  // 接著把objectArray丟進mergeSort裡做排序
  objectArray = mergeSort(objectArray);
  if (direction == "descending") {
    objectArray = objectArray.reverse(); // 如果使用者使用descending則將陣列反轉變為由小到大排序
  }
  console.log(objectArray);
}

/* 做 merge function 讓陣列的每個element都個別拆成自己一個的陣列再來與其他陣列一一比大小 
   小的數字先放進新的陣列 大的後放進陣列*/
function merge(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while(i < arr1.length && j < arr2.length) {
    if (arr1[i].class_grade_num < arr2[j].class_grade_num) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }
  while(i < arr1.length){
    result.push(arr1[i]);
    i++;
  }
  while(j < arr2.length){
    result.push(arr2[j]);
    j++;
  }
  return result;
}

// mergeSort function 負責來拆分 array 讓每一個陣列帶進 merge funcction 比大小
function mergeSort(arr){
  if (arr.length == 0){
    return;
  }
  if (arr.length == 1){
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let leftarr = arr.slice(0, middle);
    let rightarr = arr.slice(middle, arr.length);
    return merge(mergeSort(leftarr), mergeSort(rightarr));
  }
}

// 替DescendBtn & AscendBtn製作click事件 , 當使用者點擊時執行handleSorting函式
let DesBtn = document.querySelector(".sort-descending");
let AsBtn = document.querySelector(".sort-ascending");
DesBtn.addEventListener("click", () => {
  handleSorting("descending"); // 由大到小排序
})
AsBtn.addEventListener("click", () => {
  handleSorting("ascending"); // 由小到大排序
})