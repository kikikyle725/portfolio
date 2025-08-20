export default function Projects() {
  const projectList = [
    { name: "Weather App", description: "A React app that shows live weather forecasts.", link: "#" },
    { name: "Portfolio Website", description: "This personal website built with React and Tailwind.", link: "#" },
    { name: "Math Solver", description: "A tool to solve applied math problems online.", link: "#" },
  ];

  return (
    <section id="projects" className="py-20 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {projectList.map((proj) => (
          <div key={proj.name} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{proj.name}</h3>
            <p className="text-gray-600 mb-4">{proj.description}</p>
            <a href={proj.link} className="text-blue-500 hover:underline">View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}
