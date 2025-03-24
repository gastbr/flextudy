import { Link } from 'react-router';
import Button from '../components/ui/Button';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Streamline Your Educational Experience
              </h1>
              <p className="text-xl text-white/90 max-w-xl">
                A comprehensive platform for schools and academies to manage classes, 
                attendance, payments, and communication in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login">
                  <Button className="bg-white text-blue-600 hover:bg-white/90">
                    Get Started
                  </Button>
                </Link>
                <Link to="#features">
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl bg-gray-200">
                {/* Placeholder for image */}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">FCT School</span>
            </div>
            <div className="text-sm text-gray-500">
              Â© {new Date().getFullYear()} FCT School. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
