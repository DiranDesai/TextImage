const fileInput = document.querySelector("#myFile");
const formElement = document.querySelector("#upload-form");
const data = document.querySelector("#data");
const imgDisplay = document.querySelector(".img-display");
const progressWrapper = document.querySelector(".progress-wrapper");
const uploadWrapper = document.querySelector(".upload-wrapper")
const spinner = document.querySelector(".spinner-border")
const scanButton = document.querySelector(".scan-btn")
const captureBtn = document.querySelector(".capture-btn")
const video = document.getElementById('video');


spinner.style.display = "none"



let extractedText = null

progressWrapper.style.display = "none"
imgDisplay.style.display = "none"



async function createPdf(extractedText) {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([750, 600]);
    page.moveTo(0, 300);
    page.drawText(extractedText);
    

    // Save the PDF as Uint8Array
    const pdfBytes = await pdfDoc.save();
    
    // Convert Uint8Array to Blob
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob

    // Create and set up a download link
    const downloadLink = document.createElement("a")
    downloadLink.classList.add("btn-download")
    downloadLink.href = pdfUrl;
    downloadLink.innerText = "Download PDF"
    downloadLink.download = 'MyPDf.pdf'; 

    uploadWrapper.appendChild(downloadLink)

}

function downloadPDF(e){
    e.preventDefault()
    console.log(123)
}



let imageUrl = null;
let imageSelected = null

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

const browseBtn = document.querySelector("#browse")


formElement.addEventListener("submit", (e) => {
    e.preventDefault();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
})

scanButton.addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });
})

function handleImageUrl(imageData){
    // Create a new canvas to draw the image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');

    // Put the image data onto the new canvas
    tempContext.putImageData(imageData, 0, 0);

    // Convert the new canvas to a Data URL
    const imgDataUrl = tempCanvas.toDataURL('image/png');
    return imgDataUrl
}

captureBtn.addEventListener("click", () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const imgDataUrl = handleImageUrl(imageData)

    console.log(imgDataUrl)
    loadTesseract(imageData)
})

console.log(fileInput)
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0]


    if (file) {
        progressWrapper.style.display = "block"
        imageUrl = URL.createObjectURL(file);
        imageSelected = true
        loadTesseract(file)
    }

    setTimeout(() => {
        if (!imageUrl && imageSelected) {
            progressWrapper.style.display = "block"
        }
        imgDisplay.style.display = "block"
        imgDisplay.src = imageUrl
    }, 1000)

    setTimeout(() => {
        progressWrapper.style.display = "none"
    }, 1000)

})

function loadTesseract(file){
    Tesseract.recognize(
        file,
        'eng', // Language
        {
            logger: info => {
                if (info.progress == 0) {
                    spinner.style.display = "block"
                }
            }
        }
    ).then(({ data: { text } }) => {
       spinner.style.display = "none"
       data.innerHTML = text
        createPdf(text);
    });
}

