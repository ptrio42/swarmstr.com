import {useEffect, useState} from "react";
import {nip19} from "nostr-tools";
import {List, LISTS} from "../stubs/lists";
import {uniq} from "lodash";

export const matchString = (searchString: string, phrase: string) => {
  const regEx = new RegExp(searchString.toLowerCase(), 'g');
  return phrase
      .toLowerCase()
      .match(regEx);
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export const getPeopleInvolvedInNostr = () => {
  return LISTS[0];
};

const getPubkeysCount = (list: List): number => {
  const pubkeys = uniq(Object.values(list).flat(1).map(v => v[1])).filter(v1 => !!v1);
  return pubkeys.length;
};

export const listToMarkup = (list: List): string[] => {
  const markup = Object.keys(list)
      .map((k, i) => [`#### ${k}`, ...Object.values(list)[i].map(v => ([`${v[1]}:${v[1] && nip19.decode(v[1]).data}:${v[0]}`, v[2]]))])
      .flat(2);

  markup.splice(2, 0, `#### Currently ${getPubkeysCount(list)} pubkeys listed.`);
  return markup;
};

export const listToNote = (list: List) => {
  const content = Object.keys(list)
      .map((k, i) => [`${k}\n`, ...Object.values(list)[i].map(v => ([`${v[0]} - @${v[1]}`, v[2] && v[2].replace('https://', '') + '\n']))])
      .flat(2)
      .join('\n');
  return content;
};