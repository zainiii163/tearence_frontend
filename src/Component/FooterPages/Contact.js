import React from "react";
import UnifiedNavbar from '../UnifiedNavbar';
import { MdLocationPin, MdEmail, MdSchedule } from "react-icons/md";
import FooterBanner from "../FooterBanner";
import Footer from '../Footer'

function Contact() {
  const contactInfo = [
    {
      title: "World Wide Adverts",
      icon: <MdLocationPin size={30} style={{ color: "#01C6DA" }} />,
      description: "124 City Road, London, EC1V 2NX",
    },
    {
      title: "Email Information",
      icon: <MdEmail size={30} style={{ color: "#01C6DA" }} />,
      description: "worldwideadvertsinfo@gmail.com",
    },
    {
      title: "For Advertising",
      icon: <MdEmail size={30} style={{ color: "#01C6DA" }} />,
      description: "worldwideadverts@gmail.com",
    },
    {
      title: "Attention Schedule",
      icon: <MdSchedule size={30} style={{ color: "#01C6DA" }} />,
      description: "24Hours (0GMT) Monday-Sunday",
    },
  ];

  return (
    <div>
      <UnifiedNavbar />
      <FooterBanner title={"Contact"} />
      <div className="w-full py-10 flex justify-center">
        <div className="w-10/12">
          <div className="bg-blue-400">
            <hr className="border border-cyan-400"></hr>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold pt-6 text-blue-900">
              Point Of Contact
            </div>
            <div className="">The Advertiser</div>
          </div>
          <div className="pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
              >
                  <div className="border-2 border-blue-900 bg-white w-16 h-16 rounded-full mx-auto flex items-center justify-center relative top-[15%] ">
                    {info.icon}
                  </div>
                <div className=" flex flex-col  border-2 border-blue-900 rounded-xl p-6 text-center justify-center min-h-[15vh]">
                  <div className="text-xl font-semibold text-cyan-600">
                    {info.title}
                  </div>
                  <div className="text-md text-center">{info.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
