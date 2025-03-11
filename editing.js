document.addEventListener('DOMContentLoaded', function () {
    const image = document.getElementById('image');
    const controls = document.querySelectorAll('input[type="range"]');
    const rotateLeftButton = document.getElementById('rotate-left');
    const rotateRightButton = document.getElementById('rotate-right');
    const cropButton = document.getElementById('crop');
    const resetButton = document.getElementById('reset');
    const imageInput = document.getElementById('upload');
    const resizeSlider = document.getElementById('resize-slider');
    const imageContainer = document.querySelector('.image-container');
    const removeBgButton = document.getElementById('remove-bg');
    
    // Background selection elements
    const backgroundToggle = document.getElementById('background-toggle');
    const backgroundBox = document.getElementById('background-options');
    const backgroundOptions = document.querySelectorAll('.background-option');

    let rotation = 0;
    let cropper;
    let originalSrc = image ? image.src : '';

    if (image) {
        // Apply filter updates
        controls.forEach(control => {
            control.addEventListener('input', updateFilters);
        });

        rotateLeftButton.addEventListener('click', function () {
            rotation -= 45;
            updateTransform();
        });

        rotateRightButton.addEventListener('click', function () {
            rotation += 45;
            updateTransform();
        });

        cropButton.addEventListener('click', function () {
            if (cropper) {
                const croppedCanvas = cropper.getCroppedCanvas();
                image.src = croppedCanvas.toDataURL('image/png');
                cropper.destroy();
                cropper = null;
            } else {
                cropper = new Cropper(image, {
                    aspectRatio: NaN,
                    viewMode: 1,
                });
            }
        });

        resetButton.addEventListener('click', resetFilters);

        function updateFilters() {
            const brightness = document.getElementById('brightness').value;
            const contrast = document.getElementById('contrast').value;
            const grayscale = document.getElementById('grayscale').value;
            const blur = document.getElementById('blur').value;

            image.style.filter = `
                brightness(${brightness}%) 
                contrast(${contrast}%) 
                grayscale(${grayscale}%) 
                blur(${blur}px)
            `;
        }

        function updateTransform() {
            const scaleValue = resizeSlider.value / 100; 
            image.style.transform = `scale(${scaleValue}) rotate(${rotation}deg)`;
        }

        function resetFilters() {
            image.src = originalSrc;
            document.getElementById('brightness').value = 100;
            document.getElementById('contrast').value = 100;
            document.getElementById('grayscale').value = 0;
            document.getElementById('blur').value = 0;
            
            resizeSlider.value = 100;
            rotation = 0;

            if (cropper) {
                cropper.destroy();
                cropper = null;
            }

            image.style.width = 'auto';
            image.style.height = 'auto';
            image.style.transform = 'scale(1) rotate(0deg)';
            updateFilters();
            updateTransform();
        }

        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    image.src = e.target.result;
                    imageContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        resizeSlider.addEventListener('input', updateTransform);

        // 🔹 Background Removal Feature
        removeBgButton.addEventListener('click', () => {
            if (!image || !image.src) {
                alert('Please upload an image first.');
                return;
            }

            fetch(image.src)
                .then(response => response.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append('image_file', blob);
                    formData.append('size', 'auto');

                    return fetch('https://api.remove.bg/v1.0/removebg', {
                        method: 'POST',
                        headers: { 'X-Api-Key': 'ruTBdw7oc5LAskceM4u5wujD' },
                        body: formData,
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Background removal failed.');
                    }
                    return response.blob();
                })
                .then(imageBlob => {
                    image.src = URL.createObjectURL(imageBlob);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while processing the image.');
                });
        });

       // 🔹 Background Selection Box Functionality (Fixed)
if (!backgroundToggle || !backgroundBox || backgroundOptions.length === 0 || !imageContainer) {
        console.error('Error: One or more background elements are missing.');
        return;
    }

    // 🔹 Toggle background selection box
    backgroundToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent immediate closing when clicking the button
        backgroundBox.style.display = (backgroundBox.style.display === 'block') ? 'none' : 'block';
    });

    // 🔹 Apply selected background
    backgroundOptions.forEach(img => {
        img.addEventListener('click', function () {
            setBackground(img.src);
            backgroundBox.style.display = 'none'; // Hide box after selection
        });
    });

    function setBackground(imgSrc) {
        imageContainer.style.backgroundImage = `url('${imgSrc}')`;
        imageContainer.style.backgroundSize = 'cover';
        imageContainer.style.backgroundPosition = 'center';
        imageContainer.style.backgroundRepeat = 'no-repeat';
        console.log('Background applied:', imgSrc); // Debugging log
    }

    // 🔹 Hide background selection box when clicking outside
    document.addEventListener('click', function (event) {
        if (
            backgroundBox.style.display === 'block' && 
            !backgroundToggle.contains(event.target) && 
            !backgroundBox.contains(event.target)
        ) {
            backgroundBox.style.display = 'none';
        }
    });
        // 🔹 Dragging Feature
        // 🔹 Dragging Feature (Fixed)
let isDragging = false;
let startX, startY, initialX, initialY;

image.addEventListener('mousedown', (e) => {
    e.preventDefault();  // Prevent unwanted selections
    isDragging = true;

    startX = e.clientX;
    startY = e.clientY;
    initialX = image.offsetLeft;
    initialY = image.offsetTop;

    image.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return; // Only move if dragging is active

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    image.style.position = 'absolute';
    image.style.left = `${initialX + dx}px`;
    image.style.top = `${initialY + dy}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    image.style.cursor = 'move';
});
};
}); 