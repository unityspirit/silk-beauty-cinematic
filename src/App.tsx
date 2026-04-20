import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TheAssembly } from './components/TheAssembly';
import { Portfolio } from './components/Portfolio';
import { Journal } from './components/Journal';
import { Footer } from './components/Footer';
import { ScrollProvider } from './context/ScrollContext';
import { ScrollCanvas } from './components/ScrollCanvas';
import { PageContainer } from './components/PageContainer';

function App() {
  return (
    <ScrollProvider>
      {/* 
        We set body to overflow-hidden and absolute positioning to override 
        native scrolling. The entire experience is driven by ScrollCanvas. 
      */}
      <div className="bg-black text-on-surface w-full h-screen relative overflow-hidden selection:bg-white/20 selection:text-white touch-none">
        <ScrollCanvas />
        <Header />
        
        <main className="relative z-10 w-full h-full">
          <PageContainer index={0}>
            <Hero />
          </PageContainer>
          
          <PageContainer index={1}>
            <TheAssembly />
          </PageContainer>
          
          <PageContainer index={2}>
            <Portfolio />
          </PageContainer>
          
          <PageContainer index={3}>
            <Journal />
          </PageContainer>
        </main>

        <div className="absolute bottom-0 w-full z-10 pointer-events-none">
          <Footer />
        </div>
      </div>
    </ScrollProvider>
  );
}

export default App;
