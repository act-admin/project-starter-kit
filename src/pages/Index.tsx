const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      
      {/* Content */}
      <main className="relative z-10 text-center px-6 animate-fade-in">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-mono text-primary border border-primary/30 rounded-full bg-primary/5">
            Ready to build
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
          Your <span className="text-gradient">blank canvas</span>
        </h1>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto mb-8">
          Start building something amazing.
        </p>
        
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            React + TypeScript
          </span>
          <span className="text-border">•</span>
          <span>Tailwind CSS</span>
        </div>
      </main>
      
      {/* Footer hint */}
      <footer className="absolute bottom-8 text-center">
        <p className="text-xs text-muted-foreground/60 font-mono">
          Edit src/pages/Index.tsx to get started
        </p>
      </footer>
    </div>
  );
};

export default Index;
