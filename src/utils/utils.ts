import {MutableRefObject, Ref, useEffect, useMemo, useRef, useState} from "react";
import {nip19} from "nostr-tools";
import {List, LISTS} from "../stubs/lists";
import {uniq} from "lodash";
import {debounce} from "lodash";
import {NDKTag} from "@nostr-dev-kit/ndk";

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

export const useDebounce = (callback: any) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      // @ts-ignore
      ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
};

export const nFormatter = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find((item) => {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
};

export const containsTag = (tags: NDKTag[], tag: NDKTag): boolean => {
  return tags && tags.findIndex((t: string[]) => t[0] === tag[0] && t[1] === tag[1]) > -1
};

export const noteIsVisible = (ref: any) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
    );

    // @ts-ignore
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

export const addHighlightAt = (text: string, word: string, index: number) => {
  text = [
    text.slice(0, index),
    "<strong>", text.slice(index)
  ].join('');

  text = [
    text.slice(0, index + word.length + 8),
    "</strong>", text.slice(index + word.length + 8)
  ].join('');

  return text;
}

