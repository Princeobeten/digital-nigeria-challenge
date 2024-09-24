import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Cross River State Healthcare Map
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Visualizing healthcare metrics to improve maternal and infant health outcomes.
          </p>
        </header>

        <main>
          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
           <Map/>
          </div>

          <section className="mt-12 bg-white rounded-lg shadow-xl p-6">
          <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="font-semibold text-xl mb-2">Infrastructure Overview</h3>
          <p className="text-sm text-gray-600 mb-2">
            This map showcases the key infrastructure in Cross River State, including hospitals, schools, and utilities. 
            The data highlights areas of development and potential needs for improvement.
          </p>
          <p className="text-sm text-gray-600">
            Use the layer controls to filter infrastructure types and click on markers for detailed information.
          </p>
        </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-500">
          <p>&copy; 2024 Team Guru. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}