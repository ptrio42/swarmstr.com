import {uploadToNostrBuild, uploadToNostrCheckMe} from "../../../services/uploadImage";
import {useState} from "react";
import {useFormik} from "formik";

enum MediaProvider {
    NostrCheckMe = 'nostrcheck.me',
    NostrBuild = 'nostr.build'
}

export const NewNote = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [mediaProvider, setMediaProvider] = useState<MediaProvider>(MediaProvider.NostrCheckMe);

    const formik = useFormik({
        // enableReinitialize: true,
        initialValues: {
            content: '',
            title: ''
        },
        onSubmit: (values) => {
            console.log(`form submit`, {values});
        }
    });

    const handleFileUpload = (event: any) => {
        const files = (event.currentTarget as HTMLInputElement).files;
        if (files && files.length > 0) {
            setLoading(true);

            let uploadFn: (file: any) => Promise<string>;

            console.log('fileupload media provider', {mediaProvider})
            switch (mediaProvider) {
                case MediaProvider.NostrBuild:
                    uploadToNostrBuild(files[0])
                        .then((url: string) => {
                            console.log('fileupload', 'uploaded', {url});
                            formik.setFieldValue('content', formik.values.content + `\n${url}`);
                            setLoading(false);
                        });
                    return;
                default:
                case MediaProvider.NostrCheckMe:
                    uploadToNostrCheckMe(files![0])
                        .then((url: string) => {
                            console.log('fileupload', 'uploaded', {url});
                            formik.setFieldValue('content', formik.values.content + `\n${url}`);
                            setLoading(false);
                        });
                    return;
            }
        }
    }
};