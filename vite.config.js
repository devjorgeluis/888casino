import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: {
        host: '0.0.0.0',
        allowedHosts: ['all'],
      },
    }
  } else {
    return {
      plugins: [react()],
    }
  }
})