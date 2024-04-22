import NDK, {NDKEvent, NDKRelaySet, NostrEvent} from "@nostr-dev-kit/ndk";

export const signAndPublishEvent = async (nostrEvent: NostrEvent, relayUrls: string[], ndk: NDK) => {
    const event = new NDKEvent(ndk, nostrEvent);
    event.created_at = Math.floor(Date.now() / 1000) + 5;

    console.log(`signing & publishing new event`, {event});

    try {
        await ndk.assertSigner();
        await event.sign(ndk.signer!);
        await event.publish(NDKRelaySet.fromRelayUrls(relayUrls, ndk));

    } catch (error) {
        console.error({error});
    }
};

