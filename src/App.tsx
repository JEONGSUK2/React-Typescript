import { useEffect, useState } from "react";

interface TrackingDetail {
  kind: string;
  level: number;
  manName: string;
  manPic: string;
  telno: string;
  telno2: string;
  time: number;
  timeString: string;
  where: string;
  code: string | null;
  remark: string | null;
  //code - string or null / remark - string or null
}
interface PackageData {
  adUrl: string;
  complete: boolean;
  invoiceNo: string;
  itemImage: string;
  itemName: string;
  level: number;
  receiverAddr: string;
  receiverName: string;
  recipient: string;
  result: string;
  senderName: string;
  trackingDetails: TrackingDetail[];
  orderNumber: string | null;
  estimate: string | null;
  productInfo: string | null;
  zipCode: string | null;
  lastDetail: TrackingDetail;
  lastStateDetail: TrackingDetail;
  firstDetail: TrackingDetail;
  completeYN: "";
}



interface Company {
  International: string;
  Code: string;
  Name: string;
}

interface ThemeColor {
  // 중첩 객체에서는 themeColor[작명한 객체 배열 이름]으로 사용한다.
  // 예, themeColor[defalut].back, themeColor[orange].hover, themeColor[blue].text
  [key: string]: {
    back: string;
    hover: string;
    active: string;
    text: string;
    outline: string;

    odd: string;
    after: string;
    border: string;
    rgb: string;
  };
}

interface ButtonType {
  name: string;
  theme: string;
}

