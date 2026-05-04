interface EditorLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  panel: React.ReactNode;
  canvas: React.ReactNode;
  footer: React.ReactNode;
  panelWidth: number;
  onResizeStart: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export default function EditorLayout({ 
  header, 
  sidebar, 
  panel, 
  canvas, 
  footer, 
  panelWidth, 
  onResizeStart 
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-bg-main text-text-main">
      
      <header className="h-[72px] flex-shrink-0 border-b border-border-main flex items-center px-3 z-30 bg-bg-main">
        {header}
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        <aside className="w-[72px] flex-shrink-0 border-r border-border-main flex flex-col items-center py-2 gap-4 bg-bg-main z-20">
          {sidebar}
        </aside>

        <aside 
          style={{ width: `${panelWidth}px` }} 
          className="relative flex-shrink-0 border-r border-border-main bg-bg-main z-10"
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {panel}
          </div>


          <div 
            onPointerDown={onResizeStart}
            className="absolute top-0 right-[-4px] w-[8px] h-full cursor-col-resize hover:bg-accent/10 transition-colors group z-40"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-10 bg-border-main rounded-full border border-border-main flex flex-col items-center justify-center gap-1 group-hover:bg-accent group-hover:border-accent transition-all">
              <div className="w-0.5 h-0.5 bg-text-main/40 rounded-full" />
              <div className="w-0.5 h-0.5 bg-text-main/40 rounded-full" />
              <div className="w-0.5 h-0.5 bg-text-main/40 rounded-full" />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col relative min-w-0 bg-code-bg">
          <main className="flex-1 overflow-auto">
               {canvas}
          </main>

          <footer className="h-[50px] flex-shrink-0 border-t border-border-main bg-bg-main flex items-center px-3 text-[10px]">
            {footer}
          </footer>
        </div>

      </div>
    </div>
  );
}
