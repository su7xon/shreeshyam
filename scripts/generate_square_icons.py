from PIL import Image
import os

def create_padded_icon(source_path, target_size):
    # Load source image
    img = Image.open(source_path)
    
    # Target size is a square (e.g. 512 or 192)
    canvas_size = target_size
    
    # Create white canvas
    canvas = Image.new("RGB", (canvas_size, canvas_size), "white")
    
    # Calculate scaled size of the logo to fit in the safe zone
    # Safe zone is 65% of the total width
    target_width = int(canvas_size * 0.65)
    scale_factor = target_width / img.width
    target_height = int(img.height * scale_factor)
    
    # Resize the logo
    resized_logo = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Paste centered
    x_offset = (canvas_size - target_width) // 2
    y_offset = (canvas_size - target_height) // 2
    canvas.paste(resized_logo, (x_offset, y_offset))
    
    return canvas

def main():
    source = 'public/mobileeee - new.jpeg'
    if not os.path.exists(source):
        print(f"Error: {source} not found")
        return
        
    print("Generating square PWA icons with safe padding...")
    
    # Generate 512x512 icon
    icon_512 = create_padded_icon(source, 512)
    icon_512.save('public/icon-512.png', 'PNG')
    print("Generated public/icon-512.png")
    
    # Generate 192x192 icon
    icon_192 = create_padded_icon(source, 192)
    icon_192.save('public/icon-192.png', 'PNG')
    print("Generated public/icon-192.png")

if __name__ == "__main__":
    main()
