const fileInput = document.querySelector("#myFile");
const formElement = document.querySelector("#upload-form");
const data = document.querySelector("#data");
const imgDisplay = document.querySelector(".img-display");
const progressWrapper = document.querySelector(".progress-wrapper");
const uploadWrapper = document.querySelector(".upload-wrapper")



let extractedText = null

progressWrapper.style.display = "none"
imgDisplay.style.display = "none"



async function createPdf(extractedText) {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([750, 400]);
    page.moveTo(0, 300);
    page.drawText(extractedText);
    
    
    //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });


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

const browseBtn = document.querySelector("#browse")


formElement.addEventListener("submit", (e) => {
    e.preventDefault();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
})

console.log(fileInput)
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0]


    if (file) {
        progressWrapper.style.display = "block"
        imageUrl = URL.createObjectURL(file);
        imageSelected = true
        Tesseract.recognize(
            file,
            'eng', // Language
            {
                logger: info => console.log(info) // Log progress
            }
        ).then(({ data: { text } }) => {
           data.innerHTML = text
            createPdf(text);
        });
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

