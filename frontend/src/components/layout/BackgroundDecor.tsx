/**
 * Background Decoration Component
 * 
 * Provides subtle, animated background visuals that enhance the premium feel
 * without interfering with content readability or user interactions.
 * 
 * Features:
 * - Animated gradient blobs in black/white palette
 * - Soft noise texture overlay
 * - Slow, subtle animations (20-40s cycles)
 * - Proper z-indexing (behind all content)
 * - Pointer events disabled
 * - Fully responsive
 */

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      {/* Animated blob 1 - Top Left */}
      <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob-slow"></div>
      
      {/* Animated blob 2 - Top Right */}
      <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl animate-blob-slower"></div>
      
      {/* Animated blob 3 - Bottom Left */}
      <div className="absolute -bottom-1/4 -left-1/3 w-[600px] h-[600px] bg-white/4 rounded-full blur-3xl animate-blob-slowest"></div>
      
      {/* Animated blob 4 - Bottom Right */}
      <div className="absolute -bottom-1/3 -right-1/4 w-96 h-96 bg-gray-300/5 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '5s' }}></div>

      {/* Center accent blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/2 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      ></div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      ></div>

      {/* Radial gradient vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
    </div>
  );
}



