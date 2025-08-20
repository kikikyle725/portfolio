export default function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-white text-center">
      <h2 className="text-4xl md:text-6xl font-bold mb-4">Hi, I’m Kyle</h2>
      <p className="text-lg md:text-2xl text-gray-700">A web developer & applied mathematician building awesome projects.</p>
      <a href="#projects" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
        See My Work
      </a>
    </section>
  );
}
