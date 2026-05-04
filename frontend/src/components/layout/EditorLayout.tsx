interface EditorLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  panel: React.ReactNode;
  canvas: React.ReactNode;
  canvasBottomBar: React.ReactNode;
}


function EditorLayout({ header, sidebar, panel, canvas, canvasBottomBar }: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b border-border-main flex items-center px-4">{header}</header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border-main bg-social-bg overflow-y-auto">{sidebar}</aside> 
        <section className="w-80 border-r border-border-main p-4 overflow-y-auto">{panel}</section>
        <main className="flex-1 flex flex-col relative bg-bg-main">
          <div className="flex-1 overflow-auto relative">
            {canvas}
          </div>
          <footer className="h-10 border-t border-border-main px-4 flex items-center bg-code-bg">
            {canvasBottomBar}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default EditorLayout;
