export const processText = (text: string): string => {
    return text
        .replace(/([0123456789abcdef]{64})/, '$1')
        .replace(/(npub[a-z0-9A-Z.:_]{59,}$)/, '<button class="metadata-btn">$1</button>')
        .replace(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i, '<img width="100%" src="$1" style="max-width:512px;" />')
        .replace(new RegExp(/^(?!\=")(https?:\/\/[^]*)/, 'g'), '<a href="$1" target="_blank">$1</a>')
        .replace(/(#### [a-zA-Z0-9\/.,&\'’?\-`@ ]*)/, '<h4>$1</h4>')
        .replace(/(#{4})/, '')
        .replace(/(\n+)/, '$1<br/>')
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/~~(.*?)~~/g, "<i>$1</i>")
        .replace(/__(.*?)__/g, "<u>$1</u>");
};