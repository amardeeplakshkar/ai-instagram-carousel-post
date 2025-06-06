# Instagram Code Slides Generator

A powerful Next.js application that automatically generates beautiful code slides and posts them to Instagram. Built with AI-powered content generation, custom slide design, and seamless Instagram integration.

## 🚀 Features

- **AI-Powered Content Generation**: Uses OpenAI to generate educational JavaScript code slides
- **Beautiful Slide Design**: Custom-designed slides with professional terminal-style code blocks
- **Automated Image Generation**: Converts slides to high-quality PNG images using html-to-image
- **Instagram Integration**: Automatically posts generated slides as Instagram albums
- **IPFS Storage**: Uploads images to Pinata for decentralized storage
- **Real-time Progress Tracking**: Live updates on slide generation and posting status

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: OpenAI API with structured outputs
- **Image Generation**: html-to-image library
- **Instagram API**: instagram-private-api
- **Storage**: Pinata IPFS
- **Syntax Highlighting**: react-syntax-highlighter with Dracula theme

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- Instagram account credentials
- OpenAI API key
- Pinata IPFS account and JWT token

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amardeeplakshkar/instagram-code-slides-generator.git
   cd instagram-code-slides-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_API_BASE_URL=https://api.openai.com/v1

   # Instagram Credentials
   IG_USERNAME=your_instagram_username
   IG_PASSWORD=your_instagram_password

   # Pinata IPFS Configuration
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Generate Slides**: Enter a prompt describing the JavaScript concept you want to teach
2. **AI Processing**: The system generates multiple educational slides with code examples
3. **Image Generation**: Each slide is automatically converted to a high-quality image
4. **Review**: Check the generated slides and their status
5. **Post to Instagram**: Click "Post Album" to automatically upload all slides to Instagram

### Example Prompts

- "Create slides explaining JavaScript array methods"
- "Generate slides about async/await in JavaScript"
- "Make slides teaching JavaScript loops"
- "Create slides about JavaScript functions"

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/          # OpenAI integration for slide generation
│   │   └── instagram/     # Instagram posting API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main application page
├── components/
│   ├── CodeBlock.tsx     # Slide component with image generation
│   └── PostImage.tsx     # Static slide template
├── public/               # Static assets
└── README.md
```

## 🎨 Slide Design

Each generated slide features:
- **Professional gradient background** (blue to slate)
- **Brand header** with @AMARDEEP.WEBDEV
- **Large, readable title**
- **Terminal-style code block** with syntax highlighting
- **Slide numbering** for easy navigation
- **Optimized dimensions** for Instagram (3:4 aspect ratio)

## 🔒 Security Features

- Environment variable protection for sensitive credentials
- Secure API key handling
- Instagram checkpoint error handling
- CORS protection for API routes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amardeep Lakshkar**
- GitHub: [@amardeeplakshkar](https://github.com/amardeeplakshkar)
- Instagram: [@amardeep.webdev](https://instagram.com/amardeep.webdev)

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Instagram for the platform
- The open-source community for the amazing libraries used in this project

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub or reach out through Instagram.

---

⭐ If you found this project helpful, please give it a star on GitHub!