export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center">Citizen Feedback</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Clear and transparent process.", "Much faster than physical applications.", "Easy tracking and notifications."].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-sm">“{t}”</p>
              <p className="mt-4 text-sm font-semibold">Verified Applicant</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}