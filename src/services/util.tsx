import { nip19 } from 'nostr-tools';
import {keywordsFromString} from "../components/Nostr/Feed/Feed";

export const processText = (text: string, tags?: string[][], searchString?: string, kind?: number): string => {
    let replacedText = text
        // links
            .replace(/(?<!\]\()(https?:\/\/(?![^" \n]*(?:jpg|jpeg|png|gif|svg|webp|mov|mp4))[^" \n\(\)]+)(?<!\))/gm, '<a class="test-0" href="$1" target="_blank">$1</a>')
            // .replace(/^(?!\[).*(http?:\/\/(?![^" \n]*(?:jpg|jpeg|png|gif|svg|webp|mov|mp4))[^" \n]+).*(?<!\))/gm, '<a href="$1" target="_blank">$1</a>')
            // images
            .replace(/(?<!\]\()(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)).*(?<!\))/gm, '<img width="100%" src="$1" style="max-width:512px;" />')
            // markdown
            // images
            .replace(/!(\[(?<text>[^(]+)]\((?<url>[^")]+))\)/gm, (result, _, text, url) => {
                return `<img src=${url} style="max-width:512px;" alt="${text}" />`;
            })
            // urls
            .replace(/(\[(?<text>[^(]+)]\((?<url>[^")]+))\)/gm, (result, _, text, url) => {
                return `<a class="test" href=${url} target="_blank">${text}</a>`;
            })
            .replace(/(<!--(?<comment>[^-->]*)-->)/gm, '')
            // .replace(/((?<!\d+\..+\n)\d+\. (?<orderedListFirstItem>.+)\n)/gm, '<ol><li>$1</li>')
            // .replace(/((?<=\d+\..+\n)\d+\. (?<orderedListMiddleItem>.+)\n(?=\d+\.))/gm, '<li>$1</li>')
            // .replace(/(\d+\. (?<orderedListLastItem>.+)\n(?!\d+\.))/gm, '<li>$1</li></ol>')
            // .replace(/((?<!-.\n)- (?<unorderedListFirstItem>.+)\n)|((?<=-.\n)- (?<unorderedListMiddleItem>.+)\n(?=-))|(- (?<unorderedListLastItem>.+)(?!-))/gm, (result, g1, g2, g3) => {
            //     console.log({result, g1, g2, g3})
            //     return result;
            // })
            .replace(/\*\*\*(?<boldAndItalic>[^*]*)\*\*\*/gm, '<b><i>$1</i></b>')
            .replace(/(\*\*(?<bold>[^*]*)\*\*)/gm, '<b>$1</b>')
            .replace(/\*(?<italic>[^*]*)\*/gm, '<i>$1</i>')
            .replace(/~~(?<strikethrough>[^~]*)~~/gm, '<s>$1</s>')
            .replace(/`{3}(?<multilineCode>[^§]+)`{3}/gm, '<pre>$1</pre>')
            // .replace(/`(?<inlineCode>[^`\n]*)`/gm, '<code>$1</code>')
            // .replace(/\`(?:[^\`||\s]+)\`/gm, '<code>$1</code>')
            .replace(/(?<=^\n)> (?<singleLineQuote>.+)\n(?!^>)/gm, '<blockquote>$1</blockquote>')
        .replace(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g, '<button class="video-btn">$1</button>')
        .replace(/(https?:\/\/.*\.(?:mov|mp4))/g, '<button class="video-btn">$1</button>')
        // .replace(/(\n+)/, '$1<br/>')
        .replace(/\n/g, '<br/>')
        .replace(/nostr:npub1([a-z0-9]+)/g, (result) => {
            const npub = result.split(':')[1];
            return `<button class="metadata-btn">${npub}</button>`;
        })
        .replace(/nostr:note1([a-z0-9]+)/g, (result) => {
            const note1 = result.split(':')[1];
            const id = nip19.decode(note1).data;
            const nevent = nip19.neventEncode({ id });
            return `<button class="thread-btn">${nevent}</button>`;
        })
        .replace(/nostr:nevent1([a-z0-9]+)/g, (result) => {
            const nevent = result.split(':')[1];
            return `<button class="thread-btn">${nevent}</button>`;
        })
        // .replace(new RegExp(`\n(&gt;|\\>)(.*)`, "g"), '<blockquote>$1</blockquote>')
    ;

    if (searchString && searchString !== '' && searchString.length > 2) {
        const keywords = keywordsFromString(searchString);
        const expression = `(${keywords.join('|')})`;
        replacedText = replacedText
            .replace(new RegExp(expression, 'gmi'), '<strong>$1</strong>')
    }

    return replacedText
    // @ts-ignore
        .replace(/#\[([0-9]+)\]/g, (placeholder) => {
            const match = placeholder.match(/(\d+)/);
            if (match) {
                const id = match[0];
                const tag = tags && tags[+id];
                if (tag) {
                    switch (tag[0]) {
                        case 'p': {
                            return `<button class="metadata-btn">${nip19.npubEncode(tag[1])}</button>`;
                        }
                        case 'e': {
                            return `<a href="${process.env.BASE_URL}/e/${nip19.noteEncode(tag[1])}" target="_blank">@${nip19.noteEncode(tag[1])}</a>`
                        }
                        case 't': {
                            return `<a href="${process.env.BASE_URL}/?s=${tag[1].replace(/(<([^>]+)>)/gi, '')}">#${tag[1]}</a>`;
                        }
                    }
                }
                // @ts-ignore
                return tags && tags[+id];
            }
        })
        .replace(/\B(\#[a-zA-Z0-9]+\b)(?!;)/g, (result) => {
            const hashtag = result.replace('#', '');
            return `<a href="${process.env.BASE_URL}/?s=${hashtag.replace(/(<([^>]+)>)/gi, '')}">#${hashtag}</a>`
        })
        .replace(/(#<a?:.+?:\d{18}>|#\p{Extended_Pictographic})/gu, (result) => {
            const hashtag = result.replace('#', '');
            console.log({hashtag})
            return `<a href="${process.env.BASE_URL}/?s=${hashtag.replace(/(<([^>]+)>)/gi, '')}">#${hashtag}</a>`
        })
        ;
};