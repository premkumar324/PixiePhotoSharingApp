import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';


export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        initialValue={defaultValue}
        init={{
            height: 500,
            menubar: true,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'emoticons'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media link emoticons | help',
            content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
            skin: 'oxide',
            toolbar_mode: 'sliding',
            branding: false,
            resize: false,
            statusbar: true,
            file_picker_types: 'image',
            automatic_uploads: true,
            images_upload_handler: async function (blobInfo) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blobInfo.blob());
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject('Error: ' + error);
                });
            }
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}

