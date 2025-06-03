import React, { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    )
}

function ImageCropper({ 
    imageUrl, 
    onCropComplete,
    onCancel
}) {
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const imgRef = useRef(null)
    const aspect = 4 / 3

    function onImageLoad(e) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, aspect))
    }

    const handleComplete = () => {
        if (!completedCrop || !imgRef.current) return

        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        canvas.width = completedCrop.width
        canvas.height = completedCrop.height

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        )

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty')
                return
            }
            onCropComplete(blob)
        }, 'image/jpeg', 0.95)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Crop Your Image</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Adjust your image to fit the 4:3 ratio for the best display in your story.
                </p>
                <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-6">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        className="max-h-[60vh]"
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imageUrl}
                            onLoad={onImageLoad}
                            className="max-w-full"
                        />
                    </ReactCrop>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleComplete}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageCropper 