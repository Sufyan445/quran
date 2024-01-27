import { Noto_Sans_Arabic } from "next/font/google";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useEffect, useState } from "react";
const arabic = Noto_Sans_Arabic({ weight: ["600"], subsets: ["arabic"] });

const Hero = ({ data, translation }) => {
  const [both, setBoth] = useState(null);

  let mergeDataAndTranslation = () => {
    if (data && translation) {
      let merged = data.map((item, index) => {
        return {
          data: item,
          translation: translation[index],
        };
      });
      setBoth(merged);
    }
  };

  useEffect(() => {
    mergeDataAndTranslation();
  }, [data, translation]);

  return (
    <div className="text mt-[40px] mb-[40px]">
      {both?.map((aya, index) => (
        <li
          key={index}
          style={arabic.style}
          className="flex bg-transparent justify-end mt-[40px] text-right sm:mr-10 list-none"
        >
          <Accordion
            elevation={4}
            className="w-[95vw] accordion flex flex-col text-white bg-transparent"
          >
            <AccordionSummary
              className="accordion summery bg-transparent float-right"
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
            >
              <div className="flex flex-row justify-end items-end w-[100%]">
                <span className="text-white flex justify-center bg-transparent mr-[10px] font-bold border-4 border-white border-double rounded-full w-[30px] h-[30px] text-[12px] items-center text-center">
                  {aya.data.numberInSurah}
                </span>
                <span className="text-white bg-transparent">
                  {aya.data.text}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails className="accordion bg-transparent">
              <div className="flex flex-wrap justify-end items-center">
                <span className="text-white bg-transparent">
                  {aya.translation.text}
                </span>
              </div>
            </AccordionDetails>
          </Accordion>
        </li>
      ))}
    </div>
  );
};

export default Hero;
