import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="container-custom py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">CoLearnerr Blog</h1>
        <p className="text-xl text-gray-600 mb-8">Learn. Teach. Grow—Together!</p>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-8">
            Welcome to the CoLearnerr blog—a space designed for curious school learners from Classes 6 to 10, and passionate B.Tech student-tutors! Dive into fun learning tips, tech guides, teaching hacks, and real stories from our learning community.
          </p>

          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">1. Why Peer Learning Works for Class 6–10 Students</h3>
              <p className="text-gray-600">
                Learning from someone just a few years older can be super effective! Discover how B.Tech student mentors help school students understand concepts in a friendly, relatable way.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">2. Top Subjects Taught by B.Tech Tutors on CoLearnerr</h3>
              <p className="text-gray-600">
                From math tricks to science experiments and basic coding—check out the most in-demand topics school students love learning from their college mentors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. Inside CoLearnerr: A Learning Bridge Between School and College</h3>
              <p className="text-gray-600">
                See how CoLearnerr is connecting motivated school learners with skilled B.Tech students to create a unique, practical learning experience.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Tips for School Students</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">4. How to Ask Great Questions in Live Sessions</h3>
              <p className="text-gray-600">
                Not sure what to say in a 1-on-1 session? Learn how to ask questions that help you understand faster and better.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">5. Study Smarter, Not Harder: Tips from B.Tech Toppers</h3>
              <p className="text-gray-600">
                Get smart hacks directly from college students who've been through the pressure—and made it work!
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Guides for B.Tech Tutors</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">6. How to Teach School Kids (Even If You're New to It)</h3>
              <p className="text-gray-600">
                Teaching younger students is a skill! Learn how to explain clearly, use examples they understand, and keep sessions fun and engaging.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">7. Building Your Tutor Profile on CoLearnerr</h3>
              <p className="text-gray-600">
                Want more bookings? Here's how to make your tutor profile stand out with the right description, skills, and demo session.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Platform Tips & Support</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">8. Booking, Rescheduling & Refunds – How It All Works</h3>
              <p className="text-gray-600">
                Learn how to schedule sessions, what to do if a session is missed, and how our support system helps both students and tutors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">9. Online Safety for Students & Tutors</h3>
              <p className="text-gray-600">
                We take safety seriously! Know how CoLearnerr keeps you secure during sessions and what you should avoid sharing online.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Want to Share Your Story?</h2>
            <p className="text-gray-600 mb-4">
              If you're a Class 6–10 student who loved a session, or a B.Tech tutor with tips and success stories—we'd love to feature you.
            </p>
            <p className="text-gray-600">
              Email us at <a href="mailto:blog@colearnerr.in" className="text-blue-600 hover:underline">blog@colearnerr.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 