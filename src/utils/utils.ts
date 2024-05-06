import React, { useEffect, useState} from "react";
import {nip19} from "nostr-tools";
import {NDKEvent, NDKTag, NostrEvent} from "@nostr-dev-kit/ndk";
import {request} from "../services/request";

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

// format amounts
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

// tags contain a specific tag
export const containsTag = (tags: NDKTag[], tag: NDKTag): boolean => {
  return tags && tags.findIndex((t: string[]) => t[0] === tag[0] && t[1] === tag[1]) > -1
};

// tags any of the given tags
export const containsAnyTag = (tags: NDKTag[], tagsToCheck: NDKTag[]): boolean => {
  return tags && tags.some((t: string[]) => tagsToCheck.findIndex((t1: string[]) => t[0] === t1[0] && t[1] === t1[1]))
};

// component is visible on the device
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

// value from a given tag
export const valueFromTag = (event: NostrEvent|NDKEvent, tag: string): string | undefined => {
  const matchingTag = event.tags.find((t: string[]) => t[0] === tag);

  if (matchingTag) return matchingTag[1];
};

// get keywords from string
export const keywordsFromString = (s: string) => {
  return s.toLowerCase().trim()
      .replace(/([-_']+)/gm, ' ').split(' ')
      .filter((word) => word.length > 1);
};

export const getRelayInformationDocument = async (url: string) => {
  const response = await request({
    url
  }, { 'Accept': 'application/nostr+json' });
  return response.data;
};

interface useMousePositionProps {
  el?: any;
}

export const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};