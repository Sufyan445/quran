import Hero from "@/components/Hero";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Noto_Sans_Arabic } from "next/font/google";
import Head from 'next/head'
 
const arabic = Noto_Sans_Arabic({ weight: ["600"], subsets: ["arabic"] });

const index = ({
  editionData,
  audioData,
  translationData,
  textData,
  singleData,
  allnameData,
  alltranslationdata,
}) => {
  const [surah, setSurah] = useState(1);
  const [Qari, setQari] = useState("ar.abdurrahmaansudais");
  const [currentSurahAudio, setCurrentSurahAudio] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Track whether the audio is playing
  const [userInteracted, setUserInteracted] = useState(false); // Track user interaction
  const [translator, setTranslator] = useState("ur.najafi");

  const router = useRouter();
  useEffect(() => {
    if (surah && Qari && translator) {
      router.push(`?s=${surah}&q=${Qari}&t=${translator}`);
    }
  }, [surah, Qari, translator]);

  const playNextAyah = () => {
    if (currentAyahIndex < audioData.data.ayahs.length - 1) {
      setCurrentAyahIndex((prevIndex) => prevIndex + 1);
    }
  };

  const audioEnded = () => {
    // Play the next ayah when current ayah ends
    playNextAyah();
  };

  useEffect(() => {
    if (userInteracted && isPlaying) {
      if (
        currentAyahIndex >= 0 &&
        currentAyahIndex < audioData.data.ayahs.length
      ) {
        const currentAyah = audioData.data.ayahs[currentAyahIndex];
        setCurrentSurahAudio(currentAyah.audio);
      }
    }
  }, [currentAyahIndex, audioData, userInteracted, isPlaying]);

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    setUserInteracted(true);
  };
  const handleStopButtonClick = () => {
    setIsPlaying(false);
  };
  if (textData && singleData) {
    return (
      <div className="every">
        
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="surah">Choose Surah:</label>
          <select
            className="w-[200px] bg-transparent border-2 rounded-full text-center border-solid border-white "
            style={arabic.style}
            onChange={(e) => {
              e.preventDefault();
              setSurah(e.target.value);
            }}
          >
            {textData.data?.map((surah, index) => {
              return (
                <option
                  className="text-gray-500"
                  key={index}
                  value={surah.number}
                >
                  {surah.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-row justify-center items-center gap-[20px]">
          <div className="flex flex-col items-center justify-center mt-5">
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="surah">Choose Qari:</label>
              <select
                className="w-[150px] mb-4 bg-transparent border-2 rounded-full text-center border-solid border-white "
                style={arabic.style}
                defaultValue={Qari}
                onChange={(e) => {
                  e.preventDefault();
                  setQari(e.target.value);
                }}
              >
                {allnameData.data?.map((qari, index) => {
                  return (
                    <option
                      className="text-gray-500"
                      key={index}
                      value={qari.identifier}
                    >
                      {qari.englishName}
                    </option>
                  );
                })}
              </select>
            </div>

            {!isPlaying && (
              <button
                onClick={handlePlayButtonClick}
                className="play-button text-center border-white border-4 transition-all border-double w-[80px] h-[40px] rounded-xl tr"
              >
                Play
              </button>
            )}
            {isPlaying && (
              <button
                onClick={handleStopButtonClick}
                className="stop-button text-center border-white border-4 transition-all border-double w-[80px] h-[40px] rounded-xl tr"
              >
                Stop
              </button>
            )}
            {isPlaying && (
              <audio
                src={currentSurahAudio}
                autoPlay={userInteracted && isPlaying}
                onEnded={audioEnded}
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center -mt-5">
            <label htmlFor="surah">Choose Translator:</label>
            <select
              className="w-[150px] mb-4 bg-transparent border-2 rounded-full text-center border-solid border-white "
              style={arabic.style}
              defaultValue={translator}
              onChange={(e) => {
                e.preventDefault();
                setTranslator(e.target.value);
              }}
            >
              {alltranslationdata.data?.map((translator, index) => {
                return (
                  <option
                    className="text-gray-500"
                    key={index}
                    value={translator.identifier}
                  >
                    {translator.englishName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <Hero
            data={singleData.data.ayahs}
            translation={translationData.data.ayahs}
          />
        </div>
      </div>
    );
  }
};

export default index;

export async function getServerSideProps(context) {
  const search = context.query.s;
  const qari = context.query.q;
  const translator = context.query.t;

  const text = await fetch(`http://api.alquran.cloud/v1/surah`);
  const textData = await text.json();

  const single = await fetch(
    `http://api.alquran.cloud/v1/surah/${search ? search : 1}`
  );
  const singleData = await single.json();

  const translation = await fetch(
    `http://api.alquran.cloud/v1/surah/${search ? search : 1}/${
      translator ? translator : "ur.najafi"
    }`
  );
  const translationData = await translation.json();

  const audio = await fetch(
    `https://api.alquran.cloud/v1/surah/${search ? search : 1}/${
      qari ? qari : "ar.abdurrahmaansudais"
    }`
  );
  const audioData = await audio.json();

  const allaudioname = await fetch(
    `https://api.alquran.cloud/v1/edition/format/audio`
  );
  const allnameData = await allaudioname.json();

  const alltranslation = await fetch(
    `https://api.alquran.cloud/v1/edition/type/translation`
  );
  const alltranslationdata = await alltranslation.json();

  return {
    props: {
      textData,
      singleData,
      audioData,
      allnameData,
      translationData,
      alltranslationdata,
    },
  };
}
