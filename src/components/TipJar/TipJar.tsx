import {CardProps, CardType, SocialCard} from "../Card/Card";
import {useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import React from "react";
import {useParams} from "react-router-dom";

const TIP_JARS: CardProps[] = [
    {
        name: 'pitiunited',
        slogan: 'USE LESS SHIT️',
        sloganColor: '#ffffff',
        sloganFontSize: 54,
        sloganTextShadow: true,
        sloganTextShadowColor: '#000000',
        mainImage: 'https://uselessshit.co/images/avatar-2.gif',
        backgroundImage: 'https://uselessshit.co/images/purple-wave.gif',
        backgroundImageSize: 100,
        type: CardType.Sticker,
        footer: 'https://uselessshit.co/tip-jar/pitiunited',
        footerFontSize: 10,
        footerColor: '#ffffff',
        cardWidth: 4,
        cardHeight: 4,
        backgroundPositionX: 0,
        backgroundPositionY: 0,
        primaryImageFormatWidth: 1,
        primaryImageFormatHeight: 1,
        secondaryImageFormatWidth: 1,
        secondaryImageFormatHeight: 1,
        qrCodeSize: 96,
        lineHeight: 0.75,
        lnurl: 'LNURL1DP68GURN8GHJ7AMPD3KX2AR0VEEKZAR0WD5XJTNRDAKJ7TNHV4KXCTTTDEHHWM30D3H82UNVWQHKVATJD9HH2UMRDP5KUCFJXYKXPQQQ',
        latestBlockColor: '#000000'
    },
    {
        name: 'lukeonchain',
        slogan: 'USE LESS SHIT',
        sloganColor: '#ffffff',
        sloganFontSize: 50,
        sloganTextShadow: true,
        sloganTextShadowColor: '#000000',
        // mainImage: null,
        mainImage: 'https://uselessshit.co/images/lukeonchain-avatar.gif',
        backgroundImage: 'https://uselessshit.co/images/lukeonchain-splash.gif',
        backgroundImageSize: 100,
        type: CardType.Sticker,
        footer: 'lukeonchain@getalby.com',
        footerFontSize: 10,
        footerColor: '#ffffff',
        cardWidth: 3.5,
        cardHeight: 3.5,
        backgroundPositionX: 231,
        backgroundPositionY: 0,
        primaryImageFormatWidth: 1,
        primaryImageFormatHeight: 1,
        secondaryImageFormatWidth: 1,
        secondaryImageFormatHeight: 1,
        qrCodeSize: 96,
        lineHeight: 0.75,
        lnurl: 'lukeonchain@getalby.com',
        latestBlockColor: '#000000'
    }
];

export const TipJar = () => {

    const [props, setProps] = useState<CardProps>();

    const { username } = useParams();

    useEffect(() => {
        if (username) {
            const tipJar = TIP_JARS.find(jar => jar.name === username);
            if (tipJar) {
                setProps(tipJar)
            }
        }
    }, []);

  return (
      <React.Fragment>
          <Helmet>
              <title>{username}'s tip jar - UseLessShit.co</title>
          </Helmet>
          { props && <SocialCard
              slogan={props.slogan}
              sloganColor={props.sloganColor}
              sloganFontSize={props.sloganFontSize}
              sloganTextShadow={props.sloganTextShadow}
              sloganTextShadowColor={props.sloganTextShadowColor}
              mainImage={props.mainImage}
              backgroundImage={props.backgroundImage}
              backgroundImageSize={props.backgroundImageSize}
              type={props.type}
              footer={props.footer}
              footerColor={props.footerColor}
              footerFontSize={props.footerFontSize}
              cardWidth={props.cardWidth}
              cardHeight={props.cardHeight}
              backgroundPositionX={props.backgroundPositionX}
              backgroundPositionY={props.backgroundPositionY}
              primaryImageFormatWidth={props.primaryImageFormatWidth}
              primaryImageFormatHeight={props.primaryImageFormatHeight}
              secondaryImageFormatWidth={props.secondaryImageFormatWidth}
              secondaryImageFormatHeight={props.secondaryImageFormatHeight}
              lineHeight={props.lineHeight}
              lnurl={props.lnurl}
              qrCodeSize={props.qrCodeSize}
              latestBlock={props.latestBlock}
              latestBlockColor={props.latestBlockColor}
          />

          }
      </React.Fragment>
  )
};