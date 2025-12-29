import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import base64
import os
import threading
import time
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class MediaEncryptionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🔐 CyberVault - Media Encryption Suite")
        self.root.geometry("950x750")
        self.root.configure(bg="#0f0f23")
        
        # Set window icon and properties
        self.root.resizable(True, True)
        self.root.minsize(800, 600)
        
        # Initialize variables
        self.selected_file = None
        self.password = None
        self.animation_running = False
        
        # Configure styles first
        self.configure_styles()
        
        # Create animated welcome screen
        self.show_welcome_animation()
        
        # Create main interface after animation
        self.root.after(2000, self.create_main_interface)
    
    def show_welcome_animation(self):
        """Show animated welcome screen"""
        self.welcome_frame = tk.Frame(self.root, bg="#0f0f23")
        self.welcome_frame.pack(fill="both", expand=True)
        
        # Animated title
        self.title_label = tk.Label(
            self.welcome_frame,
            text="🔐 CyberVault",
            font=("Consolas", 32, "bold"),
            fg="#e94560",
            bg="#0f0f23"
        )
        self.title_label.pack(expand=True)
        
        # Animated subtitle
        self.subtitle_label = tk.Label(
            self.welcome_frame,
            text="Initializing Security Protocols...",
            font=("Consolas", 14),
            fg="#0f4c75",
            bg="#0f0f23"
        )
        self.subtitle_label.pack()
        
        # Animated loading bar
        self.loading_frame = tk.Frame(self.welcome_frame, bg="#0f0f23")
        self.loading_frame.pack(pady=20)
        
        self.loading_canvas = tk.Canvas(
            self.loading_frame,
            width=300,
            height=6,
            bg="#1a1a2e",
            highlightthickness=0
        )
        self.loading_canvas.pack()
        
        # Start animations
        self.animate_title()
        self.animate_loading_bar()
    
    def animate_title(self):
        """Animate title with pulsing effect"""
        def pulse():
            colors = ["#e94560", "#0f4c75", "#e94560"]
            for color in colors:
                if hasattr(self, 'title_label'):
                    self.title_label.config(fg=color)
                    self.root.update()
                    time.sleep(0.3)
        
        threading.Thread(target=pulse, daemon=True).start()
    
    def animate_loading_bar(self):
        """Animate loading bar"""
        def load():
            for i in range(301):
                if hasattr(self, 'loading_canvas'):
                    self.loading_canvas.delete("all")
                    self.loading_canvas.create_rectangle(
                        0, 0, i, 6,
                        fill="#e94560",
                        outline=""
                    )
                    self.root.update()
                    time.sleep(0.005)
        
        threading.Thread(target=load, daemon=True).start()
    
    def create_main_interface(self):
        """Create main interface with fade-in effect"""
        if hasattr(self, 'welcome_frame'):
            self.welcome_frame.destroy()
        
        # Create main notebook for tabs with fade-in
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Create tabs with animations
        self.create_encrypt_tab()
        self.create_decrypt_tab()
        self.create_learning_tab()
        
        # Fade in effect
        self.fade_in_interface()
    
    def fade_in_interface(self):
        """Fade in the main interface"""
        self.notebook.configure(style='Invisible.TNotebook')
        
        def fade_in():
            for alpha in range(0, 101, 5):
                if hasattr(self, 'notebook'):
                    # Simulate fade effect by changing style
                    if alpha > 50:
                        self.notebook.configure(style='TNotebook')
                    self.root.update()
                    time.sleep(0.02)
        
        threading.Thread(target=fade_in, daemon=True).start()
    
    def configure_styles(self):
        style = ttk.Style()
        
        # Configure modern CryptoLab-inspired theme
        style.theme_use('clam')
        
        # Define CryptoLab-inspired color palette
        bg_primary = "#0f0f23"          # Deep navy background
        bg_secondary = "#1a1a2e"        # Secondary dark blue
        bg_accent = "#16213e"           # Accent blue-gray
        bg_card = "#0f3460"             # Card background blue
        fg_primary = "#e94560"          # Bright red accent
        fg_secondary = "#ffffff"        # Pure white text
        fg_accent = "#0f4c75"           # Deep blue accent
        fg_muted = "#a0a0a0"            # Muted gray text
        border_color = "#16213e"        # Border color
        
        # Configure Notebook (tabs)
        style.configure('TNotebook', 
                       background=bg_primary,
                       borderwidth=0,
                       tabmargins=[2, 5, 2, 0])
        style.configure('TNotebook.Tab',
                       background=bg_secondary,
                       foreground=fg_secondary,
                       padding=[25, 12],
                       font=('Segoe UI', 11, 'bold'),
                       focuscolor="none")
        style.map('TNotebook.Tab',
                 background=[('selected', bg_accent), ('active', bg_card)],
                 foreground=[('selected', fg_primary), ('active', fg_secondary)],
                 expand=[('selected', [1, 1, 1, 0])])
        
        # Configure Frames
        style.configure('TFrame', background=bg_primary)
        style.configure('TLabelframe', 
                       background=bg_primary,
                       foreground=fg_primary,
                       borderwidth=1,
                       relief='solid',
                       font=('Segoe UI', 10, 'bold'))
        style.configure('TLabelframe.Label',
                       background=bg_primary,
                       foreground=fg_primary,
                       font=('Segoe UI', 10, 'bold'))
        
        # Configure Labels
        style.configure('Title.TLabel', 
                       font=('Segoe UI', 20, 'bold'), 
                       foreground=fg_primary,
                       background=bg_primary)
        style.configure('Subtitle.TLabel', 
                       font=('Segoe UI', 12), 
                       foreground=fg_secondary,
                       background=bg_primary)
        style.configure('Status.TLabel',
                       font=('Segoe UI', 11),
                       foreground=fg_accent,
                       background=bg_card)
        
        # Configure Buttons
        style.configure('Modern.TButton',
                       font=('Segoe UI', 11, 'bold'),
                       foreground=fg_secondary,
                       background=fg_primary,
                       borderwidth=0,
                       relief='flat',
                       padding=[20, 10])
        style.map('Modern.TButton',
                 background=[('active', '#ff6b7a'), ('pressed', '#d63447')],
                 foreground=[('active', fg_secondary), ('pressed', fg_secondary)])
        
        style.configure('Secondary.TButton',
                       font=('Segoe UI', 10, 'bold'),
                       foreground=fg_secondary,
                       background=bg_accent,
                       borderwidth=1,
                       relief='solid',
                       padding=[15, 8])
        style.map('Secondary.TButton',
                 background=[('active', bg_card), ('pressed', bg_card)],
                 foreground=[('active', fg_primary), ('pressed', fg_primary)])
        
        # Configure Entry widgets
        style.configure('Modern.TEntry',
                       font=('Segoe UI', 12),
                       foreground=fg_secondary,
                       fieldbackground=bg_secondary,
                       borderwidth=1,
                       relief='solid',
                       insertcolor=fg_primary)
        style.map('Modern.TEntry',
                 focuscolor=[('focus', fg_primary)],
                 bordercolor=[('focus', fg_primary)])
        
        # Configure Progressbar
        style.configure('Modern.Horizontal.TProgressbar',
                       background=fg_primary,
                       troughcolor=bg_secondary,
                       borderwidth=0,
                       lightcolor=fg_primary,
                       darkcolor=fg_primary)
        
        # Invisible style for fade-in effect
        style.configure('Invisible.TNotebook', 
                       background=bg_primary,
                       borderwidth=0)
        style.configure('Invisible.TNotebook.Tab',
                       background=bg_primary,
                       foreground=bg_primary,
                       padding=[25, 12],
                       font=('Segoe UI', 11, 'bold'))
    
    def create_encrypt_tab(self):
        # Encryption tab
        encrypt_frame = ttk.Frame(self.notebook)
        self.notebook.add(encrypt_frame, text="🔒 Encrypt Media")
        
        # Title
        title_label = ttk.Label(encrypt_frame, text="Media to Text Encryption", style='Title.TLabel')
        title_label.pack(pady=20)
        
        # File selection frame
        file_frame = ttk.LabelFrame(encrypt_frame, text="Select Media File", padding=20)
        file_frame.pack(fill="x", padx=20, pady=10)
        
        self.encrypt_file_label = ttk.Label(file_frame, text="No file selected", style='Subtitle.TLabel')
        self.encrypt_file_label.pack(pady=5)
        
        select_btn = ttk.Button(file_frame, text="Browse Files", command=self.select_file_encrypt, style='Modern.TButton')
        select_btn.pack(pady=5)
        
        # Password frame
        password_frame = ttk.LabelFrame(encrypt_frame, text="Encryption Password", padding=20)
        password_frame.pack(fill="x", padx=20, pady=10)
        
        self.encrypt_password_entry = ttk.Entry(password_frame, show="*", font=('Segoe UI', 12))
        self.encrypt_password_entry.pack(fill="x", pady=5)
        
        # Progress frame
        progress_frame = ttk.Frame(encrypt_frame)
        progress_frame.pack(fill="x", padx=20, pady=10)
        
        self.encrypt_progress = ttk.Progressbar(progress_frame, mode='indeterminate', style='Modern.Horizontal.TProgressbar')
        self.encrypt_progress.pack(fill="x", pady=5)
        
        self.encrypt_status_label = ttk.Label(progress_frame, text="Ready to encrypt", style='Status.TLabel')
        self.encrypt_status_label.pack(pady=5)
        
        # Encrypt button
        encrypt_btn = ttk.Button(encrypt_frame, text="🔒 Encrypt to Text", command=self.encrypt_media, style='Modern.TButton')
        encrypt_btn.pack(pady=10)
        
        # Reset button for encrypt tab
        reset_encrypt_btn = ttk.Button(encrypt_frame, text="🔄 Reset", command=self.reset_encrypt_tab, style='Secondary.TButton')
        reset_encrypt_btn.pack(pady=5)
    
    def create_decrypt_tab(self):
        # Decryption tab
        decrypt_frame = ttk.Frame(self.notebook)
        self.notebook.add(decrypt_frame, text="🔓 Decrypt Media")
        
        # Title
        title_label = ttk.Label(decrypt_frame, text="Text to Media Decryption", style='Title.TLabel')
        title_label.pack(pady=20)
        
        # File selection frame
        file_frame = ttk.LabelFrame(decrypt_frame, text="Select Encrypted Text File", padding=20)
        file_frame.pack(fill="x", padx=20, pady=10)
        
        self.decrypt_file_label = ttk.Label(file_frame, text="No file selected", style='Subtitle.TLabel')
        self.decrypt_file_label.pack(pady=5)
        
        select_btn = ttk.Button(file_frame, text="Browse Text Files", command=self.select_file_decrypt, style='Modern.TButton')
        select_btn.pack(pady=5)
        
        # Password frame
        password_frame = ttk.LabelFrame(decrypt_frame, text="Decryption Password", padding=20)
        password_frame.pack(fill="x", padx=20, pady=10)
        
        self.decrypt_password_entry = ttk.Entry(password_frame, show="*", font=('Segoe UI', 12))
        self.decrypt_password_entry.pack(fill="x", pady=5)
        
        # Progress frame
        progress_frame = ttk.Frame(decrypt_frame)
        progress_frame.pack(fill="x", padx=20, pady=10)
        
        self.decrypt_progress = ttk.Progressbar(progress_frame, mode='indeterminate', style='Modern.Horizontal.TProgressbar')
        self.decrypt_progress.pack(fill="x", pady=5)
        
        self.decrypt_status_label = ttk.Label(progress_frame, text="Ready to decrypt", style='Status.TLabel')
        self.decrypt_status_label.pack(pady=5)
        
        # Decrypt button
        decrypt_btn = ttk.Button(decrypt_frame, text="🔓 Decrypt to Media", command=self.decrypt_media, style='Modern.TButton')
        decrypt_btn.pack(pady=10)
        
        # Reset button for decrypt tab
        reset_decrypt_btn = ttk.Button(decrypt_frame, text="🔄 Reset", command=self.reset_decrypt_tab, style='Secondary.TButton')
        reset_decrypt_btn.pack(pady=5)
    
    def create_learning_tab(self):
        # Learning tab
        learning_frame = ttk.Frame(self.notebook)
        self.notebook.add(learning_frame, text="📚 How to Use")
        
        # Title
        title_label = ttk.Label(learning_frame, text="Step-by-Step Guide", style='Title.TLabel')
        title_label.pack(pady=20)
        
        # Create scrolled text widget for instructions
        text_frame = ttk.Frame(learning_frame)
        text_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        instructions_text = scrolledtext.ScrolledText(text_frame, wrap=tk.WORD, font=('Segoe UI', 11))
        instructions_text.pack(fill="both", expand=True)
        
        # Add comprehensive instructions
        instructions = """
🔒 MEDIA ENCRYPTION & DECRYPTION GUIDE 🔒

═══════════════════════════════════════════════════════════════════════════════════

📋 OVERVIEW
This application allows you to encrypt video and audio files into secure text format and decrypt them back to their original form.

═══════════════════════════════════════════════════════════════════════════════════

🔐 ENCRYPTION PROCESS (Media → Text)

Step 1: Select Your Media File
• Click on the "Encrypt Media" tab
• Click "Browse Files" button
• Choose your video (.mp4, .avi, .mov) or audio (.mp3, .wav, .m4a) file
• The file path will be displayed once selected

Step 2: Set Encryption Password
• Enter a strong password in the password field
• Remember this password - you'll need it for decryption!
• Use a combination of letters, numbers, and special characters

Step 3: Start Encryption
• Click "🔒 Encrypt to Text" button
• The progress bar will show the encryption process
• Wait for the process to complete
• A text file will be saved with the same name as your media file but with .txt extension

═══════════════════════════════════════════════════════════════════════════════════

🔓 DECRYPTION PROCESS (Text → Media)

Step 1: Select Encrypted Text File
• Click on the "Decrypt Media" tab
• Click "Browse Text Files" button
• Choose the .txt file that was created during encryption
• The file path will be displayed once selected

Step 2: Enter Decryption Password
• Enter the SAME password you used for encryption
• Make sure it matches exactly (case-sensitive)

Step 3: Start Decryption
• Click "🔓 Decrypt to Media" button
• The progress bar will show the decryption process
• Wait for the process to complete
• Your original media file will be restored

═══════════════════════════════════════════════════════════════════════════════════

🛡️ SECURITY FEATURES

• AES-256 Encryption: Military-grade encryption standard
• PBKDF2 Key Derivation: Secure password-based key generation
• Base64 Encoding: Safe text representation of binary data
• Salt-based Security: Each encryption uses unique salt for added security

═══════════════════════════════════════════════════════════════════════════════════

⚠️ IMPORTANT NOTES

Password Security:
• Use strong, unique passwords
• Store passwords securely
• Lost passwords cannot be recovered!

File Management:
• Keep encrypted text files safe
• Original files are not modified during encryption
• Decrypted files are saved in the same directory as the text file

Supported Formats:
• Video: MP4, AVI, MOV, MKV, WMV
• Audio: MP3, WAV, M4A, FLAC, AAC

═══════════════════════════════════════════════════════════════════════════════════

🔧 TROUBLESHOOTING

Problem: "File not found" error
Solution: Ensure the file path is correct and file exists

Problem: "Wrong password" error
Solution: Check password spelling and case sensitivity

Problem: Encryption/Decryption takes too long
Solution: Large files take more time - be patient and don't close the application

Problem: Corrupted output file
Solution: Ensure the encrypted text file wasn't modified manually

═══════════════════════════════════════════════════════════════════════════════════

💡 TIPS FOR BEST RESULTS

1. Test with small files first to understand the process
2. Keep backup copies of important files
3. Use descriptive names for encrypted text files
4. Don't edit encrypted text files manually
5. Ensure sufficient disk space for the process

═══════════════════════════════════════════════════════════════════════════════════

🎯 EXAMPLE WORKFLOW

1. Have a video file: "my_video.mp4"
2. Encrypt it with password: "MySecurePass123!"
3. Get encrypted text file: "my_video.txt"
4. Share or store the text file safely
5. Later, decrypt "my_video.txt" with the same password
6. Get back original "my_video.mp4"

═══════════════════════════════════════════════════════════════════════════════════

Happy encrypting! 🚀
        """
        
        instructions_text.insert(tk.END, instructions)
        instructions_text.config(state=tk.DISABLED)  # Make it read-only
    
    def select_file_encrypt(self):
        file_types = [
            ("All Media", "*.mp4;*.avi;*.mov;*.mkv;*.wmv;*.mp3;*.wav;*.m4a;*.flac;*.aac"),
            ("Video files", "*.mp4;*.avi;*.mov;*.mkv;*.wmv"),
            ("Audio files", "*.mp3;*.wav;*.m4a;*.flac;*.aac"),
            ("All files", "*.*")
        ]
        
        filename = filedialog.askopenfilename(
            title="Select Media File to Encrypt",
            filetypes=file_types
        )
        
        if filename:
            self.selected_file = filename
            self.encrypt_file_label.config(text=f"Selected: {os.path.basename(filename)}")
    
    def select_file_decrypt(self):
        filename = filedialog.askopenfilename(
            title="Select Encrypted Text File",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if filename:
            self.selected_file = filename
            self.decrypt_file_label.config(text=f"Selected: {os.path.basename(filename)}")
    
    def generate_key(self, password, salt):
        """Generate encryption key from password"""
        password_bytes = password.encode()
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
        return key
    
    def encrypt_media(self):
        if not self.selected_file:
            messagebox.showerror("Error", "Please select a media file first!")
            return
        
        password = self.encrypt_password_entry.get()
        if not password:
            messagebox.showerror("Error", "Please enter a password!")
            return
        
        # Start encryption in a separate thread
        thread = threading.Thread(target=self._encrypt_worker, args=(password,))
        thread.daemon = True
        thread.start()
    
    def _encrypt_worker(self, password):
        try:
            self.encrypt_progress.start()
            self.encrypt_status_label.config(text="Reading file...")
            
            # Read the media file
            with open(self.selected_file, 'rb') as file:
                file_data = file.read()
            
            self.encrypt_status_label.config(text="Encrypting...")
            
            # Generate salt and key
            salt = os.urandom(16)
            key = self.generate_key(password, salt)
            
            # Encrypt the data
            fernet = Fernet(key)
            encrypted_data = fernet.encrypt(file_data)
            
            self.encrypt_status_label.config(text="Encoding to text...")
            
            # Encode to base64 text
            encoded_data = base64.b64encode(encrypted_data).decode('utf-8')
            
            # Create the text file content with metadata (more robust format)
            file_extension = os.path.splitext(self.selected_file)[1]
            original_filename = os.path.basename(self.selected_file)
            file_size = len(file_data)
            
            text_content = "===ENCRYPTED_MEDIA_FILE===\n"
            text_content += f"ORIGINAL_FILENAME:{original_filename}\n"
            text_content += f"ORIGINAL_EXTENSION:{file_extension}\n"
            text_content += f"ORIGINAL_SIZE:{file_size}\n"
            text_content += f"SALT:{base64.b64encode(salt).decode('utf-8')}\n"
            text_content += "===DATA_START===\n"
            text_content += f"{encoded_data}\n"
            text_content += "===DATA_END===\n"
            
            # Save to text file
            output_file = os.path.splitext(self.selected_file)[0] + "_encrypted.txt"
            with open(output_file, 'w', encoding='utf-8') as file:
                file.write(text_content)
            
            self.encrypt_progress.stop()
            self.encrypt_status_label.config(text="Encryption completed!")
            
            messagebox.showinfo("Success", f"File encrypted successfully!\nSaved as: {os.path.basename(output_file)}\nOriginal size: {file_size} bytes")
            
        except Exception as e:
            self.encrypt_progress.stop()
            self.encrypt_status_label.config(text="Encryption failed!")
            messagebox.showerror("Error", f"Encryption failed: {str(e)}")
    
    def decrypt_media(self):
        if not self.selected_file:
            messagebox.showerror("Error", "Please select an encrypted text file first!")
            return
        
        password = self.decrypt_password_entry.get()
        if not password:
            messagebox.showerror("Error", "Please enter the decryption password!")
            return
        
        # Start decryption in a separate thread
        thread = threading.Thread(target=self._decrypt_worker, args=(password,))
        thread.daemon = True
        thread.start()
    
    def _decrypt_worker(self, password):
        try:
            self.decrypt_progress.start()
            self.decrypt_status_label.config(text="Reading encrypted file...")
            
            # Read the encrypted text file with proper encoding
            with open(self.selected_file, 'r', encoding='utf-8') as file:
                content = file.read()
            
            self.decrypt_status_label.config(text="Parsing file...")
            
            # Parse the file content more robustly
            lines = content.strip().split('\n')
            
            # Verify file format
            if not lines or lines[0] != "===ENCRYPTED_MEDIA_FILE===":
                raise ValueError("Invalid encrypted file format! This doesn't appear to be a valid encrypted media file.")
            
            # Extract metadata with better error handling
            metadata = {}
            data_start_index = -1
            data_end_index = -1
            
            for i, line in enumerate(lines):
                if line.startswith("ORIGINAL_FILENAME:"):
                    metadata['filename'] = line.split(':', 1)[1]
                elif line.startswith("ORIGINAL_EXTENSION:"):
                    metadata['extension'] = line.split(':', 1)[1]
                elif line.startswith("ORIGINAL_SIZE:"):
                    metadata['size'] = int(line.split(':', 1)[1])
                elif line.startswith("SALT:"):
                    metadata['salt'] = line.split(':', 1)[1]
                elif line == "===DATA_START===":
                    data_start_index = i + 1
                elif line == "===DATA_END===":
                    data_end_index = i
                    break
            
            # Validate metadata
            required_fields = ['extension', 'size', 'salt']
            for field in required_fields:
                if field not in metadata:
                    raise ValueError(f"Missing required metadata: {field}")
            
            if data_start_index == -1 or data_end_index == -1:
                raise ValueError("Could not find data section in encrypted file!")
            
            # Extract encrypted data
            encrypted_data_lines = lines[data_start_index:data_end_index]
            encoded_data = ''.join(encrypted_data_lines)
            
            self.decrypt_status_label.config(text="Decoding data...")
            
            try:
                encrypted_data = base64.b64decode(encoded_data)
            except Exception as e:
                raise ValueError(f"Failed to decode base64 data: {str(e)}")
            
            self.decrypt_status_label.config(text="Decrypting...")
            
            # Generate key and decrypt
            try:
                salt = base64.b64decode(metadata['salt'])
                key = self.generate_key(password, salt)
                fernet = Fernet(key)
                decrypted_data = fernet.decrypt(encrypted_data)
            except Exception as e:
                raise ValueError(f"Decryption failed - wrong password or corrupted data: {str(e)}")
            
            # Verify file size
            if len(decrypted_data) != metadata['size']:
                raise ValueError(f"File size mismatch! Expected {metadata['size']} bytes, got {len(decrypted_data)} bytes")
            
            self.decrypt_status_label.config(text="Saving original file...")
            
            # Save the decrypted media file
            base_name = os.path.splitext(self.selected_file)[0]
            if base_name.endswith('_encrypted'):
                base_name = base_name[:-10]  # Remove '_encrypted' suffix
            
            output_file = base_name + "_decrypted" + metadata['extension']
            
            # Ensure we write in binary mode
            with open(output_file, 'wb') as file:
                file.write(decrypted_data)
            
            self.decrypt_progress.stop()
            self.decrypt_status_label.config(text="Decryption completed!")
            
            messagebox.showinfo("Success", 
                f"File decrypted successfully!\n"
                f"Saved as: {os.path.basename(output_file)}\n"
                f"Original filename: {metadata.get('filename', 'Unknown')}\n"
                f"File size: {len(decrypted_data)} bytes")
            
        except Exception as e:
            self.decrypt_progress.stop()
            self.decrypt_status_label.config(text="Decryption failed!")
            messagebox.showerror("Error", f"Decryption failed: {str(e)}")
    
    def reset_encrypt_tab(self):
        self.selected_file = None
        self.encrypt_file_label.config(text="No file selected")
        self.encrypt_password_entry.delete(0, tk.END)
        self.encrypt_progress.stop()
        self.encrypt_status_label.config(text="Ready to encrypt")
    
    def reset_decrypt_tab(self):
        self.selected_file = None
        self.decrypt_file_label.config(text="No file selected")
        self.decrypt_password_entry.delete(0, tk.END)
        self.decrypt_progress.stop()
        self.decrypt_status_label.config(text="Ready to decrypt")

def main():
    root = tk.Tk()
    app = MediaEncryptionApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
