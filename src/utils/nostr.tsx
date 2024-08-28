import {NostrEvent} from "nostr-tools";
import {NDKTag} from "@nostr-dev-kit/ndk";

export const getTagValuesFromEvent = (event: NostrEvent, tag: string) => {
    return event.tags.filter((t: NDKTag) => t[0] === tag).map((t: NDKTag) => t[1])
};