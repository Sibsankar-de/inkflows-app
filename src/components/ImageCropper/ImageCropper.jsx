import React, { useEffect, useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export const ImageCropper = ({ imageFile, onCropped }) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Create an image src from image file
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
        }
    }, [imageFile])

    // Crop handler
    useEffect(() => {
        const handleCrop = async () => {
            try {
                const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels, imageFile?.name);
                onCropped(croppedFile)
            } catch (error) {
                console.error('Crop failed:', error);
            }
        };
        handleCrop()
    }, [croppedAreaPixels])

    return (
        imageSrc &&
        <React.Fragment>
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onZoomChange={setZoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
            />
        </React.Fragment>
    )
}

function getCroppedFile(imageSrc, pixelCrop, fileName = "cropped-img.jpg") {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const file = new File([blob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });
                resolve(file);
            }, 'image/jpeg');
        };

        image.onerror = (error) => {
            reject(error);
        };
    });
}

