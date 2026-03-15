console.log("Editor loaded!");

function handleImageUpload(event) {
    const files = event.target.files;
    const timeline = document.querySelector('.timeline-controls');

    // Har select ki gayi file ke liye
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            // Har image ke liye ek visual thumbnail bana rahe hain
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.margin = '5px';
            img.style.border = '1px solid #fff';
            img.style.cursor = 'pointer';

            // Timeline mein image daal di
            timeline.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}
