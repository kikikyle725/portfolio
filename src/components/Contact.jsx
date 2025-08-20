export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>
      <p className="text-center text-gray-700 mb-6">Feel free to reach out via email or connect on LinkedIn!</p>
      <div className="flex justify-center space-x-6">
        <a href="mailto:kyle@example.com" className="text-white bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition">Email</a>
        <a href="https://linkedin.com/in/kyle-nguyen" target="_blank" className="text-white bg-blue-700 px-6 py-3 rounded-lg hover:bg-blue-800 transition">LinkedIn</a>
      </div>
    </section>
  );
}
