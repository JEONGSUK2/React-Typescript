import { useEffect, useState } from "react";

interface Company {
  International : string;
  Code: string;
  Name: string;
}

interface ThemeColor {
  [key: string] : {                           // 객체는 배열로 불러오기 때문에 [key: string] : {} 이라는 문법을 사용  
    back: string;                             // 이중 객체에서는 index값을 사용하지 못한다.
    hover: string;
    active: string;
    text: string;
  }
}

interface ButtonType {
  name : string;
  theme : string;

}

function App() {

 const [carriers, setCarriers] = useState<Company[]>([]); //필터 되는 정보를 넣을 공간 ...국내/국외 택배사 정보
 const [allCarriers, setAllCarriers] = useState<Company[]>([]); // 전체 데이터
 const [theme, setTheme] = useState<string>('default'); // 색상변경을 위한 코드

 
 const [tcode, setTcode] = useState<string>('04'); // 코드번호
 const [tinvoice, setInvoice] = useState<string>('') // 실제 운송장 번호
 const [tname, setTname] = useState<string>('CJ대한통운') // 실제 택배사 이름

const [isBtn, setIsBtn] = useState<number | null>(null);



const themeColor :ThemeColor = {
  "default":{                         //theme 기본 값
    "back" : "bg-indigo-500",         //  배경색 색상 지정
    "hover": "hover:bg-indigo-500",   // hover시 변경될 색상
    "active": "bg-indigo-400" ,       // active시 색상 변경
    "text" : "text-indigo-500"        // 글자색 변경
  },
  "orange":{
    "back" : "bg-orange-500",
    "hover": "hover:bg-orange-500",
    "active": "bg-orange-400",
    "text" : "text-orange-500"
  },
  "blue":{
    "back" : "bg-blue-500",
    "hover": "hover:bg-blue-500",
    "active": "bg-blue-400",
    "text" : "text-blue-500"
  }
}

const buttons :ButtonType[] = [
  {name: "기본", theme: "default"},
  {name: "오렌지", theme: "orange"},
  {name: "블루", theme: "blue"}
]

useEffect(()=>{
  const fetchData = async () =>{
    try{
      const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.React_APP_API_KEY}`)
      
      const data = await res.json();
      setCarriers(data.Company)
      setAllCarriers(data.Company)

      console.log(carriers)
      
    }catch(error){
      console.log(error);
    }
  }
  fetchData();
},[])


const selectCode =(BtnNumber: number, code: string, name: string)=>{
  setIsBtn(BtnNumber);         // 국내가 false 1
  setTcode(code);              // 국외 ture 2
  setTname(name);

  const isInternational = BtnNumber === 2 ? 'true' : 'false'   //스트링 형태
  
  const filterCarriers = allCarriers.filter(e=> e.International === isInternational);
  setCarriers(filterCarriers)
}


  return (
    <>
     <div className= {`${themeColor[theme].back} p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between`}>
        <h3 className="font-extrabold">국내.외 택배조회 시스템</h3>
        <div>
          <span>테마 :</span>
          {
            buttons.map((e,i)=>{
              return(
                <button key={i} className="mx-1 md:mx-2 xl:mx-3 " onClick={()=> setTheme(e.theme)
                }>{e.name}</button>
              )
            })
          }
        </div>
     </div>
    <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
      <span className="basis-[30%] text-center mr-5">국내 / 국외 선택</span>
      <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 1 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 1 && themeColor[theme].active} : ''`} onClick={()=> selectCode(1, '04', 'CJ대한통운')}>국내</button>
      <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 2 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 2 && themeColor[theme].active} : ''`} onClick={()=> selectCode(2, '12', 'EMS')}>국외</button>
    </div>  
    
    <select value={tcode} onChange={(event)=>{     
        setTcode(event.target.value);
    }}>
        {
          carriers.map((e,i)=>{
            return(
              
              <option key={i} value={e.Code} className="" 
                
              >{e.Name}</option>
            )
          })
        }
    </select>
    </>
  );
}

export default App;


/*
react에서 typescript 적용방법

1. $ npx create-react-app parcel --template typescript

2. cd parcel

*/ 