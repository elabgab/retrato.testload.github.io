<?php
if (isset($_POST['upload-btn']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $uploadFile = $uploadDir . basename($_FILES['image']['name']);

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
        $uploadedImage = $uploadFile;
    } else {
        $error = "Image upload failed.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Picture Editor</title>
    <link rel="stylesheet" href="editin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css">

    
    <style>
.background-grid {
    display: flex;
    flex-direction: column; /* Arrange images in a single column */
    gap: 10px; /* Space between images */
    padding: 10px;
    width: 100%; /* Ensure it takes full width */
}

.background-option {
    width: 100%; /* Fit container width */
    max-width: 100%; /* Prevent overflow */
    height: auto; /* Keep aspect ratio */
    border-radius: 8px; /* Optional: Rounded corners */
    border: 2px solid #ddd; /* Light border */
    object-fit: contain; /* Ensures the whole image fits inside without being cropped */
    background-size: contain; /* Fit within the container without cutting */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Prevent tiling */
    transition: transform 0.2s ease-in-out;
}

.background-option:hover {
    transform: scale(1.05); /* Slight zoom effect */
    border-color: #666; /* Darker border on hover */
}

    </style>

</head>
<body>
    <div class="sidebar">
        <div class="logo-name">
            <div class="logo-image">
                <img src="icon.png" alt="Logo">
            </div>
            <span class="logo_name">Self-shoot</span>
        </div>

        <div class="controls">
            <form method="post" enctype="multipart/form-data">
                <input type="file" name="image" id="upload" accept="image/*" required>
                <button type="submit" name="upload-btn">Upload Image</button>
            </form>
        <div id="adjust-controls">
            <label for="brightness">Brightness:</label>
            <input type="range" id="brightness" min="0" max="200" value="100">

            <label for="contrast">Contrast:</label>
            <input type="range" id="contrast" min="0" max="200" value="100">

            <label for="grayscale">Grayscale:</label>
            <input type="range" id="grayscale" min="0" max="100" value="0">
            
            <label for="blur">Blur:</label>
            <input type="range" id="blur" min="0" max="10" value="0">

            <label for="resize-slider">Resize:</label>
            <input type="range" id="resize-slider" min="0" max="200" value="100">
        </div>
            <button id="toggles-controls">Hide Controls: </button>
            <div class="rotate-controls">
                <button type="button" id="rotate-left"><i class="fas fa-undo-alt"></i></button>
                <button type="button" id="rotate-right"><i class="fas fa-redo-alt"></i></button>
            </div>
            

            <button type="button" id="crop"><i class="fas fa-crop-alt"></i> Crop</button>
            <button type="button" id="remove-bg"><i class="fas fa-eraser"></i> Remove Background</button>
            <button type="button" id="reset">Reset</button>

            <div class="background-dropdown">
                <button type="button" id="background-toggle"><i class="fas fa-bars"></i> Background</button>
                    <div id="background-options" class="background-box">
                        <div class="background-grid">
                        <img src="../CALLE CRISOLOGO.png" alt="Background 3" class="background-option">

                                <img src="../editing/10000-Roses-Cebu-4.jpg" alt="Background 1" class="background-option">
                                <img src="../editing/70589415-4617-4205-804f-210fbb296933.jpg" alt="Background 2" class="background-option">
                                <img src="../editing/calle-crisologo.jpg" alt="Background 3" class="background-option">
                                <img src="../editing/kayangan-lake-coron-island-1080P-wallpaper.jpg" alt="Background 4" class="background-option">

                                
                        </div>
                    </div>
            </div>

        </div>
    </div>

    <main>
        <div class="container">
            <h1>Picture Editor</h1>
            <button id="save">Want to Save your Photo? </button>
            <div class="image-container">
                
                <?php if (isset($uploadedImage)): ?>
                    <img id="image" src="<?php echo $uploadedImage; ?>" alt="Uploaded Image">
                <?php elseif (isset($error)): ?>
                    <p class="error"><?php echo $error; ?></p>
                <?php endif; ?>
            </div>
        </div>
    </main>


  








    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
    
    <script src="editing.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const adjustmentControls = document.getElementById('adjust-controls');
            const toggleAdjustmentsButton = document.getElementById('toggles-controls');

            toggleAdjustmentsButton.addEventListener('click', function () {
                if (adjustmentControls.classList.contains('hidden')) {
                    adjustmentControls.classList.remove('hidden');
                    toggleAdjustmentsButton.textContent = 'Hide Adjustments';
                } else {
                    adjustmentControls.classList.add('hidden');
                    toggleAdjustmentsButton.textContent = 'Show Adjustments';
                }
            });
        });
    </script>

        <script>
            document.addEventListener('DOMContentLoaded',function () {
        const downloadButton = document.getElementById('save');

        downloadButton.addEventListener('click', function(){
            if(confirm('Do you want to continue with the the booking? ')){
                window.open('../index1.php', '_blank');
            }
        });
});

        </script>





</body>
</html>
