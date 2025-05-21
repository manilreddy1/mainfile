
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Academics",
    description: "Get help with math, science, languages, and more from qualified tutors.",
    list: [
      "One-on-one tutoring in all major subjects",
      "Homework help and exam preparation",
      "Flexible scheduling to fit your needs",
      "Affordable pricing for students"
    ],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80",
    bgColor: "bg-blue-50"
  },
  {
    title: "Skills",
    description: "Learn practical skills like coding, design, music, and more from industry professionals.",
    list: [
      "Project-based learning for real-world skills",
      "Portfolio development and career guidance",
      "Learn at your own pace with flexible sessions",
      "Connect with professionals in your field"
    ],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    bgColor: "bg-green-50"
  }
];

const FeaturesSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Learn on CoLearnerr</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform offers two main categories for learning, each with different focuses and pricing structures.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden ${feature.bgColor} shadow-lg`}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`p-8 md:p-12 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-700 mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.list.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''} h-64 md:h-auto`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
