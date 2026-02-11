import {
  Dialog,
} from "@headlessui/react";
import { IoIosCloseCircle } from "react-icons/io";

function BannerDetail({ isOpen, setIsOpen, data }) {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        onClose={() => setIsOpen(false)}
        className="z-[9999] fixed inset-0 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <div className="relative max-w-full max-h-full flex flex-col md:flex-row gap-5 rounded-lg space-y-2 bg-white bg-opacity-0 p-5">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-0"
            >
              <IoIosCloseCircle color="white" />
            </button>

            <a href={data.url_link} target="blank">
              <img src={data.img} alt={data.title} className="max-h-[500px]" />
            </a>
            {/* <div>
              <h1 className="mb-2 text-2xl">{data.title}</h1>
              <p className="mb-3 text-gray-600 text-sm">
                Created by {data.created_by}
              </p>
              <div>
                <div>
                  <a
                    href={data.url_link}
                    target="blank"
                    className="animate-bounce items-center focus:animate-none hover:animate-none inline-flex text-md font-medium bg-blue-700 mt-3 px-4 py-2 rounded-lg tracking-wide text-white gap-2"
                  >
                    <FaLink /> Open Link
                  </a>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex text-md font-medium bg-gray-200 mt-3 px-4 py-2 rounded-lg tracking-wide text-black gap-2"
                >
                  Close
                </button>
              </div>
            </div> */}
            {/*          
            <DialogTitle className="font-bold">{data.title}</DialogTitle>
            <Description>
              This will permanently deactivate your account
            </Description>
            <p>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Deactivate</button>
            </div> */}
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default BannerDetail;
