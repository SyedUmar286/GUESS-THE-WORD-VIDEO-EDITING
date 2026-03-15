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

// ... aapka pehle wala sara code yahan rahega ...

// SortableJS ka initialization (File ke bilkul end mein dalein)
const timelineContainer = document.querySelector('.timeline-controls');
new Sortable(timelineContainer, {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

// Timeline ki images par click karne par preview dikhane ka logic
document.querySelector('.timeline-controls').addEventListener('click', function(e) {
    // Agar humne <img> tag par click kiya hai
    if (e.target.tagName === 'IMG') {
        const preview = document.getElementById('active-preview');
        const canvasText = document.getElementById('video-canvas');
        
        // Image ka source preview mein daal do
        preview.src = e.target.src;
        preview.style.display = 'block';
        
        // Text hata do
        canvasText.style.display = 'none';
    }
});

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function exportVideo() {
    const exportBtn = document.getElementById('export-btn');
    exportBtn.innerText = "Rendering... (Wait karein)";

    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    const images = document.querySelectorAll('.timeline-controls img');

    for (let i = 0; i < images.length; i++) {
        const fileData = await fetchFile(images[i].src);
        ffmpeg.FS('writeFile', `image${i}.png`, fileData);
    }

    // 0.5 ka matlab 2 second, aap ise badal kar duration control kar sakte hain
    await ffmpeg.run('-framerate', '0.5', '-i', 'image%d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(videoBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-video.mp4';
    a.click();

    exportBtn.innerText = "Export Video";
}
