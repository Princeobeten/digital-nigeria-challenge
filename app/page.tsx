import Map from "@/components/Map";

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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
            <p className="text-gray-700 mb-4">
              This interactive map visualizes key healthcare metrics for Cross River State, focusing on maternal and infant health. By presenting this data in an accessible format, we aim to highlight areas for improvement and guide resource allocation.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Skilled birth attendance rates</li>
              <li>Percentage of adequately fed infants</li>
              <li>Prevalence of low birth weight</li>
            </ul>
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-500">
          <p>&copy; 2024 Team Guru. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
