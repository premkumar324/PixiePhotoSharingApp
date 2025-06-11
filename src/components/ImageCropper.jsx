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

        // Use the original image dimensions to maintain quality
        const pixelRatio = window.devicePixelRatio || 1
        const cropWidth = completedCrop.width * scaleX
        const cropHeight = completedCrop.height * scaleY

        // Create a high-resolution canvas
        canvas.width = cropWidth * pixelRatio
        canvas.height = cropHeight * pixelRatio
        
        // Scale the context to ensure proper rendering
        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        )

        // Convert to blob with maximum quality
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty')
                return
            }
            onCropComplete(blob)
        }, 'image/png', 1.0) // Use PNG for lossless quality
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-4 py-3 md:px-6 md:py-4 border-b border-gray-100">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">Crop Your Image</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Adjust your image to fit the 4:3 ratio for the best display in your story.
                    </p>
                </div>
                
                <div className="p-4 md:p-6">
                    <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            className="max-h-[50vh] md:max-h-[60vh]"
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imageUrl}
                                onLoad={onImageLoad}
                                className="max-w-full h-auto"
                            />
                        </ReactCrop>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white px-4 py-3 md:px-6 md:py-4 border-t border-gray-100">
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
        </div>
    )
}

export default ImageCropper 