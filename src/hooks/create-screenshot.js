import { useEffect, useState } from "react"
import html2canvas from "html2canvas";

const useScreenShotFromString = (string, className) => {

    const [imageFile, setImageFile] = useState(null);
    const colorOptions = ['#a7dd8a', '#d9dd8a', '#dd8a8a', "#c88add", "#968add", "#8aa8dd", "#8add97", "#92d7d0", "#d96c6c"]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {

        const handleScreenShot = async () => {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-10000px';
            container.classList.add(className)
            container.classList.add('calistoga-regular')
            const text = document.createElement('p')
            text.style.padding = '5px';
            text.innerText = string
            text.classList.add('text-break', 'mb-0', 'text-center')
            container.appendChild(text)
            document.body.appendChild(container)

            // Adjusts fontsize accordingly
            let fontsize = 100
            text.style.fontSize = `${fontsize}px`
            while (text.scrollHeight > container.clientHeight || text.scrollWidth > container.clientWidth) {
                fontsize -= 1
                text.style.fontSize = `${fontsize}px`
            }
            // container bg color
            const random = getRandomInt(0, colorOptions.length - 1)
            container.style.backgroundColor = colorOptions[random]

            const fileRandNum = Math.random() * 1000000000000000

            html2canvas(container, { logging: false })
                .then(canvas => {
                    canvas.toBlob(blob => {
                        const file = new File([blob], `generated.png${fileRandNum}`, { type: 'image/png' });
                        setImageFile(file);
                        document.body.removeChild(container);
                    })
                })
                .catch(error => {
                    console.error('Error capturing HTML content:', error);
                    document.body.removeChild(container);
                });

        };
        handleScreenShot()
    }, [string, className])

    return imageFile;
}

export { useScreenShotFromString }