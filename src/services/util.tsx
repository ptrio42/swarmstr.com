import { nip19 } from 'nostr-tools';

export const processText = (text: string, tags?: string[][]): string => {
    return text
        .replace(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g, '<button class="video-btn">$1</button>')
        .replace(/(https?:\/\/(?![^" \n]*(?:jpg|jpeg|png|gif|svg|webp|mov|mp4))[^" \n]+)/g, '<a href="$1" target="_blank">$1</a>')
        .replace(/(http?:\/\/(?![^" \n]*(?:jpg|jpeg|png|gif|svg|webp|mov|mp4))[^" \n]+)/g, '<a href="$1" target="_blank">$1</a>')
        .replace(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/g, '<img width="100%" src="$1" style="max-width:512px;" />')
        .replace(/(https?:\/\/.*\.(?:mov|mp4))/g, '<button class="video-btn">$1</button>')
        // .replace(/(\n+)/, '$1<br/>')
        .replace(/\n/g, '<br/>')
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/~~(.*?)~~/g, "<i>$1</i>")
        .replace(/__(.*?)__/g, "<u>$1</u>")
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
                            return `<a href="${process.env.BASE_URL}/resources/nostr/${nip19.noteEncode(tag[1])}" target="_blank">@${nip19.noteEncode(tag[1])}</a>`
                        }
                        case 't': {
                            return `<a href="${process.env.BASE_URL}/resources/nostr?s=${tag[1]}">#${tag[1]}</a>`;
                        }
                    }
                }
                // @ts-ignore
                return tags && tags[+id];
            }
        })
        .replace(/\B(\#[a-zA-Z]+\b)(?!;)/g, (result) => {
            const hashtag = result.replace('#', '');
            return `<a href="${process.env.BASE_URL}/resources/nostr?s=${hashtag}">#${hashtag}</a>`
        })
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
        ;
};