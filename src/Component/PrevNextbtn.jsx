import React from "react";

const PrevNextbtn = ({currentPage,totalPages,onPageChange,indexOfLastItem}) => {
  return (
    <div className="mx-auto w-full py-5 flex justify-between flex-col sm:flex-row">
      <p className="text-lg flex gap-1 items-end py-2">
        showing <span className="font-semibold">
            {
                // currentPage !== totalPages ? indexOfLastItem : data.length
            }
        </span> of
        {/* <span className="font-semibold">{data.length}</span> results */}
      </p>
      <div className="flex justify-between gap-4 py-2">
        <button className="flex justify-center items-center text-md font-semibold border-2 border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4" onClick={()=>onPageChange(currentPage -1)} disabled={currentPage === 1}>
          <div>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8" transform="matrix(-1 0 0 1 24 0)"></path></svg>
          </div>
        </button>
        <button className="flex justify-center items-center text-md font-semibold border-2 border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4" onClick={()=> onPageChange(currentPage+1)} disabled={currentPage === totalPages}>
          <div>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"></path></svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PrevNextbtn;