function App() {
  const obj = {
    title: 'Title Text',
    date: '2023-11-22',
    content: 'Some content text here.',
  };

  const [allCarriers, setAllCarriers] = useState<Company[]>([]);
  // 가져온 택배 데이터를 전부 복사해서 넣음 (나중에 이 배열이 필터 될 예정)
  const [carriers, setCarriers] = useState<Company[]>([]);
  // 필터 된 값을 넣음
  const [theme, setTheme] = useState<string>("default");
  // 디자인 테마를 설정함 (중첩 객체를 활용할 예정)

  const [tcode, setTcode] = useState<string>("04");
  const [tinvoice, setTinvoice] = useState<string>("");
  const [tname, setTname] = useState<string>("CJ대한통운");
  const [isBtn, setIsBtn] = useState<number | null>(null);
  const [infoTracking, setInfoTracking] = useState<PackageData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [Mmenu, setMmenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setMmenu(!Mmenu);
  };

  const themeColor: ThemeColor = {
    default: {
      back: "bg-indigo-500",
      hover: "hover:bg-indigo-300",
      active: "bg-indigo-400",
      text: "text-indigo-500",
      outline: "outline-indigo-300",
      odd: "odd:bg-indigo-50",
      after: "after:bg-indigo-500",
      border: "border-indigo-300",
      rgb: "#6366f1",
    },
    orange: {
      back: "bg-orange-500",
      hover: "hover:bg-orange-300",
      active: "bg-orange-400",
      text: "text-orange-500",
      outline: "outline-orange-300",
      odd: "odd:bg-orange-50",
      after: "after:bg-orange-500",
      border: "border-orange-300",
      rgb: "#f97316",
    },
    blue: {
      back: "bg-blue-500",
      hover: "hover:bg-blue-300",
      active: "bg-blue-400",
      text: "text-blue-500",
      outline: "outline-blue-300",
      odd: "odd:bg-blue-50",
      after: "after:bg-blue-500",
      border: "border-blue-300",
      rgb: "#3b82f6",
    },
  };

  const buttons: ButtonType[] = [
    { name: "기본", theme: "default" },
    { name: "오렌지", theme: "orange" },
    { name: "블루", theme: "blue" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`);
        const data = await res.json();
        setAllCarriers(data.Company);
        setCarriers(data.Company);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const selectCode = (BtnNumber: number, code: string, name: string) => {
    setIsBtn(BtnNumber);
    setTcode(code);
    setTname(name);
    const isInternational = BtnNumber === 2 ? "true" : "false";
    const filterCarriers = allCarriers.filter(
      (e) => e.International === isInternational
    );
    setCarriers(filterCarriers);
  };

  const blindNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = carriers.find((e) => e.Code === tcode);
    if (result) {
      if (result.International === "false") {
        e.target.value = e.target.value.replace(/[^0-9]/g, ``);
      }
    }

    setTinvoice(value);
  };

  const PostSubmit = async () => {
    setIsLoading(true);
    setIsShow(false);
    setError(""); //에러를 초기화한다.
    // fetch 문을 사용할 것 같으면 아래 코드가 필요, 아닌 경우 searchParams 쓴 코드 쓰면 됨.
    // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)

    // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
    // url.searchParams.append("t_code",tcode);
    // url.searchParams.append("t_invoice", tinvoice);
    // url.searchParams.append("t_key", `${process.env.REACT_APP_API_KEY}`)

    try {
      const res = await fetch(`https://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`);
      const data = await res.json();
      if (data.firstDetail === null) {
        setError("데이터없음");
        setIsLoading(false);
        return;
      }
      if (data.code === "104" || data.code === "105") {
        setError(data.msg);
      } else {
        setInfoTracking(data);
        setIsShow(true);
      }
      setIsLoading(false);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const PostListName: string[] = [
    "상품인수",
    "상품이동중",
    "배송지도착",
    "배송출발",
    "배송완료",
  ];

  return (
    <>
      {isLoading && (
        <div className="fixed w-full h-full bg-black/50 top-0 left-0 z-50">
          <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4">
            <svg
              width="200px"
              height="200px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <g transform="rotate(0 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.9166666666666666s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(30 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.8333333333333334s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(60 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.75s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(90 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.6666666666666666s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(120 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.5833333333333334s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(150 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.5s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(180 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.4166666666666667s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(210 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.3333333333333333s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(240 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.25s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(270 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.16666666666666666s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(300 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.08333333333333333s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
              <g transform="rotate(330 50 50)">
                <rect
                  x="47"
                  y="24"
                  rx="3"
                  ry="6"
                  width="6"
                  height="12"
                  fill={`${themeColor[theme].rgb}`}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="0s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </g>
            </svg>
          </div>
        </div>
      )}

      <div
        className={`${themeColor[theme].back} p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between`}
      >
        <h3 className="font-extrabold text-white">국내.외 택배조회 시스템</h3>
        <div className="hidden md:block">
          <span className="text-white">테마 :</span>
          {buttons.map((e, i) => {
            return (
              <button
                onClick={() => {
                  setTheme(e.theme);
                }}
                className="mx-1 md:mx-2 xl:mx-3 text-white"
                key={i}
              >
                {e.name}
              </button>
            );
          })}
        </div>
      </div>
      {/* setTheme(e.theme); */}
      <div
        className="fixed right-5 top-5 transition-all duration-500 z-[51] cursor-pointer md:hidden"
        onClick={() => {
          toggleMenu();
        }}
      >
        <div
          className={`w-[45px] h-[5px] bg-black rounded m-[5px] transition-all duration-500  ${
            Mmenu && "rotate-45 translate-y-[10px]"
          }`}
        ></div>
        <div
          className={`w-[45px] h-[5px] bg-black rounded m-[5px] transition-all duration-500  ${
            Mmenu && "opacity-0 -translate-x-8 rotate-[360deg]"
          }`}
        ></div>
        <div
          className={`w-[45px] h-[5px] bg-black rounded m-[5px] transition-all duration-500  ${
            Mmenu && "-rotate-45 -translate-y-[10px]"
          }`}
        ></div>
      </div>

      <div
        className={`w-72 h-full fixed -right-72 top-0  z-50 p-12 box-border transition-all duration-500   md:hidden  ${
          Mmenu ? `right-[0px] ${themeColor[theme].back}` : ""
        }`}
      >
        <div className="text-center mt-6 "></div>
        <ul className="mt-12 flex flex-col h-full  ">
          {buttons.map((e, i) => {
            return (
              <button
                onClick={() => {
                  setTheme(e.theme);
                  toggleMenu();
                }}
                className="mx-1 md:mx-2 xl:mx-3 p-[25px] text-xl border-b  border-white text-white"
                key={i}
              >
                {e.name}
              </button>
            );
          })}
        </ul>
      </div>

      <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center pt-2 flex-wrap">
        <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
          <span className="basis-[30%] text-center mr-5">국내 / 국외 선택</span>
          <button
            onClick={() => selectCode(1, "04", "CJ대한통운")}
            className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${
              isBtn === 1 ? "text-white" : "text-black"
            } ${themeColor[theme].hover} ${
              isBtn === 1 ? themeColor[theme].active : ""
            }`}
          >
            국내
          </button>
          <button
            onClick={() => selectCode(2, "12", "EMS")}
            className={`text-sm border p-1 px-5 rounded hover:text-white ${
              isBtn === 2 ? "text-white" : "text-black"
            } ${themeColor[theme].hover} ${
              isBtn === 2 ? themeColor[theme].active : ""
            }`}
          >
            국외
          </button>
        </div>
        {/* {tcode}{tname} */}
        <div className="basis-full">
          <select
            className="w-full border mt-4 py-2 px-4 rounded-md "
            value={tcode}
            onChange={(e) => {
              const result_code = e.target.value;
              setTcode(e.target.value);
              const result = carriers.find((e) => e.Code === result_code);
              if (result) {
                setTname(result.Name);
              }
            }}
          >
            {carriers &&
              carriers.map((e, i) => {
                return (
                  <option key={i} value={e.Code}>
                    {e.Name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="basis-full mt-4 py-4 border-b text-center">
          <input
            onInput={blindNumber}
            type="text"
            placeholder="운송장 번호를 입력해주세요."
            className={`w-[100%] border px-5 py-2 rounded-md ${themeColor[theme].outline}`}
          />
        </div>
        <div className="basis-full border-b py-4 text-center">
          <button
            onClick={PostSubmit}
            className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`}
          >
            조회하기
          </button>
        </div>
        {error && (
          <div className="basis-full text-center py-4 border-b">
            <span className={`${themeColor[theme].text} font-bold`}>
              {error}
            </span>
          </div>
        )}
      </div>
      {isShow && (
        <>
          <div className="w-full">
            <div
              className={`${themeColor[theme].back} text-white flex justify-center py-10 px-5 flex-wrap items-center text-center`}
            >
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">
                운송장 번호
              </span>
              <h3 className="text-2xl basis-[45%] font-bold mb-5">
                {tinvoice}
              </h3>
              <span className="text-xl basis-[45%] font-bold mr-5 mb-5">
                택배사
              </span>
              <h3 className="text-2xl basis-[45%] font-bold mb-5"> {tname}</h3>
            </div>
          </div>
          <div
            className="bg-white my-5 flex justify-around py-5 relative before:bg-[#e2e5e8] before:h-[1px] before:box-border
          before:top-[45%] before:absolute before:left-[10%] before:w-4/5 before:z-0"
          >
            {Array(5)
              .fill("")
              .map((_, i) => {
                const resultLevel =
                  infoTracking && i + 1 === infoTracking?.level - 1;
                return (
                  <div
                    key={i}
                    className={`${
                      infoTracking && resultLevel
                        ? themeColor[theme].after
                        : "after:bg-gray-200"
                    } relative z-10 after:absolute after:w-[60px] after:h-[60px] after:rounded-full after:left-0 after:top-0`}
                  >
                    <img
                      className="relative z-10"
                      src={`images/ic_sky_delivery_step${i + 1}_on.png`}
                      alt={PostListName[i]}
                    />
                    <p className="text-center text-xs mt-1">
                      {PostListName[i]}
                    </p>
                  </div>
                );
              })}
            {/* 레벨의 글자 > 테마의 색상 + 글자  */}
          </div>
          <div className="bg-white py-5">
            {infoTracking &&
              infoTracking.trackingDetails
                .slice()
                .reverse()
                .map((e, i) => {
                  return (
                    <div
                      className={`pl-20 py-5 relative group ${themeColor[theme].odd}`}
                      key={i}
                    >
                      <div
                        className={`${
                          i === 0
                            ? `${themeColor[theme].back} ${themeColor[theme].border}`
                            : "bg-black"
                        }
                   bg-white relative border-2 rounded-full w-2 h-2 -left-[30px] top-10 z-30`}
                      ></div>
                      <p>{e.where}</p>
                      <p>{e.telno}</p>
                      <p>{e.timeString}</p>
                      <div
                        className={`group-last:h-0 h-full absolute w-0.5 left-[53px] top-[60px] z-20 ${themeColor[theme].back}`}
                      ></div>
                    </div>
                  );
                })}         
            </div>
        </>
      )}
   </>
  );
}

export default App;
