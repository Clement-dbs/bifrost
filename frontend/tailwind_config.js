tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Syne', 'sans-serif'],
            body: ['DM Sans', 'sans-serif'],
            mono: ['DM Mono', 'monospace'],
          },
          colors: {
            night: '#0A0A0F',
            'night-2': '#111118',
            'night-3': '#1A1A24',
            'night-4': '#24243A',
            aurora: '#6C63FF',
            'aurora-light': '#9B95FF',
            frost: '#38BDF8',
            ember: '#FB923C',
            jade: '#34D399',
            rose: '#F472B6',
            mist: '#94A3B8',
            'mist-dim': '#475569',
          },
          boxShadow: {
            'aurora': '0 0 30px rgba(108, 99, 255, 0.15)',
            'aurora-lg': '0 0 60px rgba(108, 99, 255, 0.2)',
            'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }
        }
      }
    }