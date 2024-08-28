import NDK, {NDKEvent, NDKRelaySet} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";

export const signAndPublishEvent = async (
    nostrEvent: NostrEvent,
    relayUrls: string[],
    ndk: NDK,
    delay: number = 5,
    onSuccess?: () => void,
    onError?: (error: any) => void
) => {
    const event = new NDKEvent(ndk, nostrEvent);
    event.created_at = Math.floor(Date.now() / 1000) + delay;

    console.log(`signing & publishing new event`, {event});

    try {
        await ndk.assertSigner();
        await event.sign(ndk.signer!);
        await event.publish(NDKRelaySet.fromRelayUrls(relayUrls, ndk));
        onSuccess && onSuccess();

    } catch (error) {
        console.error({error});
        onError && onError(error);
    }
};

