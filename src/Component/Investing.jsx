// import React from "react";

// function Investing() {
//   return (
//     <div className="w-full pt-36  lg:pt-24 h-[530px] flex justify-center">
//       <div className="w-11/12 h-full flex items-center">
//         <iframe
//           className="w-full h-full"
//           src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true"
//         ></iframe>
//       </div>
//     </div>
//   );
// }

// export default Investing;

import React from "react";

function Investing() {


  return (
    <div className="w-full pt-20 h-[530px] flex justify-center mb-10">
      
        <div className="w-11/12 h-full flex items-center">
          <iframe
            className="w-full h-full"
            title="Live Currency Cross Rates"
            src="https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true"
          ></iframe>
        </div>
      
    </div>
  );
}

export default Investing;