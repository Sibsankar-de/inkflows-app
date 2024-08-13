import Compressor from "compressorjs"

export const imageCompressor = (imageFile, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        new Compressor(imageFile, {
            quality: quality,
            success(result) {
                const compressedFile = new File([result], imageFile.name, {
                    type: result.type,
                    lastModified: Date.now(),
                });
                resolve(compressedFile)
            },
            error(err) {
                reject(err);
            },
        });
    });

}