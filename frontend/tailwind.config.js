export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'glow-teal': '0 0 30px rgba(13,148,136,0.25)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'sidebar': 'linear-gradient(180deg, #0f172a 0%, #1a2744 100%)',
        'mesh': 'radial-gradient(at 20% 20%, rgba(13,148,136,0.10) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(124,58,237,0.07) 0px, transparent 50%)',
      }
    }
  },
  plugins: []
}
