export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { 50:'#eef2ff', 100:'#e0e7ff', 500:'#6366f1', 600:'#4f46e5', 700:'#4338ca' }
      },
      backgroundImage: {
        'sidebar': 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        'hero': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'card-teal': 'linear-gradient(135deg, #0d9488, #059669)',
        'card-purple': 'linear-gradient(135deg, #7c3aed, #6366f1)',
        'card-blue': 'linear-gradient(135deg, #2563eb, #0891b2)',
        'card-rose': 'linear-gradient(135deg, #e11d48, #f59e0b)',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(99,102,241,0.08)',
        'brand': '0 4px 20px rgba(99,102,241,0.25)',
        'card': '0 2px 15px rgba(0,0,0,0.06)',
      }
    }
  },
  plugins: []
}
