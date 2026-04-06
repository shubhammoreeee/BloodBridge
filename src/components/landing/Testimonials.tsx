import { motion } from 'framer-motion';

const stories = [
  {
    role: "Donor",
    quote: "I got the alert at 11pm. By 12:30am I'd donated and someone's surgery was saved. BloodBridge made it effortless.",
    name: "Aditya M.",
    context: "O- Donor, Mumbai",
    badge: "🩸 12 donations",
    avatar: "A"
  },
  {
    role: "Hospital",
    quote: "During a trauma emergency, we found 3 compatible donors within 8 minutes. This platform is now mandatory for our team.",
    name: "Dr. Priya Sharma",
    context: "Lilavati Hospital",
    badge: "🏥 Verified Hospital",
    avatar: "H"
  },
  {
    role: "Recipient",
    quote: "My daughter needed 4 units urgently post-delivery. Two strangers came through in under an hour. I don't have words.",
    name: "Anonymous",
    context: "New Delhi",
    badge: "❤️ Life Saved",
    avatar: "P"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[var(--bg-primary)] overflow-hidden relative">
      {/* Decorative large quotation mark */}
      <div className="absolute top-10 left-10 md:left-20 text-[200px] md:text-[300px] font-display font-black text-[var(--orange-500)] opacity-5 leading-none pointer-events-none select-none">
        "
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h3 className="text-[var(--orange-600)] text-sm font-black tracking-[0.2em] uppercase mb-4">Impact</h3>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] max-w-2xl mx-auto leading-tight">
            Real Stories from the Network
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[var(--shadow-md)] border border-[var(--border-light)] hover:shadow-[var(--shadow-lg)] transition-shadow relative group"
            >
              <div className="absolute top-6 right-6 text-[40px] text-[var(--orange-200)] font-display leading-none group-hover:text-[var(--orange-400)] transition-colors">
                "
              </div>
              
              <div className="inline-block px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-medium)] rounded-full text-[10px] font-bold text-[var(--orange-700)] uppercase tracking-widest mb-6">
                {story.role}
              </div>

              <p className="font-body text-lg text-[var(--text-primary)] leading-relaxed mb-8 font-medium">
                {story.quote}
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[var(--border-light)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--orange-400)] to-[var(--orange-600)] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {story.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{story.name}</h4>
                  <p className="text-[var(--text-muted)] text-xs font-medium">{story.context}</p>
                </div>
              </div>
              
              <div className="absolute -bottom-3 right-6 bg-white border border-[var(--border-light)] px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-[var(--text-secondary)]">
                {story.badge}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
